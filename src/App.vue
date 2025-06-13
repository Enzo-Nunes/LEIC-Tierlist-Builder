<template>
	<div id="app">
		<nav class="navbar">
			<router-link to="/" class="nav-brand">
				<h1>🏆 LEIC Tierlist</h1>
			</router-link>
			<div class="nav-links">
				<router-link to="/">Home</router-link>
				<router-link to="/create">Create Tierlist</router-link>
				<router-link to="/browse">Browse</router-link>
			</div>
		</nav>

		<main class="main-content">
			<router-view />
		</main>

		<footer class="footer">
			<p>&copy; 2025 LEIC Tierlist. Made with ❤️ by Enzo!</p>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style scoped>
/* Component-specific styles can go here if needed */
/* Layout styles are now in src/styles/layout.css */
</style>
