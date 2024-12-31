import React, { useEffect } from 'react'
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
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
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
	handleRemoveMaterialRow: (index: number) => void // New prop for removing material row
}

const categoryOptions = ['Finished', 'Semi finished', 'Subsidiary']

// Yup validation schema
const validationSchema = Yup.object().shape({
	name: Yup.string().required('Product Name is required'),
	unit: Yup.string().required('Unit is required'),
	category: Yup.string().required('Category is required'),
	expiry: Yup.date()
		.required('Expiry Date is required')
		.min(new Date(), 'Expiry date must be in the future'),
	materialRows: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().required('Material Name is required'),
			unit: Yup.string().required('Material Unit is required'),
			quantity: Yup.number()
				.required('Quantity is required')
				.positive('Quantity must be positive'),
			price: Yup.number()
				.required('Price is required')
				.positive('Price must be positive'),
		})
	),
})

const ProductForm: React.FC<ProductFormProps | any> = ({
	product,
	setProduct,
	materialRows,
	setMaterialRows,
	onSubmit,
	units,
	handleMaterialChange,
	handleAddMaterialRow,
	handleRemoveMaterialRow, // Destructure the new prop
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		resolver: yupResolver(validationSchema), // Apply Yup validation
	})

	useEffect(() => {
		getValues('name')
		getValues('unit')
		getValues('category')
		getValues('expiry')

		materialRows.forEach((material: any, index: number) => {
			getValues(`materialRows.${index}.name`)
			getValues(`materialRows.${index}.unit`)
			getValues(`materialRows.${index}.quantity`)
			getValues(`materialRows.${index}.price`)
		})
	}, [getValues])
	useEffect(() => {
		setValue('name', product.name)
		setValue('unit', product.unit)
		setValue('category', product.category)
		setValue('expiry', product.expiry)

		materialRows.forEach((material: any, index: number) => {
			setValue(`materialRows.${index}.name`, material.name)
			setValue(`materialRows.${index}.unit`, material.unit)
			setValue(`materialRows.${index}.quantity`, material.quantity)
			setValue(`materialRows.${index}.price`, material.price)
		})
	}, [product, materialRows, setValue])

	const handleFormSubmit = (data: any) => {
		onSubmit() // Call the onSubmit passed from the parent component
	}

	return (
		<Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div style={{ display: 'grid', gap: '16px' }}>
					{/* Product Name */}
					<TextField
						label='Product Name'
						variant='outlined'
						fullWidth
						value={product.name}
						{...register('name')}
						error={!!errors.name}
						helperText={errors.name?.message}
						onChange={(e) => setProduct({ ...product, name: e.target.value })}
					/>

					{/* Unit Selector */}
					<FormControl fullWidth variant='outlined' error={!!errors.unit}>
						<InputLabel>Unit</InputLabel>
						<Select
							required
							value={product.unit}
							{...register('unit')}
							onChange={(e) => setProduct({ ...product, unit: e.target.value })}
							label='Unit'
						>
							{units.map((unit: string, index: number) => (
								<MenuItem key={index} value={unit}>
									{unit}
								</MenuItem>
							))}
						</Select>
						{errors.unit && (
							<Typography color='error'>{errors.unit?.message}</Typography>
						)}
					</FormControl>

					{/* Category Selector */}
					<FormControl fullWidth variant='outlined' error={!!errors.category}>
						<InputLabel>Category</InputLabel>
						<Select
							required
							value={product.category}
							{...register('category')}
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
						{errors.category && (
							<Typography color='error'>{errors.category?.message}</Typography>
						)}
					</FormControl>

					{/* Expiry Date */}
					<TextField
						label='Expiry Date'
						variant='outlined'
						type='date'
						required
						value={product.expiry}
						fullWidth
						{...register('expiry')}
						error={!!errors.expiry}
						helperText={errors.expiry?.message}
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							inputProps: {
								min: new Date().toISOString().split('T')[0],
							},
						}}
						onChange={(e) => setProduct({ ...product, expiry: e.target.value })}
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

				{materialRows.map((material: any, index: number) => (
					<React.Fragment key={material.id}>
						<div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
							<TextField
								value={material.name}
								required
								label='Material Name'
								variant='outlined'
								fullWidth
								onChange={(e) =>
									handleMaterialChange(index, 'name', e.target.value)
								}
								error={!!errors.materialRows?.[index]?.name}
								helperText={errors.materialRows?.[index]?.name?.message}
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
									{units.map((unit: string, idx: number) => (
										<MenuItem key={idx} value={unit}>
											{unit}
										</MenuItem>
									))}
								</Select>
								{errors.materialRows?.[index]?.unit && (
									<Typography color='error'>
										{errors.materialRows?.[index]?.unit?.message}
									</Typography>
								)}
							</FormControl>

							<TextField
								required
								label='Quantity'
								variant='outlined'
								fullWidth
								value={material.quantity}
								type='number'
								onChange={(e) =>
									handleMaterialChange(
										index,
										'quantity',
										parseFloat(e.target.value)
									)
								}
								error={!!errors.materialRows?.[index]?.quantity}
								helperText={errors.materialRows?.[index]?.quantity?.message}
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
								error={!!errors.materialRows?.[index]?.price}
								helperText={errors.materialRows?.[index]?.price?.message}
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
								Total Price: {material.totalPrice} | Tax: {material.tax} | Total
								Amount: {material.totalAmount}
							</Typography>
							{materialRows?.length > 1 && index > 0 && (
								<Button
									variant='outlined'
									color='error'
									onClick={() => handleRemoveMaterialRow(index)}
								>
									Remove
								</Button>
							)}
						</Box>
					</React.Fragment>
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
	)
}

export default ProductForm
