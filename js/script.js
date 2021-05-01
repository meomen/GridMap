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
    return (105.9 - 105.765) /2
};
GridOverlay.prototype.redraw = function () {
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
function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#3498db";
    controlUI.style.border = "2px solid #3498db";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    var controlText = document.createElement("div");
    controlText.style.color = "rgb(255,255,255)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Grid Map";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        gridOverlay.clickGridMap(controlUI,controlText);
    });
}

GridOverlay.prototype.clickGridMap = function (controlUI,controlText) {
    if(this.elements == null) {
        this.redraw();
        controlUI.style.backgroundColor = "#3498db";
        controlUI.style.border = "2px solid #3498db";
        controlText.style.color = "rgb(255,255,255)";
    }
    else {
        this.elements.forEach(function (element) {
            element.setMap(null);
        });
        this.elements = null;
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlText.style.color = "rgb(25,25,25)";
    }
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
        const centerControlDiv = document.createElement("div");
        CenterControl(centerControlDiv, map);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
        gridOverlay = new GridOverlay(map);
        gridOverlay.init();
        gridOverlay.redraw();
    }, 800);
}