import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loadTeamBuilder } from '@/services/teamBuilderService'
import { calculateTeamHealth } from '@/utils/teamMetrics'
import type {
  Candidate,
  CandidateRole,
  TeamDraft,
  TeamFilters,
  TeamMember,
  WorkFormat,
} from '@/types/teamBuilder'

const storageKey = 'teamworkevidence:team-builder-draft'

const initialFilters = (): TeamFilters => ({
  query: '',
  roles: [],
  skills: [],
  availability: 'all',
  workFormat: 'all',
  minimumRating: 0,
})

const initialDraft = (): TeamDraft => ({
  name: 'Новая команда',
  goal: 'Собрать команду для запуска первого релиза',
  members: [],
  updatedAt: new Date().toISOString(),
})

function restoreDraft(): TeamDraft {
  try {
    const rawDraft = localStorage.getItem(storageKey)
    if (!rawDraft) return initialDraft()

    const parsedDraft = JSON.parse(rawDraft) as Partial<TeamDraft>
    if (!Array.isArray(parsedDraft.members)) return initialDraft()

    return {
      name: parsedDraft.name || initialDraft().name,
      goal: parsedDraft.goal || initialDraft().goal,
      members: parsedDraft.members.filter(
        (member): member is TeamMember =>
          typeof member?.candidateId === 'string' &&
          typeof member.assignment === 'string' &&
          typeof member.note === 'string' &&
          typeof member.addedAt === 'string',
      ),
      updatedAt: parsedDraft.updatedAt || new Date().toISOString(),
    }
  } catch {
    return initialDraft()
  }
}

export const useTeamBuilderStore = defineStore('team-builder', () => {
  const candidates = ref<Candidate[]>([])
  const roles = ref([] as Awaited<ReturnType<typeof loadTeamBuilder>>['roles'])
  const availableSkills = ref<string[]>([])
  const filters = ref<TeamFilters>(initialFilters())
  const draft = ref<TeamDraft>(restoreDraft())
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref('')

  const filteredCandidates = computed(() => {
    const query = filters.value.query.trim().toLocaleLowerCase('ru-RU')

    return candidates.value
      .filter((candidate) => {
        if (!query) return true
        return [
          candidate.name,
          candidate.headline,
          candidate.city,
          ...candidate.roles,
          ...candidate.skills,
        ].some((value) => value.toLocaleLowerCase('ru-RU').includes(query))
      })
      .filter(
        (candidate) =>
          filters.value.roles.length === 0 ||
          filters.value.roles.some((role) => candidate.roles.includes(role)),
      )
      .filter(
        (candidate) =>
          filters.value.skills.length === 0 ||
          filters.value.skills.every((skill) => candidate.skills.includes(skill)),
      )
      .filter(
        (candidate) =>
          filters.value.availability === 'all' ||
          candidate.availability === filters.value.availability,
      )
      .filter(
        (candidate) =>
          filters.value.workFormat === 'all' ||
          candidate.workFormat.includes(filters.value.workFormat),
      )
      .filter((candidate) => candidate.rating >= filters.value.minimumRating)
      .sort((left, right) => {
        const byFeatured = Number(Boolean(right.featured)) - Number(Boolean(left.featured))
        return (
          byFeatured || right.rating - left.rating || right.experienceYears - left.experienceYears
        )
      })
  })

  const selectedCandidates = computed(() =>
    draft.value.members
      .map((member) => {
        const candidate = candidates.value.find((item) => item.id === member.candidateId)
        return candidate ? { candidate, member } : undefined
      })
      .filter((item): item is { candidate: Candidate; member: TeamMember } => Boolean(item)),
  )

  const health = computed(() => calculateTeamHealth(draft.value, candidates.value, roles.value))

  const activeFilterCount = computed(() => {
    let count = filters.value.roles.length + filters.value.skills.length
    if (filters.value.availability !== 'all') count += 1
    if (filters.value.workFormat !== 'all') count += 1
    if (filters.value.minimumRating > 0) count += 1
    return count
  })

  function persistDraft() {
    draft.value.updatedAt = new Date().toISOString()
    localStorage.setItem(storageKey, JSON.stringify(draft.value))
  }

  async function initialise() {
    if (hasLoaded.value || isLoading.value) return

    isLoading.value = true
    error.value = ''

    try {
      const response = await loadTeamBuilder()
      candidates.value = response.candidates
      roles.value = response.roles
      availableSkills.value = response.availableSkills
      hasLoaded.value = true
    } catch {
      error.value = 'Не удалось загрузить специалистов. Попробуйте ещё раз.'
    } finally {
      isLoading.value = false
    }
  }

  function toggleRole(role: CandidateRole) {
    const target = filters.value.roles
    filters.value.roles = target.includes(role)
      ? target.filter((item) => item !== role)
      : [...target, role]
  }

  function toggleSkill(skill: string) {
    const target = filters.value.skills
    filters.value.skills = target.includes(skill)
      ? target.filter((item) => item !== skill)
      : [...target, skill]
  }

  function setAvailability(availability: TeamFilters['availability']) {
    filters.value.availability = availability
  }

  function setWorkFormat(workFormat: 'all' | WorkFormat) {
    filters.value.workFormat = workFormat
  }

  function setMinimumRating(minimumRating: number) {
    filters.value.minimumRating = minimumRating
  }

  function resetFilters() {
    filters.value = initialFilters()
  }

  function isSelected(candidateId: string) {
    return draft.value.members.some((member) => member.candidateId === candidateId)
  }

  function addMember(candidate: Candidate, assignment?: CandidateRole) {
    if (isSelected(candidate.id)) return

    draft.value.members.push({
      candidateId: candidate.id,
      assignment: assignment || candidate.roles[0],
      note: '',
      addedAt: new Date().toISOString(),
    })
    persistDraft()
  }

  function removeMember(candidateId: string) {
    draft.value.members = draft.value.members.filter((member) => member.candidateId !== candidateId)
    persistDraft()
  }

  function updateMemberRole(candidateId: string, assignment: CandidateRole) {
    const member = draft.value.members.find((item) => item.candidateId === candidateId)
    if (!member) return

    member.assignment = assignment
    persistDraft()
  }

  function updateMemberNote(candidateId: string, note: string) {
    const member = draft.value.members.find((item) => item.candidateId === candidateId)
    if (!member) return

    member.note = note
    persistDraft()
  }

  function updateDraft(name: string, goal: string) {
    draft.value.name = name.trim() || initialDraft().name
    draft.value.goal = goal.trim() || initialDraft().goal
    persistDraft()
  }

  function clearDraft() {
    draft.value = initialDraft()
    localStorage.removeItem(storageKey)
  }

  return {
    candidates,
    roles,
    availableSkills,
    filters,
    draft,
    isLoading,
    hasLoaded,
    error,
    filteredCandidates,
    selectedCandidates,
    health,
    activeFilterCount,
    initialise,
    toggleRole,
    toggleSkill,
    setAvailability,
    setWorkFormat,
    setMinimumRating,
    resetFilters,
    isSelected,
    addMember,
    removeMember,
    updateMemberRole,
    updateMemberNote,
    updateDraft,
    clearDraft,
  }
})
