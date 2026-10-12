# Reviewer M: 3D and motion (creative-technologist lens)

The reviewer measured N = 320 cells; bars = 39, hero = 120, next = 320.

## 1. Root causes
1. **Paint-by-numbers shading.** The fragment shader computes `col = vTop * vShade`, with fixed factors of 1.0, 0.66 and 0.46 on object-space normals.
   - There is no light direction, gradient, ambient occlusion, contact shadow or highlight, and the shading stays glued to the faces when the rig sways.
   - Under an orthographic camera every face is one flat fill, which is exactly what a paint program produces.
   - Multiplying darker turns the white cells' sides neutral grey, Tasree3 orange into rust and cyan into teal.
2. **Value collapse.** The cells are navy-800 on a navy-950 void, and the fog adds 42 % background even at the pivot. Most cells sit within a few percent of the void's brightness, so the white and accent cells look pasted on.
3. **Seamed, axis-aligned boxes.**
   - Masts, bars, sheets, phones, walls and even smoke are stacks of separate cubes, each with a cyan outline on every face.
   - The instance matrix holds only position and scale, so nothing can turn, open, fan out or tumble.
   - It reads as Minecraft, not as an architectural model.
4. **No camera language.** Every chapter uses one fixed isometric view with about ±3° of sway, and each formation is refitted to fill its frame. There is no parallax, and cell size jumps about 3× between chapters (bay ≈ 25 px, bars ≈ 85 px).
5. **Motion is fired, not told.**
   - Each cell takes a straight 420 ms path, and the whole morph fires when a beat crosses 58 % of the viewport; the pose then holds while the reader scrolls about 100vh.
   - Scroll drives only ±0.08 rad of drift.
   - Each hero moment is on screen for 1.5 s, of which only about 0.6 s is settled.
   - The gallery's 3D is hidden for about 750vh of scroll.

