import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { topic, platform } = await req.json();

  if (!topic || !platform) {
    return NextResponse.json({ error: "Missing topic or platform" }, { status: 400 });
  }

  const platformGuidelines: Record<string, string> = {
    Instagram: "casual, visual, emoji-friendly, 2200 characters max, hashtag suggestions at end",
    Twitter: "punchy, concise, under 280 characters, no hashtag spam",
    LinkedIn: "professional, insightful, 1-3 short paragraphs, subtle CTA",
    TikTok: "energetic, trend-aware, hook in first line, short and snappy",
  };

  const guidelines = platformGuidelines[platform] ?? "general social media";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert social media marketer. Generate exactly 3 distinct marketing captions for ${platform}.

Platform style: ${guidelines}

Topic / product description:
${topic}

Return ONLY a JSON object in this exact format, no extra text:
{
  "captions": ["caption1", "caption2", "caption3"]
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: `Anthropic API error: ${err}` }, { status: 500 });
  }

  const data = await response.json();
  const raw = data.content?.[0]?.text ?? "";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json({ captions: parsed.captions });
  } catch {
    return NextResponse.json({ error: "Failed to parse captions", raw }, { status: 500 });
  }
}
