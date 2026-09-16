import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const payload = await request.json();

    const appelant = payload?.message?.call?.customer?.number || 'Appel Entrant';
    const transcription = payload?.message?.transcript || 'Demande via assistance vocale Vapi';

    const { data, error } = await supabase
      .from('demande_devis')
      .insert([
        {
          client_nom: appelant,
          probleme: transcription,
          statut: 'En attente',
        }
      ])
      .select();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, insertedId: data[0].id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
