import { NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/services/storage';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const profile = await request.json();
    const saved = await saveProfile('default', profile);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
