alarm = "";
status = "";
objects = [];

function preload() {
    alarm = loadSound("alarm.mp3")
}

function setup() {
    canvas = createCanvas(640, 420);
    canvas.center();
    Video = createCapture(VIDEO);
    Video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects";
}

function modelLoaded() {
    console.log("Model Loaded!")
    status = true;
}

function gotResult(error, results) {
    if (error) {
        console.log(error);
    }
    console.log(results);
    objects = results;
}

function draw() {
    image(Video, 0, 0, 640, 420);

    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(Video, gotResult);

        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status : Object Detected";
            document.getElementById("number").innerHTML = "Number of objects detected are : " + objects.length;

            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + "" + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == 'person') {
                document.getElementById("number").innerHTML = "Prisoner Found" + objects.length;
                alarm.stop();

            } else {
                document.getElementById("number").innerHTML = "Prisoner Not Found" + objects.length;
                alarm.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("number").innerHTML = "Prisoner Not Found" + objects.length;
            alarm.play();
        }
    }
}