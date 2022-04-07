precision highp float;

uniform vec4 u_baseColorFactor;

varying vec3 v_positionEC;
varying vec3 v_normal;

vec4 getPhongColor(vec4 color) {
  vec3 positionToEyeEC = -v_positionEC;

  czm_material material;
  material.diffuse = color.rgb;
  material.specular = 0.0;
  material.shininess = 1.0;
  material.normal = v_normal;
  material.emission = vec3(0.0);
  material.alpha = color.a;

  return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);

}

void main(void) {
  vec4 color = u_baseColorFactor;
  vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.);

  float time = czm_frameNumber / 73.;

  float flow = sin(time) * .25 + .75;
  float deep = clamp(position.z / (200. + 50. * flow) + .5 * flow, 0., 1.5);
  vec4 postColor = color * deep;

  vec4 phongColor = getPhongColor(vec4(postColor.rgb, 1.));

  gl_FragColor = mix(phongColor, postColor, flow - .25);
}