## 2. Findings
| ID | Ref | Sev | Problem | Exact fix | Cost / risk |
|---|---|---|---|---|---|
| M01 | FS `vTop*vShade`; d01, d19-t3 | P0 | Constant face factors; shadows go grey or rust | VS `vN=normalize(mat3(modelMatrix)*normal)`; FS `k=max(dot(vN,uKey),0.)`, `col=mix(vTop*uShadowTint,vTop,.38+.62*k)`, uKey `normalize(.55,1,.3)`, uShadowTint ≈ #22345C. Per-tone ramps: cool white sides #C9D2DE/#93A1B8; orange keeps its chroma | ~8 ALU |
| M02 | VS `vFog=clamp(.42-…)` | P0 | 42 % fog at the centre | `d=dot(wp-uCenter,-F)/uSpan+.5; vFog=.5*smoothstep(.45,1.,d)`; fog colour = backdrop gradient at `gl_FragCoord` (M08) | 0 |
| M03 | FS edge band | P1 | 1.15 px cyan outline on every face, internal seams included; white cells have none, so two styles mix | Edge distance in world units: VS passes face size from the instance scale; FS `bev=1.-smoothstep(0.,.045,d)`, `col+=bev*.25*k` (lit chamfer). Keep cyan only where `aEdge.a>.8` | ~10 ALU |
| M04 | d19-t3, d15, d07 | P0 | No AO and no contact shadow, so blocks float | Bake an `aAO` vec3 per instance per formation (hash grid, −0.15 per occupied neighbour) and lerp it in the morph. Darken grounded vertical faces `*=mix(.62,1.,smoothstep(0.,.5,localY+.5))`. Add instanced shadow quads at y = −.335, opacity `.35*(1-h/3)` | +1 draw call; bake < 1 ms |
| M05 | matrix write is position + scale only | P0 | No rotation | Per-instance quaternion; pre-allocated `Matrix4.compose` per cell | ~0.15 ms per frame |
| M06 | hero spacing 1.75; d01 | P1 | See-through moiré; the 4 lifted white cubes look random | Spacing 1.3. Dock each lifted cell at its stream's end and flash it (160 ms) when the pulse arrives | 0 |
| M07 | sheets, masts, bars, phone, walls | P1 | Seamed stacks | One instance per object (sheet 6×.22×8, bar 1.2×n·.95×1.2, phone slab .8×1.6×.12); spare cells scale to 0 | re-map |
| M08 | flat #051326; d11, d12; d17 hard field edge | P1 | Empty void, no ground | `.stage` `radial-gradient(60% 55% at var(--gx) var(--gy),#0B2A55,#071B36 45%,#051326)`, centred on the framing. One persistent parallelogram-grid floor (fwidth lines, `alpha=.07*(1.-smoothstep(6.,18.,r))`) | 1 draw call; ties the chapters into one world |
| M09 | `framing()` refit | P1 | Zoom pumping, toy scale | Fix the scale per chapter group (hero, world + story, bars ×1.25); move the camera, not the scale | framing rewrite |
| M10 | camera (70,70,70) | P0 | The same shot everywhere | Camera rig with azimuth, elevation and zoom per formation (§4). `bbox(f,basis)` and `poster(f,basis)` so posters match | posters rebuilt |
| M11 | morph lerp; `famOrder` | P0 | Cells cross on straight lines at ~30× speed spread; bay→bars makes 281 cells vanish | Cubic Bézier per cell (P1 = from + up·(.6+.8r)); three 420 ms phases (lift, travel, settle); nearest-neighbour mapping. Map smoke → Bay 3 bars and boxes → the other bars (events become data) | build-time CPU |
| M12 | beats toggle at `top 58%` | P0 | Scroll tells no story; d12, d13 and d16 are near-identical | `ScrollTrigger({start:'top 85%',end:'top 45%',scrub:.5,onUpdate:st=>GL.setProgress(a,b,st.progress)})`; per cell `e=ease(clamp(p*1.4-d*.4))`. Reduced motion keeps `go(name,true)` | new morph API |
| M13 | iot/sec `anim:'none'` | P1 | The gate never opens; the camera never pans | Wasel: phone pulse → controller blink → arm rotates 0→78° on its post. Yisbir: head yaws −12→0°, the figure enters the zone, the bracket snaps | needs M05 |
| M14 | 4 cone lines; smoke = grey cubes (d12) | P0 | Detection and smoke unreadable; smoke looks like boxes | Cone: frustum mesh, additive, `alpha=.14*(1.-vT)+.22*edge`, sweeping scan band. Smoke: 16 billboards `smoothstep(.5,.1,length(uv-.5))*(.6+.4*noise)`, depthWrite off | +2 draw calls |
| M15 | 1 px LineSegments; d01 strokes cut at the nav | P1 | Hairlines and stray scratches | `LineSegments2` + `LineMaterial` at 2 px; comet `pow(1.-fract(vT*2.-t*.32),6.)+.2`; fade in with `smoothstep(0.,.2,vT)`; streams start inside the frame | ~8 KB gzip |
| M16 | layer; d03, d09b; stage opacity .62 | P0 | Plates hidden behind solid cards; slivers in the gaps look like glitches; the render is wasted | Put the stack in a reserved `rect-index` (≈ 280×320, header right) as the gallery index, active plate sliding out. Otherwise stop the render loop and fade the stage to 0 | saves all GPU work here |
| M17 | pin distance ≈ 6.8k px at 1440 | P0 | ≈ 750vh hard pin vs the ≤ 150vh per pin / ≤ 300vh per page rule | `--cw:min(860px,60vw)`, neighbours peeking in, ≤ 150vh total | layout |
| M18 | card rotationY −18→16, z −140, opacity .2 | P1 | Soft text, ghosted neighbours; a card is in focus for only 20 % of its travel | Card: opacity .4→1 and scale .94→1 only. Depth on `.pc-frame`: rotationY 10→0, z −80→0, lagging 15 %. Info children y 8→0, 60 ms stagger | crisper text, cheaper |
| M19 | glass chips and note over a live canvas | P1 | 6+ backdrop-filters re-blur the animating canvas every frame; the main perf risk | Solid chips (`--surface-raised`, 94 %); 24–40 px leader line from the anchor; place chips outside the bounding box (fixes the d02, d14, d15 collisions) | GPU win |
| M20 | continuous loop, full viewport, DPR 1.5 | P1 | 2160×1350 redrawn for the breathe, wave and flow loops | `setScissor` to the framing rect; ambient-only frames at 30 fps; remove the per-frame `forEach`/`some` closures | ≈ half the GPU |
| M21 | island clip-path with `--ease-spring` | P2 | Clip-path repaints a 24 px blur every frame; the overshoot is clamped at inset 0, so the expand has no bounce | 3-slice pill: caps `translateX`, middle `scaleX`, 420 ms; labels cross-fade in 160 ms | small DOM change |
| M22 | story layout; m04 | P2 | The card sits bottom-left, leaving ~40 % of the frame empty; on mobile the previous card covers the poster | Align the card to the 3D's vertical centre; the morph completes as the h3 crosses 50 %; mobile posters flow in-line per step | layout |

