<script setup lang="ts">
import { computed } from 'vue'
import { useTeamBuilderStore } from '@/stores/teamBuilder'
import type { Availability, WorkFormat } from '@/types/teamBuilder'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useTeamBuilderStore()

const availabilityOptions: { label: string; value: 'all' | Availability }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Свободен', value: 'available' },
  { label: 'Скоро', value: 'soon' },
  { label: 'Занят', value: 'busy' },
]

const formatOptions: { label: string; value: 'all' | WorkFormat }[] = [
  { label: 'Любой', value: 'all' },
  { label: 'Удалённо', value: 'remote' },
  { label: 'Гибрид', value: 'hybrid' },
  { label: 'Офис', value: 'office' },
]

const visibleSkills = computed(() => store.availableSkills.slice(0, 12))
</script>

<template>
  <Transition name="filter-sheet">
    <div
      v-if="open"
      class="filter-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Фильтры поиска"
    >
      <button
        class="filter-sheet__backdrop"
        type="button"
        aria-label="Закрыть фильтры"
        @click="emit('close')"
      ></button>
      <section class="filter-sheet__panel">
        <div class="filter-sheet__handle"></div>
        <header class="filter-sheet__header">
          <div>
            <h2>Фильтры</h2>
            <p>Настройте подбор под задачу команды</p>
          </div>
          <button class="filter-sheet__reset" type="button" @click="store.resetFilters()">
            Сбросить
          </button>
        </header>

        <section class="filter-sheet__section">
          <h3>Роль в команде</h3>
          <div class="filter-sheet__roles">
            <button
              v-for="role in store.roles"
              :key="role.id"
              type="button"
              :class="{ 'is-active': store.filters.roles.includes(role.id) }"
              @click="store.toggleRole(role.id)"
            >
              <span :style="{ backgroundColor: role.accent }"></span>{{ role.shortTitle }}
            </button>
          </div>
        </section>

        <section class="filter-sheet__section">
          <h3>Доступность</h3>
          <div class="filter-sheet__segment">
            <button
              v-for="option in availabilityOptions"
              :key="option.value"
              type="button"
              :class="{ 'is-active': store.filters.availability === option.value }"
              @click="store.setAvailability(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="filter-sheet__section">
          <h3>Формат работы</h3>
          <div class="filter-sheet__format">
            <button
              v-for="option in formatOptions"
              :key="option.value"
              type="button"
              :class="{ 'is-active': store.filters.workFormat === option.value }"
              @click="store.setWorkFormat(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="filter-sheet__section">
          <div class="filter-sheet__heading-row">
            <h3>
              Рейтинг от
              {{ store.filters.minimumRating ? store.filters.minimumRating.toFixed(1) : 'любого' }}
            </h3>
            <span>★</span>
          </div>
          <input
            :value="store.filters.minimumRating"
            class="filter-sheet__range"
            type="range"
            min="0"
            max="5"
            step="0.1"
            aria-label="Минимальный рейтинг"
            @input="store.setMinimumRating(Number(($event.target as HTMLInputElement).value))"
          />
          <div class="filter-sheet__range-labels"><span>0</span><span>5.0</span></div>
        </section>

        <section class="filter-sheet__section filter-sheet__section--last">
          <h3>Навыки</h3>
          <div class="filter-sheet__skills">
            <button
              v-for="skill in visibleSkills"
              :key="skill"
              type="button"
              :class="{ 'is-active': store.filters.skills.includes(skill) }"
              @click="store.toggleSkill(skill)"
            >
              {{ skill }}
            </button>
          </div>
        </section>

        <button class="filter-sheet__apply" type="button" @click="emit('close')">
          Показать {{ store.filteredCandidates.length }} специалистов
        </button>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.filter-sheet {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: flex;
  align-items: flex-end;
}

.filter-sheet__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(15 23 42 / 52%);
}

.filter-sheet__panel {
  position: relative;
  width: min(100%, 640px);
  max-height: 90dvh;
  margin: 0 auto;
  overflow-y: auto;
  border-radius: 26px 26px 0 0;
  background: var(--bg-page);
  color: var(--text-primary);
  box-shadow: 0 -14px 38px rgb(15 23 42 / 25%);
}

.filter-sheet__handle {
  width: 38px;
  height: 4px;
  margin: 10px auto 6px;
  border-radius: 999px;
  background: var(--border-color);
}

.filter-sheet__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 20px 18px;
}

.filter-sheet h2,
.filter-sheet h3,
.filter-sheet p {
  margin: 0;
}

.filter-sheet h2 {
  font-size: 20px;
}

.filter-sheet__header p {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.filter-sheet__reset {
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.filter-sheet__section {
  padding: 18px 20px;
  border-top: 1px solid var(--border-color);
}

.filter-sheet__section h3 {
  margin-bottom: 11px;
  font-size: 13px;
}

.filter-sheet__roles,
.filter-sheet__format,
.filter-sheet__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-sheet__roles button,
.filter-sheet__format button,
.filter-sheet__skills button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.filter-sheet__roles button span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.filter-sheet button.is-active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-weight: 700;
}

.filter-sheet__segment {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.filter-sheet__segment button {
  min-height: 35px;
  border: 0;
  border-right: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
}

.filter-sheet__segment button:last-child {
  border-right: 0;
}

.filter-sheet__segment button.is-active {
  background: var(--accent);
  color: white;
}

.filter-sheet__heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-sheet__heading-row span {
  color: #b45309;
}

.filter-sheet__range {
  width: 100%;
  margin: 8px 0 2px;
  accent-color: var(--accent);
}

.filter-sheet__range-labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 11px;
}

.filter-sheet__section--last {
  padding-bottom: 22px;
}

.filter-sheet__apply {
  position: sticky;
  bottom: 0;
  width: calc(100% - 40px);
  min-height: 48px;
  margin: 0 20px max(20px, env(safe-area-inset-bottom));
  border: 0;
  border-radius: 13px;
  background: var(--accent);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.filter-sheet-enter-active,
.filter-sheet-leave-active {
  transition: opacity 0.2s ease;
}

.filter-sheet-enter-active .filter-sheet__panel,
.filter-sheet-leave-active .filter-sheet__panel {
  transition: transform 0.22s ease;
}

.filter-sheet-enter-from,
.filter-sheet-leave-to {
  opacity: 0;
}

.filter-sheet-enter-from .filter-sheet__panel,
.filter-sheet-leave-to .filter-sheet__panel {
  transform: translateY(100%);
}
</style>
