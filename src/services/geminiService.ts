import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from "../types";

export const generateRecipe = async (
  goal: string,
  protein: string,
  carb: string,
  meal: string,
  time: string,
  dietaryRestrictions: string[]
): Promise<Recipe> => {
  // Configured in vite.config.ts to map VITE_API_KEY to process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create a detailed cooking recipe based on the following parameters:
    - Goal: ${goal} (This determines the macro balance)
    - Primary Protein: ${protein}
    - Primary Carb Source: ${carb}
    - Meal Type: ${meal}
    - Cooking Time Preference: ${time}
    - Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}

    **Style Instruction:**
    Adopt the persona of a famous chef known for this type of cuisine (e.g., Gordon Ramsay for western, Maangchi for Korean, Kenji López-Alt for science-based, Jamie Oliver for simple). 
    Write the description and instructions in their unique voice.

    The recipe should be realistic, tasty, and include estimated calories.
    Provide specific quantities in the ingredients.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          servings: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          chefName: { type: Type.STRING, description: "The name of the famous chef whose style is being emulated" },
          ingredients: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: ["title", "description", "prepTime", "servings", "calories", "chefName", "ingredients", "instructions"]
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("No response from AI");
  }

  const data = JSON.parse(jsonText);

  return {
    id: `generated-${Date.now()}`,
    title: data.title,
    description: data.description,
    prepTime: data.prepTime,
    servings: data.servings,
    calories: data.calories,
    goal: goal,
    ingredients: data.ingredients,
    instructions: data.instructions,
    chefName: data.chefName,
    createdAt: new Date().toISOString()
  };
};