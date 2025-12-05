export interface Recipe {
  id: string;
  title: string;
  description?: string;
  prepTime?: string;
  servings?: string;
  calories?: number;
  goal: string;
  ingredients: string[];
  instructions: string[];
  videoUrl?: string; // Added optional YouTube/Video link
  createdAt: string;
}

// Fixed: Use const object instead of enum to prevent TypeScript 'type vs value' errors
export const AppTheme = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

// This allows us to use AppTheme as a type (e.g. theme: AppTheme)
export type AppTheme = typeof AppTheme[keyof typeof AppTheme];

export type GoalType = 'lose' | 'maintain' | 'gain' | 'muscle';

export interface CalculatorStats {
  calories: number;
  protein: number;
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  adjustment: number; // Calories added/removed for goal
  proteinMultiplier: number; // Grams per kg
}