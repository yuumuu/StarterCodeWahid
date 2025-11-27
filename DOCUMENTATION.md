# Documentation & Walkthrough

## 1. Overview
This is an **Advanced Lightweight SPA Framework** built with HTML, TailwindCSS, and Alpine.js. It runs entirely in the browser (no Node.js build step required), featuring a custom engine for components, layouts, routing, and state management.

---

## 2. How to Use (Walkthrough)

### Running the Project
Since this framework uses `fetch` to load components, you must serve it via a local server to avoid CORS errors.
- **VS Code**: Right-click `index.html` -> "Open with Live Server".
- **Python**: `python -m http.server`
- **Node**: `npx serve .`

### Creating a Page
Create a file in `app/pages/mypage.html`:
```html
<layout name="main">
    <slot name="content">
        <h1>My Page</h1>
        <include src="app/components/mycomponent.html" title="Hello World"></include>
    </slot>
</layout>
```

### Adding a Route
Edit `routes.js`:
```js
const routes = [
    // ...
    { path: '/mypage', component: 'app/pages/mypage.html' }
];
```

### Creating a Component
Create `app/components/mycomponent.html`:
```html
<div class="p-4 border">
    <h2 class="text-xl">{{ title }}</h2>
    <slot></slot> <!-- Default slot -->
</div>
```

### Using the Store
In any Alpine component:
```html
<button @click="$store.global.setTheme('dark')">Toggle Theme</button>
<span x-text="$store.global.theme"></span>
```

### Using Plugins
```js
Framework.usePlugin('toast', 'Operation successful!', 'success');
```

---

## 3. Architecture (Implementation Plan)

### Core Structure
- **`index.html`**: Entry point. Loads libraries and core scripts.
- **`main.js`**: Bootstraps the app, initializes plugins.
- **`routes.js`**: Route definitions.
- **`core/engine.js`**: Handles HTML fetching, `<include>`, `<layout>`, `<slot>`, and template syntax (`{{ }}`).
- **`core/router.js`**: Hash-based router (`#/path`).
- **`core/store.js`**: Global state management wrapper around Alpine.store.

### Features
- **HTML Loader**: Fetches and caches HTML files.
- **Template Engine**: Transforms `{{ var }}` to `x-text` and `{% for %}` to `x-for`.
- **Component System**: Supports props and slots.
- **XSS Sanitizer**: Uses DOMPurify.

---

## 4. Development Task Log

- [x] **Project Initialization**: Created directory structure and core files.
- [x] **Core Engine**: Implemented HTML Loader, Include Processor, Layout/Slot System, Template Engine.
- [x] **Router**: Implemented Hash-based routing with 404 handling.
- [x] **Store**: Implemented Global Store with Alpine integration.
- [x] **Features**: Added XSS Sanitizer, Toast/Loader Plugins, JSON Data Loader.
- [x] **Content**: Created Demo Pages (Home, About), Navbar, and Layouts.
- [x] **Verification**: Verified all features and wrote documentation.
