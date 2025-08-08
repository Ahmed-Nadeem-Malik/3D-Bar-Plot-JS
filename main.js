/* ========================================
   3D BAR CHART VISUALIZATION LIBRARY
   ======================================== */

/**
 * Generic 3D bar chart visualization functions using Plotly.js
 * Each bar represents a data point with customizable properties
 * 
 * Expected data format:
 * [{
 *   x: number,        // X-axis position
 *   y: number,        // Bar height (Z-axis value)  
 *   z: number,        // Y-axis position
 *   color: string,    // Bar color
 *   label: string,    // Display name
 *   hoverText: string // Custom hover text (optional)
 * }]
 */

/**
 * Calculate the 8 corner positions of a 3D rectangular bar
 * Returns coordinates for bottom 4 corners + top 4 corners
 */
function createBarCorners(point, width = 0.05, depth = 1.0) {
    const { x, z: yPos, y: height } = point;
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    
    return {
        x: [x - halfWidth, x + halfWidth, x + halfWidth, x - halfWidth,
            x - halfWidth, x + halfWidth, x + halfWidth, x - halfWidth],
        y: [yPos - halfDepth, yPos - halfDepth, yPos + halfDepth, yPos + halfDepth,
            yPos - halfDepth, yPos - halfDepth, yPos + halfDepth, yPos + halfDepth],
        z: [0, 0, 0, 0, height, height, height, height]
    };
}

/**
 * Create a solid 3D bar using triangular faces (Plotly mesh3d)
 * The i,j,k arrays tell Plotly how to connect corners into triangles
 */
