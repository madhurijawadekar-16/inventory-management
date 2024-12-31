import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ListProductPage from './pages/Home'
import AddProductPage from './pages/Addproduct'
import UpdateProductPage from './pages/UpdateProduct'
import ProductDetailPage from './pages/ProductDetails'

const App: React.FC = () => {
	return (
		<div>
			<Routes>
				<Route path='/' element={<ListProductPage />} />
				<Route path='/product/:id' element={<ProductDetailPage />} />
				<Route path='/add-product' element={<AddProductPage />} />
				<Route path='/update-product/:id' element={<UpdateProductPage />} />
			</Routes>
		</div>
	)
}

export default App
