import { z } from 'zod';

export const createAnalysisValidator = z.object({
  organization: z
    .string({ required_error: 'Organization is required.' })
    .trim()
    .min(2, 'Organization must be between 2 and 100 characters.')
    .max(100, 'Organization must be between 2 and 100 characters.'),
  asset: z
    .string({ required_error: 'Asset is required.' })
    .trim()
    .min(2, 'Asset must be between 2 and 100 characters.')
    .max(100, 'Asset must be between 2 and 100 characters.'),
  finding: z
    .string({ required_error: 'Finding is required.' })
    .trim()
    .min(10, 'Finding must be between 10 and 1000 characters.')
    .max(1000, 'Finding must be between 10 and 1000 characters.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    errorMap: () => ({
      message: 'Severity must be one of: Low, Medium, High, or Critical.',
    }),
  }),
});
