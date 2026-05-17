import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Importamos supabase para leer los progresos

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();
    
    // 1. Buscamos los últimos 10 ejercicios realizados por este usuario para que la IA aprenda
    const { data: logs } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. El "Prompt" maestro con memoria de progreso
    const prompt = `
      Eres un entrenador personal de élite. 
      DATOS ACTUALES:
      - Usuario: ${profile.gender}, ${profile.age} años, ${profile.weight}kg.
      - Objetivo: ${profile.goal}.
      - Tiempo hoy: ${profile.daily_time} minutos.
      - Nivel: ${profile.fitness_level}.

      HISTORIAL DE RENDIMIENTO RECIENTE:
      ${logs && logs.length > 0 ? JSON.stringify(logs) : "No hay entrenamientos previos todavía."}

      INSTRUCCIONES DE DISEÑO:
      1. Si en el historial ves que terminó los ejercicios con 0 o 1 repetición de reserva (RIR), mantén el peso.
      2. Si pudo hacer 3 o más repeticiones adicionales en su última sesión, sube el peso un 5-10%.
      3. Estructura la rutina para que dure EXACTAMENTE ${profile.daily_time} min.
      
      IMPORTANTE: Devuelve la rutina en formato de secciones DESPLEGABLES. 
      Usa títulos claros para: CALENTAMIENTO, BLOQUE FUERZA, BLOQUE HIIT, VUELTA A LA CALMA.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fallo de conexión con la IA" }, { status: 500 });
  }
}