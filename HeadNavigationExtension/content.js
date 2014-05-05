//document.getElementsByTagName('body')[0].innerHTML = "Hi this is new!";

/*
 * communication event ahndler that lets the content script listen for messages
 * from the background page and act accordinly
 */
//chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
//    console.log(JSON.stringify(msg));
//    if (msg.zoom_type) {
//        xoomer(msg);
//    }
//    return true;
//});

/*
 * Zoom range variables
 */
var minZoomFactor = 0.5, maxZoomFactor = 5;
/*
 * Navigation variables
 */
var navCntr = 5;

/*
 * Pull timer function for the script to check in with the background page
 * @type @exp;window@call;setInterval
 */
var snyc = window.setInterval(function() {
    chrome.runtime.sendMessage({req: "zoom"}, function(response) {
//        console.log("Got: " + JSON.stringify(response));
        xoomer(response);
    });
}, 100);




/**
 * Function for increasing/decreasing the page level zoom.
 * @param {Object} zoom_object is a message of "zoom_in" to tell the page to zoom in,
 * and "zoom_out" to tell the page to zoom out, and contains the zoom increment.
 * @returns {boolean} false if no zoom action can be taken (happens when page is
 * zoomed in/out to the maximum allowed levels), true otherwise
 */
function xoomer(zoom_object) {
    //handle the nav request, prevent other operations until nav operation completes
    if(navCntr < 0){
        navCntr = 5;
    }else if( navCntr < 5){
        navCntr--;
    }else if (zoom_object && zoom_object.zoom_type !== 'none') {
        var currentZoomIncrement = zoom_object.zoom_increment;
        var zoom_type = zoom_object.zoom_type;
        //grab the current zoom factor for the body
        var currentZoomFactor = document.getElementsByTagName('body')[0].style.zoom;
        if (currentZoomFactor == "") {//handle case when page body has no zoom level initially
            currentZoomFactor = 1;
        } else {
            currentZoomFactor = parseFloat(document.getElementsByTagName('body')[0].style.zoom);
        }
        //determine if we should zoom in (increase zoom factor) or zoom out
        //(decrease the zoom factor)
        var newZoomFactor;
        switch (zoom_type) {
            case "zoom_in":
                //calculate new zoom factor for zooming in
                newZoomFactor = currentZoomFactor + currentZoomIncrement;
                break;
            case "zoom_out":
                //calculate new zoom factor for zooming out
                newZoomFactor = currentZoomFactor - currentZoomIncrement;
                break;
            case "forward":
                window.history.forward();
                navCntr--;
                break;
            case "back":
                window.history.back();
                navCntr--;
                break;
            default:
                return false;
        }
        //reset boundaries if outside of max or minimum zoom factor
        if (newZoomFactor < minZoomFactor) {
            newZoomFactor = minZoomFactor;
        } else if (newZoomFactor > maxZoomFactor) {
            newZoomFactor = maxZoomFactor;
        }
        //update body zoom factor in DOM
        console.log('New Zoom factor: ' + newZoomFactor);
        document.getElementsByTagName('body')[0].style.zoom = newZoomFactor;
        console.log('Old zoom: ' + currentZoomFactor + ", Current zoom: " + document.getElementsByTagName('body')[0].style.zoom);
    } else if (zoom_object && zoom_object.zoom_type === 'stop') {
        window.clearInterval(sync);
    }
}