let video;
let poseNet;
let poses = [];

function setup()
{
    console.log('hello');
    const canvas = createCanvas(640, 380);
    canvas.parent('videoContainer');

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    poseNet = ml5.poseNet(video, modelReady);

    poseNet.on('pose', function (results)
    {
        poses = results;
        try
        {
            let temp = results[0];
            // console.log(temp);
            let r_wrist = temp.pose.rightWrist.y;
            let l_wrist = temp.pose.leftWrist.y;
            let r_elbow = temp.pose.rightElbow.x;
            let l_elbow = temp.pose.leftElbow.x;
            let r_conf = temp.pose.rightWrist.confidence;
            let l_conf = temp.pose.leftWrist.confidence;
            
            console.log("right- ",r_wrist,r_conf);
            if ((r_wrist >0)&&(r_conf>=.1))
            {
                console.log("yay");
                
               
            //   simulateKey(38);
              simulateKey(27);
              

            }
            // if((l_wrist > 0 )&& (l_conf >= .2))
            // {
            //   console.log("left");
            // //   simulateKey(38);
            //   simulateKey(27);  
      
            // }




        }
        catch (e)
        {
            console.log(e);
        }
    }
    );

    function modelReady()
    {
        select('#status').html('Put your left hand up to go left and right to go right.')
    }
}
function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";	
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;
	
	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

function drawKeypoints()
{
    for (let i = 0; i < poses.length; i++)
    {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++)
        {
            let keypoint = pose.keypoints[j];
            if (keypoint.score > 0.5)
            {
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

function drawSkeleton()
{
    for (let i = 0; i < poses.length; i++)
    {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++)
        {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

function draw()
{
    image(video, 0, 0, width, height);

    drawKeypoints();
    drawSkeleton();
}
