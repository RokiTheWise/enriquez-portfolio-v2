/* ══════════════════════════════════════════════════════════════
   GLSL shader sources – Kinetic Particle & Metaball Reveal
   ══════════════════════════════════════════════════════════════ */

/* ── Simplex 3D noise (Ashima Arts / Stefan Gustavson) ── */
const noise3D = /* glsl */ `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/* ── Fullscreen quad vertex shader ──
   Shared by mask pass (combined decay + metaball field).
── */
export const fullscreenVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* ── Mask fragment shader ──
   Combined decay + metaball field in a single pass.
   Reads previous FBO, decays it, computes the Gaussian metaball field
   from trail points, and outputs max(decayed_prev, new_field).
   Organic noise distorts field boundaries.
── */
export const maskFragment = /* glsl */ `
precision highp float;

${noise3D}

uniform sampler2D uPrevFrame;
uniform float uDecay;
uniform vec2 uResolution;
uniform vec3 uPoints[15]; // xy = pixel position (Y-up), z = radius
uniform float uIntensities[15];
uniform float uTime;
uniform float uScrollExpand;

varying vec2 vUv;

void main() {
  // Decay previous frame
  float prev = texture2D(uPrevFrame, vUv).r * uDecay;

  // Compute current metaball field (sum of Gaussians)
  vec2 pixelPos = vUv * uResolution;

  float field = 0.0;
  for (int i = 0; i < 15; i++) {
    vec2 diff = pixelPos - uPoints[i].xy;
    float radius = max(uPoints[i].z, 1.0);
    float d = length(diff) / radius;
    float falloff = exp(-d * d * 3.0);
    field += falloff * uIntensities[i];
  }

  // Organic noise on field boundaries
  float edgeNoise = snoise(vec3(pixelPos * 0.004, uTime * 0.8));
  field += edgeNoise * 0.08 * smoothstep(0.02, 0.2, field);

  // ── Scroll-driven expanding wipe from viewport center ──
  if (uScrollExpand > 0.0) {
    vec2 center = uResolution * 0.5;
    float maxDist = length(uResolution * 0.5);
    float dist = length(pixelPos - center) / maxDist;

    float radius2 = uScrollExpand * 1.5;
    float wipeNoise = snoise(vec3(pixelPos * 0.003, uTime * 0.3)) * 0.08;
    float scrollField = 1.0 - smoothstep(radius2 - 0.2 + wipeNoise, radius2 + wipeNoise, dist);

    field = max(field, scrollField);
  }

  // Max of decayed previous and new field — persistent trail
  float result = max(prev, field);

  gl_FragColor = vec4(vec3(result), 1.0);
}
`;

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
   Casual portrait always visible (default state).
   Metaball mask drives casual→business linear mix.
   Alpha from portrait textures (cutout), NOT from mask.
   Refractive shimmer at mask edges (0.4–0.7).
   Ghost layer outside image bounds.
── */
export const compositeFragment = /* glsl */ `
precision highp float;

${noise3D}

uniform sampler2D uCasualTex;
uniform sampler2D uBusinessTex;
uniform sampler2D uMaskTex;
uniform vec4 uImageBounds;
uniform float uTime;
uniform float uScrollWipe;

varying vec2 vUv;

