/*
 * Tracker status messages
 */
statusMessages = {
    "whitebalance": "checking for stability of camera whitebalance",
    "detecting": "Detecting face",
    "hints": "Hmm. Detecting the face is taking a long time",
    "redetecting": "Lost track of face, redetecting",
    "lost": "Lost track of face",
    "found": "Tracking face"
};

supportMessages = {
    "no getUserMedia": "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
    "no camera": "No camera found. Using fallback video for facedetection."
};


/*
 * functions that the backgroud page can call to update the popup with status of the tracker system
 */
function updateSupportMessage(msg) {
    document.getElementById('support-message').innerHTML = supportMessages[msg];
}

function updateTrackerMessage(msg) {
    document.getElementById('headtracker-message').innerHTML = supportMessages[msg];
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