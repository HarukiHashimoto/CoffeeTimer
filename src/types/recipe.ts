export type Step = {
  description: string
  duration?: number
  time?: number
  amount?: number
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
