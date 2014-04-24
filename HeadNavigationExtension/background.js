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
 * Variables for tracking the zoom sensitivity of the extension
 */
var zoomOutRatio = 0.92;
var maxSensitiveZoomOutRatio = 0.96;
var minSensitiveZoomOutRatio = 0.80;
var zoomInRatio = 1.15;
var maxSensitiveZoomInRatio = 1.04;
var minSensitiveZoomInRatio = 1.30;

/*
 Set up camera connection and tracking
 */
var init = false;
var videoInput;
var canvasInput;
var htracker;

function initTracker() {
    console.log('Initializing tracker, video and canvas...');
    videoInput = document.getElementById('inputVideo');
    canvasInput = document.getElementById('inputCanvas');
    htracker = new headtrackr.Tracker({calcAngles: false, ui: false});
    htracker.init(videoInput, canvasInput);
    init = true;
}

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
    //check if popup page is open
    var windows = chrome.extension.getViews({type: "popup"});
    if (windows.length > 0) {
        //respond to event by calling a function in the popup that will update it's
        //DOM with the supplied value in the appropriate message window
        if (event.status in supportMessages) {
            windows[0].updateSupportMessage(supportMessages[event.status]);
        } else if (event.status in statusMessages) {
            windows[0].updateTrackerMessage(supportMessages[event.status]);
        }
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
        var message = "";
        if (faceWidthRatio < zoomOutRatio) {
            //users face has moved farther from camera, start zooming out
            //notify active tab's content script to zoom out
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {zoom_type: "zoom_out"});
            });
            //format user message information
            message = "Zooming out!";
        } else if (faceWidthRatio > zoomInRatio) {
            //users face has moved closer to camera, start zooming in
            //notify active tab's content script to zoom in
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {zoom_type: "zoom_in"});
            });
            //format user message information
            message = "Zooming in!";
        }
        //format user face distance ratio message
        message += " Face width: " + event.width + ", Avg face width: " + avg_face_start_width + ", face2canvasRatio: " + faceWidthRatio + ", Zoom factor: " + currentZoomFactor;
        //check if popup page is open
        var windows = chrome.extension.getViews({type: "popup"});
        //if popup is open update it with the calculation message
        if (windows.length > 0) {
            windows[0].updateCalcMessage(message);
        }

    }

}, true);

function getAvgFaceWidth() {
    return avg_face_start_width;
}

function reStartTracking() {
    if (htracker !== undefined) {
        htracker.stop();
    }
    startTracking();
}

function resetAvgFaceWidth() {
    start_cntr = 0;
    avg_face_start_width = 0;
}

function startTracking() {
    console.log('Starting the tracker...');
    if (!init) {
        initTracker();
    }
    htracker.start();
}

function stopTracking() {
    console.log('Stoping the tracker...');
    if (htracker !== undefined) {
        htracker.stop();
        htracker.sstopStream();
        init = false;
    }
}

function changeZoomOutSensitivity(inc_value) {
    if ((typeof inc_value == 'number' && isFinite(inc_value)) && inc_value < minSensitiveZoomOutRatio) {
        zoomOutRatio = minSensitiveZoomOutRatio;
    } else
    if ((typeof inc_value == 'number' && isFinite(inc_value)) && inc_value > maxSensitiveZoomOutRatio) {
        zoomOutRatio = maxSensitiveZoomOutRatio;
    } else {
        zoomOutRatio = incLvl;
    }
}

function changeZoomInSensitivity(inc_value) {
    if ((typeof inc_value == 'number' && isFinite(inc_value)) && inc_value > minSensitiveZoomInRatio) {
        zoomInRatio = minSensitiveZoomInRatio;
    } else
    if ((typeof inc_value == 'number' && isFinite(inc_value)) && inc_value < maxSensitiveZoomInRatio) {
        zoomInRatio = maxSensitiveZoomInRatio;
    } else {
        zoomInRatio = incLvl;
    }
}