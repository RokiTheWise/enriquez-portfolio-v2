/* ══════════════════════════════════════════════════════════════
   GLSL shader sources – Hero portrait composite + gravity particles
   ══════════════════════════════════════════════════════════════ */

/* ── Composite vertex shader ──
   Fullscreen quad in clip space (bypasses scene camera).
── */
export const compositeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* ── Composite fragment shader ──
   Crossfades between two portrait textures (current ↔ next).
   Both portraits share the same alpha cutout, so we blend RGB
   and use the destination alpha for the cutout — avoids ghosting.
── */
export const compositeFragment = /* glsl */ `
precision highp float;

uniform sampler2D uCurrentTex;
uniform sampler2D uNextTex;
uniform vec4 uImageBounds;
uniform float uFade;          // 0 = full current, 1 = full next
uniform float uPortraitFade;  // scroll-driven dissolve

varying vec2 vUv;

void main() {
  vec2 boundsMin = uImageBounds.xy;
  vec2 boundsMax = uImageBounds.zw;
  vec2 imgUv = (vUv - boundsMin) / (boundsMax - boundsMin);

  float fadeX = smoothstep(0.0, 0.02, imgUv.x) * smoothstep(0.0, 0.02, 1.0 - imgUv.x);
  float fadeY = smoothstep(0.0, 0.02, 1.0 - imgUv.y) * smoothstep(0.0, 0.15, imgUv.y);
  float inBounds = fadeX * fadeY;

  vec2 safeUv = clamp(imgUv, 0.0, 1.0);
  vec4 cur = texture2D(uCurrentTex, safeUv);
  vec4 nxt = texture2D(uNextTex, safeUv);

  vec3 rgb = mix(cur.rgb, nxt.rgb, uFade);
  float a  = mix(cur.a,   nxt.a,   uFade) * inBounds * (1.0 - uPortraitFade);

  if (a < 0.01) discard;
  gl_FragColor = vec4(rgb, a);
}
`;

/* ── Particle vertex shader ──
   Gravitational repulsion is computed CPU-side and uploaded via aOffset.
── */
export const particleVertex = /* glsl */ `
attribute vec4 aRandom;
attribute vec3 aColor;
attribute vec2 aOffset;

uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = aRandom;
  vColor = aColor;

  vec3 pos = position * uSpread;
  pos.z *= 10.0;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);

  // Sine-wave ambient animation
  float t = uTime;
  mPos.x += sin(t * aRandom.z + 6.28 * aRandom.w) * mix(0.1, 1.5, aRandom.x);
  mPos.y += sin(t * aRandom.y + 6.28 * aRandom.x) * mix(0.1, 1.5, aRandom.w);
  mPos.z += sin(t * aRandom.w + 6.28 * aRandom.y) * mix(0.1, 1.5, aRandom.z);

  // CPU-computed gravitational displacement
  mPos.xy += aOffset;

  vec4 mvPos = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (aRandom.x - 0.5))) / length(mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

/* ── Particle fragment shader ──
   Simple disk with subtle color shimmer.
── */
export const particleFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollFade;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;

  vec3 color = vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);

  float alpha = 0.85 * (1.0 - uScrollFade);
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
