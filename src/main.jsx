import React from 'react'
import {createRoot} from 'react-dom/client'
// import App from './App.jsx'
// import Coordinates from './components/Coordinates/Coordinates'
// import DiagonalCoordinates from './components/DiagonalCoordinates/DiagonalCoordinates'
import MyMap from './components/Map/Map'
import './index.css'


const container = document.getElementById('root')
const root =  createRoot(container)

root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Coordinates /> */}
    {/* <DiagonalCoordinates /> */}
    <MyMap />
    </React.StrictMode>
)
