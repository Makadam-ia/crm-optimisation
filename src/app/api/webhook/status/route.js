import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_STATUS_WEBHOOK_URL;
    
    if (n8nUrl) {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          interventionId: id, 
          newStatus: status, 
          timestamp: new Date().toISOString() 
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
