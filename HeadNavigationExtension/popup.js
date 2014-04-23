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

//register functionality for Reload Face Detection button
document.getElementById('reloadFaceButton').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroudWindow) {
        backgroudWindow.reStartTracking();
    });
};

//register functionality for Adjust Face Detection button
document.getElementById('adjustFaceButton').onclick = function() {
    chrome.runtime.getBackgroundPage(function(backgroudWindow) {
        backgroudWindow.resetAvgFaceWidth();
    });
};

//register the start button for tracking
document.getElementById('start').onclick = function() {
    console.log('Starting...');
    chrome.runtime.getBackgroundPage(function(backgroudWindow) {

        //start firing messages
        console.log('Starting tracking...');
        backgroudWindow.startTracking();
    });
};

//register the stop button for tracking
document.getElementById('stop').onclick = function() {
    console.log('Stoping...');
    chrome.runtime.getBackgroundPage(function(backgroudWindow) {

        //stop firing messages
        console.log('Stoping tracking...');
        backgroudWindow.stopTracking();
    });
};