import { defineStore } from 'pinia'

export const useCollapseStore = defineStore('collapse', {
  state: () => ({
    collapse: true
  }),
  actions: {
    switch(state: boolean) {
      this.collapse = state
    }
  }
})
