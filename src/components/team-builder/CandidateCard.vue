<script setup lang="ts">
import { computed } from 'vue'
import type { Candidate } from '@/types/teamBuilder'

const props = defineProps<{
  candidate: Candidate
  selected: boolean
}>()

const emit = defineEmits<{
  add: [candidate: Candidate]
  open: [candidate: Candidate]
}>()

const availability = computed(() => {
  if (props.candidate.availability === 'available') {
    return { label: 'Доступен сейчас', className: 'is-available' }
  }

  if (props.candidate.availability === 'soon') {
    return { label: props.candidate.availableFrom || 'Скоро свободен', className: 'is-soon' }
  }

  return { label: props.candidate.availableFrom || 'Занят', className: 'is-busy' }
})

const visibleSkills = computed(() => props.candidate.skills.slice(0, 3))
</script>

<template>
  <article class="candidate-card" :class="{ 'candidate-card--selected': selected }">
    <button class="candidate-card__main" type="button" @click="emit('open', candidate)">
      <div class="candidate-card__topline">
        <div
          class="candidate-card__avatar"
          :style="{ backgroundColor: candidate.avatarColor }"
          aria-hidden="true"
        >
          {{ candidate.initials }}
        </div>

        <div class="candidate-card__identity">
          <div class="candidate-card__name-row">
            <h3>{{ candidate.name }}</h3>
            <span
              v-if="candidate.verified"
              class="candidate-card__verified"
              title="Профиль подтверждён"
            >
              ✓
            </span>
          </div>
          <p>{{ candidate.headline }}</p>
        </div>

        <span class="candidate-card__availability" :class="availability.className">
          <i></i>{{ availability.label }}
        </span>
      </div>

      <p class="candidate-card__summary">{{ candidate.summary }}</p>

      <div class="candidate-card__roles" aria-label="Специализации">
        <span v-for="role in candidate.roles" :key="role">{{ role }}</span>
      </div>

      <div class="candidate-card__skills" aria-label="Навыки">
        <span v-for="skill in visibleSkills" :key="skill">{{ skill }}</span>
        <span
          v-if="candidate.skills.length > visibleSkills.length"
          class="candidate-card__skills-more"
        >
          +{{ candidate.skills.length - visibleSkills.length }}
        </span>
      </div>

      <div class="candidate-card__metrics">
        <span>★ {{ candidate.rating.toFixed(1) }}</span>
        <span>{{ candidate.experienceYears }} лет опыта</span>
        <span>{{ candidate.city }}</span>
      </div>
    </button>

    <div class="candidate-card__footer">
      <span>{{ candidate.completedProjects }} проектов</span>
      <button
        class="candidate-card__action"
        :class="{ 'candidate-card__action--selected': selected }"
        type="button"
        :aria-pressed="selected"
        @click="emit('add', candidate)"
      >
        {{ selected ? 'В команде' : 'Добавить' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.candidate-card {
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--bg-page);
  box-shadow: 0 10px 24px rgb(15 23 42 / 5%);
  transition:
    border-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.candidate-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 55%, var(--border-color));
  box-shadow: 0 16px 32px rgb(15 23 42 / 9%);
}

.candidate-card--selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 18%, transparent);
}

.candidate-card__main {
  display: block;
  width: 100%;
  padding: 16px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.candidate-card__topline {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 11px;
  align-items: center;
}

.candidate-card__avatar {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 14px;
  color: white;
  font-size: 13px;
  font-weight: 700;
}

.candidate-card__identity {
  min-width: 0;
}

.candidate-card__name-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.candidate-card__name-row h3 {
  overflow: hidden;
  margin: 0;
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.candidate-card__verified {
  display: grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 800;
}

.candidate-card__identity p {
  overflow: hidden;
  margin: 2px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.candidate-card__availability {
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  margin-top: 2px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
}

.candidate-card__availability i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.is-available {
  background: rgb(22 163 74 / 12%);
  color: #15803d;
}

.is-soon {
  background: rgb(217 119 6 / 13%);
  color: #b45309;
}

.is-busy {
  background: rgb(100 116 139 / 13%);
  color: #64748b;
}

.candidate-card__summary {
  display: -webkit-box;
  overflow: hidden;
  margin: 14px 0 12px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.candidate-card__roles,
.candidate-card__skills,
.candidate-card__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.candidate-card__roles span {
  padding: 4px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
}

.candidate-card__skills {
  margin-top: 11px;
}

.candidate-card__skills span {
  color: var(--text-secondary);
  font-size: 11px;
}

.candidate-card__skills-more {
  color: var(--text-muted) !important;
}

.candidate-card__metrics {
  gap: 11px;
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 11px;
}

.candidate-card__metrics span:first-child {
  color: #b45309;
  font-weight: 700;
}

.candidate-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 11px;
}

.candidate-card__action {
  min-height: 31px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: var(--accent);
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-card__action--selected {
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
}
</style>
