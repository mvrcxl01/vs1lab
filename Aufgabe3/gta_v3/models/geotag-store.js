// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geoTags = [];
    constructor(){
        GeoTagExamples.tagList.forEach(geoTag => this.addGeoTag(geoTag));
        console.log(this.#geoTags)
    }

    addGeoTag(geoTag){
        this.#geoTags.push(geoTag);
    }

    removeGeoTag(name){
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        return this.#geoTags.filter(geoTag => ((Math.sqrt(Math.abs(geoTag.longitude - longitude) ** 2 + Math.abs(geoTag.latitude - latitude) ** 2)) <= radius));
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(geoTag => geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword));
    }
}

module.exports = InMemoryGeoTagStore
