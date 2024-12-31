import React from 'react'
import {
	TextField,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Paper,
	Divider,
	Stack,
	Box,
	Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { Material, Product } from '../features/slice'
interface ProductFormProps {
	product: Omit<Product, 'id' | 'totalCost'>
	setProduct: React.Dispatch<
		React.SetStateAction<Omit<Product, 'id' | 'totalCost'>>
	>
	materialRows: Material[]
	setMaterialRows: React.Dispatch<React.SetStateAction<Material[]>>
	onSubmit: () => void
	units: string[]
	handleMaterialChange: (index: number, field: string, value: any) => void
	handleAddMaterialRow: () => void
}

const categoryOptions = ['Finished', 'Semi finished', 'Subsidiary'] //

const ProductForm: React.FC<ProductFormProps> = ({
	product,
	setProduct,
	materialRows,
	setMaterialRows,
	onSubmit,
	units,
	handleMaterialChange,
	handleAddMaterialRow,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const handleFormSubmit = (data: any) => {
		onSubmit() // Call the onSubmit passed from the parent component
	}

	return (
		<>
			<h2>Add Product</h2>
			<Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<div style={{ display: 'grid', gap: '16px' }}>
						{/* Product Name */}
						<TextField
							required
							label='Product Name'
							variant='outlined'
							fullWidth
							{...register('name', { required: 'Product Name is required' })}
							error={!!errors.name}
							value={product.name}
							onChange={(e) => setProduct({ ...product, name: e.target.value })}
						/>

						{/* Unit Selector */}
						<FormControl fullWidth variant='outlined' error={!!errors.unit}>
							<InputLabel>Unit</InputLabel>
							<Select
								required
								{...register('unit', { required: 'Unit is required' })}
								value={product.unit}
								onChange={(e) =>
									setProduct({ ...product, unit: e.target.value })
								}
								label='Unit'
							>
								<MenuItem value=''>Select Unit</MenuItem>
								{units.map((unit, index) => (
									<MenuItem key={index} value={unit}>
										{unit}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Category Selector */}
						<FormControl fullWidth variant='outlined' error={!!errors.category}>
							<InputLabel>Category</InputLabel>
							<Select
								required
								{...register('category', { required: 'Category is required' })}
								value={product.category}
								onChange={(e) =>
									setProduct({ ...product, category: e.target.value })
								}
								label='Category'
							>
								{categoryOptions.map((category, index) => (
									<MenuItem key={index} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Expiry Date */}
						<TextField
							label='Expiry Date'
							variant='outlined'
							type='date'
							required
							fullWidth
							{...register('expiry', { required: 'Expiry Date is required' })}
							error={!!errors.expiry}
							value={product.expiry}
							onChange={(e) =>
								setProduct({ ...product, expiry: e.target.value })
							}
							InputLabelProps={{
								shrink: true,
							}}
							InputProps={{
								inputProps: {
									min: new Date().toISOString().split('T')[0],
								},
							}}
						/>
					</div>

					<Divider sx={{ marginY: 3 }} />

					{/* Raw Material Section */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<h3>Add Raw Material</h3>
						<Button
							variant='contained'
							color='secondary'
							onClick={handleAddMaterialRow}
						>
							Add Material
						</Button>
					</div>

					{materialRows.map((material, index) => (
						<>
							<div
								key={material.id}
								style={{ display: 'grid', gap: '16px', marginTop: '16px' }}
							>
								<TextField
									required
									label='Material Name'
									variant='outlined'
									fullWidth
									value={material.name}
									onChange={(e) =>
										handleMaterialChange(index, 'name', e.target.value)
									}
								/>

								<FormControl fullWidth variant='outlined'>
									<InputLabel>Unit</InputLabel>
									<Select
										required
										value={material.unit}
										onChange={(e) =>
											handleMaterialChange(index, 'unit', e.target.value)
										}
										label='Unit'
									>
										<MenuItem value=''>Select Unit</MenuItem>
										{units.map((unit, idx) => (
											<MenuItem key={idx} value={unit}>
												{unit}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<TextField
									required
									label='Quantity'
									variant='outlined'
									fullWidth
									type='number'
									value={material.quantity}
									onChange={(e) =>
										handleMaterialChange(
											index,
											'quantity',
											parseFloat(e.target.value)
										)
									}
								/>

								<TextField
									required
									label='Price'
									variant='outlined'
									fullWidth
									type='number'
									value={material.price}
									onChange={(e) =>
										handleMaterialChange(
											index,
											'price',
											parseFloat(e.target.value)
										)
									}
								/>
							</div>
							<Box
								sx={{
									gridColumn: 'span 2',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<Typography variant='body1'>
									Total Price: {material.totalPrice} | Tax: {material.tax} |
									Total Amount: {material.totalAmount}
								</Typography>
							</Box>
						</>
					))}

					{/* Buttons Section */}
					<Stack
						direction='row'
						spacing={2}
						sx={{ marginTop: 3 }}
						justifyContent='center'
					>
						<Button
							variant='contained'
							color='primary'
							type='submit'
							sx={{ width: '50%' }}
						>
							Save Product
						</Button>
					</Stack>
				</form>
			</Paper>
		</>
	)
}

export default ProductForm