## 3. Premium-look recipe (ordered by impact per effort)
1. Fog fix and tone ramps (M02, M01 ramps).
2. World-space key light with blue-shifted shadows (M01).
3. Lit chamfer instead of outlines (M03).
4. Baked AO and contact-shadow quads (M04).
5. Light-pool backdrop and a persistent floor grid (M08).
6. One instance per object (M07).
7. Three-phase Bézier morph with semantic mapping (M11).
8. Camera rig with a fixed scale per group (M09, M10).
9. Scroll-scrubbed beats (M12).
10. Instance rotation for the micro-stories, the cone and the smoke (M05, M13, M14).
11. Lighting moods per formation: tween `uKey`, `uKeyCol`, `uShadowTint` and `uExposure` with the morph. Problem beat at exposure .55. At "AI detects" the key light snaps to cyan-white: the AI switches the light on.
12. Hero and CTA core only:
    - `RoundedBoxGeometry(1,1,1,1,.06)`: 108 triangles, ≈ 35k for 320 cells.
    - `MeshPhysicalMaterial` (roughness .5, clearcoat .25) with a generated RoomEnvironment PMREM: no download, ≈ 30 ms once.
    - Convert colours with `setRGB(...,SRGBColorSpace)`, or everything washes out. Add a `three/addons/` importmap entry.
    - Accent glow: one additive halo quad.

**What not to use:**
- Swapping to a matcap or MeshStandard alone changes nothing: under an orthographic camera each flat face returns one value.
- SAO/GTAO costs 3–6 ms and is noisy.
- UnrealBloom costs 1.5–3 ms and breaks the "one emissive accent" rule.
- SMAA is redundant because MSAA is already on.

## 4. Motion timing
| Transition | Duration | Easing | Stagger |
|---|---|---|---|
| Morph (click / autoplay) | 3 × 420 ms phases, 140 ms overlap → 980 ms per cell | lift `power2.out`, travel `power2.inOut`, settle `expo.out` (spring only if the owner extends DD-24) | spatial sweep ≤ 480 ms; ≤ 1.46 s total |
| Morph (scroll) | scrub 0.5 over 40vh | linear progress, per-cell ease | sweep = 40 % of the zone |
| Camera shot | same as the morph total | `power2.inOut` | — |
| Flow lines in | 420 ms, starting at 70 % of the morph | enter | 60 ms, ≤ 8 lines |
| Chip | leader 160 ms, then chip 240 ms, after settle | enter | 60 ms |
| Bracket lock | 160 ms, scale 1.25→1 | enter | — |
| Hero moment | hold 3,600 ms; underline = linear progress bar | — | — |
| Wasel micro-story | pulse 420 ms → blink 160 ms → arm 420 ms | standard | — |
| "AI detects" light | 160 ms snap, then 420 ms exposure | enter | — |
| Gallery card | scrubbed; at rest by 35 % of its travel; frame lags 15 % | `power2.out` / `power2.in` | info 60 ms × ≤ 5, 240 ms each |
| Island | 420 ms; labels 160 ms | spring (DD-24) | — |
| Live activity | hold 2,000 ms (Apple HIG), not 2,600 | — | — |
| Reduced motion | final states; opacity fades ≤ 240 ms | standard | none |

**Camera shots** (azimuth / elevation / zoom; true isometric is 45° / 35.3°):

| Formation | Shot |
|---|---|
| hero | 45° / 35.3° / 1.0 |
| ai | 30° / 40° / 1.1 |
| auto | 55° / 32° |
| iot | 38° / 30° / 1.15 |
| sec | 60° / 28° |
| world | 45° / 52° / 0.9 |
| bay1 | slow push 0.9 → 1.0 |
| bay2 | 52° / 30° / 1.6, toward the lens |
| bay3 | pan to the endpoints |
| bars | 45° / 24° / 1.1 |
| next | 45° / 35.3° / 0.85, with a 0.5°/s drift (stops with Pause motion) |

**Rule changes needed:**
- The spring in the 3D settle phase needs DD-24 extended.
- The gallery must be cut to ≤ 150vh to comply with the pin rule.
- Everything else stays within the current tokens and skills.
