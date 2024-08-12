const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true,
    }
  );
}
console.log(L);
const map = L.map("map").setView([0, 0], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreeMap",
}).addTo(map);
const markers = {};
socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnect", (id) => {
  console.log("user disconnected");
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
