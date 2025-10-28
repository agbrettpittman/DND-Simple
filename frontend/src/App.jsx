import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CampaignPage from './pages/CampaignPage.jsx'

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/campaigns/:id" element={<CampaignPage />} />
            </Route>
        </Routes>
    )
}

export default App
