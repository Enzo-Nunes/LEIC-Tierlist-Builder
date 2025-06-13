<template>
	<div id="app">
		<header class="app-header">
			<h1 class="main-title">🎓 LEIC Courses Tierlist Builder</h1>
		</header>

		<main class="main-content">
			<router-view />
		</main>

		<footer class="footer">
			<p>&copy; 2025 LEIC Tierlist. Made with ❤️ by Enzo.</p>
		</footer>
	</div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style scoped>
.app-header {
	text-align: center;
	padding: var(--spacing-lg) var(--spacing-md);
	background: linear-gradient(135deg, var(--primary-color), #747bff);
	margin-bottom: var(--spacing-lg);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.main-title {
	font-size: 3rem;
	font-weight: var(--font-weight-bold);
	color: white;
	margin: 0;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	letter-spacing: -0.02em;
}

@media (max-width: 768px) {
	.main-title {
		font-size: 2.2rem;
	}
	.app-header {
		padding: var(--spacing-md) var(--spacing-sm);
	}
}

@media (max-width: 480px) {
	.main-title {
		font-size: 1.8rem;
	}
}
</style>
