import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📋 Fetching campaigns for user:", userId);

    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("campaigns")
      .orderBy("createdAt", "desc")
      .get();

    const campaigns = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Found ${campaigns.length} campaigns`);

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
