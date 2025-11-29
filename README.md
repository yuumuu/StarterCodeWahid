# StarterCode - Advanced Lightweight SPA Framework

## 📖 Quick Access

👉 **View full documentation in the app:** Navigate to `/docs` in the application for an interactive documentation experience.

Alternatively, read below for quick reference.

---

## 📚 Documentation Index

| Resource | Description |
|----------|-------------|
| **[GETTING_STARTED.md](docs/GETTING_STARTED.md)** | 5-minute quick start guide |
| **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | Solutions to common issues |
| **[core/README.md](core/README.md)** | Framework internals deep dive |
| **[docs/](docs/)** | Additional documentation files |

## 🎓 Learning Path

1. **Beginner**: Read [GETTING_STARTED.md](docs/GETTING_STARTED.md) → Create first page
2. **Intermediate**: Explore `#/docs` → Learn Components & Routing
3. **Advanced**: Read [core/README.md](core/README.md) → Custom Plugins

---


## 🚀 Overview

This is an **Advanced Lightweight SPA Framework** built with HTML, TailwindCSS, and Alpine.js. It runs entirely in the browser (no Node.js build step required), featuring a custom engine for components, layouts, routing, and state management.

It focuses on **HTML-based Client-Side Rendering (CSR)**, where components are defined in HTML files and hydrated with JavaScript (Alpine.js) for interactivity.

### Key Features
- ✅ Zero build step - runs directly in the browser
- ✅ HTML-first component system with Layouts & Slots
- ✅ Hash-based routing with dynamic URL parameters
- ✅ Global state management (Store)
- ✅ Alpine.js integration for interactivity
- ✅ Built-in data binding helpers
- ✅ Caching and skeleton loading
- ✅ XSS protection with DOMPurify

---

## 🎯 Quick Start

> **New to the framework?** Check out the detailed **[Getting Started Guide](docs/GETTING_STARTED.md)** for a step-by-step tutorial.


### Running the Project
Since this framework uses `fetch` to load components, you must serve it via a local server to avoid CORS errors.

**Option 1: VS Code Live Server**
```
Right-click index.html → "Open with Live Server"
```

**Option 2: Python**
```bash
python -m http.server
```

**Option 3: Node.js**
```bash
npx serve .
```

Then open `http://localhost:8000` (or the port shown) in your browser.

---

## 📝 Creating Your First Page

1. Create a new file: `app/pages/mypage.html`
2. Add this content:

```html
<layout name="main">
    <slot name="content">
        <h1>My Page</h1>
        <div x-data="{ count: 0 }">
            <button @click="count++">
                Count: <span x-text="count"></span>
            </button>
        </div>
    </slot>
</layout>
```

3. Add route in `routes.js`:

```javascript
const routes = [
    { path: '/', component: 'app/pages/home.html' },
    { path: '/mypage', component: 'app/pages/mypage.html' }
];
```

4. Add navigation link in `app/components/navbar.html` and visit `#/mypage`

---

## 🏗️ Architecture

### Project Structure
```
StarterCode/
├── index.html              # Entry point
├── main.js                 # App initialization
├── routes.js               # Route definitions
├── app/
│   ├── components/         # Reusable components
│   │   └── navbar.html
│   ├── layouts/            # Layout templates
│   │   └── main.html
│   └── pages/              # Page components
│       ├── home.html
│       ├── about.html
│       ├── docs.html       # Documentation page
│       └── 404.html
├── core/                   # Framework core
│   ├── engine.js           # Rendering engine
│   ├── router.js           # Hash router
│   ├── store.js            # State management
│   ├── ui.js               # UI utilities
│   └── styles/
├── assets/                 # Static assets
│   ├── css/
│   ├── js/
│   └── media/
└── data/                   # JSON data files
```

### Core Modules

| File | Purpose |
|------|---------|
| **engine.js** | HTML loading, component includes, layouts, template transformation |
| **router.js** | Hash-based routing, URL parameter parsing |
| **store.js** | Global state management with Alpine integration |
| **ui.js** | Skeleton loaders, caching, utility helpers |

---

## 🔌 API Reference

### Router

```javascript
// Navigate to a route
Router.navigate('/about');

// Current routes are auto-loaded from routes.js
```

### Store (Global State)

```javascript
// Set a value
Store.set('user', { name: 'John', role: 'admin' });

// Get a value
Store.get('user');

// Subscribe to changes
Store.subscribe('user', (newValue) => {
    console.log('User updated:', newValue);
});
```

### Framework (Rendering Engine)

```javascript
// Render a component
Framework.render('app/pages/home.html', 'router-view');

// Fetch JSON with caching
Framework.fetchJSON('data/users.json').then(data => {
    console.log(data);
});
```

### Data Binding Helpers

