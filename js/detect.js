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
  document.getElementById("vis").innerHTML = "<h4>Done! Now show me.</h4>";
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

      if(lab=="cell phone"){
        
        document.getElementById("vis").innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 203 148.27">
  <g id="wand">
      <g class="cls-1">
          <path d="M194.63,152.18v-7.76C194.6,147,194.6,149.59,194.63,152.18Z" transform="translate(-10 -31.06)"/>
      </g>
      <rect class="cls-2" x="5.07" y="129.83" width="117.08" height="17.1" transform="translate(-77.95 30.6) rotate(-35.06)"/>
      <rect class="cls-3" x="106.38" y="88.26" width="32.89" height="17.1" transform="translate(-43.33 57.07) rotate(-35.06)"/>
      <ellipse class="cls-4" cx="136.21" cy="87.42" rx="3.29" ry="8.55" transform="translate(-35.5 63.06) rotate(-35.06)"/>
      <ellipse class="cls-2" cx="15.6" cy="172.07" rx="3.29" ry="8.55" transform="translate(-106.02 9.13) rotate(-35.06)"/>
      <ellipse class="cls-3" cx="109.5" cy="106.16" rx="3.29" ry="8.55" transform="translate(-51.12 51.12) rotate(-35.06)"/>
      <path class="cls-5" d="M138.71,85.25s4.26,6.06,2.68,9L20.15,179.32s-3.27.49-7.53-5.57Z" transform="translate(-10 -31.06)"/>
  </g>
  <g id="stars">
      <g id="star1">
          <polygon class="cls-6" points="142.22 4.88 138.59 13.13 147.13 17.7 137.94 19.78 139.9 28.82 132.07 23.15 125.96 29.86 125.38 20.71 115.81 20.03 122.93 14.3 117.1 6.74 126.55 8.74 128.85 0 133.51 8.22 142.22 4.88"/>
          <polygon class="cls-7" points="142.29 4.89 136.56 13.87 144.96 17.35 136.17 18.98 138.3 26.2 131.33 20.74 125.88 29.85 132.06 23.11 139.91 28.82 137.95 19.81 147.12 17.74 138.59 13.11 142.29 4.89"/>
      </g>
      <g id="star2">
          <polygon class="cls-6" points="166.3 14.45 165.13 17.09 167.87 18.55 164.93 19.22 165.55 22.12 163.04 20.3 161.09 22.45 160.9 19.52 157.83 19.3 160.11 17.46 158.25 15.04 161.27 15.68 162.01 12.88 163.51 15.52 166.3 14.45"/>
          <polygon class="cls-7" points="166.32 14.45 164.48 17.33 167.18 18.44 164.36 18.96 165.04 21.28 162.81 19.53 161.06 22.45 163.04 20.29 165.56 22.12 164.93 19.23 167.87 18.57 165.13 17.08 166.32 14.45"/>
      </g>
      <g id="star3">
          <polygon class="cls-6" points="202.01 38.12 194.78 46.34 203 54.75 191.61 53.79 190.56 64.97 183.57 55.54 174.05 61.06 176.73 50.27 165.91 45.98 176.24 41.95 172.26 31.08 182.46 36.84 188.33 27.58 190.71 38.8 202.01 38.12"/>
          <polygon class="cls-7" points="202.08 38.15 192.17 46.45 200.62 53.55 189.85 52.21 189.67 61.34 183.6 52.48 173.96 61.03 183.58 55.49 190.57 64.97 191.6 53.83 202.97 54.79 194.8 46.31 202.08 38.15"/>
      </g>
      <g id="star4">
          <polygon class="cls-6" points="155.07 63.05 153.01 67.75 157.87 70.35 152.64 71.52 153.75 76.67 149.3 73.44 145.83 77.25 145.5 72.05 140.06 71.67 144.1 68.41 140.79 64.11 146.16 65.25 147.47 60.28 150.13 64.95 155.07 63.05"/>
          <polygon class="cls-7" points="155.11 63.06 151.86 68.17 156.63 70.14 151.63 71.07 152.84 75.17 148.88 72.07 145.78 77.25 149.29 73.42 153.76 76.67 152.65 71.54 157.86 70.36 153.01 67.73 155.11 63.06"/>
      </g>
  </g>
`;
        
      }else if(lab=="couch"){
        document.getElementById("vis").innerHTML = `
        <svg version="1.1" id="tv-kinect" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 71 897 493" style="enable-background:new 0 71 897 493;" xml:space="preserve">
        <g>
          <rect x="106" y="80" class="st0" width="689.4" height="400.9" />
          <path class="st0" d="M782.7,471H115.1V91.9h667.6v298.6V471z" />
        </g>
        <rect x="373" y="480.9" class="st1" width="155" height="50.1" />
        <polyline class="st1" points="547.9,504 567,546 335,546 354.9,504 " />
        <polyline class="st1" points="373,504 354.9,504 335,546 567,546 547.9,504 528,504 " />
      </svg>`;
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