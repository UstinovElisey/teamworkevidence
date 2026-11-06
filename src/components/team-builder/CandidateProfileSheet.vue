<script setup lang="ts">
import { computed } from 'vue'
import type { Candidate } from '@/types/teamBuilder'

const props = defineProps<{
  candidate: Candidate | null
  selected: boolean
}>()

const emit = defineEmits<{
  close: []
  add: [candidate: Candidate]
}>()

const availabilityText = computed(() => {
  if (!props.candidate) return ''
  if (props.candidate.availability === 'available') return 'Готов к новым задачам'
  if (props.candidate.availability === 'soon')
    return props.candidate.availableFrom || 'Скоро освободится'
  return props.candidate.availableFrom || 'Сейчас занят в проекте'
})

const workFormatLabel: Record<string, string> = {
  remote: 'Удалённо',
  hybrid: 'Гибрид',
  office: 'Офис',
}
</script>

<template>
  <Transition name="sheet">
    <div v-if="candidate" class="profile-sheet" role="dialog" aria-modal="true">
      <button
        class="profile-sheet__backdrop"
        type="button"
        aria-label="Закрыть"
        @click="emit('close')"
      ></button>
      <section class="profile-sheet__panel">
        <div class="profile-sheet__handle"></div>
        <div class="profile-sheet__header">
          <div class="profile-sheet__avatar" :style="{ backgroundColor: candidate.avatarColor }">
            {{ candidate.initials }}
          </div>
          <div>
            <div class="profile-sheet__name-row">
              <h2>{{ candidate.name }}</h2>
              <span v-if="candidate.verified" class="profile-sheet__verified">✓</span>
            </div>
            <p>{{ candidate.headline }}</p>
          </div>
          <button
            class="profile-sheet__close"
            type="button"
            aria-label="Закрыть"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <div class="profile-sheet__status">
          <span class="profile-sheet__dot"></span>{{ availabilityText }}
        </div>

        <p class="profile-sheet__summary">{{ candidate.summary }}</p>

        <div class="profile-sheet__stats" aria-label="Показатели специалиста">
          <div>
            <strong>★ {{ candidate.rating.toFixed(1) }}</strong
            ><span>рейтинг</span>
          </div>
          <div>
            <strong>{{ candidate.experienceYears }}</strong
            ><span>лет опыта</span>
          </div>
          <div>
            <strong>{{ candidate.completedProjects }}</strong
            ><span>проектов</span>
          </div>
        </div>

        <section class="profile-sheet__section">
          <h3>Навыки</h3>
          <div class="profile-sheet__chips">
            <span v-for="skill in candidate.skills" :key="skill">{{ skill }}</span>
          </div>
        </section>

        <section class="profile-sheet__section profile-sheet__details">
          <div>
            <span>Локация</span><strong>{{ candidate.city }}, {{ candidate.timezone }}</strong>
          </div>
          <div>
            <span>Формат</span
            ><strong>{{
              candidate.workFormat.map((item) => workFormatLabel[item]).join(', ')
            }}</strong>
          </div>
          <div>
            <span>Отвечает</span><strong>в среднем за {{ candidate.responseHours }} ч.</strong>
          </div>
        </section>

        <button
          class="profile-sheet__action"
          type="button"
          :class="{ 'profile-sheet__action--selected': selected }"
          @click="emit('add', candidate)"
        >
          {{ selected ? 'Уже в команде' : 'Добавить в команду' }}
        </button>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.profile-sheet {
  position: fixed;
  z-index: 40;
  inset: 0;
  display: flex;
  align-items: flex-end;
}

.profile-sheet__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgb(15 23 42 / 52%);
  cursor: default;
}

.profile-sheet__panel {
  position: relative;
  width: min(100%, 560px);
  max-height: min(90dvh, 760px);
  margin: 0 auto;
  overflow-y: auto;
  border-radius: 26px 26px 0 0;
  background: var(--bg-page);
  color: var(--text-primary);
  box-shadow: 0 -14px 38px rgb(15 23 42 / 25%);
}

.profile-sheet__handle {
  width: 38px;
  height: 4px;
  margin: 10px auto 8px;
  border-radius: 999px;
  background: var(--border-color);
}

.profile-sheet__header {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) 32px;
  gap: 12px;
  align-items: center;
  padding: 8px 20px 16px;
}

.profile-sheet__avatar {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 17px;
  color: white;
  font-size: 15px;
  font-weight: 750;
}

.profile-sheet__name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-sheet h2,
.profile-sheet h3,
.profile-sheet p {
  margin: 0;
}

.profile-sheet h2 {
  font-size: 19px;
}

.profile-sheet__header p {
  margin-top: 3px;
  color: var(--text-secondary);
  font-size: 13px;
}

.profile-sheet__verified {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 10px;
}

.profile-sheet__close {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: var(--menu-active-bg);
  color: var(--text-secondary);
  font-size: 23px;
  line-height: 1;
  cursor: pointer;
}

.profile-sheet__status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 20px;
  padding: 9px 11px;
  border-radius: 10px;
  background: rgb(22 163 74 / 10%);
  color: #15803d;
  font-size: 12px;
  font-weight: 650;
}

.profile-sheet__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.profile-sheet__summary {
  padding: 18px 20px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.55;
}

.profile-sheet__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 20px;
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.profile-sheet__stats div {
  display: grid;
  gap: 3px;
  padding: 12px;
  text-align: center;
}

.profile-sheet__stats div + div {
  border-left: 1px solid var(--border-color);
}

.profile-sheet__stats strong {
  font-size: 15px;
}

.profile-sheet__stats span,
.profile-sheet__details span {
  color: var(--text-secondary);
  font-size: 11px;
}

.profile-sheet__section {
  padding: 20px 20px 0;
}

.profile-sheet__section h3 {
  margin-bottom: 10px;
  font-size: 14px;
}

.profile-sheet__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.profile-sheet__chips span {
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--menu-active-bg);
  color: var(--text-secondary);
  font-size: 12px;
}

.profile-sheet__details {
  display: grid;
  gap: 11px;
}

.profile-sheet__details div {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.profile-sheet__details strong {
  text-align: right;
  font-size: 12px;
}

.profile-sheet__action {
  width: calc(100% - 40px);
  min-height: 48px;
  margin: 22px 20px max(24px, env(safe-area-inset-bottom));
  border: 0;
  border-radius: 13px;
  background: var(--accent);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.profile-sheet__action--selected {
  background: var(--menu-active-bg);
  color: var(--accent);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-active .profile-sheet__panel,
.sheet-leave-active .profile-sheet__panel {
  transition: transform 0.22s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .profile-sheet__panel,
.sheet-leave-to .profile-sheet__panel {
  transform: translateY(100%);
}
</style>
