import { recipes } from '@/data/recipes'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'

export default function RecipesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" viewBox="0 0 200 148.813">
            <path className="fill-emerald-600" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
          </svg>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-600">Recipes</h1>
        </div>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          トップに戻る
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  )
}
