import groq from '../config/groq.js';
import { SYSTEM_PROMPT, createUserPrompt } from '../prompts/securityAnalysis.prompt.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Clean LLM response string by removing markdown code block ticks if present.
 */
const sanitizeJsonString = (rawString) => {
  let cleaned = rawString.trim();
  // Strip markdown code block indicators if returned despite system instructions
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
};

/**
 * Query Groq AI and parse structured security finding analysis.
 * @param {Object} input - { organization, asset, finding, severity }
 * @returns {Promise<Object>} - { priority, importance, recommendation, timeline }
 */
export const analyzeFindingWithAI = async ({ organization, asset, finding, severity }) => {
  try {
    const userPrompt = createUserPrompt({ organization, asset, finding, severity });

    logger.info(`Sending analysis request to Groq for asset: ${asset} in org: ${organization}`);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.2, // Lower temperature for more consistent JSON structure
    });

    const rawResponseContent = completion.choices[0]?.message?.content;
    if (!rawResponseContent) {
      throw new ApiError(502, 'AI model returned empty response.');
    }

    const sanitized = sanitizeJsonString(rawResponseContent);
    let parsedData;
    try {
      parsedData = JSON.parse(sanitized);
    } catch (parseError) {
      logger.error(`Failed to parse AI JSON response: ${sanitized}`);
      throw new ApiError(502, 'AI response is not valid JSON.', [
        { field: 'ai_response', message: parseError.message },
      ]);
    }

    // Verify fields
    const { priority, businessImpact, recommendedAction, resolutionTimeline } = parsedData;

    if (!priority || !businessImpact || !recommendedAction || !resolutionTimeline) {
      logger.error(`AI JSON response missing required fields: ${JSON.stringify(parsedData)}`);
      throw new ApiError(502, 'AI response is missing critical analysis fields.', [
        {
          field: 'ai_response',
          message: 'One or more required fields (priority, businessImpact, recommendedAction, resolutionTimeline) are missing.',
        },
      ]);
    }

    // Validate Priority Enum values
    const allowedPriorities = ['Critical', 'High', 'Medium', 'Low'];
    if (!allowedPriorities.includes(priority)) {
      throw new ApiError(502, `AI generated invalid priority: ${priority}. Expected one of: ${allowedPriorities.join(', ')}`);
    }

    // Validate Timeline Enum values
    const allowedTimelines = [
      'Immediately',
      'Within 24 Hours',
      'Within 48 Hours',
      'Within 7 Days',
      'Within 30 Days',
    ];
    if (!allowedTimelines.includes(resolutionTimeline)) {
      throw new ApiError(502, `AI generated invalid timeline: ${resolutionTimeline}. Expected one of: ${allowedTimelines.join(', ')}`);
    }

    // Map to db schema fields
    return {
      priority,
      importance: businessImpact,
      recommendation: recommendedAction,
      timeline: resolutionTimeline,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Groq AI integration error: ${error.message}`);
    throw new ApiError(502, `Groq API Error: ${error.message}`);
  }
};
