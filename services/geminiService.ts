
import { GoogleGenAI, Type } from "@google/genai";
import { BillData, FinalReport, InterviewResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractBillData = async (base64Data: string, mimeType: string): Promise<BillData> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: "Estrai i seguenti dati da questa bolletta energetica (immagine o PDF). Se è un PDF, analizza tutte le pagine per trovare i dati richiesti. Restituisci esclusivamente un oggetto JSON valido. Se un dato non è presente, usa null o 0." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          annualConsumption: { type: Type.NUMBER, description: "Consumo Annuo in kWh" },
          powerCommitted: { type: Type.NUMBER, description: "Potenza Impegnata in kW (es. 3, 4.5, 6)" },
          fasceDistribution: {
            type: Type.OBJECT,
            properties: {
              f1: { type: Type.NUMBER },
              f2: { type: Type.NUMBER },
              f3: { type: Type.NUMBER }
            },
            required: ["f1", "f2", "f3"]
          },
          alphaSpread: { type: Type.NUMBER, description: "Parametro Alfa o Spread in €/kWh" },
          pcv: { type: Type.NUMBER, description: "Prezzo di Commercializzazione Vendita (Quota Fissa) in €/anno" },
          additionalServices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Servizi accessori a pagamento rilevati" },
          providerName: { type: Type.STRING, description: "Nome del fornitore attuale" }
        },
        required: ["annualConsumption", "powerCommitted", "fasceDistribution", "alphaSpread", "pcv", "providerName"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFinalReport = async (billData: BillData, interview: InterviewResponse[]): Promise<FinalReport> => {
  const interviewText = interview.map(i => `${i.step}: ${i.answer}`).join('\n');
  
  const prompt = `
    Analizza i dati della bolletta e le risposte dell'intervista per generare un report energetico forense 360.
    DATI BOLLETTA:
    - Fornitore: ${billData.providerName}
    - Consumo Annuo: ${billData.annualConsumption} kWh
    - Potenza: ${billData.powerCommitted} kW
    - Spread: ${billData.alphaSpread} €/kWh
    - PCV: ${billData.pcv} €/anno
    - Fasce: F1=${billData.fasceDistribution.f1}, F2=${billData.fasceDistribution.f2}, F3=${billData.fasceDistribution.f3}

    INTERVISTA STRATEGICA:
    ${interviewText}

    Genera un report strategico in formato JSON che includa analisi comportamentale, modellazione del risparmio e confronto mercato.
    Usa prezzi PUN correnti mediati (es. 0.12 €/kWh) per le stime di mercato.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          behaviorAnalysis: {
            type: Type.OBJECT,
            properties: {
              idealHours: { type: Type.STRING },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["idealHours", "tips"]
          },
          savingsModeling: {
            type: Type.OBJECT,
            properties: {
              monthlySavings: { type: Type.NUMBER },
              yearlySavings: { type: Type.NUMBER },
              currentVsOptimizedData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    cost: { type: Type.NUMBER }
                  }
                }
              }
            },
            required: ["monthlySavings", "yearlySavings", "currentVsOptimizedData"]
          },
          marketIntelligence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                punBase: { type: Type.STRING },
                spread: { type: Type.NUMBER },
                fixedCost: { type: Type.NUMBER },
                estimatedYearlyCost: { type: Type.NUMBER }
              }
            }
          },
          verdict: { type: Type.STRING }
        },
        required: ["behaviorAnalysis", "savingsModeling", "marketIntelligence", "verdict"]
      }
    }
  });

  return JSON.parse(response.text);
};
