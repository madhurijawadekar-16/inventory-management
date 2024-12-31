import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../features/store'
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
} from '@mui/material'
import ProductListPage from '../components/ProductList'

const HomePage = () => {
	const products = useSelector((state: RootState) => state.products.products)

	return <ProductListPage />
}

export default HomePage
