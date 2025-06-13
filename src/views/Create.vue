<template>
	<div class="create-page">
		<div class="create-header">
			<h1>Create Your Course Tierlist 🎯</h1>
			<p>Drag and drop items to rank them in different tiers!</p>
		</div>

		<div class="tierlist-builder">
			<div class="controls">
				<button @click="goBack" class="btn btn-outline back-button">← Back to Home</button>
				<input v-model="tierlistTitle" placeholder="Enter your tierlist title here..." class="title-input" />
				<div class="control-buttons">
					<button
						@click="saveTierlist"
						:disabled="!tierlistTitle.trim()"
						class="btn btn-primary"
						:class="{ 'btn-disabled': !tierlistTitle.trim() }"
					>
						💾 Save Tierlist
					</button>
					<button @click="downloadTierlist" class="btn btn-secondary">⬇️ Download Image</button>
				</div>
			</div>

			<div id="tierlist-export" class="tierlist-container">
				<div class="tierlist-title" v-if="tierlistTitle.trim()">
					<h2>{{ tierlistTitle }}</h2>
				</div>
				<div v-for="(tier, index) in tiers" :key="tier.id" class="tier-row">
					<div class="tier-label" :style="{ backgroundColor: tier.color }">
						{{ tier.name }}
					</div>
					<div
						class="tier-items"
						@drop="onDrop($event, index)"
						@dragover="onDragOver($event, index)"
						@dragenter.prevent
						:class="{ 'drag-over': tier.dragOver }"
						@dragenter="tier.dragOver = true"
						@dragleave="tier.dragOver = false"
					>
						<div
							v-for="(item, itemIndex) in tier.items"
							:key="item.id"
							class="tier-item"
							:class="{
								'course-item': item.type === 'course',
								'drag-before': tier.dropPosition === itemIndex,
								'drag-after': tier.dropPosition === itemIndex + 1 && itemIndex === tier.items.length - 1
							}"
							:style="item.image ? { backgroundImage: `url(${item.image})` } : {}"
							draggable="true"
							@dragstart="onDragStart($event, item, index, itemIndex)"
							@dragend="onDragEnd"
							:title="item.name"
						>
							<span v-if="item.type === 'course'" class="course-text">{{ item.name }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="item-pool">
				<h3>LEIC Courses</h3>
				<div class="pool-items" @drop="onDropToPool($event)" @dragover.prevent @dragenter.prevent>
					<div
						v-for="item in poolItems"
						:key="item.id"
						class="tier-item course-item"
						draggable="true"
						@dragstart="onDragStart($event, item, null, null)"
						@dragend="onDragEnd"
						:title="item.name"
					>
						<span class="course-text">{{ item.name }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
	name: 'Create',
	setup() {
		const router = useRouter()
		const tierlistTitle = ref('')
		const draggedItem = ref(null)
		const draggedFromTier = ref(null)
		const isEditing = ref(false)
		const editingTierlistId = ref(null)

		const defaultTiers = [
			{ id: 1, name: 'S', color: '#ff7f7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 2, name: 'A', color: '#ffbf7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 3, name: 'B', color: '#ffdf7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 4, name: 'C', color: '#ffff7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 5, name: 'D', color: '#bfff7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 6, name: 'E', color: '#7fff7f', items: [], dragOver: false, dropPosition: -1 },
			{ id: 7, name: 'F', color: '#7fbfff', items: [], dragOver: false, dropPosition: -1 }
		]

		const courseList = [
			'CDI-1',
			'Álgebra',
			'FP',
			'IEI',
			'LP',
			'Gestão',
			'CDI-2',
			'IAED',
			'Física 1',
			'IAC',
			'EMD',
			'CDI-3',
			'PO',
			'Física 2',
			'SO',
			'ASA',
			'PE',
			'TC',
			'IPM',
			'BD',
			'IA',
			'OC',
			'Apre',
			'AMS',
			'RC',
			'SD',
			'ESof',
			'Compiladores',
			'CG'
		]

		const tiers = reactive([...defaultTiers])
		const poolItems = reactive([])

		// Initialize pool with fixed courses
		const initializeCourses = () => {
			poolItems.splice(0, poolItems.length) // Clear existing items
			courseList.forEach((course, index) => {
				poolItems.push({
					id: index + 1,
					name: course,
					type: 'course'
				})
			})
		}

		let nextItemId = courseList.length + 1

		const generateItemId = () => nextItemId++

		const onDragStart = (event, item, tierIndex = null, itemIndex = null) => {
			draggedItem.value = item
			// Find which tier the item is currently in
			if (tierIndex !== null) {
				draggedFromTier.value = tierIndex
			} else {
				draggedFromTier.value = tiers.findIndex((tier) =>
					tier.items.some((tierItem) => tierItem.id === item.id)
				)
				if (draggedFromTier.value === -1) {
					draggedFromTier.value = 'pool'
				}
			}
			event.target.classList.add('dragging')
		}

		const onDragEnd = (event) => {
			event.target.classList.remove('dragging')
			// Reset drag over states and drop positions
			tiers.forEach((tier) => {
				tier.dragOver = false
				tier.dropPosition = -1
			})
		}

		const onDragOver = (event, tierIndex) => {
			event.preventDefault()
			if (!draggedItem.value) return

			const tier = tiers[tierIndex]
			const rect = event.currentTarget.getBoundingClientRect()
			const x = event.clientX - rect.left

			// Calculate drop position based on cursor position
			let dropPosition = 0
			const items = event.currentTarget.querySelectorAll('.tier-item')

			for (let i = 0; i < items.length; i++) {
				const itemRect = items[i].getBoundingClientRect()
				const itemCenter = itemRect.left + itemRect.width / 2 - rect.left

				if (x < itemCenter) {
					dropPosition = i
					break
				} else {
					dropPosition = i + 1
				}
			}

			tier.dropPosition = dropPosition
		}

		const onDrop = (event, tierIndex) => {
			event.preventDefault()
			if (!draggedItem.value) return

			const targetTier = tiers[tierIndex]
			const dropPosition = targetTier.dropPosition >= 0 ? targetTier.dropPosition : targetTier.items.length

			targetTier.dragOver = false
			targetTier.dropPosition = -1

			// Check if it's reordering within the same tier
			if (draggedFromTier.value === tierIndex) {
				const currentIndex = targetTier.items.findIndex((item) => item.id === draggedItem.value.id)
				if (currentIndex !== -1) {
					// Reorder within the same tier
					const [item] = targetTier.items.splice(currentIndex, 1)
					const newIndex = dropPosition > currentIndex ? dropPosition - 1 : dropPosition
					targetTier.items.splice(newIndex, 0, item)
				}
			} else {
				// Moving between different tiers or from pool
				// Remove item from previous location
				if (draggedFromTier.value === 'pool') {
					const poolIndex = poolItems.findIndex((item) => item.id === draggedItem.value.id)
					if (poolIndex > -1) {
						poolItems.splice(poolIndex, 1)
					}
				} else if (typeof draggedFromTier.value === 'number') {
					const fromTier = tiers[draggedFromTier.value]
					const itemIndex = fromTier.items.findIndex((item) => item.id === draggedItem.value.id)
					if (itemIndex > -1) {
						fromTier.items.splice(itemIndex, 1)
					}
				}

				// Add item to target tier at specific position
				targetTier.items.splice(dropPosition, 0, draggedItem.value)
			}

			draggedItem.value = null
			draggedFromTier.value = null
		}

		const onDropToPool = (event) => {
			event.preventDefault()
			if (!draggedItem.value) return

			// Remove item from tier
			if (typeof draggedFromTier.value === 'number') {
				const fromTier = tiers[draggedFromTier.value]
				const itemIndex = fromTier.items.findIndex((item) => item.id === draggedItem.value.id)
				if (itemIndex > -1) {
					fromTier.items.splice(itemIndex, 1)
				}
			}

			// Add back to pool
			poolItems.push(draggedItem.value)
			draggedItem.value = null
			draggedFromTier.value = null
		}

		const saveTierlist = () => {
			if (!tierlistTitle.value.trim()) {
				alert('Please enter a title for your tierlist!')
				return
			}

			const tierlistData = {
				title: tierlistTitle.value,
				tiers: tiers.map((tier) => ({
					name: tier.name,
					color: tier.color,
					items: tier.items
				})),
				poolItems: poolItems
			}

			const savedLists = JSON.parse(localStorage.getItem('tierlists') || '[]')

			if (isEditing.value && editingTierlistId.value) {
				// Update existing tierlist
				const index = savedLists.findIndex((list) => list.id === editingTierlistId.value)
				if (index !== -1) {
					savedLists[index] = {
						...savedLists[index],
						...tierlistData,
						updatedAt: new Date().toISOString()
					}
					alert('Tierlist updated successfully! 🎉')
				}
			} else {
				// Create new tierlist
				savedLists.push({
					id: Date.now(),
					...tierlistData,
					createdAt: new Date().toISOString()
				})
				alert('Tierlist saved successfully! 🎉')
			}

			localStorage.setItem('tierlists', JSON.stringify(savedLists))

			// Clear editing data and reset to create mode
			localStorage.removeItem('editingTierlist')
			isEditing.value = false
			editingTierlistId.value = null
		}

		const loadExistingTierlist = () => {
			const editingData = localStorage.getItem('editingTierlist')
			if (editingData) {
				try {
					const tierlistData = JSON.parse(editingData)

					// Set editing mode
					isEditing.value = true
					editingTierlistId.value = tierlistData.id

					// Load the data
					tierlistTitle.value = tierlistData.title || ''

					// Clear current tiers and pool
					tiers.forEach((tier) => (tier.items = []))
					poolItems.splice(0, poolItems.length)

					// Load tiers data
					if (tierlistData.tiers) {
						tierlistData.tiers.forEach((tierData, index) => {
							if (tiers[index]) {
								tiers[index].items = tierData.items || []
							}
						})
					}

					// Load pool items (for backward compatibility)
					if (tierlistData.poolItems) {
						tierlistData.poolItems.forEach((item) => {
							poolItems.push(item)
						})
					} else {
						// If no pool items saved, initialize with courses
						initializeCourses()
					}

					// Update nextItemId to avoid conflicts
					const allItems = [...poolItems, ...tiers.flatMap((tier) => tier.items)]
					if (allItems.length > 0) {
						nextItemId = Math.max(...allItems.map((item) => item.id || 0)) + 1
					}

					console.log('Loaded existing tierlist for editing:', tierlistData.title)
				} catch (error) {
					console.error('Error loading tierlist data:', error)
					localStorage.removeItem('editingTierlist')
					initializeCourses()
				}
			} else {
				// No editing data, initialize with courses
				initializeCourses()
			}
		}

		// Load existing tierlist data when component mounts
		onMounted(() => {
			loadExistingTierlist()
		})

		const goBack = () => {
			// Clear any editing data and go back to home
			localStorage.removeItem('editingTierlist')
			router.push('/')
		}

		const downloadTierlist = async () => {
			if (!tierlistTitle.value.trim()) {
				alert('Please enter a title for your tierlist before downloading!')
				return
			}

			try {
				// Dynamic import of html2canvas to avoid bundling issues
				const html2canvas = (await import('html2canvas')).default

				const element = document.getElementById('tierlist-export')
				if (!element) {
					alert('Error: Could not find tierlist to export')
					return
				}

				// Configure html2canvas options
				const canvas = await html2canvas(element, {
					backgroundColor: '#242424',
					scale: 2, // Higher quality
					useCORS: true,
					allowTaint: true,
					foreignObjectRendering: true
				})

				// Create download link
				const link = document.createElement('a')
				link.download = `${tierlistTitle.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_tierlist.png`
				link.href = canvas.toDataURL('image/png')

				// Trigger download
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				alert('Tierlist image downloaded successfully! 📥')
			} catch (error) {
				console.error('Error generating image:', error)
				alert('Sorry, there was an error generating the image. Please try again.')
			}
		}

		return {
			tierlistTitle,
			tiers,
			poolItems,
			goBack,
			onDragStart,
			onDragEnd,
			onDragOver,
			onDrop,
			onDropToPool,
			saveTierlist,
			downloadTierlist
		}
	}
}
</script>

<style scoped>
/* Create Page Styles */
.create-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: var(--spacing-lg);
}

.create-header {
	text-align: center;
	margin-bottom: var(--spacing-lg);
}

.create-header h1 {
	color: var(--primary-color);
	margin-bottom: var(--spacing-xs);
}

/* Controls section */
.controls {
	display: flex;
	align-items: center;
	margin-bottom: var(--spacing-lg);
	flex-wrap: wrap;
	gap: var(--spacing-md);
	min-height: 60px;
}

.back-button {
	flex-shrink: 0;
	height: 50px;
	padding: 0 1rem;
	display: flex;
	align-items: center;
	font-size: 1rem;
}

.title-input {
	flex: 1;
	min-width: 200px;
	height: 50px;
	padding: 0 0.75rem;
	font-size: 1.2rem;
	font-weight: var(--font-weight-bold);
	background: var(--overlay-bg);
	border: 2px solid var(--border-color);
	border-radius: var(--border-radius-md);
	color: inherit;
	box-sizing: border-box;
}

.title-input:focus {
	outline: none;
	border-color: var(--primary-color);
}

.control-buttons {
	display: flex;
	gap: var(--spacing-md);
	flex-wrap: wrap;
	align-items: center;
}

.control-buttons .btn {
	height: 50px;
	padding: 0 1rem;
	display: flex;
	align-items: center;
	white-space: nowrap;
}

/* Pool controls */
.pool-controls {
	display: flex;
	gap: var(--spacing-md);
	margin-bottom: var(--spacing-md);
	flex-wrap: wrap;
	align-items: center;
}

.file-input {
	display: none;
}

/* Course items */
.course-item {
	background: linear-gradient(135deg, var(--primary-color), #747bff) !important;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-md);
	transition:
		transform var(--transition-fast),
		box-shadow var(--transition-fast);
	/* Override global tier-item size constraints */
	width: auto !important;
	height: auto !important;
	min-width: 60px;
	min-height: 40px;
	padding: 8px 12px;
}

.course-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
}

.course-text {
	color: white;
	font-weight: var(--font-weight-bold);
	font-size: 0.9rem;
	text-align: center;
	word-break: break-word;
	line-height: 1.2;
	white-space: nowrap;
}

/* Tierlist export styles */
.tierlist-title {
	text-align: center;
	margin-bottom: var(--spacing-lg);
	padding: var(--spacing-md);
	background: var(--overlay-bg);
	border-radius: var(--border-radius-lg);
	border: 2px solid var(--primary-color);
}

.tierlist-title h2 {
	color: var(--primary-color);
	margin: 0;
	font-size: 2rem;
	font-weight: var(--font-weight-bold);
}

/* Export container styling */
#tierlist-export {
	background: var(--card-bg);
	padding: var(--spacing-lg);
	border-radius: var(--border-radius-lg);
	border: 2px solid var(--primary-color);
	margin-bottom: var(--spacing-lg);
}

/* Hide drag over states in export */
#tierlist-export .drag-over {
	background: transparent !important;
}

/* Ensure text items look good in export */
#tierlist-export .text-item {
	background: linear-gradient(135deg, var(--primary-color), #747bff) !important;
}

/* Drag and drop visual feedback */
.tier-item.drag-before {
	border-left: 3px solid var(--primary-color);
	margin-left: 2px;
}

.tier-item.drag-after {
	border-right: 3px solid var(--primary-color);
	margin-right: 2px;
}

.tier-item.dragging {
	opacity: 0.5;
	transform: rotate(5deg);
}

/* Responsive design */
@media (max-width: 768px) {
	.controls {
		flex-direction: column;
		align-items: stretch;
	}

	.control-buttons {
		justify-content: center;
	}

	.pool-controls {
		flex-direction: column;
		align-items: stretch;
	}
}
</style>
