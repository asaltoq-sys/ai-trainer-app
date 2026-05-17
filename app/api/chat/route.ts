import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" } // Forzamos JSON
    });

    const prompt = `
      Eres un entrenador personal de élite. Crea una rutina de entrenamiento.
      Usuario: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, Nivel ${profile.fitness_level}.
      Tiempo: ${profile.daily_time} min.

      Responde ÚNICAMENTE con este formato JSON:
      {
        "rutina": [
          {
            "seccion": "CALENTAMIENTO",
            "ejercicios": [
              {"nombre": "Nombre", "sets": 1, "reps": "5 min", "descanso": 0, "video": "https://youtube.com/results?search_query=calentamiento+dinamico"}
            ]
          },
          {
            "seccion": "BLOQUE PRINCIPAL",
            "ejercicios": [
              {"nombre": "Sentadilla Goblet", "sets": 4, "reps": "12", "descanso": 60, "video": "https://youtube.com/results?search_query=goblet+squat"}
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    return NextResponse.json({ error: "Fallo de IA" }, { status: 500 });
  }
}