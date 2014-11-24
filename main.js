

    var gl;
    var tracer = {};

   // shader programs
    var poolProg;
    var skyProg;
    var waterProg;
    

    // matrices
    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
    var nmlMatrix = mat4.create();
    var eyePos;
    var radius = 4.0;
    //var azimuth = 0.5*Math.PI;
    var azimuth = 0.0;
    var elevation = 0.0;
    var eye = sphericalToCartesian(radius, azimuth, elevation);
    var center = [0.0, 0.0, 0.0];
    var up = [0.0, 1.0, 0.0];
    var view = mat4.create();
    mat4.lookAt(eye, center, up, view);

  

    // animating 
    var lastTime = 0;
    var xRot = 0;
    var yRot = 0;
    var zRot = 0;

    //mouse interaction
    var time = 0;
    var mouseLeftDown = false;
    var mouseRightDown = false;
    var lastMouseX = null;
    var lastMouseY = null;


    var pool = {};    //a cube without top plane
    var sky = {};    //a cube
    var water = {};   //a plane


 function sphericalToCartesian( r, a, e ) {
        var x = r * Math.cos(e) * Math.cos(a);
        var y = r * Math.sin(e);
        var z = r * Math.cos(e) * Math.sin(a);

        return [x,y,z];
    }

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Initializing WebGL failed.");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    function initShaders() {
     //-----------------------pool------------------------------
        poolProg = gl.createProgram();
        gl.attachShader(poolProg, getShader(gl, "pool-vs") );
        gl.attachShader( poolProg, getShader(gl, "pool-fs") );
        gl.linkProgram(poolProg);

        if (!gl.getProgramParameter(poolProg, gl.LINK_STATUS)) {
            alert("Could not initialize pool shader.");
        }
        gl.useProgram(poolProg);

        poolProg.vertexPositionAttribute = gl.getAttribLocation(poolProg, "aVertexPosition");
        poolProg.textureCoordAttribute = gl.getAttribLocation(poolProg, "aTextureCoord");
        poolProg.vertexNormalAttribute = gl.getAttribLocation(poolProg, "aVertexNormal");

        poolProg.pMatrixUniform = gl.getUniformLocation(poolProg, "uPMatrix");
        poolProg.mvMatrixUniform = gl.getUniformLocation(poolProg, "uMVMatrix");
        poolProg.NmlMatrixUniform = gl.getUniformLocation(poolProg, "uNmlMatrix");
        poolProg.samplerTileUniform = gl.getUniformLocation(poolProg, "uSamplerTile");



     //-----------------------sky------------------------------
        skyProg = gl.createProgram();
        gl.attachShader(skyProg, getShader(gl, "sky-vs") );
        gl.attachShader( skyProg, getShader(gl, "sky-fs") );
        gl.linkProgram(skyProg);

        if (!gl.getProgramParameter(skyProg, gl.LINK_STATUS)) {
            alert("Could not initialize sky shader.");
        }
        gl.useProgram(skyProg);

        skyProg.vertexPositionAttribute = gl.getAttribLocation(skyProg, "aVertexPosition");

        skyProg.pMatrixUniform = gl.getUniformLocation(skyProg, "uPMatrix");
        skyProg.mvMatrixUniform = gl.getUniformLocation(skyProg, "uMVMatrix");
        skyProg.samplerSkyUniform = gl.getUniformLocation(skyProg, "uSamplerSky");

        //-----------------------water---------------------------------

        waterProg = gl.createProgram();
        gl.attachShader(waterProg, getShader(gl, "water-vs") );
        gl.attachShader(waterProg, getShader(gl, "water-fs") );
        gl.linkProgram(waterProg);

        if (!gl.getProgramParameter(waterProg, gl.LINK_STATUS)) {
            alert("Could not initialize water shader.");
        }
        gl.useProgram(waterProg);

        waterProg.vertexPositionAttribute = gl.getAttribLocation(waterProg, "aVertexPosition");
        waterProg.vertexNormalAttribute = gl.getAttribLocation(waterProg, "aVertexNormal");
        //waterProg.textureCoordAttribute = gl.getAttribLocation(waterProg, "aTextureCoord");

        waterProg.pMatrixUniform = gl.getUniformLocation(waterProg, "uPMatrix");
        waterProg.mvMatrixUniform = gl.getUniformLocation(waterProg, "uMVMatrix");
        waterProg.samplerSkyUniform = gl.getUniformLocation(waterProg, "uSamplerSky");
        waterProg.samplerTileUniform = gl.getUniformLocation(waterProg, "uSamplerTile");
        waterProg.eyePositionUniform = gl.getUniformLocation(waterProg,"uEyePosition");
        waterProg.NmlMatrixUniform = gl.getUniformLocation(waterProg, "uNmlMatrix");
    }


    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function initTexture(texture, url) {
        console.log("loading texture: " + url);
        texture.image = new Image();
        texture.image.onload = function () {
            handleLoadedTexture(texture)
        }

        texture.image.src = url;
    }

    function loadTextureSkyBox() {
        var ct = 0;
        var img = new Array(6);
        var urls = [
       // "skybox/posx.jpg", "skybox/negx.jpg", 
        //   "skybox/posy.jpg", "skybox/negy.jpg", 
        //   "skybox/posz.jpg", "skybox/negz.jpg"
       // "skybox/Sky2.jpg","skybox/Sky3.jpg",
      // "skybox/Sky4.jpg","skybox/Sky5.jpg", 
      //  "skybox/Sky0.jpg","skybox/Sky1.jpg"
        "skybox/skyright.jpg","skybox/skyleft.jpg",
       "skybox/skyup.jpg","skybox/skydown.jpg", 
        "skybox/skyback.jpg","skybox/skyfront.jpg"
        ];
        for (var i = 0; i < 6; i++) {
            img[i] = new Image();
            img[i].onload = function() {
                ct++;
                if (ct == 6) {   //upon finish loading all 6 images
                    sky.Texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sky.Texture);
                    var targets = [
                       gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                       gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                       gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ];
                    for (var j = 0; j < 6; j++) {
                      //  console.log("bingding skybox texture: " + targets[j]);
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                        gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    }
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                  
                }
            }
            console.log("loading skybox texture: " + urls[i]);
            img[i].src = urls[i];
        }
    }
  
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms(prog) {
        gl.uniformMatrix4fv(prog.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, mvMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    function initBuffers() {

        //-------pool-------------------------------
        pool.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.VBO); 
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.vertices), gl.STATIC_DRAW);

        pool.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.texcoords), gl.STATIC_DRAW);

        pool.NBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pool.NBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePool.normals), gl.STATIC_DRAW);

        pool.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pool.IBO);
       
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubePool.indices), gl.STATIC_DRAW);
        pool.IBO.numItems = 30; //36;

        //--------sky-----------------------------
        sky.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sky.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeSky.vertices), gl.STATIC_DRAW);

        sky.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sky.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeSky.texcoords), gl.STATIC_DRAW);
     
        sky.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sky.IBO);
       
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeSky.indices), gl.STATIC_DRAW);
        sky.IBO.numItems = 36;

        //----------water--------------------------
        water.VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.vertices), gl.STATIC_DRAW);

        water.NBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.NBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.normals), gl.STATIC_DRAW);

        water.TBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, water.TBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeWater.texcoords), gl.STATIC_DRAW);
     
        water.IBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.IBO);
       
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeWater.indices), gl.STATIC_DRAW);
        water.IBO.numItems = planeWater.numIndices;
    }


   /* function handleMouseDown(event) {
        if( event.button == 2 ) {   //right mouse click
            mouseLeftDown = false;
            mouseRightDown = true;
        } 
        else {    //left button click
            mouseLeftDown = true;
            mouseRightDown = false;

            startInteraction(event.clientX, event.clientY);
        }
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseLeftDown = false;
        mouseRightDown = false;
    }

    function handleMouseMove(event) {   //drag
        if (!(mouseLeftDown || mouseRightDown)) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX;
        var deltaY = newY - lastMouseY;
        
        if( mouseLeftDown ){  // left mouse button  ---> interaction  
            //startInteraction(event.clientX, event.clientY);
 
        }
        else{   //right mouse button   ---> rotation
            xRot +=  deltaY;
            yRot += deltaX;
        }


        lastMouseX = newX;
        lastMouseY = newY;
    }
*/



    function handleMouseDown(event) {
        if( event.button == 2 ) {
            mouseLeftDown = false;
            mouseRightDown = true;
        }
        else {
            mouseLeftDown = true;
            mouseRightDown = false;
            startInteraction(event.clientX, event.clientY);
        }
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }

    function handleMouseUp(event) {
        mouseLeftDown = false;
        mouseRightDown = false;
    }

    function handleMouseMove(event) {
        if (!(mouseLeftDown || mouseRightDown)) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX;
        var deltaY = newY - lastMouseY;
        
        if( mouseLeftDown ) {
            //radius += 0.01 * deltaY;
            //radius = Math.min(Math.max(radius, 2.0), 10.0);
        }
        else {
            azimuth += 0.01 * deltaX;
            elevation += 0.01 * deltaY;
            elevation = Math.min(Math.max(elevation, -Math.PI/2+0.001), Math.PI/2-0.001);
        }
        eye = sphericalToCartesian(radius, azimuth, elevation);
        view = mat4.create();
        mat4.lookAt(eye, center, up, view);

        lastMouseX = newX;
        lastMouseY = newY;
    }

    function startInteraction(x,y){
        updateTracer();
        var ray = vec3.create();
        ray = rayEyeToPixel(x,y);
        var scale = -tracer.eye[1] / ray[1];
        var point = vec3.create([tracer.eye[0] + ray[0]*scale, tracer.eye[1] + ray[1]*scale, tracer.eye[2] + ray[2]*scale] );
   
      //  var pointOnPlane = tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
      console.log("pixel= "+ x +"," +y +"   tracer.eye= " + vec3.str(tracer.eye)+"    ray= " + vec3.str(ray)+"    point= " +vec3.str(point));
        if (Math.abs(point[0]) < 1 && Math.abs(point[2]) < 1) {
        console.log("water plane hit");
       // duringDrag(x, y);
        }
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
       
        mat4.identity(mvMatrix);
        mat4.multiply(mvMatrix,view);
      /*  mat4.translate(mvMatrix, [0.0, 0.0, -4.0]);
        mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
        mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);

        var xAxis = vec3.create( [mvMatrix[0], mvMatrix[4], mvMatrix[8]] );
        var yAxis = vec3.create( [mvMatrix[1], mvMatrix[5], mvMatrix[9]] );
        var zAxis = vec3.create( [mvMatrix[2], mvMatrix[6], mvMatrix[10]] );
        var offset = vec3.create( [mvMatrix[3], mvMatrix[7], mvMatrix[11]] );
        var xNew = vec3.dot(vec3.negate(offset),xAxis);
        var yNew = vec3.dot(vec3.negate(offset),yAxis);
        var zNew = vec3.dot(vec3.negate(offset),zAxis);
       // console.log("offset: "+ vec3.str(vec3.negate(offset)));
        //console.log("axis: "+ vec3.str(xAxis)+"," +vec3.str(yAxis)+","+vec3.str(zAxis) );
        //console.log("eye pos calculation: "+ xNew+"," +yNew+","+zNew );
        eyePos = vec3.create([xNew,yNew,zNew]);*/
        

        mat4.inverse(mvMatrix,nmlMatrix);
        mat4.transpose(nmlMatrix,nmlMatrix);


        drawPool();
        drawSkyBox();
        drawWater();
    }

