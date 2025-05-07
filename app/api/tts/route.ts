// app/api/tts/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { text, language } = await request.json();

    // Map language to Play.ht voice IDs (replace with actual IDs from Play.ht)
    const voiceMap: { [key: string]: string } = {
      "en-US": "en-US-Jenny-Neural",  // Example: English (US) voice
      "hi-IN": "hi-IN-Wavenet-A"      // Example: Hindi voice
    };
    const voiceId = voiceMap[language] || voiceMap["en-US"]; // Fallback to en-US

    const data = {
      text: text,
      voice: voiceId,
      output_format: "mp3",
      sample_rate: 48000,
      speed: 1.0,
      pitch: 0
    };

    const config = {
      method: 'post',
      url: 'https://api.play.ht/api/v2/tts',  // Verify this endpoint
      headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION': 'Bearer YOUR_PLAY_HT_API_KEY',  // Replace with your API key
        'X-USER-ID': 'YOUR_PLAY_HT_USER_ID'             // Replace with your User ID
      },
      data: data
    };

    const response = await axios(config);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}