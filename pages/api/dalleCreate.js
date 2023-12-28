// pages/api/dalleCreate.js

import OpenAI from "openai";

export const config = {
  api: {
    responseLimit: false, // Increase the limit to 8MB or another suitable size (no limit at all)
  },
};

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { prompt } = req.body;

  try {
    const image = await openai.images.generate({
      model: "dall-e-3", // or it could be "dall-e-2"
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      style: "vivid",
    });

    console.log("image", image);
    res.status(200).json({ message: 'Success', data: image });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
