import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  return (
  <>
    <div>
      <Router>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<>
        <ProtectedRoute><Header/><Home/><Footer/></ProtectedRoute></>}/>
      </Routes>
      </Router>
    </div>
    </>
  )
}
export default App