import type { Candidate, TeamDraft, TeamHealth, TeamRoleDefinition } from '@/types/teamBuilder'

export function calculateTeamHealth(
  draft: TeamDraft,
  candidates: Candidate[],
  roles: TeamRoleDefinition[],
): TeamHealth {
  const selectedCandidates = draft.members
    .map((member) => candidates.find((candidate) => candidate.id === member.candidateId))
    .filter((candidate): candidate is Candidate => Boolean(candidate))

  const requiredRoles = roles.filter((role) => role.minimum > 0)
  const coveredRoleIds = new Set(draft.members.map((member) => member.assignment))
  const missingRoles = requiredRoles.filter((role) => !coveredRoleIds.has(role.id))
  const coverageScore = requiredRoles.length
    ? ((requiredRoles.length - missingRoles.length) / requiredRoles.length) * 70
    : 70
  const teamSizeScore = Math.min(selectedCandidates.length / 4, 1) * 20
  const availabilityScore = selectedCandidates.length
    ? (selectedCandidates.filter((candidate) => candidate.availability === 'available').length /
        selectedCandidates.length) *
      10
    : 0

  const totalRating = selectedCandidates.reduce((sum, candidate) => sum + candidate.rating, 0)
  const totalExperience = selectedCandidates.reduce(
    (sum, candidate) => sum + candidate.experienceYears,
    0,
  )

  return {
    readiness: Math.round(coverageScore + teamSizeScore + availabilityScore),
    coveredRoles: requiredRoles.length - missingRoles.length,
    requiredRoles: requiredRoles.length,
    averageRating: selectedCandidates.length
      ? Number((totalRating / selectedCandidates.length).toFixed(1))
      : 0,
    averageExperience: selectedCandidates.length
      ? Number((totalExperience / selectedCandidates.length).toFixed(1))
      : 0,
    availableMembers: selectedCandidates.filter(
      (candidate) => candidate.availability === 'available',
    ).length,
    missingRoles,
  }
}

export function getReadinessLabel(readiness: number) {
  if (readiness >= 85) return 'Готова к старту'
  if (readiness >= 55) return 'Почти готова'
  return 'Нужно усилить'
}
