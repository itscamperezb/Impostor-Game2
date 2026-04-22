export type Category = 'famosos' | 'objetos' | 'lugares' | 'series' | 'animales'
export type Role = 'word' | 'impostor'
export type GamePhase = 'config' | 'assigning' | 'viewing' | 'discussion' | 'result'

export interface PlayerState {
  id: string
  name: string
  role: Role
  hasSeenCard: boolean
}

export interface GameState {
  players: PlayerState[]
  numImpostors: number
  selectedCategory: Category
  currentWord: string
  currentPlayerIndex: number
  phase: GamePhase
  // actions
  setPlayers: (players: PlayerState[]) => void
  setNumImpostors: (n: number) => void
  setCategory: (cat: Category) => void
  startGame: () => void
  markPlayerViewed: () => void
  revealResult: () => void
  resetGame: () => void
}