void main() {
  // ── Sample raw mask, then distort UV by noise scaled by mask ──
  // Where mask = 0 the distortion is zero → clean, flicker-free background
  float rawMask = texture2D(uMaskTex, vUv).r;

  vec2 distortion = vec2(
    snoise(vec3(vUv * 12.0, uTime * 0.4)),
    snoise(vec3(vUv * 12.0 + 50.0, uTime * 0.4))
  ) * 0.005;
  vec2 maskLookup = vUv + distortion * rawMask;
  float distortedMask = texture2D(uMaskTex, maskLookup).r;

  // ── Metaball threshold on distorted mask ──
  float metaball = smoothstep(0.35, 0.42, distortedMask);

  // ── Refractive shimmer: specular boost at mask edges (0.4–0.7) ──
  float edgeHighlight = smoothstep(0.4, 0.55, distortedMask)
                      * (1.0 - smoothstep(0.55, 0.7, distortedMask));
  float shimmer = edgeHighlight * 0.1;

  // ── Image bounds (edge fade) ──
  vec2 boundsMin = uImageBounds.xy;
  vec2 boundsMax = uImageBounds.zw;
  vec2 imgUv = (vUv - boundsMin) / (boundsMax - boundsMin);

  // X-axis fade (left/right edges)
  float fadeX = smoothstep(0.0, 0.02, imgUv.x) * smoothstep(0.0, 0.02, 1.0 - imgUv.x);

  // Y-axis fade (top edge crisp, bottom edge smooth gradient fade)
  float fadeY = smoothstep(0.0, 0.02, 1.0 - imgUv.y) * smoothstep(0.0, 0.15, imgUv.y);

  float inBounds = fadeX * fadeY;

  // ── Sample portraits ──
  vec2 safeUv = clamp(imgUv, 0.0, 1.0);
  vec4 casual = texture2D(uCasualTex, safeUv);
  vec4 business = texture2D(uBusinessTex, safeUv);

  vec3 blendedRgb = mix(casual.rgb, business.rgb, metaball) + shimmer;
  float portraitAlpha = casual.a * inBounds;

  // ── Ghost layer: continuous everywhere, fades under the portrait ──
  // No if/else split → no visible rectangle at image boundary
  float ghost = smoothstep(0.05, 0.3, rawMask) * 0.08 * (1.0 - portraitAlpha);

  // ── Composite: portrait over ghost (Porter-Duff "over") ──
  float outAlpha = portraitAlpha + ghost;
  vec3 outRgb = vec3(0.0);
  if (outAlpha > 0.01) {
    outRgb = (blendedRgb * portraitAlpha + vec3(0.65) * ghost) / outAlpha;
  }

  // ── Scroll wipe: expanding solid overlay driven by mask ──
  float wipeField = smoothstep(0.05, 0.4, rawMask) * uScrollWipe;
  vec3 wipeColor = vec3(0.961, 0.957, 0.953); // #f5f4f3

  float finalAlpha = max(outAlpha, wipeField);
  if (finalAlpha < 0.01) discard;

  // Color: existing content where it exists, wipe color elsewhere
  vec3 baseColor = outAlpha > 0.01 ? outRgb : wipeColor;
  vec3 finalRgb = mix(baseColor, wipeColor, wipeField);

  gl_FragColor = vec4(finalRgb, finalAlpha);
}
`;

/* ── Particle vertex shader ──
   CPU displacement + GPU wake shiver from uMaskTex.
   Particles physically react when the fluid trail passes over them.
── */
export const particleVertex = /* glsl */ `
attribute vec4 aRandom;
attribute vec3 aColor;
attribute vec2 aOffset;

uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
uniform sampler2D uMaskTex;

varying vec4 vRandom;
varying vec3 vColor;
varying vec2 vScreenUv;

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

  // CPU-computed fluid displacement
  mPos.xy += aOffset;

  // ── Wake shiver: sample mask at screen position ──
  vec4 tempClip = projectionMatrix * viewMatrix * mPos;
  vec2 maskUv = clamp(tempClip.xy / tempClip.w * 0.5 + 0.5, 0.0, 1.0);
  float mask = texture2D(uMaskTex, maskUv).r;

  // High-frequency displacement when the fluid passes over
  float shiverAmt = smoothstep(0.1, 0.5, mask) * 0.06;
  mPos.x += sin(t * 45.0 + aRandom.x * 100.0) * shiverAmt;
  mPos.y += cos(t * 38.0 + aRandom.y * 100.0) * shiverAmt;

  vec4 mvPos = viewMatrix * mPos;

  // Slight size boost in wake — particles swell near the fluid
  float sizeBoost = 1.0 + smoothstep(0.1, 0.4, mask) * 0.15;
  gl_PointSize = sizeBoost * (uBaseSize * (1.0 + uSizeRandomness * (aRandom.x - 0.5))) / length(mvPos.xyz);

  gl_Position = projectionMatrix * mvPos;

  // Screen UV for mask sampling in fragment
  vec2 ndc = gl_Position.xy / gl_Position.w;
  vScreenUv = ndc * 0.5 + 0.5;
}
`;

/* ── Particle fragment shader ──
   Mask-driven opacity: particles glow brighter near the fluid trail.
── */
export const particleFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform sampler2D uMaskTex;
uniform float uScrollFade;

varying vec4 vRandom;
varying vec3 vColor;
varying vec2 vScreenUv;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;

  // Mask-driven glow
  float mask = texture2D(uMaskTex, clamp(vScreenUv, 0.0, 1.0)).r;
  float maskGlow = smoothstep(0.0, 0.4, mask);

  vec3 color = vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);
  color = mix(color, color * 1.3, maskGlow * 0.5);

  float alpha = (0.6 + maskGlow * 0.4) * (1.0 - uScrollFade);
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
