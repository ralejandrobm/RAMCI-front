// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  
  {
    path: '/riesgo',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Riesgo.vue'),
   /* children: [
      {
        path: 'ejemplo',
        name: 'Mapa',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( webpackChunkName: "home" /// '@/views/Mapa.vue'),
      },
    ], 
    */
    
  },
  {
    path: '/mapa',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Mapa.vue'),
  
  },
  {
    path: '/metodo',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Metodo.vue'),
  
  },
  {
    path: '/dinamico',
    component: () => import(/* webpackChunkName: "home" */ '@/views/MapaDinamico.vue'),
  
  },
  {
    path: '/',
    redirect: '/mapa'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
