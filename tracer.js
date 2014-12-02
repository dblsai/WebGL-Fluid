function initTracer(){
 // tracer.eye = vec3.create(eyePos);
 tracer.eye = vec3.create(eye);

  var v = gl.getParameter(gl.VIEWPORT);   //{0,0,canvas.width,canvas.height}
  //var m = gl.modelviewMatrix.m;
  var point00 = vec3.create( [v[0], v[1], 1] );  // {x,y,depth}
  var point10 = vec3.create( [v[0]+v[2], v[1], 1] );
  var point01 = vec3.create( [v[0], v[1]+v[3], 1] ); 
  var point11 = vec3.create( [v[0]+v[2], v[1]+v[3], 1]);   
  //console.log("viewport data: " +v[0] + "," + v[1] + "," + v[2] + "," + v[3]);
  //console.log("point data: " + vec3.str(point00) + "," +  vec3.str(point10) + "," + vec3.str(point01) + "," + vec3.str(point11));

  tracer.ray00 = vec3.unproject(point00, mvMatrix, pMatrix, v);
  vec3.subtract(tracer.ray00, tracer.eye, tracer.ray00);

  tracer.ray10 = vec3.unproject(point10, mvMatrix, pMatrix, v);
  vec3.subtract(tracer.ray10, tracer.eye, tracer.ray10);

  tracer.ray01 = vec3.unproject(point01, mvMatrix, pMatrix, v);
  vec3.subtract(tracer.ray01, tracer.eye, tracer.ray01);

 tracer.ray11 = vec3.unproject(point11, mvMatrix, pMatrix, v);
  vec3.subtract(tracer.ray11, tracer.eye, tracer.ray11);

 //console.log("initial tracer: \n" + vec3.str(tracer.ray00) + "\n" +  vec3.str(tracer.ray10) + "\n" + vec3.str(tracer.ray01) + "\n" + vec3.str(tracer.ray11));
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

function rayIntersectSphere(origin, ray, center, radius){ // ray sphere intersection
  var offset = vec3.create();
  var theRay = vec3.create(ray);
  var theCenter = vec3.create(center);
  var theOrigin = vec3.create(origin);
  vec3.subtract(theOrigin, theCenter, offset);
//console.log("origin: " + vec3.str(theOrigin) + "\nray: "+vec3.str(theRay) + "\ncenter" + vec3.str(theCenter)+"\noffset"+vec3.str(offset));
  var a = vec3.dot(theRay, theRay);
  var b = 2.0 * vec3.dot(theRay, offset);
  var c = vec3.dot(offset, offset) - radius * radius;
  var discriminant = b * b - 4.0* a * c;

//console.log("a: " + a + "\nb: "+b + "\nc" + c+"\ndiscriminant"+discriminant);
  if (discriminant > 0.0) {
    t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
    hit = vec3.create();
    vec3.scale(theRay, t, theRay);
    //console.log("the scaled ray: "+ vec3.str(theRay));
    vec3.add(theOrigin, theRay, hit);
   // console.log("hit t: " + t+"\nhit point: " + vec3.str(hit));
    normal =  vec3.create(hit);
    normal = vec3.subtract(normal, theCenter);
    normal = vec3.scale(normal, 1.0/radius);
    //console.log("hit point: " + vec3.str(hit) + "\nhit normal: "+vec3.str(normal));
    return hit;
  }
  return null;
}