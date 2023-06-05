// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

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
        document.getElementById("mapView").src= new mapManager.getUrl(document.getElementById(("latitude"),
            document.getElementById("longitude"), JSON.parse(document.getElementById("mapView").getAttribute("data-tags"))))
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