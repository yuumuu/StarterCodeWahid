# Troubleshooting Guide

## Common Issues & Solutions

### 1. "CORS Error: Access to XMLHttpRequest blocked"

**Problem:**

```
Access to XMLHttpRequest at 'file:///...' from origin 'null' has been blocked by CORS policy
```

**Solution:**
You must serve files via HTTP, not as local files. Use one of these methods:

```bash
# Python
python -m http.server

# Node.js
npx serve .

# VS Code
Right-click index.html → Open with Live Server
```

---

### 2. Components Not Loading

**Problem:** Include tags are showing up as plain HTML in the page

**Cause:** The component file path is incorrect or the file doesn't exist

**Solution:**

- Check the file path in `<include src="...">`
- Verify the file exists at that path
- Check browser console for fetch errors
- Use absolute paths from project root: `app/components/card.html`

**Example:**

```html
<!-- ❌ Wrong (no app/ prefix) -->
<include src="components/card.html"></include>

<!-- ✅ Correct -->
<include src="app/components/card.html"></include>
```

---

### 3. Route Not Working / Shows 404

**Problem:** Clicking a link shows 404 page

**Cause:**

- Route not defined in `routes.js`
- Component file doesn't exist
- Hash syntax incorrect

**Solution:**

1. **Check routes.js:**

```javascript
const routes = [
  { path: "/mypage", component: "app/pages/mypage.html" }, // ← Added?
];
```

2. **Verify file exists:** `app/pages/mypage.html`

3. **Use correct link format:**

```html
<!-- ✅ Correct (hash + path) -->
<a href="#/mypage">My Page</a>

<!-- ❌ Wrong (no hash) -->
<a href="/mypage">My Page</a>
```

---

### 4. Alpine.js Not Working / Reactivity Issues

**Problem:** `x-data`, `@click`, `x-text` not responding

**Cause:** Alpine.js not initialized after component load

**Solution:**

The framework automatically reinitializes Alpine.js when pages load. If experiencing issues:

1. Check browser console for errors
2. Ensure Alpine.js is loaded in `index.html`
3. Wait for component to fully load before interaction

**In index.html:**

```html
<script
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
  defer
></script>
```

---

### 5. Data Not Showing / Collection Helper Returns Empty

**Problem:** Using `collection()` or `item()` helper but data is empty

**Cause:**

- JSON file path is wrong
- JSON structure doesn't match code
- Data fetch failed silently

**Solution:**

1. **Check JSON path:**

```html
<!-- ❌ Wrong -->
<div x-data="collection('users.json')">
  <!-- ✅ Correct -->
  <div x-data="collection('data/users.json')"></div>
</div>
```

2. **Verify JSON structure:**

```javascript
// For collection() - must be an array
[
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
```

3. **Add error handling:**

```html
<div x-data="collection('data/users.json')">
  <div x-show="error" class="text-red-500" x-text="error"></div>
  <div x-show="loading">Loading...</div>
  <div x-show="!loading && items.length === 0" class="text-gray-500">
    No items found
  </div>
</div>
```

---

### 6. Page Hangs / Freezes When Navigating

**Problem:** Page becomes unresponsive when clicking navigation links

**Cause:**

- Component rendering is blocked
- Infinite loop in Alpine code
- Framework render not completing

**Solution:**

1. **Check for infinite loops:**

```javascript
// ❌ Avoid infinite $watch loops
x-data @init="
  $watch('count', () => {
    Alpine.store('state').count = this.count  // Don't trigger same watch
  })
"

// ✅ Better approach
x-data @init="
  $watch('count', (val) => {
    console.log('Count changed:', val)  // Just log, don't modify
  })
"
```

2. **Check browser console** for JavaScript errors during navigation

3. **Simplify component** to identify problematic code

---

### 7. Slots Not Working / Content Not Appearing

**Problem:** Content passed to component via slots doesn't show

**Cause:**

- Component doesn't have matching `<slot>` tags
- Slot name doesn't match
- Slots inside conditions not rendered

**Solution:**

1. **Component must define slots:**

```html
<!-- ✅ Good component -->
<div class="card">
  <slot name="header"></slot>
  <slot name="content"></slot>
  <slot name="footer"></slot>
</div>

<!-- ❌ Bad component (no slots) -->
<div class="card">Content goes here</div>
```

