export type CandidateRole =
  'frontend' | 'backend' | 'mobile' | 'design' | 'product' | 'data' | 'devops' | 'qa'

export type Availability = 'available' | 'soon' | 'busy'

export type WorkFormat = 'remote' | 'hybrid' | 'office'

export interface Candidate {
  id: string
  name: string
  headline: string
  city: string
  timezone: string
  initials: string
  avatarColor: string
  roles: CandidateRole[]
  skills: string[]
  experienceYears: number
  availability: Availability
  availableFrom?: string
  workFormat: WorkFormat[]
  rating: number
  completedProjects: number
  responseHours: number
  summary: string
  verified: boolean
  featured?: boolean
}

export interface TeamRoleDefinition {
  id: CandidateRole
  title: string
  shortTitle: string
  description: string
  accent: string
  minimum: number
}

export interface TeamFilters {
  query: string
  roles: CandidateRole[]
  skills: string[]
  availability: 'all' | Availability
  workFormat: 'all' | WorkFormat
  minimumRating: number
}

export interface TeamMember {
  candidateId: string
  assignment: CandidateRole
  note: string
  addedAt: string
}

export interface TeamDraft {
  name: string
  goal: string
  members: TeamMember[]
  updatedAt: string
}

export interface TeamHealth {
  readiness: number
  coveredRoles: number
  requiredRoles: number
  averageRating: number
  averageExperience: number
  availableMembers: number
  missingRoles: TeamRoleDefinition[]
}

export interface TeamBuilderBootstrap {
  candidates: Candidate[]
  roles: TeamRoleDefinition[]
  availableSkills: string[]
}
