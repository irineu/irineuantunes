function handleOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    document.getElementById("test").innerText = "?" + JSON.stringify(event) + ":" + event.data;
}

function getMove(){
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission()
            .then((state) => {
                if (state === 'granted') {
                    window.addEventListener('devicemotion', handleOrientation);
                } else {
                    console.error('Request to access the orientation was rejected');
                }
            })
            .catch(console.error);
    } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener('devicemotion', handleOrientation);
    }
}

const setup = () => {

    let boxes = [];
    let divBoxes = [];

    let pixelPerMeter = 64;
    let meterPerPixel = 1/pixelPerMeter;

    let maxBoxes = 37

    const genWorld = () => {

        var pl = planck, Vec2 = pl.Vec2;
        var world = pl.World(Vec2(0, -10));

        let maxw = window.innerWidth*meterPerPixel;

        var ground = world.createBody();
        ground.createFixture(pl.Edge(Vec2(0, 0), Vec2(maxw, 0)));
        ground.createFixture(pl.Edge(Vec2(0, 0), Vec2(0, 20)));



        ground.createFixture(pl.Edge(Vec2(maxw, 0), Vec2(maxw, 20)));


        for(let i = 0 ; i < maxBoxes; i++){
            var y = Math.random() * 200 + 10

            var x = (window.innerWidth*meterPerPixel/2) - (Math.random() * 0.2 + 4) + 4;
            // y = 1

            var bd = {};
            bd.type = 'dynamic';
            bd.position = Vec2(x, y);
            bd.angle = Math.random() * 2 * Math.PI - Math.PI;
            bd.angularDamping = 0.02;

            var body = world.createBody(bd);
            body.createFixture(pl.Circle(1), {
                density: 1.0,
                friction: 0.3,
            });
            boxes.push(body);
        }



        /*body.setMassData({
            mass : 1,
            center : Vec2(),
            I : 1
        });*/

        // Make sure you return the world
        return world;
    }

    let world = genWorld();


    for(let i = 0; i < maxBoxes; i++){
        divBoxes.push(document.getElementById("box-" + i));
    }


    function loop() {
        world.step(1 / 60);
        window.requestAnimationFrame(loop);

        //console.log(boxes[0].getTransform());

        for(let i = 0; i < maxBoxes; i++){

            //divBoxes[i].style.border = 20 + 'px';
            divBoxes[i].style.transform = 'rotate('+ boxes[i].getAngle()+'rad)'
            divBoxes[i].style.top = (window.innerHeight - boxes[i].getPosition().y * pixelPerMeter) - (pixelPerMeter * 2 )/2 + 'px';
            divBoxes[i].style.left =  (boxes[i].getPosition().x * pixelPerMeter) - (pixelPerMeter * 2 )/2 + 'px';
        }


    }
    loop();

    document.getElementsByClassName("menu")[0].addEventListener('click', () => {
        document.getElementsByClassName("menu-overlay")[0].classList.add("show")
        document.getElementsByClassName("menu-overlay")[0].classList.remove("hide")
    });

    document.getElementsByClassName("menu-overlay")[0].addEventListener('click', () => {
        document.getElementsByClassName("menu-overlay")[0].classList.add("hide")
        document.getElementsByClassName("menu-overlay")[0].classList.remove("show")
    });


}