// pages/api/printfulPrepareMugs.js

import axios from 'axios';

const printfulApi = axios.create({
  baseURL: 'https://api.printful.com',
  headers: {
    'X-PF-Store-Id': '12835940', // Your Store ID
    'Authorization': `Bearer ${process.env.PRINTFUL_API_TOKEN}`, // OAuth 2.0 Token
  },
});

export default async function handler(req, res) {
  const body = req.body;
  try {
    const response = await printfulApi.post('/store/products', body);
    console.log(response.data);
    res.status(200).json({ message: 'Success', data: response.data });
  } catch (error) {
    console.error("Error interacting with Printful API: ", error);
    res.status(500).json({ message: 'Error', error: error.message });
  }
}
