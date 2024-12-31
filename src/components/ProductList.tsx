import React, { useEffect, useState } from 'react'
import {
	Button,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
} from '@mui/material'
import { Product } from '../features/slice'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'

const ProductListPage: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([])
	const navigate = useNavigate()

	// Load products from localStorage on component mount
	useEffect(() => {
		const savedProducts = localStorage.getItem('products')
		if (savedProducts) {
			setProducts(JSON.parse(savedProducts))
		}
		console.log(products, 'products')
	}, [])

	// Handle navigating to the Add Product page
	const handleAddProduct = () => {
		navigate('/add-product')
	}

	// Navigate to the individual product details page
	const handleProductClick = (id: number) => {
		navigate(`/product/${id}`)
	}

	// Navigate to the edit product page
	const handleEditProduct = (id: number) => {
		navigate(`/update-product/${id}`)
	}

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant='h4' gutterBottom>
				Product List
			</Typography>

			<Button
				variant='contained'
				color='primary'
				onClick={handleAddProduct}
				style={{ marginBottom: '20px' }}
			>
				Add New Product
			</Button>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<strong>Name</strong>
							</TableCell>
							<TableCell>
								<strong>Category</strong>
							</TableCell>
							<TableCell>
								<strong>Unit</strong>
							</TableCell>
							<TableCell>
								<strong>Expiry Date</strong>
							</TableCell>
							<TableCell>
								<strong>Total Cost</strong>
							</TableCell>
							<TableCell>
								<strong>Raw Materials</strong>
							</TableCell>
							<TableCell>
								<strong>Actions</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.length > 0 ? (
							products.map((product: Product) => (
								<TableRow key={product.id} style={{ cursor: 'pointer' }}>
									<TableCell>{product.name}</TableCell>
									<TableCell>{product.category}</TableCell>
									<TableCell>{product.unit}</TableCell>
									<TableCell>{product.expiry}</TableCell>
									<TableCell>Rs {product.totalCost.toFixed(2)}</TableCell>
									<TableCell>
										{/* Displaying raw materials */}
										{product.materials && product.materials.length > 0 ? (
											product.materials.map((material, index) => (
												<Typography key={index}>
													{material.name} - {material.quantity} units
												</Typography>
											))
										) : (
											<Typography>No materials available</Typography>
										)}
									</TableCell>
									<TableCell>
										{/* View and Edit buttons */}
										<IconButton
											onClick={() => handleProductClick(product.id)}
											title='View Product'
										>
											<VisibilityIcon />
										</IconButton>
										<IconButton
											onClick={() => handleEditProduct(product.id)}
											title='Edit Product'
										>
											<EditIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align='center'>
									<Typography>No products found.</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default ProductListPage
