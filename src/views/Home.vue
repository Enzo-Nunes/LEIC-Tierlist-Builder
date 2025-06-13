<template>
	<div class="home">
		<div class="page-header">
			<div class="header-content">
				<h1>My Tierlists</h1>
				<router-link to="/create" class="btn btn-primary"> ➕ Create New Tierlist </router-link>
			</div>
		</div>

		<div class="tierlists-section">
			<div v-if="tierlists.length === 0" class="empty-state">
				<div class="empty-icon">📝</div>
				<h3>No tierlists yet</h3>
				<p>Create your first tierlist to get started!</p>
				<router-link to="/create" class="btn btn-primary"> 🚀 Create Your First Tierlist </router-link>
			</div>

			<div v-else class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Created</th>
							<th>Tiers</th>
							<th>Items</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="tierlist in sortedTierlists" :key="tierlist.id" class="tierlist-row">
							<td class="title-cell">
								<button @click="viewTierlist(tierlist)" class="title-link">
									{{ tierlist.title }}
								</button>
							</td>
							<td class="date-cell">
								{{ formatDate(tierlist.createdAt) }}
							</td>
							<td class="count-cell">
								{{ tierlist.tiers.length }}
							</td>
							<td class="count-cell">
								{{ getTotalItems(tierlist) }}
							</td>
							<td class="actions-cell">
								<button
									@click="editTierlist(tierlist)"
									class="btn btn-small btn-secondary"
									title="Edit"
								>
									✏️
								</button>
								<button
									@click="duplicateTierlist(tierlist)"
									class="btn btn-small"
									title="Duplicate"
								></button>
								<button
									@click="deleteTierlist(tierlist.id)"
									class="btn btn-small btn-danger"
									title="Delete"
								>
									🗑️
								</button>
							</td>
						</tr>
					</tbody>
				</table>
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
									:style="item.image ? { backgroundImage: `url(${item.image})` } : {}"
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
import { useRouter } from 'vue-router'

export default {
	name: 'Home',
	setup() {
		const router = useRouter()
		const tierlists = ref([])
		const selectedTierlist = ref(null)

		const sortedTierlists = computed(() => {
			return [...tierlists.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		}

		const getTotalItems = (tierlist) => {
			const tierItems = tierlist.tiers.reduce((total, tier) => total + tier.items.length, 0)
			const poolItems = tierlist.poolItems ? tierlist.poolItems.length : 0
			return tierItems + poolItems
		}

		const viewTierlist = (tierlist) => {
			selectedTierlist.value = tierlist
		}

		const closeModal = () => {
			selectedTierlist.value = null
		}

		const editTierlist = (tierlist) => {
			// For now, just navigate to create page
			// In the future, we could pass the tierlist data to edit
			router.push('/create')
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
		}

		const deleteTierlist = (id) => {
			if (confirm('Are you sure you want to delete this tierlist?')) {
				const savedLists = tierlists.value.filter((t) => t.id !== id)
				localStorage.setItem('tierlists', JSON.stringify(savedLists))
				tierlists.value = savedLists
			}
		}

		onMounted(() => {
			loadTierlists()
		})

		return {
			tierlists,
			sortedTierlists,
			selectedTierlist,
			formatDate,
			getTotalItems,
			viewTierlist,
			closeModal,
			editTierlist,
			duplicateTierlist,
			deleteTierlist
		}
	}
}
</script>

<style scoped>
/* All styles moved to src/styles/pages/home.css */
</style>
