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
    document.getElementById("calc-messages").innerText = msg;
}

//register functionality for zoom speed slider
document.getElementById('speedslide').onchange = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomIncrement(document.getElementById('speedslide').value);
    });
};

//register functionality for zoom in sensitivity slider
document.getElementById('inslide').onchange = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomInSensitivity(document.getElementById('inslide').value);
    });
};

//register functionality for zoom out sensitivity slider
document.getElementById('outslide').onchange = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.changeZoomOutSensitivity(document.getElementById('outslide').value);
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

//register the start button for tracking
document.getElementById('start').onclick = function() {
    console.log('Starting...');
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        //start firing messages
        console.log('Starting tracking...');
        backgroundWindow.startTracking();
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