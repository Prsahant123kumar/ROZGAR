const socket=io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current Location:", latitude, longitude); // Debugging
        socket.emit("send-location", { latitude, longitude });
      },
      (error) => {
        console.log("Geolocation Error:", error); // Debugging
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


const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log("Received Location:", latitude, longitude); // Debugging

  // Update the map view to the received location
  map.setView([latitude, longitude], 16);

  // Update or add a marker for the user
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});