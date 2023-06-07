import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Coordinates from './components/Coordinates/Coordinates';
import DiagonalCoordinates from './components/DiagonalCoordinates/DiagonalCoordinates';
import MyMap from './components/Map/Map';
import HomePage from './components/HomePage/HomePage';
import Form from './components/Form/Form';
import EditForm from './components/EditForm/EdiFrom';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coordinates" element={<Coordinates />} />
        <Route path="/diagonal-coordinates" element={<DiagonalCoordinates />} />
        <Route path="/map" element={<MyMap />} />
        <Route path="/form" element={<Form />} />
        <Route path="/edit-form" element={<EditForm />} />

      </Routes>
    </Router>
  </React.StrictMode>
);
