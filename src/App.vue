<template>
	<div id="app">
		<header class="app-header">
			<h1 class="main-title">🎓 LEIC Tierlist Builder</h1>
		</header>

		<main class="main-content">
			<router-view />
		</main>

		<footer class="footer">
			<p>
				Made with ❤️ by Enzo
				<br />
				<a
					href="https://github.com/Enzo-Nunes/LEIC-Tierlist-Builder"
					target="_blank"
					rel="noopener"
					class="github-link"
				>
					⚙️ View Source on GitHub
				</a>
			</p>
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

.footer {
	text-align: center;
	padding: var(--spacing-lg) var(--spacing-md);
	margin-top: var(--spacing-xl);
	color: var(--text-secondary);
	border-top: 1px solid var(--border-color);
	background: var(--surface-color);
}

.footer p {
	margin: 0;
	line-height: 1.6;
}

.github-link {
	color: var(--primary-color);
	text-decoration: none;
	font-weight: 500;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	margin-top: 0.5rem;
}

.github-link:hover {
	color: #747bff;
	text-decoration: underline;
	transform: translateY(-1px);
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
