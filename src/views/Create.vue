<template>
	<div class="create-page">
		<!-- Notification Toast -->
		<div v-if="notification.show" class="notification-toast" :class="notification.type">
			{{ notification.message }}
		</div>

		<!-- Confirmation Dialog -->
		<div v-if="showConfirmDialog" class="modal-overlay" @click="cancelGoBack">
			<div class="modal-dialog" @click.stop>
				<div class="modal-content">
					<h3>Unsaved Changes</h3>
					<p>You have unsaved changes. Are you sure you want to go back? Your changes will be lost.</p>
					<div class="modal-actions">
						<button @click="cancelGoBack" class="btn btn-secondary">Cancel</button>
						<button @click="confirmGoBack" class="btn btn-danger">Go Back</button>
					</div>
				</div>
			</div>
		</div>

		<div class="create-header">
			<h1>Create Your Course Tierlist 🎯</h1>
			<p>Drag and drop items to rank them in different tiers!</p>
		</div>

		<div class="tierlist-builder">
			<div class="controls">
				<button @click="goBack" class="btn btn-outline back-button">← Back to Home</button>
				<input v-model="tierlistTitle" placeholder="Enter your tierlist title here..." class="title-input" />
				<div class="control-buttons">
					<div class="save-button-container">
						<button
							@click="saveTierlist"
							:disabled="!tierlistTitle.trim()"
							class="btn btn-primary"
							:class="{ 'btn-disabled': !tierlistTitle.trim() }"
						>
							💾 Save Tierlist
						</button>
						<div v-if="!tierlistTitle.trim()" class="tooltip">Enter a title to save your tierlist</div>
					</div>
					<div class="download-button-container">
						<button
							@click="downloadTierlist"
							class="btn btn-secondary"
							:disabled="!canDownload"
							:class="{ 'btn-disabled': !canDownload }"
							:title="canDownload ? 'Download as Image' : ''"
						>
							⬇️ Download Image
						</button>
						<div v-if="!canDownload" class="tooltip">
							{{
								!tierlistTitle.trim()
									? 'Enter a title and save to download'
									: 'Save the tierlist first to download'
							}}
						</div>
					</div>
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
								'drop-before': tier.dropPosition === itemIndex
							}"
							:style="item.image ? { backgroundImage: `url(${item.image})` } : {}"
							draggable="true"
							@dragstart="onDragStart($event, item, index, itemIndex)"
							@dragend="onDragEnd"
							:title="item.name"
						>
							<span v-if="item.type === 'course'" class="course-text">{{ item.name }}</span>
						</div>
						<!-- Drop indicator for end position -->
						<div v-if="tier.dropPosition === tier.items.length" class="drop-indicator"></div>
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
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
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
		const hasUnsavedChanges = ref(false)
		const showConfirmDialog = ref(false)
		const isComponentReady = ref(false)

		// Notification system
		const notification = reactive({
			show: false,
			message: '',
			type: 'success'
		})

		const showNotification = (message, type = 'success') => {
			notification.message = message
			notification.type = type
			notification.show = true

			// Auto-hide after 3 seconds
			setTimeout(() => {
				notification.show = false
			}, 3000)
		}

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

		// Watch for changes to track unsaved modifications
		watch(
			() => tierlistTitle.value,
			() => {
				if (isComponentReady.value) {
					hasUnsavedChanges.value = true
				}
			}
		)

		watch(
			() => tiers.map((tier) => ({ items: [...tier.items] })),
			() => {
				if (isComponentReady.value) {
					hasUnsavedChanges.value = true
				}
			},
			{ deep: true }
		)

		watch(
			() => [...poolItems],
			() => {
				if (isComponentReady.value) {
					hasUnsavedChanges.value = true
				}
			},
			{ deep: true }
		)

		// Prevent scrolling when modal is open
		watch(showConfirmDialog, (isOpen) => {
			if (isOpen) {
				document.body.style.overflow = 'hidden'
			} else {
				document.body.style.overflow = ''
			}
		})

		// Computed property for download button state
		const canDownload = computed(() => {
			return tierlistTitle.value.trim() && !hasUnsavedChanges.value
		})

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

			// Reset previous drop position
			tier.dropPosition = -1

			// Calculate drop position based on cursor position
			let dropPosition = tier.items.length // Default to end
			const items = event.currentTarget.querySelectorAll('.tier-item:not(.dragging)')

			for (let i = 0; i < items.length; i++) {
				const itemRect = items[i].getBoundingClientRect()
				const itemCenter = itemRect.left + itemRect.width / 2 - rect.left

				if (x < itemCenter) {
					dropPosition = i
					break
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

			// If the item is already in the pool, don't do anything
			if (draggedFromTier.value === 'pool') {
				draggedItem.value = null
				draggedFromTier.value = null
				return
			}

			// Remove item from tier
			if (typeof draggedFromTier.value === 'number') {
				const fromTier = tiers[draggedFromTier.value]
				const itemIndex = fromTier.items.findIndex((item) => item.id === draggedItem.value.id)
				if (itemIndex > -1) {
					fromTier.items.splice(itemIndex, 1)
				}
			}

			// Add back to pool only if it's not already there
			const existingIndex = poolItems.findIndex((item) => item.id === draggedItem.value.id)
			if (existingIndex === -1) {
				poolItems.push(draggedItem.value)
			}

			draggedItem.value = null
			draggedFromTier.value = null
		}

		const saveTierlist = async () => {
			if (!tierlistTitle.value.trim()) {
				showNotification('Please enter a title for your tierlist!', 'error')
				return
			}

			try {
				// Generate image data for storage
				const imageData = await generateTierlistImage()

				const tierlistData = {
					title: tierlistTitle.value,
					tiers: tiers.map((tier) => ({
						name: tier.name,
						color: tier.color,
						items: tier.items
					})),
					poolItems: poolItems,
					imageData: imageData // Store the generated image
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
						showNotification('Tierlist updated successfully! 🎉')
					}
				} else {
					// Create new tierlist
					savedLists.push({
						id: Date.now(),
						...tierlistData,
						createdAt: new Date().toISOString()
					})
					showNotification('Tierlist saved successfully! 🎉')
				}
				localStorage.setItem('tierlists', JSON.stringify(savedLists))

				// Reset unsaved changes flag
				hasUnsavedChanges.value = false

				// Clear editing data and reset to create mode
				localStorage.removeItem('editingTierlist')
				isEditing.value = false
				editingTierlistId.value = null
			} catch (error) {
				console.error('Error saving tierlist:', error)
				showNotification('Error saving tierlist. Please try again.', 'error')
			}
		}

		const generateTierlistImage = async () => {
			try {
				// Dynamic import of html2canvas
				const html2canvas = (await import('html2canvas')).default

				const element = document.getElementById('tierlist-export')
				if (!element) {
					throw new Error('Could not find tierlist to export')
				}

				// Configure html2canvas options with better compatibility
				const canvas = await html2canvas(element, {
					backgroundColor: '#242424',
					scale: 1.5,
					useCORS: true,
					allowTaint: false,
					foreignObjectRendering: false,
					logging: false,
					width: element.scrollWidth,
					height: element.scrollHeight,
					scrollX: 0,
					scrollY: 0
				})

				return canvas.toDataURL('image/png', 0.95)
			} catch (error) {
				console.error('Error generating image:', error)
				throw error
			}
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
			// Reset unsaved changes flag after loading
			hasUnsavedChanges.value = false

			// Set component as ready after a short delay to allow all initialization to complete
			setTimeout(() => {
				isComponentReady.value = true
			}, 100)
		})
		// Cleanup on component unmount
		onUnmounted(() => {
			document.body.style.overflow = ''
		})

		const goBack = () => {
			if (hasUnsavedChanges.value) {
				showConfirmDialog.value = true
			} else {
				confirmGoBack()
			}
		}

		const confirmGoBack = () => {
			// Clear any editing data and go back to home
			localStorage.removeItem('editingTierlist')
			router.push('/home')
		}

		const cancelGoBack = () => {
			showConfirmDialog.value = false
		}

		const downloadTierlist = async () => {
			if (!tierlistTitle.value.trim()) {
				showNotification('Please enter a title for your tierlist before downloading!', 'error')
				return
			}

			try {
				// Get the cached image data if it exists and we're editing a saved tierlist
				let imageData = null
				if (isEditing.value && editingTierlistId.value) {
					const savedLists = JSON.parse(localStorage.getItem('tierlists') || '[]')
					const currentTierlist = savedLists.find((list) => list.id === editingTierlistId.value)
					if (currentTierlist && currentTierlist.imageData) {
						imageData = currentTierlist.imageData
					}
				}

				// If no cached image, generate one (this covers new tierlists or edited tierlists that haven't been saved yet)
				if (!imageData) {
					imageData = await generateTierlistImage()
				}

				// Create download link
				const link = document.createElement('a')
				link.download = `${tierlistTitle.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_tierlist.png`
				link.href = imageData

				// Trigger download
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				showNotification('Tierlist image downloaded successfully! 📥')
			} catch (error) {
				console.error('Error generating image:', error)
				showNotification('Sorry, there was an error generating the image. Please try again.', 'error')
			}
		}
		return {
			tierlistTitle,
			tiers,
			poolItems,
			notification,
			showConfirmDialog,
			goBack,
			confirmGoBack,
			cancelGoBack,
			onDragStart,
			onDragEnd,
			onDragOver,
			onDrop,
			onDropToPool,
			saveTierlist,
			downloadTierlist,
			canDownload
		}
	}
}
</script>

