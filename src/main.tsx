import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/inter'
import './index.css'
import App from './App'
import { queryClient } from './lib/queryClient'
import { VentaProvider } from './store/venta'
import { SesionProvider } from './store/sesion'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SesionProvider>
        <VentaProvider>
          <App />
        </VentaProvider>
      </SesionProvider>
    </QueryClientProvider>
  </StrictMode>,
)
