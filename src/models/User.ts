import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String }
  },
  profile: {
    monthlySalary: { type: Number, default: 0 },
    age: { type: Number },
    familyMembers: { type: Number, default: 1 },
    maritalStatus: { type: String, default: 'not_specified' },
    livingCostLevel: { type: String, default: 'Medium' },
    incomeStability: { type: String, default: 'Full-time' },
    fixedExpenses: {
      rent: { type: Number, default: 0 },
      electricity: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      gas: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 },
      internet: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 }
    },
    debts: [{
      id: String,
      description: String,
      monthlyAmount: Number,
      priority: String,
      dueDate: String
    }],
    annualExpenses: [{
      id: String,
      description: String,
      totalAmount: Number,
      priority: String,
      expectedMonth: String
    }],
    optionalExpenses: {
      streaming: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      medical: { type: Number, default: 0 }
    },
    preferences: {
      savingPriority: { type: String, default: 'not_specified' },
      riskTolerance: { type: String, default: 'not_specified' },
      emergencyFundPercentage: { type: Number, default: 10 },
      monthlyPriorities: [String]
    }
  }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
