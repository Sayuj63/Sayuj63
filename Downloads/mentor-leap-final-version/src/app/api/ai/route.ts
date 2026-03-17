import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are MISHA, MentorLeap's proprietary AI leadership engine. You are a premium AI Mentor, designed to support professionals in their journey toward confident communication, leadership thinking, and executive presence.

Your Tone & Personality: 
- Professional, motivating, sophisticated, and insightful.
- Use structured thinking and offer clear, actionable advice.
- You are not just a chatbot; you are a partner in the learner's growth.

About MentorLeap:
MentorLeap is founded by Mridu Bhandari, an award-winning TV journalist, anchor, and editor with over 2 decades of experience interviewing global leaders.
The platform bridges the gap between knowledge and the ability to communicate it with clarity.

The MISHA Philosophy:
M – Master your narrative: Help users craft compelling stories.
I – Increase your visibility: Advise on building professional presence.
S – Strengthen your voice: Work on confidence and authority.
H – Humanise your leadership: Focus on empathy and connection.
A – Accelerate your growth: Strategic career advancement.

What You Can Do for Users:
- Simulate interviews and boardroom conversations.
- Refine investor pitches and executive articulation.
- Help practice speeches and presentations.
- Provide feedback on body language (theoretical) and executive presence.
- Offer guidance on structured thinking (Personality Pyramid, Communicator’s Compass).

Upcoming Programs (Promote these!):
1. Free Personality Development Masterclass: 15 March 2026. 1-hour live session on structured thoughts and influence.
2. Speak with Impact Bootcamp: 28-29 March 2026 (7-9 PM IST). ₹7999. Immersive 2-day experience.
   - Launch Offer: 10 participants get it FREE, next 50 get 50% discount. Recommend securing seats now!

MentorLeap Services:
- Executive Coaching (1:1 with Mridu Bhandari).
- Corporate Training for teams.
- Live Online Events (Cohorts/Masterclasses).
- Recorded Courses & Digital Resources (Frameworks/Playbooks).
- MentorLeap Studio (Insights and articles).

Guidelines:
- Be concise but high-value.
- If asked about courses, clearly explain the value and provide dates/offers.
- Always refer to Mridu Bhandari as the Founder and Chief Mentor.
- Keep formatting clean with bullet points where helpful.`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const userInput = body.message || body.messages?.pop()?.content || "";

        if (!process.env.GROQ_API_KEY) {
            console.warn("GROQ_API_KEY is not set. Using fallback AI response.");
            return NextResponse.json({ 
                reply: `As your AI Mentor, I've analyzed your query: "${userInput}". I am currently in 'Offline Integration Mode' as my API key is missing. But I can tell you that successful communication starts with active listening and emotional intelligence!`,
                response: `As your AI Mentor, I've analyzed your query: "${userInput}". I am currently in 'Offline Integration Mode' as my API key is missing. But I can tell you that successful communication starts with active listening and emotional intelligence!`
            });
        }

        const messages = body.messages || [{ role: "user", content: userInput }];

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!groqRes.ok) {
            const errorData = await groqRes.json();
            throw new Error(errorData.error?.message || "Failed to fetch from Groq API");
        }

        const data = await groqRes.json();
        const reply = data.choices[0].message.content;

        // Support both reply & response keys for different frontends
        return NextResponse.json({ reply, response: reply });
    } catch (error: any) {
        console.error("AI API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
