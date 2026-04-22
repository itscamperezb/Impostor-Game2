import { create } from 'zustand'
import { GameState, PlayerState, Category } from '../types/game'
import { shuffle } from '../utils/shuffle'
import { WORDS } from '../data/words'

const initialState = {
  players: [] as PlayerState[],
  numImpostors: 1,
  selectedCategory: 'famosos' as Category,
  currentWord: '',
  currentPlayerIndex: 0,
  phase: 'config' as const,
}

export const useGameStore = create<GameState>()((set, get) => ({
  ...initialState,

  setPlayers: (players: PlayerState[]) => {
    set({ players })
  },

  setNumImpostors: (n: number) => {
    const { players } = get()
    const max = Math.min(2, players.length - 1)
    const clamped = Math.max(1, Math.min(n, max))
    set({ numImpostors: clamped })
  },

  setCategory: (cat: Category) => {
    set({ selectedCategory: cat })
  },

  startGame: () => {
    const { players, numImpostors, selectedCategory } = get()

    // Shuffle player indices to assign roles
    const indices = Array.from({ length: players.length }, (_, i) => i)
    const shuffledIndices = shuffle(indices)
    const impostorIndices = new Set(shuffledIndices.slice(0, numImpostors))

    // Pick a random word from the selected category
    const wordList = shuffle(WORDS[selectedCategory])
    const currentWord = wordList[0]

    const updatedPlayers: PlayerState[] = players.map((p, i) => ({
      ...p,
      role: impostorIndices.has(i) ? 'impostor' : 'word',
      hasSeenCard: false,
    }))

    set({
      players: updatedPlayers,
      currentWord,
      phase: 'viewing',
      currentPlayerIndex: 0,
    })
  },

  markPlayerViewed: () => {
    const { players, currentPlayerIndex } = get()

    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex ? { ...p, hasSeenCard: true } : p,
    )

    const allSeen = updatedPlayers.every(p => p.hasSeenCard)

    if (allSeen) {
      set({ players: updatedPlayers, phase: 'discussion' })
    } else {
      set({ players: updatedPlayers, currentPlayerIndex: currentPlayerIndex + 1 })
    }
  },

  revealResult: () => {
    set({ phase: 'result' })
  },

  resetGame: () => {
    set({ ...initialState })
  },
}))
