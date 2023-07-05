import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Coordinates from "./components/Pages/Coordinates/Coordinates";
import Login from "./components/Login/Login";
import DiagonalCoordinates from "./components/Pages/DiagonalCoordinates/DiagonalCoordinates";
import MyMap from "./components/Pages/Map/Map";
import HomePage from "./components/Pages/HomePage/HomePage";
import Form from "./components/Pages/Form/Form";
import EditForm from "./components/Pages/EditForm/EdiFrom";
import LoginPage from "./components/Pages/LoginPage/LoginPage";
import EditDetails from "./components/Pages/EditDetails/EditDetails";
import "./App.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import axios from "axios";
import { Auth0Provider,withAuthenticationRequired } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const eeApiUrl = import.meta.env.VITE_EE_API_URL;

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Initialising earth engine in our API upfront , so that it need not be initailised when a request is made.
  function fetchData() {
    axios
      .get(`${eeApiUrl}/initialize-ee`)
      .then((response) => {
        console.log(response.data);
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  

  return (
    <React.StrictMode>
      <Router>
      <Auth0ProviderWithRedirectCallback
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
          <Routes>
            <Route path="/" element={<ProtectedRoute component={HomePage} />}/>
            <Route path="/login" element={<ProtectedRoute component={Login} />} />
            <Route path="/coordinates" element={<ProtectedRoute component={Coordinates} />} />
            <Route path="/diagonal-coordinates" element={<ProtectedRoute component={DiagonalCoordinates} />} />
            <Route path="/map" element={<ProtectedRoute component={MyMap} />} />
            <Route path="/form" element={<ProtectedRoute component={Form} />} />
            <Route path="/edit-form" element={<ProtectedRoute component={EditForm} />} />
            <Route path="/login-page" element={<LoginPage/>} />
            <Route path="/edit-details" element={<ProtectedRoute component={EditDetails} />} />
          </Routes>
          </Auth0ProviderWithRedirectCallback>
      </Router>
      <VercelAnalytics />
    </React.StrictMode>
  );
}
