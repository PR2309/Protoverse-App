export async function handler(event) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Parse body safely
        let body;
        try {
            body = JSON.parse(event.body);
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON" }),
            };
        }

        // const { message } = body;

        // if (!message) {
        //     return {
        //         statusCode: 400,
        //         body: JSON.stringify({ error: "Message is required" }),
        //     };
        // }

        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Messages array is required" }),
            };
        }

        // System Prompt verification
        const apiKey = process.env.OPENROUTER_API_KEY?.trim();
        if (!apiKey) {
            console.error("CRITICAL: OPENROUTER_API_KEY is missing from environment variables.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Backend configuration error: API Key missing." }),
            };
        }

        // Diagnostic log (safely masked)
        console.error(`[Diagnostic] API Key Length: ${apiKey.length}, Format: ${apiKey.startsWith('sk-or-v1-') ? 'Valid prefix' : 'INVALID PREFIX'}`);

        // System Prompt
        const systemPrompt = `
            You are a compassionate and caring assistant for the Protoverse App.
            Your role is to provide emotional support and comfort, speaking in a gentle, empathetic, and loving manner—like a trusted family member or close friend.
            Always ask open-ended questions to understand how the user is feeling, such as "Is something troubling you?" or "Do you want to talk about what's on your mind?".
            Offer comfort, reassurance, and small, safe coping suggestions for emotional support, but never provide medical advice, diagnosis, or instructions that should come from a professional.
            If you do not know the answer, admit it honestly.
            Always prioritize the user's emotional safety, avoid judgment, and never criticize or shame the user.
            Respond in a way that feels nurturing, warm, and supportive, while keeping the conversation focused on listening and understanding the user's feelings.
            `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://protoverse.netlify.app", // Adjust if needed
                "X-Title": "Protoverse App",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    // 1. The System Prompt goes first
                    { role: "system", content: systemPrompt },
                    // // 2. The User's message follows
                    // { role: "user", content: message }
                    // 2. The User's message follows
                    ...messages
                ],
            }),
        });

        const data = await response.json();

        // Check if OpenRouter actually succeeded
        if (!response.ok) {
            console.error("OpenRouter API Error:", data);
            return {
                statusCode: response.status, // Return 400, 401, etc.
                body: JSON.stringify({ error: data.error?.message || "Error communicating with AI provider" }),
            };
        }


        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Chatbot function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}
