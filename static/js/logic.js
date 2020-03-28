
// Store our API endpoint inside queryUrl
//var urlEarthquakes = "data/data.geojson";
var urlEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Perform a GET request to the query URL
d3.json(urlEarthquakes, function(data) {
    
    var earthquakes = data.features
    //console.log(earthquakes);

    //Create a marker for each earthquake location
    var locations = [];

    for (var i = 0; i < earthquakes.length; i++) {
        coordinates = [earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]]
        magnitude = earthquakes[i].properties.mag
        var color = "";
        if (magnitude < 1) color = "#1dfa00";
            else if (magnitude < 2) color = "#fafa00";
            else if (magnitude < 3) color = "#faed00";
            else if (magnitude < 4) color = "#facc00";
            else if (magnitude < 5) color = "#faa300";
            else if (magnitude >= 5) color = "#fa5300";
        ;
        locations.push(
            L.circleMarker(coordinates, {
                stroke: false,
                fillOpacity: 0.6,
                color: color,
                fillColor: color,
                radius: magnitude ** 2
            }).bindPopup("<h4>Magnitude " + earthquakes[i].properties.mag + 
                "<br>" + earthquakes[i].properties.place + "</br>" +
                "</h4><hr><p>" + new Date(earthquakes[i].properties.time) + "</p>")
            
        );
    }

    //Add locations to a new layer group
    earthquakeLayer = L.layerGroup(locations);

    //Create tile layers
    // Define streetmap layer
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

    // Define 2nd satellite layer
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    // Define another 3rd base layer
    var pirateMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
    "Default View": streetMap,
    "Satellite": satMap,
    "For Pirates Only": pirateMap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
    "Earthquakes": earthquakeLayer,
    };

    // Create initial map, to display on load
    var myMap = L.map("map", {
    center: [20, 0],
    zoom: 2,
    layers: [streetMap, earthquakeLayer]
    });

    // Create a layer control, pass in our baseMaps and overlayMaps, add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend & add to map (I had to google this part)
    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

    function displayLegend(){
        var legendInfo = [{
        limit: "Mag: 0-1",
        color: "#1dfa00"
        },{
        limit: "Mag: 1-2",
        color: "#fafa00"
        },{
        limit:"Mag: 2-3",
        color:"#faed00"
        },{
        limit:"Mag: 3-4",
        color:"#facc00"
        },{
        limit:"Mag: 4-5",
        color:"#faa300"
        },{
        limit:"Mag: 5+",
        color:"#fa5300"
        }];

        var header = "<h3>Magnitude</h3><hr>";

        var strng = "";
   
        for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
        }
    
        return header+strng;
    }

});
