/**
 * @file gemini.ts
 * @description This file contains the main logic for interacting with Gemini API.
 * @module Game/gemini
 */

import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env["GADGET_PUBLIC_GEMINI_API_KEY"] as string);
const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

//This stores the context for the model.
let context: string[] = [];

const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "'Give me a few examples of insults that I can use in a merger game. Make sure they are structured like you are swearing but replace the swear words silly words. Give me your response as plain text, with no formatting. In addition, you only need to state your acknowledgement of this message, but execute the instructions whenever I type: 'insult me'. Make every insult different than the ones before it. Throw in a couple swears when you can."}],
      },
      {
        role: "model",
        parts: [{ text: "Acknowledged." }],
      },
    ],
  });

const GEMINI_API_URL = 'https://api.gemini.com/v1';


export const insult = async (): Promise<string> => {
    try {
      const result = await chat.sendMessage("insult me.");
      return result.response.text();
    } catch (error) {
      console.error('Error generating insult:', error);
      return "You are such a bozo that I couldn't think of an insult for you. And I'm a generative AI. Imagine that.";
    }
  };