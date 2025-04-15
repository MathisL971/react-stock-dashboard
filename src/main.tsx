import { scan } from 'react-scan';
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from './components/MainLayout.tsx';
import StockSearchPage from './components/StockSearchPage.tsx';

scan({
  enabled: true
})

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<StockSearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>      
    </QueryClientProvider>
)
