# 🌡️ Thermal Atlas

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![Deck.gl](https://img.shields.io/badge/Deck.gl-9.0-FF6B6B)
![License](https://img.shields.io/badge/license-MIT-green)

### 🔥 Urban Heat Intelligence Platform

**A full-stack geospatial analytics platform for monitoring, analyzing, and mitigating urban heat islands in Los Angeles County.**

[✨ Features](#-features) • [🚀 Quick Start](#-quick-start) • [📡 API Reference](#-api-reference) • [🛠️ Tech Stack](#️-tech-stack)

---

<img src="https://img.shields.io/badge/🌆_Los_Angeles-Urban_Heat_Mapping-FF6B35?style=for-the-badge" alt="LA Urban Heat">

</div>

---

## 🌆 Overview

**Thermal Atlas** is a cutting-edge urban heat intelligence platform that combines satellite-derived temperature data, vegetation analysis, and advanced geospatial algorithms to identify and analyze urban heat islands across Los Angeles County.

The platform processes **Sentinel-2 satellite imagery** to generate:
- 🌡️ **Land Surface Temperature** maps from SWIR Band 11
- 🌿 **NDVI Vegetation Health** indices
- 🔥 **Heat Island Detection** with severity classification
- 📊 **Actionable Analytics** for urban planning decisions

> 💡 **Why It Matters:** Urban heat islands can be **5-10°C hotter** than surrounding rural areas, leading to increased energy consumption, health risks, and reduced quality of life. Thermal Atlas helps identify these hotspots and plan cooling interventions.

---

## ✨ Features

### 🗺️ Interactive 3D Visualization
- **WebGL-powered** map with smooth 60fps rendering via Deck.gl
- **Radar pulse animations** on selected heat islands (3 concentric rings)
- **Geodesic arc connections** showing paths to nearest green spaces
- **Dynamic camera** with auto-zoom to frame analysis areas
- Toggle between **Dark Mode** and **Satellite** base maps

### 🔥 Heat Island Analysis
- **75 detected heat islands** with real satellite data
- **Severity classification**: Extreme, High, Medium, Low
- Click any hotspot to see temperature, intensity, and location
- Neighborhood detection using Turf.js point-in-polygon

### 🌿 Vegetation Intelligence
- **NDVI analysis** revealing vegetation health across the region
- **9.5% vegetation coverage** in analyzed area
- Classification: Dense → Moderate → Sparse → Bare/Urban
- Correlation analysis between heat and vegetation loss

### 📊 Analytics Dashboard
- **Real-time statistics** from backend API
- Temperature distribution (Min: 10°C, Max: 50°C, Mean: 26°C)
- Severity breakdown with visual charts
- Cooling impact calculator for proposed parks

### 🛡️ Enterprise-Grade Reliability
- **Coordinate validation** preventing NaN/Infinity crashes
- Error boundaries around all geospatial operations
- Graceful fallbacks when data is unavailable
- CORS-enabled API for cross-origin access

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | 18+ |
| **Python** | 3.10+ |
| **Mapbox Token** | [Get free token](https://account.mapbox.com/access-tokens/) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/thermal-atlas.git
cd thermal-atlas

# 2. Setup Backend
cd backend
pip install -r requirements.txt

# 3. Setup Frontend
cd ../frontend
npm install

# 4. Configure environment
# Create .env in frontend/
echo "VITE_MAPBOX_TOKEN=pk.your_token_here" > .env
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
# ✅ Server running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ✅ App running at http://localhost:5173
```

🎉 Open **http://localhost:5173** in your browser!

---

## 📡 API Reference

The backend provides a comprehensive REST API for geospatial data access.

**Base URL:** `http://localhost:5000/api`

### 🌡️ Temperature Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/temperature/statistics` | GET | Overall temperature stats (min, max, mean, std) |
| `/temperature/heatmap` | GET | Downsampled temperature grid for visualization |
| `/temperature/point` | POST | Temperature value at specific coordinate |

**Example Response - Statistics:**
```json
{
  "min": 10.0,
  "max": 50.0,
  "mean": 26.8,
  "std": 7.38,
  "note": "Estimated from SWIR Band 11 (Sentinel-2)"
}
```

### 🌿 Vegetation Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/vegetation/statistics` | GET | NDVI stats (min, max, mean, coverage %) |
| `/vegetation/analysis` | GET | Full vegetation health report |
| `/vegetation/heatmap` | GET | Downsampled NDVI grid for visualization |
| `/vegetation/point` | POST | NDVI value at specific coordinate |

**Example Response - Statistics:**
```json
{
  "min": -0.73,
  "max": 0.84,
  "mean": 0.08,
  "vegetation_coverage": 9.53
}
```

### 🔥 Heat Islands Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/heat-islands/all` | GET | All 75 detected heat islands with details |
| `/heat-islands/summary` | GET | Summary stats and severity distribution |
| `/heat-islands/by-severity` | GET | Filter by severity (extreme/high/medium/low) |

**Example Response - Summary:**
```json
{
  "total_islands": 75,
  "mean_temperature": 30.8,
  "average_intensity": 4.77,
  "severity_distribution": {
    "extreme": 11,
    "high": 27,
    "medium": 25,
    "low": 12
  }
}
```

### 📊 Recommendations Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recommendations/calculate-impact` | POST | Estimate cooling impact of proposed park |

**Example Request:**
```json
{
  "lat": 3750000,
  "lon": 350000,
  "park_area_sqm": 10000,
  "tree_canopy_percent": 60
}
```

**Example Response:**
```json
{
  "current_temperature": 35.0,
  "estimated_temperature_reduction": 2.5,
  "estimated_final_temperature": 32.5,
  "affected_radius_meters": 59.8,
  "methodology": "EPA Urban Heat Island research"
}
```

### 🔧 Utility Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with all registered routes |
| `/info` | GET | API info and data file status |
| `/test` | GET | Simple connection test |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | Component architecture with hooks |
| **TypeScript** | 5.5 | Type safety and developer experience |
| **Vite** | 5.3 | Lightning-fast HMR and builds |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 10.18 | Smooth animations |
| **Deck.gl** | 9.0 | High-performance WebGL layers |
| **React-Map-GL** | 7.1 | Mapbox GL wrapper for React |
| **Turf.js** | 7.3 | Geospatial calculations |
| **ECharts** | 5.6 | Interactive charts |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11 | Core runtime |
| **Flask** | 3.0 | REST API framework |
| **Rasterio** | 1.3 | Geospatial raster I/O |
| **NumPy** | 1.26 | Numerical computing |
| **Flask-CORS** | 4.0 | Cross-origin resource sharing |

### Data Sources

| Source | Type | Description |
|--------|------|-------------|
| **Sentinel-2** | Satellite | SWIR Band 11 for temperature estimation |
| **Sentinel-2** | Satellite | NIR/Red bands for NDVI calculation |
| **OpenStreetMap** | Vector | LA County/City boundaries |
| **Processed GeoTIFFs** | Raster | Temperature and NDVI layers |

---

## 📁 Project Structure

```
thermal-atlas/
├── backend/
│   ├── api/
│   │   ├── temperature.py      # Temperature endpoints
│   │   ├── vegetation.py       # Vegetation/NDVI endpoints
│   │   ├── heat_islands.py     # Heat island detection API
│   │   └── recommendations.py  # Cooling impact calculator
│   ├── data_processing/        # Satellite data processing scripts
│   ├── config/                 # Configuration settings
│   └── app.py                  # Flask application entry
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.tsx           # 3D map visualization
│   │   │   ├── NavigationSidebar.tsx # Navigation controls
│   │   │   ├── AnalyticsDashboard.tsx# Stats and charts
│   │   │   ├── Settings.tsx          # Map style toggles
│   │   │   └── LandingPage.tsx       # Animated intro
│   │   ├── lib/
│   │   │   └── api.ts                # Backend API client
│   │   └── App.tsx                   # Root component
│   └── public/data/                  # GeoJSON boundaries
├── data/
│   ├── raw/                    # Original satellite imagery
│   └── processed/              # Generated TIFFs and JSONs
└── scripts/                    # Data download utilities
```

---

## 🐛 Troubleshooting

### Map not loading?
- Verify `.env` file has `VITE_MAPBOX_TOKEN=pk.xxx`
- Ensure token has "Vector Tiles API" permission

### Backend not responding?
- Check Flask is running: `python app.py`
- Verify port 5000 is not in use
- Check `data/processed/` contains required `.tif` and `.json` files

### API returning 404?
- Ensure data files exist:
  - `data/processed/temperature_la.tif`
  - `data/processed/ndvi_la.tif`
  - `data/processed/heat_islands.json`

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Use **TypeScript** for frontend components
- Use **type hints** for Python functions
- Add error handling for all API endpoints
- Test with both Dark and Satellite map styles

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

**Data Attribution:**
- Copernicus Sentinel-2 (satellite imagery)
- OpenStreetMap contributors (boundary data)
- Mapbox (base map tiles)

---

<div align="center">

### 🌡️ Thermal Atlas

**Turning satellite data into actionable urban heat intelligence**

<sub>Built with ❤️ for sustainable urban planning</sub>

<br>

⭐ **Star this repo if you find it useful!** ⭐

</div>
