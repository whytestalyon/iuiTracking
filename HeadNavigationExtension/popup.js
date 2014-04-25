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
document.getElementById('speedslide').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.reStartTracking();
    });
};

//register functionality for zoom sensitivity slider
document.getElementById('senseslide').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroundWindow) {
        backgroundWindow.reStartTracking();
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