# Core UI (StarterCode)

This folder contains framework-level utilities that are intended to be stable and
available to all projects using this StarterCode. Keep system-level UI helpers
here; project-specific customizations belong in `assets/`.

## Exported API

`window.CoreUI` — main namespace. Contains:

- `CoreUI.Skeleton` — helper to generate lightweight HTML skeletons.

  - `Skeleton.text(lines = 1)` → string (one or more skeleton text lines)
  - `Skeleton.avatar()` → string (avatar placeholder)
  - `Skeleton.grid(count = 3, columns = 3)` → string (grid of skeleton cards)

- `CoreUI.Cache` — simple localStorage cache with TTL.

  - `Cache.set(key, value, ttlMinutes = 30)`
  - `Cache.get(key)`
  - `Cache.clear()`

- `CoreUI.isSlow` — boolean flag indicating if the connection appears slow (3G-ish).

### Global legacy aliases

For backward compatibility the following globals are provided:

- `window.Skeleton` → `CoreUI.Skeleton`
- `window.CacheManager` → `CoreUI.Cache`

## Usage Examples

Render a skeleton into an element while loading a page/component:

```html
<div id="router-view"></div>
<script>
  document.getElementById("router-view").innerHTML = CoreUI.Skeleton.grid(3, 3);
</script>
```

Cache example:

```js
const cached = CoreUI.Cache.get("users_v1");
if (!cached) {
  fetch("data/users.json")
    .then((r) => r.json())
    .then((data) => {
      CoreUI.Cache.set("users_v1", data, 60); // cache 60 minutes
    });
}
```

## Notes for maintainers

- `core/ui.js` attempts to install a render-override into the app's `Framework`
  if `Framework.render` is available. If the `Framework` script loads later,
  `core/ui.js` polls briefly (5s) and will install when it appears.
- Keep code in `core/` minimal and framework-focused. Project-specific features
  should live in `assets/` so they are easy for new developers to edit.

## Enabling morph-based updates (optional, recommended)

`CoreUI.morph(target, html)` will try to reconcile the new HTML into `target`
using the best available method:

- `Alpine.morph` (if `@alpinejs/morph` is loaded)
- `morphdom` (if loaded via CDN)
- fallback to `innerHTML` (always available)

To enable automatic better updates, add one of these scripts to `index.html` **before** `core/ui.js` or before `main.js`:

Alpine morph (CDN):

```html
<script src="https://unpkg.com/@alpinejs/morph@latest/dist/cdn.min.js"></script>
```

Or morphdom (CDN):

```html
<script src="https://unpkg.com/morphdom@2.6.1/dist/morphdom-umd.min.js"></script>
```

When either is present, `Framework.render` (which uses CoreUI.morph) will
preserve Alpine component instances and give much smoother transitions.

## Lightweight on-scroll animations (AOS)

StarterCode provides a tiny on-scroll animation helper in `assets/js/scroll-animate.js` and styles in `assets/css/scroll-animate.css`.

Usage:

```html
<div data-animate="fade-up">Reveal on scroll</div>
<div data-animate="zoom" data-once="false">Animate each time it enters</div>
```

The helper uses `IntersectionObserver` and adds classes:

- `animate-init` + `animate-<name>` initially
- `in-view` when the element enters viewport

Styles are in `assets/css/scroll-animate.css` and can be customized or replaced by a library later.
