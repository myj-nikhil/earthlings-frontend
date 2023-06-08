import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Coordinates from './components/Coordinates/Coordinates';
import DiagonalCoordinates from './components/DiagonalCoordinates/DiagonalCoordinates';
import MyMap from './components/Map/Map';
import HomePage from './components/HomePage/HomePage';
import Form from './components/Form/Form';
import EditForm from './components/EditForm/EdiFrom';
import './index.css';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import axios from 'axios'; // Import axios

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get('https://ee-api-v3-33bpa3dkba-ue.a.run.app/initialize-ee')
  .then(response => {
    console.log(response.data);
    setIsInitialized(true);
  })
  .catch(error => {
    console.error(error);
  });
  }

  // if (!isInitialized) {
  //   // Display a loading indicator or placeholder while data is being fetched
  //   return <div>Loading...</div>;
  // }

  return (isInitialized && (
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
      <VercelAnalytics />
    </React.StrictMode>
  ));
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
