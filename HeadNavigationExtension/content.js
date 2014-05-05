/*
 * Zoom range variables
 */
var minZoomFactor = 0.5, maxZoomFactor = 5;

/*
 * Pull timer function for the script to check in with the background page.
 * Function for increasing/decreasing the page level zoom and navigation
 * based on head angle. Runs every 100ms.
 * @type @exp;window@call;setInterval
 */
var snyc = window.setInterval(function() {
    var nav = "";
    chrome.runtime.sendMessage({req: "zoom"}, function(response) {
        var currentZoomIncrement = response.zoom_increment;
        var zoom_type = response.zoom_type;
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
            case "back":
                nav = zoom_type;
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
    });
    
    //check if we need to navigate through browser history and notify the background
    //page that the content page has recieved the navigation message
    if( nav !== ""){
        //notify background page of recieved go back message
        chrome.runtime.sendMessage({req: "gotNavMsg"}, function(response) {
            if(nav === 'forward'){
                window.history.forward();
            }else if(nav === 'back'){
                window.history.back();
            }
        });
    }
}, 100);//run pull request every 100ms