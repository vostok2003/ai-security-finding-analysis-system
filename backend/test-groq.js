import 'dotenv/config';
import Groq from 'groq-sdk';

console.log("Isolated test with llama-3.1-8b-instant starting...");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

try {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Say Hello',
      },
    ],
    model: 'llama-3.1-8b-instant',
  });
  console.log("Success! AI Response:");
  console.log(JSON.stringify(completion.choices[0]?.message));
} catch (error) {
  console.error("Failed with error:");
  console.error(error);
}
