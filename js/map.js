/* ================================================================
   SCRIPT: map.js
   PAGE: contact_us.html
   AUTHOR: [Palesa Dikolane[]
   MODULE: WEDE5020 — Part 3

   WHAT THIS FILE DOES:
   Builds one interactive Leaflet.js map (open-source, no API key
   required) showing all six Makro branch locations as clickable
   markers with popups, alongside the existing embedded Google Maps.
   A dropdown lets the visitor jump straight to a branch, which
   flies the map to that marker and opens its popup automatically.

   NOTE ON COORDINATES: latitude/longitude values below are
   approximate (suitable for an academic project) — replace with
   exact coordinates if this site goes into real production use.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const mapContainer = document.getElementById('branchMap');
  if (!mapContainer || typeof L === 'undefined') return; // Leaflet not loaded / page without a map

  const branches = [
    { name: 'Makro Woodmead',     address: 'Woodmead Dr, Woodmead, Sandton',         lat: -26.0590, lng: 28.0896 },
    { name: 'Makro Centurion',    address: 'Old Johannesburg Rd, Centurion',         lat: -25.8664, lng: 28.1935 },
    { name: 'Makro Silver Lakes', address: 'Silver Lakes, Pretoria East',            lat: -25.7751, lng: 28.3499 },
    { name: 'Makro Mpumalanga',   address: 'Riverside Mall, Mbombela (Nelspruit)',   lat: -25.4744, lng: 30.9706 },
    { name: 'Makro Bloemfontein', address: 'Kenneth Kaunda Rd, Bloemfontein',        lat: -29.1186, lng: 26.2042 },
    { name: 'Makro Cape Gate',    address: 'Okavango Rd, Brackenfell, Cape Town',    lat: -33.8682, lng: 18.6494 }
  ];

  // Centre the map roughly in the middle of South Africa, zoomed out
  // far enough to show every branch from Cape Town to Mbombela
  const map = L.map('branchMap').setView([-28.5, 24.5], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Keep a reference to each marker so the dropdown can open its popup
  const markers = branches.map(function (branch) {
    const marker = L.marker([branch.lat, branch.lng]).addTo(map);
    marker.bindPopup('<strong>' + branch.name + '</strong><br>' + branch.address);
    return marker;
  });

  // Dropdown: jump to the selected branch and open its popup
  const branchSelect = document.getElementById('branchSelect');
  if (branchSelect) {
    branchSelect.addEventListener('change', function () {
      const index = branchSelect.value;
      if (index === '') return;

      const branch = branches[index];
      const marker = markers[index];

      map.flyTo([branch.lat, branch.lng], 13, { duration: 1.2 });
      marker.openPopup();
    });
  }

});
