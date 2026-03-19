import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import AuthProvider from './Context/AuthContext.jsx'
import './styles/variables.css'
import './styles/components.css'
import './styles/layout.css'
import './styles/reader.css'
import './styles/global.css'
import './styles/ebook-card.css'
import './styles/ebook-detail.css'
import './styles/forms.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
