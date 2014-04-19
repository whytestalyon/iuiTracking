<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>

        <title>tracking.js - Human Frontal Eye</title>

        <meta charset="utf-8">

        <script src="/TrackingIUI/eye_tracker/tracking.min.js"></script>
        <script src="/TrackingIUI/eye_tracker/tracker/human/human.min.js"></script>
        <script src="/TrackingIUI/eye_tracker/tracker/human/data/eye.min.js"></script>

        <style>
            * {
                margin: 0;
                padding: 0;
            }
            canvas {
                -moz-transform: scale(-1, 1);
                -o-transform: scale(-1, 1);
                -webkit-transform: scale(-1, 1);
                filter: FlipH;
                transform: scale(-1, 1);
            }
        </style>

    </head>
    <body>

        <script>
            console.log('Initializing the tracker and canvas...');
            //Gets the user's camera
            var videoCamera = new tracking.VideoCamera().hide().render().renderVideoCanvas(),
                    ctx = videoCamera.canvas.context;
            console.log('Starting the tracker...');
            videoCamera.track({
                type: 'human',
                data: 'eye',
                onFound: function(track) {
                    for (var i = 0, len = track.length; i < len; i++) {
                        var rect = track[i];
                        console.log("x: "+rect.x+", y: "+rect.y+", size: "+rect.size);
                        ctx.strokeStyle = "rgb(0,255,0)";
                        ctx.strokeRect(rect.x, rect.y, rect.size, rect.size);
                    }
                },
                onNotFound: function(track) {
                    console.log("Couldn't find the eye yet!");
                    console.log(track);
                }
            });
        </script>

    </body>
</html>
