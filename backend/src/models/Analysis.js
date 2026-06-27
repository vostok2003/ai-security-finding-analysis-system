import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
      minlength: [2, 'Organization must be at least 2 characters'],
      maxlength: [100, 'Organization cannot exceed 100 characters'],
    },
    asset: {
      type: String,
      required: [true, 'Asset is required'],
      trim: true,
      minlength: [2, 'Asset must be at least 2 characters'],
      maxlength: [100, 'Asset cannot exceed 100 characters'],
    },
    finding: {
      type: String,
      required: [true, 'Finding is required'],
      trim: true,
      minlength: [10, 'Finding must be at least 10 characters'],
      maxlength: [1000, 'Finding cannot exceed 1000 characters'],
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      trim: true,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Severity must be one of: Low, Medium, High, Critical',
      },
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      trim: true,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Priority must be one of: Low, Medium, High, Critical',
      },
    },
    importance: {
      type: String,
      required: [true, 'Importance is required'],
      trim: true,
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
      trim: true,
      enum: {
        values: [
          'Immediately',
          'Within 24 Hours',
          'Within 48 Hours',
          'Within 7 Days',
          'Within 30 Days',
        ],
        message: 'Timeline must be one of: Immediately, Within 24 Hours, Within 48 Hours, Within 7 Days, Within 30 Days',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
