const socket = io();

// Function to handle geolocation updates
function sendLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        // const { latitude, longitude } = position.coords;
        // console.log("Current Location:", latitude, longitude);

        // // Emit location to server
        // socket.emit("send-location", { latitude, longitude });
        const fakeLocation = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
        socket.emit("send-location", fakeLocation);
      },
      (error) => {
        console.log("Geolocation Error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Initialize map
const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markers = {};

// Receive location updates from server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log("Received Location:", latitude, longitude);

  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    if (id === socket.id) {
      map.setView([latitude, longitude], 16); // Center only for the current user
    }
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }
});

// Remove user marker when they disconnect
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// Start sending location
sendLocation();
