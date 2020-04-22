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
            console.log(temp.pose.leftWrist.y);
            let r_wrist = temp.pose.rightWrist.y;
            let l_wrist = temp.pose.leftWrist.y;
            let r_elbow = temp.pose.rightElbow.x;
            let l_elbow = temp.pose.leftElbow.x;
            let r_conf = temp.pose.rightWrist.confidence;
            let l_conf = temp.pose.leftWrist.confidence;
            let x = document.getElementById("wh");
            if ((r_wrist > 0 )&& (r_conf >= .4))
            {
              console.log("right");

                let turn = 60;
                x.style.transform = "rotate(" + (turn % 360) + "deg)";
                x.style.transform = "rotate(" + (turn % 360) + "deg)";

            }
            if((l_wrist > 0 )&& (l_conf >= .4))
            {
              console.log("left");
                let turn = -120;
                x.style.transform = "rotate(" + (turn % 360) + "deg)";
                x.style.transform = "rotate(" + (turn % 360) + "deg)";
            }




        }
        catch (e)
        {
            console.log(e);
        }
    }
    );

    function modelReady()
    {
        select('#status').html('model Loaded')
    }
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
