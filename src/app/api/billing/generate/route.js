import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID intervention manquant' }, { status: 400 });
    }

    // 1. Récupération des données sécurisée via le backend
    const { data: intervention, error } = await supabaseAdmin
      .from('demande_devis')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !intervention) {
      return NextResponse.json({ error: 'Intervention introuvable' }, { status: 404 });
    }

    // 2. Transmission au système de facturation tiers (n8n webhook)
    const webhookUrl = process.env.N8N_BILLING_WEBHOOK_URL;
    
    if (!webhookUrl) {
      // Comportement de repli si l'URL n'est pas encore configurée (Mode dev)
      console.warn("N8N_BILLING_WEBHOOK_URL n'est pas définie. Simulation de succès.");
      // Simuler une petite latence réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ success: true, simulated: true, interventionId: id });
    }

    const n8nResponse = await fetch(webhookUrl, {
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

    if (!n8nResponse.ok) {
      throw new Error(`Erreur lors de l'appel à n8n: ${n8nResponse.statusText}`);
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Erreur API Billing:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
