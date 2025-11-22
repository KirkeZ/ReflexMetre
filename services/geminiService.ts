import { GoogleGenAI, Type } from "@google/genai";
import { ReactionRecord, GeminiAnalysisResult, Language } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const analyzePerformance = async (history: ReactionRecord[], lang: Language): Promise<GeminiAnalysisResult> => {
  if (!history || history.length === 0) {
    throw new Error(lang === 'tr' ? "Analiz için veri yok." : "No data for analysis.");
  }

  // Calculate basic stats client-side to pass to AI for context
  const times = history.map(h => h.reactionTime);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const best = Math.min(...times);

  const promptTr = `
    Kullanıcının reaksiyon testi sonuçları (ms): ${times.join(', ')}.
    Ortalama: ${avg}ms. En iyi: ${best}ms.
    
    Lütfen kullanıcının reflekslerini analiz et. Şunları içeren bir JSON döndür:
    1. "summary": Performans hakkında kısa, esprili bir özet (Türkçe).
    2. "rank": Bir rütbe ver (örneğin: "Siber Ninja", "Uykulu Kedi", "Ortalama İnsan", "Pro Oyuncu").
    3. "advice": Reaksiyon süresini geliştirmek için 1 cümlelik tavsiye.
  `;

  const promptEn = `
    User reaction test results (ms): ${times.join(', ')}.
    Average: ${avg}ms. Best: ${best}ms.
    
    Please analyze the user's reflexes. Return a JSON containing:
    1. "summary": A short, witty summary of performance (in English).
    2. "rank": Give a rank (e.g., "Cyber Ninja", "Sleepy Cat", "Average Human", "Pro Gamer").
    3. "advice": 1 sentence advice to improve reaction time.
  `;

  const prompt = lang === 'tr' ? promptTr : promptEn;
  const sysInstruction = lang === 'tr' 
    ? "Sen profesyonel bir e-spor koçusun. Kullanıcıların reaksiyon sürelerini analiz edip onlara eğlenceli ve motive edici geri bildirimler veriyorsun. Türkçe konuş."
    : "You are a professional e-sports coach. You analyze user reaction times and provide fun, motivating feedback. Speak English.";

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

    const text = response.text;
    if (!text) throw new Error("AI yanıtı boş.");

    return JSON.parse(text) as GeminiAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(lang === 'tr' 
      ? "Analiz oluşturulamadı. Lütfen daha sonra tekrar deneyin." 
      : "Could not generate analysis. Please try again later."
    );
  }
};