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
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  $.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events?apikey=NtclOaEDxrje7WH09PLMkduQRMFWGKz8&locale=*",
    data: {
      latlong: latlon,
      classificationName: "techno, house, dance, electronic",
      radius: 50,
    },
    async: true,
    dataType: "json",
    success: function (json) {
      initMap(position, json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showError(error) {
  var x = document.getElementById("location");
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

function initMap(position, json) {
  var mapDiv = document.getElementById("map");
  var map = new google.maps.Map(mapDiv, {
    center: { lat: position.coords.latitude, lng: position.coords.longitude },
    zoom: 10,
  });

  for (var i = 0; i < json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }

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
      <p>${event.classifications[0].genre.name}</p>
      <p>Venue: ${event._embedded.venues[0].name}</p>
      <p>Date: ${event.dates.start.localDate}</p>
      <p><a href="#" >Save event <i class="far fa-heart"></i></a></p>
      <a href="${event.url}" target="_blank">Event Details</a>
      
      
    </div>`,
  });

  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });

  markers.push(marker);
}

getLocation();
