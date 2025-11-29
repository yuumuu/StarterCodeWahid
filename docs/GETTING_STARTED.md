# Getting Started with StarterCode

Welcome to StarterCode! This guide will get you up and running in minutes.

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code recommended)
- Python 3 or Node.js (for local server - required!)

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yuumuu/StarterCode.git
cd StarterCode
```

### Step 2: Open the Project

Open this folder in VS Code or your favorite editor.

## 🚀 Quick Start (5 minutes)

### Step 1: Start a Local Server

Choose ONE method below:

**Option A: VS Code Live Server (Easiest)**

```
1. Install "Live Server" extension (by Ritwick Dey)
2. Right-click index.html
3. Select "Open with Live Server"
```

**Option B: Python**

```bash
python -m http.server
# Open http://localhost:8000 in your browser
```

**Option C: Node.js**

```bash
npx serve .
# Open the URL shown in terminal
```

### Step 3: Explore the App

- Visit `http://localhost:8000` (or the URL shown)
- Click the "📚 Docs" link in the navigation
- Read through the interactive documentation

## 📚 Understanding the Structure

```
StarterCode/
├── index.html          ← Entry point (load this in browser)
├── main.js             ← App initialization
├── routes.js           ← URL routes
├── app/
│   ├── components/     ← Reusable UI parts
│   ├── layouts/        ← Page templates
│   └── pages/          ← Your actual pages
├── core/               ← Framework code (don't modify)
├── assets/             ← CSS, JS, images
└── data/               ← JSON data files
```

## 🎯 Your First Page

### 1. Create a Page File

Create `app/pages/hello.html`:

```html
<layout name="main">
  <slot name="content">
    <h1>Hello World!</h1>
    <p>This is my first page.</p>
  </slot>
</layout>
```

### 2. Add Route

Edit `routes.js` and add:

```javascript
const routes = [
  { path: "/", component: "app/pages/home.html" },
  { path: "/hello", component: "app/pages/hello.html" }, // ← Add this
  // ... other routes
];
```

### 3. Add Navigation Link

Edit `app/components/navbar.html` and add:

```html
<a href="#/hello" class="text-gray-600 hover:text-blue-600 transition">Hello</a>
```

### 4. Visit Your Page

Click the "Hello" link in the navbar or visit `#/hello`

**Congratulations!** You've created your first page! 🎉

## 🔧 Common Tasks

### Add Interactive Button

```html
<div x-data="{ count: 0 }">
  <button @click="count++">You clicked {{ count }} times</button>
</div>
```

### Load Data from JSON

```html
<div x-data="collection('data/users.json')">
  <div x-show="loading">Loading...</div>

  <template x-for="user in items">
    <div>
      <h3 x-text="user.name"></h3>
      <p x-text="user.email"></p>
    </div>
  </template>
</div>
```

### Create Reusable Component

Create `app/components/greeting.html`:

```html
<div class="bg-blue-100 p-4 rounded">
  <h2 x-text="`Hello, ${name}!`"></h2>
</div>
```

Use it in any page:

```html
<include src="app/components/greeting.html" name="Alice"></include>
```

### Use Global State

```javascript
// Store a value
Store.set("username", "John");

// Get it back
const name = Store.get("username");

// Use in template
<span x-text="Alpine.store('username')"></span>;
```

## 📖 Learning Path

1. **Read:** The interactive docs (`#/docs`)
2. **Explore:** Look at existing pages in `app/pages/`
3. **Modify:** Change text and colors to get comfortable
4. **Create:** Build your own page
5. **Enhance:** Add interactivity with Alpine.js

## ⚡ Key Concepts

### Hash-Based Routing

Links use `#/path` syntax:

```html
<a href="#/">Home</a>
<a href="#/about">About</a>
<a href="#/user/123">User Profile (Dynamic)</a>
```

> **Tip:** Learn more about dynamic routes (like `#/user/:id`) in the [README.md](../README.md#dynamic-routes-with-parameters).

### Layouts and Slots

Pages are wrapped in layouts with content slots:

```html
<layout name="main">
  <slot name="content">
    <!-- Your page content goes here -->
  </slot>
</layout>
```

### Template Syntax

Simple data binding:

```html
{{ variableName }}
<!-- Text interpolation -->
{% if condition %} ... {% endif %}
<!-- Conditionals -->
{% for item in list %} ... {% endfor %}
<!-- Loops -->
```

### Alpine.js for Interactivity

Use `x-data` for state and `@click` for events:

```html
<div x-data="{ isOpen: false }">
  <button @click="isOpen = !isOpen">Toggle</button>
  <div x-show="isOpen">Hidden content</div>
</div>
```

## 🐛 Something Not Working?

**Most issues are path-related!** Double-check:

1. Is the file in the right location?
2. Is the path spelled correctly?
3. Did you add the route to `routes.js`?
4. Did you add the link to the navbar?

**Still stuck?** See `TROUBLESHOOTING.md` for common issues.

## 📚 Next Steps

1. Read the full documentation: Navigate to `#/docs`
2. Explore the `app/pages/` folder to see examples
3. Check `TROUBLESHOOTING.md` for common issues
4. Look at the source code (`core/engine.js`, etc.)

## 💡 Tips

- **Use the browser console** (F12) to debug
- **Start simple** - build a basic page, then add features
- **Use components** - they're reusable and keep code organized
- **Test locally first** - before deploying

## 🎨 Customizing Your App

### Adding Custom CSS
1. Create your CSS file: `assets/css/style.css`
2. Link it in `index.html` (after Tailwind):
```html
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="assets/css/style.css"> <!-- Add this -->
```

### Adding Custom JavaScript
1. Create your JS file: `assets/js/app.js`
2. Link it in `index.html` (before closing body):
```html
<script src="assets/js/app.js"></script>
</body>
```

### Configuring Tailwind
You can customize Tailwind in the script tag in `index.html`:
```html
<script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    primary: '#3b82f6',
                }
            }
        }
    }
</script>
```

## 🚢 Ready to Deploy?

Since this is a pure client-side SPA with no build step, you can deploy to:

- **Netlify** (drag & drop your folder)
- **Vercel** (connect your GitHub repo)
- **GitHub Pages** (push to gh-pages branch)
- **Any static hosting** (Surge, Firebase, etc.)

Just upload all files as-is - no build command needed!

## 📞 Quick Reference

| Task            | File                                |
| --------------- | ----------------------------------- |
| Add page        | Create `app/pages/name.html`        |
| Add route       | Edit `routes.js`                    |
| Add link        | Edit `app/components/navbar.html`   |
| Global data     | Use `Store.set()` and `Store.get()` |
| Component state | Use `x-data="{ ... }"`              |
| Load JSON       | Use `collection()` helper           |

---

## Happy Coding! 🎉

You now have a powerful, lightweight framework for building web applications.
Start creating amazing things!

**Questions?** Check the docs at `#/docs` or see `TROUBLESHOOTING.md`.
