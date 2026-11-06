<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CandidateCard from '@/components/team-builder/CandidateCard.vue'
import CandidateProfileSheet from '@/components/team-builder/CandidateProfileSheet.vue'
import MobileBottomNav from '@/components/team-builder/MobileBottomNav.vue'
import TeamFilterSheet from '@/components/team-builder/TeamFilterSheet.vue'
import TeamReadinessCard from '@/components/team-builder/TeamReadinessCard.vue'
import TeamRoster from '@/components/team-builder/TeamRoster.vue'
import { useTeamBuilderStore } from '@/stores/teamBuilder'
import type { Candidate, CandidateRole } from '@/types/teamBuilder'

const store = useTeamBuilderStore()
const filterOpen = ref(false)
const selectedCandidate = ref<Candidate | null>(null)
const activeMobilePanel = ref<'specialists' | 'team'>('specialists')
const draftName = ref(store.draft.name)
const draftGoal = ref(store.draft.goal)

const selectedCount = computed(() => store.selectedCandidates.length)
const resultLabel = computed(() => {
  const count = store.filteredCandidates.length
  const remainder = count % 10
  if (count > 10 && count < 15) return `${count} специалистов`
  if (remainder === 1) return `${count} специалист`
  if (remainder > 1 && remainder < 5) return `${count} специалиста`
  return `${count} специалистов`
})

onMounted(() => {
  store.initialise()
})

function openCandidate(candidate: Candidate) {
  selectedCandidate.value = candidate
}

function addCandidate(candidate: Candidate) {
  store.addMember(candidate)
}

function addFromProfile(candidate: Candidate) {
  addCandidate(candidate)
  selectedCandidate.value = null
  activeMobilePanel.value = 'team'
}

function saveDraftDetails() {
  store.updateDraft(draftName.value, draftGoal.value)
  draftName.value = store.draft.name
  draftGoal.value = store.draft.goal
}

function updateRole(candidateId: string, role: CandidateRole) {
  store.updateMemberRole(candidateId, role)
}

function clearDraft() {
  store.clearDraft()
  draftName.value = store.draft.name
  draftGoal.value = store.draft.goal
}
</script>

<template>
  <div class="team-builder-page">
    <section class="team-builder-page__hero">
      <div class="team-builder-page__hero-copy">
        <span class="team-builder-page__eyebrow">Team finder</span>
        <h1>Соберите команду, готовую к запуску</h1>
        <p>
          Подберите людей по ролям, навыкам и доступности. Черновик сохранится прямо на устройстве.
        </p>
      </div>
      <div class="team-builder-page__hero-stat">
        <strong>{{ selectedCount }}</strong>
        <span>{{ selectedCount === 1 ? 'участник' : 'участников' }} в команде</span>
      </div>
    </section>

    <div class="team-builder-page__mobile-tabs">
      <button
        type="button"
        :class="{ 'is-active': activeMobilePanel === 'specialists' }"
        @click="activeMobilePanel = 'specialists'"
      >
        Специалисты
      </button>
      <button
        type="button"
        :class="{ 'is-active': activeMobilePanel === 'team' }"
        @click="activeMobilePanel = 'team'"
      >
        Моя команда <span v-if="selectedCount">{{ selectedCount }}</span>
      </button>
    </div>

    <div class="team-builder-page__grid">
      <section
        class="team-builder-page__browse"
        :class="{ 'mobile-hidden': activeMobilePanel !== 'specialists' }"
      >
        <div class="team-builder-page__browse-header">
          <div>
            <span class="team-builder-page__section-label">Подбор специалистов</span>
            <h2>Кого ищем в команду?</h2>
          </div>
          <button class="team-builder-page__filter-button" type="button" @click="filterOpen = true">
            <span>☷</span> Фильтры
            <b v-if="store.activeFilterCount">{{ store.activeFilterCount }}</b>
          </button>
        </div>

        <label class="team-builder-page__search">
          <span aria-hidden="true">⌕</span>
          <input v-model="store.filters.query" type="search" placeholder="Навык, роль или город" />
          <button
            v-if="store.filters.query"
            type="button"
            aria-label="Очистить поиск"
            @click="store.filters.query = ''"
          >
            ×
          </button>
        </label>

        <div class="team-builder-page__quick-filters" aria-label="Быстрые фильтры">
          <button
            v-for="role in store.roles.slice(0, 5)"
            :key="role.id"
            type="button"
            :class="{ 'is-active': store.filters.roles.includes(role.id) }"
            @click="store.toggleRole(role.id)"
          >
            <i :style="{ backgroundColor: role.accent }"></i>{{ role.shortTitle }}
          </button>
        </div>

        <div class="team-builder-page__results-heading">
          <span v-if="!store.isLoading">{{ resultLabel }}</span>
          <button v-if="store.activeFilterCount" type="button" @click="store.resetFilters()">
            Сбросить фильтры
          </button>
        </div>

        <div
          v-if="store.isLoading"
          class="team-builder-page__skeletons"
          aria-label="Загрузка специалистов"
        >
          <div v-for="item in 4" :key="item" class="team-builder-page__skeleton"></div>
        </div>

        <div v-else-if="store.error" class="team-builder-page__feedback">
          <strong>Не получилось загрузить список</strong>
          <p>{{ store.error }}</p>
          <button type="button" @click="store.initialise()">Повторить</button>
        </div>

        <div v-else-if="store.filteredCandidates.length" class="team-builder-page__candidate-list">
          <CandidateCard
            v-for="candidate in store.filteredCandidates"
            :key="candidate.id"
            :candidate="candidate"
            :selected="store.isSelected(candidate.id)"
            @add="addCandidate"
            @open="openCandidate"
          />
        </div>

        <div v-else class="team-builder-page__feedback">
          <strong>Никого не нашли</strong>
          <p>Попробуйте снять часть условий или изменить запрос.</p>
          <button type="button" @click="store.resetFilters()">Очистить фильтры</button>
        </div>
      </section>

      <aside
        class="team-builder-page__team-panel"
        :class="{ 'mobile-hidden': activeMobilePanel !== 'team' }"
      >
        <section class="team-builder-page__draft-details">
          <label>
            <span>Название команды</span>
            <input v-model="draftName" maxlength="48" @blur="saveDraftDetails" />
          </label>
          <label>
            <span>Цель на ближайший релиз</span>
            <textarea
              v-model="draftGoal"
              rows="2"
              maxlength="160"
              @blur="saveDraftDetails"
            ></textarea>
          </label>
        </section>

        <TeamReadinessCard :health="store.health" :member-count="selectedCount" />

        <TeamRoster
          :items="store.selectedCandidates"
          :roles="store.roles"
          @remove="store.removeMember"
          @update-role="updateRole"
          @update-note="store.updateMemberNote"
        />

        <button
          v-if="selectedCount"
          class="team-builder-page__clear-team"
          type="button"
          @click="clearDraft"
        >
          Очистить черновик
        </button>
      </aside>
    </div>

    <CandidateProfileSheet
      :candidate="selectedCandidate"
      :selected="selectedCandidate ? store.isSelected(selectedCandidate.id) : false"
      @close="selectedCandidate = null"
      @add="addFromProfile"
    />
    <TeamFilterSheet :open="filterOpen" @close="filterOpen = false" />
    <MobileBottomNav />
  </div>