function createBarMesh(point, index) {
    const corners = createBarCorners(point);
    
    return {
        type: 'mesh3d',
        x: corners.x,
        y: corners.y, 
        z: corners.z,
        i: [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j: [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k: [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        color: point.color,
        opacity: 1.0,
        lighting: { ambient: 1.0, diffuse: 0.0, specular: 0.0, roughness: 1.0, fresnel: 0.0 },
        lightposition: { x: 0, y: 0, z: 0 },
        showlegend: false,
        hoverinfo: 'text',
        text: point.hoverText || `X: ${point.x}<br>Y: ${point.z}<br>Height: ${point.y}<br>Label: ${point.label}`,
        hoverlabel: { font: { size: 16 } },
        name: `bar_${index}`
    };
}

/**
 * Create black outline edges around each 3D bar for better visibility
 * Uses line segments to draw all 12 edges of the rectangular box
 */
function createBarWireframe(point) {
    const corners = createBarCorners(point);
    const { x, y, z } = corners;
    
    return {
        type: 'scatter3d',
        mode: 'lines',
        x: [x[0], x[1], x[2], x[3], x[0], null,
            x[4], x[5], x[6], x[7], x[4], null,
            x[0], x[4], null, x[1], x[5], null,
            x[2], x[6], null, x[3], x[7]],
        y: [y[0], y[1], y[2], y[3], y[0], null,
            y[4], y[5], y[6], y[7], y[4], null,
            y[0], y[4], null, y[1], y[5], null,
            y[2], y[6], null, y[3], y[7]],
        z: [z[0], z[1], z[2], z[3], z[0], null,
            z[4], z[5], z[6], z[7], z[4], null,
            z[0], z[4], null, z[1], z[5], null,
            z[2], z[6], null, z[3], z[7]],
        line: { color: '#000000', width: 2 },
        showlegend: false,
        hoverinfo: 'skip',
        name: 'wireframe'
    };
}

/**
 * Main function: Create 3D bar chart
 * @param {Array} data - Array of data points
 * @param {string} containerId - ID of the HTML container element
 * @param {Object} options - Configuration options
 */
function create3DBarChart(data, containerId, options = {}) {
    console.log('Creating 3D bar chart with', data ? data.length : 0, 'data points');
    
    if (!data || data.length === 0) {
        console.log('No data available for 3D chart');
        const container = document.getElementById(containerId);
        if (container) container.style.display = 'none';
        return;
    }
    
    const traces = [];
    
    // Create bars and wireframes
    data.forEach((point, index) => {
        traces.push(createBarMesh(point, index));
        traces.push(createBarWireframe(point));
    });
    
    console.log('Created', data.length, '3D bars with wireframes');
    
    const isMobile = window.innerWidth <= 768;
    
    // Default configuration
    const config = {
        title: options.title || '',
        xAxisTitle: options.xAxisTitle || 'X Axis',
        yAxisTitle: options.yAxisTitle || 'Y Axis', 
        zAxisTitle: options.zAxisTitle || 'Height',
        xRange: options.xRange || [0.5, 4.5],
        yRange: options.yRange || [0, 100],
        zRange: options.zRange || [0, 100],
        showXTicks: options.showXTicks !== false,
        showLegend: options.showLegend || false,
        legendItems: options.legendItems || [],
        onBarClick: options.onBarClick || null
    };
    
    const layout = {
        title: config.title,
        scene: {
            xaxis: { 
                title: config.showXTicks ? config.xAxisTitle : '',
                showticklabels: config.showXTicks,
                showgrid: false,
                zeroline: false,
                range: config.xRange
            },
            yaxis: { 
                title: config.yAxisTitle,
                titlefont: { size: isMobile ? 10 : 12 },
                range: config.yRange
            },
            zaxis: { 
                title: config.zAxisTitle,
                titlefont: { size: isMobile ? 10 : 12 },
                range: config.zRange
            },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } }
        },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        autosize: true,
        showlegend: false,
        annotations: (isMobile || !config.showLegend) ? [] : [{
            x: 1,
            y: 1,
            xref: 'paper', yref: 'paper',
            text: config.legendItems.map(item => 
                `<span style="color:${item.color}">■</span> ${item.label}`
            ).join('<br>'),
            showarrow: false,
            align: 'left',
            bgcolor: 'rgba(255,255,255,0.9)',
            bordercolor: '#ccc',
            borderwidth: 1,
            font: { size: 12 }
        }]
    };
    
    const plotlyConfig = { 
        responsive: true,
        displayModeBar: false,
        modeBarButtonsToRemove: ['pan3d', 'orbitRotation', 'tableRotation', 'handleDrag3d', 'resetCameraDefault3d', 'resetCameraLastSave3d', 'hoverClosest3d'],
        scrollZoom: !isMobile,
        doubleClick: 'reset'
    };
    
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = 'block';
    }
    
    return Plotly.newPlot(containerId, traces, layout, plotlyConfig)
        .then(() => {
            console.log('3D bar chart rendered successfully');
            
            // Resize after render
            setTimeout(() => {
                Plotly.Plots.resize(containerId);
            }, 100);
            
            // Handle bar clicks if callback provided
            if (config.onBarClick) {
                document.getElementById(containerId).on('plotly_click', function(plotData) {
                    console.log('3D bar chart clicked');
                    
                    if (plotData.points && plotData.points.length > 0) {
                        const point = plotData.points[0];
                        const traceName = point.data.name;
                        
                        if (traceName && traceName.startsWith('bar_')) {
                            const dataIndex = parseInt(traceName.split('_')[1]);
                            
                            if (dataIndex < data.length) {
                                const clickedData = data[dataIndex];
                                config.onBarClick(clickedData, dataIndex);
                            }
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error rendering 3D bar chart:', error);
        });
}

/**
 * Example usage function - demonstrates how to use the 3D bar chart
 */
function example3DBarChart() {
    // Sample data
    const sampleData = [
        { x: 1, y: 75, z: 45, color: '#53AA30', label: 'Sample A', hoverText: 'Value A: 75<br>Category: Green' },
        { x: 2, y: 60, z: 80, color: '#FFD632', label: 'Sample B', hoverText: 'Value B: 60<br>Category: Yellow' },
        { x: 3, y: 85, z: 30, color: '#FF0101', label: 'Sample C', hoverText: 'Value C: 85<br>Category: Red' },
        { x: 4, y: 40, z: 90, color: '#9400D3', label: 'Sample D', hoverText: 'Value D: 40<br>Category: Purple' }
    ];
    
    const chartOptions = {
        title: '3D Data Visualization',
        xAxisTitle: 'Categories', 
        yAxisTitle: 'Metric 1 (%)',
        zAxisTitle: 'Metric 2 (%)',
        showLegend: true,
        legendItems: [
            { color: '#53AA30', label: 'Category A' },
            { color: '#FFD632', label: 'Category B' },
            { color: '#FF0101', label: 'Category C' },
            { color: '#9400D3', label: 'Category D' }
        ],
        onBarClick: (data, index) => {
            console.log('Clicked on bar:', data.label, 'at index:', index);
            alert(`Clicked on ${data.label} with value ${data.y}`);
        }
    };
    
    // Create the chart (assumes HTML element with id 'chart3d' exists)
    create3DBarChart(sampleData, 'chart3d', chartOptions);
}
