import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('returns an empty array unchanged', () => {
    expect(shuffle([])).toEqual([])
  })

  it('returns a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42])
  })

  it('does NOT mutate the original array', () => {
    const original = [1, 2, 3, 4, 5]
    const copy = [...original]
    shuffle(original)
    expect(original).toEqual(copy)
  })

  it('returns an array with the same length as the input', () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input)).toHaveLength(input.length)
  })

  it('returns an array containing all the original elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = shuffle(input)
    expect(result.sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b))
  })

  it('works with string arrays and preserves all elements', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    const result = shuffle(input)
    expect(result.sort()).toEqual([...input].sort())
  })

  it('produces a permutation — does not just return a sorted copy', () => {
    // Run many times: at least once the order should differ from the original
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const sameAsOriginal = Array.from({ length: 100 }, () =>
      shuffle(input).join(',')
    ).every(r => r === input.join(','))
    expect(sameAsOriginal).toBe(false)
  })

  it('works with generic types (objects)', () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const result = shuffle(input)
    expect(result).toHaveLength(3)
    expect(result.map(x => x.id).sort((a, b) => a - b)).toEqual([1, 2, 3])
  })
})
