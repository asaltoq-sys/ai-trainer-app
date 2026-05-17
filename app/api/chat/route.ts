import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Eres un entrenador personal de élite. Crea una rutina de HIIT y Fuerza.
      DATOS DEL USUARIO:
      - Edad: ${profile.age}, Peso: ${profile.weight}kg, Sexo: ${profile.gender}
      - Nivel: ${profile.fitness_level}, Objetivo: ${profile.goal}
      - TIEMPO DISPONIBLE HOY: ${profile.daily_time} minutos EXACTOS.

      REQUISITOS DEL PLAN:
      1. Ajusta el número de series y ejercicios para que la sesión dure exactamente ${profile.daily_time} minutos incluyendo calentamiento y estiramientos.
      2. Especifica claramente el TIEMPO DE DESCANSO entre cada serie (ej. "Descanso: 45 seg").
      3. Estructura: Calentamiento, Bloque de Fuerza, Bloque HIIT, Vuelta a la calma.
      Sé motivador y directo.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: "Fallo de IA" }, { status: 500 });
  }
}