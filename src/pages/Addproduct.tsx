import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct } from '../features/slice'
import { useNavigate } from 'react-router-dom'
import { Material, Product } from '../features/slice'
import ProductForm from '../components/ProductForm'

const AddProductPage: React.FC = () => {
	const [product, setProduct] = useState<Omit<Product, 'id' | 'totalCost'>>({
		name: '',
		unit: '',
		category: '',
		expiry: '',
		materials: [],
	})

	const [materialRows, setMaterialRows] = useState<Material[]>([
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

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const units = ['ml', 'ltr', 'gm', 'kg', 'mtr', 'mm', 'box']

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
			(sum: any, mat: { totalAmount: any }) => sum + mat.totalAmount,
			0
		)

		const newProduct = {
			...product,
			id: Date.now(),
			totalCost,
			materials: materialRows,
		}

		const existingProducts = localStorage.getItem('products')
		const updatedProducts = existingProducts
			? [...JSON.parse(existingProducts), newProduct]
			: [newProduct]

		localStorage.setItem('products', JSON.stringify(updatedProducts))

		dispatch(addProduct(newProduct))
		navigate('/')
	}

	return (
		<div style={{ padding: '20px' }}>
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

export default AddProductPage
