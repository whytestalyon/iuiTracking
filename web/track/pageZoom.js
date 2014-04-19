/**
 * Varianble for tracking the current zoom factor for the page.
 * @type Number
 */
var currentZoomFactor = 1.0;

/**
 * Function for increasing/decreasing the page level zoom. Also 
 * @param {type} zoom_factor_increment increment by which to increase/decrease zoom
 * @param {DOM element} non_zoom_elm optional element to prevent from zooming
 * @returns {undefined} none
 */
function xoomer(zoom_factor_increment, non_zoom_elm) {
    currentZoomFactor += zoom_factor_increment;
    document.body.style.zoom = currentZoomFactor;
    if (typeof non_zoom_elm != "undefined") {
        non_zoom_elm.style.zoom = 1 / currentZoomFactor;
    }
}

