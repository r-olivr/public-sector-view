
# Brand Kit / Customization System

## Overview
This system allows each municipality (tenant) to customize the visual identity and public-facing elements of the platform.

## Customizable Elements

### Per Tenant Configuration:
- **Platform name**: Title displayed on header and browser tab
- **Municipality logo**: Image file, displayed on login page and header
- **Color palette**: Primary, secondary, accent colors for UI elements
- **Favicon**: Custom favicon for the tenant
- **Welcome message**: Optional tagline on login page
- **Footer text**: Custom footer text

## Configuration Structure

### JSON Config File Structure:
```json
{
  "tenant_id": "municipality_name",
  "name": "Platform Name",
  "logo_url": "/path/to/logo.png",
  "primary_color": "#1E90FF",
  "secondary_color": "#FFD700", 
  "accent_color": "#32CD32",
  "favicon": "/path/to/favicon.png",
  "welcome_message": "Welcome message text",
  "footer_text": "Footer text",
  "tagline": "Optional tagline"
}
```

## Setup Instructions

### 1. Create Tenant Configuration
1. Create a new JSON file in `/public/configs/tenants/{tenant_id}.json`
2. Use the structure above with your municipality's details
3. Upload logo and favicon files to `/public/lovable-uploads/`

### 2. Tenant Detection
The system automatically detects tenants based on:
- **Subdomain**: `municipality.yourdomain.com` → tenant_id: "municipality"
- **Fallback**: localStorage or manual configuration

### 3. Asset Management
- Place logos in `/public/lovable-uploads/`
- Recommended logo size: 200x60px (responsive)
- Favicon: 32x32px PNG format
- Use relative paths in config: `/lovable-uploads/logo.png`

### 4. Color Customization
- Colors automatically convert to CSS variables
- Primary color affects buttons, active states
- Secondary color affects text, borders
- Accent color for highlights and special elements

## Examples

### Example 1: Socorro Municipality
```json
{
  "tenant_id": "socorro",
  "name": "Gestão com Dados - Socorro",
  "logo_url": "/lovable-uploads/socorro_logo.png",
  "primary_color": "#1E90FF",
  "secondary_color": "#FFD700",
  "welcome_message": "Bem-vindo ao Observatório de Dados de Socorro"
}
```

### Example 2: Default Configuration
```json
{
  "tenant_id": "default",
  "name": "Gestão com Dados",
  "primary_color": "#2563eb",
  "secondary_color": "#64748b",
  "welcome_message": "Sistema de Gestão Baseada em Evidências"
}
```

## Adding New Tenants

1. **Create config file**: `/public/configs/tenants/{new_tenant_id}.json`
2. **Upload assets**: Logo and favicon to `/public/lovable-uploads/`
3. **Test subdomain**: `{new_tenant_id}.yourdomain.com`
4. **No deployment needed**: Changes are loaded dynamically

## Technical Details

### Context Provider
- `BrandingContext` manages tenant configuration
- Automatically applies CSS variables
- Caches configuration for performance

### Dynamic Loading
- Configurations load at runtime
- Fallback to default if tenant config not found
- CSS variables update automatically

### Performance
- Configurations cached in memory
- Assets served statically
- No impact on core application performance

## Troubleshooting

### Config Not Loading
1. Check file path: `/public/configs/tenants/{tenant_id}.json`
2. Verify JSON syntax
3. Check browser console for errors

### Assets Not Displaying
1. Verify file paths in config
2. Check if files exist in `/public/lovable-uploads/`
3. Ensure proper file permissions

### Colors Not Applying
1. Use valid hex color codes
2. Check CSS variable generation in browser dev tools
3. Verify primary/secondary color values
