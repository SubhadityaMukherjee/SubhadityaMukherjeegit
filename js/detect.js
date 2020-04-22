let video;
let detector;
let detections;

function setup() {
    createCanvas(480, 360);
    
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    detector = ml5.objectDetector('cocossd', modelReady)
}


function modelReady(){
  document.getElementById("vis").innerHTML = "Model loaded";
  detect();
}

function detect(){
  detector.detect(video, gotResults);
}

function gotResults(err, results){
  if(err){
    console.log(err);
    return
  }

  detections = results;
  detect();
}

function draw() {
  image(video, 0, 0, width, height);
  
  if (detections) {
    detections.forEach(detection => {
      // noStroke();
      // fill(255);
      // strokeWeight(2);
      // text(detection.label, detection.x + 4, detection.y + 10)
      lab = detection.label;
      console.log(lab);

      if(lab=="book"){
        document.getElementById("vis").innerHTML = "book";
      }else if(lab=="cup"){
        document.getElementById("vis").innerHTML = "cup";
      }else if(lab=="couch"){
        document.getElementById("vis").innerHTML = "couch";
      }
      
        // noFill();
        // strokeWeight(3);
        // if(detection.label === 'person'){
        //   stroke(0, 255, 0);
        // } else {
        //   stroke(0,0, 255);
        // }
        // rect(detection.x, detection.y, detection.width, detection.height);  
      })
    } 
}