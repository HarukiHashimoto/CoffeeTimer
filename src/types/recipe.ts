export interface Step {
  description: string
  duration?: number // seconds
  waterAmount?: number // ml
}

export interface Recipe {
  id: string
  name: string
  method: string
  description: string
  ratio: string
  grindSize: string
  totalTime: number // minutes
  steps: Step[]
  image: string
}
