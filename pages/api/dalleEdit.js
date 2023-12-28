// pages/api/dalleEdit.js
import OpenAI from "openai";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("req", req.body);

  const { prompt } = req.body;
  const image = req.file.buffer; // This is your image data
  try {
    const imageEdited = await openai.images.edit({
      image: image,
      prompt: prompt,
      model: "dall-e-2", // or it could be "dall-e-2"
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      // style: "vivid",
    });

    console.log("image.data", imageEdited.data);
    res.status(200).json({ message: "Success", data: imageEdited.data });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
