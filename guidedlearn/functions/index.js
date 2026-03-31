/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiKey = defineSecret("GEMINI_API_KEY");
const youtubeKey = defineSecret("YOUTUBE_API_KEY");

// 1. Nimna AI Tutor Function
exports.askAiTutor = onCall({ 
  secrets: [geminiKey],
  cors: true 
}, async (request) => {
  const { userMessage, topic, pathwayTitle } = request.data;
  
  const genAI = new GoogleGenerativeAI(geminiKey.value());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert, friendly AI Tutor named "Nimna". The student is learning "${topic}" in "${pathwayTitle}". Explain simply and encourage them. User says: ${userMessage}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new HttpsError("internal", "AI Tutor failed: " + error.message);
  }
});

// 2. Quick Quiz Function
exports.generateQuiz = onCall({ 
  secrets: [geminiKey],
  cors: true 
}, async (request) => {
  const { topic, pathwayTitle } = request.data;

  const genAI = new GoogleGenerativeAI(geminiKey.value());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create a 3-question MCQ quiz for "${topic}" in "${pathwayTitle}". Return ONLY a raw JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..."}]`;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    return JSON.parse(response.replace(/```json/gi, '').replace(/```/gi, '').trim());
  } catch (error) {
    throw new HttpsError("internal", "Quiz Generation Failed");
  }
});

exports.generateRoadmap = onCall({ 
  secrets: [geminiKey],
  cors: true 
}, async (request) => {
  const { searchTerm } = request.data;
  if (!searchTerm) throw new HttpsError("invalid-argument", "Topic is required");

  const genAI = new GoogleGenerativeAI(geminiKey.value());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert educational roadmap creator. Create a comprehensive learning roadmap for the topic: "${searchTerm}".
        Fix any spelling mistakes or typos in the topic name and provide the correct, professional title.
        You MUST respond strictly with a valid JSON object and nothing else. Do not include markdown tags.
        
        CRITICAL RULES:
        1. EXACT KEYS: Use EXACTLY "beginner", "intermediate", and "advanced".
        2. WORD LIMIT: "description" MUST be strictly LESS THAN 20 words.
        3. TOPICS LIMIT: MAXIMUM 5 topics per level.
        4. MINIMUMS: At LEAST 2 certs and 2 resources per level. Use real, high-quality links.

        Use this EXACT JSON structure:
        {
          "officialTitle": "Corrected and Capitalized Title (e.g., Machine Learning)",
          "levels": {
            "beginner": {
              "title": "Level 1: Beginner",
              "description": "Short description strictly under 20 words.",
              "topics": ["Topic 1", "Topic 2"],
              "certs": [{"name": "Cert", "link": "https://..."}],
              "resources": [{"name": "Resource", "link": "https://..."}]
            },
            "intermediate": {
              "title": "Level 2: Intermediate",
              "description": "...",
              "topics": ["..."],
              "certs": [],
              "resources": []
            },
            "advanced": {
              "title": "Level 3: Advanced",
              "description": "...",
              "topics": ["..."],
              "certs": [],
              "resources": []
            }
          }
        }
  `;

  try {
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    // JSON එක විතරක් පිරිසිදුව වෙන් කරගන්නවා
    return JSON.parse(response.replace(/```json/gi, '').replace(/```/gi, '').trim());
  } catch (error) {
    throw new HttpsError("internal", "Roadmap Generation Failed: " + error.message);
  }
});

exports.generateArticle = onCall({ 
  secrets: [geminiKey],
  cors: true 
}, async (request) => {
  const { topic, levelTitle, pathwayTitle } = request.data;
  if (!topic) throw new HttpsError("invalid-argument", "Topic is required");

  const genAI = new GoogleGenerativeAI(geminiKey.value());
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert tutor. Explain "${topic}" (Level: "${levelTitle}", Course: "${pathwayTitle}"). Keep it highly engaging, simple, and under 300 words. Format strictly in HTML using <h3>, <p>, <ul>, <li>, <strong>. No markdown blocks.`;

  try {
    const result = await model.generateContent(prompt);
    let htmlContent = result.response.text();
    return htmlContent.replace(/```html/gi, '').replace(/```/gi, '').trim();
  } catch (error) {
    if (error.message.includes("429")) {
      throw new HttpsError("resource-exhausted", "RATE_LIMIT");
    }
    throw new HttpsError("internal", "Article Generation Failed");
  }
});

// 5. Fetch YouTube Video Function
exports.fetchYouTubeVideo = onCall({ 
  secrets: [youtubeKey],
  cors: true 
}, async (request) => {
  const { topic, pathwayTitle } = request.data;
  
  const query = encodeURIComponent(`${topic} ${pathwayTitle} tutorial`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${youtubeKey.value()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return { videoId: data.items[0].id.videoId };
    }
    return { videoId: null };
  } catch (error) {
    throw new HttpsError("internal", "YouTube Fetch Failed");
  }
});