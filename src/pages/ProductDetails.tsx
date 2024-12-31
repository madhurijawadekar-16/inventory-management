import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	Typography,
	Paper,
	List,
	ListItem,
	ListItemText,
	Divider,
	Box,
	Card,
	CardContent,
} from '@mui/material'
import { Product } from '../features/slice'

const ProductDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)

	useEffect(() => {
		// Fetch product details from localStorage by id
		const savedProducts = localStorage.getItem('products')
		if (savedProducts) {
			const products: Product[] = JSON.parse(savedProducts)
			const foundProduct = products.find(
				(product) => product.id === parseInt(id!)
			)
			setProduct(foundProduct || null)
		}
	}, [id])

	if (!product) {
		return (
			<Paper style={{ padding: '20px', marginTop: '20px' }}>
				<Typography variant='h5' gutterBottom>
					Product not found
				</Typography>
			</Paper>
		)
	}

	return (
		<Box sx={{ padding: '20px', marginTop: '20px' }}>
			{/* Product Name and Details */}
			<Typography variant='h5' component='h1' gutterBottom>
				{product.name}
			</Typography>

			<Card sx={{ marginBottom: '20px' }}>
				<CardContent>
					{/* Product Basic Details */}
					<Typography variant='body1' color='textSecondary' gutterBottom>
						<strong>Product Name:</strong> {product.name}
					</Typography>
					<Typography variant='body1' color='textSecondary' gutterBottom>
						<strong>Category:</strong> {product.category}
					</Typography>
					<Typography variant='body1' color='textSecondary' gutterBottom>
						<strong>Unit:</strong> {product.unit}
					</Typography>
					<Typography variant='body1' color='textSecondary' gutterBottom>
						<strong>Expiry Date:</strong> {product.expiry}
					</Typography>
					<Typography variant='body1' color='textSecondary' gutterBottom>
						<strong>Total Cost:</strong> ${product.totalCost.toFixed(2)}
					</Typography>

					{/* Raw Materials List */}
					<Typography variant='body1' gutterBottom>
						<strong>Raw Materials:</strong>
					</Typography>
					<List>
						{product.materials && product.materials.length > 0 ? (
							product.materials.map((material: any, index) => (
								<div key={index}>
									<ListItem>
										<ListItemText
											primary={`${material.name} - ${material.quantity} units`}
											secondary={
												<>
													<Typography variant='body2' color='textSecondary'>
														<strong>Unit:</strong> {material.unit}
													</Typography>
													<Typography variant='body2' color='textSecondary'>
														<strong>Cost per Unit:</strong>Rs.
														{material.price?.toFixed(2) || 'N/A'}
													</Typography>
													<Typography variant='body2' color='textSecondary'>
														<strong>Quantity:</strong>
														{material.quantity?.toFixed(2) || 'N/A'}
													</Typography>
													<Typography variant='body2' color='textSecondary'>
														<strong>Tax Amount:</strong>
														{material.tax?.toFixed(2) || 'N/A'}
													</Typography>
												</>
											}
										/>
									</ListItem>
									{index !== product.materials.length - 1 && <Divider />}
								</div>
							))
						) : (
							<Typography variant='body1' color='textSecondary'>
								No raw materials available for this product
							</Typography>
						)}
					</List>
				</CardContent>
			</Card>
		</Box>
	)
}

export default ProductDetailPage
