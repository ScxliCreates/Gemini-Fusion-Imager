import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ImageFile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const proModel = 'gemini-2.5-pro';
const flashImageModel = 'gemini-2.5-flash-image';

const proConfig = {
    temperature: 1.25,
    topP: 1.0,
    thinkingConfig: { thinkingBudget: 32768 },
};

const flashImageConfig = {
    temperature: 1.25,
    topP: 1.0,
};

const fileToGenerativePart = (image: ImageFile): Part => {
    return {
        inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
        },
    };
};

export const generatePlan = async (prompt: string, image?: ImageFile): Promise<string> => {
    const parts: Part[] = [
        { text: `You are part of a duo of AI models. Your partner is a visual generation specialist, ${flashImageModel}. Analyze the following user prompt and image (if provided). Collaboratively create an extremely detailed and comprehensive plan for generating a new image. Leverage Google Search for grounding and context. Structure the plan with clear, actionable steps for your visual partner to follow. User Prompt: "${prompt}"` }
    ];
    if (image) {
        parts.push(fileToGenerativePart(image));
    }

    const response = await ai.models.generateContent({
        model: proModel,
        contents: { parts },
        config: {
            ...proConfig,
            tools: [{ googleSearch: {} }]
        },
    });

    return response.text;
};

export const generateDraft = async (plan: string, originalImage?: ImageFile): Promise<string> => {
    const parts: Part[] = [
        { text: `Based on the following detailed plan, generate a new image. If an original image is provided, use it as a base for editing. Plan: ${plan}` }
    ];
    if (originalImage) {
        parts.push(fileToGenerativePart(originalImage));
    }

    const response = await ai.models.generateContent({
        model: flashImageModel,
        contents: { parts },
        config: {
            ...flashImageConfig,
            responseModalities: [Modality.IMAGE],
        },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    }
    throw new Error("Could not generate a draft image.");
};

export const generateAnalysis = async (prompt: string, plan: string, draftImage: ImageFile, originalImage?: ImageFile): Promise<string> => {
    const parts: Part[] = [
        { text: `You are part of a duo of AI models. Your partner is a visual generation specialist. You previously created a 'Plan'. Your partner has now created a 'Draft' image based on that plan.
        Original User Prompt: "${prompt}"
        Original Plan: "${plan}"
        
        Now, meticulously review the provided 'Draft' image against the original user request and the collaborative Plan. Also consider the original image if it was provided. Identify any flaws, discrepancies, or areas for improvement. Write an extremely detailed analysis to guide the final refinement.` },
        { text: "Draft Image to Analyze:" },
        fileToGenerativePart(draftImage),
    ];

    if (originalImage) {
        parts.push({ text: "Original Image for reference:" });
        parts.push(fileToGenerativePart(originalImage));
    }

    const response = await ai.models.generateContent({
        model: proModel,
        contents: { parts },
        config: proConfig,
    });
    
    return response.text;
};


export const generateFinalImage = async (analysis: string, draftImage: ImageFile, originalImage?: ImageFile): Promise<string> => {
    const parts: Part[] = [
        { text: `Based on the following comprehensive analysis, refine the provided draft image to create a final, polished version. If an original image is also provided, it is for context. The draft image is the primary one to be edited. Analysis: ${analysis}` },
        { text: "Draft Image to Refine:"},
        fileToGenerativePart(draftImage),
    ];

    if (originalImage) {
      parts.push({ text: "Original Image for context:"});
      parts.push(fileToGenerativePart(originalImage));
    }

    const response = await ai.models.generateContent({
        model: flashImageModel,
        contents: { parts },
        config: {
            ...flashImageConfig,
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    }
    throw new Error("Could not generate the final image.");
};