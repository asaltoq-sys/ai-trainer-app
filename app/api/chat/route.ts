import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();
    
    // Traemos los datos técnicos de los ejercicios de la DB
    const { data: dbExercises } = await supabase.from('exercises').select('*');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Eres un entrenador experto. Crea una rutina HIIT/Fuerza.
      Usuario: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, Nivel ${profile.fitness_level}.
      Tiempo disponible: ${profile.daily_time} min.
      
      EJERCICIOS DISPONIBLES (Usa estos nombres y datos):
      ${JSON.stringify(dbExercises)}

      INSTRUCCIÓN IMPORTANTE:
      Calcula los KILOS adecuados para cada ejercicio basándote en el perfil del usuario.
      
      Responde SOLO con este formato JSON:
      {
        "rutina": [
          {
            "seccion": "NOMBRE SECCION",
            "ejercicios": [
              {
                "nombre": "Nombre exacto de la DB",
                "sets": 4,
                "reps": "12",
                "kilos": 15,
                "descanso": 60,
                "instrucciones": "Copia las instrucciones de la DB",
                "img1": "URL1 de la DB",
                "img2": "URL2 de la DB",
                "video": "URL video de la DB"
              }
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