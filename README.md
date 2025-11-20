# 🦡 Badger Research Graph

AI-Powered Cross-Disciplinary Research Knowledge Graph Tool for UW-Madison

## Features

- **5 Academic Domains**: Biomedicine, Computer Science, Economics, Political Science, Mathematics
- **3 Modes of Operation**:
  - Tab 1: Pre-loaded UW Research examples
  - Tab 2: Search papers via PubMed (real API) + Google Scholar (via SerpAPI)
  - Tab 3: Upload and process PDFs with Claude AI
- **Real API Integration**:
  - PubMed/NCBI for paper search (no API key required)
  - SerpAPI for Google Scholar (optional)
  - Claude API for entity extraction and hypothesis generation
- **Interactive Knowledge Graph**: Force-directed visualization with react-force-graph-2d
- **Hypothesis Generation**: AI-powered research hypothesis discovery

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## API Keys Required

1. **Claude API Key** (Required for Tabs 2, 3, and Hypothesis Generation)
   - Get from: https://console.anthropic.com

2. **SerpAPI Key** (Optional, for Google Scholar results)
   - Get from: https://serpapi.com

Enter your API keys in the Settings panel (gear icon in header).

## Usage

### Tab 1: UW Research
Pre-loaded example data for each domain showing UW Madison research connections.

### Tab 2: Search Papers
1. Enter a search query (e.g., "BRCA1 breast cancer")
2. Select your domain
3. Click Search
4. View the extracted knowledge graph

### Tab 3: Upload Papers
1. Upload 1-3 PDF files
2. Select your domain
3. Click "Process PDFs"
4. View the extracted knowledge graph

### Generate Hypotheses
Click the "Generate Research Hypotheses" button to discover novel research directions based on the knowledge graph.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- react-force-graph-2d
- PubMed/NCBI API
- SerpAPI (Google Scholar)
- Claude API (Anthropic)

## Build for Production

```bash
npm run build
npm run preview
```

## License

MIT
