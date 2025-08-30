import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FinanceDashboard from './pages/dashboard';
import TransactionsPage from './pages/transactions';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<FinanceDashboard />} />
				<Route path="/dashboard" element={<FinanceDashboard />} />
				<Route path="/transactions" element={<TransactionsPage />} />
			</Routes>
		</Router>
	)
}

export default App
