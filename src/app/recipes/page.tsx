'use client'

import { useState, useEffect } from 'react'
import { recipes as defaultRecipes } from '@/data/recipes'
import { Recipe } from '@/types/recipe'
import RecipeCard from '@/components/RecipeCard'
import CustomRecipeEditor from '@/components/CustomRecipeEditor'
import { loadCustomRecipes, saveCustomRecipe, deleteCustomRecipe } from '@/utils/customRecipes'
import Link from 'next/link'

export default function RecipesPage() {
  const [showEditor, setShowEditor] = useState(false)
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([])
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>()

  useEffect(() => {
    setCustomRecipes(loadCustomRecipes())
  }, [])

  const handleSaveCustomRecipe = (recipe: Recipe) => {
    saveCustomRecipe(recipe)
    setCustomRecipes(loadCustomRecipes())
    setShowEditor(false)
    setEditingRecipe(undefined)
  }

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm('このレシピを削除しますか？')) {
      deleteCustomRecipe(recipeId)
      setCustomRecipes(loadCustomRecipes())
    }
  }

  return (
    <main className="min-h-screen p-8 bg-light-bg dark:bg-dark-bg mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-light-primary dark:text-dark-primary" viewBox="0 0 200 148.813">
            <path className="fill-current" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-semibold text-light-text dark:text-dark-text">Recipes</h1>
        </div>
        <Link href="/" className="text-light-secondary dark:text-dark-secondary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-current" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          トップに戻る
        </Link>
      </div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => {
            setEditingRecipe(undefined)
            setShowEditor(true)
          }}
          className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary focus-visible:ring-offset-light-bg dark:focus-visible:ring-offset-dark-bg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          カスタムレシピを作成
        </button>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CustomRecipeEditor
              onSave={handleSaveCustomRecipe}
              onCancel={() => {
                setShowEditor(false)
                setEditingRecipe(undefined)
              }}
              initialRecipe={editingRecipe}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultRecipes.map(recipe => (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
        {customRecipes.map(recipe => (
          <div key={recipe.id} className="relative">
            <Link href={`/custom-recipes?id=${recipe.id}`} className="block">
              <RecipeCard recipe={recipe} />
            </Link>
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => {
                  setEditingRecipe(recipe)
                  setShowEditor(true)
                }}
                className="p-2 bg-light-primary dark:bg-dark-primary text-white rounded-full hover:bg-light-primary/90 dark:hover:bg-dark-primary/90"
                title="編集"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteRecipe(recipe.id)}
                className="p-2 bg-red-500 dark:bg-red-600 text-white rounded-full hover:bg-red-500/90 dark:hover:bg-red-600/90"
                title="削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