function drawPool(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(poolProg);

        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);   //define front face
        gl.cullFace(gl.FRONT);   //cull front facing faces

        gl.bindBuffer(gl.ARRAY_BUFFER, pool.VBO);
        gl.vertexAttribPointer(poolProg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.vertexPositionAttribute);

         gl.bindBuffer(gl.ARRAY_BUFFER, pool.NBO);
        gl.vertexAttribPointer(poolProg.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.vertexNormalAttribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, pool.TBO);
        gl.vertexAttribPointer(poolProg.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(poolProg.textureCoordAttribute);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pool.Texture);
        gl.uniform1i(poolProg.samplerTileUniform, 0);

        setMatrixUniforms(poolProg);
         gl.uniformMatrix4fv(poolProg.NmlMatrixUniform, false, nmlMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pool.IBO);
        gl.drawElements(gl.TRIANGLES, pool.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.disable(gl.CULL_FACE);
        gl.disableVertexAttribArray(poolProg.vertexPositionAttribute);
        gl.disableVertexAttribArray(poolProg.textureCoordAttribute);
        gl.disableVertexAttribArray(poolProg.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function drawSkyBox() {

    if (sky.Texture){
       // console.log("drawing sky box", sky.IBO.numItems);
      
     //gl.enable(gl.DEPTH_TEST);
        gl.useProgram(skyProg);
      

        gl.bindBuffer(gl.ARRAY_BUFFER, sky.VBO);
        gl.vertexAttribPointer(skyProg.vertexPositionAttribute , 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(skyProg.vertexPositionAttribute );

        setMatrixUniforms(skyProg);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, sky.Texture);
        gl.uniform1i(skyProg.samplerSkyUniform, 1);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sky.IBO);
        gl.drawElements(gl.TRIANGLES, sky.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(skyProg.vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

function drawWater(){
   // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
     gl.useProgram(waterProg);

   //  console.log("drawing water");

      gl.bindBuffer(gl.ARRAY_BUFFER, water.VBO);
        gl.vertexAttribPointer(waterProg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.vertexPositionAttribute);

        gl.bindBuffer(gl.ARRAY_BUFFER, water.NBO);
        gl.vertexAttribPointer(waterProg.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.vertexNormalAttribute);

    /*    gl.bindBuffer(gl.ARRAY_BUFFER, water.TBO);
        gl.vertexAttribPointer(waterProg.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(waterProg.textureCoordAttribute);*/


        setMatrixUniforms(waterProg);
        gl.uniformMatrix4fv(waterProg.NmlMatrixUniform, false, nmlMatrix);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, sky.Texture);
        gl.uniform1i(waterProg.samplerSkyUniform, 1);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pool.Texture);
        gl.uniform1i(waterProg.samplerTileUniform,0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.IBO);
        gl.drawElements(gl.TRIANGLES, water.IBO.numItems, gl.UNSIGNED_SHORT, 0);

        gl.uniform3fv(waterProg.eyePositionUniform, eye);

       gl.disableVertexAttribArray(waterProg.vertexPositionAttribute);
        //gl.disableVertexAttribArray(waterProg.textureCoordAttribute);
        gl.disableVertexAttribArray(waterProg.vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

}

function updateTracer(){
 // tracer.eye = vec3.create(eyePos);
 tracer.eye = vec3.create(eye);
 // console.log("eyePos = " + vec3.str(eyePos));
 // console.log("tracer.eye = " + vec3.str(tracer.eye));
  var v = gl.getParameter(gl.VIEWPORT);   //{0,0,canvas.width,canvas.height}
  //var m = gl.modelviewMatrix.m;
  var point00 = vec3.create( [v[0], v[1], 1] );  // {x,y,depth}
  var point10 = vec3.create( [v[0]+v[2], v[1], 1] );
  var point01 = vec3.create( [v[0], v[1]+v[3], 1] ); 
  var point11 = vec3.create( [v[0]+v[2], v[1]+v[3], 1]);   
  //console.log("viewport data: " +v[0] + "," + v[1] + "," + v[2] + "," + v[3]);
  //console.log("point data: " + vec3.str(point00) + "," +  vec3.str(point10) + "," + vec3.str(point01) + "," + vec3.str(point11));

  tracer.ray00 = vec3.unproject(point00, mvMatrix, pMatrix, v);
 // vec3.subtract(tracer.ray00, tracer.eye, tracer.ray00);

  tracer.ray10 = vec3.unproject(point10, mvMatrix, pMatrix, v);
  //vec3.subtract(tracer.ray00, tracer.eye, tracer.ray10);

  tracer.ray01 = vec3.unproject(point01, mvMatrix, pMatrix, v);
  //vec3.subtract(tracer.ray00, tracer.eye, tracer.ray01);

 tracer.ray11 = vec3.unproject(point11, mvMatrix, pMatrix, v);
 // vec3.subtract(tracer.ray00, tracer.eye, tracer.ray11);
 console.log("tracer data: " + vec3.str(tracer.ray00) + "," +  vec3.str(tracer.ray10) + "," + vec3.str(tracer.ray01) + "," + vec3.str(tracer.ray11));
  tracer.viewport = v;
}

function rayEyeToPixel(h,v){   //shoots ray from eye to a pixel, returns unit ray direction
    var ray = vec3.create();

    var x = (h - tracer.viewport[0]) / tracer.viewport[2];
    var y = 1.0 - (v - tracer.viewport[1]) / tracer.viewport[3];

    //console.log("coord is: "+x+","+y);
    var rayY0 = vec3.create();
    vec3.lerp(tracer.ray00, tracer.ray10, x, rayY0);
    var rayY1 = vec3.create();
    vec3.lerp(tracer.ray01, tracer.ray11, x, rayY1);
    vec3.lerp(rayY0, rayY1, y, ray);
    vec3.normalize(ray,ray);
   // console.log("the ray passing the pixel is " + vec3.str(ray));
    return ray;

}

 
function drawRipple(x,y){   //draw ripple with left mouse click
    rayEyeToPixel(x,y);
console.log(x + "," +y);
    //var pointOnPlane = tracer.eye.add(ray.multiply(-tracer.eye.y / ray.y));
      //  water.addDrop(pointOnPlane.x, pointOnPlane.z, 0.03, 0.01);
}

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

          //  xRot += (90 * elapsed) / 1000.0;
           // yRot += (90 * elapsed) / 1000.0;
           //zRot += (90 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }


    function tick() {
        requestAnimFrame(tick);
        drawScene();
        drawSkyBox()
        animate();
    }


    function webGLStart() {
        var canvas = document.getElementById("the-canvas");
        initGL(canvas);

        canvas.onmousedown = handleMouseDown;
        canvas.oncontextmenu = function(ev) {return false;};
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;


        initShaders();
        initBuffers();

       // initTexture();
       pool.Texture = gl.createTexture();
       initTexture(pool.Texture, "tile/tile.png");
       //initTexture(pool.Texture, "tile/tile2.jpg");
     
       loadTextureSkyBox(); 

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }


