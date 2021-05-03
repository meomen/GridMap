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
    return (105.9 - 105.765) / 2
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
        gridOverlay.clickGridMap(controlUI, controlText);
    });
}

GridOverlay.prototype.clickGridMap = function (controlUI, controlText) {
    if (this.elements == null) {
        this.redraw();
        controlUI.style.backgroundColor = "#3498db";
        controlUI.style.border = "2px solid #3498db";
        controlText.style.color = "rgb(255,255,255)";
    } else {
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
var polylineOverlay;
var markeroverlay;

function PolylineOverlay(map) {
    this.map = map;
    this.elements = [];
}

function MarkerOverlay(map) {
    this.map = map;
    this.elements = [];
}

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
            mapId: '42036b35e2b13e35'
        }
    );
    setTimeout(function () {
        const centerControlDiv = document.createElement("div");
        CenterControl(centerControlDiv, map);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
        gridOverlay = new GridOverlay(map);
        polylineOverlay = new PolylineOverlay(map);
        markeroverlay = new MarkerOverlay(map);
        gridOverlay.init();
        gridOverlay.redraw();
    }, 800);
}

/*
 Tag 1
 */


var input_account1 = document.getElementById("input_account_1");
var btn_search1 = document.getElementById("btn_search1");
var select_type_input_1 = document.getElementById("select_type_input_1");
var check_all = document.getElementById("input_checkbox");
var date_picker = document.getElementById("input_date");
var btn_origin = document.getElementById("btn_origin");
var btn_grid = document.getElementById("btn_grid");
var tv_result_1 = document.getElementById("tv_result_1");
var getAllDate = true;

check_all.addEventListener("click", function () {
    if (this.checked) {
        date_picker.disabled = true;
        getAllDate = true;
        if (input_account1.value == "") {
            btn_search1.disabled = true;
        } else {
            btn_search1.disabled = false;
        }
    } else {
        date_picker.disabled = false;
        getAllDate = false;
        if (date_picker.value != "" && input_account1.value != "") {
            btn_search1.disabled = false;
        } else {
            btn_search1.disabled = true;
        }
    }
})

input_account1.addEventListener("keyup", function () {
    if (getAllDate) {
        btn_search1.disabled = false;
    } else if (date_picker.value == "") {
        btn_search1.disabled = true;
    }
    if (input_account1.value == "") {
        btn_search1.disabled = true;
    }
})
date_picker.addEventListener("change", function () {
    if (input_account1.value == "") {
        btn_search1.disabled = true
    } else {
        btn_search1.disabled = false;
    }
})
btn_origin.addEventListener("click", function () {
    btn_grid.checked = false;
})
btn_grid.addEventListener("click", function () {
    btn_origin.checked = false;
})

btn_search1.addEventListener("click", function () {

    var type_input = select_type_input_1.value;


    if (getAllDate && btn_origin.checked) {
        getTripAll(type_input, input_account1.value);
        tv_result_1.value = "";
    } else if (!getAllDate && btn_origin.checked) {
        getTripDate(type_input, input_account1.value, date_picker.value);
        tv_result_1.value = "";
    } else if (getAllDate && btn_grid.checked) {
        getGridAll(type_input, input_account1.value);
    } else {
        getGridDate(type_input, input_account1.value, date_picker.value);
    }
})
/*
 Tag 2
 */
var input_account2 = document.getElementById("input_account_2");
var btn_search2 = document.getElementById("btn_search2");
var select_type_input_2 = document.getElementById("select_type_input_2");
var input_min_sup = document.getElementById("input_min_sup");
var input_min_length = document.getElementById("input_min_length");
var tv_runtime_2 = document.getElementById("tv_runtime_2");
var tv_result_2 = document.getElementById("tv_result_2");

input_account2.addEventListener("keyup", function () {
    validate_input();
})
input_min_sup.addEventListener("keyup", function () {
    validate_input();
})
input_min_length.addEventListener("keyup", function () {
    validate_input();
})

function validate_input() {
    if (input_account2.value == "" ||
        input_min_length.value == "" ||
        input_min_sup.value == "") {
        btn_search2.disabled = true;
    } else {
        btn_search2.disabled = false;
    }
}

btn_search2.addEventListener("click", function () {
    var type_input = select_type_input_2.value;
    findFrequentRoute(type_input, input_account2.value, input_min_sup.value, input_min_length.value);
})

