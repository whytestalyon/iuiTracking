/**
 * Varianble for tracking the current zoom factor for the page.
 * @type Number
 */
var currentZoomFactor = 1.0;
var minZoomFactor = 0.5;

/**
 * Function for increasing/decreasing the page level zoom. Also 
 * @param {type} zoom_factor_increment increment by which to increase/decrease zoom
 * @param {DOM element} non_zoom_elm optional element to prevent from zooming
 * @returns {undefined} none
 */
function xoomer(zoom_factor_increment, zoom_elm, non_zoom_elm) {
    //calculate new zoom factor
    currentZoomFactor += zoom_factor_increment;
    if (currentZoomFactor < minZoomFactor) {
        currentZoomFactor -= zoom_factor_increment;
        return false;
    }
    //update zoom factor based on type of zoom support in browser
    if (Modernizr.zoom) {
        zoom_elm.style.zoom = currentZoomFactor;
        if (typeof non_zoom_elm != "undefined") {
            non_zoom_elm.style.zoom = 1 / currentZoomFactor;
        }
    } else {
        zoom_elm.style = "-o-transform: scale(" + currentZoomFactor + ");-moz-transform: scale(" + currentZoomFactor + ");transform: scale(" + currentZoomFactor + ");";
        if (typeof non_zoom_elm != "undefined") {
            non_zoom_elm.style = "-o-transform: scale(" + (1 / currentZoomFactor) + ");-moz-transform: scale(" + (1 / currentZoomFactor) + ");transform: scale(" + (1 / currentZoomFactor) + ");";
        }
    }
    return true;
}

