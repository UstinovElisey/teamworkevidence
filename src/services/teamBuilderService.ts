import { candidates, teamRoles } from '@/data/teamBuilderSeed'
import type {
  Candidate,
  CandidateRole,
  TeamBuilderBootstrap,
  TeamFilters,
} from '@/types/teamBuilder'

const networkDelay = 180

function pause() {
  return new Promise((resolve) => window.setTimeout(resolve, networkDelay))
}

function normalise(value: string) {
  return value.trim().toLocaleLowerCase('ru-RU')
}

function includesQuery(candidate: Candidate, query: string) {
  const normalisedQuery = normalise(query)

  if (!normalisedQuery) {
    return true
  }

  const searchable = [
    candidate.name,
    candidate.headline,
    candidate.city,
    ...candidate.roles,
    ...candidate.skills,
  ]

  return searchable.some((value) => normalise(value).includes(normalisedQuery))
}

function matchesRoles(candidate: Candidate, roles: CandidateRole[]) {
  return roles.length === 0 || roles.some((role) => candidate.roles.includes(role))
}

function matchesSkills(candidate: Candidate, skills: string[]) {
  return skills.length === 0 || skills.every((skill) => candidate.skills.includes(skill))
}

export function filterCandidates(source: Candidate[], filters: TeamFilters): Candidate[] {
  return source
    .filter((candidate) => includesQuery(candidate, filters.query))
    .filter((candidate) => matchesRoles(candidate, filters.roles))
    .filter((candidate) => matchesSkills(candidate, filters.skills))
    .filter(
      (candidate) =>
        filters.availability === 'all' || candidate.availability === filters.availability,
    )
    .filter(
      (candidate) =>
        filters.workFormat === 'all' || candidate.workFormat.includes(filters.workFormat),
    )
    .filter((candidate) => candidate.rating >= filters.minimumRating)
    .sort((left, right) => {
      const featuredDifference = Number(Boolean(right.featured)) - Number(Boolean(left.featured))
      return (
        featuredDifference ||
        right.rating - left.rating ||
        right.experienceYears - left.experienceYears
      )
    })
}

export async function loadTeamBuilder(): Promise<TeamBuilderBootstrap> {
  await pause()

  const availableSkills = Array.from(
    new Set(candidates.flatMap((candidate) => candidate.skills)),
  ).sort((left, right) => left.localeCompare(right, 'ru'))

  return {
    candidates: candidates.map((candidate) => ({ ...candidate })),
    roles: teamRoles.map((role) => ({ ...role })),
    availableSkills,
  }
}

export async function findCandidate(id: string): Promise<Candidate | undefined> {
  await pause()
  const candidate = candidates.find((item) => item.id === id)
  return candidate ? { ...candidate } : undefined
}
