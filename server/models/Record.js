const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    evidenceUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    dateSet: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
