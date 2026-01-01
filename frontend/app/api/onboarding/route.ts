import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('✅ Onboarding data received:', JSON.stringify(body, null, 2));
    
    // TODO: Save to Firestore after testing
    // const { userId } = await auth();
    // await db.collection(COLLECTIONS.USERS)...
    
    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding completed!' 
    });
    
  } catch (error: any) {
    console.error('❌ Onboarding ERROR:', error);
    
    // ALWAYS return JSON - never let it crash to HTML
    return NextResponse.json(
      { error: 'Onboarding failed', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('✅ Onboarding GET request received');
    return NextResponse.json({ 
      message: 'Onboarding GET endpoint working' 
    });
  } catch (error: any) {
    console.error('❌ Onboarding GET ERROR:', error);
    return NextResponse.json(
      { error: 'Onboarding GET failed', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
