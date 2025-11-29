# Error Handling Documentation

## Overview

StarterCode framework memiliki sistem error handling yang comprehensive dengan dukungan development dan production modes.

## Modes

### Development Mode
- **Detailed error pages** dengan stack trace
- **Error logging** ke console
- **Debug information** visible
- **No caching** untuk easier development

### Production Mode
- **User-friendly error messages**
- **No technical details** exposed
- **Minimal logging**
- **Optimized caching**

## Configuration

### config.js

```javascript
const AppConfig = {
  mode: 'development', // or 'production'
  debug: true,
  errorReporting: true,
  // ...
};
```

### Switching Modes

**Method 1: config.js**
```javascript
AppConfig.mode = 'production';
```

**Method 2: URL Parameter**
```
?mode=production
```

**Method 3: JavaScript**
```javascript
AppConfig.setMode('production');
AppConfig.toggleMode(); // Toggle between dev/prod
```

**Method 4: LocalStorage** (persists across reloads)
```javascript
localStorage.setItem('app_mode', 'production');
```

## Error Pages

### Directory Structure
```
app/pages/errors/
├── 404.html          # Not Found
├── 500.html          # Server Error (production)
├── dev-error.html    # Development error (detailed)
└── offline.html      # Offline/Network error
```

### Usage

**Automatic**: Framework automatically shows appropriate error page

**Manual**:
```javascript
// Show 404
ErrorHandler.show404();

// Show error (auto-detects mode)
ErrorHandler.handle(error, { component: 'path/to/component' });

// Force dev error
ErrorHandler.showDevError(error, context);

// Force production error
ErrorHandler.showProdError(error, context);
```

## Error Handler API

### ErrorHandler.handle(error, context)
Main error handler - automatically shows dev or prod error based on mode.

```javascript
try {
  // Your code
} catch (error) {
  ErrorHandler.handle(error, {
    component: 'app/pages/home.html',
    action: 'loadData',
  });
}
```

### ErrorHandler.logError(error, context)
Log error to console with formatting.

```javascript
ErrorHandler.logError(error, { type: 'fetch', url: '/api/data' });
```

### ErrorHandler.getHistory()
Get error history for debugging.

```javascript
const errors = ErrorHandler.getHistory();
console.log(errors); // Array of error objects
```

### ErrorHandler.clearHistory()
Clear error history.

```javascript
ErrorHandler.clearHistory();
```

## Global Error Handling

Framework automatically catches:
- **Uncaught exceptions** (`window.error`)
- **Unhandled promise rejections** (`unhandledrejection`)

```javascript
// Automatically handled
throw new Error('Something went wrong');

// Automatically handled
Promise.reject('Failed to load data');
```

## Best Practices

### Development

✅ **DO**:
- Keep `mode: 'development'` in config.js
- Check console for detailed errors
- Use error history for debugging
- Test error scenarios

❌ **DON'T**:
- Deploy with development mode
- Ignore error messages
- Suppress errors without handling

### Production

✅ **DO**:
- Set `mode: 'production'` before deploy
- Test all error pages
- Monitor error logs
- Provide helpful error messages

❌ **DON'T**:
- Expose stack traces
- Show technical details to users
- Leave debug mode enabled

## Production Deployment Checklist

Before deploying to production:

1. ✅ Set `AppConfig.mode = 'production'` in `config.js`
2. ✅ Test all error pages (404, 500, offline)
3. ✅ Verify no dev toolbar visible
4. ✅ Check error logging is minimal
5. ✅ Test error scenarios in production mode
6. ✅ Verify caching is enabled

## Troubleshooting

### Error pages not showing

**Problem**: Error handler not working

**Solution**:
1. Check `config.js` is loaded before `error-handler.min.js`
2. Verify `error-handler.min.js` is loaded in `index.html`
3. Check console for initialization errors

### Dev mode not working

**Problem**: Still seeing production errors in development

**Solution**:
1. Check `AppConfig.mode` value
2. Clear localStorage: `localStorage.clear()`
3. Remove `?mode=production` from URL
4. Reload page

### Errors not logged

**Problem**: No errors in console

**Solution**:
1. Set `AppConfig.debug = true`
2. Set `AppConfig.errorReporting = true`
3. Check browser console settings

## Examples

### Custom Error Handling

```javascript
// In your component
async function loadData() {
  try {
    const data = await Framework.fetchJSON('data/users.json');
    return data;
  } catch (error) {
    ErrorHandler.handle(error, {
      component: 'UserList',
      action: 'loadData',
      url: 'data/users.json',
    });
    return [];
  }
}
```

### Error Recovery

```javascript
// Retry on error
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) {
        ErrorHandler.handle(error, { url, retries });
        throw error;
      }
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## See Also

- [config.js](file:///d:/Projects/StarterCode/config.js) - Configuration
- [error-handler.js](file:///d:/Projects/StarterCode/core/error-handler.js) - Error handler source
- [Error Pages](file:///d:/Projects/StarterCode/app/pages/errors/) - Error page templates