/*
 Call API Draw Trip
 */
function getTripAll(type_search, account_id) {
    let url = new URL('http://localhost:8081/grid_map/trip/all')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id
    })
    sendRequest(url, false)
}

function getTripDate(type_search, account_id, date) {
    let url = new URL('http://localhost:8081/grid_map/trip/date')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id,
        date: date
    })

    sendRequest(url, false)
}


function drawRouteTrip(myJSON) {
    var listTrip = [];
    for (var i = 0; i < myJSON.length; i++) {
        var trip = [];
        for (var j = 0; j < myJSON[i].length; j++) {
            var point = myJSON[i][j];
            trip.push(new google.maps.LatLng(point.latitude, point.longitude));
        }
        var flightPath = new google.maps.Polyline({
            path: trip,
            geodesic: true,
            strokeColor: '#e74c3c',
            strokeOpacity: 0.3,
            strokeWeight: 5
        });
        flightPath.setMap(map);
        listTrip.push(flightPath);
        drawMarker("origin", "Origin Route " + i, myJSON[i][0].latitude, myJSON[i][0].longitude);
        drawMarker("destination", "Destination Route " + i, myJSON[i][myJSON[i].length - 1].latitude, myJSON[i][myJSON[i].length - 1].longitude);

    }
    polylineOverlay.elements = listTrip;
}

/*
 Call API Draw Grid
 */
function getGridAll(type_search, account_id) {
    let url = new URL('http://localhost:8081/grid_map/grid/all')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id
    })
    sendRequest(url, true)
}

function getGridDate(type_search, account_id, date) {
    let url = new URL('http://localhost:8081/grid_map/grid/date')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id,
        date: date
    })

    sendRequest(url, true)
}

function drawGridTrip(myJSON) {
    var listGridTrip = [];
    var resultGrid = "";
    for (var i = 0; i < myJSON.length; i++) {
        var trip = [];
        var reslutGripLine = "";
        for (var j = 0; j < myJSON[i].length; j++) {
            var point = myJSON[i][j];
            var lat = uiSettings.LatOrigin + (uiSettings.size * (point.lat - 1) + uiSettings.size / 2);
            var lng = uiSettings.LngOrigin + (uiSettings.size * (point.lng - 1) + uiSettings.size / 2);
            trip.push(new google.maps.LatLng(lat, lng));
            reslutGripLine = writeResultGridLine(reslutGripLine, point.lat, point.lng, point.time);
        }
        resultGrid = resultGrid + "Route" + (i + 1) + ": " + reslutGripLine + "\n";
        var flightPath = new google.maps.Polyline({
            path: trip,
            geodesic: true,
            strokeColor: '#e74c3c',
            strokeOpacity: 0.3,
            strokeWeight: 5
        });
        flightPath.setMap(map);
        listGridTrip.push(flightPath);

        var lat = uiSettings.LatOrigin + (uiSettings.size * (myJSON[i][0].lat - 1) + uiSettings.size / 2);
        var lng = uiSettings.LngOrigin + (uiSettings.size * (myJSON[i][0].lng - 1) + uiSettings.size / 2);
        drawMarker("origin", "Origin Route " + i, lat, lng);

        lat = uiSettings.LatOrigin + (uiSettings.size * (myJSON[i][myJSON[i].length - 1].lat - 1) + uiSettings.size / 2);
        lng = uiSettings.LngOrigin + (uiSettings.size * (myJSON[i][myJSON[i].length - 1].lng - 1) + uiSettings.size / 2);
        drawMarker("destination", "Destination Route " + i, lat, lng);

    }
    tv_result_1.value = resultGrid;
    polylineOverlay.elements = listGridTrip;
}

/*
 Chung
*/
function sendRequest(url, isGrid) {
    var promise = fetch(url);
    promise
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.text();
        })
        .then(function (myText) {
            var myJSON = null;

            if (myText != null && myText.trim().length > 0) {
                myJSON = JSON.parse(myText);
            }
            removePolyline();
            if (isGrid) {
                drawGridTrip(myJSON);
            } else {
                drawRouteTrip(myJSON);
            }
        })
        .catch(function (error) {
            console.log("Noooooo! Something error:");
            console.log(error);
        });
}

