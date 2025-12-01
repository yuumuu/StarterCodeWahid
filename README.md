# Staco - Advanced Lightweight SPA Framework

> **🌐 Live Demo:** [yuumuu.github.io/Staco](https://yuumuu.github.io/Staco)

## What is Staco?

Modern, lightweight SPA framework with zero build step. Built with HTML, TailwindCSS, and Alpine.js for rapid development and production-ready applications.

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yuumuu/Staco.git
cd Staco
```

### 2. Start Local Server
```bash
# Option 1: npx
npx serve -l 3000 .

# Option 2: Python
python -m http.server 3000

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

### 3. Start Building!
Open `http://localhost:3000` and you're ready to code.

## Key Features

- 🚀 **Zero Build** - No webpack, no npm scripts, just pure browser-based development
- 🎮 **MVC Controllers** - Clean separation of concerns with auto-discovery and lazy loading
- 🗺️ **Smart Routing** - Dynamic routes with parameters and active link detection
- 🎨 **Component System** - Reusable HTML components with slots and includes
- 💾 **State Management** - Global store with Alpine.js integration
- ⚡ **Performance** - Morphdom updates, caching, and XSS prevention built-in

## Documentation

📚 **Full Documentation:** Visit `/docs` in the app for interactive, comprehensive documentation covering:
- Getting Started Guide
- Routing System
- Controller Pattern
- Component System
- State Management
- Best Practices
- Complete Examples

## Learning Resources

💡 **Example Implementations:** Check the `examples/` folders to learn by example:

- **Controllers**: `app/Controllers/examples/` - MVC controller patterns
- **Views**: `app/Views/examples/` - Page templates and layouts
- **Data**: `storage/data/examples/` - Sample data structures
- **Helpers**: `public/js/examples/` - Utility functions

**Delete all `examples/` folders when you're ready to start fresh!**

## Project Structure

```
Staco/
├── app/
│   ├── Components/      # Reusable UI components
│   │   └── examples/    # Example components (delete when ready)
│   ├── Controllers/     # MVC controllers
│   │   └── examples/    # Example controllers (delete when ready)
│   ├── Layouts/         # Page layouts
│   └── Views/           # Page views
│       └── examples/    # Example views (delete when ready)
├── core/System/         # Framework core (don't modify)
│   ├── Controller.js    # Controller system
│   ├── Engine.js        # Template engine
│   ├── Router.js        # Hash router
│   ├── Store.js         # State management
│   ├── UI.js            # UI utilities
│   └── ErrorHandler.js  # Error handling
├── public/              # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   │   └── examples/    # Example helpers (delete when ready)
│   └── media/           # Images, videos
└── storage/data/        # JSON data files
    └── examples/        # Example data (delete when ready)
```

## For Developers

After cloning Staco:

1. ✅ **You have a clean, production-ready template**
   - Modern landing page
   - Features showcase
   - Interactive documentation
   - Clean routing and navigation

2. ✅ **Learn from examples**
   - Study `app/*/examples/` folders
   - See real implementations
   - Copy useful patterns

3. ✅ **Start building**
   - Delete all `examples/` folders when ready
   - Create controllers in `app/Controllers/`
   - Create views in `app/Views/`
   - Add routes in `config/routes.js`

4. ✅ **Deploy**
   - No build step needed
   - Just upload files to any static host
   - Works on GitHub Pages, Netlify, Vercel, etc.

## Example Integration

To use the division example in your app:

1. **Uncomment routes** in `config/routes.js`:
```javascript
{ path: '/divisions', component: 'app/Views/examples/divisions/index.html' },
{ path: '/divisions/:slug', component: 'app/Views/examples/divisions/detail.html' }
```

2. **Uncomment navbar link** in `app/Components/navbar.html`:
```html
<a href="#/divisions" class="nav-link">Examples</a>
```

3. **Load data-helper** (optional) in `index.html`:
```html
<script src="public/js/examples/data-helper.js"></script>
```

> [!NOTE]
> **About DataHelper**: The `data-helper.js` file included in the examples is specifically designed for the **Divisions** example data structure. It is **not** a dynamic helper for all tables or data types. For your own data models, you should create your own helper functions or use `Framework.fetchJSON()` directly.

## Why Staco?

- **🎯 Perfect for Prototyping** - No build step means instant feedback
- **🏗️ Production Ready** - Built-in security, performance, and error handling
- **📚 Easy to Learn** - HTML-first approach, minimal JavaScript required
- **🔧 Highly Extensible** - Plugin system and flexible architecture

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by the Staco community**
