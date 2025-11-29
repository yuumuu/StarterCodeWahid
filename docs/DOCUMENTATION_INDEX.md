# StarterCode Documentation Index

## 📚 Complete Documentation Files

### Quick References

- **[GETTING_STARTED.md](GETTING_STARTED.md)** ← Start here if you're new!
  - 5-minute quick start
  - How to create your first page
  - Common tasks
  - Learning path

### Main Documentation

- **[README.md](README.md)**
  - Project overview
  - Architecture explanation
  - API reference
  - Component system guide
  - Routing system
  - Advanced topics

### Troubleshooting

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**
  - Common issues & solutions
  - Debug tips
  - Performance optimization
  - Frequently asked questions

### Core Framework

- **[core/README.md](core/README.md)**
  - Framework internals
  - CoreUI utilities
  - Skeleton loaders
  - Caching system

---

## 🌐 Interactive Documentation

**Best way to learn:** Visit the app at `http://localhost:8000` and navigate to `#/docs` for an interactive, beautifully formatted documentation experience.

The interactive docs cover:

- Getting Started
- Routing System
- Component System
- Data Binding & Helpers
- State Management
- Architecture Overview
- Advanced Topics
- Best Practices

---

## 🎯 Quick Navigation

### By Use Case

| I want to...            | Go to...                                                 |
| ----------------------- | -------------------------------------------------------- |
| Get started immediately | [GETTING_STARTED.md](GETTING_STARTED.md)                 |
| Create a new page       | [GETTING_STARTED.md#your-first-page](GETTING_STARTED.md) |
| Learn routing           | [README.md#routing-guide](README.md)                     |
| Build a component       | [README.md#component-system](README.md)                  |
| Manage state            | [README.md#advanced-topics](README.md)                   |
| Fix a problem           | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)                 |
| Understand architecture | [README.md#architecture](README.md)                      |
| Deploy the app          | [GETTING_STARTED.md#ready-to-deploy](GETTING_STARTED.md) |

### By Level

**Beginner**

1. [GETTING_STARTED.md](GETTING_STARTED.md) - Start here
2. App `#/docs` - Interactive learning
3. [README.md](README.md) - Deep dive

**Intermediate**

1. [README.md#component-system](README.md)
2. [README.md#data-binding-helpers](README.md)
3. [README.md#routing-guide](README.md)

**Advanced**

1. [README.md#advanced-topics](README.md)
2. [core/README.md](core/README.md)
3. Study source code in `core/` folder

---

## 📖 Learning Path

### Phase 1: Basics (15 minutes)

- [ ] Read [GETTING_STARTED.md](GETTING_STARTED.md)
- [ ] Create your first page (`app/pages/hello.html`)
- [ ] Add a route and navigation link

### Phase 2: Understanding (30 minutes)

- [ ] Visit `#/docs` in the app
- [ ] Read about routing and components
- [ ] Explore example pages in `app/pages/`

### Phase 3: Building (1+ hours)

- [ ] Create your own pages
- [ ] Add interactivity with Alpine.js
- [ ] Load data with `collection()` helper
- [ ] Use global `Store` for state

### Phase 4: Advanced (ongoing)

- [ ] Read advanced topics in [README.md](README.md)
- [ ] Study `core/` framework code
- [ ] Build complex components
- [ ] Optimize performance

---

## 🔍 File Organization

```
StarterCode/
├── README.md                    ← Main documentation
├── GETTING_STARTED.md          ← Quick start guide
├── TROUBLESHOOTING.md          ← Problem solving
├── DOCUMENTATION_INDEX.md       ← This file
├── core/
│   └── README.md               ← Framework internals
├── app/
│   ├── pages/
│   │   └── docs.html           ← Interactive docs page
│   ├── components/
│   └── layouts/
└── data/
    ├── docs.json               ← Documentation content
    └── api-reference.json      ← API reference data
```

---

## 💡 Documentation Features

### This Documentation Includes

- ✅ Beginner-friendly quick start
- ✅ Step-by-step tutorials
- ✅ Complete API reference
- ✅ Code examples for every feature
- ✅ Architecture explanation
- ✅ Troubleshooting guide
- ✅ Best practices
- ✅ Interactive web-based docs
- ✅ Performance tips
- ✅ Deployment guide

### Interactive Documentation

Visit `#/docs` in the running app to access:

- 📚 Getting Started section
- 🗺️ Routing System guide
- 🎨 Component System examples
- 📊 Data Binding tutorials
- 💾 State Management explained
- 🏗️ Architecture overview
- ⚡ Advanced Topics
- ✅ Best Practices

---

## 🚀 Quick Commands Reference

### Running the Project

```bash
# VS Code Live Server (recommended)
# Right-click index.html → "Open with Live Server"

# Python
python -m http.server

# Node.js
npx serve .
```

### Creating Components

```bash
# New page
touch app/pages/mypage.html

# New component
touch app/components/mycomponent.html

# New layout
touch app/layouts/mylayout.html
```

### Common Patterns

```html
<!-- Create page -->
<layout name="main">
  <slot name="content">
    <!-- Content here -->
  </slot>
</layout>

<!-- Use component -->
<include src="app/components/card.html" title="Hello"></include>

<!-- Load data -->
<div x-data="collection('data/users.json')">
  <template x-for="user in items">
    <div x-text="user.name"></div>
  </template>
</div>
```

---

## 📞 Getting Help

### For Different Issues:

| Issue                      | Resource                                           |
| -------------------------- | -------------------------------------------------- |
| Not sure where to start    | [GETTING_STARTED.md](GETTING_STARTED.md)           |
| Feature not working        | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)           |
| Want to learn deeply       | App `#/docs` or [README.md](README.md)             |
| Understanding architecture | [core/README.md](core/README.md)                   |
| API reference              | [data/api-reference.json](data/api-reference.json) |

### Debugging Checklist

- [ ] Is the local server running?
- [ ] Did you check browser console (F12)?
- [ ] Is the file path correct?
- [ ] Did you add the route to `routes.js`?
- [ ] Did you add navigation link to navbar?
- [ ] Is Alpine.js loaded in `index.html`?

---

## 🎓 Recommended Reading Order

1. **First time?** → [GETTING_STARTED.md](GETTING_STARTED.md)
2. **Want to explore?** → App `#/docs`
3. **Getting stuck?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **Need deep dive?** → [README.md](README.md)
5. **Understand internals?** → [core/README.md](core/README.md)

---

## ✨ Key Features Documented

- ✅ **Routing** - Hash-based with dynamic parameters
- ✅ **Components** - Reusable with slots and props
- ✅ **Layouts** - Template system for consistent look
- ✅ **State Management** - Global Store + Local Alpine state
- ✅ **Data Binding** - Collection & Item helpers
- ✅ **Interactivity** - Full Alpine.js support
- ✅ **Caching** - Built-in data caching
- ✅ **Security** - XSS protection with DOMPurify
- ✅ **Performance** - Morphdom for smooth updates
- ✅ **Loading States** - Skeleton loaders included

---

## 🎉 You're All Set!

The documentation is comprehensive and designed to help you succeed.

**Next steps:**

1. Start with [GETTING_STARTED.md](GETTING_STARTED.md) if new
2. Create your first page
3. Explore `#/docs` in the running app
4. Build amazing things!

---

**Happy coding!** 🚀

For updates and contributions, visit [GitHub](https://github.com/yuumuu)
