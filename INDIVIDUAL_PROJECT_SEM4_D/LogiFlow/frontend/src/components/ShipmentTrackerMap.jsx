// import React, { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';

// export default function ShipmentTrackerMap({ shipment }) {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     });

//     const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

//     // Decode the polyline from the backend to get an array of lat/lng points
//     const decodedPath = useMemo(() => {
//         if (!shipment.route_polyline) return [];
//         try {
//             const decoded = polyline.decode(shipment.route_polyline);
//             return decoded.map(point => ({ lat: point[0], lng: point[1] }));
//         } catch (error) {
//             console.error("Failed to decode polyline:", error);
//             return [];
//         }
//     }, [shipment.route_polyline]);

//     // Simulate real-time movement by stepping through the decoded path
//     useEffect(() => {
//         if (decodedPath.length <= 1 || shipment.status === 'Delivered') return;

//         const interval = setInterval(() => {
//             setCurrentPositionIndex(prev => {
//                 if (prev >= decodedPath.length - 1) {
//                     clearInterval(interval);
//                     // In a real app, you might update the shipment status to 'Delivered' here
//                     return prev;
//                 }
//                 return prev + 1;
//             });
//         }, 5000); // Update every 5 seconds

//         return () => clearInterval(interval);
//     }, [decodedPath, shipment.status]);

//     const mapCenter = useMemo(() => ({
//         lat: shipment.start_location_lat || 0,
//         lng: shipment.start_location_lng || 0,
//     }), [shipment]);

//     if (!isLoaded) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Loading Map...</div>;
//     if (!shipment.start_location_lat) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Shipment location data not available.</div>;

//     const truckLocation = decodedPath[currentPositionIndex] || mapCenter;

//     return (
//         <GoogleMap 
//             zoom={12} 
//             center={mapCenter} 
//             mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
//             options={{
//                 disableDefaultUI: true,
//                 zoomControl: true,
//             }}
//         >
//             {/* Start and End Markers */}
//             <MarkerF position={{ lat: shipment.start_location_lat, lng: shipment.start_location_lng }} label="A" />
//             <MarkerF position={{ lat: shipment.end_location_lat, lng: shipment.end_location_lng }} label="B" />
            
//             {/* Moving Truck Marker */}
//             <MarkerF 
//                 position={truckLocation} 
//                 icon={{
//                     url: '/truck.svg',
//                     scaledSize: new window.google.maps.Size(40, 40),
//                     anchor: new window.google.maps.Point(20, 20),
//                 }}
//             />
            
//             {/* Route Polyline */}
//             <PolylineF 
//                 path={decodedPath} 
//                 options={{ 
//                     strokeColor: '#4f46e5',
//                     strokeOpacity: 0.8,
//                     strokeWeight: 6,
//                 }} 
//             />
//         </GoogleMap>
//     );
// }








// Till here-----------------------------------------------------------



// import React, { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';

// // The onDeliveryComplete function is passed down from the parent page
// export default function ShipmentTrackerMap({ shipment, onDeliveryComplete }) {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     });

//     const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

//     const decodedPath = useMemo(() => {
//         if (!shipment.route_polyline) return [];
//         try {
//             const decoded = polyline.decode(shipment.route_polyline);
//             return decoded.map(point => ({ lat: point[0], lng: point[1] }));
//         } catch (error) {
//             console.error("Failed to decode polyline:", error);
//             return [];
//         }
//     }, [shipment.route_polyline]);

//     useEffect(() => {
//         if (decodedPath.length <= 1 || shipment.status === 'Delivered') {
//             // If already delivered, set truck to final position
//             if (shipment.status === 'Delivered') {
//                 setCurrentPositionIndex(decodedPath.length - 1);
//             }
//             return;
//         }

//         const interval = setInterval(() => {
//             setCurrentPositionIndex(prev => {
//                 const nextIndex = prev + 1;
//                 // Check if the truck has reached the destination
//                 if (nextIndex >= decodedPath.length - 1) {
//                     clearInterval(interval);
//                     // Call the function to update status on the backend
//                     onDeliveryComplete();
//                     return decodedPath.length - 1; // Stay at the last point
//                 }
//                 return nextIndex;
//             });
//         }, 2000); // Shortened to 2 seconds for easier testing

//         return () => clearInterval(interval);
//     }, [decodedPath, shipment.status, onDeliveryComplete]);

//     const mapCenter = useMemo(() => ({
//         lat: shipment.start_location_lat || 0,
//         lng: shipment.start_location_lng || 0,
//     }), [shipment]);

//     if (!isLoaded) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Loading Map...</div>;

//     const truckLocation = decodedPath[currentPositionIndex] || mapCenter;

