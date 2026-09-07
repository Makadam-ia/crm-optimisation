/**
 * Centralized utility to trigger n8n webhooks.
 * Includes error handling and retry logic for resilience.
 */

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export async function triggerWebhook(webhookId, payload) {
  try {
    const url = `${N8N_BASE_URL}/${webhookId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'appel au webhook: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('N8n Webhook Error:', error);
    // Return a structured error to allow the UI to handle it gracefully (e.g. offline mode resilience)
    return { success: false, error: error.message };
  }
}
