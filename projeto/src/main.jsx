import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FormularioPage from '../pages/formulario/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormularioPage />
  </StrictMode>,
)
