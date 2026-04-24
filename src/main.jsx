import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n.js' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// npm install -g vercel
// vercel --prod
// git status                 # اتأكد إيه اللي اتغيّر
// git add -A                 # ضيف كل التعديلات
// git commit -m "feat: search + welcome video + fixes"
// git push origin main       # ادفَع على main