<style scoped>
/* Notification Toast */
.notification-toast {
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 12px 24px;
	border-radius: var(--border-radius-md);
	color: white;
	font-weight: var(--font-weight-bold);
	z-index: 9999;
	animation: slideInFromTop 0.3s ease-out;
	min-width: 200px;
	text-align: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification-toast.success {
	background: linear-gradient(135deg, #10b981, #059669);
	border: 2px solid #047857;
}

.notification-toast.error {
	background: linear-gradient(135deg, #ef4444, #dc2626);
	border: 2px solid #b91c1c;
}

@keyframes slideInFromTop {
	from {
		opacity: 0;
		transform: translateX(-50%) translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}
}

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
	background: #1a1a1a;
	padding: 24px;
	border-radius: 12px;
	border: 2px solid #646cff;
	margin-bottom: 24px;
	font-family:
		'Inter',
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		sans-serif;
}

#tierlist-export .tierlist-title {
	text-align: center;
	margin-bottom: 24px;
	padding: 16px;
	background: #2a2a2a;
	border-radius: 12px;
	border: 2px solid #646cff;
}

#tierlist-export .tierlist-title h2 {
	color: #646cff;
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
}

#tierlist-export .tier-row {
	display: flex;
	align-items: stretch;
	margin-bottom: 2px;
	min-height: 80px;
}

