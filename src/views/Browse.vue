<template>
	<div class="browse-page">
		<div class="browse-header">
			<h1>Browse Tierlists 📚</h1>
			<p>Discover amazing tierlists created by the community!</p>
		</div>

		<div class="filter-controls">
			<input v-model="searchQuery" placeholder="Search tierlists..." class="search-input" />
			<select v-model="sortBy" class="sort-select">
				<option value="newest">Newest First</option>
				<option value="oldest">Oldest First</option>
				<option value="title">Title (A-Z)</option>
			</select>
		</div>

		<div v-if="filteredTierlists.length === 0" class="empty-state">
			<div class="empty-icon">📝</div>
			<h3>No tierlists found</h3>
			<p>Be the first to create one!</p>
			<router-link to="/create" class="btn btn-primary"> Create Your First Tierlist </router-link>
		</div>

		<div v-else class="cards-grid">
			<div v-for="tierlist in filteredTierlists" :key="tierlist.id" class="card" @click="viewTierlist(tierlist)">
				<div class="card-header">
					<h3>{{ tierlist.title }}</h3>
					<span class="created-date">
						{{ formatDate(tierlist.createdAt) }}
					</span>
				</div>

				<div class="card-preview">
					<div v-for="tier in tierlist.tiers.slice(0, 3)" :key="tier.name" class="mini-tier">
						<div class="mini-tier-label" :style="{ backgroundColor: tier.color }">
							{{ tier.name }}
						</div>
						<div class="mini-tier-items">
							<div
								v-for="item in tier.items.slice(0, 5)"
								:key="item.id"
								class="mini-item"
								:style="
									item.image
										? {
												backgroundImage: `url(${item.image})`
											}
										: {}
								"
								:class="{ 'mini-text-item': !item.image }"
							>
								<span v-if="!item.image" class="mini-text">{{ item.name.charAt(0) }}</span>
							</div>
							<div v-if="tier.items.length > 5" class="more-items">+{{ tier.items.length - 5 }}</div>
						</div>
					</div>
					<div v-if="tierlist.tiers.length > 3" class="more-tiers">
						+{{ tierlist.tiers.length - 3 }} more tiers
					</div>
				</div>

				<div class="card-actions">
					<button @click.stop="duplicateTierlist(tierlist)" class="btn btn-small">📋 Duplicate</button>
					<button @click.stop="deleteTierlist(tierlist.id)" class="btn btn-small btn-danger">
						🗑️ Delete
					</button>
				</div>
			</div>
		</div>

		<!-- Modal for viewing tierlist -->
		<div v-if="selectedTierlist" class="modal-overlay" @click="closeModal">
			<div class="modal-content" @click.stop>
				<div class="modal-header">
					<h2>{{ selectedTierlist.title }}</h2>
					<button @click="closeModal" class="close-btn">❌</button>
				</div>

				<div class="modal-body">
					<div class="tierlist-view">
						<div v-for="tier in selectedTierlist.tiers" :key="tier.name" class="tier-row">
							<div class="tier-label" :style="{ backgroundColor: tier.color }">
								{{ tier.name }}
							</div>
							<div class="tier-items">
								<div
									v-for="item in tier.items"
									:key="item.id"
									class="tier-item"
									:style="
										item.image
											? {
													backgroundImage: `url(${item.image})`
												}
											: {}
									"
									:class="{ 'text-item': !item.image }"
									:title="item.name"
								>
									<span v-if="!item.image" class="text-content">{{ item.name }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
	name: 'Browse',
	setup() {
		const tierlists = ref([])
		const searchQuery = ref('')
		const sortBy = ref('newest')
		const selectedTierlist = ref(null)

		const filteredTierlists = computed(() => {
			let filtered = tierlists.value.filter((tierlist) =>
				tierlist.title.toLowerCase().includes(searchQuery.value.toLowerCase())
			)

			switch (sortBy.value) {
				case 'newest':
					filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
					break
				case 'oldest':
					filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
					break
				case 'title':
					filtered.sort((a, b) => a.title.localeCompare(b.title))
					break
			}

			return filtered
		})

		const loadTierlists = () => {
			const saved = localStorage.getItem('tierlists')
			if (saved) {
				tierlists.value = JSON.parse(saved)
			}
		}

		const formatDate = (dateString) => {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		}

		const viewTierlist = (tierlist) => {
			selectedTierlist.value = tierlist
		}

		const closeModal = () => {
			selectedTierlist.value = null
		}

		const duplicateTierlist = (tierlist) => {
			const newTierlist = {
				...tierlist,
				id: Date.now(),
				title: `${tierlist.title} (Copy)`,
				createdAt: new Date().toISOString()
			}

			const savedLists = JSON.parse(localStorage.getItem('tierlists') || '[]')
			savedLists.push(newTierlist)
			localStorage.setItem('tierlists', JSON.stringify(savedLists))

			tierlists.value.push(newTierlist)
			alert('Tierlist duplicated successfully! 📋')
		}

		const deleteTierlist = (id) => {
			if (confirm('Are you sure you want to delete this tierlist?')) {
				const savedLists = tierlists.value.filter((t) => t.id !== id)
				localStorage.setItem('tierlists', JSON.stringify(savedLists))
				tierlists.value = savedLists
				alert('Tierlist deleted successfully! 🗑️')
			}
		}

		onMounted(() => {
			loadTierlists()
		})

		return {
			tierlists,
			searchQuery,
			sortBy,
			selectedTierlist,
			filteredTierlists,
			formatDate,
			viewTierlist,
			closeModal,
			duplicateTierlist,
			deleteTierlist
		}
	}
}
</script>

<style scoped>
/* All styles moved to src/styles/pages/browse.css */
</style>
