import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTeamBuilderStore } from '@/stores/teamBuilder'

const savedValues = new Map<string, string>()

const memoryStorage: Storage = {
  get length() {
    return savedValues.size
  },
  clear: () => savedValues.clear(),
  getItem: (key) => savedValues.get(key) ?? null,
  key: (index) => Array.from(savedValues.keys())[index] ?? null,
  removeItem: (key) => savedValues.delete(key),
  setItem: (key, value) => savedValues.set(key, value),
}

describe('team builder store', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: memoryStorage,
    })
    memoryStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds a person to the draft and persists the selection', async () => {
    const store = useTeamBuilderStore()
    await store.initialise()

    const candidate = store.candidates.find((item) => item.id === 'arseniy-belikov')
    expect(candidate).toBeDefined()

    store.addMember(candidate!)

    expect(store.isSelected('arseniy-belikov')).toBe(true)
    expect(store.selectedCandidates).toHaveLength(1)
    expect(memoryStorage.getItem('teamworkevidence:team-builder-draft')).toContain(
      'arseniy-belikov',
    )
  })

  it('does not add the same candidate twice', async () => {
    const store = useTeamBuilderStore()
    await store.initialise()

    const candidate = store.candidates[0]
    store.addMember(candidate)
    store.addMember(candidate)

    expect(store.selectedCandidates).toHaveLength(1)
  })
})
