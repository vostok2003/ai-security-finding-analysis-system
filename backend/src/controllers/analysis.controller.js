import { analyzeFindingWithAI } from '../services/ai.service.js';
import Analysis from '../models/Analysis.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

/**
 * @desc    Analyze security finding using Groq AI and store in database
 * @route   POST /api/v1/analyze
 * @access  Public
 */
export const analyzeSecurityFinding = asyncHandler(async (req, res) => {
  const { organization, asset, finding, severity } = req.body;

  // Run AI analysis
  const aiResults = await analyzeFindingWithAI({
    organization,
    asset,
    finding,
    severity,
  });

  // Save to database
  const analysis = await Analysis.create({
    organization,
    asset,
    finding,
    severity,
    priority: aiResults.priority,
    importance: aiResults.importance,
    recommendation: aiResults.recommendation,
    timeline: aiResults.timeline,
  });

  logger.info(`Security finding analyzed and saved successfully. ID: ${analysis._id}`);

  // Return standard success response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analysis,
        'Analysis generated successfully.'
      )
    );
});

/**
 * @desc    Get all security analysis history
 * @route   GET /api/v1/history
 * @access  Public
 */
export const getAnalysisHistory = asyncHandler(async (req, res) => {
  const history = await Analysis.find({}).sort({ createdAt: -1 });

  logger.info(`Retrieved ${history.length} security analysis records from database.`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        history,
        'History retrieved successfully.'
      )
    );
});

/**
 * @desc    Delete a security analysis record from history
 * @route   DELETE /api/v1/history/:id
 * @access  Public
 */
export const deleteAnalysisHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const analysis = await Analysis.findByIdAndDelete(id);

  if (!analysis) {
    throw new ApiError(404, 'Security analysis record not found.');
  }

  logger.info(`Deleted security analysis record with ID: ${id}`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        'Analysis deleted successfully.'
      )
    );
});
