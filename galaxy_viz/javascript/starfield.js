
var Starfield = (function() {
  var container;
  var windowWidth, windowHeight, windowHalfWidth, windowHalfHeight;
  var camera, scene, renderer;
  var starfield;
  var mouseX = 0, mouseY = 0;
  var starfieldY = 0;//, starfieldY = 0;
  var year = 2019;
  var dateIndex = 1;
  var caption;
  var dateTable;

  function initialize(element) {
    container = ( typeof element == 'string') ? document.getElementById(element) : element;
    measure();
    setupCamera();
    setupScene();
    setupDates();
    createRenderer();

    // Event listeners
    //$(window).wheel(onScroll);
    document.addEventListener('wheel', onScroll);
    $(document).mousemove(onMouseMove);
    $(window).resize(onResize);
  }

  function measure() {
    windowWidth       = window.innerWidth;
    windowHeight      = window.innerHeight;
    windowHalfWidth   = window.innerWidth / 2;
    windowHalfHeight  = window.innerHeight / 2;
  }

  function setupCamera() {
     if ( !camera ) {
      camera = new THREE.Camera( 75, windowWidth / windowHeight, 1, 3000 );
      camera.position.z = 1000;
     }
  }

  function setupScene() {
    if ( !scene ) {
      starfield = new THREE.Object3D();

	// two different ways to load data
    //fetch('http://localhost/galaxy/data/model_sub.csv')
	//.then(response => response.text())
	//.then((data) => {
	//  console.log(data)
	//})

	d3.text('http://localhost/galaxy/data/model_sub.csv')
	.then( text => d3.csvParseRows(text) )
	.then( d => console.log(d[0]) )
	;
  
  
      addCelestialObjectsTo(starfield, 570, createStar); // group, max func
      addCelestialObjectsTo(starfield, 30, createRedDwarf);

      scene = new THREE.Scene();
      scene.addObject( starfield );
    }
  }


  function setupDates(){
      d3.text('http://localhost/galaxy_soul_trail/data/singleEvents_Coords.csv')
      .then( text => d3.csvParseRows(text) )
      .then( d => {dateTable = d;} )
      ;


      caption = d3.select("#caption");

  }

  function createRenderer() {
    if ( !renderer ) {
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(windowWidth, windowHeight);
      container.appendChild(renderer.domElement);
    }
  }



  function createStar(ctx) {
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0,    'rgba(255,255,255,.8)' );
    gradient.addColorStop(0.2,  'rgba(0,128,128,.6)' );
    gradient.addColorStop(0.4,  'rgba(0,0,128,.6)' );
    gradient.addColorStop(0.6,  'rgba(0,0,64,.4)' );
    gradient.addColorStop(1,    'rgba(0,0,0,.2)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }

  function createRedDwarf(ctx) {
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0,    'rgba(255,255,255,.8)' );
    gradient.addColorStop(0.2,  'rgba(128,128,0,.6)' );
    gradient.addColorStop(0.4,  'rgba(128,0,0,.6)' );
    gradient.addColorStop(0.6,  'rgba(64,0,0,.4)' );
    gradient.addColorStop(1,    'rgba(0,0,0,.2)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }

  function addCelestialObjectsTo(group, max, func) {
    var celObj;
    var material = new THREE.ParticleCanvasMaterial({color: 0xffffff, program: func});

    for(var i=0; i < max; ++i) {
      celObj = new THREE.Particle(material);
      celObj.position.x = Math.random() * 2000 - 1000;
      celObj.position.y = Math.random() * 2000 - 1000;
      celObj.position.z = Math.random() * 2000 - 1000;
      celObj.scale.x = celObj.scale.y = Math.random() * 2;

      group.addChild(celObj);
    }
  }
  
  function addStars(group, csv, func) {
	  var celObj;
	  var material = new THREE.ParticleCanvasMaterial({color: 0xffffff, program: func});
	  
	  //csv.
	  
  }

  // ---------------------------------------------------------------------------
  // -- Event Handlers ---------------------------------------------------------
  // ---------------------------------------------------------------------------

  function onMouseMove(e) {
    mouseX = e.clientX - windowHalfWidth;
    mouseY = e.clientY - windowHalfHeight;
  }

  function onScroll(e){
    year += e.deltaY;
    starfieldY += e.deltaY * 0.01;

    updateDateIndex(e.deltaY)
    
    caption.text(dateTable[dateIndex][1] + " - " + dateTable[dateIndex][2]);
    //console.log(year);
  }

  function updateDateIndex(amount){
    dateIndex += amount
    if ( dateIndex < 1 ){
      dateIndex = 1;
    }
    if(dateIndex > 200){
      dateIndex = 200;
    }
  }

  function onResize() {
    measure();

    if ( camera )
      camera.aspect = windowWidth / windowHeight;

    if ( renderer )
      renderer.setSize(windowWidth, windowHeight);
  }

  // ---------------------------------------------------------------------------

  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function render() {
    
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    starfield.rotation.y = starfieldY;
    //starfield.rotation.y = starfieldX;

    /*
    starfield.rotation.x += 0.005;
    starfield.rotation.y += 0.01;
    */
    //caption.text(dateTable[1][0]);
	
    renderer.render( scene, camera );
  }

  // ---------------------------------------------------------------------------

  return {
    initialize: initialize,
    startAnimation: animate
  }
})();

$(document).ready(function() {
  Starfield.initialize('main');
  Starfield.startAnimation();
});
