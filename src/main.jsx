import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import OnBoarding from './OnBoarding/onboarding.jsx'
import PointingGame from './PointingGame.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<OnBoarding></OnBoarding>
  </StrictMode>,
)
