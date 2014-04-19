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
var face_start_distance = -1; //estimated in centimeters

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
        var messagep = document.getElementById('support-message');
        messagep.innerHTML = supportMessages[event.status];
    } else if (event.status in statusMessages) {
        var messagep = document.getElementById('headtracker-message');
        messagep.innerHTML = statusMessages[event.status];
    }
}, true);

document.addEventListener("facetrackingEvent", function(event) {
    //get video
    var videoInput = document.getElementById('inputCanvas');
    //calculate ratio of current user face size compared to window size
    var faceWidth = event.width,
            videoWidth = videoInput.width,
            face2canvasRatio = videoWidth / faceWidth;
    //display user face distance ratio
    document.getElementById("calc-messages").innerText = "Face width: " + faceWidth + ", Video width: " + videoWidth + ", face2canvasRatio: " + face2canvasRatio + ", Zoom factor: " + currentZoomFactor;
    //determine if threshold for action has been met
    if (face2canvasRatio > 3.6) {
        //users face has moved farther from camera, start zooming out
        xoomer(-0.025, document.getElementById("videoDiv"));
    } else if (face2canvasRatio < 2.51) {
        //users face has moved closer to camera, start zooming in
        xoomer(0.025, document.getElementById("videoDiv"));
    }
}, true);

//document.addEventListener("headtrackingEvent", function(event) {
//    //check if we need to initialize the starting distance between users face and camera
//    if (face_start_distance === -1) {
//        face_start_distance = event.z;
//    }
//    //calculate ratio of current user distance from camera to original user
//    //distance from camera
//    var distanceRatio = event.z / face_start_distance;
//    //display user face distance ratio
//    document.getElementById("calc-messages").innerText = "Z-distace: " + event.z + ", Distance Ratio: " + distanceRatio + ", Zoom factor: " + currentZoomFactor;
//    //determine if threshold for action has been met
//    if (distanceRatio > 1.1) {
//        //users face has moved farther from camera, start zooming out
//        xoomer(-0.025, document.getElementById("videoDiv"));
//    } else if (distanceRatio < 0.7) {
//        //users face has moved closer to camera, start zooming in
//        xoomer(0.025, document.getElementById("videoDiv"));
//    }
//}, true);

