window.onload = function() {
    console.log('Checking tracking status...');
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        //initialize the tracking status
        var trkStatus = backgroundWindow.isTracking();
        console.log('Tracking status: ' + trkStatus);
        if (trkStatus) {
            displayTracking(backgroundWindow);
            pingStats();
        }
        //grab the previous settings for the sliders
        document.getElementById('outslide').value = backgroundWindow.getZoomOutSensitivity();
        document.getElementById('inslide').value = 1.30 - backgroundWindow.getZoomInSensitivity();
        document.getElementById('speedslide').value = backgroundWindow.getZoomIncrement();
    });
};

function pingStats() {
    window.setInterval(function() {
        chrome.runtime.getBackgroundPage(function(backgroundWindow) {
            var stats = backgroundWindow.getStats();
            updateCalcMessage(stats);
        });
    }, 100);
}

/*
 * functions that the backgroud page can call to update the popup with status of the tracker system
 */
function updateSupportMessage(msg) {
    document.getElementById('support-message').innerHTML = msg;
}

function updateTrackerMessage(msg) {
    document.getElementById('headtracker-message').innerHTML = msg;
}

function updateCalcMessage(msg) {
    var message = "<div>Current Face Width: " + msg.faceWidth + "</div>" +
            "<div>Avg. Face Width: " + msg.avgFaceWidth + "</div>" +
            "<div>Face Ratio: " + msg.ratio + "</div>" +
            "<div>Zoom Speed: " + msg.zoomSpeed + "</div>" +
            "<div>Zoom In Ratio: " + msg.zoomInRatio + "</div>" +
            "<div>Zoom Out Ratio: " + msg.zoomOutRatio + "</div>"+
            "<div>Head Angle (radians): " + msg.angle + "</div>"+
            "<div>Head Position (X): " + msg.x + "</div>"+
            "<div>Head Position (Y): " + msg.y + "</div>";
    document.getElementById("calc-messages").innerHTML = message;
}

//register functionality for zoom speed slider
document.getElementById('speedslide').onchange = function() {
    console.log("Changing zoom speed: " + document.getElementById('speedslide').value);
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomIncrement(parseFloat(document.getElementById('speedslide').value));
    });
};

//register functionality for zoom in sensitivity slider
document.getElementById('inslide').onchange = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomInSensitivity(1.30 - parseFloat(document.getElementById('inslide').value));
    });
};

//register functionality for zoom out sensitivity slider
document.getElementById('outslide').onchange = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomOutSensitivity(parseFloat(document.getElementById('outslide').value));
    });
};

//register functionality for Reload Face Detection button
document.getElementById('reloadFaceButton').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.reStartTracking();
    });
};

//register functionality for Adjust Face Detection button
document.getElementById('adjustFaceButton').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.resetAvgFaceWidth();
    });
};

//register functionality for get stats button
//document.getElementById('statsButton').onclick = function() {
//    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
//        var stats = backgroundWindow.getStats();
//        updateCalcMessage(stats);
//    });
//};

//register the start button for tracking
document.getElementById('start').onclick = function() {
    console.log('Starting...');
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        //start firing messages
        console.log('Starting tracking...');
        backgroundWindow.startTracking();
        displayTracking(backgroundWindow);
        pingStats();
    });
};

//register the stop button for tracking
document.getElementById('stop').onclick = function() {
    console.log('Stoping...');
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        //stop firing messages
        console.log('Stoping tracking...');
        backgroundWindow.stopTracking();
    });
};

//register the check button for tracking
//document.getElementById('check').onclick = function() {
//    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
//        displayTracking(backgroundWindow);
//    });
//};


function displayTracking(backgroundWindow) {
    console.log('Copying canvases...');
    //copy video
    var vidCanvas = backgroundWindow.getVideoCanvas();
    var vidDiv = document.getElementById('vid');
    vidDiv.appendChild(vidCanvas);
    document.getElementById('inputCanvas').style.display = "";
    //copy tracking box
    var overlay = backgroundWindow.getOverlayCanvas();
    vidDiv.appendChild(overlay);
}