import { writeFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const recipes = await request.json()
    const filePath = join(process.cwd(), 'public', 'custom-recipes.json')
    
    await writeFile(filePath, JSON.stringify(recipes, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save recipes:', error)
    return NextResponse.json(
      { error: 'Failed to save recipes' },
      { status: 500 }
    )
  }
}
