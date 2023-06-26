// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...



/**
 * A class to help using the HTML5 Geolocation API.
 */


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    if(document.getElementById("latitude").value && document.getElementById("longitude").value
        && document.getElementById("latitudeSearch").value && document.getElementById("longitudeSearch").value)
    {
        document.getElementById("mapView").src= new MapManager().getMapUrl(document.getElementById("latitude").value,
            document.getElementById("longitude").value, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
        return;
    }
    LocationHelper.findLocation((location) => {
        document.getElementById("latitude").value = location.latitude;
        document.getElementById("longitude").value = location.longitude;
        document.getElementById("latitudeSearch").value= location.latitude;
        document.getElementById("longitudeSearch").value= location.longitude;
        document.getElementById("mapView").src = new MapManager().getMapUrl(location.latitude,
            location.longitude, JSON.parse(document.getElementById("mapView").getAttribute("data-tags")));
    });
}
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

function fetchGeoTags(){
    fetch('http://localhost:3000/api/geotags/?' + new URLSearchParams({
        'search': document.getElementById('search').value,
        'longitude': document.getElementById('longitude').value,
        'latitude': document.getElementById('latitude').value,
    }), {
        method: 'GET',
    })
        .then(res => res.json())
        .then(geoTags => {
            let list = document.getElementById("discoveryResults");
            list.innerHTML = "";
            for(let geoTag of geoTags){
                let entry = document.createElement('li');
                entry.appendChild(document.createTextNode(
                    geoTag.name + ' ('
                    + geoTag.latitude + ','
                    + geoTag.longitude + ') '
                    + geoTag.hashtag));
                list.appendChild(entry);
            }
            document.getElementById("mapView").setAttribute("src", new MapManager().getMapUrl(
                    document.getElementById('latitude').value,
                    document.getElementById('longitude').value,
                    geoTags));
        })
}

document.getElementById('addTag').addEventListener('click', function(e){
    e.preventDefault();
    if ((document.getElementById("hashtag").value.startsWith('#')&&document.getElementById("hashtag").value.length <=10)
        &&(document.getElementById("name").value.length<=10)){
        var geoTag = {};
        geoTag.name = document.getElementById("name").value;
        geoTag.latitude = document.getElementById("latitude").value;
        geoTag.longitude = document.getElementById("longitude").value;
        geoTag.hashtag = document.getElementById("hashtag").value;

        fetch('http://localhost:3000/api/geotags', {
            method: 'POST',
            body: JSON.stringify(geoTag),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(_ =>{
            fetchGeoTags();
        })
    }
});


document.getElementById('searchButton').addEventListener('click', function(e){
    e.preventDefault();
    fetchGeoTags();
});