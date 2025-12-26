import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { campaignId } = await props.params;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Missing campaignId" },
        { status: 400 }
      );
    }

    // Fetch campaign from database
    const campaignSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("campaigns")
      .doc(campaignId)
      .get();

    if (!campaignSnapshot.exists) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const campaignData = campaignSnapshot.data();

    return NextResponse.json(
      {
        success: true,
        campaign: {
          id: campaignId,
          ...campaignData,
          createdAt: campaignData?.createdAt?.toDate?.() || new Date(),
          updatedAt: campaignData?.updatedAt?.toDate?.() || new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}
