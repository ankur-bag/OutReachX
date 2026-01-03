import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase/admin";

async function generateCampaignMessages(userId: string, campaignId: string) {
  try {
    const campaignDoc = await db
      .collection("users")
      .doc(userId)
      .collection("campaigns")
      .doc(campaignId)
      .get();

    if (!campaignDoc.exists) {
      return [];
    }

    const campaignData = campaignDoc.data() as any;
    const messages = [];
    let messageIndex = 0;

    // Generate campaign title message (first)
    if (campaignData.title) {
      messages.push({
        id: `msg_${messageIndex}_title`,
        sender: "campaign",
        type: "text",
        content: campaignData.title,
        timestamp: new Date(Date.now() - 10000).toISOString(),
        audioUrl: undefined,
        assets: undefined,
      });
      messageIndex++;
    }

    // Generate preview message (second)
    if (campaignData.previewText || campaignData.description) {
      const descText = typeof campaignData.description === "string" 
        ? campaignData.description 
        : campaignData.description?.aiEnhanced || campaignData.description?.original || "";
      
      messages.push({
        id: `msg_${messageIndex}_preview`,
        sender: "campaign",
        type: "text",
        content: campaignData.previewText || descText || "",
        timestamp: new Date(Date.now() - 7500).toISOString(),
        audioUrl: undefined,
        assets: undefined,
      });
      messageIndex++;
    }

    // Generate audio message (third)
    if (campaignData.audioUrls?.voice) {
      messages.push({
        id: `msg_${messageIndex}_audio`,
        sender: "campaign",
        type: "audio",
        content: "🎙️ Voice message",
        timestamp: new Date(Date.now() - 5000).toISOString(),
        audioUrl: campaignData.audioUrls.voice,
        assets: undefined,
      });
      messageIndex++;
    }

    // Generate assets message (fourth)
    if (campaignData.assets?.length > 0) {
      messages.push({
        id: `msg_${messageIndex}_assets`,
        sender: "campaign",
        type: "text",
        content: `📎 ${campaignData.assets.length} file(s)`,
        timestamp: new Date(Date.now() - 2500).toISOString(),
        audioUrl: undefined,
        assets: campaignData.assets,
      });
      messageIndex++;
    }

    console.log(`📝 Generated ${messages.length} campaign messages in order: title, preview, audio, assets`);
    return messages;
  } catch (error: any) {
    console.error(`❌ Error generating campaign messages:`, error);
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string; contactId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { campaignId, contactId } = await params;

    // Get messages from Firestore
    const messagesRef = db
      .collection("users")
      .doc(userId)
      .collection("campaigns")
      .doc(campaignId)
      .collection("inbox")
      .doc("contacts")
      .collection("contacts")
      .doc(contactId)
      .collection("messages");

    let messagesSnapshot;
    try {
      messagesSnapshot = await messagesRef
        .orderBy("createdAt", "asc")
        .get();
    } catch (orderByError) {
      // Fallback: get all and sort in code
      const allDocs = await messagesRef.get();
      const sortedDocs = allDocs.docs.sort((a, b) => {
        const aTime = a.data().createdAt?.toDate?.() || new Date(a.data().createdAt || 0);
        const bTime = b.data().createdAt?.toDate?.() || new Date(b.data().createdAt || 0);
        return new Date(aTime).getTime() - new Date(bTime).getTime();
      });
      messagesSnapshot = { docs: sortedDocs };
    }

    const firestoreMessages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      sender: doc.data().sender || "user",
      type: doc.data().type || "text",
      content: doc.data().content || "",
      timestamp: doc.data().timestamp || new Date().toISOString(),
      audioUrl: doc.data().audioUrl,
      assets: doc.data().assets,
    }));

    return NextResponse.json({ messages: firestoreMessages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ messages: [] });
  }
}