2. **Use matching names:**

```html
<!-- Component has: <slot name="title"> -->
<!-- Use: -->
<include src="app/components/card.html">
  <slot name="title">My Title</slot>
  <!-- ✅ Matches -->
</include>
```

---

### 8. State Not Persisting Across Pages

**Problem:** Store values are lost when navigating

**Cause:**

- Using Alpine local `x-data` instead of global `Store`
- Store.set() not called properly

**Solution:**

Use global Store for state that should persist:

```javascript
// ✅ Persists across pages
Store.set('user', userData);
const user = Store.get('user');

// ❌ Lost on navigation
x-data="{ user: {} }"
```

---

### 9. Styles Not Applying / Tailwind Classes Missing

**Problem:** Classes like `text-blue-600` not styling elements

**Cause:**

- Tailwind CSS not loaded
- Invalid class name
- CSS file not linked

**Solution:**

1. **Verify Tailwind is in index.html:**

```html
<link href="https://cdn.tailwindcss.com" rel="stylesheet" />
```

2. **Check class syntax:**

```html
<!-- ✅ Correct -->
<div class="text-blue-600 font-bold p-4">
  <!-- ❌ Wrong (missing hyphens) -->
  <div class="textblue600 fontbold p4"></div>
</div>
```

---

### 10. Build Process / Deployment Issues

**Problem:** "How do I deploy this?"

**Solution:**

This is a simple SPA that requires no build step:

1. **For static hosting (Netlify, Vercel, GitHub Pages):**

   - Upload all files as-is
   - No build command needed
   - Set "public directory" to root

2. **For development:**

   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

3. **Production considerations:**
   - All files are served as-is
   - No minification/bundling (optional)
   - Caching works automatically
   - DOMPurify XSS protection is built-in

---

## Debugging Tips

### Enable Verbose Logging

```javascript
// In main.js or browser console
window.DEBUG = true;

// Then check console for detailed logs from Router, Framework, etc.
```

### Inspect Store State

```javascript
// In browser console
Store.getState(); // See all global state
Alpine.store("params"); // See route params
```

### Check Rendered HTML

```javascript
// See what component rendered to
document.getElementById("router-view").innerHTML;
```

### Monitor Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click links to see which files are fetched
4. Check for failed requests (red)

---

## Performance Issues

### Page Load is Slow

**Check for:**

1. Large JSON files being loaded
2. Too many components on one page
3. Unoptimized images in media folder

**Solutions:**

- Use `CoreUI.Cache.set()` to cache JSON data
- Lazy-load components that aren't immediately visible
- Optimize images (compress, use WebP)
- Use skeleton loaders for better UX during load

### Navigation Between Pages is Slow

**Check for:**

1. Complex Alpine templates with many `x-for` items
2. Unoptimized components
3. Network bottleneck

**Solutions:**

```javascript
// Add timing to identify slow renders
console.time("render");
Router.navigate("/page");
// Check console for render time
```

---

## Getting Help

1. **Check the logs:** Open DevTools (F12) and look for errors
2. **Check file paths:** Most issues are path-related
3. **Read the docs:** Navigate to #/docs in the app for comprehensive guide
4. **Ask yourself:** "Did I add this route to routes.js?"
5. **Inspect HTML:** Right-click → Inspect to see rendered output

---

## Common Patterns

### Correct component structure:

```html
<layout name="main">
  <slot name="content">
    <h1>Page Title</h1>
    <div x-data="{ count: 0 }">
      <button @click="count++">Count</button>
    </div>
  </slot>
</layout>
```

### Correct route definition:

```javascript
const routes = [{ path: "/mypage", component: "app/pages/mypage.html" }];
```

### Correct component include:

```html
<include src="app/components/card.html" title="Hello"></include>
```

### Correct navigation:

```html
<a href="#/mypage">Go to My Page</a>
```

---

## Still Stuck?

1. Simplify the problem - create a minimal test case
2. Check if the issue is in the framework or your code
3. Verify all file paths are correct
4. Look for JavaScript errors in the browser console
5. Test in an incognito window (clear cache)

Happy coding! 🚀