//     return (
//         <GoogleMap zoom={12} center={mapCenter} mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}>
//             <MarkerF position={{ lat: shipment.start_location_lat, lng: shipment.start_location_lng }} label="A" />
//             <MarkerF position={{ lat: shipment.end_location_lat, lng: shipment.end_location_lng }} label="B" />
//             <MarkerF 
//                 position={truckLocation} 
//                 icon={{
//                     url: '/truck.svg',
//                     scaledSize: new window.google.maps.Size(40, 40),
//                     anchor: new window.google.maps.Point(20, 20),
//                 }}
//             />
//             <PolylineF 
//                 path={decodedPath} 
//                 options={{ strokeColor: '#4f46e5', strokeOpacity: 0.8, strokeWeight: 6 }} 
//             />
//         </GoogleMap>
//     );
// }




// --------------------This ddsdsdsd-------------------------------------------

// import React, { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';

// export default function ShipmentTrackerMap({ shipment, onDeliveryComplete }) {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     });

//     const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

//     const decodedPath = useMemo(() => {
//         if (!shipment.route_polyline) {
//             return [];
//         }
//         try {
//             const decoded = polyline.decode(shipment.route_polyline);
//             return decoded.map(point => ({ lat: point[0], lng: point[1] }));
//         } catch (error) {
//             console.error("Failed to decode polyline:", error);
//             return [];
//         }
//     }, [shipment.route_polyline]);

//     useEffect(() => {
//         if (decodedPath.length <= 1 || shipment.status === 'Delivered') {
//             if (shipment.status === 'Delivered') {
//                 setCurrentPositionIndex(decodedPath.length - 1);
//             }
//             return;
//         }

//         const interval = setInterval(() => {
//             setCurrentPositionIndex(prev => {
//                 const nextIndex = prev + 1;
//                 if (nextIndex >= decodedPath.length - 1) {
//                     clearInterval(interval);
//                     onDeliveryComplete();
//                     return decodedPath.length - 1;
//                 }
//                 return nextIndex;
//             });
//         }, 2000); // 2 seconds for testing

//         return () => clearInterval(interval);
//     }, [decodedPath, shipment.status, onDeliveryComplete]);

//     const mapCenter = useMemo(() => ({
//         lat: shipment.start_location_lat || 0,
//         lng: shipment.start_location_lng || 0,
//     }), [shipment]);

//     if (!isLoaded) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Loading Map...</div>;

//     const truckLocation = decodedPath[currentPositionIndex] || mapCenter;

//     return (
//         <GoogleMap 
//             zoom={12} 
//             center={mapCenter} 
//             mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
//             options={{ disableDefaultUI: true, zoomControl: true }}
//         >
//             <MarkerF position={{ lat: shipment.start_location_lat, lng: shipment.start_location_lng }} label="A" />
//             <MarkerF position={{ lat: shipment.end_location_lat, lng: shipment.end_location_lng }} label="B" />
//             <MarkerF 
//                 position={truckLocation} 
//                 icon={{ url: '/truck.svg', scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 20) }}
//             />
//             <PolylineF 
//                 path={decodedPath} 
//                 options={{ strokeColor: '#4f46e5', strokeOpacity: 0.8, strokeWeight: 6 }} 
//             />
//         </GoogleMap>
//     );
// }









//latest start here-----------------------------------------------------------------------







// import React, { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';

// export default function ShipmentTrackerMap({ shipment, onDeliveryComplete }) {
//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     });

//     const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

//     const decodedPath = useMemo(() => {
//         if (!shipment.route_polyline) {
//             return [];
//         }
//         try {
//             const decoded = polyline.decode(shipment.route_polyline);
//             return decoded.map(point => ({ lat: point[0], lng: point[1] }));
//         } catch (error) {
//             console.error("Failed to decode polyline:", error);
//             return [];
//         }
//     }, [shipment.route_polyline]);

//     useEffect(() => {
//         if (decodedPath.length <= 1 || shipment.status === 'Delivered') {
//             if (shipment.status === 'Delivered') {
//                 setCurrentPositionIndex(decodedPath.length - 1);
//             }
//             return;
//         }

//         const interval = setInterval(() => {
//             setCurrentPositionIndex(prev => {
//                 const nextIndex = prev + 1;
//                 if (nextIndex >= decodedPath.length - 1) {
//                     clearInterval(interval);
//                     onDeliveryComplete();
//                     return decodedPath.length - 1;
//                 }
//                 return nextIndex;
//             });
//         }, 2000); // 2 seconds for testing

//         return () => clearInterval(interval);
//     }, [decodedPath, shipment.status, onDeliveryComplete]);

//     const mapCenter = useMemo(() => ({
//         lat: shipment.start_location_lat || 0,
//         lng: shipment.start_location_lng || 0,
//     }), [shipment]);

//     if (!isLoaded) return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>Loading Map...</div>;

//     const truckLocation = decodedPath[currentPositionIndex] || mapCenter;

