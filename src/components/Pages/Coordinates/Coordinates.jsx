import "./Coordinates.css";
import { useState } from "react";
import axios from "axios";
import { DataComponent } from "../Map/Map";
import LogoutButton from "../../Buttons/LogoutButton/LogoutButton";
import HomeButton from "../../Buttons/HomeButton/HomeButton";
// import { useAuth0 } from "@auth0/auth0-react";
// import EditDetailsButton from "../../Buttons/EditDetailsButton/EditDetailsButton";

const eeApiUrl = import.meta.env.VITE_EE_API_URL;


// In this page , user enters lat , lng of a place and we get address and earthengine data of the entered coordinates.
function Coordinates() {
  const [address, setAddress] = useState(null); // Address of the given latitude and longitude
  const [responseData, setResponseData] = useState(null); // The response data from our API (which gives us the calculated values of the given location)
  const [isFetching, setisFetching] = useState(false);  // This refers to whether we are in the process of fetching from our API.

  // const { user, isAuthenticated } = useAuth0();

 // We display text component to guide the user, but we hide this After we fetch the address
  function TextComponent() {
    if (!address) {
      return (
        <div id="infotext" style={{ fontSize: "large" }}>
          <p style={{ fontSize: "large" }}>
            Note: Enter the Latitude and Longitude values in Decimal Degrees
          </p>
          <p style={{ fontSize: "large" }}>
            The Co-ordinates of Mumbai in Decimal Degrees: : 19.0760 , 72.8777
          </p>
          <p style={{ fontSize: "large" }}>
            <a
              href=" https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps"
              target="_blank"
            >
              https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps
            </a>
          </p>
        </div>
      );
    } else {
      return (
        <p id="addressdiv" style={{ fontSize: "large" }}>
          Address: {address}
        </p>
      );
    }
  }

  // This is to hit our API and get ee data.
  function getData() {
    setisFetching(true);
    const start = Date.now();
    let end;
    const coords = document.getElementById("coordinates-input").value;
    
    const coordsArray = coords.split(",", 2);
    for (let i = 0; i < 2; i++) {
      coordsArray[i] = parseFloat(coordsArray[i]);
    }
    let reversedArray = coordsArray.reverse();
    // request to get the address of the given lat, long coordinates
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${
          import.meta.env.VITE_MAPS_API_KEY
        }`
      )
      .then((response) => {
        const locationAddress = response.data.results[0].formatted_address;
        console.log(locationAddress);
        setAddress(locationAddress);
      })
      .catch((error) => console.log(error));

    axios
      .post(
        `${eeApiUrl}/all`,
        JSON.stringify(JSON.stringify(reversedArray))
      )
      .then((response) => {
        const responseData = response.data;
        console.log(responseData);
        setResponseData(responseData);
        setisFetching(false);
        end = Date.now();
        console.log(`time taken for eedata request: ${(end - start)/1000} sec`);
      })
      .catch((error) => {
        console.error("Error:", error);
        end = Date.now();
        console.log(`time taken for eedata request: ${(end - start)/1000} sec`);
        setisFetching(false);
      });
  }

  return (
    <div id="page-div">
      <LogoutButton />
      <HomeButton />
      {/* {isAuthenticated && (
        <nav style={{marginLeft:"auto", paddingLeft:"1500px",}}>
        <img src={user.picture} alt={user.name} style={{height:"60px",width:"60px"}} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>user_id: {user.sub}</p>
        <EditDetailsButton/>
      </nav>
      
      )} */}
      <div id="maincontent" style={{margin:"0"}}>
        <div id="inputdiv">
          <input
            id="coordinates-input"
            type="text"
            defaultValue="19.0760,72.8777"
          />
          <input id="submit" type="button" value="Get Data" onClick={getData} />
        </div>

        <TextComponent />

        <div id="loading-text">
          {isFetching && <p style={{ fontSize: "large" }}>Calculating...</p>}
        </div>
        <div id="responsedata" style={{ width: "46.8%", margin: "auto" }}>
          {!isFetching && responseData && (
            <DataComponent responseData={responseData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Coordinates;
