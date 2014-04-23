/*
	A simple script that gets injected into a site so we can access the camera by asking for permissions
 */
//Compatibility - set correct variable for accessing the user media (video stream from the camera)
console.log("Injected!");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

var videoObj = {
            video: true
        };

//check if there is user media available from the system
if (navigator.getUserMedia) {
	console.log("User Media Supported!");
	navigator.getUserMedia(videoObj, function(stream) {
		var myStream = (navigator.webkitGetUserMedia) ? window.webkitURL.createObjectURL(stream) : stream;
		if (this.myStream !== undefined) {
			this.myStream.stop();
		}
	}, function(error) {
		console.error("Video capture error: ", error.code);
	});
} else {
	console.error("Camera not available!");
}
