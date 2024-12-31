import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { store } from './features/store' // Import the Redux store

// Make sure the root element exists
const rootElement = document.getElementById('root')

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>
	)
}
