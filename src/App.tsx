import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Wand2, 
  BookOpen, 
  Settings, 
  Leaf, 
  Activity, 
  Moon, 
  Sun,
  ChevronRight,
  Info,
  ChefHat,
  Star,
  Flame,
  Dumbbell,
  CheckCircle,
  Clock,
  Home,
  Laptop
} from 'lucide-react';

// Import AppTheme as a Value (from the const object)
import { AppTheme } from './types';
// Import Interfaces as Types
import type { Recipe, CalculatorStats } from './types';

import { generateRecipe } from './services/geminiService';
import RecipeDetailModal from './components/RecipeDetailModal';

// --- Hardcoded Data: Sean's Recipes ---
const SEANS_RECIPES: Recipe[] = [
  {
    id: 'sean-mapo-tofu',
    title: "Sean's Mapo Tofu",
    description: "A spicy, protein-packed comfort dish perfect for muscle building. Rich savory sauce with soft tofu.",
    prepTime: "25 min",
    servings: "2",
    calories: 720,
    goal: "muscle",
    videoUrl: "https://youtube.com/shorts/ziWiWjZ-ETI?feature=share",
    ingredients: [
      "600g soft tofu (1 pack), cut into bite-size pieces",
      "200g minced meat",
      "150ml chicken stock",
      "50ml chilli oil",
      "2 tbsp spicy bean sauce",
      "1 tsp cornstarch mixed with 55ml water",
      "1 spring onion, chopped",
      "1 clove garlic, minced",
      "2cm ginger, minced",
      "1/2 tsp Chinese five spice",
      "1/2 tsp sesame oil",
      "1 tsp caster sugar",
      "1 tsp ground chilli peppers (optional)"
    ],
    instructions: [
      "Prep: Cut tofu into cubes. Chop spring onions, garlic, and ginger. Mix cornstarch with water.",
      "Sauté Aromatics: Heat oil in a pan on high heat. Add garlic and ginger, stir for 1 minute.",
      "Cook Meat: Add minced meat, breaking it up. Cook until golden brown (5-6 mins).",
      "Season: Add Chinese five spice and spicy bean sauce. Mix until meat is evenly coated.",
      "Simmer: Pour in chicken stock and stir for 2-3 minutes.",
      "Thicken & Combine: Reduce to medium heat. Stir in cornstarch mixture. Add tofu and chilli oil.",
      "Finish: Gently mix without breaking tofu. Stir in sugar and spring onions.",
      "Serve: Drizzle with sesame oil and serve over hot rice."
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sean-kimchi-stew',
    title: "Sean's Kimchi Stew",
    description: "Recipe coming soon...",
    prepTime: "--",
    servings: "--",
    calories: 0,
    goal: "maintain",
    ingredients: ["Coming soon"],
    instructions: ["Recipe details will be added shortly."],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sean-garlic-chicken',
    title: "Sean's Garlic Chicken",
    description: "Recipe coming soon...",
    prepTime: "--",
    servings: "--",
    calories: 0,
    goal: "lose",
    ingredients: ["Coming soon"],
    instructions: ["Recipe details will be added shortly."],
    createdAt: new Date().toISOString()
  }
];

// --- Views Components ---

// 1. Home View
const HomeView = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const cards = [
    { icon: '💪', title: 'Physical Health', desc: 'Proper nutrition fuels your body and strengthens immunity.' },
    { icon: '🧠', title: 'Mental Clarity', desc: 'Balanced nutrition supports cognitive function.' },
    { icon: '⚡', title: 'Energy Levels', desc: 'Quality nutrients provide sustained energy without crashes.' },
    { icon: '🛡️', title: 'Disease Prevention', desc: 'Good nutrition reduces risk of chronic disease.' },
    { icon: '😊', title: 'Mood Balance', desc: 'Foods help regulate hormones for better mood.' },
    { icon: '🌟', title: 'Quality of Life', desc: 'Nutrition enhances overall life quality.' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col items-center text-center space-y-4 py-8">
        <Leaf size={64} className="text-green-500" />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          The Importance of Nutrition
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Discover how the right food can transform your life, health, and happiness.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{c.icon}</div>
            <h3 className="text-xl font-bold mb-2">{c.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button 
          onClick={onGetStarted}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-1"
        >
          <Activity size={24} />
          Get Started
        </button>
      </div>
    </div>
  );
};

// 2. Calculator View
const CalculatorView = () => {
  const [formData, setFormData] = useState({
    age: '20',
    gender: 'male',
    weight: '70',
    height: '175',
    activity: '1.375',
    goal: 'maintain'
  });
  const [stats, setStats] = useState<CalculatorStats | null>(null);

  const calculate = () => {
    const age = parseInt(formData.age) || 20;
    const weight = parseFloat(formData.weight) || 70;
    const height = parseFloat(formData.height) || 175;
    const activity = parseFloat(formData.activity) || 1.2;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += formData.gender === 'male' ? 5 : -161;

    const tdee = bmr * activity;
    
    let adjustment = 0;
    let proteinMult = 1.0;

    switch (formData.goal) {
      case 'lose':
        adjustment = -500;
        proteinMult = 1.2; // Higher protein to preserve muscle
        break;
      case 'gain':
        adjustment = 300;
        proteinMult = 1.2;
        break;
      case 'muscle':
        adjustment = 200;
        proteinMult = 1.6; // High protein for synthesis
        break;
      case 'maintain':
      default:
        proteinMult = 1.0;
    }

    setStats({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      adjustment,
      proteinMultiplier: proteinMult,
      calories: Math.round(tdee + adjustment),
      protein: Math.round(weight * proteinMult)
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const GOAL_OPTIONS = [
    { value: 'lose', label: 'Lose Weight' },
    { value: 'maintain', label: 'Maintain' },
    { value: 'gain', label: 'Gain Weight' },
    { value: 'muscle', label: 'Build Muscle' }
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 animate-fade-in pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Nutrition Calculator</h2>
        <p className="text-gray-500 dark:text-gray-400">Calculate your optimal macro-nutrients based on your student lifestyle.</p>
      </div>

      {/* Unified Calculator Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        
        {/* Row 1: Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Age</label>
            <div className="relative">
              <input 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={handleInput} 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none transition font-medium"
              />
              <span className="absolute right-4 top-4 text-gray-400 text-sm">years</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleInput}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none transition font-medium appearance-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Weight</label>
             <div className="relative">
              <input 
                name="weight" 
                type="number" 
                value={formData.weight} 
                onChange={handleInput}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none transition font-medium"
              />
              <span className="absolute right-4 top-4 text-gray-400 text-sm">kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Height</label>
             <div className="relative">
              <input 
                name="height" 
                type="number" 
                value={formData.height} 
                onChange={handleInput}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none transition font-medium"
              />
              <span className="absolute right-4 top-4 text-gray-400 text-sm">cm</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Activity Level</label>
            <select 
              name="activity" 
              value={formData.activity} 
              onChange={handleInput}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none transition font-medium"
            >
              <option value="1.2">Sedentary (Little or no exercise)</option>
              <option value="1.375">Light (Exercise 1-3 days/week)</option>
              <option value="1.55">Moderate (Exercise 3-5 days/week)</option>
              <option value="1.725">Active (Exercise 6-7 days/week)</option>
              <option value="1.9">Very Active (Hard exercise & physical job)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Goal</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GOAL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData(prev => ({ ...prev, goal: option.value }))}
                  className={`py-4 px-2 rounded-xl text-sm font-bold transition border-2 ${
                    formData.goal === option.value
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t dark:border-gray-700">
          <button 
            onClick={calculate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/30 transition transform active:scale-[0.98] text-lg flex items-center justify-center gap-2"
          >
            <Calculator size={24} />
            Calculate Plan
          </button>
        </div>
      </div>

      {stats && (
        <div className="space-y-6 animate-slide-up">
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Calories Card */}
             <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium mb-2 uppercase tracking-wide text-xs">Daily Target</span>
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{stats.calories}</span>
                <span className="text-green-600 font-bold mt-1">kcal</span>
             </div>

             {/* Protein Card - Emphasized */}
             <div className="bg-green-600 p-8 rounded-3xl shadow-xl shadow-green-500/20 flex flex-col items-center justify-center text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                  <Dumbbell size={120} />
                </div>
                <div className="flex items-center gap-2 mb-2 opacity-90 relative z-10">
                  <Dumbbell size={18} />
                  <span className="font-bold uppercase tracking-wide text-xs">Protein Goal</span>
                </div>
                <span className="text-5xl font-black relative z-10">{stats.protein}g</span>
                <span className="text-sm opacity-90 mt-1 relative z-10">Minimum daily intake</span>
             </div>
          </div>

          {/* Math Reasoning */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Info size={18} className="text-blue-500" />
              The Science
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs h-fit whitespace-nowrap">Step 1</span>
                <p>Calculated BMR (<strong>{stats.bmr}</strong>) using Mifflin-St Jeor equation.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs h-fit whitespace-nowrap">Step 2</span>
                <p>Multiplied by activity level ({formData.activity}) to get TDEE (<strong>{stats.tdee}</strong>).</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-xs h-fit whitespace-nowrap">Step 3</span>
                <p>Applied goal adjustment (<strong>{stats.adjustment > 0 ? '+' : ''}{stats.adjustment}</strong> kcal) for {formData.goal}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Generator View
const GeneratorView = ({ onRecipeGenerated }: { onRecipeGenerated: (recipe: Recipe) => void }) => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    goal: 'maintain',
    protein: 'chicken',
    carb: 'rice',
    meal: 'lunch',
    time: 'medium',
    restrictions: {
      glutenFree: false,
      dairyFree: false,
      lowCarb: false
    }
  });

  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const restrictionsList = Object.entries(params.restrictions)
        .filter(([_, active]) => active)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase());

      const recipe = await generateRecipe(
        params.goal,
        params.protein,
        params.carb,
        params.meal,
        params.time,
        restrictionsList
      );
      setPreviewRecipe(recipe);
    } catch (e) {
      console.error(e);
      alert('Failed to generate recipe. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreview = () => {
    if (previewRecipe) {
      onRecipeGenerated(previewRecipe);
      setPreviewRecipe(null);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
        <div className="text-center space-y-2 mb-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <Wand2 className="text-green-500" />
            AI Chef
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Custom recipes generated in seconds.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
              <select 
                value={params.goal}
                onChange={(e) => setParams({...params, goal: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="lose">Lose Fat</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain Weight</option>
                <option value="muscle">Build Muscle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Protein</label>
              <select 
                value={params.protein}
                onChange={(e) => setParams({...params, protein: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="chicken">Chicken</option>
                <option value="beef">Beef</option>
                <option value="tofu">Tofu</option>
                <option value="fish">Fish</option>
                <option value="eggs">Eggs</option>
                <option value="lentils">Lentils</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Carb Source</label>
              <select 
                value={params.carb}
                onChange={(e) => setParams({...params, carb: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="rice">Rice</option>
                <option value="pasta">Pasta</option>
                <option value="potato">Potato</option>
                <option value="quinoa">Quinoa</option>
                <option value="bread">Bread</option>
                <option value="no-carb">No Carbs / Low Carb</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meal Type</label>
              <select 
                value={params.meal}
                onChange={(e) => setParams({...params, meal: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Dietary Preferences</label>
            <div className="flex flex-wrap gap-3">
              {[
                { k: 'glutenFree', l: 'Gluten Free' },
                { k: 'dairyFree', l: 'Dairy Free' },
                { k: 'lowCarb', l: 'Low Carb' }
              ].map((opt) => (
                <button
                  key={opt.k}
                  onClick={() => setParams({
                    ...params, 
                    restrictions: { ...params.restrictions, [opt.k]: !params.restrictions[opt.k as keyof typeof params.restrictions] }
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    params.restrictions[opt.k as keyof typeof params.restrictions]
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                Generate Recipe
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Preview Modal */}
      {previewRecipe && (
        <RecipeDetailModal
          recipe={previewRecipe}
          onClose={() => setPreviewRecipe(null)}
          isPreview={true}
          onSave={handleSavePreview}
        />
      )}
    </>
  );
};

// 4. Recipes View
const RecipesView = ({ recipes, onDelete }: { recipes: Recipe[], onDelete: (id: string) => void }) => {
  const [filter, setFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filterRecipes = (list: Recipe[]) => {
    if (filter === 'all') return list;
    return list.filter(r => r.goal === filter);
  };

  const filteredSean = filterRecipes(SEANS_RECIPES);
  const filteredUser = filterRecipes(recipes);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {['all', 'lose', 'maintain', 'gain', 'muscle'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
              filter === f 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Sean's Pinned Recipes */}
        {filteredSean.length > 0 && (
          <div className="space-y-3">
             <div className="flex items-center gap-2 px-1">
                <Star size={18} className="text-yellow-600 fill-yellow-600" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sean's Recipes</h3>
             </div>
             {filteredSean.map(recipe => (
               <div 
                 key={recipe.id}
                 onClick={() => setSelectedRecipe(recipe)}
                 className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition group"
               >
                 <div>
                    <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition">{recipe.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{recipe.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories} kcal</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prepTime}</span>
                      {recipe.videoUrl && (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                          <Activity size={12} /> Video
                        </span>
                      )}
                    </div>
                 </div>
                 <ChevronRight className="text-gray-300 group-hover:text-yellow-500 transition" />
               </div>
             ))}
          </div>
        )}

        {/* User Collection */}
        <div className="space-y-3">
           <div className="flex items-center gap-2 px-1 pt-2">
              <BookOpen size={18} className="text-green-500" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Collection</h3>
           </div>
           
           {filteredUser.length === 0 ? (
             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
               <ChefHat size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
               <p className="text-gray-500 dark:text-gray-400">No saved recipes yet.</p>
             </div>
           ) : (
             filteredUser.map(recipe => (
               <div 
                 key={recipe.id}
                 onClick={() => setSelectedRecipe(recipe)}
                 className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition group"
               >
                 <div>
                    <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">{recipe.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{recipe.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories} kcal</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prepTime}</span>
                    </div>
                 </div>
                 <ChevronRight className="text-gray-300 group-hover:text-green-500 transition" />
               </div>
             ))
           )}
        </div>
      </div>

      <RecipeDetailModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)}
        onDelete={onDelete}
      />
    </div>
  );
};

// 5. Settings View
const SettingsView = ({ theme, onThemeChange }: { theme: AppTheme, onThemeChange: (t: AppTheme) => void }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Appearance</h3>
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
            {[AppTheme.LIGHT, AppTheme.DARK, AppTheme.SYSTEM].map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition flex items-center justify-center gap-2 ${
                  theme === t 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t === AppTheme.LIGHT && <Sun size={16} />}
                {t === AppTheme.DARK && <Moon size={16} />}
                {t === AppTheme.SYSTEM && <Laptop size={16} />}
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 text-center">
           <p className="text-sm text-gray-400">NutriHub Web v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.SYSTEM);
  const [toast, setToast] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(true);

  // Initialize from URL parameters for Deep Linking
  useEffect(() => {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const hideNavParam = params.get('hidenav');

    // Handle Tab Selection
    if (tabParam) {
      switch(tabParam.toLowerCase()) {
        case 'home': setActiveTab(0); break;
        case 'calculator': setActiveTab(1); break;
        case 'generator': setActiveTab(2); break;
        case 'recipes': setActiveTab(3); break;
        case 'settings': setActiveTab(4); break;
      }
    }

    // Handle Navigation Visibility
    if (hideNavParam === 'true') {
      setShowNav(false);
    }
  }, []);

  // Load saved data
  useEffect(() => {
    const savedRecipes = localStorage.getItem('nutrihub_recipes');
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));

    const savedTheme = localStorage.getItem('nutrihub_theme') as AppTheme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === AppTheme.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('nutrihub_theme', theme);
  }, [theme]);

  const saveRecipe = (recipe: Recipe) => {
    const updated = [recipe, ...recipes];
    setRecipes(updated);
    localStorage.setItem('nutrihub_recipes', JSON.stringify(updated));
    showToast("Recipe saved to your collection!");
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    localStorage.setItem('nutrihub_recipes', JSON.stringify(updated));
    showToast("Recipe deleted.");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header - Only show if Nav is shown (optional, but keeps it clean for embedding) */}
      {showNav && (
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-30 px-4 py-3 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-500" />
            <span className="font-extrabold text-xl tracking-tight text-gray-800 dark:text-white">NutriHub</span>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`pt-4 ${!showNav ? 'pt-0' : ''}`}>
        {activeTab === 0 && <HomeView onGetStarted={() => setActiveTab(1)} />}
        {activeTab === 1 && <CalculatorView />}
        {activeTab === 2 && <GeneratorView onRecipeGenerated={saveRecipe} />}
        {activeTab === 3 && <RecipesView recipes={recipes} onDelete={deleteRecipe} />}
        {activeTab === 4 && <SettingsView theme={theme} onThemeChange={setTheme} />}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-fade-in z-50">
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-6 py-2 flex justify-between items-center z-40 safe-area-bottom">
          {[
            { icon: Home, label: 'Home' },
            { icon: Calculator, label: 'Calculator' },
            { icon: Wand2, label: 'Generator' },
            { icon: BookOpen, label: 'Recipes' },
            { icon: Settings, label: 'Settings' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col items-center p-2 rounded-xl transition ${
                activeTab === idx 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <item.icon size={24} strokeWidth={activeTab === idx ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;