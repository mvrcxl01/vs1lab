// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const geoTagStore = new GeoTagStore();
// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], latitude: undefined, longitude: undefined })
});


// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
    let radius= 10;
    if (req.query.search) {
      if(req.query.latitude && req.query.longitude) {
        res.json(geoTagStore.searchNearbyGeoTags(req.query.latitude, req.query.longitude, radius, req.query.search));
      }
        res.json(geoTagStore.getGeoTags().filter(geoTag => geoTag.name.includes(req.query.search) || geoTag.hashtag.includes(req.query.search)));
    }
    res.json(geoTagStore.getGeoTags());
  });

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
    let tempGT = new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag, geoTagStore.getNewID());
    geoTagStore.addGeoTag(tempGT);
    res.json(tempGT);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
    console.log(req.params.id);
    let tempGT = geoTagStore.getGeoTags().filter(geoTag => geoTag.id === Number(req.params.id));
        if (tempGT) {
        res.json(tempGT);
        }
        res.status(404).end();
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
    let tempGT = geoTagStore.getGeoTags().filter(geoTag => geoTag.id === Number(req.params.id));
    if (tempGT[0]) {
        tempGT[0].name = req.body.name;
        tempGT[0].latitude = req.body.latitude;
        tempGT[0].longitude = req.body.longitude;
        tempGT[0].hashtag = req.body.hashtag;
        res.json(tempGT[0]);
    }
    res.status(404).end();
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
    let tempGT = geoTagStore.getGeoTags().filter(geoTag => geoTag.id === Number(req.params.id));
    if (tempGT[0]) {
        geoTagStore.removeGeoTag(Number(req.params.id));
        res.json(tempGT[0]);
    }
    res.status(404).end();
});



/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', function(req, res)  {
  const radius = 10;
  geoTagStore.addGeoTag(new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag, geoTagStore.getNewID()));
  res.render('index', {taglist:geoTagStore.getNearbyGeoTags(req.body.latitude, req.body.longitude, radius), latitude: req.body.latitude, longitude: req.body.longitude});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', function(req, res) {
  const radius = 10;
  res.render('index', { taglist: geoTagStore.searchNearbyGeoTags(req.body.latitude, req.body.longitude, radius, req.body.search),latitude: req.body.latitude, longitude: req.body.longitude })
});

module.exports = router;
