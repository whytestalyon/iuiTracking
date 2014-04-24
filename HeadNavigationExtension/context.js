/*
 * communication event ahndler that lets the content script listen for messages
 * from the background page and act accordinly
 */
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    if (msg.zoom_type) {
        xoomer(msg.zoom_type);
    }
});

/*
 * Zoom managment variables
 */
var currentZoomIncrement = 0.15;
var minZoomFactor = 0.5, maxZoomFactor = 15;

/**
 * Function for increasing/decreasing the page level zoom.
 * @param {type} zoom_factor_increment increment by which to increase/decrease zoom
 * @param {DOM element} non_zoom_elm optional element to prevent from zooming
 * @returns {undefined} none
 */
function xoomer(zoom_type) {
    //grab the current zoom factor for the body
    var currentZoomFactor = document.getElementsByTagName('body')[0].style.zoom;
    if (currentZoomFactor == "") {//handle case when page body has no zoom level initially
        currentZoomFactor = 1;
    }
    //determine if we should zoom in (increase zoom factor) or zoom out
    //(decrease the zoom factor)
    if (zoom_type === "zoom_in") {
        //calculate new zoom factor for zooming in
        currentZoomFactor += currentZoomIncrement;
    } else {
        //calculate new zoom factor for zooming out
        currentZoomFactor -= currentZoomIncrement;
    }
    //reset boundaries if outside of max or minimum zoom factor
    if (currentZoomFactor < minZoomFactor && currentZoomFactor !== minZoomFactor) {
        currentZoomFactor = minZoomFactor;
    } else if (currentZoomFactor > maxZoomFactor && currentZoomFactor !== maxZoomFactor) {
        currentZoomFactor = maxZoomFactor;
    } else {
        //nothing to do so just return
        return false;
    }
    //update body zoom factor in DOM
    document.getElementsByTagName('body')[0].style.zoom = currentZoomFactor;
    return true;
}

/**
 * Changing the zoom increment determines how quickly the extension will zoom
 * on a page. The larger the number the faster the zoom, the smaller the number
 * the slower the zoom will be. 
 * @param {number} inc_value a numerical value greater than 0 to indicate how quickly
 * the system should zoom in on a page. Default is set to 0.15 so each zoom request
 * zooms in/out 15%.
 * @returns {undefined}
 */
function setZoomIncrement(inc_value) {
    //validate number as input and then make sure it is a positive number
    if ((typeof inc_value == 'number' && isFinite(inc_value)) && inc_value > 0) {
        currentZoomIncrement = inc_value;
    }
}