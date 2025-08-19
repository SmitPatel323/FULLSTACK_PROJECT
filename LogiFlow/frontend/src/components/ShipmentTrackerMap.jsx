import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
import polyline from '@mapbox/polyline';
import apiClient from '../services/api';

export default function ShipmentTrackerMap({ shipment, onDeliveryStatusChange }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [currentPos, setCurrentPos] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [decodedPath, setDecodedPath] = useState([]);
  const mapRef = useRef(null);
  const firstRender = useRef(true);

  // Use a ref to track the animation state without causing re-renders
  const animationRef = useRef({
    segmentIndex: 0,
    progress: 0,
    intervalId: null,
  });

  // Use a ref to track which status updates have been sent
  const statusSentRef = useRef({
      inTransit: false,
      outForDelivery: false,
      delivered: false,
  });

  // Safely decode the polyline once when the shipment data is available
  useEffect(() => {
    if (shipment && shipment.route_polyline) {
      try {
        const decoded = polyline.decode(shipment.route_polyline);
        const path = decoded.map(([lat, lng]) => ({ lat, lng }));
        setDecodedPath(path);
      } catch (err) {
        console.error("Failed to decode polyline:", err);
        setDecodedPath([]);
      }
    }
  }, [shipment]);

  // Effect to find the starting index based on the last saved location
  useEffect(() => {
    if (decodedPath.length > 0 && shipment && shipment.current_lat && shipment.current_lng) {
        let closestIndex = 0;
        let minDistance = Infinity;
        decodedPath.forEach((point, index) => {
            const distance = Math.sqrt(
                Math.pow(point.lat - shipment.current_lat, 2) +
                Math.pow(point.lng - shipment.current_lng, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        animationRef.current.segmentIndex = closestIndex;
    }
  }, [decodedPath, shipment]);

  // Calculate bearing for rotation
  const getBearing = (start, end) => {
    if (!start || !end) return 0;
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;
    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  // Interpolate for smooth movement
  const interpolatePos = (start, end, factor) => ({
    lat: start.lat + (end.lat - start.lat) * factor,
    lng: start.lng + (end.lng - start.lng) * factor,
  });

  // The single, authoritative animation loop
  useEffect(() => {
    if (decodedPath.length < 2 || !shipment || shipment.status === "Delivered") {
      if (shipment && shipment.status === "Delivered" && decodedPath.length > 0) {
        setCurrentPos(decodedPath[decodedPath.length - 1]);
      }
      return;
    }

    const moveTruck = () => {
  // Update progress
  // animationRef.current.progress += 0.02; // slower, smoother speed
  animationRef.current.progress += 0.1; // Medium speed


  if (animationRef.current.progress >= 1) {
    animationRef.current.progress = 0;
    animationRef.current.segmentIndex++;

    const newSegment = decodedPath[animationRef.current.segmentIndex];
    if (newSegment) {
      apiClient.post(`/shipments/${shipment.id}/update_location/`, {
        lat: newSegment.lat,
        lng: newSegment.lng
      }).catch(err => console.error("Failed to save location:", err));
    }
  }

  // 🔹 Trigger statuses only ONCE at proper milestones
  if (animationRef.current.segmentIndex === 0 && !statusSentRef.current.inTransit) {
    onDeliveryStatusChange("In Transit");
    statusSentRef.current.inTransit = true;
  }

  if (
    animationRef.current.segmentIndex >= Math.floor(decodedPath.length * 0.7) &&
    !statusSentRef.current.outForDelivery
  ) {
    onDeliveryStatusChange("Out for Delivery");
    statusSentRef.current.outForDelivery = true;
  }

  if (
    animationRef.current.segmentIndex >= decodedPath.length - 1 &&
    !statusSentRef.current.delivered
  ) {
    onDeliveryStatusChange("Delivered");
    statusSentRef.current.delivered = true;
    clearInterval(animationRef.current.intervalId); // ✅ Stop animation
  }

  // Update visual position
  const start = decodedPath[animationRef.current.segmentIndex];
  const end = decodedPath[animationRef.current.segmentIndex + 1] || start;
  setCurrentPos(interpolatePos(start, end, animationRef.current.progress));
  setBearing(getBearing(start, end));
};


    animationRef.current.intervalId = setInterval(moveTruck, 100); // Animation smoothness

    return () => clearInterval(animationRef.current.intervalId);
  }, [decodedPath, shipment, onDeliveryStatusChange]);

  const onLoadMap = (map) => {
    mapRef.current = map;
    if (firstRender.current && decodedPath.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);
        firstRender.current = false;
    }
  };

  if (!isLoaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Loading Map...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={currentPos || (decodedPath.length > 0 ? decodedPath[0] : { lat: 0, lng: 0 })}
      onLoad={onLoadMap}
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "8px" }}
      options={{ disableDefaultUI: true, zoomControl: true, gestureHandling: "greedy" }}
    >
      {decodedPath.length > 0 && (
        <>
          <MarkerF position={decodedPath[0]} label="A" />
          <MarkerF position={decodedPath[decodedPath.length - 1]} label="B" />
        </>
      )}
      {currentPos && (
        <MarkerF
          position={currentPos}
          icon={{
            url: "/truck.svg",
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20),
            rotation: bearing,
          }}
        />
      )}
      <PolylineF
        path={decodedPath}
        options={{ strokeColor: "#4f46e5", strokeOpacity: 0.8, strokeWeight: 6 }}
      />
    </GoogleMap>
  );
}

