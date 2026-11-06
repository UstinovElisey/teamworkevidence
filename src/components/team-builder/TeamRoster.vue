<script setup lang="ts">
import { ref } from 'vue'
import type { Candidate, CandidateRole, TeamMember, TeamRoleDefinition } from '@/types/teamBuilder'

type SelectedCandidate = {
  candidate: Candidate
  member: TeamMember
}

defineProps<{
  items: SelectedCandidate[]
  roles: TeamRoleDefinition[]
}>()

const emit = defineEmits<{
  remove: [candidateId: string]
  updateRole: [candidateId: string, role: CandidateRole]
  updateNote: [candidateId: string, note: string]
}>()

const expandedMemberId = ref<string | null>(null)

function toggleDetails(candidateId: string) {
  expandedMemberId.value = expandedMemberId.value === candidateId ? null : candidateId
}
</script>

<template>
  <section class="team-roster">
    <header class="team-roster__header">
      <div>
        <span>Состав команды</span>
        <h2>
          {{
            items.length
              ? `${items.length} ${items.length === 1 ? 'участник' : 'участника'}`
              : 'Команда пока пуста'
          }}
        </h2>
      </div>
      <span v-if="items.length" class="team-roster__saved">Сохранено</span>
    </header>

    <div v-if="items.length" class="team-roster__list">
      <article v-for="item in items" :key="item.candidate.id" class="team-roster__member">
        <div class="team-roster__member-main">
          <div class="team-roster__avatar" :style="{ backgroundColor: item.candidate.avatarColor }">
            {{ item.candidate.initials }}
          </div>
          <div class="team-roster__identity">
            <h3>{{ item.candidate.name }}</h3>
            <p>{{ item.candidate.headline }}</p>
          </div>
          <button
            class="team-roster__toggle"
            type="button"
            :aria-expanded="expandedMemberId === item.candidate.id"
            aria-label="Настроить участника"
            @click="toggleDetails(item.candidate.id)"
          >
            {{ expandedMemberId === item.candidate.id ? '⌃' : '⌄' }}
          </button>
        </div>

        <Transition name="member-details">
          <div v-if="expandedMemberId === item.candidate.id" class="team-roster__details">
            <label>
              <span>Роль в этой команде</span>
              <select
                :value="item.member.assignment"
                @change="
                  emit(
                    'updateRole',
                    item.candidate.id,
                    ($event.target as HTMLSelectElement).value as CandidateRole,
                  )
                "
              >
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.title }}
                </option>
              </select>
            </label>
            <label>
              <span>Заметка для команды</span>
              <input
                :value="item.member.note"
                maxlength="100"
                placeholder="Например, ведёт интеграции"
                @change="
                  emit('updateNote', item.candidate.id, ($event.target as HTMLInputElement).value)
                "
              />
            </label>
          </div>
        </Transition>

        <footer class="team-roster__member-footer">
          <span>{{ roles.find((role) => role.id === item.member.assignment)?.shortTitle }}</span>
          <button type="button" @click="emit('remove', item.candidate.id)">Убрать</button>
        </footer>
      </article>
    </div>

    <div v-else class="team-roster__empty">
      <div>+</div>
      <p>Добавьте специалистов из списка — здесь появится собранный состав.</p>
    </div>
  </section>
</template>

<style scoped>
.team-roster {
  padding: 18px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--bg-page);
}

.team-roster__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}

.team-roster__header span:first-child {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 650;
  text-transform: uppercase;
}

.team-roster h2,
.team-roster h3,
.team-roster p {
  margin: 0;
}

.team-roster h2 {
  margin-top: 3px;
  color: var(--text-primary);
  font-size: 17px;
}

.team-roster__saved {
  padding: 5px 7px;
  border-radius: 7px;
  background: rgb(22 163 74 / 10%);
  color: #15803d;
  font-size: 10px;
  font-weight: 700;
}

.team-roster__list {
  display: grid;
  gap: 9px;
}

.team-roster__member {
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.team-roster__member-main {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 28px;
  gap: 9px;
  align-items: center;
  padding: 10px;
}

.team-roster__avatar {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 11px;
  color: white;
  font-size: 10px;
  font-weight: 750;
}

.team-roster__identity {
  min-width: 0;
}

.team-roster__identity h3,
.team-roster__identity p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.team-roster__identity h3 {
  color: var(--text-primary);
  font-size: 13px;
}

.team-roster__identity p {
  margin-top: 2px;
  color: var(--text-secondary);
  font-size: 11px;
}

.team-roster__toggle {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--menu-active-bg);
  color: var(--text-secondary);
  cursor: pointer;
}

.team-roster__details {
  display: grid;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--menu-active-bg) 45%, transparent);
}

.team-roster__details label {
  display: grid;
  gap: 5px;
}

.team-roster__details label span {
  color: var(--text-secondary);
  font-size: 10px;
}

.team-roster__details input,
.team-roster__details select {
  width: 100%;
  min-height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: var(--bg-page);
  color: var(--text-primary);
  font: inherit;
  font-size: 12px;
}

.team-roster__details input {
  padding: 0 9px;
}

.team-roster__details select {
  padding: 0 7px;
}

.team-roster__member-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px 9px 53px;
  border-top: 1px solid var(--border-color);
}

.team-roster__member-footer span {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
}

.team-roster__member-footer button {
  border: 0;
  background: transparent;
  color: #dc2626;
  font-size: 11px;
  cursor: pointer;
}

.team-roster__empty {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 25px 16px 16px;
  color: var(--text-secondary);
  text-align: center;
}

.team-roster__empty div {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  color: var(--accent);
  font-size: 21px;
}

.team-roster__empty p {
  max-width: 250px;
  font-size: 12px;
  line-height: 1.45;
}

.member-details-enter-active,
.member-details-leave-active {
  transition: all 0.18s ease;
}

.member-details-enter-from,
.member-details-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
