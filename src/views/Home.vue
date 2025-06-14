<template>
	<div class="home">
		<!-- Notification Toast -->
		<div v-if="notification.show" class="notification-toast" :class="notification.type">
			{{ notification.message }}
		</div>

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
							<th>Download</th>
							<th>Delete</th>
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
							<td class="export-cell">
								<button
									@click.stop="exportTierlist(tierlist)"
									class="btn btn-small btn-secondary"
									title="Download as Image"
								>
									⬇️
								</button>
							</td>
							<td class="delete-cell">
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
		const notification = ref({
			show: false,
			message: '',
			type: 'success'
		})

		const showNotification = (message, type = 'success') => {
			notification.value = {
				show: true,
				message,
				type
			}
			setTimeout(() => {
				notification.value.show = false
			}, 3000)
		}

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
		const exportTierlist = (tierlist) => {
			try {
				if (!tierlist.imageData) {
					showNotification(
						'No image data found for this tierlist. Please edit and save the tierlist to generate an image.',
						'error'
					)
					return
				}

				// Create download link using stored image data
				const link = document.createElement('a')
				link.download = `${tierlist.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_tierlist.png`
				link.href = tierlist.imageData

				// Trigger download
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				showNotification('Tierlist exported successfully! 📥')
			} catch (error) {
				console.error('Error exporting tierlist:', error)
				showNotification('Sorry, there was an error exporting the tierlist. Please try again.', 'error')
			}
		}
		onMounted(() => {
			loadTierlists()
		})

		return {
			tierlists,
			sortedTierlists,
			confirmingDeleteId,
			notification,
			formatDate,
			editTierlist,
			createNewTierlist,
			exportTierlist,
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

/* Table layout */
.data-table {
	table-layout: fixed;
	width: 100%;
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) {
	width: 40%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
	width: 25%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
	width: 15%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
	width: 20%;
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

.export-cell,
.delete-cell {
	text-align: center;
}

/* Center align action buttons */
.export-cell,
.delete-cell {
	text-align: center;
	vertical-align: middle;
	min-width: 90px;
	padding: 8px;
}

/* Delete confirmation dialog */
.delete-confirmation {
	display: inline-flex;
	align-items: center;
	gap: var(--spacing-xs);
	min-width: 120px;
	justify-content: center;
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

/* Notification Toast */
.notification-toast {
	position: fixed;
	top: 20px;
	right: 20px;
	padding: 1rem 1.5rem;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	z-index: 1000;
	font-weight: 500;
	animation: slideIn 0.3s ease-out;
	max-width: 400px;
	word-wrap: break-word;
}

.notification-toast.success {
	background: #28a745;
	color: white;
	border: 1px solid #1e7e34;
}

.notification-toast.error {
	background: #dc3545;
	color: white;
	border: 1px solid #bd2130;
}

@keyframes slideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
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
	.export-cell .btn,
	.delete-cell .btn {
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
