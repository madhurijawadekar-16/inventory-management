import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Material {
	id: number
	name: string
	unit: string
	quantity: number
	price: number
	totalPrice: number
	tax: number
	totalAmount: number
}

export interface Product {
	id: number
	name: string
	unit: string
	category: string
	expiry: any
	totalCost: number
	materials: Material[]
}

interface ProductsState {
	products: Product[]
}

const initialState: ProductsState = {
	products: [],
}

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		addProduct(state, action: PayloadAction<Product>) {
			state.products.push(action.payload)
		},
		updateProduct(
			state,
			action: PayloadAction<{ id: number; product: Product }>
		) {
			const { id, product } = action.payload
			const index = state.products.findIndex((p) => p.id === id)
			if (index !== -1) {
				// Update the entire product, including materials and cost
				state.products[index] = { ...state.products[index], ...product }
			}
		},
		addMaterialToProduct(
			state,
			action: PayloadAction<{ productId: number; material: Material }>
		) {
			const { productId, material } = action.payload
			const product = state.products.find((p) => p.id === productId)
			if (product) {
				product.materials.push(material)
				product.totalCost += material.totalAmount
			}
		},
		updateMaterialInProduct(
			state,
			action: PayloadAction<{
				productId: number
				materialId: number
				material: Partial<Material>
			}>
		) {
			const { productId, materialId, material } = action.payload
			const product = state.products.find((p) => p.id === productId)
			if (product) {
				const materialIndex = product.materials.findIndex(
					(m) => m.id === materialId
				)
				if (materialIndex !== -1) {
					product.materials[materialIndex] = {
						...product.materials[materialIndex],
						...material,
					}
					product.totalCost = product.materials.reduce(
						(sum, m) => sum + m.totalAmount,
						0
					)
				}
			}
		},
		removeMaterialFromProduct(
			state,
			action: PayloadAction<{ productId: number; materialId: number }>
		) {
			const { productId, materialId } = action.payload
			const product = state.products.find((p) => p.id === productId)
			if (product) {
				const materialIndex = product.materials.findIndex(
					(m) => m.id === materialId
				)
				if (materialIndex !== -1) {
					const material = product.materials.splice(materialIndex, 1)[0]
					product.totalCost -= material.totalAmount
				}
			}
		},
	},
})

export const {
	addProduct,
	updateProduct,
	addMaterialToProduct,
	updateMaterialInProduct,
	removeMaterialFromProduct,
} = productsSlice.actions
export default productsSlice.reducer