</template>

<style scoped>
.team-builder-page {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding-bottom: 36px;
}

.team-builder-page__hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  min-height: 194px;
  padding: 28px 30px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border-color));
  border-radius: 25px;
  background:
    radial-gradient(
      circle at 89% 25%,
      color-mix(in srgb, var(--accent) 27%, transparent),
      transparent 24%
    ),
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--accent) 11%, var(--bg-page)),
      var(--bg-page) 52%
    );
}

.team-builder-page__eyebrow,
.team-builder-page__section-label {
  color: var(--accent);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.team-builder-page h1,
.team-builder-page h2,
.team-builder-page p {
  margin: 0;
}

.team-builder-page h1 {
  max-width: 560px;
  margin-top: 7px;
  color: var(--text-primary);
  font-size: clamp(28px, 4vw, 39px);
  line-height: 1.07;
  letter-spacing: -0.04em;
}

.team-builder-page__hero-copy p {
  max-width: 580px;
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.team-builder-page__hero-stat {
  display: grid;
  min-width: 110px;
  padding: 15px;
  border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--border-color));
  border-radius: 15px;
  background: color-mix(in srgb, var(--bg-page) 65%, transparent);
}

.team-builder-page__hero-stat strong {
  color: var(--accent);
  font-size: 29px;
  line-height: 1;
}

.team-builder-page__hero-stat span {
  margin-top: 5px;
  color: var(--text-secondary);
  font-size: 11px;
}

.team-builder-page__mobile-tabs {
  display: none;
}

.team-builder-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 24px;
  align-items: start;
  margin-top: 25px;
}

.team-builder-page__browse-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.team-builder-page h2 {
  margin-top: 4px;
  color: var(--text-primary);
  font-size: 22px;
  letter-spacing: -0.02em;
}

.team-builder-page__filter-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: 11px;
  background: var(--bg-page);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.team-builder-page__filter-button span {
  color: var(--accent);
  font-size: 17px;
}

.team-builder-page__filter-button b {
  display: grid;
  width: 17px;
  height: 17px;
  place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 10px;
}

.team-builder-page__search {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 7px;
  min-height: 46px;
  margin-top: 18px;
  padding: 0 13px;
  border: 1px solid var(--border-color);
  border-radius: 13px;
  background: var(--bg-page);
  color: var(--text-muted);
}

