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
