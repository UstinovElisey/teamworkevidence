import { describe, expect, it } from 'vitest'
import { candidates, teamRoles } from '@/data/teamBuilderSeed'
import { calculateTeamHealth, getReadinessLabel } from '@/utils/teamMetrics'
import type { TeamDraft } from '@/types/teamBuilder'

function draftWithMembers(
  memberIds: Array<[string, 'product' | 'design' | 'frontend' | 'backend']>,
): TeamDraft {
  return {
    name: 'Проверочная команда',
    goal: 'Проверить готовность',
    updatedAt: '2026-01-01T00:00:00.000Z',
    members: memberIds.map(([candidateId, assignment]) => ({
      candidateId,
      assignment,
      note: '',
      addedAt: '2026-01-01T00:00:00.000Z',
    })),
  }
}

describe('calculateTeamHealth', () => {
  it('shows missing required roles for an empty draft', () => {
    const health = calculateTeamHealth(draftWithMembers([]), candidates, teamRoles)

    expect(health.readiness).toBe(0)
    expect(health.missingRoles.map((role) => role.id)).toEqual([
      'product',
      'design',
      'frontend',
      'backend',
    ])
    expect(getReadinessLabel(health.readiness)).toBe('Нужно усилить')
  })

  it('raises readiness when all required roles are covered', () => {
    const health = calculateTeamHealth(
      draftWithMembers([
        ['maria-levina', 'product'],
        ['sofia-ramazanova', 'design'],
        ['arseniy-belikov', 'frontend'],
        ['nikita-sazonov', 'backend'],
      ]),
      candidates,
      teamRoles,
    )

    expect(health.missingRoles).toHaveLength(0)
    expect(health.readiness).toBeGreaterThanOrEqual(95)
    expect(getReadinessLabel(health.readiness)).toBe('Готова к старту')
  })
})
