import create from 'zustand'
import { nanoid } from 'nanoid'

export const useStore = create((set) => ({
  level: 1,
  platforms: [],
  addPlatform: (x, y, z) => {
    set((state) => ({
      platforms: [
        ...state.platforms,
        {
          key: nanoid(),
          pos: [x, y, z],
          color: state.level === 1 ? 'blue' : 'red',
        },
      ]
    }))
  },
  setLevel: (level) => {
    set(() => ({
      level,
    }))
  },
  reset: () => {},
}))