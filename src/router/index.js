import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import Browse from '../views/Browse.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/create',
			name: 'create',
			component: Create
		},
		{
			path: '/browse',
			name: 'browse',
			component: Browse
		}
	]
})

export default router
