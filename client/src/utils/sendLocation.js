import socket from "./socket";

export default function sendLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        // const { latitude, longitude } = position.coords;
        // console.log("Sending Location:", latitude, longitude);

        // // Send location data to backend via WebSocket
        // socket.emit("send-location", { latitude, longitude });
        const fakeLocation = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
        socket.emit("send-location", fakeLocation);
      },
      (error) => {
        console.error("Geolocation Error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
