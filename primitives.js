var cubePool ={
 

    vertices: [
            // Front face
            -1.0, -0.65,  1.0,
             1.0, -0.65,  1.0,
             1.0,  0.65,  1.0,
            -1.0,  0.65,  1.0,

            // Back face
            -1.0, -0.65, -1.0,
            -1.0,  0.65, -1.0,
             1.0,  0.65, -1.0,
             1.0, -0.65, -1.0,

            // Top face
            -1.0,  0.65, -1.0,
            -1.0,  0.65,  1.0,
             1.0,  0.65,  1.0,
             1.0,  0.65, -1.0,

            // Bottom face
            -1.0, -0.65, -1.0,
             1.0, -0.65, -1.0,
             1.0, -0.65,  1.0,
            -1.0, -0.65,  1.0,

            // Right face
             1.0, -0.65, -1.0,
             1.0,  0.65, -1.0,
             1.0,  0.65,  1.0,
             1.0, -0.65,  1.0,

            // Left face
            -1.0, -0.65, -1.0,
            -1.0, -0.65,  1.0,
            -1.0,  0.65,  1.0,
            -1.0,  0.65, -1.0,
        ],

    texcoords:[
      // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    ],


    normals:[
           // Front face
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,
          0.0, 0.0, 1.0,

          // Back face
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,

          // Top face
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,
          0.0, 1.0, 0.0,

          // Bottom face
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,
          0.0, -1.0, 0.0,

          // Right face
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,

          // Left face
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
    ],

    indices: [
          0, 1, 2,      0, 2, 3,    // Front face
          4, 5, 6,      4, 6, 7,    // Back face
        //  8, 9, 10,     8, 10, 11,  // Top face
          12, 13, 14,   12, 14, 15, // Bottom face
          16, 17, 18,   16, 18, 19, // Right face
          20, 21, 22,   20, 22, 23  // Left face
    ],

    numIndices : 30

};





var cubeSky ={
 
    vertices: [
            // Front face
            -20.0, -20.0,  20.0,
             20.0, -20.0,  20.0,
             20.0,  20.0,  20.0,
            -20.0,  20.0,  20.0,

            // Back face
            -20.0, -20.0, -20.0,
            -20.0,  20.0, -20.0,
             20.0,  20.0, -20.0,
             20.0, -20.0, -20.0,

            // Top face
            -20.0,  20.0, -20.0,
            -20.0,  20.0,  20.0,
             20.0,  20.0,  20.0,
             20.0,  20.0, -20.0,

            // Bottom face
            -20.0, -20.0, -20.0,
             20.0, -20.0, -20.0,
             20.0, -20.0,  20.0,
            -20.0, -20.0,  20.0,

            // Right face
             20.0, -20.0, -20.0,
             20.0,  20.0, -20.0,
             20.0,  20.0,  20.0,
             20.0, -20.0,  20.0,

            // Left face
            -20.0, -20.0, -20.0,
            -20.0, -20.0,  20.0,
            -20.0,  20.0,  20.0,
            -20.0,  20.0, -20.0,
        ],

    texcoords:[
      // Front face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,

          // Back face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Top face
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,

          // Left face
          0.0, 0.0,
          1.0, 0.0,
          1.0, 1.0,
          0.0, 1.0,
    ],

    indices: [
          0, 1, 2,      0, 2, 3,    // Front face
          4, 5, 6,      4, 6, 7,    // Back face
          8, 9, 10,     8, 10, 11,  // Top face
          12, 13, 14,   12, 14, 15, // Bottom face
          16, 17, 18,   16, 18, 19, // Right face
          20, 21, 22,   20, 22, 23  // Left face
    ],

    numIndices:36

};




var createSphere = function(radius, slices, stacks) {
   var s = {};
   radius = radius || 0.5;
   slices = slices || 32;
   stacks = stacks || 16;
   var vertexCount = (slices+1)*(stacks+1);
   s.vertices = [];
   s.normals = [];
   s.texcoords = [];
   s.indices = [];
   var du = 2*Math.PI/slices;
   var dv = Math.PI/stacks;
   var i,j,u,v,x,y,z;
   var indexV = 0;
   var indexT = 0;
   for (i = 0; i <= stacks; i++) {
      v = -Math.PI/2 + i*dv;
      for (j = 0; j <= slices; j++) {
         u = j*du;
         x = Math.cos(u)*Math.cos(v);
         y = Math.sin(u)*Math.cos(v);
         z = Math.sin(v);
         s.vertices[indexV] = radius*x;
         s.normals[indexV++] = x;
         s.vertices[indexV] = radius*y;
         s.normals[indexV++] = y;
         s.vertices[indexV] = radius*z;
         s.normals[indexV++] = z;
         s.texcoords[indexT++] = j/slices;
         s.texcoords[indexT++] = i/stacks;
      } 
   }
   var k = 0;
   for (j = 0; j < stacks; j++) {
      var row1 = j*(slices+1);
      var row2 = (j+1)*(slices+1);
      for (i = 0; i < slices; i++) {
          s.indices[k++] = row1 + i;
          s.indices[k++] = row2 + i + 1;
          s.indices[k++] = row2 + i;
          s.indices[k++] = row1 + i;
          s.indices[k++] = row1 + i + 1;
          s.indices[k++] = row2 + i + 1;
      }
   }
   s.numIndices = s.indices.length;
   s.radius = radius;
  /* console.log("sphere normal: " + s.normals);
      console.log("sphere vertex: " + s.vertices);
      console.log("sphere texcoord: " + s.texcoords);
      console.log("sphere indice: " + s.indices);
      console.log("sphere indice num: " + s.numIndices);*/
   return s;
}





  var plane = function(detailX, detailY, waterHeight){

    var plane = {};
    plane.vertices = [];
    plane.normals = [];
    plane.texcoords = [];
    plane.indices = [];

    var vertexPtr = 0;
    var indicePtr = 0;
    var texcoordPtr = 0;
    var normalPtr = 0;

    detailX = detailX || 1;
    detailY = detailY || 1;
    waterHeight = waterHeight||0.0;

    for (var y = 0; y <= detailY; y++) {
        var t = y / detailY;
        for (var x = 0; x <= detailX; x++) {
          var s = x / detailX;
         /* plane.vertices[vertexPtr++] = 2 * s - 1.0;
          plane.vertices[vertexPtr++] = waterHeight;
          plane.vertices[vertexPtr++] = 2 * t - 1.0;*/

          plane.vertices[vertexPtr++] = 2 * s - 1.0;
          plane.vertices[vertexPtr++] = 2 * t - 1.0;
          plane.vertices[vertexPtr++] = waterHeight;

          plane.texcoords[texcoordPtr++] = s;
          plane.texcoords[texcoordPtr++] = t;

        /*  plane.normals[normalPtr++] = 0;
          plane.normals[normalPtr++] = 1;
          plane.normals[normalPtr++] = 0;*/

          plane.normals[normalPtr++] = 0;
          plane.normals[normalPtr++] = 0;
          plane.normals[normalPtr++] = 1;

          if (x < detailX && y < detailY) {
            var i = x + y * (detailX + 1);
            plane.indices[indicePtr++] = i;
            plane.indices[indicePtr++] = i + 1;
            plane.indices[indicePtr++] = i + detailX + 1;

           plane.indices[indicePtr++] = i + detailX + 1;
           plane.indices[indicePtr++] = i + 1;
           plane.indices[indicePtr++] = i + detailX + 2;
            }
        }
      }
      plane.numIndices = plane.indices.length;
      // console.log("plane normal: " + plane.normals);
      // console.log("plane vertex: " + plane.vertices);
      // console.log("plane texcoord: " + plane.texcoords);
      // console.log("plane indice: " + plane.indices);
      // console.log("plane indice num: " + plane.numIndices);
    return plane;
  }

  var planeWater = plane(200, 200, 0.0);
  var quadWater = plane(1, 1, 0.0);


  //screen quad geometry

var screenQuad ={
  numIndices : 6,

    vertices: [
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0
    ],
    normals: [
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0
    ],
    texcoords:[
      0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ],
    indices: [
      0, 1, 3,
      3, 1, 2
    ]
};
