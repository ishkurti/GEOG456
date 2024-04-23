var map = L.map('map').setView([-1.7, -77.5], 7);

var OSM = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    minZoom: 1,
    maxZoom: 12,
    tms: false,
    attribution: 'GEOG456 Final Project by Ina Shkurti'
}).addTo(map).bringToBack();

var myTileLayer = L.tileLayer('./tiles/2001/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 12,
    tms: false
}).addTo(map);

function addTileLayer(year) {
    map.removeLayer(myTileLayer);
    var tileAddress = './tiles/' + year + '/{z}/{x}/{y}.png';
    myTileLayer = L.tileLayer(tileAddress, {
        minZoom: 1,
        maxZoom: 12,
        tms: false
    }).addTo(map);
    document.getElementById('year-text').textContent = year;
}

function mySlider(value) {
    addTileLayer(value);
}

var territories = {
    "Siona Cuyabeno": sionaCuyabeno,
    "Siekopai Aguarico": siekopaiAguarico,
    "Shuar Arutam": shuarArutam,
    "Waorani": waoraniTitulado,
    "Cofan Sinangoe": cofanSinangoe,
    "Cofan Bermejo": cofanBermejo,
    "Cofan Dureno": cofanDureno,
    "Cofan Duvuno": cofanDuvuno,
    "Reserva Cuyabeno": reservaCuyabeno,
    "Reserva Yasuní": reservaYasuni,
    "Zona Intangible Tagaeri-Taromenani": zonaITT
};

var territoryLayers = {};

function addTerritories() {
    Object.keys(territories).forEach(key => {
        // Convert the GeoJSON object to a Leaflet layer with a specific style
        var layer = L.geoJSON(territories[key], {
            style: function(feature) {
                return {
                    color: 'green', // Change as needed, sets the border color of the polygon
                    fillColor: 'green', // Change as needed, sets the fill color of the polygon
                    fillOpacity: 0, // Adjust for desired transparency (0 is fully transparent, 1 is fully opaque)
                    weight: 2 // Sets the thickness of the border
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.name);
            }
        });
        // Initially, do not add to map; just store it
        territoryLayers[key] = layer;
    });
}


addTerritories();

var customControl = L.control({position: 'topleft'});  // Changed from 'bottomright' to 'topleft'

customControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'custom-buttons');  // Ensure this class matches the one styled above
    Object.keys(territories).forEach(key => {
        var btn = L.DomUtil.create('button', 'territory-button', div);
        btn.innerHTML = key;
        btn.onclick = function() {
            toggleTerritory(key);
        };
    });
    return div;
};

customControl.addTo(map);


function toggleTerritory(key) {
    var layer = territoryLayers[key];
    if (map.hasLayer(layer)) {
        map.removeLayer(layer); // If layer is on, turn it off
    } else {
        Object.values(territoryLayers).forEach(l => map.removeLayer(l)); // Turn off all other layers
        map.addLayer(layer); // Turn on the selected layer
        map.fitBounds(layer.getBounds()); // Zoom to the layer's bounds
    }
}

addTerritories();
customControl.addTo(map);

// Remove the default zoom control
map.zoomControl.remove();

// Add a new zoom control at the top right
L.control.zoom({
    position: 'topright'
}).addTo(map);

L.control.scale({ 
    position: 'bottomright', 
    metric: true,
    imperial: false,
  }).addTo(map);