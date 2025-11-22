import { Language } from "./types";

export const translations = {
  tr: {
    app: {
      title: "ReflexMetre",
      subtitle: "Reaksiyon hızını test et ve geliştir",
      best: "EN İYİ",
      avg: "ORTALAMA",
      howToPlay: "Nasıl Oynanır?",
      step1: "Başlamak için ekrana tıkla.",
      step2: "Kırmızı ekranı bekle. Tıklama!",
      step3: "Yeşil olduğu an TIKLA!",
      clearData: "Verileri Temizle",
      footer: "Gemini API ile güçlendirilmiştir."
    },
    game: {
      idleTitle: "Refleks Testi",
      idleDesc: "Başlamak için ekrana dokun",
      waitingTitle: "BEKLE...",
      waitingDesc: "Yeşil olana kadar dokunma!",
      ready: "BAS!!!",
      earlyTitle: "Çok Erken!",
      earlyDesc: "Yeşil rengi beklemen gerekirdi.",
      retry: "Tekrar denemek için dokun",
      playAgain: "Tekrar Dene"
    },
    feedback: {
      godlike: { title: "Hile Misin? / Tanrısal", desc: "Bu değerler görsel uyaran için biyolojik sınırın hemen ucudur. Genelde sadece tahmin (pre-fire) yaparak ya da şansla alınır." },
      esports: { title: "E-Sporcu Seviyesi", desc: "Profesyonel FPS oyuncularının (CS:GO, Valorant vb.) bulunduğu aralık. Reflekslerin bıçak gibi keskindir." },
      veryGood: { title: "Çok İyi", desc: "Ortalamanın ciddi şekilde üzerindesin. Düzenli oyun oynayan, dikkati yüksek, zinde birisin demektir." },
      average: { title: "Ortalama İnsan", desc: "Dünya nüfusunun büyük çoğunluğu buradadır. Ne çok hızlı ne çok yavaş; standart, sağlıklı bir tepki süresi." },
      slow: { title: "Biraz Yavaş", desc: "Yaş faktörü, yorgunluk, uykusuzluk veya ekipman (mouse/monitör) gecikmesi olabilir. 'Laglı' hissedebilirsin." },
      verySlow: { title: "Sarhoş / Çok Yorgun", desc: "Dikkat dağınıklığı veya ciddi bir yorgunluk belirtisidir. Trafikte araç kullanırken tehlikeli olmaya başladığı sınırdır." }
    },
    stats: {
      title: "SON DENEMELER",
      noData: "Grafiği görmek için en az 2 test yapın.",
      tooltipTime: "Süre",
      tooltipAttempt: "Deneme"
    },
    ai: {
      title: "Yapay Zeka Analizi",
      coachTitle: "AI Koç Analizi",
      analyzeButton: "Performansımı Analiz Et",
      analyzing: "Analiz Ediliyor...",
      reset: "Sıfırla",
      errorMinTests: "Analiz için en az 3 test yapmalısın!",
      remainingTests: (n: number) => `Analiz için ${n} test daha yapmalısın.`,
      myGithub: "Github hesabım:",
      labels: {
        rank: "RÜTBE",
        summary: "ÖZET"
      }
    }
  },
  en: {
    app: {
      title: "ReflexMeter",
      subtitle: "Test and improve your reaction speed",
      best: "BEST",
      avg: "AVERAGE",
      howToPlay: "How to Play?",
      step1: "Click the screen to start.",
      step2: "Wait for red. Don't click!",
      step3: "Click immediately on GREEN!",
      clearData: "Clear Data",
      footer: "Powered by Gemini API."
    },
    game: {
      idleTitle: "Reflex Test",
      idleDesc: "Tap screen to start",
      waitingTitle: "WAIT...",
      waitingDesc: "Wait for green!",
      ready: "CLICK!!!",
      earlyTitle: "Too Early!",
      earlyDesc: "You need to wait for the green color.",
      retry: "Tap to try again",
      playAgain: "Try Again"
    },
    feedback: {
      godlike: { title: "Cheater? / Godlike", desc: "These values are at the biological limit for visual stimuli. Usually achieved by prediction (pre-fire) or luck." },
      esports: { title: "E-Sports Level", desc: "The range of professional FPS players (CS:GO, Valorant, etc.). Your reflexes are razor sharp." },
      veryGood: { title: "Very Good", desc: "You are significantly above average. Indicates someone who plays regularly, has high attention, and is fit." },
      average: { title: "Average Human", desc: "The vast majority of the world population is here. Neither too fast nor too slow; a standard, healthy reaction time." },
      slow: { title: "A Bit Slow", desc: "Could be due to age, fatigue, lack of sleep, or equipment lag. You might feel 'laggy'." },
      verySlow: { title: "Drunk / Very Tired", desc: "Indicates distraction or serious fatigue. The limit where driving becomes dangerous." }
    },
    stats: {
      title: "LAST ATTEMPTS",
      noData: "Complete at least 2 tests to see the chart.",
      tooltipTime: "Time",
      tooltipAttempt: "Attempt"
    },
    ai: {
      title: "AI Analysis",
      coachTitle: "AI Coach Analysis",
      analyzeButton: "Analyze Performance",
      analyzing: "Analyzing...",
      reset: "Reset",
      errorMinTests: "You need at least 3 tests for analysis!",
      remainingTests: (n: number) => `You need ${n} more tests for analysis.`,
      myGithub: "My Github:",
      labels: {
        rank: "RANK",
        summary: "SUMMARY"
      }
    }
  }
};