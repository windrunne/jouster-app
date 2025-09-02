import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    
    // Forward query parameters to backend
    if (searchParams.get('keyword')) {
      params.append('keyword', searchParams.get('keyword')!);
    }
    if (searchParams.get('sentiment')) {
      params.append('sentiment', searchParams.get('sentiment')!);
    }
    if (searchParams.get('topic')) {
      params.append('topic', searchParams.get('topic')!);
    }
    if (searchParams.get('topics')) {
      params.append('topics', searchParams.get('topics')!);
    }
    if (searchParams.get('limit')) {
      params.append('limit', searchParams.get('limit')!);
    }

    const response = await fetch(`${BACKEND_URL}/analyses/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}
