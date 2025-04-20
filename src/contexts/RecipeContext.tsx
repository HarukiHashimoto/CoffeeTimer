'use client'

import { Recipe } from '@/types/recipe'
import { Pour } from '@/data/tetsu46Config'
import { createContext, useContext, useState, ReactNode } from 'react'

interface Tetsu46Params {
  totalWater: number
  firstPour: Pour
  secondPour: Pour
}

interface RecipeContextType {
  selectedRecipe: Recipe | null
  setSelectedRecipe: (recipe: Recipe | null) => void
  tetsu46Params: Tetsu46Params | null
  setTetsu46Params: (params: Tetsu46Params | null) => void
}

const RecipeContext = createContext<RecipeContextType>({
  selectedRecipe: null,
  setSelectedRecipe: () => {},
  tetsu46Params: null,
  setTetsu46Params: () => {},
})

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [tetsu46Params, setTetsu46Params] = useState<Tetsu46Params | null>(null)

  return (
    <RecipeContext.Provider
      value={{
        selectedRecipe,
        setSelectedRecipe,
        tetsu46Params,
        setTetsu46Params,
      }}
    >
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
