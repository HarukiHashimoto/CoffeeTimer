import { recipes } from '@/data/recipes'
import Link from 'next/link'
import RecipeDetail from '@/components/RecipeDetail'

export function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function RecipePage({ params, searchParams }: Props) {
  const recipe = recipes.find(r => r.id === params.id)
  if (!recipe) {
    return (
      <main className="min-h-screen p-8">
        <div>Recipe not found</div>
        <Link href="/recipes" className="text-emerald-600 hover:text-emerald-700">
          ← Back to Recipes
        </Link>
      </main>
    )
  }

  return <RecipeDetail recipe={recipe} />
}
