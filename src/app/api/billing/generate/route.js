import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID intervention manquant' }, { status: 400 });
    }

    const { data: intervention, error } = await supabaseAdmin
      .from('demande_devis')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !intervention) {
      return NextResponse.json({ error: 'Intervention introuvable' }, { status: 404 });
    }

    const webhookUrl = 'https://hook.eu2.make.com/2uzdmxthla7e7rajf3rk7bvd9yc3ehlg';

    const makeResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate_devis',
        source: 'highgency_crm',
        data: intervention
      }),
    });

    if (!makeResponse.ok) {
      throw new Error(`Erreur lors de l'appel à Make: ${makeResponse.statusText}`);
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur API Billing:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
