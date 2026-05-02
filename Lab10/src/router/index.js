import { createRouter, createWebHistory } from 'vue-router'
import table from '../components/table.vue'
import Interface from '../components/interface.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/interface'},
    {path: '/interface', component: Interface},
    {path: '/table', component: table},
  ],
})

export default router
