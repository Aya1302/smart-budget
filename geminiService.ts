
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, BudgetAllocation, PricePrediction, ShoppingItem } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBudgetOptimization(profile: UserProfile): Promise<BudgetAllocation[]> {
  const totalIncome = profile.monthlySalary;
  const fixedExpensesTotal = (Object.values(profile.fixedExpenses) as number[]).reduce((a, b) => a + b, 0);
  const optionalExpensesTotal = (Object.values(profile.optionalExpenses) as number[]).reduce((a, b) => a + b, 0);
  
  const debtsTotal = profile.debts.reduce((sum, d) => sum + d.monthlyAmount, 0);
  // Provision for annual expenses: Total / 12
  const annualProvisionTotal = profile.annualExpenses.reduce((sum, e) => sum + (e.totalAmount / 12), 0);

  const priorities = profile.preferences.monthlyPriorities.join(" > ");

  const prompt = `
    As a senior financial advisor, optimize this monthly budget (all values in Egyptian Pound - EGP) for a person/family with:
    - Total Monthly Income: ${totalIncome}
    - Family Size: ${profile.familyMembers}
    - Marital Status: ${profile.maritalStatus}
    - Living Cost Level: ${profile.livingCostLevel}
    - Income Stability: ${profile.incomeStability}
    - Fixed Monthly Obligations (Rent, Utilities, etc.): ${fixedExpensesTotal}
    - Monthly Debt Repayments: ${debtsTotal}
    - Monthly Savings Provision for Annual Expenses: ${annualProvisionTotal}
    - Optional Monthly Services: ${optionalExpensesTotal}
    - Saving Priority Preference: ${profile.preferences.savingPriority}
    - Risk Tolerance Preference: ${profile.preferences.riskTolerance}
    - User-Defined Priority Ranking (Highest to Lowest): ${priorities}
    
    Calculate how to best distribute the REMAINING income after all above costs.
    The categories to allocate are based on the User-Defined Priority Ranking: ${profile.preferences.monthlyPriorities.join(", ")}.
    
    Return the result as a list of allocations for the remaining budget. Each allocation should have:
    - category (string)
    - amount (number)
    - percentage (number of remaining income)
    - color (a tailwind color class)
    - advice (a short specific tip)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              percentage: { type: Type.NUMBER },
              color: { type: Type.STRING },
              advice: { type: Type.STRING }
            },
            required: ["category", "amount", "percentage", "color", "advice"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Budget Optimization Error:", error);
    return [];
  }
}

export async function getPricePredictions(): Promise<PricePrediction[]> {
  const prompt = `
    Analyze current global and local economic trends in Egypt to predict price changes (in Egyptian Pound - EGP) for next month for the following commodities:
    1. Bread & Cereals
    2. Fresh Milk
    3. Eggs
    4. Fuel / Gasoline
    5. Internet Services
    6. Cooking Oil
    
    For each item, provide:
    - item (string)
    - currentPrice (average estimated number)
    - predictedPrice (estimated number for next month)
    - trend ('up', 'down', or 'stable')
    - confidence (a number between 0 and 1)
    - advice (one short sentence advice for the user)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              currentPrice: { type: Type.NUMBER },
              predictedPrice: { type: Type.NUMBER },
              trend: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              advice: { type: Type.STRING }
            },
            required: ["item", "currentPrice", "predictedPrice", "trend", "confidence", "advice"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Price Prediction Error:", error);
    return [];
  }
}

export async function generateShoppingList(profile: UserProfile, budgetLimit: number): Promise<ShoppingItem[]> {
  const prompt = `
    Generate a smart, optimized monthly grocery shopping list for a family of ${profile.familyMembers}.
    The total budget for this list must not exceed ${budgetLimit} EGP.
    Living Cost Level is ${profile.livingCostLevel}.
    Focus on healthy essentials and value-for-money items.
    
    Return a list of objects with:
    - name (string)
    - quantity (string, e.g., '5kg', '3 liters')
    - estimatedCost (number)
    - isPriority (boolean, true for must-have essentials)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.STRING },
              estimatedCost: { type: Type.NUMBER },
              isPriority: { type: Type.BOOLEAN }
            },
            required: ["name", "quantity", "estimatedCost", "isPriority"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Shopping List Error:", error);
    return [];
  }
}
