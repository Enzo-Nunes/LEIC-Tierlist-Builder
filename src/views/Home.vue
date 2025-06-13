<template>
	<div class="home">
		<div class="page-header">
			<div class="header-content">
				<h1>My Tierlists</h1>
				<button @click="createNewTierlist" class="btn btn-primary">➕ Create New Tierlist</button>
			</div>
		</div>

		<div class="tierlists-section">
			<div v-if="tierlists.length === 0" class="empty-state">
				<div class="empty-icon">📝</div>
				<h3>No tierlists yet</h3>
				<p>Create your first tierlist to get started!</p>
				<button @click="createNewTierlist" class="btn btn-primary">🚀 Create Your First Tierlist</button>
			</div>

			<div v-else class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th>Title</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="tierlist in sortedTierlists"
							:key="tierlist.id"
							class="tierlist-row clickable-row"
							@click="editTierlist(tierlist)"
						>
							<td class="title-cell">
								{{ tierlist.title }}
							</td>
							<td class="date-cell">
								{{ formatDate(tierlist.createdAt) }}
							</td>
							<td class="actions-cell">
								<div v-if="confirmingDeleteId === tierlist.id" class="delete-confirmation">
									<button @click.stop="cancelDelete()" class="btn btn-small btn-cancel-confirm">
										Cancel
									</button>
									<button
										@click.stop="confirmDelete(tierlist.id)"
										class="btn btn-small btn-delete-confirm"
									>
										Delete
									</button>
								</div>
								<button
									v-else
									@click.stop="showDeleteConfirmation(tierlist.id)"
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
		const confirmingDeleteId = ref(null)

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

		const editTierlist = (tierlist) => {
			// Store the tierlist data in localStorage temporarily for editing
			localStorage.setItem('editingTierlist', JSON.stringify(tierlist))
			router.push('/create')
		}

		const createNewTierlist = () => {
			// Clear any existing editing data to ensure we create a new tierlist
			localStorage.removeItem('editingTierlist')
			router.push('/create')
		}

		const showDeleteConfirmation = (id) => {
			confirmingDeleteId.value = id
		}

		const cancelDelete = () => {
			confirmingDeleteId.value = null
		}

		const confirmDelete = (id) => {
			const savedLists = tierlists.value.filter((t) => t.id !== id)
			localStorage.setItem('tierlists', JSON.stringify(savedLists))
			tierlists.value = savedLists
			confirmingDeleteId.value = null
		}

		onMounted(() => {
			loadTierlists()
		})

		return {
			tierlists,
			sortedTierlists,
			confirmingDeleteId,
			formatDate,
			editTierlist,
			createNewTierlist,
			showDeleteConfirmation,
			cancelDelete,
			confirmDelete
		}
	}
}
</script>

<style scoped>
/* Home Page Styles */
.home {
	max-width: 1200px;
	margin: 0 auto;
	padding: var(--spacing-lg);
}

/* Header section */
.page-header {
	margin-bottom: var(--spacing-lg);
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: var(--spacing-sm);
}

.header-content h1 {
	color: var(--primary-color);
	margin: 0;
	font-size: 2.5rem;
}

/* Clickable row styling */
.clickable-row {
	cursor: pointer;
	transition: background-color var(--transition-normal);
	min-height: 80px;
}

.clickable-row:hover {
	background-color: var(--overlay-bg-hover);
}

/* Ensure table rows maintain consistent height */
.data-table tr {
	min-height: 80px;
}

.data-table td {
	vertical-align: middle;
	min-height: 80px;
}

/* Table column alignment */
.data-table th,
.data-table td {
	text-align: center;
}

/* Override specific cell alignments */
.title-cell {
	text-align: center;
}

.date-cell {
	text-align: center;
}

.actions-cell {
	text-align: center;
}

/* Center align action buttons */
.actions-cell {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 180px;
}

/* Delete confirmation dialog */
.delete-confirmation {
	display: flex;
	align-items: center;
	gap: var(--spacing-xs);
	min-width: 120px;
}

.btn-delete-confirm {
	background: #dc3545;
	border-color: #dc3545;
	color: white;
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
}

.btn-delete-confirm:hover {
	background: #c82333;
	border-color: #bd2130;
}

.btn-cancel-confirm {
	background: #28a745;
	border-color: #28a745;
	color: white;
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
}

.btn-cancel-confirm:hover {
	background: #218838;
	border-color: #1e7e34;
}

/* Responsive design */
@media (max-width: 768px) {
	.header-content {
		flex-direction: column;
		align-items: stretch;
		text-align: center;
	}

	.header-content h1 {
		font-size: 2rem;
	}
}

@media (max-width: 480px) {
	.home {
		padding: var(--spacing-sm);
	}

	.actions-cell .btn {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
	}

	.delete-confirmation {
		min-width: 100px;
		gap: 2px;
	}

	.btn-delete-confirm,
	.btn-cancel-confirm {
		font-size: 0.7rem;
		padding: 0.2rem 0.4rem;
	}
}
</style>
