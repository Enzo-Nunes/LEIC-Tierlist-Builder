import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'landing',
			component: Landing
		},
		{
			path: '/home',
			name: 'home',
			component: Home
		},
		{
			path: '/create',
			name: 'create',
			component: Create
		}
	]
})

export default router
