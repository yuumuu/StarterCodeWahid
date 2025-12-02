# Example Controllers

This folder contains example controller implementations to help you learn Staco's controller pattern.

## Available Examples

### DivisionController.js
A complete CRUD example demonstrating:
- List view with data transformation
- Detail view with nested data (members, programs)
- Helper methods for formatting
- Lifecycle hooks (afterLoad, onError)

## How to Use

1. **Study the code** to understand controller patterns
2. **Copy useful patterns** to your own controllers
3. **Delete this folder** when you don't need the examples

## Integration

To use the division example in your app:

1. **Add routes** in `config/routes.js`:
```javascript
{ path: '/divisions', component: 'app/Views/examples/divisions/index.html' },
{ path: '/divisions/:slug', component: 'app/Views/examples/divisions/detail.html' }
```

2. **Update navbar** in `app/Components/navbar.html`:
```html
<a href="#/divisions" class="nav-link">Divisions</a>
```

## Learn More

- **Controllers Documentation**: Visit `/docs` in the app
- **Views**: Check `app/Views/examples/`
- **Data**: See `storage/data/examples/`
