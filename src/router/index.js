import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'

const router = createRouter({
	history: createWebHashHistory(),
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
