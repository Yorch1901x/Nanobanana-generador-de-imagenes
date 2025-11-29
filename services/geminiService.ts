import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent } from "../types";

// Initialize the client
// CRITICAL: Using process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

/**
 * Generates creative prompt ideas based on a topic using Gemini 2.5 Flash.
 * 
 * @param topic The user's input topic or idea.
 * @returns A promise resolving to an array of generated prompt strings.
 */
export const generateCreativePrompts = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert prompt engineer for AI image generation. 
      Create 3 distinct, highly detailed, and creative image generation prompts based on this idea: "${topic}".
      The prompts should be optimized for a high-quality text-to-image model.
      Include details about lighting, style, camera angle, and mood.
      Return ONLY the list of prompts.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
       return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Prompt generation error:", error);
    return ["Failed to generate ideas. Please try again."];
  }
};

/**
 * Generates or edits an image using Gemini 2.5 Flash Image.
 * 
 * @param prompt The text prompt describing the desired image or edit.
 * @param referenceImages Array of reference images (structure or style).
 * @param aspectRatio The desired aspect ratio for the output.
 * @returns A promise resolving to the generated content (image and/or text).
 */
export const generateOrEditImage = async (
  prompt: string,
  referenceImages: ReferenceImage[] = [],
  aspectRatio: string = "1:1"
): Promise<GeneratedContent> => {
  
  try {
    const parts: any[] = [];

    // Add all reference images to the parts
    referenceImages.forEach(img => {
      parts.push({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType,
        },
      });
    });

    // Add the text prompt
    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    let imageUrl: string | undefined;
    let textOutput: string | undefined;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Found an image part
          const base64Data = part.inlineData.data;
          // The API doesn't always explicitly return the mimeType in the inlineData response part in all SDK versions effectively,
          // but usually it's a PNG or JPEG. We construct a data URI.
          // Note: The SDK types say `part.inlineData.mimeType` exists.
          const respMime = part.inlineData.mimeType || 'image/png'; 
          imageUrl = `data:${respMime};base64,${base64Data}`;
        } else if (part.text) {
          textOutput = part.text;
        }
      }
    }

    return { imageUrl, text: textOutput };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};