//     return (
//         <GoogleMap 
//             zoom={12} 
//             center={mapCenter} 
//             mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
//             options={{ disableDefaultUI: true, zoomControl: true }}
//         >
//             <MarkerF position={{ lat: shipment.start_location_lat, lng: shipment.start_location_lng }} label="A" />
//             <MarkerF position={{ lat: shipment.end_location_lat, lng: shipment.end_location_lng }} label="B" />
            
//             {/* --- THIS IS THE FIX --- */}
//             {/* Adding a unique key forces React to re-render the marker when its position changes */}
//             <MarkerF 
//                 key={`${truckLocation.lat}-${truckLocation.lng}`}
//                 position={truckLocation} 
//                 icon={{ url: '/truck.svg', scaledSize: new window.google.maps.Size(40, 40), anchor: new window.google.maps.Point(20, 20) }}
//             />
            
//             <PolylineF 
//                 path={decodedPath} 
//                 options={{ strokeColor: '#4f46e5', strokeOpacity: 0.8, strokeWeight: 6 }} 
//             />
//         </GoogleMap>
//     );
// }


// latest till here--------------------------------------------------------





// start lates here-----------------------------------------------------

// ShipmentTrackerMap.jsx
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';

// export default function ShipmentTrackerMap({ shipment, onDeliveryStatusChange }) {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });

//   const [currentPos, setCurrentPos] = useState(null);
//   const [segmentIndex, setSegmentIndex] = useState(0);
//   const [progress, setProgress] = useState(0); // between 0 and 1 for interpolation
//   const mapRef = useRef(null);
//   const firstRender = useRef(true);

//   const decodedPath = useMemo(() => {
//     if (!shipment.route_polyline) return [];
//     try {
//       const decoded = polyline.decode(shipment.route_polyline);
//       return decoded.map(([lat, lng]) => ({ lat, lng }));
//     } catch (err) {
//       console.error("Failed to decode polyline:", err);
//       return [];
//     }
//   }, [shipment.route_polyline]);

//   // Get interpolated position between two lat/lng points
//   const interpolatePos = (start, end, factor) => ({
//     lat: start.lat + (end.lat - start.lat) * factor,
//     lng: start.lng + (end.lng - start.lng) * factor
//   });

//   // Handle truck movement
//   useEffect(() => {
//     if (decodedPath.length < 2 || shipment.status === 'Delivered') {
//       if (shipment.status === 'Delivered') {
//         setCurrentPos(decodedPath[decodedPath.length - 1]);
//       }
//       return;
//     }

//     const moveTruck = () => {
//       setProgress(prev => {
//         const newProgress = prev + 0.02; // movement speed
//         if (newProgress >= 1) {
//           setSegmentIndex(prevSeg => {
//             const nextSeg = prevSeg + 1;

//             // Update status based on progress
//             if (nextSeg === 1) onDeliveryStatusChange("In Transit");
//             if (nextSeg === Math.floor(decodedPath.length * 0.7)) onDeliveryStatusChange("Out for Delivery");
//             if (nextSeg >= decodedPath.length - 1) {
//               onDeliveryStatusChange("Delivered");
//               return prevSeg;
//             }

//             return nextSeg;
//           });
//           return 0;
//         }
//         return newProgress;
//       });
//     };

//     const interval = setInterval(moveTruck, 100); // smooth updates every 100ms
//     return () => clearInterval(interval);

//   }, [decodedPath, shipment.status, onDeliveryStatusChange]);

//   // Calculate current truck position based on interpolation
//   useEffect(() => {
//     if (decodedPath.length < 2) return;
//     const start = decodedPath[segmentIndex];
//     const end = decodedPath[segmentIndex + 1] || start;
//     setCurrentPos(interpolatePos(start, end, progress));
//   }, [segmentIndex, progress, decodedPath]);

//   // Keep map reference
//   const onLoadMap = (map) => {
//     mapRef.current = map;
//     if (firstRender.current && decodedPath.length > 0) {
//       map.fitBounds({
//         north: Math.max(...decodedPath.map(p => p.lat)),
//         south: Math.min(...decodedPath.map(p => p.lat)),
//         east: Math.max(...decodedPath.map(p => p.lng)),
//         west: Math.min(...decodedPath.map(p => p.lng)),
//       });
//       firstRender.current = false;
//     }
//   };

//   if (!isLoaded) {
//     return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Loading Map...</div>;
//   }

//   return (
//     <GoogleMap
//       zoom={12}
//       center={currentPos || decodedPath[0] || { lat: 0, lng: 0 }}
//       onLoad={onLoadMap}
//       mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
//       options={{
//         disableDefaultUI: true,
//         zoomControl: true,
//         gestureHandling: 'greedy',
//       }}
//     >
//       {/* Start & End Markers */}
//       <MarkerF position={decodedPath[0]} label="A" />
//       <MarkerF position={decodedPath[decodedPath.length - 1]} label="B" />

