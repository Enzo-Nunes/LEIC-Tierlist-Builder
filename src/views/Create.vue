<template>
	<div class="create-page">
		<div class="create-header">
			<h1>Create Your Tierlist 🎯</h1>
			<p>Drag and drop items to rank them in different tiers!</p>
		</div>

		<div class="tierlist-builder">
			<div class="controls">
				<input v-model="tierlistTitle" placeholder="Enter tierlist title..." class="title-input" />
				<div class="control-buttons">
					<button @click="addCustomTier" class="btn btn-secondary">➕ Add Tier</button>
					<button @click="saveTierlist" class="btn btn-primary">💾 Save Tierlist</button>
					<button @click="shareUrl" class="btn btn-secondary">🔗 Share</button>
				</div>
			</div>

			<div class="tierlist-container">
				<div v-for="(tier, index) in tiers" :key="tier.id" class="tier-row">
					<div
						class="tier-label"
						:style="{ backgroundColor: tier.color }"
						contenteditable
						@blur="updateTierLabel(index, $event)"
					>
						{{ tier.name }}
					</div>
					<div
						class="tier-items"
						@drop="onDrop($event, index)"
						@dragover.prevent
						@dragenter.prevent
						:class="{ 'drag-over': tier.dragOver }"
						@dragenter="tier.dragOver = true"
						@dragleave="tier.dragOver = false"
					>
						<div
							v-for="item in tier.items"
							:key="item.id"
							class="tier-item"
							:style="{ backgroundImage: `url(${item.image})` }"
							draggable="true"
							@dragstart="onDragStart($event, item)"
							@dragend="onDragEnd"
							:title="item.name"
						></div>
					</div>
					<button v-if="tiers.length > 1" @click="removeTier(index)" class="remove-tier-btn">❌</button>
				</div>
			</div>

			<div class="item-pool">
				<h3>Item Pool</h3>
				<div class="pool-controls">
					<input
						type="file"
						@change="handleImageUpload"
						accept="image/*"
						multiple
						class="file-input"
						ref="fileInput"
					/>
					<button @click="$refs.fileInput.click()" class="btn btn-secondary">📁 Upload Images</button>
					<input
						v-model="newItemName"
						placeholder="Item name..."
						@keyup.enter="addTextItem"
						class="item-name-input"
					/>
					<button @click="addTextItem" class="btn btn-secondary">➕ Add Text Item</button>
				</div>

				<div class="pool-items" @drop="onDropToPool($event)" @dragover.prevent @dragenter.prevent>
					<div
						v-for="item in poolItems"
						:key="item.id"
						class="tier-item"
						:style="item.image ? { backgroundImage: `url(${item.image})` } : {}"
						:class="{ 'text-item': !item.image }"
						draggable="true"
						@dragstart="onDragStart($event, item)"
						@dragend="onDragEnd"
						:title="item.name"
					>
						<span v-if="!item.image" class="text-content">{{ item.name }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
	name: 'Create',
	setup() {
		const tierlistTitle = ref('My Awesome Tierlist')
		const newItemName = ref('')
		const draggedItem = ref(null)
		const draggedFromTier = ref(null)

		const defaultTiers = [
			{ id: 1, name: 'S', color: '#ff4444', items: [], dragOver: false },
			{ id: 2, name: 'A', color: '#ff8844', items: [], dragOver: false },
			{ id: 3, name: 'B', color: '#ffaa44', items: [], dragOver: false },
			{ id: 4, name: 'C', color: '#ffdd44', items: [], dragOver: false },
			{ id: 5, name: 'D', color: '#88ff44', items: [], dragOver: false }
		]

		const tiers = reactive([...defaultTiers])
		const poolItems = reactive([])

		let nextItemId = 1
		let nextTierId = 6

		const generateItemId = () => nextItemId++
		const generateTierId = () => nextTierId++

		const handleImageUpload = (event) => {
			const files = Array.from(event.target.files)
			files.forEach((file) => {
				const reader = new FileReader()
				reader.onload = (e) => {
					poolItems.push({
						id: generateItemId(),
						name: file.name.split('.')[0],
						image: e.target.result,
						type: 'image'
					})
				}
				reader.readAsDataURL(file)
			})
		}

		const addTextItem = () => {
			if (newItemName.value.trim()) {
				poolItems.push({
					id: generateItemId(),
					name: newItemName.value.trim(),
					image: null,
					type: 'text'
				})
				newItemName.value = ''
			}
		}

		const onDragStart = (event, item) => {
			draggedItem.value = item
			// Find which tier the item is currently in
			draggedFromTier.value = tiers.findIndex((tier) => tier.items.some((tierItem) => tierItem.id === item.id))
			if (draggedFromTier.value === -1) {
				draggedFromTier.value = 'pool'
			}
			event.target.classList.add('dragging')
		}

		const onDragEnd = (event) => {
			event.target.classList.remove('dragging')
			// Reset drag over states
			tiers.forEach((tier) => (tier.dragOver = false))
		}

		const onDrop = (event, tierIndex) => {
			event.preventDefault()
			if (!draggedItem.value) return

			const targetTier = tiers[tierIndex]
			targetTier.dragOver = false

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

			// Add item to target tier
			targetTier.items.push(draggedItem.value)
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

		const addCustomTier = () => {
			const colors = ['#44ff88', '#4488ff', '#8844ff', '#ff44aa', '#aa44ff']
			const randomColor = colors[Math.floor(Math.random() * colors.length)]

			tiers.push({
				id: generateTierId(),
				name: 'New Tier',
				color: randomColor,
				items: [],
				dragOver: false
			})
		}

		const removeTier = (index) => {
			// Move items back to pool
			const tier = tiers[index]
			poolItems.push(...tier.items)
			tiers.splice(index, 1)
		}

		const updateTierLabel = (index, event) => {
			tiers[index].name = event.target.textContent
		}

		const saveTierlist = () => {
			const tierlistData = {
				title: tierlistTitle.value,
				tiers: tiers.map((tier) => ({
					name: tier.name,
					color: tier.color,
					items: tier.items
				})),
				poolItems: poolItems
			}

			// For now, save to localStorage
			const savedLists = JSON.parse(localStorage.getItem('tierlists') || '[]')
			savedLists.push({
				id: Date.now(),
				...tierlistData,
				createdAt: new Date().toISOString()
			})
			localStorage.setItem('tierlists', JSON.stringify(savedLists))

			alert('Tierlist saved successfully! 🎉')
		}

		const shareUrl = () => {
			// In a real app, you'd generate a shareable URL
			const url = window.location.href
			navigator.clipboard.writeText(url).then(() => {
				alert('URL copied to clipboard! 📋')
			})
		}

		return {
			tierlistTitle,
			newItemName,
			tiers,
			poolItems,
			handleImageUpload,
			addTextItem,
			onDragStart,
			onDragEnd,
			onDrop,
			onDropToPool,
			addCustomTier,
			removeTier,
			updateTierLabel,
			saveTierlist,
			shareUrl
		}
	}
}
</script>

<style scoped>
/* All styles moved to src/styles/pages/create.css */
</style>
