import { useState, useEffect } from "react";
import { render } from "react-dom"; // Updated import statement
import {
  GoogleMap,
  DrawingManager,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import "./Map.css";
import * as turf from "@turf/turf";
import axios from "axios";
import LogoutButton from "../../Buttons/LogoutButton/LogoutButton";

const mapKey = import.meta.env.VITE_MAPS_API_KEY;
const eeApiUrl = import.meta.env.VITE_EE_API_URL;
const dbApiUrl = import.meta.env.VITE_DB_API_URL;

const mapArguments = {
  containerStyle: {
    width: "53vw",
    height: "850px",
    margin: "0px",
    padding: "0px",
  },
  center: { lat: 24, lng: 80 },
  zoom: 5,
  tilt: 45,
};

const mapLibraries = ["drawing", "geometry", "places"];

const onLoad = (drawingManager) => {
  console.log(drawingManager);
  console.log("drawing manager loaded");
};

export function DataComponent({ responseData }) {
  const renderTable = () => {
    const tableRows = [];

    // Create header row
    const headerRow = (
      <tr key="header">
        <th>Category</th>
        <th>Parameter</th>
        <th>Value</th>
      </tr>
    );
    tableRows.push(headerRow);

    // Create rows for each key-value pair in the response object

    for (const [key, value] of Object.entries(responseData)) {
      if (key === "monthly_rainfall") {
        console.log(key, value);
        continue;
      }

      const renderSubTable = () => {
        const subTableRows1 = [];
        const subTableRows2 = [];

        for (const [subKey, subValue] of Object.entries(value)) {
          let subCell1 = <td>{subKey}</td>;
          let subCell2 = <td>{subValue}</td>;

          if (key === "Rainfall") {
            // eslint-disable-next-line react/prop-types
            const monthlyRainfall = responseData.monthly_rainfall;
            const subsubTableRows1 = [];

            for (const [subsubKey, subsubValue] of Object.entries(
              monthlyRainfall
            )) {
              let subsubCell1 = <td>{subsubKey}</td>;
              let subsubCell2 = <td>{subsubValue}</td>;
              let subsubRow = (
                <tr key={subsubKey}>
                  {subsubCell1}
                  {subsubCell2}
                </tr>
              );
              subsubTableRows1.push(subsubRow);
            }

            let hoverText = (
              <>
                <p id="hoverelement">&#x24D8;</p>
                <table id="rainfall-table">
                  <tbody>{subsubTableRows1}</tbody>
                </table>
              </>
            );
            subCell2 = (
              <td id="rainfall-data-td">
                {subValue}
                {hoverText}
              </td>
            );
          }

          let subRow1 = (
            <tr key={subKey} id={subKey}>
              {subCell1}
            </tr>
          );
          let subRow2 = (
            <tr key={`${subKey}val`} id={`${subKey}val`}>
              {subCell2}
            </tr>
          );

          subTableRows1.push(subRow1);
          subTableRows2.push(subRow2);
        }

        const subTable1 = <tbody>{subTableRows1}</tbody>;
        const subTable2 = <tbody>{subTableRows2}</tbody>;

        const cell2 = (
          <td>
            <table id={`${key}key-table`}>{subTable1}</table>
          </td>
        );
        const cell3 = (
          <td>
            <table id={`${key}value-table`}>{subTable2}</table>
          </td>
        );

        return (
          <>
            {cell2}
            {cell3}
          </>
        );
      };

      const cell1 = <td className="keycell">{key}</td>;
      const cell2 =
        typeof value === "object" ? renderSubTable() : <td>{value}</td>;
      const row = (
        <tr key={key}>
          {cell1}
          {cell2}
        </tr>
      );

      tableRows.push(row);
    }

    return <tbody>{tableRows}</tbody>;
  };

  return <table id="data-table">{renderTable()}</table>;
}

function Map() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [, setGeojsonLayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const submitData = () => {
    console.log("button clicked");

    if (coordinates.length > 3) {
      console.log(coordinates);
      setIsLoading(true);

      let turfPolygon = turf.polygon([coordinates]);
      let area = turf.area(turfPolygon);
      console.log(`Area of the polygon is ${area}`);
      const roundedArea = `${Math.round(area * 100) / 100} sq.m`;
      const url = `${eeApiUrl}/all`; // Replace with the actual API endpoint URL
      const postData = JSON.stringify(JSON.stringify(coordinates));

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
    } else {
      alert("Please select at least 3 points");
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
      const geojsonUrl = `${dbApiUrl}/geojson`;
      const loadGeoJson = async () => {
        const response = await fetch(geojsonUrl);
        const geojsonData = await response.json();
        // Create the GeoJSON layer
        const layer = new window.google.maps.Data();
        layer.addGeoJson(geojsonData);

        // Set the style for the GeoJSON layer
        layer.setStyle({
          fillColor: "blue",
          strokeWeight: 1,
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

        });

        // Set the GeoJSON layer on the map
        layer.setMap(map);

        setGeojsonLayer(layer);
      };

      loadGeoJson();
      console.log("geojson layer added");
    }
  }, [map]);

  return (
    <>
      {isLoaded && (
        <div id="MapDiv" style={{ display: "flex", height: "100%" }}>
          <GoogleMap
            mapContainerStyle={mapArguments.containerStyle}
            center={mapArguments.center}
            zoom={mapArguments.zoom}
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
            <div id="home-button-map" className="home-button">
              <a href="/">Home</a>
            </div>
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
                  position: window.google.maps.ControlPosition.RIGHT_CENTER,
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
          <div
            id="resultDisplay"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexBasis: "47vw",
              height: "100%",
              padding: "0",
              // border: "solid white 5px"
            }}
          >
            {/*Button to submit data*/}
            <button
              type="submit"
              style={{
                fontSize: "16px",
                padding: "10px",
                backgroundColor: "grey",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={submitData}
            >
              Get Data
            </button>

            {/* When earth engine data is being fetched from the api, display this is div */}
            {isLoading && <p style={{ fontSize: "large" }}>Calculating...</p>}

            {/* Display respinse data after it is fetched from the earth engine data*/}
            <div
              id="responsedata"
              style={{ width: "100%", padding: "0px", margin: "5px" }}
            >
              {responseData && <DataComponent responseData={responseData} />}
            </div>
          </div>
          <LogoutButton />
        </div>
      )}
    </>
  );
}

export default Map;
