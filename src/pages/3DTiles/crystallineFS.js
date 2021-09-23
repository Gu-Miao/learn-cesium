const fs = `
precision highp float;
uniform float u_metallicFactor;
uniform float u_roughnessFactor;
uniform vec3 u_emissiveFactor;
varying vec3 v_normal;
varying vec3 v_positionEC;
const float M_PI = 3.141592653589793;

vec3 lambertianDiffuse(vec3 diffuseColor) {
  return diffuseColor / M_PI;
}

vec3 fresnelSchlick2(vec3 f0, vec3 f90, float VdotH) {
  return f0 + (f90 - f0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

float smithVisibilityG1(float NdotV, float roughness) {
  float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
  return NdotV / (NdotV * (1.0 - k) + k);
}

float smithVisibilityGGX(float roughness, float NdotL, float NdotV) {
  return smithVisibilityG1(NdotL, roughness) * smithVisibilityG1(NdotV, roughness);
}

float GGX(float roughness, float NdotH) {
  float roughnessSquared = roughness * roughness;
  float f = (NdotH * roughnessSquared - NdotH) * NdotH + 1.0;
  return roughnessSquared / (M_PI * f * f);
}

vec3 SRGBtoLINEAR3(vec3 srgbIn) {
  return pow(srgbIn, vec3(2.2));
}

vec3 applyTonemapping(vec3 linearIn) {
#ifndef HDR 
  return czm_acesTonemapping(linearIn);
#else 
  return linearIn;
#endif 
}

vec3 LINEARtoSRGB(vec3 linearIn) {
#ifndef HDR 
  return pow(linearIn, vec3(1.0 / 2.2));
#else 
  return linearIn;
#endif 
}

vec4 base_color = vec4(.1, .2, .7, 1.);

#ifdef USE_IBL_LIGHTING 
uniform vec2 gltf_iblFactor; 
#endif 
#ifdef USE_CUSTOM_LIGHT_COLOR 
#endif 
void main(void) {

  vec3 ng = normalize(v_normal);
  vec3 positionWC = vec3(czm_inverseView * vec4(v_positionEC, 1.0));
  vec3 n = ng;
  if(czm_backFacing()) {
      n = -n;
  }
  vec4 baseColorWithAlpha = base_color;
  vec3 baseColor = baseColorWithAlpha.rgb;
  float metalness = clamp(u_metallicFactor, 0.0, 1.0);
  float roughness = clamp(u_roughnessFactor, 0.04, 1.0);
  vec3 v = -normalize(v_positionEC);
  vec3 lightColorHdr = base_color.rgb;
  vec3 l = normalize(czm_lightDirectionEC);
  vec3 h = normalize(v + l);
  float NdotL = clamp(dot(n, l), 0.001, 1.0);
  float NdotV = abs(dot(n, v)) + 0.001;
  float NdotH = clamp(dot(n, h), 0.0, 1.0);
  float LdotH = clamp(dot(l, h), 0.0, 1.0);
  float VdotH = clamp(dot(v, h), 0.0, 1.0);
  vec3 f0 = vec3(0.04);
  vec3 diffuseColor = baseColor * (1.0 - metalness) * (1.0 - f0);
  vec3 specularColor = mix(f0, baseColor, metalness);
  float alpha = roughness * roughness;
  float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
  vec3 r90 = vec3(clamp(reflectance * 25.0, 0.0, 1.0));
  vec3 r0 = specularColor.rgb;
  vec3 F = fresnelSchlick2(r0, r90, VdotH);
  float G = smithVisibilityGGX(alpha, NdotL, NdotV);
  float D = GGX(alpha, NdotH);
  vec3 diffuseContribution = (1.0 - F) * lambertianDiffuse(diffuseColor);
  vec3 specularContribution = F * G * D / (4.0 * NdotL * NdotV);
  vec3 color = NdotL * lightColorHdr * (diffuseContribution + specularContribution);
#if defined(USE_IBL_LIGHTING) && !defined(DIFFUSE_IBL) && !defined(SPECULAR_IBL) 
  vec3 r = normalize(czm_inverseViewRotation * normalize(reflect(v, n)));
  float vertexRadius = length(positionWC);
  float horizonDotNadir = 1.0 - min(1.0, czm_ellipsoidRadii.x / vertexRadius);
  float reflectionDotNadir = dot(r, normalize(positionWC));
  r.x = -r.x;
  r = -normalize(czm_temeToPseudoFixed * r);
  r.x = -r.x;
  float inverseRoughness = 1.04 - roughness;
  inverseRoughness *= inverseRoughness;
  vec3 sceneSkyBox = textureCube(czm_environmentMap, r).rgb * inverseRoughness;
  float atmosphereHeight = 0.05;
  float blendRegionSize = 0.1 * ((1.0 - inverseRoughness) * 8.0 + 1.1 - horizonDotNadir);
  float blendRegionOffset = roughness * -1.0;
  float farAboveHorizon = clamp(horizonDotNadir - blendRegionSize * 0.5 + blendRegionOffset, 1.0e-10 - blendRegionSize, 0.99999);
  float aroundHorizon = clamp(horizonDotNadir + blendRegionSize * 0.5, 1.0e-10 - blendRegionSize, 0.99999);
  float farBelowHorizon = clamp(horizonDotNadir + blendRegionSize * 1.5, 1.0e-10 - blendRegionSize, 0.99999);
  float smoothstepHeight = smoothstep(0.0, atmosphereHeight, horizonDotNadir);
  vec3 belowHorizonColor = mix(vec3(0.1, 0.15, 0.25), vec3(0.4, 0.7, 0.9), smoothstepHeight);
  vec3 nadirColor = belowHorizonColor * 0.5;
  vec3 aboveHorizonColor = mix(vec3(0.9, 1.0, 1.2), belowHorizonColor, roughness * 0.5);
  vec3 blueSkyColor = mix(vec3(0.18, 0.26, 0.48), aboveHorizonColor, reflectionDotNadir * inverseRoughness * 0.5 + 0.75);
  vec3 zenithColor = mix(blueSkyColor, sceneSkyBox, smoothstepHeight);
  vec3 blueSkyDiffuseColor = vec3(0.7, 0.85, 0.9);
  float diffuseIrradianceFromEarth = (1.0 - horizonDotNadir) * (reflectionDotNadir * 0.25 + 0.75) * smoothstepHeight;
  float diffuseIrradianceFromSky = (1.0 - smoothstepHeight) * (1.0 - (reflectionDotNadir * 0.25 + 0.25));
  vec3 diffuseIrradiance = blueSkyDiffuseColor * clamp(diffuseIrradianceFromEarth + diffuseIrradianceFromSky, 0.0, 1.0);
  float notDistantRough = (1.0 - horizonDotNadir * roughness * 0.8);
  vec3 specularIrradiance = mix(zenithColor, aboveHorizonColor, smoothstep(farAboveHorizon, aroundHorizon, reflectionDotNadir) * notDistantRough);
  specularIrradiance = mix(specularIrradiance, belowHorizonColor, smoothstep(aroundHorizon, farBelowHorizon, reflectionDotNadir) * inverseRoughness);
  specularIrradiance = mix(specularIrradiance, nadirColor, smoothstep(farBelowHorizon, 1.0, reflectionDotNadir) * inverseRoughness);
#ifdef USE_SUN_LUMINANCE 
  float LdotZenith = clamp(dot(normalize(czm_inverseViewRotation * l), normalize(positionWC * -1.0)), 0.001, 1.0);
  float S = acos(LdotZenith);
  float NdotZenith = clamp(dot(normalize(czm_inverseViewRotation * n), normalize(positionWC * -1.0)), 0.001, 1.0);
  float gamma = acos(NdotL);
  float numerator = ((0.91 + 10.0 * exp(-3.0 * gamma) + 0.45 * pow(NdotL, 2.0)) * (1.0 - exp(-0.32 / NdotZenith)));
  float denominator = (0.91 + 10.0 * exp(-3.0 * S) + 0.45 * pow(LdotZenith, 2.0)) * (1.0 - exp(-0.32));
  float luminance = gltf_luminanceAtZenith * (numerator / denominator);
#endif 
  vec2 brdfLut = texture2D(czm_brdfLut, vec2(NdotV, roughness)).rg;
  vec3 IBLColor = (diffuseIrradiance * diffuseColor * gltf_iblFactor.x) + (specularIrradiance * SRGBtoLINEAR3(specularColor * brdfLut.x + brdfLut.y) * gltf_iblFactor.y);
  float maximumComponent = max(max(lightColorHdr.x, lightColorHdr.y), lightColorHdr.z);
  vec3 lightColor = lightColorHdr / max(maximumComponent, 1.0);
  IBLColor *= lightColor;
#ifdef USE_SUN_LUMINANCE 
  color += IBLColor * luminance;
#else 
  color += IBLColor; 
#endif 
#elif defined(DIFFUSE_IBL) || defined(SPECULAR_IBL) 
  const mat3 yUpToZUp = mat3(-1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0);
  vec3 cubeDir = normalize(yUpToZUp * gltf_iblReferenceFrameMatrix * normalize(reflect(-v, n))); 
#ifdef DIFFUSE_IBL 
#ifdef CUSTOM_SPHERICAL_HARMONICS 
  vec3 diffuseIrradiance = czm_sphericalHarmonics(cubeDir, gltf_sphericalHarmonicCoefficients); 
#else 
  vec3 diffuseIrradiance = czm_sphericalHarmonics(cubeDir, czm_sphericalHarmonicCoefficients); 
#endif 
#else 
  vec3 diffuseIrradiance = vec3(0.0); 
#endif 
#ifdef SPECULAR_IBL 
  vec2 brdfLut = texture2D(czm_brdfLut, vec2(NdotV, roughness)).rg;
#ifdef CUSTOM_SPECULAR_IBL 
  vec3 specularIBL = czm_sampleOctahedralProjection(gltf_specularMap, gltf_specularMapSize, cubeDir, roughness * gltf_maxSpecularLOD, gltf_maxSpecularLOD);
#else 
  vec3 specularIBL = czm_sampleOctahedralProjection(czm_specularEnvironmentMaps, czm_specularEnvironmentMapSize, cubeDir, roughness * czm_specularEnvironmentMapsMaximumLOD, czm_specularEnvironmentMapsMaximumLOD);
#endif 
  specularIBL *= F * brdfLut.x + brdfLut.y;
#else 
  vec3 specularIBL = vec3(0.0); 
#endif 
  color += diffuseIrradiance * diffuseColor + specularColor * specularIBL;
#endif 
  color += u_emissiveFactor;
  color = applyTonemapping(color);
  color = LINEARtoSRGB(color);

  vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.);

  // Set color deep by height.
  float deep = clamp((position.z - 50.) / 200. + .5, 0., 3.5);
  vec4 post_color = base_color * vec4(vec3(deep) * 1.2, 1.0);

  // Set scanning lines.
  float time = fract(czm_frameNumber / (60. * 5.));
  float scan = step(0.0015, abs(clamp(position.z / 650., 0., 1.) - time));

  // Set top highlight.

  gl_FragColor = vec4(color + post_color.rgb + ((scan == 0. ? 5. : 1.) * post_color.rgb), 1.0);
}

`

export default fs
