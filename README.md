# 3D Bar Chart Visualization

Simple JavaScript library for creating interactive 3D bar charts using Plotly.js.

## What it does

Creates 3D rectangular bars in a 3D space where each bar represents a data point. Perfect for visualizing data with 3 dimensions.

## Requirements

- Plotly.js library
- Modern web browser

## Basic Usage

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"></script>
<div id="chart" style="width: 800px; height: 600px;"></div>
```

```javascript
const data = [
    { x: 1, y: 75, z: 45, color: '#00AA00', label: 'Sample A' },
    { x: 2, y: 60, z: 80, color: '#FFAA00', label: 'Sample B' },
    { x: 3, y: 85, z: 30, color: '#AA0000', label: 'Sample C' }
];

create3DBarChart(data, 'chart');
```

## Data Format

Each data point needs:
- `x` - Position on X axis (number)
- `y` - Bar height (number) 
- `z` - Position on Y axis (number)
- `color` - Bar color (hex string)
- `label` - Display name (string)
- `hoverText` - Custom tooltip (optional)

## Features

- Interactive 3D navigation (drag to rotate, scroll to zoom)
- Click on bars for custom actions
- Hover tooltips
- Wireframe outlines for better visibility
- Mobile responsive

## Files

- `main.js` - Main library
- `example.html` - Simple test page
- `README.md` - This file

## Example

See `test.html` for a working example with sample data.

## License

MIT liscense just like plotly.js, share it around and change it 