#### Collection Helper
```html
<div x-data="collection('data/users.json')">
    <template x-for="user in items">
        <div x-text="user.name"></div>
    </template>
    <div x-show="loading">Loading...</div>
    <div x-show="error" x-text="error"></div>
</div>
```

#### Item Helper
```html
<div x-data="item('data/users.json', 'id', 1)">
    <h1 x-text="item?.name || 'Not found'"></h1>
    <div x-show="loading">Loading...</div>
</div>
```

---

## 🎨 Component System

### Creating a Component
Create `app/components/card.html`:
```html
<div class="border rounded-lg p-4">
    <h3 x-text="title"></h3>
    <slot name="default"></slot>
</div>
```

### Using a Component
In any page:
```html
<include src="app/components/card.html" title="Welcome">
    <p>This content goes into the default slot</p>
</include>
```

### Components with Named Slots
Create `app/components/modal.html`:
```html
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6">
        <div class="mb-4">
            <slot name="header"></slot>
        </div>
        <slot name="content"></slot>
        <div class="mt-4">
            <slot name="footer"></slot>
        </div>
    </div>
</div>
```

Use it:
```html
<include src="app/components/modal.html">
    <slot name="header"><h2>Confirm Action</h2></slot>
    <slot name="content"><p>Are you sure?</p></slot>
    <slot name="footer"><button>Yes</button> <button>No</button></slot>
</include>
```

---

## 📊 Template Syntax

The framework supports several template features:

| Syntax | Result |
|--------|--------|
| `{{ variable }}` | Text interpolation → `<span x-text="variable"></span>` |
| `{% if condition %}...{% endif %}` | Conditional → `<template x-if="condition">...</template>` |
| `{% for item in list %}...{% endfor %}` | Looping → `<template x-for="item in list">...</template>` |

Example:
```html
<div x-data="{ items: [1, 2, 3], show: true }">
    <div>{% if show %}<p>Count: {{ items.length }}</p>{% endif %}</div>
    
    <template x-for="item in items">
        <div x-text="item"></div>
    </template>
</div>
```

---

## 🔄 Routing Guide

### Basic Routes
```javascript
const routes = [
    { path: '/', component: 'app/pages/home.html' },
    { path: '/about', component: 'app/pages/about.html' },
    { path: '/404', component: 'app/pages/404.html' }
];
```

### Dynamic Routes with Parameters
```javascript
const routes = [
    { path: '/user/:id', component: 'app/pages/user-detail.html' },
    { path: '/post/:slug', component: 'app/pages/post-detail.html' }
];
```

Access parameters in your page:
```html
<div x-data="{ params: {} }" 
     @init="params = Alpine.store('params') || {}">
    <h1>User ID: <span x-text="params.id"></span></h1>
</div>
```

Navigate with parameters:
```html
<a href="#/user/123">View User</a>
<a href="#/post/my-blog-post">Read Post</a>
```

---

## 🛠️ Development Guide

### Best Practices

1. **Keep components modular** - Each component should have a single responsibility
2. **Use consistent naming** - Use kebab-case for filenames
3. **Leverage slots** - Use named slots for flexible component composition
4. **Cache data** - Use the built-in caching for API responses
5. **Handle loading states** - Show skeleton loaders while fetching data

### Adding New Features

To add a new page:
1. Create `app/pages/feature-name.html`
2. Add route to `routes.js`
3. Add navigation link to navbar
4. Implement interactivity with Alpine.js

To add a shared component:
1. Create `app/components/component-name.html`
2. Use `<include>` to add it to pages
3. Pass data via attributes

---

## 📚 Advanced Topics

### Plugins
Register custom functionality:
```javascript
Framework.plugin('customPlugin', (arg) => {
    // Your custom logic
    return result;
});

// Use it
Framework.usePlugin('customPlugin', data);
```

### Store Reactivity
The Store integrates with Alpine:
```html
<div x-data @init="Alpine.watch('appState', value => console.log(value))">
    <!-- content -->
</div>
```

### Caching
Built-in caching with TTL:
```javascript
// Set cache (TTL in milliseconds)
CoreUI.Cache.set('users', data, 30 * 60 * 1000);

// Get cache
const cached = CoreUI.Cache.get('users');
```

---

## ✅ Checklist

- [x] Project initialization with directory structure
- [x] Core rendering engine (components, layouts, slots)
- [x] Hash-based router with dynamic parameters
- [x] Global state management (Store)
- [x] Alpine.js integration
- [x] Data binding helpers (collection, item)
- [x] Demo pages and components
- [x] Comprehensive documentation
- [x] Interactive docs page

---

## 📖 Interactive Documentation

For detailed interactive documentation, navigate to the **Docs** section in the app (`#/docs`). You'll find:
- Step-by-step tutorials
- Code examples
- Component gallery
- API reference
- Troubleshooting guide

---

## 🐛 Troubleshooting

Encountering issues? Check out **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** for solutions to common problems like:
- CORS errors
- Component loading failures
- Routing issues

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
