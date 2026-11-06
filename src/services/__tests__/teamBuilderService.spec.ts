import { describe, expect, it } from 'vitest'
import { candidates } from '@/data/teamBuilderSeed'
import { filterCandidates } from '@/services/teamBuilderService'
import type { TeamFilters } from '@/types/teamBuilder'

const emptyFilters = (): TeamFilters => ({
  query: '',
  roles: [],
  skills: [],
  availability: 'all',
  workFormat: 'all',
  minimumRating: 0,
})

describe('filterCandidates', () => {
  it('finds specialists by role and skill', () => {
    const result = filterCandidates(candidates, {
      ...emptyFilters(),
      roles: ['frontend'],
      skills: ['Vue'],
    })

    expect(result.map((candidate) => candidate.id)).toEqual(['arseniy-belikov', 'timur-gadzhiev'])
  })

  it('keeps only available candidates with a selected work format', () => {
    const result = filterCandidates(candidates, {
      ...emptyFilters(),
      availability: 'available',
      workFormat: 'office',
    })

    expect(result.map((candidate) => candidate.id)).toEqual(['elena-petrova'])
  })

  it('sorts featured profiles before regular profiles', () => {
    const result = filterCandidates(candidates, emptyFilters())

    expect(result.slice(0, 2).every((candidate) => candidate.featured)).toBe(true)
  })
})