.team-builder-page__search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 13%, transparent);
}

.team-builder-page__search > span {
  font-size: 21px;
  line-height: 1;
}

.team-builder-page__search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 13px;
}

.team-builder-page__search input::placeholder {
  color: var(--text-muted);
}

.team-builder-page__search button {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--menu-active-bg);
  color: var(--text-secondary);
  cursor: pointer;
}

.team-builder-page__quick-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 13px -1px 0;
  padding: 1px;
  scrollbar-width: none;
}

.team-builder-page__quick-filters::-webkit-scrollbar {
  display: none;
}

.team-builder-page__quick-filters button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  min-height: 31px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  background: var(--bg-page);
  color: var(--text-secondary);
  font-size: 11px;
  cursor: pointer;
}

.team-builder-page__quick-filters button.is-active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-weight: 700;
}

.team-builder-page__quick-filters i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.team-builder-page__results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  color: var(--text-secondary);
  font-size: 12px;
}

.team-builder-page__results-heading button {
  border: 0;
  background: transparent;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.team-builder-page__candidate-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.team-builder-page__team-panel {
  position: sticky;
  top: 12px;
  display: grid;
  gap: 13px;
}

.team-builder-page__draft-details {
  display: grid;
  gap: 10px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background: var(--bg-page);
}

.team-builder-page__draft-details label {
  display: grid;
  gap: 5px;
}

.team-builder-page__draft-details span {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 650;
}

.team-builder-page__draft-details input,
.team-builder-page__draft-details textarea {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
}

.team-builder-page__draft-details input {
  font-size: 15px;
  font-weight: 750;
}

.team-builder-page__draft-details textarea {
  resize: vertical;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.team-builder-page__draft-details label + label {
  padding-top: 9px;
  border-top: 1px solid var(--border-color);
}

.team-builder-page__clear-team {
  justify-self: center;
  padding: 6px;
  border: 0;
  background: transparent;
  color: #dc2626;
  font-size: 11px;
  cursor: pointer;
}

.team-builder-page__skeletons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.team-builder-page__skeleton {
  min-height: 270px;
  border-radius: 20px;
  background: linear-gradient(
    100deg,
    var(--menu-active-bg) 20%,
    var(--bg-header) 40%,
    var(--menu-active-bg) 60%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.team-builder-page__feedback {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 50px 20px;
  border: 1px dashed var(--border-color);
  border-radius: 18px;
  color: var(--text-secondary);
  text-align: center;
}

.team-builder-page__feedback strong {
  color: var(--text-primary);
  font-size: 15px;
}

.team-builder-page__feedback p {
  font-size: 12px;
}

.team-builder-page__feedback button {
  min-height: 34px;
  margin-top: 4px;
  padding: 0 12px;
  border: 0;
  border-radius: 9px;
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1020px) {
  .team-builder-page__grid {
    grid-template-columns: minmax(0, 1fr) 310px;
    gap: 18px;
  }

  .team-builder-page__candidate-list,
  .team-builder-page__skeletons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .team-builder-page {
    padding-bottom: 84px;
  }

  .team-builder-page__hero {
    min-height: 0;
    margin: -8px -8px 0;
    padding: 23px 17px 19px;
    border-right: 0;
    border-left: 0;
    border-radius: 0 0 21px 21px;
  }

  .team-builder-page h1 {
    max-width: 310px;
    font-size: 27px;
  }

  .team-builder-page__hero-copy p {
    max-width: 330px;
    font-size: 12px;
  }

  .team-builder-page__hero-stat {
    min-width: 72px;
    padding: 10px;
  }

  .team-builder-page__hero-stat strong {
    font-size: 24px;
  }

  .team-builder-page__hero-stat span {
    font-size: 9px;
  }

  .team-builder-page__mobile-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    margin-top: 15px;
    padding: 4px;
    border-radius: 12px;
    background: var(--menu-active-bg);
  }

  .team-builder-page__mobile-tabs button {
    min-height: 34px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
  }

  .team-builder-page__mobile-tabs button.is-active {
    background: var(--bg-page);
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgb(15 23 42 / 9%);
  }

  .team-builder-page__mobile-tabs span {
    display: inline-grid;
    min-width: 16px;
    height: 16px;
    place-items: center;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-size: 9px;
  }

  .team-builder-page__grid {
    display: block;
    margin-top: 16px;
  }

  .team-builder-page__browse.mobile-hidden,
  .team-builder-page__team-panel.mobile-hidden {
    display: none;
  }

  .team-builder-page h2 {
    font-size: 19px;
  }

  .team-builder-page__candidate-list,
  .team-builder-page__skeletons {
    grid-template-columns: 1fr;
  }

  .team-builder-page__team-panel {
    position: static;
  }
}
</style>
