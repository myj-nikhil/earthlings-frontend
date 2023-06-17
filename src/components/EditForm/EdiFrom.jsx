import {
  GoogleMap,
  DrawingManager,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import * as turf from "@turf/turf";
import axios from "axios";
import { render } from "react-dom";
import { DataComponent } from "../Map/Map";
import "../Form/Form.css";


const mapKey = import.meta.env.VITE_MAPS_API_KEY;

let roundedArea, userData, userCoordinates, postCoordinates = null;

const mapArguments = {
  containerStyle: {
    width: "90%",
    height: "500px",
    margin: "0px",
    padding: "0px",
  },
  center: { lat: 24, lng: 80 },
  zoom: 17,
  tilt: 45,
};

const mapLibraries = ["drawing", "geometry", "places"];

const onLoad = (drawingManager) => {
  console.log(drawingManager);
  console.log("drawing manager loaded");
};

export default function EditForm() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [, setGeojsonLayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isconfirmed, setIsConfirmed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [isUserExists, setIsUserExists] = useState(false);
  const [userID, setUserID] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 24, lng: 80 })

  // Function to handle changes in the input box
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const autocompleteBounds = {
    east: -80.786,
    west: -80.989,
    north: 35.237,
    south: 35.035,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapKey,
    libraries: mapLibraries,
  });

  const onBoundsChanged = () => {
    if (map) {
      const newBounds = map.getBounds();
      const newAutoCompleteBounds = {
        east: newBounds.getNorthEast().lng(),
        west: newBounds.getSouthWest().lng(),
        north: newBounds.getNorthEast().lat(),
        south: newBounds.getSouthWest().lat(),
      };
      console.log(`newBounds are ${newBounds}`);
      console.log(`east: ${newAutoCompleteBounds.east}`);
      console.log(`west: ${newAutoCompleteBounds.west}`);
      console.log(`north: ${newAutoCompleteBounds.north}`);
      console.log(`south: ${newAutoCompleteBounds.south}`);
    }
  };

  const onPlaceChanged = () => {
    const place = window.autocomplete.getPlace();

    if (place && map) {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      setMarkers([]);

      // Create a marker for the selected place.
      const marker = new window.google.maps.Marker({
        map,
        title: place.name,
        position: place.geometry.location,
      });

      setMarkers([marker]);

      const bounds = new window.google.maps.LatLngBounds();
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      map.setCenter(place.geometry.location);
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the markers when the component unmounts.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [markers]);

  useEffect(() => {
    if (map) {
      // Load GeoJSON data
      const geojsonUrl = "https://db-api-v2-qw2rp233lq-ue.a.run.app/geojson";
      const loadGeoJson = async () => {
        const response = await fetch(geojsonUrl);
        const geojsonData = await response.json();
        // Create the GeoJSON layer
        const layer = new window.google.maps.Data();
        layer.addGeoJson(geojsonData);
        console.log("geojson data loaded")

        // Set the style for the GeoJSON layer
        layer.setStyle({
          fillColor: "blue",
          strokeWeight: 3,
        });

        // Add event listener for clicks on the GeoJSON layer
        layer.addListener("click", (event) => {
          console.log("geojson layer clicked");
          const name = event.feature.getProperty("name");
          const phone = event.feature.getProperty("phone");
          const area = event.feature.getProperty("area");
          const eeData = event.feature.getProperty("ee_data");
          console.log("type of name: ", typeof name);
          console.log("eeData: ", eeData);

          const content = `
            <div>
              <div><b>Name:</b> ${name}</div>
              <div><b>Phone:</b> ${phone}</div>
              <div><b>Area:</b> ${area}</div>
              <button id="eeDataBtn">View EE Data</button>
              <div id="dataComponentContainer"></div>
            </div>
          `;

          const infowindow = new window.google.maps.InfoWindow();
          infowindow.setPosition(event.latLng);
          infowindow.setContent(content);
          infowindow.open(map);
          infowindow.addListener("domready", () => {
            const eeDataBtn = document.getElementById("eeDataBtn");
            if (eeDataBtn) {
              eeDataBtn.addEventListener("click", function () {
                console.log("button clicked");
                const dataComponentContainer = document.getElementById(
                  "dataComponentContainer"
                );
                if (dataComponentContainer) {
                  render(
                    <DataComponent responseData={eeData} />,
                    dataComponentContainer
                  );
                }
              });
            }
          });

          // Add click event listener for the button
        });

        // Set the GeoJSON layer on the map
        layer.setMap(map);

        setGeojsonLayer(layer);
      };

      loadGeoJson();
      console.log("geojson layer added");
    }
  }, [map]);

  const confirmData = () => {
    console.log("button clicked");
    console.log(`length of coordinates is  ${coordinates.length}`)
    console.log(name)
    console.log(phone)
    console.log(coordinates)
    if (name && phone) {
      setIsConfirmed(true);
      setIsEditable(false);
      console.log("Coordinates" + coordinates);
      setIsLoading(true);
      postCoordinates = coordinates;
      if(coordinates.length < 3){
        console.log("No coordinates")
        postCoordinates = userCoordinates;
        setResponseData(userData.geojson.properties.ee_data);
        setIsLoading(false);
        roundedArea = userData.geojson.properties.area;
      }
      else {
        console.log(`post coordinates ${postCoordinates}`)
      let turfPolygon = turf.polygon([postCoordinates]);
      let area = turf.area(turfPolygon);
      console.log(`Area of the polygon is ${area}`);
      roundedArea = `${Math.round(area * 100) / 100} sq.m`;
      const url = "https://ee-api-v3-33bpa3dkba-ue.a.run.app/all"; // Replace with the actual API endpoint URL
      const postData = JSON.stringify(JSON.stringify(postCoordinates));

      axios
        .post(url, postData)
        .then((response) => {
          const responseData = response.data;
          responseData.Area = { Area: roundedArea };
          setResponseData(responseData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
      }
    } 
    

    else {
      alert("Please fill all the details and draw a shape");
    }
  };

  function Confirmation(props) {
    const name = props.name;
    const phone = props.phone;
    const coordinatesData = props.coordinatesData;

    return (
      <>
        {isconfirmed && (
          <div>
            <p>
              <strong>Name: </strong>
              {name}
            </p>
            <p>
              <strong>Phone: </strong>
              {phone}
            </p>
            <p>
              <strong>Boundary Coordinates: </strong>
              {JSON.stringify(coordinatesData)}
            </p>
            <p>
              <strong>Data: </strong>
              {isLoading && <p>Calculating...</p>}
              <div id="responsedata">
                {responseData && <DataComponent responseData={responseData} />}
              </div>
            </p>
          </div>
        )}
      </>
    );
  }

  function submitToServer() {
    // console.log(area);
    const userData = {
      name: name,
      phone: phone,
      geojson: {
        type: "Feature",
        properties: {
          name: name,
          phone: phone,
          area: roundedArea,
          ee_data: responseData,
        },
        geometry: {
          coordinates: [postCoordinates],
          type: "Polygon",
        },
      },
      // ee_data : eeData
    };

    console.log("user_data : ", userData); // the complete data object

    // submit the data to the server
    // ...
    // send a POST request to the API endpoint
    fetch(`https://db-api-v2-qw2rp233lq-ue.a.run.app/users/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User data updated successfully!");
          console.log(response.text().value);
          console.log(response.status);
          // reset the form and map
          document.getElementById("name").value = "";
          document.getElementById("phone").value = "";
          // map.setMap(null);
          // polygon.setPath([]);
          // document.getElementById("confirmation").style.display = "none";
          setIsConfirmed(false);
          setIsEditable(true);
          setName('');
          setPhone('');
          setCoordinates([]);
          setResponseData(null);
          alert("Data Updated successfully!");
        } else {
          alert("Error updating user data:" + response.statusText);
        }
      })
      .catch((error) => {
        console.log("Error updating user data:", error);
      });
  }
let uid;
  function fetchDetails() {
    setIsFetching(true)
    setUserID(document.getElementById("uid").value);
    uid = document.getElementById("uid").value;
    console.log(typeof userID);
    let apiUrl = `https://db-api-v2-qw2rp233lq-ue.a.run.app/users/${uid}`;
    // let apiUrl =`http://localhost:3000/users/${userID}`;
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
         userData = data[0];
        console.log(userData);
        setIsFetched(true);
        setIsFetching(false);
        if (typeof userData == "undefined") {
          setIsUserExists(false);
        }
        else {
            setIsUserExists(true);
            userCoordinates = userData.geojson.geometry.coordinates[0];
            console.log(coordinates);
            if (coordinates.length == 0) {
            //   setResponseData(userData.geojson.properties.ee_data)
            }
            // document.getElementById("edit-details").style.display = "block";
            console.log("pf", userData.geojson);
    
            // Initialize variables to hold the sum of latitudes and longitudes
            let sumLat = 0;
            let sumLng = 0;
    
            // Loop through each coordinate pair and add to the sum
            for (let i = 0; i < userCoordinates.length; i++) {
              sumLat += userCoordinates[i][1];
              sumLng += userCoordinates[i][0];
            }
    
            // Calculate the average latitude and longitude
            const avgLat = sumLat / userCoordinates.length;
            const avgLng = sumLng / userCoordinates.length;

            setMapCenter({ lat: avgLat, lng: avgLng });
            setName(userData.name);
            console.log(`User Name is ${userData.name}`)
            setPhone(userData.phone);
            console.log(`User phone is ${userData.phone}`)
            // Log the center point
            console.log(`Center point: (${avgLng}, ${avgLat})`);
    
 
                    }
      });
  }

  return (
    <>
      {isLoaded && (
        <div id="form-div">
          <div className="home-button">
            <a href="/">Home</a>
          </div>

          <label className="labels" htmlFor="uid">Enter ID:</label>
          <input  id="uid" required pattern="[a-zA-Z ]+" />

          <div id="fetch details" style={{ marginTop: "20px" }}>
            <button onClick={fetchDetails}>Fetch Details</button>
          </div>

          {isFetched && isUserExists && !isFetching && (
            <div>
              <div id="input-div">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                  pattern="[a-zA-Z ]+"
                  readOnly={!isEditable}
                />

                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  readOnly={!isEditable}
                />
              </div>

              <div id="form-map-div">
                <GoogleMap
                  mapContainerStyle={mapArguments.containerStyle}
                  center={mapCenter}
                  zoom={17}
                  tilt={mapArguments.tilt}
                  onBoundsChanged={onBoundsChanged}
                  onLoad={(map) => {
                    setMap(map);
                  }}
                  options={{
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeId: "hybrid",
                  }}
                >
                  <Autocomplete
                    bounds={autocompleteBounds}
                    onPlaceChanged={onPlaceChanged}
                    onLoad={(autocomplete) => {
                      window.autocomplete = autocomplete;
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search for a City, Town, Restaurant"
                      style={{
                        boxSizing: "border-box",
                        border: "1px solid transparent",
                        width: "500px",
                        height: "32px",
                        padding: "0 12px",
                        borderRadius: "3px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                        fontSize: "14px",
                        outline: "none",
                        textOverflow: "ellipsis",
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-120px",
                        marginTop: "8px",
                      }}
                    />
                  </Autocomplete>
                  <DrawingManager
                    onLoad={onLoad}
                    options={{
                      drawingControl: true,
                      drawingControlOptions: {
                        position:
                          window.google.maps.ControlPosition.RIGHT_CENTER,
                        drawingModes: [
                          window.google.maps.drawing.OverlayType.POLYGON,
                        ],
                      },
                    }}
                    onPolygonComplete={(polygon) => {
                      console.log("Polygon drawn");
                      let path = polygon.getPath();
                      console.log(path);

                      // Clear the stored coordinates
                      setCoordinates([]);

                      for (let i = 0; i < path.getLength(); i++) {
                        let latLng = path.getAt(i);
                        setCoordinates((prevCoordinates) => [
                          ...prevCoordinates,
                          [latLng.lng(), latLng.lat()],
                        ]);
                      }

                      console.log("Final coordinates: ", coordinates);
                      setCoordinates((prevCoordinates) => [
                        ...prevCoordinates,
                        prevCoordinates[0],
                      ]);
                    }}
                  />
                </GoogleMap>
              </div>
              <div id="first-submit-button" style={{ marginTop: "20px" }}>
                <button
                  onClick={() => {
                    confirmData();
                  }}
                >
                  Confirm Data
                </button>
                <Confirmation
                  name={name}
                  phone={phone}
                  coordinatesData={postCoordinates}
                />
                {responseData && (
                  <>
                    <button onClick={submitToServer}>Submit Data</button>
                    <button
                      onClick={() => {
                        setIsConfirmed(false);
                        setIsEditable(true);
                        setName([]);
                        setPhone([]);
                        setCoordinates([]);
                        setResponseData(null);
                      }}
                      style={{ marginTop: "20px" }}
                    >
                      Edit Data
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {isFetched && !isUserExists && !isFetching && (
            <div id="error-div">
                <p> User Details with id: {userID} not found</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
