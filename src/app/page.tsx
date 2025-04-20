import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Coffee Timer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/recipes" 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Recipes</h2>
          <p className="text-gray-600">Browse coffee brewing recipes</p>
        </Link>
        <Link href="/timer" 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Timer</h2>
          <p className="text-gray-600">Timer for brewing coffee</p>
        </Link>
      </div>
    </main>
  )
}
