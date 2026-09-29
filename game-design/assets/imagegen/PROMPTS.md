# ImageGen 생성 프롬프트

모든 PNG는 **내장 ImageGen**으로 생성했다. 아래는 각 파일에 사용한 최종 프롬프트다. 상태 변형은 앞서 생성한 파일을 참조 이미지로 넣어 편집했다.

## 배경

### env-station04-exit02-base-v01.png

> Use case: stylized-concept. Asset type: production-oriented CCTV environment background for a 16:9 browser psychological-horror game. Create ENV-01, the empty 2nd-exit concourse of a fictional underground subway station after service. Fixed high wall-mounted security camera perspective, wide view, coherent 720x405 game-scene composition with clear central recessed exit opening where a separate shutter sprite can later be overlaid. Three readable planes: concrete wall, architectural opening, tiled floor. Muted gray-green and desaturated teal palette, low light but legible geometry, restrained grain and subtle analog CCTV atmosphere. 2D painted game background, not a screenshot of a user interface, not photorealistic photography. Keep the central opening and floor free of characters and movable props. No words, numerals, logos, signage lettering, camera HUD, interface frames, watermark, people, train, dramatic monster, or embedded captions.

### env-station04-platform03-base-v01.png

> Use case: stylized-concept. Asset type: production-oriented CCTV environment background ENV-02 for a 16:9 browser psychological-horror game. Empty 3rd subway platform after service, wide fixed high wall-mounted security camera perspective. The tracks and dark tunnel form the deep focal point, clearly visible yellow safety line along platform foreground, simple structural pillars and concrete wall, no trains or figures or moving props. Match the visual language of an empty late-night underground station: 2D painted game background, desaturated gray-green and teal palette, subdued overhead light, legible geometry, restrained analog CCTV grain. Leave platform middle-right open for an overlaid passenger silhouette. No text, numbers, signs with lettering, logos, camera HUD, UI frame, watermark, or dramatic monster.

### env-station04-staffhall-base-v01.png

> Use case: stylized-concept. Asset type: production-oriented CCTV environment background ENV-03 for a 16:9 browser psychological-horror game. Empty staff-only corridor in a fictional subway station at night, wide fixed high corner-mounted security camera perspective. Long concrete corridor, central recessed staff door at far end suitable for separate open/closed door overlay, side walls with muted tile, overhead fluorescent pools of light, clear dark floor perspective. Match a 2D painted game-background series in desaturated gray-green and teal, restrained analog CCTV grain, ominous but readable. No people, silhouettes, doors visibly opening, signs with lettering, numbers, text, logos, camera HUD, UI frame, watermark, or monster.

### env-station04-exit02-shutter-closed-v01.png

**참조:** `env-station04-exit02-base-v01.png`

> Use case: precise-object-edit. Asset type: ENV-01 closed-state CCTV game background. Input image is the exact empty exit-concourse background. Change only the central recessed exit opening: place a fully lowered corrugated metal security shutter across it, with a small unlit lock indicator near its frame. Keep the original camera angle, every tile line, perspective, walls, lighting, color grading, resolution/aspect ratio, and all other architecture unchanged. The shutter must sit inside the existing opening, not across the foreground. No text, numbers, logos, interface, people, watermark, or new props.

### env-station04-staffhall-door-ajar-v01.png

**참조:** `env-station04-staffhall-base-v01.png`

> Use case: precise-object-edit. Asset type: ENV-03 open-door CCTV game background. Input image is the exact empty staff corridor background. Change only the central door at the far end: make one leaf slightly ajar, opening onto a dark, unlit interior; the door frame and all walls remain in place. Keep the original fixed CCTV camera angle, tile lines, perspective, fluorescent lighting, color grading, resolution/aspect ratio, and every other detail unchanged. No figure, text, signs, numbers, logos, camera HUD, watermark, or new props.

### env-station04-platform03-headlights-v01.png

**참조:** `env-station04-platform03-base-v01.png`

> Use case: precise-object-edit. Asset type: ENV-02 anomaly-state CCTV game background. Input image is the exact empty subway platform background. Change only the dark tunnel depth: add two tiny distant train-like headlight points in the tunnel, with a faint unnatural reflection on the nearest rail. No visible train body. Keep the exact same camera angle, platform, yellow safety line, all tile geometry, overhead lighting, color grading, resolution/aspect ratio, and every other detail unchanged. No person, text, numbers, signs, logos, camera HUD, watermark, or new props outside the tunnel.

### env-station04-platform03-wet-rail-v01.png

**참조:** `env-station04-platform03-base-v01.png`

> Use case: precise-object-edit. Asset type: persistent-aftereffect variant of ENV-02 CCTV platform background. Input image is the empty platform base. Change only the rails nearest the dark tunnel so they look subtly wet with a cold reflected sheen, after distant lights have vanished. There must be no headlights, train, or person. Preserve the same fixed camera viewpoint, floor tile geometry, yellow safety line, walls, lights, color grade, size/aspect ratio and all other details. No text, signs with lettering, logos, interface, or watermark.

