import { useGameStore } from './gameStore'
import { PlayerState } from '../types/game'

// Helper to build a minimal valid player
function makePlayer(id: string, name: string): PlayerState {
  return { id, name, role: 'word', hasSeenCard: false }
}

beforeEach(() => {
  useGameStore.getState().resetGame()
})

// ---------------------------------------------------------------------------
// setPlayers
// ---------------------------------------------------------------------------
describe('setPlayers', () => {
  it('stores the players array', () => {
    const players = [makePlayer('1', 'Ana'), makePlayer('2', 'Bob'), makePlayer('3', 'Carl')]
    useGameStore.getState().setPlayers(players)
    expect(useGameStore.getState().players).toEqual(players)
  })

  it('replaces a previously set array', () => {
    useGameStore.getState().setPlayers([makePlayer('1', 'Ana'), makePlayer('2', 'Bob'), makePlayer('3', 'Carl')])
    const next = [makePlayer('a', 'X'), makePlayer('b', 'Y'), makePlayer('c', 'Z')]
    useGameStore.getState().setPlayers(next)
    expect(useGameStore.getState().players).toEqual(next)
  })

  it('accepts an empty array', () => {
    useGameStore.getState().setPlayers([])
    expect(useGameStore.getState().players).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// setNumImpostors
// ---------------------------------------------------------------------------
describe('setNumImpostors', () => {
  beforeEach(() => {
    // 4 players so clamp max = min(2, 4-1) = 2
    useGameStore.getState().setPlayers([
      makePlayer('1', 'A'),
      makePlayer('2', 'B'),
      makePlayer('3', 'C'),
      makePlayer('4', 'D'),
    ])
  })

  it('sets a valid value', () => {
    useGameStore.getState().setNumImpostors(2)
    expect(useGameStore.getState().numImpostors).toBe(2)
  })

  it('clamps to 1 when below minimum', () => {
    useGameStore.getState().setNumImpostors(0)
    expect(useGameStore.getState().numImpostors).toBe(1)
  })

  it('clamps to min(2, players.length - 1) when above maximum', () => {
    useGameStore.getState().setNumImpostors(10)
    expect(useGameStore.getState().numImpostors).toBe(2)
  })

  it('max is 1 when there are exactly 2 players (players.length - 1 = 1)', () => {
    useGameStore.getState().setPlayers([makePlayer('1', 'A'), makePlayer('2', 'B')])
    useGameStore.getState().setNumImpostors(2)
    expect(useGameStore.getState().numImpostors).toBe(1)
  })

  it('max is capped at 2 even with many players', () => {
    const manyPlayers = Array.from({ length: 10 }, (_, i) => makePlayer(String(i), `P${i}`))
    useGameStore.getState().setPlayers(manyPlayers)
    useGameStore.getState().setNumImpostors(5)
    expect(useGameStore.getState().numImpostors).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// setCategory
// ---------------------------------------------------------------------------
describe('setCategory', () => {
  it('sets famosos', () => {
    useGameStore.getState().setCategory('famosos')
    expect(useGameStore.getState().selectedCategory).toBe('famosos')
  })

  it('sets objetos', () => {
    useGameStore.getState().setCategory('objetos')
    expect(useGameStore.getState().selectedCategory).toBe('objetos')
  })

  it('sets lugares', () => {
    useGameStore.getState().setCategory('lugares')
    expect(useGameStore.getState().selectedCategory).toBe('lugares')
  })

  it('sets series', () => {
    useGameStore.getState().setCategory('series')
    expect(useGameStore.getState().selectedCategory).toBe('series')
  })

  it('sets animales', () => {
    useGameStore.getState().setCategory('animales')
    expect(useGameStore.getState().selectedCategory).toBe('animales')
  })
})

// ---------------------------------------------------------------------------
// startGame
// ---------------------------------------------------------------------------
describe('startGame', () => {
  let mockRandom: jest.SpyInstance

  beforeEach(() => {
    mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0)
    useGameStore.getState().setPlayers([
      makePlayer('1', 'Ana'),
      makePlayer('2', 'Bob'),
      makePlayer('3', 'Carl'),
    ])
    useGameStore.getState().setNumImpostors(1)
    useGameStore.getState().setCategory('famosos')
  })

  afterEach(() => {
    mockRandom.mockRestore()
  })

  it('sets phase to viewing', () => {
    useGameStore.getState().startGame()
    expect(useGameStore.getState().phase).toBe('viewing')
  })

  it('resets currentPlayerIndex to 0', () => {
    useGameStore.getState().startGame()
    expect(useGameStore.getState().currentPlayerIndex).toBe(0)
  })

  it('sets currentWord to a word from the selected category', () => {
    const { WORDS } = require('../data/words')
    useGameStore.getState().startGame()
    const word = useGameStore.getState().currentWord
    expect(WORDS['famosos']).toContain(word)
  })

  it('assigns impostor role to exactly numImpostors players', () => {
    useGameStore.getState().startGame()
    const impostors = useGameStore.getState().players.filter(p => p.role === 'impostor')
    expect(impostors).toHaveLength(1)
  })

  it('assigns word role to the remaining players', () => {
    useGameStore.getState().startGame()
    const wordPlayers = useGameStore.getState().players.filter(p => p.role === 'word')
    expect(wordPlayers).toHaveLength(2)
  })

  it('total roles assigned equals total players', () => {
    useGameStore.getState().startGame()
    const players = useGameStore.getState().players
    expect(players.every(p => p.role === 'impostor' || p.role === 'word')).toBe(true)
  })

  it('hasSeenCard is false for all players at start', () => {
    useGameStore.getState().startGame()
    useGameStore.getState().players.forEach(p => {
      expect(p.hasSeenCard).toBe(false)
    })
  })
})

// TRIANGULATE: startGame edge cases
describe('startGame — edge cases', () => {
  let mockRandom: jest.SpyInstance

  afterEach(() => {
    mockRandom?.mockRestore()
  })

  it('works with exactly 3 players and 1 impostor (minimum)', () => {
    mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0)
    useGameStore.getState().setPlayers([
      makePlayer('1', 'A'), makePlayer('2', 'B'), makePlayer('3', 'C'),
    ])
    useGameStore.getState().setNumImpostors(1)
    useGameStore.getState().startGame()
    const impostors = useGameStore.getState().players.filter(p => p.role === 'impostor')
    expect(impostors).toHaveLength(1)
  })

  it('works with 4 players and 2 impostors (max)', () => {
    mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0)
    useGameStore.getState().setPlayers([
      makePlayer('1', 'A'), makePlayer('2', 'B'), makePlayer('3', 'C'), makePlayer('4', 'D'),
    ])
    useGameStore.getState().setNumImpostors(2)
    useGameStore.getState().startGame()
    const impostors = useGameStore.getState().players.filter(p => p.role === 'impostor')
    expect(impostors).toHaveLength(2)
  })

  it('all players have a defined role after startGame', () => {
    mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    useGameStore.getState().setPlayers([
      makePlayer('1', 'A'), makePlayer('2', 'B'), makePlayer('3', 'C'),
      makePlayer('4', 'D'), makePlayer('5', 'E'),
    ])
    useGameStore.getState().setNumImpostors(1)
    useGameStore.getState().startGame()
    useGameStore.getState().players.forEach(p => {
      expect(['impostor', 'word']).toContain(p.role)
    })
  })
})

// ---------------------------------------------------------------------------
// markPlayerViewed
// ---------------------------------------------------------------------------
describe('markPlayerViewed', () => {
  beforeEach(() => {
    useGameStore.getState().setPlayers([
      makePlayer('1', 'Ana'),
      makePlayer('2', 'Bob'),
      makePlayer('3', 'Carl'),
    ])
    jest.spyOn(Math, 'random').mockReturnValue(0)
    useGameStore.getState().startGame()
    jest.spyOn(Math, 'random').mockRestore()
  })

  it('sets hasSeenCard to true for the current player', () => {
    const idx = useGameStore.getState().currentPlayerIndex
    useGameStore.getState().markPlayerViewed()
    expect(useGameStore.getState().players[idx].hasSeenCard).toBe(true)
  })

  it('increments currentPlayerIndex when more players remain', () => {
    expect(useGameStore.getState().currentPlayerIndex).toBe(0)
    useGameStore.getState().markPlayerViewed()
    expect(useGameStore.getState().currentPlayerIndex).toBe(1)
  })

  it('keeps phase as viewing when not all players have seen the card', () => {
    useGameStore.getState().markPlayerViewed()
    expect(useGameStore.getState().phase).toBe('viewing')
  })

  it('transitions phase to discussion when all players have seen the card', () => {
    useGameStore.getState().markPlayerViewed() // player 0
    useGameStore.getState().markPlayerViewed() // player 1
    useGameStore.getState().markPlayerViewed() // player 2
    expect(useGameStore.getState().phase).toBe('discussion')
  })

  it('does NOT increment index when transitioning to discussion (last player)', () => {
    useGameStore.getState().markPlayerViewed() // 0 → 1
    useGameStore.getState().markPlayerViewed() // 1 → 2
    useGameStore.getState().markPlayerViewed() // 2 → transition
    // index should stay at 2 (or at least not go out of bounds)
    const idx = useGameStore.getState().currentPlayerIndex
    expect(idx).toBeLessThanOrEqual(2)
  })
})

// ---------------------------------------------------------------------------
// revealResult
// ---------------------------------------------------------------------------
describe('revealResult', () => {
  it('sets phase to result', () => {
    useGameStore.getState().revealResult()
    expect(useGameStore.getState().phase).toBe('result')
  })
})

// ---------------------------------------------------------------------------
// resetGame
// ---------------------------------------------------------------------------
describe('resetGame', () => {
  beforeEach(() => {
    // Dirty the state first
    useGameStore.getState().setPlayers([
      makePlayer('1', 'Ana'), makePlayer('2', 'Bob'), makePlayer('3', 'Carl'),
    ])
    useGameStore.getState().setCategory('animales')
    jest.spyOn(Math, 'random').mockReturnValue(0)
    useGameStore.getState().startGame()
    jest.spyOn(Math, 'random').mockRestore()
    useGameStore.getState().revealResult()
  })

  it('resets phase to config', () => {
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().phase).toBe('config')
  })

  it('resets players to empty array', () => {
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().players).toEqual([])
  })

  it('resets numImpostors to 1', () => {
    useGameStore.getState().setNumImpostors(2)
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().numImpostors).toBe(1)
  })

  it('resets selectedCategory to famosos', () => {
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().selectedCategory).toBe('famosos')
  })

  it('resets currentWord to empty string', () => {
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().currentWord).toBe('')
  })

  it('resets currentPlayerIndex to 0', () => {
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().currentPlayerIndex).toBe(0)
  })
})
