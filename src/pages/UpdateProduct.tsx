import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateProduct } from '../features/slice'
import { useNavigate, useParams } from 'react-router-dom'
import { Material, Product } from '../features/slice'
import ProductForm from '../components/ProductForm'

const UpdateProductPage: React.FC = () => {
	const { id } = useParams<{ id?: string }>()
	const [product, setProduct] = useState<Omit<Product, 'id' | 'totalCost'>>({
		name: '',
		unit: '',
		category: '',
		expiry: '',
		materials: [],
	})

	const [materialRows, setMaterialRows] = useState<Material[]>([])

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const units = ['ml', 'ltr', 'gm', 'kg', 'mtr', 'mm', 'box']

	useEffect(() => {
		if (!id) {
			navigate('/') // If the id is not provided, navigate to another page (optional)
			return // Exit early if id is undefined
		}

		// Fetch the product and materials from local storage or an API
		const existingProducts = localStorage.getItem('products')
		if (existingProducts) {
			const products = JSON.parse(existingProducts)
			const productToEdit = products.find(
				(prod: Product) => prod.id === parseInt(id)
			)
			if (productToEdit) {
				setProduct({
					name: productToEdit.name,
					unit: productToEdit.unit,
					category: productToEdit.category,
					expiry: productToEdit.expiry,
					materials: productToEdit.materials,
				})
				setMaterialRows(productToEdit.materials)
			}
		}
	}, [id, navigate])

	const handleMaterialChange = (index: number, field: string, value: any) => {
		const updatedRows = [...materialRows]
		updatedRows[index] = {
			...updatedRows[index],
			[field]: value,
		}

		updatedRows[index].totalPrice =
			updatedRows[index].quantity * updatedRows[index].price
		updatedRows[index].tax = updatedRows[index].totalPrice * 0.1
		updatedRows[index].totalAmount =
			updatedRows[index].totalPrice + updatedRows[index].tax

		setMaterialRows(updatedRows)
	}

	const handleAddMaterialRow = () => {
		setMaterialRows([
			...materialRows,
			{
				id: Date.now(),
				name: '',
				unit: '',
				quantity: 0,
				price: 0,
				totalPrice: 0,
				tax: 0,
				totalAmount: 0,
			},
		])
	}

	const handleSubmit = () => {
		const totalCost = materialRows.reduce(
			(sum: number, mat: { totalAmount: number }) => sum + mat.totalAmount,
			0
		)

		if (!id) return '' // Ensure we don't update the product without a valid id

		const updatedProduct: Product = {
			...product,
			totalCost,
			materials: materialRows,
			id: parseInt(id), // Ensure the id is set for the updated product
		}

		// Update the product in local storage
		const existingProducts = localStorage.getItem('products')
		if (existingProducts) {
			const products: Product[] = JSON.parse(existingProducts)
			const productIndex = products.findIndex(
				(prod: Product) => prod.id === parseInt(id)
			)
			if (productIndex > -1) {
				products[productIndex] = updatedProduct
				localStorage.setItem('products', JSON.stringify(products))
			}
		}

		// Dispatch the update action with the expected payload structure
		dispatch(updateProduct({ id: updatedProduct.id, product: updatedProduct }))
		navigate('/') // Navigate back to the product list page
	}

	return (
		<div style={{ padding: '20px' }}>
			<h2>Update Product</h2>
			<ProductForm
				product={product}
				setProduct={setProduct}
				materialRows={materialRows}
				setMaterialRows={setMaterialRows}
				onSubmit={handleSubmit}
				units={units}
				handleMaterialChange={handleMaterialChange}
				handleAddMaterialRow={handleAddMaterialRow}
			/>
		</div>
	)
}

export default UpdateProductPage
