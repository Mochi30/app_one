import { GoogleGenAI } from "@google/genai";
import { UsageData, Device } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeEnergyUsage = async (
  period: string, 
  usageData: UsageData[], 
  activeDevices: Device[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Fitur analisis pintar dinonaktifkan.";
  }

  try {
    const prompt = `
      Bertindaklah sebagai asisten penghemat energi pintar bernama "VoltMate AI".
      
      Analisis data penggunaan listrik berikut untuk periode: ${period}.
      
      Data Penggunaan (Grafik):
      ${JSON.stringify(usageData)}
      
      Perangkat IoT yang aktif saat ini:
      ${JSON.stringify(activeDevices.filter(d => d.isOn))}
      
      Berikan respon singkat (maksimal 3 poin) dalam format HTML unordered list (<ul><li>...</li></ul>) tentang:
      1. Insight penggunaan (apakah normal/tinggi).
      2. Prediksi singkat.
      3. Saran penghematan spesifik berdasarkan device yang aktif.
      
      Gunakan bahasa Indonesia yang santai, membantu, dan modern. Jangan gunakan markdown block, langsung raw HTML string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Tidak dapat menganalisis data saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, VoltMate AI sedang sibuk. Coba lagi nanti.";
  }
};