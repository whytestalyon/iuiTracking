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
var face_couts = 5;
var navCntr = -1;
var navHold = false;
/*
 * Variables for tracking the zoom sensitivity of the extension
 */
var zoomOutRatio = 0.92;
var zoomInRatio = 1.15;
/*
 * Variable for tracking Zoom speed
 */
var currentZoomIncrement = 0.125;

/*
 * Tracking status variables
 */
var currentFaceWidth, faceWidthRatio;

/*
 Set up camera connection and tracking
 */
var init = false;
var videoInput;
var canvasInput;
var overlayCanvas;
var overlayContext;
var htracker;

function initTracker() {
    console.log('Initializing tracker, video and canvas...');
    videoInput = document.getElementById('inputVideo');
    canvasInput = document.getElementById('inputCanvas');
    if (canvasInput === null) {//reset after restart of tracker because when the 
        // popup requests the video and tracking feed the physical elements get 
        // moved from the background DOM to somewhere else that I'm not sure of ;)
        console.log(document);
        var can = '<canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>';
        var curHtml = document.getElementsByTagName('body')[0].innerHTML;
        document.getElementsByTagName('body')[0].innerHTML = curHtml + can;
        canvasInput = document.getElementById('inputCanvas');
    }
    overlayCanvas = document.getElementById('overlayCanvas');
    if (overlayCanvas === null) {//reset after restart of tracker because when 
        // the popup requests the video and tracking feed the physical elements 
        // get moved from the background DOM to somewhere else that I'm not sure of ;)
        var can = '<canvas id="overlayCanvas" width="320" height="240"></canvas>';
        var curHtml = document.getElementsByTagName('body')[0].innerHTML;
        document.getElementsByTagName('body')[0].innerHTML = curHtml + can;
        overlayCanvas = document.getElementById('overlayCanvas');
    }
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = '0px';
    overlayCanvas.style.zIndex = '100001';
    overlayCanvas.style.display = 'block';
    overlayContext = overlayCanvas.getContext('2d');
    htracker = new headtrackr.Tracker({calcAngles: true, ui: false});
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
            windows[0].updateTrackerMessage(statusMessages[event.status]);
        }
    }
}, true);

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
//            console.log(sender.tab ?
//                    "from a content script:" + sender.tab.url :
//                    "from the extension");
            if (request.req == "zoom") {
                if (currentZoomlvl != undefined && (currentZoomlvl.zoom_type === "back" || currentZoomlvl.zoom_type === "forward")) {
                    goBackCounter = 0;
                    goForwardCounter = 0;
                }
                sendResponse(currentZoomlvl);
            } else if (request.req == "gotNavMsg" && navHold) {
                console.log('Got nav response!');
                navHold = false;
                navCntr = 50;//hold the tracker from doing anything for 1 second after navigating somewhere
                //update zoom settings
                currentZoomlvl = {zoom_type: 'none', zoom_increment: currentZoomIncrement};
                sendResponse(currentZoomlvl);
            }
        });

/*
 * Zoom command counters
 */
var zoomInCounter = 0;
var zoomOutCounter = 0;
var lastZoomType = "";
var currentZoomlvl;
/*
 * angle of face on canvas (in radians). The angle is calculated in normal 
 * counter-clockwise direction. I.e. if head is upright, this will return π/2, 
 * if head is tilted towards right (as seen on canvas, which is to the left in 
 * real life), this will return a degree between 0 and π/2. And its between
 * π and π/2 in the opposite direction.
 */
var currentHeadAngle = Math.PI / 2;
var goBack = 1.7;//radians
var goBackCounter = 0;
var goForward = 1.4;//radians
var goForwardCounter = 0;
var currentXpos = 0, currentYpos = 0;
var zoomMinAngle = 1.48, zoomMaxAngle = 1.61;

