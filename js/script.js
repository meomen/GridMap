var uiSettings = {
    gridToViewportLeastDiameterRatio: 0.6,
    LatOrigin: 20.95,
    LngOrigin: 105.765,
    scale: 54,
    size: 0.0025
};

function Grid(center, radius) {
    this.center = center;
    this.radius = radius;
}

Grid.realToSkylinesRatio = 1;
Grid.prototype.getBounds = function () {
    return this.rectangleBounds(0, 0, 1);
};
Grid.prototype.rectangleBounds = function (x, y, scale) {
    // var yStep = this.radius * 2 / scale;
    // var xStep = yStep;
    // var north = uiSettings.LatOrigin - this.radius + yStep * x;
    // var south = uiSettings.LatOrigin - this.radius + yStep * (x + 1);
    // var west = uiSettings.LngOrigin - this.radius * 2 + xStep * (y + 1);
    // var east = uiSettings.LngOrigin - this.radius * 2 + xStep * y;

    var north = uiSettings.LatOrigin + uiSettings.size * (x + 1);
    var south = uiSettings.LatOrigin + uiSettings.size * x;
    var east = uiSettings.LngOrigin + uiSettings.size * y;
    var west = uiSettings.LngOrigin + uiSettings.size * (y + 1);

    return new google.maps.LatLngBounds(
        new google.maps.LatLng(north, east),
        new google.maps.LatLng(south, west)
    );
};
Grid.prototype.createRectanglesBounds = function (scale) {
    var coords = [];
    for (var x = 0; x < scale; x++) {
        for (var y = 0; y < scale; y++) {
            coords.push(this.rectangleBounds(x, y, scale));
        }
    }
    return coords;
};

/**
 * @param {google.maps.Map} map
 * @constructor
 */
function GridOverlay(map) {
    this.map = map;
    this.elements = [];
    this.gridFixed = new URLSearchParams(window.location.search).get('fixed');
    this.previousGrid = null;
}

GridOverlay.prototype.computeRadius = function () {
    // return (this.map.getBounds().getNorthEast().lat() - this.map.getBounds().getSouthWest().lat()) * uiSettings.gridToViewportLeastDiameterRatio / 2
    return (105.9 - 105.765) /2
};
GridOverlay.prototype.redraw = function () {
    this.elements.forEach(function (element) {
        element.setMap(null);
    });
    this.elements = [];
    var grid = this.currentGrid();
    this.elements = this.createElements(grid);
    this.elements.forEach(function (element) {
        element.setMap(this.map);
    });
    this.previousGrid = grid;
};
GridOverlay.prototype.currentGrid = function () {
    if (this.gridFixed && this.previousGrid !== null) {
        return this.previousGrid;
    } else {
        return new Grid(this.map.center, this.computeRadius())
    }
};
GridOverlay.prototype.createElements = function (grid) {
    var rectanglesBounds = grid.createRectanglesBounds(uiSettings.scale);
    return rectanglesBounds.map(function (bounds) {
        return new google.maps.Rectangle({
            strokeColor: '#837c21',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#cccccc',
            fillOpacity: 0,
            bounds: bounds
        })
    })
};
GridOverlay.prototype.init = function () {

};

var map;
var gridOverlay;

function initMap() {
    var ufa = {
        coords: new google.maps.LatLng(21.0175, 105.8325)
    };
    var startingCoords = ufa.coords;
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {
                lat: startingCoords.lat(),
                lng: startingCoords.lng()
            },
            zoom: 12.75,
            mapId : '42036b35e2b13e35'
        }
    );
    setTimeout(function () {
        // map.addListener('zoom_changed', function () {
        //     gridOverlay.redraw();
        // });
        // map.addListener('center_changed', function () {
        //     gridOverlay.redraw();
        // });
        gridOverlay = new GridOverlay(map);
        gridOverlay.init();
        gridOverlay.redraw();
    }, 800);
}