function writeResultGridLine(result, x, y, t) {
    if (result != null && result != "") {
        result = result + ", (" + x + ":" + y + ":" + t + ")"
    } else {
        result = "(" + x + ":" + y + ":" + t + ")"
    }
    return result;
}

function removePolyline() {
    if (polylineOverlay.elements != null) {
        polylineOverlay.elements.forEach(function (element) {
            element.setMap(null);
        });
        polylineOverlay.elements = null;
    }

    if (markeroverlay.elements != null) {
        markeroverlay.elements.forEach(function (element) {
            element.setMap(null);
        });
        markeroverlay.elements = [];
    }
}

/*
Funtion of Tag 2
 */

function findFrequentRoute(type_search, account_id, min_sup, min_length) {
    let url = new URL('http://localhost:8081/findFrequentRoute')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id,
        min_support: min_sup,
        min_length: min_length
    })
    var promise = fetch(url);
    promise
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.text();
        })
        .then(function (myText) {
            var myJSON = null;

            if (myText != null && myText.trim().length > 0) {
                myJSON = JSON.parse(myText);
            }
            tv_runtime_2.value = myJSON.runtime;
            tv_result_2.value = myJSON.data;
            drawFrequentRoute(type_search,input_account2.value);
        })
        .catch(function (error) {
            console.log("Noooooo! Something error:");
            console.log(error);
        });
}

function drawFrequentRoute(type_search, account_id) {
    let url = new URL('http://localhost:8081/grid_map/frequent_route')
    url.search = new URLSearchParams({
        type_search: type_search,
        account_id: account_id,
    })
    var promise = fetch(url);
    promise
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.text();
        })
        .then(function (myText) {
            var myJSON = null;

            if (myText != null && myText.trim().length > 0) {
                myJSON = JSON.parse(myText);
            }
            removePolyline();
            drawFrequentRouteOnMap(myJSON)
        })
        .catch(function (error) {
            console.log("Noooooo! Something error:");
            console.log(error);
        });
}

function drawFrequentRouteOnMap(myJSON) {
    var listGridTrip = [];
    for (var i = 0; i < myJSON.length; i++) {
        var trip = [];
        for (var j = 0; j < myJSON[i].length; j++) {
            var point = myJSON[i][j];
            var lat = uiSettings.LatOrigin + (uiSettings.size * (point.lat - 1) + uiSettings.size / 2);
            var lng = uiSettings.LngOrigin + (uiSettings.size * (point.lng - 1) + uiSettings.size / 2);
            trip.push(new google.maps.LatLng(lat, lng));
        }
        var flightPath = new google.maps.Polyline({
            path: trip,
            geodesic: true,
            strokeColor: '#e74c3c',
            strokeOpacity: 0.5,
            strokeWeight: 5
        });
        flightPath.setMap(map);
        listGridTrip.push(flightPath);

        var lat = uiSettings.LatOrigin + (uiSettings.size * (myJSON[i][0].lat - 1) + uiSettings.size / 2);
        var lng = uiSettings.LngOrigin + (uiSettings.size * (myJSON[i][0].lng - 1) + uiSettings.size / 2);
        drawMarker("origin", "Origin Route " + i, lat, lng);

        lat = uiSettings.LatOrigin + (uiSettings.size * (myJSON[i][myJSON[i].length - 1].lat - 1) + uiSettings.size / 2);
        lng = uiSettings.LngOrigin + (uiSettings.size * (myJSON[i][myJSON[i].length - 1].lng - 1) + uiSettings.size / 2);
        drawMarker("destination", "Destination Route " + i, lat, lng);

    }
    polylineOverlay.elements = listGridTrip;
}

function drawMarker(type, title, lat, lng) {
    if (type == "origin") {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: '#F00',
                fillColor: '#F00',
                fillOpacity: 0.3,
                scale: 4
            },
            title: title,
            map: map,
        });
        marker.setMap(map);
        markeroverlay.elements.push(marker);
    } else {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            icon: {
                path: "M -2,-2 2,-2 2,2 -2,2 z",
                strokeColor: '#F00',
                fillColor: '#F00',
                fillOpacity: 0.3,
                scale: 1.5
            },
            title: title,
            map: map,
        });
        marker.setMap(map);
        markeroverlay.elements.push(marker);
    }
}

