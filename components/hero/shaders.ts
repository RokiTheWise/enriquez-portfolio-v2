/* ══════════════════════════════════════════════════════════════
   GLSL shader sources for the brush-stroke mask hero.
   All shaders are exported as template literal strings.
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

/* ── Ribbon vertex shader ──
   Renders the brush-stroke ribbon into the mask FBO.
   Positions are in pixel coordinates; ortho camera maps them to clip space.
   Perlin noise displaces edge vertices for the shredded/liquid look.
── */
export const ribbonVertex = /* glsl */ `
${noise3D}

attribute float aSide;
attribute vec2 aNormal;
attribute float aAlpha;
attribute float aVelocity;

uniform float uTime;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uNoiseSpeed;

varying float vAlpha;

void main() {
  vAlpha = aAlpha;
  vec3 pos = position;

  // Perlin noise displacement along perpendicular
  // aSide offsets noise lookup so left/right edges distort independently
  float n = snoise(vec3(pos.xy * uNoiseFreq * 0.002 + vec2(aSide * 5.0, 0.0), uTime * uNoiseSpeed));
  float amp = uNoiseAmp * (0.3 + aVelocity * 0.7);
  // aSide makes left(+1)/right(-1) push outward in opposite directions
  pos.xy += aNormal * n * amp * aSide * 40.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

/* ── Ribbon fragment shader ──
   Outputs white with alpha gradient — only used as FBO mask data.
── */
export const ribbonFragment = /* glsl */ `
precision highp float;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vAlpha, vAlpha, vAlpha, 1.0);
}
`;

/* ── Fade pass vertex shader ──
   Simple fullscreen quad for the FBO decay pass.
── */
export const fadeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* ── Fade pass fragment shader ──
   Reads previous frame's mask FBO, multiplies by decay factor.
── */
export const fadeFragment = /* glsl */ `
precision highp float;
uniform sampler2D uPrevFrame;
uniform float uDecay;
varying vec2 vUv;

void main() {
  vec4 prev = texture2D(uPrevFrame, vUv);
  gl_FragColor = vec4(prev.rgb * uDecay, 1.0);
}
`;

/* ── Composite vertex shader ──
   Fullscreen quad that bypasses the scene camera (renders in clip space).
── */
export const compositeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* ── Composite fragment shader ──
   Samples both portrait textures and the mask FBO.
   Simplex noise distorts mask sampling + threshold for organic "torn film" edges.
   Inside image bounds: mix casual/business based on noisy mask.
   Outside image bounds: transparent (particles show through).
── */
export const compositeFragment = /* glsl */ `
precision highp float;

${noise3D}

uniform sampler2D uCasualTex;
uniform sampler2D uBusinessTex;
uniform sampler2D uMaskTex;
uniform vec4 uImageBounds; // (left, bottom, right, top) in UV space [0,1]
uniform float uTime;

varying vec2 vUv;

void main() {
  // Compute UV within image bounds
  vec2 boundsMin = uImageBounds.xy;
  vec2 boundsMax = uImageBounds.zw;
  vec2 imgUv = (vUv - boundsMin) / (boundsMax - boundsMin);

  // Check if we're inside the image region
  bool inBounds = imgUv.x >= 0.0 && imgUv.x <= 1.0 && imgUv.y >= 0.0 && imgUv.y <= 1.0;

  if (!inBounds) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 casual = texture2D(uCasualTex, imgUv);
  vec4 business = texture2D(uBusinessTex, imgUv);

  // Noise-distorted mask UV for spatial wobble on edges
  float n1 = snoise(vec3(vUv * 15.0, uTime * 0.6));
  float n2 = snoise(vec3(vUv * 15.0 + 43.0, uTime * 0.6));
  vec2 maskUv = vUv + vec2(n1, n2) * 0.012;
  float mask = texture2D(uMaskTex, maskUv).r;

  // Noise-driven threshold — shredded / torn-film edge profile
  float edgeNoise = snoise(vec3(vUv * 25.0, uTime * 0.4));
  float threshold = 0.08 + edgeNoise * 0.06;

  gl_FragColor = mix(casual, business, smoothstep(threshold - 0.03, threshold + 0.03, mask));
}
`;

/* ── Particle vertex shader ──
   Port of the existing OGL particle system with added repulsion.
── */
export const particleVertex = /* glsl */ `
attribute vec4 aRandom;
attribute vec3 aColor;

uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
uniform vec3 uTrailPoints[15]; // xy = world-space position, z = repulsion radius
uniform float uRepulsionStrength;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = aRandom;
  vColor = aColor;

  vec3 pos = position * uSpread;
  pos.z *= 10.0;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);

  // Sine-wave animation (preserved from OGL version)
  float t = uTime;
  mPos.x += sin(t * aRandom.z + 6.28 * aRandom.w) * mix(0.1, 1.5, aRandom.x);
  mPos.y += sin(t * aRandom.y + 6.28 * aRandom.x) * mix(0.1, 1.5, aRandom.w);
  mPos.z += sin(t * aRandom.w + 6.28 * aRandom.y) * mix(0.1, 1.5, aRandom.z);

  // Repulsion from trail points
  for (int i = 0; i < 15; i++) {
    vec2 diff = mPos.xy - uTrailPoints[i].xy;
    float dist = length(diff);
    float radius = uTrailPoints[i].z;
    if (dist < radius && dist > 0.001) {
      float force = (1.0 - dist / radius);
      force = force * force; // quadratic falloff
      mPos.xy += normalize(diff) * force * uRepulsionStrength;
    }
  }

  vec4 mvPos = viewMatrix * mPos;

  if (uSizeRandomness == 0.0) {
    gl_PointSize = uBaseSize;
  } else {
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (aRandom.x - 0.5))) / length(mvPos.xyz);
  }

  gl_Position = projectionMatrix * mvPos;
}
`;

/* ── Particle fragment shader ──
   Point sprite rendering with color shimmer (preserved from OGL version).
── */
export const particleFragment = /* glsl */ `
precision highp float;

uniform float uTime;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));

  if (d > 0.5) discard;

  vec3 color = vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28);
  gl_FragColor = vec4(color, 1.0);
}
`;
