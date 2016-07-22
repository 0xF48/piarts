uniform float amplitude;
uniform float time;

attribute vec3 displacement;
attribute vec3 customColor;
attribute float customOpacity;

varying vec3 vColor;
varying float vOpacity;

void main() {
	vColor = customColor;
	vOpacity = customOpacity;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position * time * 2.0, time );
}