export interface Step {
  description: string;
  duration?: number;
  amount?: number;
  waterAmount?: number;
}

export interface Recipe {
  id: string;
  name: string;
  method: string;
  description: string;
  ratio: string;
  grindSize: string;
  totalTime: number; // minutes
  steps: Step[];
  image: string;
}
