import "./Coordinates.css";
import {  useState } from "react";
import axios from "axios";
import { DataComponent } from "../Map/Map";


function Coordinates() {
  const [address, setAddress]  = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  function TextComponent () {
    if (!address) {
      return (
        <div id="infotext">
            <p>
              Note: Enter the Latitude and Longitude values in Decimal Degrees
            </p>
            <p>
              The Co-ordinates of Mumbai in Decimal Degrees: : 19.0760 , 72.8777
            </p>
           <p>
           <a
              href=" https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps"
              target="_blank"
            >
              https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps
            </a>
           </p>
          </div>
      )
    }

    else {
      return (
        <p id="addressdiv">Address: {address}</p>
      )
    }
  }
  
  
  function getData() {
   
    setIsLoading(true);
    const start = Date.now();
    let end
    const coords = document.getElementById("coordinates-input").value;
    const coordsArray = coords.split(",", 2);
    for (let i = 0; i < 2; i++) {
      coordsArray[i] = parseFloat(coordsArray[i]);
    }
    let reversedArray = coordsArray.reverse();
   // request to get the address of the given lat, long coordinates
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${import.meta.env.VITE_MAPS_API_KEY}`
      )
      .then((response) => {
        const locationAddress =  response.data.results[0].formatted_address;
        console.log(locationAddress);
        setAddress(locationAddress);
      })
      .catch((error) => console.log(error));
    

      axios
      .post("https://ee-api-v3-33bpa3dkba-ue.a.run.app/all", JSON.stringify(JSON.stringify(reversedArray)))
      .then((response) => {
        const responseData = response.data;
        console.log(responseData)
        setResponseData(responseData);
        setIsLoading(false);
        end = Date.now();
        console.log(`time taken for eedata request: ${end-start}`)
      })
      .catch((error) => {
        console.error("Error:", error);
        end = Date.now();
        console.log(`time taken for eedata request: ${end-start}`)
        setIsLoading(false);
      });

  }

  
  return (
    
      <div id="page-div">
        
        <div className="home-button">
          <a href="/">Home</a>
        </div>

        <div id="maincontent">
          
          <div id="inputdiv">
            <input id="coordinates-input" type="text" defaultValue="19.0760,72.8777" />
            <input
              id="submit"
              type="button"
              value="Get Data"
              onClick={getData}
            />
          </div>
          
          
          <TextComponent />
          
          <div id="loading-text">
          {isLoading && <p>Calculating...</p>}
          </div>
          <div id="responsedata">
            {!isLoading && responseData  && <DataComponent responseData={responseData} />}
          </div>
        </div>
      </div>
  );
}

export default Coordinates;
