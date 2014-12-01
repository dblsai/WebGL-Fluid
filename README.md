WebGL-Interactive-Fluid
==================================================

This project requires advanced graphics card together with a WebGL capable browser. 

Please also ensure that you have below WebGL extensions, `OES_texture_float`, `OES_texture_float_linear`, `WEBGL_depth_texture`, 
`OES_standard_derivatives`.  
Recommendation is to use latest Firefox / Chrome running on GPU.

[Live Demo](http://dblsai.github.io/WebGL-Fluid)     
[Video Demo](https://www.youtube.com/watch?v=Wq27HIlzpmQ&feature=youtu.be) 

FEATURES
-------------------------------------------------------------------------------
* **Raytraced Reflection & Refraction**  
![Still Water](/pics/Alpha.png)  

* **Mouse Interaction**  
![Mouse](/pics/screenshotmouse.gif)    

* **Sphere Interaction**  
![Sphere](/pics/screenshotsphere.gif)    

* **Caustics**  
![Caustic1](/pics/BetaMouse.png)   

Computing underwater caustics accurately is a complex process: millions of individual photons are involved.  

Here we simplify the computation process by making some assumptions:  
* `Sun is directly above`  
* `floor is lit by rays emanating vertically above the point of interest: caustics will be maximal for vertical rays and will not be as visible for rays entering water sideways`  

for each point we calculate two refract rays, one is using vertical normal and the other is using the real normal. And we get the caustic value by compare the two refract rays, Then write the caustic value to the caustic map.


WATER SIMULATION
-------------------------------------------------------------------------------
To complete water simulation, a gl.RGBA float texture is used to store the simulation data. It is in the format of 
`[height.y, normal.x, normal.z, speed.y]`.  
In the Height Map shader, or the sphere move simulation, `height.y` is updated by mouse click/sphere movement.  
In the Normal Map shader, `normal.x` and `normal.z` is updated with new height information. `normal.y` can be recovered
when used.  
In the step simulation, `speed.y` is calculated based on new height and normal information. the speed is also attenuated 
to eventually stop the wave pattern.    
Ad the end, the texture `[height.y, normal.x, normal.z, speed.y]` is passed into water mesh shaders as useful information to render 
out the water simualtion.  

* **Height Map**   
![HeightMap](/pics/HeightMap.png)  
As you can see, the height of vertex is changed after this shader.  

* **Normal Map**    
![HeightMap](/pics/NormalMap.png)  
The normal is calculated and shaded correctly after this shader.  

* **Step Simulation**    
![HeightMap](/pics/Simulation.png)  
The wave propagates and attenuates due to this shader.  

* **Sphere Move Simulation**  
This shader calculates wave pattern based on sphere movement. 
![Caustic2](/pics/BetaCaustics.png) 


PERFORMANCE EVALUATION
-------------------------------------------------------------------------------

![Analysis] (/pics/Analysis.png)

As you can see, as more simulation shader added into the pipeline, the performance evetually drops. 
But all the fps is above 60, which means our WebGL Water is truly fast and real-time.  

INTERACTION
-------------------------------------------------------------------------------
* Right Mouse Button - rotate  
* Left Mouse Button - interact  
* Middle Mouse Wheel - zoom  


REFERRENCES
-------------------------------------------------------------------------------
* WebGL Water by Evan Wallace : [Evan Wallace](http://madebyevan.com/webgl-water/) 
* Water Caustic: [GPU Gem](http://http.developer.nvidia.com/GPUGems/gpugems_ch02.html)
* WebGL Rendering to Texture: [Learing WebGL](http://learningwebgl.com/blog/?p=1786)

