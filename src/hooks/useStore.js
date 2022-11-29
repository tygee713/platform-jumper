import create from 'zustand'
import { nanoid } from 'nanoid'

export const useStore = create((set) => ({
  color: 'blue',
  tiles: [],
  addTile: (x, y, z) => {
    set((state) => ({
      tiles: [
        ...state.tiles,
        {
          key: nanoid(),
          pos: [x, y, z],
          color: state.color,
        },
      ]
    }))
  },
  setColor: (color) => {
    set(() => ({
      color,
    }))
  },
  reset: () => {},
}))