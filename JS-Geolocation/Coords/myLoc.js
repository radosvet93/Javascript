var ourCoords = {
    latitude: 42.697510,
    longitude: 23.324150
};

window.onload = getMyLocation;
//when the browser is loaded get my location if it supported
function getMyLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(displayLocation, displayError)
    }else {       
        alert("Geolocation not supported");
    }
}

function displayLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
//displaying the position
    var div = document.getElementById("location");
    div.innerHTML = "Latitude: " + latitude + " longitude: " + longitude;
    div.innerHTML = " (with " + position.coords.accuracy + " meters accuracy)";
    var km = computeDistance(position.coords, ourCoords);
    var distance = document.getElementById("distance");
    distance.innerHTML = "You are " + km + " km from my birth place";

    showMap(position.coords);
}

function displayError(error) {
    var errorTypes = {
        0:"Unknown error",
        1:"Permission denied by user",
        2:"Position is not available",
        3:"Request timed out"
    };
    var errorMessage = errorTypes[error.code];
    if(error.code == 0 || error.code == 2){
        errorMessage = errorMessage + " " + error.message;
    }
    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    var Radius = 6371; // radius of the Earth in km
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
            Math.cos(startLatRads) * Math.cos(destLatRads) *
            Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degrees) {
    var radians = (degrees * Math.PI)/180;
    return radians;
}

var map;


function showMap(coords) {
    var googleLatAndLong = new google.maps.LatLng(coords.latitude,coords.longitude);

    var mapOptions = {
        zoom:10,
        center:googleLatAndLong,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);
    var title = "Your location";
    var content = "You are here: " + coords.latitude + ", " + coords.longitude;
    addMarker(map,googleLatAndLong,title,content);
}

function addMarker(map, latLong, title, content) {
    var markerOptions = {
        position:latLong,
        map:map,
        title:title,
        clickable:true
    };

    var marker = new google.maps.Marker(markerOptions);

    var infoWindowOptions = {
        content:content,
        position:latLong
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker,"click",function(){
        infoWindow.open(map);
    });
}
