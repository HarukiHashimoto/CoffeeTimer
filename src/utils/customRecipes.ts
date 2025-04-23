import { Recipe } from '@/types/recipe'

const STORAGE_KEY = 'coffee-timer-custom-recipes'

export const loadCustomRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to parse custom recipes:', e)
    return []
  }
}

export const saveCustomRecipe = async (recipe: Recipe) => {
  if (typeof window === 'undefined') return

  const recipes = loadCustomRecipes()
  const existingIndex = recipes.findIndex(r => r.id === recipe.id)
  
  if (existingIndex >= 0) {
    recipes[existingIndex] = recipe
  } else {
    recipes.push(recipe)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))

  // Save to file system
  try {
    await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipes),
    })
  } catch (e) {
    console.error('Failed to save recipes to file:', e)
  }
}

export const deleteCustomRecipe = async (recipeId: string) => {
  if (typeof window === 'undefined') return

  const recipes = loadCustomRecipes()
  const filtered = recipes.filter(r => r.id !== recipeId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

  // Save to file system
  try {
    await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtered),
    })
  } catch (e) {
    console.error('Failed to save recipes to file:', e)
  }
}
