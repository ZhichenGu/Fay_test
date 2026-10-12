# Opening-only adaptation

The rendering engine is the original public Brainstream browser bundle, not a newly written substitute. It embeds Three.js, jQuery, and the original spline, pointer, shader, transition, and audio processing code.

Changes in `brainstream-engine.js`:
- Force production asset loading locally, avoiding the original development file-list endpoint.
- Disable saved narrative progress; refresh always starts at the title.
- Disable the original co-presence WebSocket connection.
- Disable injection of the NFB remote navigation/analytics application; `local.css` and `index.html` provide local navigation chrome.
- Prevent timeline audio preloading for the unreachable post-opening placeholder.
- Before attempting an introduction transition, clear all advance flags if `currentIntro === 4` and no transition is in flight. The render/update loop continues.
- Emit `brainstream:state` when each opening transition completes.

`data/timeline.json` includes only the five observed opening states. State 4 also disables onClick/onRelease and has no automatic duration. A dormant placeholder satisfies engine initialization; the hard stop makes it unreachable. `data/presets.json` contains only the eight opening presets (including mobile variants and intro audio). The auxiliary eye initialization entry is inert in these opening scenes.

`local.js` replaces AnalyticsController and StorageController with local no-op adapters before loading the bundle. No analytics, story audio, co-presence server, or remote menu is started. All resources required by the tested opening are local. Optional `?qa=1` enables diagnostic reporting to the local QA server only; it is off for normal use.

The original engine is minified. Put new story content in separate, readable modules, connecting at `brainstream:ready-for-continuation`; do not build new narrative behavior by editing minified vendor code.
