export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + (process.env.GROQ_API_KEY || import.meta.env.GROQ_API_KEY)
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful legal rights assistant for the United States. Answer in very simple plain English that anyone can understand. No legal jargon.'
          },
          {
            role: 'user',
            content: 'I am in ' + body.state + '. My question is: ' + body.question + '. Please answer with: 1. Simple Answer 2. My Rights in ' + body.state + ' 3. What I Can Do Next 4. Important Warning to consult a real lawyer.'
          }
        ]
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}