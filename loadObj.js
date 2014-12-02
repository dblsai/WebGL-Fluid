//var objloader = function(){

  
 
    var loadObj = function( filename){

        var vertexGroup = [];
        var normalGroup = [];
        var texcoordGroup = [];
        var indexGroup = [];
        var isReady = false;
        var callbackFunArray = [];

        var loader = new THREE.OBJLoader();
        var eventlistener = function(object){
            content = object;
            console.log("load file: "+filename);
            console.log("children count: " + object.children.length );
            
        //Start parse vertices, normals, indices, and texcoords
            content.traverse( function(child){
            if( child instanceof THREE.Mesh ){
                    var numVertices = child.geometry.vertices.length;
                    var numFaces = child.geometry.faces.length;
                    var numTexcoords = child.geometry.faceVertexUvs[0].length;
                    var vertices = []; 
                    var normals = [];
                    var indices = [];
                    var texcoords = [];
                    console.log("start traverse OBJ");
                    if( numFaces != 0 ){
                        console.log("extracting faces");
                          //Array of texture coordinates of 1st layer texture 
                        var UVs = child.geometry.faceVertexUvs[0]; 

                        //Extract faces info (UVs, normals, indices)
                        for( var i = 0; i < numFaces;i++ ){
                            var offset = child.geometry.faces[i].a;
                            vertices.push( child.geometry.vertices[offset].x);
                            vertices.push( child.geometry.vertices[offset].y);
                            vertices.push( child.geometry.vertices[offset].z);

                            offset = child.geometry.faces[i].b;
                            vertices.push( child.geometry.vertices[offset].x);
                            vertices.push( child.geometry.vertices[offset].y);
                            vertices.push( child.geometry.vertices[offset].z);

                            offset = child.geometry.faces[i].c;
                            vertices.push( child.geometry.vertices[offset].x);
                            vertices.push( child.geometry.vertices[offset].y);
                            vertices.push( child.geometry.vertices[offset].z);

                            indices.push( i*3 );
                            indices.push( i*3+1 );
                            indices.push( i*3+2 );
                     
                            offset = 3*child.geometry.faces[i].a;
                            normals[ 9*i ] = child.geometry.faces[i].normal.x;
                            normals[ 9*i+1 ] = child.geometry.faces[i].normal.y;
                            normals[ 9*i+2 ] = child.geometry.faces[i].normal.z;
                                        
                            offset = 3*child.geometry.faces[i].b; 
                            normals[ 9*i+3 ] = child.geometry.faces[i].normal.x;
                            normals[ 9*i+4 ] = child.geometry.faces[i].normal.y;
                            normals[ 9*i+5 ] = child.geometry.faces[i].normal.z;
                            
                            offset = 3*child.geometry.faces[i].c; 
                            normals[ 9*i+6 ] = child.geometry.faces[i].normal.x;
                            normals[ 9*i+7 ] = child.geometry.faces[i].normal.y;
                            normals[ 9*i+8 ] = child.geometry.faces[i].normal.z;


                            var uv = UVs[i];
                            offset = 2*child.geometry.faces[i].a;
                            texcoords[ 6*i ]   = uv[0].x;
                            texcoords[ 6*i+1 ] = 1.0 - uv[0].y;

                            offset = 2*child.geometry.faces[i].b;
                            texcoords[ 6*i+2 ]   = uv[1].x;
                            texcoords[ 6*i+3 ] = 1.0 - uv[1].y;

                            offset = 2*child.geometry.faces[i].c;
                            texcoords[ 6*i+4 ]   = uv[2].x;
                            texcoords[ 6*i+5 ] = 1.0 - uv[2].y;
                            //console.log( 'vertices: '+vertices);

                        }
                      vertexGroup.push( vertices);
                      normalGroup.push( normals );
                      texcoordGroup.push( texcoords );
                      indexGroup.push( indices );
                    }
                }
            });  // end of traverse
          isReady = true;
          //  console.log( "num of groups: "+vertexGroup.length);
          // console.log("obj normal: " + normalGroup);
          // console.log("obj vertex: " + vertexGroup);
          // console.log("obj texcoord: " +texcoordGroup);
          // console.log("obj indice: " + indexGroup);
        };  //end of event listener
        loader.load( filename, eventlistener );

         return {
            numGroups: function(){
                console.log("before return: " + vertexGroup.length);
                return vertexGroup.length;
            },
            vertices: function(i){
                return vertexGroup[i];
            },
            normals: function(i){
                return normalGroup[i];
            },
            indices: function(i){
                return indexGroup[i];
            },
            texcoords: function(i){
                return texcoordGroup[i];
            },
            // loadFile: function(file){
            //     loadObj(file);
            // }
            isReady: function(){
                return isReady;
            },
            addCallback: function( functor ){
                callbackFunArray[callbackFunArray.length] = functor;
            },
            executeCallBackFunc: function(){
                var i;
                for( i = 0; i < callbackFunArray.length; ++i ){
                    callbackFunArray[i]();
                    //console.log(callbackFunArray[i]);
                }
            }      

        };
    };  //end of loadObj

   
//};


// Model object that creates VBO, IBO and NBO upon creation
var createModel = function(gl,objRaw) {
  var numGroups = objRaw.numGroups();
  var VBO = [];
  var IBO = [];
  var NBO = [];
  var TBO = [];
  var numIndices = [];

  for (var i = 0; i < numGroups; i++) {
    // Initialize buffer objects
    VBO[i] = gl.createBuffer();
    IBO[i] = gl.createBuffer();
    NBO[i] = gl.createBuffer();
    TBO[i] = gl.createBuffer();
    // Add VBO, IBO, NBO and TBO
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objRaw.vertices(i)), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, NBO[i]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objRaw.normals(i)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO[i]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objRaw.indices(i)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, TBO[i]);
   // console.log("texture coord number: " + objRaw.texcoords(i).length);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(objRaw.texcoords(i)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    numIndices.push(objRaw.indices(i).length);
    //console.log("creating Model with indices: "+ objRaw.indices(i).length);
  }

  return {
    VBO: function(i) {
      return VBO[i];
    },
    IBO: function(i) {
      return IBO[i];
    },
    NBO: function(i) {
      return NBO[i];
    }, 
    TBO: function(i){
        return TBO[i];
    },
    numGroups: function() {
      return numGroups;
    },
    numIndices: function(i) {
      return numIndices[i];
    }
  };
};
