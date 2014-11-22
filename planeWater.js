
//(function(){
	
	var planeWater = function(detailX, detailY, waterHeight){
	 // use LOD 4x4
	/*
	    vertices: [
		],
		texcoords:[
		],
		normals:[
		],
		indices: [
		]*/
		var plane = {};
		plane.vertices = [];
		plane.normals = [];
		plane.texcoords = [];
		plane.indices = [];

		var vertexPtr = 0;
		var indicePtr = 0;
		var texcoordPtr = 0;
		var normalPtr = 0;

		detailX = detailX || 4;
		detailY = detailY || 4;
		waterHeight = waterHeight||0.6;

		for (var y = 0; y <= detailY; y++) {
	   		var t = y / detailY;
	   		for (var x = 0; x <= detailX; x++) {
		      var s = x / detailX;
		      plane.vertices[vertexPtr++] = 2 * s - 1.0;
		      plane.vertices[vertexPtr++] = waterHeight;
		      plane.vertices[vertexPtr++] = 2 * t - 1.0;

		      plane.texcoords[texcoordPtr++] = s;
		      plane.texcoords[texcoordPtr++] = t;

		      plane.normals[normalPtr++] = 0;
		      plane.normals[normalPtr++] = 1;
		      plane.normals[normalPtr++] = 0;

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
	  	console.log("plane normal: " + plane.normals);
	  	console.log("plane vertex: " + plane.vertices);
	  	console.log("plane texcoord: " + plane.texcoords);
	  	console.log("plane indice: " + plane.indices);
	  	console.log("plane indice num: " + plane.numIndices);
	 	return plane;
	}

	var planeWater = planeWater();
//}());
