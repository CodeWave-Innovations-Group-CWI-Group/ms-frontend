import './App.css'
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App