
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 160
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40
  },

  destination: {
    type: String,
    required: true,
    enum: [
      "USA",
      "United States",
      "Canada",
      "UK",
      "United Kingdom",
      "Australia",
      "New Zealand",
      "Other"
    ]
  },

  service: {
    type: String,
    required: false ,
    enum: [
      "Student Visa",
      "Student visa guidance",
      "University Admission",
      "University / course selection",
      "Visitor Visa",
      "Work Visa",
      "Immigration Consultation",
      " Application preparation",
      "Interview / Pre-departure",
      "Other"
    ]
  },

  message: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ""
  },

  status: {
    type: String,
    enum: [
      "new",
      "contacted",
      "in_progress",
      "completed",
      "rejected"
    ],
    default: "new",
    index: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  source: {
    type: String,
    default: "website",
    maxlength: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Inquiry", schema);
