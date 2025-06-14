<template>
	<div class="landing">
		<div class="hero-section">
			<div class="hero-content">
				<h1 class="hero-title">Rank Your LEIC Journey</h1>
				<div class="motivational-text">
					<p>
						At long last, you have completed your LEIC journey. As a good dedicated student, you spent
						hundreds, perhaps thousands of hours studying, attending classes, and working on projects.
					</p>
					<p>
						Truth be told, it was not easy. But ultimately you are here, and you know damn well it was all
						worth it.
					</p>
					<p>
						Throughout this journey, you have encountered a wide range of courses, each with its own unique
						challenges. Some courses were not that hard, while others pushed you to your limits. Some even
						made you discover strengths you never knew you had.
					</p>
					<p>
						But what is truly important is that each of them tells a unique story. Some challenge you, some
						inspire you, and some change how you see the world of technology.
					</p>
					<p>
						Now it's time to celebrate that journey by ranking all those courses and sharing your unique
						LEIC perspective.
					</p>
					<p>
						This website allows you to build <strong>tierlists</strong> with all the courses of the degree.
						You can create, edit, and share your tierlists as images. Each one will capture a different
						angle of your experience.
					</p>
					<p>
						Rank by difficulty, by favorite professors, by how much you enjoyed the content, or by whatever
						you see fit. The choice is yours, but don't forget to create that "overall experience" tierlist.
						That is the most important one.
					</p>
				</div>
				<button @click="getStarted" class="btn btn-primary btn-large">🚀 Get Started</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
	name: 'Landing',
	setup() {
		const router = useRouter()

		const getStarted = () => {
			router.push('/home')
		}

		return {
			getStarted
		}
	}
}
</script>

<style scoped>
.landing {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 var(--spacing-md);
}

.hero-section {
	text-align: center;
	padding: var(--spacing-xl) 0;
	min-height: 60vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.hero-content {
	max-width: 800px;
}

.hero-title {
	font-size: 4rem;
	font-weight: var(--font-weight-bold);
	color: var(--primary-color);
	margin: 0 0 var(--spacing-md) 0;
	line-height: 1.1;
	background: linear-gradient(135deg, var(--primary-color), #747bff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.motivational-text {
	margin: var(--spacing-lg) 0;
	font-size: 1.1rem;
	line-height: 1.7;
	color: var(--text-color);
}

.motivational-text p {
	margin: 0 0 var(--spacing-md) 0;
}

.motivational-text strong {
	color: var(--primary-color);
	font-weight: 600;
}

.btn-large {
	font-size: 1.25rem;
	padding: var(--spacing-md) var(--spacing-xl);
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(108, 117, 125, 0.3);
	transition: all 0.3s ease;
	text-transform: none;
	font-weight: 600;
	margin-top: var(--spacing-xl);
}

.btn-large:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 24px rgba(108, 117, 125, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
	.hero-title {
		font-size: 2.5rem;
	}
}

@media (max-width: 480px) {
	.hero-title {
		font-size: 2rem;
	}

	.btn-large {
		font-size: 1.1rem;
		padding: var(--spacing-sm) var(--spacing-lg);
	}

	.landing {
		padding: 0 var(--spacing-sm);
	}
}
</style>
