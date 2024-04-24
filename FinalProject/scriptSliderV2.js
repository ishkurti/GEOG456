var map = L.map('map').setView([-1.7, -77.5], 7);

var OSM = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    minZoom: 1,
    maxZoom: 12,
    tms: false,
    attribution: 'GEOG456 Final Project by Ina Shkurti'
}).addTo(map).bringToBack();

var myTileLayer = L.tileLayer('https://cartocollective.blob.core.windows.net/deforestation/2001/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 12,
    tms: false
}).addTo(map);

function addTileLayer(year) {
    map.removeLayer(myTileLayer);
    var tileAddress = 'https://cartocollective.blob.core.windows.net/deforestation/' + year + '/{z}/{x}/{y}.png';
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
    "Siona Cuyabeno": {
        data: sionaCuyabeno,
        center: [-0.1, -76.0], // Example coordinates
        zoom: 10, // Example zoom level
        label: "Siona Cuyabeno Territory"
    },
    "Siekopai Aguarico": {  
        data: siekopaiAguarico,
        center: [-0.33052,-76.21940], 
        zoom: 11,
        label: "Siekopai Aguarico Territory"
    },
    "Waorani": {
        data: waoraniTitulado,
        center: [-1.1434,-76.3953],
        zoom: 9,
        label: "Waorani Territory"
    },
    "Cofan Sinangoe": {
        data: cofanSinangoe,
        center: [0.1,-77.2786],
        zoom: 10,
        label: "Cofan Sinangoe Territory"
    },
    "Cofan Bermejo": {
        data: cofanBermejo,
        center: [0.3,-77.19118],
        zoom: 11,
        label: "Cofan Bermejo Territory"
    },
    "Cofan Dureno": {
        data: cofanDureno,
        center: [0.005,-76.65],
        zoom: 12,
        label: "Cofan Dureno Territory"
    },
    "Cofan Duvuno": {
        data: cofanDuvuno,
        center: [0.00696,-77.01630],
        zoom: 11,
        label: "Cofan Duvuno Territory"
    },
    "Shuar Arutam": {
        data: shuarArutam,
        center: [-3.25,-77.9541],
        zoom: 10,
        label: "Shuar Arutam Territory"
    },
    "Indigenous Territories (RAISG)": {
        data: territoriosRAISG,
        center: [-1.7, -77.5], // Example coordinates
        zoom: 7, // Example zoom level
        label: "Indigenous Territories (RAISG)"
    },
    // "Zona Intangible Tagaeri-Taromenani": {
    //     data: zonaITT,
    //     center: [-1.35103,-75.7],
    //     zoom: 9,
    //     label: "Zona Intangible Tagaeri-Taromenani"
    // }
};

var territoryLayers = {};

function addTerritories() {
    Object.keys(territories).forEach(key => {
        var territory = territories[key];
        var layer = L.geoJSON(territory.data, {
            style: function(feature) {
                return {
                    color: 'green',
                    fillColor: 'green',
                    fillOpacity: 0,
                    weight: 2
                };
            }
        });
        // Store the layer within the same territory object for easy reference
        territory.layer = layer;
    });
}
addTerritories();

var customControl = L.control({position: 'topleft'});

customControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'custom-buttons');
    
    // Create the reset button with a specific class for styling
    var resetBtn = L.DomUtil.create('button', 'territory-button reset-view-button', div);
    resetBtn.innerHTML = "Reset View";
    resetBtn.onclick = function() {
        Object.values(territories).forEach(t => {
            if (map.hasLayer(t.layer)) {
                map.removeLayer(t.layer);  // Turn off all territory layers
            }
        });
        map.setView([-1.7, -77.5], 7);  // Resetting to the initial view
    };

    // Add buttons for each territory
    Object.keys(territories).forEach(key => {
        var btn = L.DomUtil.create('button', 'territory-button', div);
        btn.innerHTML = key;
        btn.onclick = function() {
            toggleTileLayer(key);
        };
    });
    
    return div;
};
customControl.addTo(map);


function toggleTileLayer(territoryName) {
    var territory = territories[territoryName];
    if (!territory) {
        console.error("Territory not found:", territoryName);
        return; // Stop execution if the territory is not found
    }

    map.closePopup(); // Close any open popups
    Object.values(territories).forEach(t => {
        if (map.hasLayer(t.layer)) {
            map.removeLayer(t.layer); // Remove all other layers
        }
    });

    map.addLayer(territory.layer); // Add the required layer
    map.setView(territory.center, territory.zoom); // Set view to center and zoom without animation
    var popup = L.popup()
        .setLatLng(territory.center)
        .setContent(territory.label)
        .openOn(map);
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
    position: 'bottomleft', 
    metric: true,
    imperial: false,
  }).addTo(map);