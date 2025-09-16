import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export async function POST(req: NextRequest) {

    const {text} = await req.json();

    try {
        const resp = await openai.chat.completions.create({
            model: 'gemini-2.0-flash',
            messages: [
                {
                    role: "system",
                    content: "You are a note summarizer. Summarize the notes and extract key action items.",
                },
                {
                    role: 'user',
                    content: text
                },
            ],
            temperature: 0.7,
            max_tokens: text.length
        });

        // content is the ans given by gemini after prompt
        const summary = resp.choices[0].message.content;

        return NextResponse.json({summary});
    }
    catch (error: any) {
        console.log(error.message);
        return NextResponse.json({message: 'Failed to generate summary'}, {status: 500});
    }
}
