import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import App from './App.tsx'
import './index.css'  // or './App.css' depending on your file name

ReactDOM.createRoot(document.getElementById('root')!).render(
    <NextUIProvider>
      <App />
    </NextUIProvider>
)