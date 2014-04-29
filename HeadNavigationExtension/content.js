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
window.setInterval(function() {
    chrome.runtime.sendMessage({req: "zoom"}, function(response) {
//        console.log("Got: " + JSON.stringify(response));
        xoomer(response);
    });
}, 100);

/*
 * Zoom range variables
 */
var minZoomFactor = 0.5, maxZoomFactor = 5;


/**
 * Function for increasing/decreasing the page level zoom.
 * @param {Object} zoom_object is a message of "zoom_in" to tell the page to zoom in,
 * and "zoom_out" to tell the page to zoom out, and contains the zoom increment.
 * @returns {boolean} false if no zoom action can be taken (happens when page is
 * zoomed in/out to the maximum allowed levels), true otherwise
 */
function xoomer(zoom_object) {
    if (zoom_object && zoom_object.zoom_type !== 'none') {
        var currentZoomIncrement = zoom_object.zoom_increment;
        var zoom_type = zoom_object.zoom_type;
        //grab the current zoom factor for the body
        var currentZoomFactor = document.getElementsByTagName('body')[0].style.zoom;
        if (currentZoomFactor == "") {//handle case when page body has no zoom level initially
            currentZoomFactor = 1;
        }else{
            currentZoomFactor = parseFloat(document.getElementsByTagName('body')[0].style.zoom);
        }
        //determine if we should zoom in (increase zoom factor) or zoom out
        //(decrease the zoom factor)
        var newZoomFactor;
        if (zoom_type === "zoom_in") {
            //calculate new zoom factor for zooming in
            newZoomFactor = currentZoomFactor + currentZoomIncrement;
        } else {
            //calculate new zoom factor for zooming out
            newZoomFactor = currentZoomFactor - currentZoomIncrement;
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
    }
}