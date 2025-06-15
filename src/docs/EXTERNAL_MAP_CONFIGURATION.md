
# External Map Configuration Guide

## Overview
The platform now supports external maps through iframe embedding, allowing integration with Python-based mapping applications like Dash, Streamlit, or Folium.

## Configuration

### Map URL Configuration
Edit the file `src/config/externalMapConfig.json` to update the map settings:

```json
{
  "mapUrl": "https://your-dash-app.herokuapp.com/",
  "title": "Mapa Interativo - Cidade",
  "description": "Descrição do mapa",
  "height": "600px",
  "allowFullscreen": true,
  "sandbox": "allow-scripts allow-same-origin allow-forms allow-popups",
  "frameBorder": "0"
}
```

### Configuration Options

- **mapUrl**: URL of the external mapping application
- **title**: Title displayed above the map
- **description**: Optional description text
- **height**: Map container height (CSS units)
- **allowFullscreen**: Enable fullscreen capability
- **sandbox**: Security restrictions for the iframe
- **frameBorder**: Border styling (0 for no border)

## Supported External Applications

### Dash Applications
```python
# Example Dash app structure
import dash
from dash import dcc, html
import plotly.express as px

app = dash.Dash(__name__)
# Your map implementation
```

### Streamlit Applications
```python
# Example Streamlit app
import streamlit as st
import folium
from streamlit_folium import folium_static

# Your map implementation
```

### Folium Maps
Direct hosting of Folium maps as HTML files on web servers.

## Security Considerations

The iframe uses sandbox restrictions for security:
- `allow-scripts`: Enables JavaScript execution
- `allow-same-origin`: Allows same-origin requests
- `allow-forms`: Enables form submissions
- `allow-popups`: Allows popup windows

## Responsive Design

The map automatically adapts to different screen sizes:
- Desktop: Full specified height
- Tablet: 400px height
- Mobile: 300px height

## Updating the Map URL

1. **Manual Update**: Edit `src/config/externalMapConfig.json`
2. **Future Enhancement**: Admin interface for URL management (can be implemented)

## Troubleshooting

### Map Not Loading
- Verify the external URL is accessible
- Check CORS settings on the external application
- Ensure the external app allows iframe embedding

### Performance Issues
- Consider lazy loading (already implemented)
- Optimize the external application
- Use CDN for external hosting

## Example External URLs

```json
{
  "mapUrl": "https://dash-app.herokuapp.com/",
  "title": "Dashboard Interativo",
  "description": "Visualização de dados municipais"
}
```

For Streamlit:
```json
{
  "mapUrl": "https://share.streamlit.io/username/repo/main/app.py",
  "title": "Mapa Streamlit",
  "description": "Análise geoespacial interativa"
}
```
