import { useState, useEffect, useRef } from "react";
import { config } from "../../assets/config";
import {
  GoogleMap,
  DrawingManager,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import "./Map.css";

const mapArguments = {
  containerStyle: {
    width: "100%",
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

function Map() {
  const [map, setMap] = useState(/**@type google.maps.Map*/null);
  const [markers, setMarkers] = useState([]); // Add markers state
  // We the below bounds are the bounds of the map with India at the center 
  const [autocompleteBounds, setAutocompleteBounds] = useState({
    east: 105.97167968749999,
    west: 54.02832031249999,
    north: 39.76944692092199,
    south: 6.046274805739095,
  });
  // const autocompleteServiceRef = useRef(null);

  //isLoaded returns true if map is loaded successfully 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config.MAPS_API_KEY,
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
      setAutocompleteBounds(newAutoCompleteBounds);      
    }
  };

  useEffect(() => {
    console.log(`autocompleteBounds is ${autocompleteBounds.east}`);
  }, [autocompleteBounds]);

  const onPlaceChanged = () => {
    const place = window.autocomplete.getPlace();
    const bounds = new window.google.maps.LatLngBounds();

    console.log(`Place: ${place}`);
    console.log("Place changed");
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
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
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

  return (
    <>
      {isLoaded && (
        <div id="MapDiv" style={{ display: "flex", alignItems: "center" }}>
          <GoogleMap
            mapContainerStyle={mapArguments.containerStyle}
            center={mapArguments.center}
            zoom={mapArguments.zoom}
            tilt={mapArguments.tilt}
            onBoundsChanged={onBoundsChanged}
            onLoad={(map) => {setMap(map)}}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
              mapTypeId: 'hybrid'    
            }}
          >
            <Autocomplete
              bounds={autocompleteBounds}
              onPlaceChanged={onPlaceChanged}
              onLoad={(autocomplete) => {
                window.autocomplete = autocomplete;
                // autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
              }}
            >
              <input
                type="text"
                placeholder="Search for a City,Town,Restaurant"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-120px",
                  marginTop: "8px",
                }}
              />
            </Autocomplete>
            <DrawingManager
              onLoad={onLoad}
              // onPolygonComplete={onPolygonComplete}
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
            />
          </GoogleMap>
        </div>
      )}
    </>
  );
}

export default Map;
