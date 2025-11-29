import React from 'react';
import type { Recipe } from '../types';
import { X, Trash2, Clock, Users, Flame, Save, Ban } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  onSave?: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ 
  recipe, 
  onClose, 
  onDelete, 
  isPreview = false, 
  onSave 
}) => {
  if (!recipe) return null;

  // Check if it's a "Sean's Recipe" (starts with sean-)
  const isPinned = recipe.id.startsWith('sean-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-green-50 dark:bg-gray-900/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white pr-4 line-clamp-1">
            {isPreview ? 'Preview Recipe' : recipe.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title in body for Preview mode since header says "Preview" */}
          {isPreview && (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {recipe.title}
            </h1>
          )}

          {recipe.description && (
            <p className="text-gray-600 dark:text-gray-300 italic">
              {recipe.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Clock size={20} className="text-green-600 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Prep Time</span>
              <span className="font-semibold text-sm">{recipe.prepTime || 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Users size={20} className="text-green-600 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Servings</span>
              <span className="font-semibold text-sm">{recipe.servings || 'N/A'}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Flame size={20} className="text-green-600 mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Calories</span>
              <span className="font-semibold text-sm">{recipe.calories || 'N/A'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 border-l-4 border-green-500 pl-3">
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 border-l-4 border-green-500 pl-3">
              Instructions
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold mr-3 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="mt-0.5">{inst}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {isPreview ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-semibold transition"
              >
                <Ban size={18} className="mr-2" />
                Discard
              </button>
              <button
                onClick={onSave}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/20 transition"
              >
                <Save size={18} className="mr-2" />
                Save Recipe
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              {!isPinned && onDelete ? (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this recipe?')) {
                      onDelete(recipe.id);
                      onClose();
                    }
                  }}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Recipe
                </button>
              ) : isPinned ? (
                <div className="text-xs text-gray-400 italic flex items-center">
                  Cannot delete pinned recipes
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;