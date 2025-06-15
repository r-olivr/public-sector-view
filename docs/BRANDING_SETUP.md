
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
- **Background image**: Custom background image for login page
- **Blur color**: Color overlay for background image
- **Blur opacity**: Opacity level of the color overlay (0.0 to 1.0)

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
  "tagline": "Optional tagline",
  "background_image": "/path/to/background.jpg",
  "blur_color": "#000000",
  "blur_opacity": 0.4
}
```

## Setup Instructions

### 1. Create Tenant Configuration
1. Create a new JSON file in `/public/configs/tenants/{tenant_id}.json`
2. Use the structure above with your municipality's details
3. Upload logo, favicon, and background images to `/public/lovable-uploads/`

### 2. Tenant Detection
The system automatically detects tenants based on:
- **Subdomain**: `municipality.yourdomain.com` → tenant_id: "municipality"
- **Fallback**: localStorage or manual configuration

### 3. Asset Management
- Place logos and background images in `/public/lovable-uploads/`
- Recommended logo size: 200x60px (responsive)
- Recommended background image size: 1920x1080px or higher
- Favicon: 32x32px PNG format
- Use relative paths in config: `/lovable-uploads/image.jpg`

### 4. Color Customization
- Colors automatically convert to CSS variables
- Primary color affects buttons, active states
- Secondary color affects text, borders
- Accent color for highlights and special elements
- Blur color creates overlay effect on background image
- Blur opacity controls transparency (0.0 = transparent, 1.0 = opaque)

## Examples

### Example 1: Socorro Municipality
```json
{
  "tenant_id": "socorro",
  "name": "Gestão com Dados - Socorro",
  "logo_url": "/lovable-uploads/socorro_logo.png",
  "primary_color": "#1E90FF",
  "secondary_color": "#FFD700",
  "welcome_message": "Bem-vindo ao Observatório de Dados de Socorro",
  "background_image": "/lovable-uploads/socorro_background.jpg",
  "blur_color": "#1E90FF",
  "blur_opacity": 0.3
}
```

### Example 2: Default Configuration
```json
{
  "tenant_id": "default",
  "name": "Gestão com Dados",
  "primary_color": "#2563eb",
  "secondary_color": "#64748b",
  "welcome_message": "Sistema de Gestão Baseada em Evidências",
  "background_image": "/placeholder.svg",
  "blur_color": "#000000",
  "blur_opacity": 0.4
}
```

## Adding New Tenants

1. **Create config file**: `/public/configs/tenants/{new_tenant_id}.json`
2. **Upload assets**: Logo, favicon, and background image to `/public/lovable-uploads/`
3. **Test subdomain**: `{new_tenant_id}.yourdomain.com`
4. **No deployment needed**: Changes are loaded dynamically

## Background Image Guidelines

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Resolution**: Minimum 1920x1080px for best quality
- **Aspect Ratio**: 16:9 recommended for optimal display
- **File Size**: Keep under 2MB for fast loading

### Blur Overlay Settings
- **blur_color**: Hex color code for overlay (e.g., "#000000" for black)
- **blur_opacity**: Number between 0.0 and 1.0
  - 0.0 = Completely transparent (no overlay)
  - 0.5 = Semi-transparent overlay
  - 1.0 = Completely opaque overlay

## Technical Details

### Context Provider
- `BrandingContext` manages tenant configuration
- Automatically applies CSS variables
- Caches configuration for performance
- Supports background image and blur customization

### Dynamic Loading
- Configurations load at runtime
- Fallback to default if tenant config not found
- CSS variables update automatically
- Background images load responsively

### Performance
- Configurations cached in memory
- Assets served statically
- Background images optimized for web display
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
4. Verify image formats are supported (JPG, PNG, WebP)

### Colors Not Applying
1. Use valid hex color codes
2. Check CSS variable generation in browser dev tools
3. Verify primary/secondary color values

### Background Image Issues
1. Check image file size (should be under 2MB)
2. Verify correct file path in config
3. Ensure image resolution is adequate (min 1920x1080px)
4. Test blur_opacity values between 0.0 and 1.0
