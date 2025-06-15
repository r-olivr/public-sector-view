
# Choropleth Map Customization Guide

This interactive choropleth map component is fully customizable and maintainable. Here's how to update it for different cities and indicators.

## Configuration Files

### 1. Map Configuration (`src/config/mapConfig.json`)
Update this file to change:
- **cityName**: Name of the municipality
- **defaultIndicator**: Which indicator to show by default
- **colorSchemes**: Color palettes for different themes
- **indicators**: Available indicators and their metadata
- **dataSource**: Attribution text

### 2. Data File (`src/data/sampleData.json`)
Contains neighborhood boundaries and indicator values:
- **neighborhoods**: Array of neighborhood objects
  - **id**: Unique identifier
  - **name**: Display name
  - **coordinates**: Polygon coordinates (lat/lng arrays)
  - **indicators**: Values for each indicator

## Adding New Cities

1. Replace coordinate data in `sampleData.json` with new municipality boundaries
2. Update `cityName` in `mapConfig.json`
3. Adjust map center coordinates in `ChoroplethMap.tsx` (setView parameters)

## Adding New Indicators

1. Add indicator configuration to `mapConfig.json`:
```json
"newIndicator": {
  "label": "Display Name",
  "description": "Description text",
  "colorScheme": "sequential",
  "unit": "measurement unit"
}
```

2. Add indicator data to each neighborhood in `sampleData.json`:
```json
"indicators": {
  "newIndicator": 123
}
```

## Color Scheme Customization

Add new color schemes to the `colorSchemes` object in `mapConfig.json`. Use arrays of hex colors from light to dark.

## Export Functionality

The map includes export functionality that can be extended to use libraries like:
- `html2canvas` for screenshot capture
- `leaflet-image` for Leaflet-specific exports
- Custom SVG/PDF generation

## Data Integration

To connect with real data sources:
1. Replace static JSON with API calls in `ChoroplethMap.tsx`
2. Add loading states and error handling
3. Implement data fetching hooks

## Component Usage

```tsx
import ChoroplethMap from '@/components/ChoroplethMap';

// Basic usage
<ChoroplethMap />

// Custom height and hide controls
<ChoroplethMap height="400px" showControls={false} />
```
