import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center space-x-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" viewBox="0 0 200 148.813">
          <path className="fill-emerald-600" d="M18.123,265.2a5.94,5.94,0,0,0-5.952,5.953V408.063a5.94,5.94,0,0,0,5.952,5.953h125a5.94,5.94,0,0,0,5.953-5.953V374.48a36.472,36.472,0,0,0,22.027,7.389c24.021,0,41.065-22.9,41.065-48.211s-17.045-48.222-41.065-48.222a36.465,36.465,0,0,0-22.027,7.392V271.155a5.94,5.94,0,0,0-5.953-5.953ZM171.105,308.11c8.829,0,18.4,10.118,18.4,25.549s-9.573,25.547-18.4,25.547-18.413-10.116-18.413-25.547S162.277,308.11,171.105,308.11Z" transform="translate(-12.171 -265.202)" />
        </svg>
        <h1 className="text-4xl font-bold">Coffee Timer</h1>
      </div>
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
