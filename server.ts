import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: "connected", // Prisma handles connection
    });
  });

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, avatar } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatar,
          profile: {
            create: {
              familyMembers: 1,
              maritalStatus: 'not_specified',
              livingCostLevel: 'Medium',
              incomeStability: 'Full-time',
              monthlySalary: 0,
              fixedExpenses: JSON.stringify({ rent: 0, electricity: 0, water: 0, gas: 0, transportation: 0, internet: 0, mobile: 0 }),
              optionalExpenses: JSON.stringify({ streaming: 0, education: 0, medical: 0 }),
              debts: JSON.stringify([]),
              annualExpenses: JSON.stringify([]),
              monthlyPriorities: JSON.stringify([]),
              emergencyFundPercentage: 10,
              savingPriority: 'not_specified',
              riskTolerance: 'not_specified',
            }
          }
        }
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: { profile: true }
      });
      
      if (user && await bcrypt.compare(password, user.password)) {
        // Transform profile back to the expected format
        const profile = user.profile ? {
          ...user.profile,
          fixedExpenses: JSON.parse(user.profile.fixedExpenses),
          optionalExpenses: JSON.parse(user.profile.optionalExpenses),
          debts: JSON.parse(user.profile.debts),
          annualExpenses: JSON.parse(user.profile.annualExpenses),
          preferences: {
            savingPriority: user.profile.savingPriority,
            riskTolerance: user.profile.riskTolerance,
            emergencyFundPercentage: user.profile.emergencyFundPercentage,
            monthlyPriorities: JSON.parse(user.profile.monthlyPriorities),
          }
        } : null;

        res.json({ 
          account: { name: user.name, email: user.email, avatar: user.avatar }, 
          profile 
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message || "Login failed" });
    }
  });

  app.get("/api/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: { profile: true }
      });
      if (user) {
        const profile = user.profile ? {
          ...user.profile,
          fixedExpenses: JSON.parse(user.profile.fixedExpenses),
          optionalExpenses: JSON.parse(user.profile.optionalExpenses),
          debts: JSON.parse(user.profile.debts),
          annualExpenses: JSON.parse(user.profile.annualExpenses),
          preferences: {
            savingPriority: user.profile.savingPriority,
            riskTolerance: user.profile.riskTolerance,
            emergencyFundPercentage: user.profile.emergencyFundPercentage,
            monthlyPriorities: JSON.parse(user.profile.monthlyPriorities),
          }
        } : null;
        res.json({ ...user, profile });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const { email, account, profile } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name: account.name,
          avatar: account.avatar,
          profile: {
            upsert: {
              create: {
                familyMembers: profile.familyMembers,
                maritalStatus: profile.maritalStatus,
                livingCostLevel: profile.livingCostLevel,
                incomeStability: profile.incomeStability,
                monthlySalary: profile.monthlySalary,
                fixedExpenses: JSON.stringify(profile.fixedExpenses),
                optionalExpenses: JSON.stringify(profile.optionalExpenses),
                debts: JSON.stringify(profile.debts),
                annualExpenses: JSON.stringify(profile.annualExpenses),
                monthlyPriorities: JSON.stringify(profile.preferences.monthlyPriorities),
                emergencyFundPercentage: profile.preferences.emergencyFundPercentage,
                savingPriority: profile.preferences.savingPriority,
                riskTolerance: profile.preferences.riskTolerance,
              },
              update: {
                familyMembers: profile.familyMembers,
                maritalStatus: profile.maritalStatus,
                livingCostLevel: profile.livingCostLevel,
                incomeStability: profile.incomeStability,
                monthlySalary: profile.monthlySalary,
                fixedExpenses: JSON.stringify(profile.fixedExpenses),
                optionalExpenses: JSON.stringify(profile.optionalExpenses),
                debts: JSON.stringify(profile.debts),
                annualExpenses: JSON.stringify(profile.annualExpenses),
                monthlyPriorities: JSON.stringify(profile.preferences.monthlyPriorities),
                emergencyFundPercentage: profile.preferences.emergencyFundPercentage,
                savingPriority: profile.preferences.savingPriority,
                riskTolerance: profile.preferences.riskTolerance,
              }
            }
          }
        },
        create: {
          email,
          password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
          name: account.name,
          avatar: account.avatar,
          profile: {
            create: {
              familyMembers: profile.familyMembers,
              maritalStatus: profile.maritalStatus,
              livingCostLevel: profile.livingCostLevel,
              incomeStability: profile.incomeStability,
              monthlySalary: profile.monthlySalary,
              fixedExpenses: JSON.stringify(profile.fixedExpenses),
              optionalExpenses: JSON.stringify(profile.optionalExpenses),
              debts: JSON.stringify(profile.debts),
              annualExpenses: JSON.stringify(profile.annualExpenses),
              monthlyPriorities: JSON.stringify(profile.preferences.monthlyPriorities),
              emergencyFundPercentage: profile.preferences.emergencyFundPercentage,
              savingPriority: profile.preferences.savingPriority,
              riskTolerance: profile.preferences.riskTolerance,
            }
          }
        }
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Expense Routes
  app.get("/api/expenses/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const expenses = await prisma.expense.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' }
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const { email, category, amount, description, date } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const expense = await prisma.expense.create({
        data: {
          userId: user.id,
          category,
          amount: parseFloat(amount),
          description,
          date: new Date(date)
        }
      });
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to create expense" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.expense.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
