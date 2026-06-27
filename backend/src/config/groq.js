import Groq from 'groq-sdk';
import logger from '../utils/logger.js';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  logger.warn('GROQ_API_KEY is not defined. AI calls will fail unless provided in environment.');
}

const groq = new Groq({
  apiKey,
});

export default groq;