## 인물·소품

### char-platform-passenger-v01.png

> Use case: stylized-concept. Asset type: transparent game character sprite CHAR-01 for a 16:9 late-night subway CCTV horror game. Single ordinary adult passenger standing still near a platform safety line, full body, neutral straight pose, seen from a slightly elevated security camera angle, dark coat and trousers, restrained natural proportions, face intentionally indistinct but not erased, no weapons, no luggage. Painterly realistic 2D game sprite compatible with desaturated gray-green tiled subway backgrounds, low-contrast cool lighting, readable silhouette at small size. Centered with generous transparent padding, feet visible, one character only. Genuine transparent background and clean cutout edges; no floor, shadow plate, text, logo, watermark, labels, sprite sheet, extra characters, or dramatic monster.

### char-platform-passenger-faceless-v01.png

**참조:** `char-platform-passenger-v01.png`

> Use case: precise-object-edit. Asset type: transparent character-state sprite for the subway CCTV horror game. Input image is the ordinary passenger cutout. Preserve exactly the same full-body person, coat, pose, silhouette, camera angle, proportions, lighting, transparent canvas and clean cutout. Change only the face region so it appears as a softly featureless dark CCTV void, as if facial detail has been erased by signal loss. Keep it subtle and non-gory. Do not add a background, halo, floor, text, logo, watermark, new accessories, or another person.

### char-staffhall-figure-v01.png

> Use case: stylized-concept. Asset type: transparent game character sprite CHAR-02 for a 16:9 late-night subway CCTV horror game. Single uncanny human silhouette that may appear deep in an empty staff corridor, full body, long dark station-worker coat, unnaturally still posture, head and face mostly in shadow, subtle human proportions rather than monster anatomy, no gore. Seen from a slightly elevated fixed security camera angle. Painterly realistic 2D game sprite, muted charcoal and gray-green, faint cold rim light, readable when scaled small and placed in an existing corridor image. Centered with generous transparent padding, feet visible, one figure only. Genuine transparent background and clean cutout edges; no floor, shadow plate, text, logo, watermark, labels, sprite sheet, extra figures.

### prop-station-kit-concept-v01.png

> Use case: stylized-concept. Asset type: transparent game prop kit PROP-01 for a late-night subway CCTV horror game. One clean atlas-like sheet of SIX isolated props in a strict 3-column by 2-row grid, generous transparent margins and no overlaps: top row (1) closed corrugated metal exit shutter with small lock lamp, (2) rectangular staff-only security door, (3) blank destination display panel; bottom row (4) overhead fluorescent fixture, (5) wall telephone and speaker unit, (6) small wet handprint and wet-rail trace. Each prop is a separate complete cutout, front or slightly elevated CCTV perspective, visually coherent desaturated gray-green painterly realism, strong readable silhouettes for use at small scale. Genuine transparent background. No text, numbers, letters, labels, grid lines, human figures, station scene, logos, watermark, or cast background.

### prop-wet-handprint-v01.png

> Use case: stylized-concept. Asset type: transparent 2D game decal sprite for a subway CCTV horror game. One small wet human handprint with a few dripping water traces, seen straight-on as if left on the glass of a CCTV monitor. Desaturated pale gray-green, subtle translucency, crisp silhouette readable when small, restrained horror atmosphere, no gore. Isolated genuine transparent background with generous padding. No monitor frame, room, hand or person, text, numbers, logo, watermark, or second mark.

## UI·VFX 시안

### ui-icons-concept-v01.png

> Use case: stylized-concept. Asset type: UI-01 icon concept sheet for a subway surveillance horror game. Eight simple monochrome line icons in a precise 4-column by 2-row grid with equal spacing on a genuinely transparent background: CCTV camera, train timetable, telephone call, broadcast microphone, muted microphone, recording circle, signal bars, shift record folder. Consistent 2-pixel-looking off-white strokes, flat minimal iconography, each icon centered in its own square, visually readable at 24 pixels, no decorative texture or gradients. No words, numbers, labels, borders, colored backgrounds, logos, or watermark.

### vfx-cctv-atlas-concept-v01.png

> Use case: stylized-concept. Asset type: VFX-01 CCTV effect sprite-sheet visual source for a browser horror game. Transparent 4:3 landscape image containing a strict 8-column by 6-row grid of 48 distinct 128x128-style cells, no gaps outside cells. Each row is an eight-frame progression left to right: row 1 subtle screen tear, row 2 analog signal noise, row 3 broadcast ripple, row 4 shadow reveal, row 5 lamp flicker glow, row 6 fine dust static. Muted gray-green and pale gray effects with restrained opacity; effects occupy cell centers and do not touch edges. Clean genuinely transparent background. No station background, scene, text, labels, numbers, grid lines, logos, or watermark. Prioritize regular frame alignment and six visually distinct rows.
