import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../app.js';
import Analysis from '../models/Analysis.js';
import groq from '../config/groq.js';

describe('AI-Powered Security Finding Analysis API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Health check endpoint test
  describe('GET /api/v1/health', () => {
    it('should return 200 and success true', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });

  // 2. Validation failure endpoint test
  describe('POST /api/v1/analyze - Validation Failure', () => {
    it('should return 400 if validation fails due to empty or missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/analyze')
        .send({
          organization: '',
          asset: 'App Portal',
          finding: 'Short', // Less than 10 characters
          severity: 'Critical',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed.');
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 if severity enum is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/analyze')
        .send({
          organization: 'AnantNetra',
          asset: 'App Portal',
          finding: 'An SQL injection vulnerability was found in the login endpoint.',
          severity: 'Extreme', // Invalid enum
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].field).toBe('severity');
    });
  });

  // 3. Analyze endpoint success test
  describe('POST /api/v1/analyze - Success', () => {
    it('should successfully call AI service and save result to database', async () => {
      const mockAiOutput = {
        priority: 'High',
        businessImpact: 'SQL Injection can lead to total database compromise.',
        recommendedAction: 'Use parameterized queries and sanitize user input.',
        resolutionTimeline: 'Within 24 Hours',
      };

      const mockDbRecord = {
        _id: '60c72b2f9b1d8b2a3c8e4d5f',
        organization: 'AnantNetra',
        asset: 'App Portal',
        finding: 'An SQL injection vulnerability was found in the login endpoint.',
        severity: 'Critical',
        priority: 'High',
        importance: 'SQL Injection can lead to total database compromise.',
        recommendation: 'Use parameterized queries and sanitize user input.',
        timeline: 'Within 24 Hours',
        createdAt: '2026-06-27T10:00:00.000Z',
        updatedAt: '2026-06-27T10:00:00.000Z',
      };

      // Mock Groq SDK response
      const groqSpy = jest.spyOn(groq.chat.completions, 'create').mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAiOutput),
            },
          },
        ],
      });

      // Mock Mongoose save
      const dbSpy = jest.spyOn(Analysis, 'create').mockResolvedValue(mockDbRecord);

      const response = await request(app)
        .post('/api/v1/analyze')
        .send({
          organization: 'AnantNetra',
          asset: 'App Portal',
          finding: 'An SQL injection vulnerability was found in the login endpoint.',
          severity: 'Critical',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Analysis generated successfully.');
      expect(response.body.data).toEqual(mockDbRecord);

      expect(groqSpy).toHaveBeenCalled();
      expect(dbSpy).toHaveBeenCalled();
    });
  });

  // 4. History endpoint GET test
  describe('GET /api/v1/history', () => {
    it('should return list of previous analyses sorted by createdAt descending', async () => {
      const mockHistoryList = [
        {
          _id: '1',
          organization: 'Healthcare',
          asset: 'Patient Portal',
          finding: 'Vulnerability finding 1 details...',
          severity: 'High',
          priority: 'High',
          importance: 'High business risk',
          recommendation: 'Fix it',
          timeline: 'Within 48 Hours',
        },
      ];

      const findSpy = jest.spyOn(Analysis, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockHistoryList),
      });

      const response = await request(app).get('/api/v1/history');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockHistoryList);
      expect(findSpy).toHaveBeenCalled();
    });
  });

  // 5. History delete endpoint test
  describe('DELETE /api/v1/history/:id', () => {
    it('should delete record and return success message if ID exists', async () => {
      const deleteSpy = jest
        .spyOn(Analysis, 'findByIdAndDelete')
        .mockResolvedValue({ _id: '1' });

      const response = await request(app).delete('/api/v1/history/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Analysis deleted successfully.');
      expect(deleteSpy).toHaveBeenCalledWith('1');
    });

    it('should return 404 if record is not found to delete', async () => {
      jest.spyOn(Analysis, 'findByIdAndDelete').mockResolvedValue(null);

      const response = await request(app).delete('/api/v1/history/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Security analysis record not found.');
    });
  });
});
