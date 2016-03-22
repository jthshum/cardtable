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
        console.log(event);
        if (event.data.originalEvent.altKey) {
            this.tint = 0;
        } else {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;

            // Track the mouse position when dragging started
            this.sx = this.data.getLocalPosition(card).x * card.scale.x;
            this.sy = this.data.getLocalPosition(card).y * card.scale.y;

            // Bring to front (wtf is life)
            parent = this.parent;
            parent.removeChild(this);
            parent.addChild(this);
        }
    }
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x - this.sx;
        this.position.y = newPosition.y - this.sy;
    }
}

function onMouseOver() {
    this.tint = 0x93CCEA;
}

function onMouseOut() {
    this.tint = 0xFFFFFF;
}

function createCard(texture, x, y) {
    // Create a new Sprite using the texture
    var card = new PIXI.Sprite(texture);

    card.buttonMode = true; // Show hand cursor on hover
//    card.interactive = true;
//
//    card
//        // events for drag start
//        .on('mousedown', createDragStartHandler(card))
//        .on('touchstart', createDragStartHandler(card))
//        // events for drag end
//        .on('mouseup', onDragEnd)
//        .on('mouseupoutside', onDragEnd)
//        .on('touchend', onDragEnd)
//        .on('touchendoutside', onDragEnd)
//        // events for drag move
//        .on('mousemove', onDragMove)
//        .on('touchmove', onDragMove)
//        // events for mouseover
//        .on('mouseover', onMouseOver)
//        .on('mouseout', onMouseOut);

    // Center the sprite's anchor point
    card.anchor.set(0.5);

    // Move the sprite to its designated position
    card.position.x = x;
    card.position.y = y;
    card.width = 100;
    card.height = 125;

    return card;
}

function loadCardTable(options) {
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,
                                           { backgroundColor : options.backgroundColor });

    document.body.appendChild(renderer.view);

    let scale = scaleToWindow(renderer.view);
    let t = new Tink(PIXI, renderer.view, scale);

    //TINK Pointer
    pointer = t.makePointer();
    pointer.x = pointer.x / scale;
    pointer.y = pointer.y / scale;
    //pointer.press = () => console.log("The pointer was pressed");
    //pointer.release = () => console.log("The pointer was released");
    //pointer.tap = () => console.log("The pointer was tapped");

    stage = createEmptyStage();

    // Create the card texture

    var texture = PIXI.Texture.fromImage('assets/card.png');

    // Keep track of our cards so we can iterate over them later
    //stage.cards = [];
    for (var i = 0; i < 10; i++)
    {
        card = createCard(texture, Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
        t.makeDraggable(card);
        t.makeInteractive(card);
        card.press = () => console.log("pressed");
        card.release = () => console.log("released");
        card.over = () => console.log("over");
        card.out = () => console.log("out");
        card.tap = () => console.log("tapped");
        //stage.cards.push(card);
        stage.addChild(card);
    }

    function animate() {
        requestAnimationFrame(animate);

        t.update();
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

