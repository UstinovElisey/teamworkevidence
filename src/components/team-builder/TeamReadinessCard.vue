<script setup lang="ts">
import { computed } from 'vue'
import { getReadinessLabel } from '@/utils/teamMetrics'
import type { TeamHealth } from '@/types/teamBuilder'

const props = defineProps<{
  health: TeamHealth
  memberCount: number
}>()

const gaugeStyle = computed(() => ({
  '--readiness': `${props.health.readiness * 3.6}deg`,
}))

const readinessLabel = computed(() => getReadinessLabel(props.health.readiness))
</script>

<template>
  <section class="readiness-card">
    <div class="readiness-card__copy">
      <span class="readiness-card__eyebrow">Состояние команды</span>
      <h2>{{ readinessLabel }}</h2>
      <p>
        {{ health.coveredRoles }} из {{ health.requiredRoles }} ключевых ролей закрыто
        <template v-if="memberCount"> · {{ memberCount }} участника</template>
      </p>
    </div>

    <div class="readiness-card__gauge" :style="gaugeStyle" aria-label="Готовность команды">
      <div>
        <strong>{{ health.readiness }}</strong
        ><span>%</span>
      </div>
    </div>

    <div class="readiness-card__stats">
      <div>
        <span>Средний рейтинг</span><strong>★ {{ health.averageRating || '—' }}</strong>
      </div>
      <div>
        <span>Свободны сейчас</span><strong>{{ health.availableMembers }}</strong>
      </div>
      <div>
        <span>Средний опыт</span><strong>{{ health.averageExperience || '—' }} лет</strong>
      </div>
    </div>

    <div v-if="health.missingRoles.length" class="readiness-card__missing">
      <span>Нужно добавить:</span>
      <strong v-for="role in health.missingRoles" :key="role.id">{{ role.shortTitle }}</strong>
    </div>
    <div v-else class="readiness-card__ready">Ключевые роли собраны, можно планировать старт.</div>
  </section>
</template>

<style scoped>
.readiness-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 88px;
  gap: 16px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--accent) 32%, var(--border-color));
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--accent) 16%, transparent),
      transparent 45%
    ),
    var(--bg-page);
}

.readiness-card__eyebrow {
  color: var(--accent);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.readiness-card h2,
.readiness-card p {
  margin: 0;
}

.readiness-card h2 {
  margin-top: 4px;
  color: var(--text-primary);
  font-size: 18px;
}

.readiness-card__copy p {
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.35;
}

.readiness-card__gauge {
  display: grid;
  width: 88px;
  height: 88px;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--accent) var(--readiness), var(--menu-active-bg) 0deg);
}

.readiness-card__gauge::before {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--bg-page);
  content: '';
}

.readiness-card__gauge div {
  z-index: 1;
  display: flex;
  align-items: baseline;
  color: var(--text-primary);
}

.readiness-card__gauge strong {
  font-size: 23px;
  letter-spacing: -0.06em;
}

.readiness-card__gauge span {
  color: var(--text-secondary);
  font-size: 11px;
}

.readiness-card__stats {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 4px;
}

.readiness-card__stats div {
  display: grid;
  gap: 3px;
}

.readiness-card__stats div + div {
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}

.readiness-card__stats span {
  color: var(--text-secondary);
  font-size: 10px;
}

.readiness-card__stats strong {
  color: var(--text-primary);
  font-size: 13px;
}

.readiness-card__stats div:first-child strong {
  color: #b45309;
}

.readiness-card__missing,
.readiness-card__ready {
  grid-column: 1 / -1;
  margin-top: 1px;
  color: var(--text-secondary);
  font-size: 11px;
}

.readiness-card__missing {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}

.readiness-card__missing strong {
  padding: 3px 6px;
  border-radius: 6px;
  background: var(--menu-active-bg);
  color: var(--text-primary);
  font-size: 10px;
}

.readiness-card__ready {
  color: var(--accent);
  font-weight: 650;
}
</style>
