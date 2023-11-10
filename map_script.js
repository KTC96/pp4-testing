var markers = [];

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    var x = document.getElementById("location");
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  // var x = document.getElementById("location");
  // x.innerHTML =
  //   "Latitude: " +
  //   position.coords.latitude +
  //   "<br>Longitude: " +
  //   position.coords.longitude;
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  $.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json",
    data: {
      apikey: "NtclOaEDxrje7WH09PLMkduQRMFWGKz8",
      latlong: latlon,
      classificationName:
        "electronic, techno, dance, house, tech house, garage, dnb, drum and bass, jungle",
    },
    async: true,
    dataType: "json",
    success: function (json) {
      console.log(json);
      var e = document.getElementById("events");
      // e.innerHTML = json.page.totalElements + " events found.";
      showEvents(json);
      initMap(position, json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

// function showEvents(json) {
//   for (var i = 0; i < json.page.size; i++) {
//     $("#events").append("<p>" + json._embedded.events[i].name + "</p>");
//   }
// }

function initMap(position, json) {
  var mapDiv = document.getElementById("map");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: position.coords.latitude, lng: position.coords.longitude },
    zoom: 10,
  });

  for (var i = 0; i < json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }

  // Fit the map's bounds to ensure all markers are visible
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  map.fitBounds(bounds);
}

function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      event._embedded.venues[0].location.latitude,
      event._embedded.venues[0].location.longitude
    ),
    map: map,
  });

  var infowindow = new google.maps.InfoWindow({
    content: `<div>
      <h2>${event.name}</h2>
      <p>${event.classifications[0].subGenre.name}</p>
      <p>Venue: ${event._embedded.venues[0].name}</p>
      <p>Date: ${event.dates.start.localDate}</p>
      <a href="${event.url}" target="_blank">Event Details</a>
    </div>`,
  });

  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });

  markers.push(marker);
}

getLocation();
