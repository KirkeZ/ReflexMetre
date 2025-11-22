import { GoogleGenAI, Type } from "@google/genai";
import { ReactionRecord, GeminiAnalysisResult, Language } from "../types";

// API Key must be accessed via process.env.API_KEY
const apiKey = process.env.API_KEY;

// Initialize Gemini Client
// We initialize it lazily inside the function or check it before use to prevent immediate crashes if key is missing globally
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzePerformance = async (history: ReactionRecord[], lang: Language): Promise<GeminiAnalysisResult> => {
  if (!history || history.length === 0) {
    throw new Error(lang === 'tr' ? "Analiz için veri yok." : "No data for analysis.");
  }

  if (!apiKey || !ai) {
    throw new Error(lang === 'tr' 
      ? "API Anahtarı (API_KEY) bulunamadı veya hatalı yapılandırılmış." 
      : "API Key (API_KEY) is missing or misconfigured."
    );
  }

  // Calculate basic stats client-side to pass to AI for context
  const times = history.map(h => h.reactionTime);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const best = Math.min(...times);

  const promptTr = `
    Kullanıcının reaksiyon testi sonuçları (ms): ${times.join(', ')}.
    Ortalama: ${avg}ms. En iyi: ${best}ms.
    
    Lütfen kullanıcının reflekslerini analiz et. Şunları içeren saf bir JSON döndür (Markdown formatı kullanma):
    1. "summary": Performans hakkında kısa, esprili bir özet (Türkçe).
    2. "rank": Bir rütbe ver (örneğin: "Siber Ninja", "Uykulu Kedi", "Ortalama İnsan", "Pro Oyuncu").
    3. "advice": Reaksiyon süresini geliştirmek için 1 cümlelik tavsiye.
  `;

  const promptEn = `
    User reaction test results (ms): ${times.join(', ')}.
    Average: ${avg}ms. Best: ${best}ms.
    
    Please analyze the user's reflexes. Return a pure JSON containing (do not use Markdown):
    1. "summary": A short, witty summary of performance (in English).
    2. "rank": Give a rank (e.g., "Cyber Ninja", "Sleepy Cat", "Average Human", "Pro Gamer").
    3. "advice": 1 sentence advice to improve reaction time.
  `;

  const prompt = lang === 'tr' ? promptTr : promptEn;
  const sysInstruction = lang === 'tr' 
    ? "Sen profesyonel bir e-spor koçusun. Kullanıcıların reaksiyon sürelerini analiz edip onlara eğlenceli ve motive edici geri bildirimler veriyorsun. Sadece JSON formatında yanıt ver."
    : "You are a professional e-sports coach. You analyze user reaction times and provide fun, motivating feedback. Respond only in JSON format.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            rank: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["summary", "rank", "advice"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("AI yanıtı boş.");

    // Clean up Markdown code blocks if present (common issue with AI responses)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text) as GeminiAnalysisResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for specific API errors
    if (error.message?.includes("API key not valid") || error.toString().includes("403")) {
       throw new Error(lang === 'tr' ? "API Anahtarı geçersiz." : "Invalid API Key.");
    }

    throw new Error(lang === 'tr' 
      ? "Analiz oluşturulamadı. Lütfen daha sonra tekrar deneyin." 
      : "Could not generate analysis. Please try again later."
    );
  }
};
