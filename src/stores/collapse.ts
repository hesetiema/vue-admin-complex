import { defineStore } from 'pinia'

type CollapseStatus = 'collapse' | 'drawer'

export const useCollapseStore = defineStore('collapse', {
  state: () => ({
    collapse: true,
    drawer: false,
    status: 'collapse'
  }),
  actions: {
    setStatus(state: CollapseStatus) {
      this.status = state
    },
    switch(state?: boolean) {
      if (typeof state === 'boolean') {
        this.collapse = state
      } else {
        this.collapse = !this.collapse
      }
    },
    closeDrawer() {
      this.drawer = false
    },
    openDrawer() {
      this.drawer = true
    }
  }
})