document.addEventListener("facetrackingEvent", function(event) {
    //display the head tracking as a green box on the canvas
    overlayContext.clearRect(0, 0, 320, 240);
    currentXpos = event.x;
    currentYpos = event.y;
    if (event.detection == "CS") {
        overlayContext.translate(event.x, event.y);
        overlayContext.rotate(event.angle - (Math.PI / 2));
        overlayContext.strokeStyle = "#00CC00";
        overlayContext.strokeRect((-(event.width / 2)) >> 0, (-(event.height / 2)) >> 0, event.width, event.height);
        overlayContext.rotate((Math.PI / 2) - event.angle);
        overlayContext.translate(-event.x, -event.y);
    }
    currentHeadAngle = event.angle;
    //check if previous command was a navigation command, if so make sure it is
    //held for a while so the pulling content script can recieve the message
    if (navHold) {
        //do nothing till content script says it has recieved the message
    } else if (navCntr > 0) {
        //do nothing until content script notifys that it go the message to navigate
        navCntr--;
    } else {
        //determine if zoom operation or navigation operation based on head angle
        var zoomType = "none";
        if (currentHeadAngle <= zoomMaxAngle && currentHeadAngle >= zoomMinAngle) {
            //check if we need to initialize the starting distance between users face and camera
            //other wise determine if we need to zoom, or navigate arround
            if (start_cntr < face_couts) {
                avg_face_start_width += event.width;
                start_cntr++;
            } else if (start_cntr === face_couts) {
                avg_face_start_width = (avg_face_start_width / face_couts);
                start_cntr++;
            } else {
                //get current face width
                currentFaceWidth = event.width;
                //calculate ratio of current user face size compared to starting face size size
                faceWidthRatio = event.width / avg_face_start_width;
                //determine if threshold for action has been met
                if (faceWidthRatio < zoomOutRatio) {
                    zoomType = 'zoom_out';
                } else if (faceWidthRatio > zoomInRatio) {
                    zoomType = 'zoom_in';
                }
            }
        } else {
            //determine if we need to indicate that the browser should go back a page or
            //forward a page
            if (currentHeadAngle < goForward) {
                goBackCounter = 0;
                goForwardCounter++;
            } else if (currentHeadAngle > goBack) {
                goForwardCounter = 0;
                goBackCounter++;
            } else {
                goBackCounter = 0;
                goForwardCounter = 0;
            }
            //if the head has been held at the same angle for ~140ms (20ms period
            //for this event times the specified threshold of 7) then tell
            //the browser page that it should navigate backwards or forwards
            //depending on angle
            if (goForwardCounter > 7) {
                zoomType = "forward";
                navHold = true;
            } else if (goBackCounter > 7) {
                zoomType = "back";
                navHold = true;
            }
        }
        //update zoom settings
        currentZoomlvl = {zoom_type: zoomType, zoom_increment: currentZoomIncrement};
    }
}, true);

function getStats() {
    //format user face distance ratio message
    var data =
            {
                "faceWidth": currentFaceWidth,
                "avgFaceWidth": avg_face_start_width,
                "ratio": faceWidthRatio,
                "zoomSpeed": currentZoomIncrement,
                "zoomInRatio": zoomInRatio,
                "zoomOutRatio": zoomOutRatio,
                "angle": currentHeadAngle,
                "x": currentXpos,
                "y": currentYpos
            };
    return data;
}

function reStartTracking() {
    resetAvgFaceWidth();
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
    if (htracker != undefined) {
        htracker.stop();
        htracker.stopStream();
        init = false;
    }
    //check if popup page is open
    var windows = chrome.extension.getViews({type: "popup"});
    if (windows.length > 0) {
        //update status message to show tracker has stopped tracking
        windows[0].updateTrackerMessage('Tracker stopped.');
    }
    //reset the page zoom to prevent issues with zoom out or in when tracker is stopped
    currentZoomlvl = {zoom_type: "none", zoom_increment: currentZoomIncrement};
    return true;
}

function getZoomOutSensitivity() {
    return zoomOutRatio;
}

function getZoomInSensitivity() {
    return zoomInRatio;
}

function getZoomIncrement() {
    return currentZoomIncrement;
}

function changeZoomOutSensitivity(level) {
    zoomOutRatio = level;
}

function changeZoomInSensitivity(level) {
    zoomInRatio = level;
}

function changeZoomIncrement(inc_value) {
    currentZoomIncrement = inc_value;
}

function getVideoCanvas() {
    return canvasInput;
}

function getOverlayCanvas() {
    return overlayCanvas;
}

function isTracking() {
    return init;
}
