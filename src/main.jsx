import React from 'react'
import { createRoot } from 'react-dom/client'
import CoverSlide from './CoverSlide'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CoverSlide />
  </React.StrictMode>
)
