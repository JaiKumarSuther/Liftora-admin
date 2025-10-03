# Environment Configuration Guide

This guide explains how to configure the API endpoints using environment variables for the Liftora Admin Panel.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local` with your configuration:**
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost
   NEXT_PUBLIC_API_PORT_8001=8001
   NEXT_PUBLIC_API_PORT_8002=8002
   NEXT_PUBLIC_API_PORT_8003=8003
   NEXT_PUBLIC_API_PORT_8004=8004
   NEXT_PUBLIC_API_VERSION=v2
   NEXT_PUBLIC_API_TIMEOUT=10000
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Environment Variables Explained

### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost` | Base URL for all API calls |
| `NEXT_PUBLIC_API_VERSION` | `v2` | API version to use |
| `NEXT_PUBLIC_API_TIMEOUT` | `10000` | Request timeout in milliseconds |

### Service Ports

| Variable | Default | Service | Description |
|----------|---------|---------|-------------|
| `NEXT_PUBLIC_API_PORT_8001` | `8001` | User Management | User CRUD, user analytics |
| `NEXT_PUBLIC_API_PORT_8002` | `8002` | Auth & Analytics | Admin login, advanced analytics |
| `NEXT_PUBLIC_API_PORT_8003` | `8003` | Content & Rewards | Quotes, rewards, routines |
| `NEXT_PUBLIC_API_PORT_8004` | `8004` | Statistics | Dashboard metrics, stats |

## Configuration Examples

### Development (Default)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost
NEXT_PUBLIC_API_PORT_8001=8001
NEXT_PUBLIC_API_PORT_8002=8002
NEXT_PUBLIC_API_PORT_8003=8003
NEXT_PUBLIC_API_PORT_8004=8004
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Development with Custom Ports
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost
NEXT_PUBLIC_API_PORT_8001=3001
NEXT_PUBLIC_API_PORT_8002=3002
NEXT_PUBLIC_API_PORT_8003=3003
NEXT_PUBLIC_API_PORT_8004=3004
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=15000
```

### Production with HTTPS
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.liftora.com
NEXT_PUBLIC_API_PORT_8001=443
NEXT_PUBLIC_API_PORT_8002=443
NEXT_PUBLIC_API_PORT_8003=443
NEXT_PUBLIC_API_PORT_8004=443
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=15000
```

### Production with Different Domains
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.liftora.com
NEXT_PUBLIC_API_PORT_8001=8001
NEXT_PUBLIC_API_PORT_8002=8002
NEXT_PUBLIC_API_PORT_8003=8003
NEXT_PUBLIC_API_PORT_8004=8004
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=20000
```

## API Endpoint Structure

The environment variables are used to construct API endpoints as follows:

```
{NEXT_PUBLIC_API_BASE_URL}:{NEXT_PUBLIC_API_PORT_XXXX}/api/{NEXT_PUBLIC_API_VERSION}
```

### Example Endpoints

With default configuration:
- User Management: `http://localhost:8001/api/v2`
- Auth & Analytics: `http://localhost:8002/api/v2`
- Content & Rewards: `http://localhost:8003/api/v2`
- Statistics: `http://localhost:8004/api/v2`

## Important Notes

### 1. NEXT_PUBLIC_ Prefix
- All environment variables **must** be prefixed with `NEXT_PUBLIC_`
- This makes them accessible in the browser/client-side code
- Variables without this prefix will be `undefined` in the browser

### 2. Restart Required
- After changing environment variables, **restart your development server**
- Environment variables are loaded at build time, not runtime

### 3. Security Considerations
- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Use different configurations for development, staging, and production

### 4. Fallback Values
- If environment variables are not set, the application uses default values
- This ensures the app works out-of-the-box for development

## Verification

### Check Configuration
1. Open browser Developer Tools
2. Go to Network tab
3. Make an API request
4. Verify the URL matches your configuration

### Common Issues

#### CORS Errors
```
Access to fetch at 'http://localhost:8001/api/v2/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:** Configure your backend to allow requests from your frontend domain.

#### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:8001
```
**Solution:** Ensure your backend services are running on the configured ports.

#### Environment Variables Not Loading
```
API calls going to undefined:undefined/api/undefined
```
**Solution:** 
1. Check variable names have `NEXT_PUBLIC_` prefix
2. Restart your development server
3. Verify `.env.local` file exists in the project root

#### Wrong API Version
```
404 Not Found - /api/v1/...
```
**Solution:** Update `NEXT_PUBLIC_API_VERSION` to match your backend API version.

## Production Deployment

### Vercel
1. Go to your project settings
2. Add environment variables in the "Environment Variables" section
3. Redeploy your application

### Netlify
1. Go to Site settings > Environment variables
2. Add your environment variables
3. Redeploy your site

### Docker
```dockerfile
# In your Dockerfile
ENV NEXT_PUBLIC_API_BASE_URL=https://api.liftora.com
ENV NEXT_PUBLIC_API_PORT_8001=443
ENV NEXT_PUBLIC_API_PORT_8002=443
ENV NEXT_PUBLIC_API_PORT_8003=443
ENV NEXT_PUBLIC_API_PORT_8004=443
ENV NEXT_PUBLIC_API_VERSION=v2
ENV NEXT_PUBLIC_API_TIMEOUT=15000
```

## Troubleshooting

### Debug Environment Variables
Add this to any component to debug:
```typescript
console.log('Environment Variables:', {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  port8001: process.env.NEXT_PUBLIC_API_PORT_8001,
  port8002: process.env.NEXT_PUBLIC_API_PORT_8002,
  port8003: process.env.NEXT_PUBLIC_API_PORT_8003,
  port8004: process.env.NEXT_PUBLIC_API_PORT_8004,
  version: process.env.NEXT_PUBLIC_API_VERSION,
  timeout: process.env.NEXT_PUBLIC_API_TIMEOUT,
});
```

### Test API Connectivity
```bash
# Test if your backend services are running
curl http://localhost:8001/api/v2/health
curl http://localhost:8002/api/v2/health
curl http://localhost:8003/api/v2/health
curl http://localhost:8004/api/v2/health
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your backend services are running
3. Confirm environment variables are set correctly
4. Test API endpoints directly with curl or Postman