// {/* */}

// {/* */}
//       {/* Truck Marker */}
//       {currentPos && (
//         <MarkerF
//           position={currentPos}
//           icon={{
//             url:"https://maps.google.com/mapfiles/kml/shapes/truck.png", // Google Maps built-in truck icon',
//             scaledSize: new window.google.maps.Size(40, 40),
//             anchor: new window.google.maps.Point(20, 20),
//           }}
//         />
//       )}

//       {/* Route Path */}
//       <PolylineF
//         path={decodedPath}
//         options={{
//           strokeColor: '#4f46e5',
//           strokeOpacity: 0.8,
//           strokeWeight: 6,
//         }}
//       />
//     </GoogleMap>
//   );
// }


// still here latest---------------------------------











import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF, PolylineF } from '@react-google-maps/api';
import polyline from '@mapbox/polyline';

export default function ShipmentTrackerMap({ shipment, onDeliveryStatusChange }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [currentPos, setCurrentPos] = useState(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bearing, setBearing] = useState(0);
  const mapRef = useRef(null);
  const firstRender = useRef(true);

  const decodedPath = useMemo(() => {
    if (!shipment.route_polyline) return [];
    try {
      const decoded = polyline.decode(shipment.route_polyline);
      return decoded.map(([lat, lng]) => ({ lat, lng }));
    } catch (err) {
      console.error("Failed to decode polyline:", err);
      return [];
    }
  }, [shipment.route_polyline]);

  // Calculate bearing between two coordinates
  const getBearing = (start, end) => {
    if (!start || !end) return 0;
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x =
      Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  // Interpolate between two points
  const interpolatePos = (start, end, factor) => ({
    lat: start.lat + (end.lat - start.lat) * factor,
    lng: start.lng + (end.lng - start.lng) * factor,
  });

  // Move the truck
  useEffect(() => {
    if (decodedPath.length < 2 || shipment.status === "Delivered") {
      if (shipment.status === "Delivered") {
        setCurrentPos(decodedPath[decodedPath.length - 1]);
      }
      return;
    }

    const moveTruck = () => {
      setProgress((prev) => {
        const newProgress = prev + 0.02;
        if (newProgress >= 1) {
          setSegmentIndex((prevSeg) => {
            const nextSeg = prevSeg + 1;

            if (nextSeg === 1) onDeliveryStatusChange("In Transit");
            if (nextSeg === Math.floor(decodedPath.length * 0.7))
              onDeliveryStatusChange("Out for Delivery");
            if (nextSeg >= decodedPath.length - 1) {
              onDeliveryStatusChange("Delivered");
              return prevSeg;
            }
            return nextSeg;
          });
          return 0;
        }
        return newProgress;
      });
    };

    const interval = setInterval(moveTruck, 100);
    return () => clearInterval(interval);
  }, [decodedPath, shipment.status, onDeliveryStatusChange]);

  // Update current position & bearing
  useEffect(() => {
    if (decodedPath.length < 2) return;
    const start = decodedPath[segmentIndex];
    const end = decodedPath[segmentIndex + 1] || start;
    setCurrentPos(interpolatePos(start, end, progress));
    setBearing(getBearing(start, end));
  }, [segmentIndex, progress, decodedPath]);

  const onLoadMap = (map) => {
    mapRef.current = map;
    if (firstRender.current && decodedPath.length > 0) {
      map.fitBounds({
        north: Math.max(...decodedPath.map((p) => p.lat)),
        south: Math.min(...decodedPath.map((p) => p.lat)),
        east: Math.max(...decodedPath.map((p) => p.lng)),
        west: Math.min(...decodedPath.map((p) => p.lng)),
      });
      firstRender.current = false;
    }
  };

  if (!isLoaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={12}
      center={currentPos || decodedPath[0] || { lat: 0, lng: 0 }}
      onLoad={onLoadMap}
      mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "8px" }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
      }}
    >
      {/* Start & End markers */}
      <MarkerF position={decodedPath[0]} label="A" />
      <MarkerF position={decodedPath[decodedPath.length - 1]} label="B" />

      {/* Rotating Truck Marker */}
      {currentPos && (
        <MarkerF
          position={currentPos}
          icon={{
            // path: "M 0 -1 L 1 -1 L 1 1 L -1 1 z", // placeholder shape
            // url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
            url:"/truck-front.svg",
            scaledSize: new window.google.maps.Size(50, 50),
            anchor: new window.google.maps.Point(25, 25),
            rotation: bearing,
          }}
        />
      )}

      {/* Route path */}
      <PolylineF
        path={decodedPath}
        options={{
          strokeColor: "#4f46e5",
          strokeOpacity: 0.8,
          strokeWeight: 6,
        }}
      />
    </GoogleMap>
  );
}
