'use client'

import { Recipe } from '@/types/recipe'
import { createContext, useContext, useState, ReactNode } from 'react'

interface RecipeContextType {
  selectedRecipe: Recipe | null
  setSelectedRecipe: (recipe: Recipe | null) => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  return (
    <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipe() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider')
  }
  return context
}
