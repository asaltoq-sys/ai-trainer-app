import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();
    
    // Seleccionamos el modelo que elegiste
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Eres un entrenador personal experto de élite. 
      Crea una rutina de entrenamiento HIIT y fuerza personalizada basada en este perfil:
      - Edad: ${profile.age} años
      - Peso: ${profile.weight} kg
      - Sexo: ${profile.gender}
      - Objetivo: ${profile.goal}
      - Nivel de fitness: ${profile.fitness_level}
      - Días de entreno: ${profile.training_days} a la semana

      La respuesta debe ser motivadora, profesional y estructurada con:
      1. Calentamiento (5 min)
      2. Bloque principal (ejercicios, series, repeticiones/tiempo)
      3. Vuelta a la calma.
      Usa un lenguaje directo y enérgico.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al generar el plan" }, { status: 500 });
  }
}