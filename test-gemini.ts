import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
async function test() {
  try {
    const result = await model.generateContent('Hola');
    console.log('Success:', result.response.text());
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
