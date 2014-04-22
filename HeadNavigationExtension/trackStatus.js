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
var avg_face_start_width = -1; //estimated in centimeters
var start_cntr = 0;
var face_couts = 15;
/*
 * Variable for tracking the current zoom factor for the page.
 */
var currentZoomFactor = 1.0;
var minZoomFactor = 0.5;

/*
	Tracker application
 */

/*
	Start camera connection and tracking
*/
window.onload=function(){
	console.log('Initializing the tracker and canvas...');
	var videoInput = document.getElementById('inputVideo');
	var canvasInput = document.getElementById('inputCanvas');

	var htracker = new headtrackr.Tracker({calcAngles: false, ui: false});
	console.log('Starting the tracker...');
	htracker.init(videoInput, canvasInput);
	htracker.start();
};


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
    //check if we need to initialize the starting distance between users face and camera
    if (start_cntr < face_couts) {
        avg_face_start_width += event.width;
        start_cntr++;
    } else if (start_cntr === face_couts) {
        avg_face_start_width = (avg_face_start_width / face_couts);
        start_cntr++;
    } else {
        //calculate ratio of current user face size compared to starting face size size
        var faceWidthRatio = event.width / avg_face_start_width;
        //determine if threshold for action has been met
        if (faceWidthRatio < 0.92) {
            //users face has moved farther from camera, start zooming out
            //xoomer(-0.05, innerDoc.body, null);
            //display user face distance ratio
            document.getElementById("calc-messages").innerText = "Zooming out! Face width: " + event.width + ", Avg face width: " + avg_face_start_width + ", face2canvasRatio: " + faceWidthRatio + ", Zoom factor: " + currentZoomFactor;
        } else if (faceWidthRatio > 1.15) {
            //users face has moved closer to camera, start zooming in
            //xoomer(0.05, innerDoc.body, null);
            //display user face distance ratio
            document.getElementById("calc-messages").innerText = "Zooming in! Face width: " + event.width + ", Avg face width: " + avg_face_start_width + ", face2canvasRatio: " + faceWidthRatio + ", Zoom factor: " + currentZoomFactor;
        } else {
            //display user face distance ratio
            document.getElementById("calc-messages").innerText = "Face width: " + event.width + ", Avg face width: " + avg_face_start_width + ", face2canvasRatio: " + faceWidthRatio + ", Zoom factor: " + currentZoomFactor;
        }
    }

}, true);

function resetAvgFaceWidth() {
    start_cntr = 0;
    avg_face_start_width = 0;
}

/**
 * Sending a request from the extension to the content script in the current tab.
 * This single message stream sends a message to the content script in the selected tab
 * with the expectation that the tab will return the current zoom level of the <body>.
 
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
	console.log(response.farewell);
  });
});*/
