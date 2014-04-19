/**
 * Simple support method for notifying the user of the status of tracking.
 * Some functions supplied by Marko Dugonjić @ 
 * http://webdesign.maratz.com/lab/responsivetypography/realtime/
 */

/*
 * Variable for tracking the intial distance of users face from camera. This will be used
 * in the relative zoom calculations allowing for the dynamic assignment of 
 * when a user wants to zoom in ( current face width is greater than some 
 * percentage of face_start_distance) and zoom out ( current face width is less
 * than some percentage of face_start_distance). This starts with a default value
 * and gets updated once the tracking algorithm starts running.
 */
var face_start_distance = 60; //estimated in centimeters
var face_tracked = false; //indicates if tracking started or not

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

/**
 * Monitor the status of the tracker.
 * @param {type} param1
 * @param {type} param2
 * @param {type} param3
 */
document.addEventListener("headtrackrStatus", function(event) {
    if (event.status in supportMessages) {
        //check if tracking has started
        if (!face_tracked && event.status === 'found') {
            face_tracked = true;
        }
        var messagep = document.getElementById('support-message');
        messagep.innerHTML = supportMessages[event.status];
    } else if (event.status in statusMessages) {
        var messagep = document.getElementById('headtracker-message');
        messagep.innerHTML = statusMessages[event.status];
    }
}, true);

document.addEventListener("headtrackingEvent", function(event) {
    if (event.status in supportMessages) {
        //check if tracking has started
        if (!face_tracked && event.status === 'found') {
            face_tracked = true;
        }
        var messagep = document.getElementById('support-message');
        messagep.innerHTML = supportMessages[event.status];
    } else if (event.status in statusMessages) {
        var messagep = document.getElementById('headtracker-message');
        messagep.innerHTML = statusMessages[event.status];
    }
}, true);

