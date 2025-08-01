import { NextRequest, NextResponse } from 'next/server';
import { TelnyxCallService } from '@/lib/services/telnyx-call-service';
import { isUserAuthorized, createUnauthorizedResponse } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authorized
    const isAuthorized = await isUserAuthorized();
    if (!isAuthorized) {
      return createUnauthorizedResponse();
    }
    const { callControlId, reason = 'client_initiated' } = await request.json();

    if (!callControlId) {
      return NextResponse.json(
        { error: 'Call control ID is required' },
        { status: 400 }
      );
    }

    // Hangup the call using the service
    const result = await TelnyxCallService.hangupCall(callControlId, reason);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Hangup API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to hangup call',
        details: error.message 
      },
      { status: 500 }
    );
  }
}