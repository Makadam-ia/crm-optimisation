import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 });
    }

    // Bloc de réservation pour l'intégration de l'API Gemini Vision
    return NextResponse.json({ success: true, status: 'pending', url: imageUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
