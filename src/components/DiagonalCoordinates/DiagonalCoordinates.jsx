import "./DiagonalCoordinates.css";
import { useState } from "react";
import * as turf from "@turf/turf";
import axios from "axios";
import { DataComponent } from "../Map/Map";

export default function DiagonalCoordinates() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  function getData() {
    const topLeftLat = parseFloat(
      document.getElementById("top-left-lat").value
    );
    const topLeftLong = parseFloat(
      document.getElementById("top-left-long").value
    );
    const bottomRightLat = parseFloat(
      document.getElementById("bottom-right-lat").value
    );
    const bottomRightLong = parseFloat(
      document.getElementById("bottom-right-long").value
    );

    // validate the input values
    if (
      isNaN(topLeftLat) ||
      isNaN(topLeftLong) ||
      isNaN(bottomRightLat) ||
      isNaN(bottomRightLong)
    ) {
      alert("Please enter valid coordinates.");
      return;
    }

    // calculate the other two corner coordinates
    const topRightLat = topLeftLat;
    const topRightLong = bottomRightLong;
    const bottomLeftLat = bottomRightLat;
    const bottomLeftLong = topLeftLong;

    // create an array of the corner coordinates in clockwise order
    const coordinates = [
      [topLeftLong, topLeftLat],
      [topRightLong, topRightLat],
      [bottomRightLong, bottomRightLat],
      [bottomLeftLong, bottomLeftLat],
      [topLeftLong, topLeftLat],
    ];
    setIsLoading(true);

    let turfPolygon = turf.polygon([coordinates]);
    let area = turf.area(turfPolygon);
    console.log(`Area of the polygon is ${area}`);
    const roundedArea = `${Math.round(area * 100) / 100} sq.m`;
    const url = "https://ee-api-v3-33bpa3dkba-ue.a.run.app/all"; // Replace with the actual API endpoint URL
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
    console.log(coordinates);
  }

  return (
    <div id="diagcoord">
      <div className="home-button">
        <a href="/">Home</a>
      </div>
      <form>
        <label htmlFor="top-left-lat">Top-Left Latitude:</label>
        <input type="number" id="top-left-lat" name="top-left-lat" step="any" />
        <br />

        <label htmlFor="top-left-long">Top-Left Longitude:</label>
        <input
          type="number"
          id="top-left-long"
          name="top-left-long"
          step="any"
        />
        <br />

        <label htmlFor="bottom-right-lat">Bottom-Right Latitude:</label>
        <input
          type="number"
          id="bottom-right-lat"
          name="bottom-right-lat"
          step="any"
        />
        <br />

        <label htmlFor="bottom-right-long">Bottom-Right Longitude:</label>
        <input
          type="number"
          id="bottom-right-long"
          name="bottom-right-long"
          step="any"
        />
        <br />
      </form>
      <button id="submit" type="submit" onClick={getData}>
        Get Data
      </button>
      <div id="ans">
        {isLoading && <p>Calculating...</p>}
        {!isLoading && responseData && (
          <DataComponent responseData={responseData} />
        )}
      </div>
    </div>
  );
}