#tierlist-export .tier-label {
	min-width: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	font-size: 1.2rem;
	color: white;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	border-radius: 8px;
}

#tierlist-export .tier-items {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 12px;
	background-color: #2a2a2a;
	min-height: 80px;
}

#tierlist-export .tier-item.course-item {
	background: linear-gradient(135deg, #646cff, #747bff) !important;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	width: auto !important;
	height: auto !important;
	min-width: 60px;
	min-height: 40px;
	padding: 8px 12px;
	margin: 4px;
	border: none;
}

#tierlist-export .course-text {
	color: white;
	font-weight: 700;
	font-size: 0.9rem;
	text-align: center;
	word-break: break-word;
	line-height: 1.2;
	white-space: nowrap;
}

/* Hide drag over states in export */
#tierlist-export .drag-over {
	background: #2a2a2a !important;
}

/* Hide drag feedback elements in export */
#tierlist-export .drop-indicator,
#tierlist-export .drag-before,
#tierlist-export .drag-after {
	display: none !important;
}

/* Drag and drop visual feedback */
.tier-item.dragging {
	opacity: 0.5;
	transform: scale(0.95);
}

.tier-item.drop-before {
	border-left: 3px solid var(--primary-color);
	margin-left: 3px;
}

.drop-indicator {
	width: 3px;
	height: 60px;
	background: var(--primary-color);
	border-radius: 2px;
	margin: 0 3px;
	flex-shrink: 0;
}

.tier-items.drag-over {
	background: rgba(108, 117, 125, 0.1);
	border-radius: 8px;
}

/* Save button container for tooltip positioning */
.save-button-container {
	position: relative;
	display: inline-block;
}

.save-button-container .tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: var(--surface-color);
	color: var(--text-color);
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 0.85rem;
	white-space: nowrap;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-color);
	margin-bottom: 5px;
	z-index: 10;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.2s ease-out,
		visibility 0.2s ease-out;
}

/* Show tooltip on hover when button is disabled */
.save-button-container:hover .tooltip {
	opacity: 1;
	visibility: visible;
}

.save-button-container .tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	border: 5px solid transparent;
	border-top-color: var(--surface-color);
}

/* Download button container for tooltip positioning */
.download-button-container {
	position: relative;
	display: inline-block;
}

.download-button-container .tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	background: var(--surface-color);
	color: var(--text-color);
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 0.85rem;
	white-space: nowrap;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-color);
	margin-bottom: 5px;
	z-index: 10;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.2s ease-out,
		visibility 0.2s ease-out;
}

/* Show tooltip on hover when button is disabled */
.download-button-container:hover .tooltip {
	opacity: 1;
	visibility: visible;
}

.download-button-container .tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	border: 5px solid transparent;
	border-top-color: var(--surface-color);
}

/* Modal Dialog Styles */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
	background: var(--surface-color);
	border-radius: 12px;
	padding: 0;
	max-width: 450px;
	width: 90%;
	box-shadow:
		0 20px 60px rgba(0, 0, 0, 0.5),
		0 0 0 1px rgba(255, 255, 255, 0.1);
	border: 1px solid var(--border-color);
	animation: slideUp 0.3s ease-out;
	backdrop-filter: blur(10px);
}

.modal-content {
	padding: 32px;
}

.modal-content h3 {
	margin: 0 0 16px 0;
	color: var(--primary-color);
	font-size: 1.5rem;
	font-weight: 600;
	text-align: center;
}

.modal-content p {
	margin: 0 0 32px 0;
	color: var(--text-color);
	line-height: 1.6;
	text-align: center;
	font-size: 1rem;
}

.modal-actions {
	display: flex;
	gap: 16px;
	justify-content: center;
}

.modal-actions .btn {
	min-width: 120px;
	padding: 12px 24px;
	font-weight: 500;
}

.modal-actions .btn {
	min-width: 80px;
}

@keyframes slideUp {
	from {
		transform: translateY(20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
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
