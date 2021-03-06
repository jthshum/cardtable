function createEmptyStage() {
    var stage = new PIXI.Container();

    // Create title text
    var basicText = new PIXI.Text('Card Table');
    basicText.x = window.innerWidth/2 - 50;
    basicText.y = 10;

    stage.addChild(basicText);

    return stage;
}

function createDragStartHandler(card) {
    return function(event)
    {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
        this.dragStartTime = Date.now();

        // Track the mouse position when dragging started
        this.sx = this.dx = this.data.getLocalPosition(card).x * card.scale.x;
        this.sy = this.dy = this.data.getLocalPosition(card).y * card.scale.y;

        this.lastLocalPosition = this.data.getLocalPosition(this.parent);

        // Bring to front (wtf is life)
        parent = this.parent;
        parent.removeChild(this);
        parent.addChild(this);
    }
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

    var elapsedTime = Math.abs(Date.now() - this.dragStartTime);
    if (elapsedTime < 200) { // TODO: check that the mouse hasn't move too far either
      console.log("tap");
    }
}

function onDragMove() {
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        var damping = 0.05;
        var friction = 0.01;

        var comAngle = Math.atan2(this.dy - this.anchor.y * this.scale.y, this.dx - this.anchor.x * this.scale.x);
        var targetAngle = Math.atan2(newPosition.y - this.lastLocalPosition.y, newPosition.x - this.lastLocalPosition.x);

        var dir = Math.cos(comAngle) * Math.sin(targetAngle) - Math.cos(targetAngle) * Math.sin(comAngle);
        var magnitude = Math.sqrt(Math.pow(newPosition.y - this.lastLocalPosition.y, 2),
                                  Math.pow(newPosition.x - this.lastLocalPosition.x, 2)) / 50.0;
        console.log(magnitude);

        //if (dir * damping > friction)
            this.rotation += dir * magnitude;
        //this.rotation = (this.rotation - angle) * damping;
        //console.log(this.rotation, angle);
        var theta = this.rotation;
        //console.log();

        this.dx = this.sx * Math.cos(theta) - this.sy * Math.sin(theta);
        this.dy = this.sx * Math.sin(theta) + this.sy * Math.cos(theta);
        this.position.x = newPosition.x - this.dx;
        this.position.y = newPosition.y - this.dy;

        this.lastLocalPosition = newPosition;
    }
}

function onMouseOver() {
    this.tint = 0x93CCEA;
}

function onMouseOut() {
    this.tint = 0xFFFFFF;
}

function createCard(x, y) {
    // Create a new Sprite using the texture
    var card = new PIXI.Sprite.fromFrame(Math.floor(Math.random() * 8 + 2) + "_of_clubs.png");

    card.buttonMode = true; // Show hand cursor on hover
    card.interactive = true;

    card
        // events for drag start
        .on('mousedown', createDragStartHandler(card))
        .on('touchstart', createDragStartHandler(card))
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove)
        // events for mouseover
        .on('mouseover', onMouseOver)
        .on('mouseout', onMouseOut);

    // Center the sprite's anchor point
    card.anchor.set(0.5);

    // Move the sprite to its designated position
    card.position.x = x;
    card.position.y = y;
    card.width = 100;
    card.height = 145;

    return card;
}

function loadCardTable(options) {
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,
                                           { backgroundColor : options.backgroundColor });

    document.body.appendChild(renderer.view);

    stage = createEmptyStage();

    PIXI.loader
          .add('assets/cards.json')
          .load(function() {
      // Keep track of our cards so we can iterate over them later
      stage.cards = [];
      for (var i = 0; i < 10; i++)
      {
          card = createCard(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
          stage.cards.push(card);
          stage.addChild(card);
      }
    });


    function animate() {
        requestAnimationFrame(animate);

        // render the container
        renderer.render(stage);
    }

    animate();

//    window.onresize = function (event){
//        var w = window.innerWidth;
//        var h = window.innerHeight;
//        //this part resizes the canvas but keeps ratio the same
//        renderer.view.style.width = w + "px";
//        renderer.view.style.height = h + "px";
//        //this part adjusts the ratio
//        renderer.resize(w,h);
//    }
}

window.onload = function() {
    loadCardTable({ backgroundColor: 0x119955 });
}

