# 🦡 Badger Research Graph

**AI-Powered Cross-Disciplinary Research Knowledge Graph • UW-Madison**

A comprehensive React application that builds knowledge graphs from academic research papers using real-time API integrations with PubMed, Google Scholar, and Claude AI. Supports 5 academic disciplines with domain-specific entity extraction and hypothesis generation.

---

## 🎯 Features

### **Three Modes of Operation**

1. **🦡 UW Research (Tab 1)** - Pre-loaded example knowledge graphs
   - Instant visualization of domain-specific research examples
   - All 5 disciplines with curated mock data

2. **🔍 Search Papers (Tab 2)** - Live API integration
   - Search PubMed for UW Madison-affiliated papers
   - Supplement with Google Scholar (optional)
   - Claude AI extracts entities and relationships
   - Builds knowledge graph from real research

3. **📄 Upload Papers (Tab 3)** - PDF processing
   - Upload 1-3 PDF research papers
   - Claude AI processes and extracts structure
   - Builds knowledge graph from uploaded content

### **Key Capabilities**

- ✅ **5 Academic Disciplines**: Biomedicine, Computer Science, Economics, Political Science, Mathematics
- ✅ **Real API Integrations**: PubMed (no key), Google Scholar (SerpAPI), Claude AI
- ✅ **Interactive Graph**: Force-directed visualization with clickable relationships
- ✅ **Evidence-Based**: Each relationship shows confidence, evidence quotes, and sources
- ✅ **AI Hypothesis Generation**: Claude generates novel research hypotheses from graph patterns
- ✅ **UW Madison Branding**: Official colors and styling

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm
- Claude API key (required) - Get from [console.anthropic.com](https://console.anthropic.com)
- SerpAPI key (optional, for Google Scholar) - Get free key from [serpapi.com](https://serpapi.com)

### **Installation**

```bash
# Clone repository
git clone <repository-url>
cd ClaudeHacks

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

---

## 🔑 API Key Setup

### **Required: Claude API Key**

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)
6. In the app, click **⚙️ Settings** → paste into "Claude API Key"

**Cost**: ~$0.01-0.05 per search/upload depending on paper length

### **Optional: SerpAPI Key (for Google Scholar)**

1. Go to [serpapi.com](https://serpapi.com)
2. Sign up for free account (100 searches/month free)
3. Copy your API key from dashboard
4. In the app, click **⚙️ Settings** → paste into "SerpAPI Key"

**Note**: PubMed works without any API key. SerpAPI is only needed to supplement results with Google Scholar.

---

## 📚 Domain Schemas

### **Biomedicine 🧬**
- **Entities**: gene, disease, drug, protein, pathway, biomarker
- **Relationships**: CAUSES, TREATS, INHIBITS, ACTIVATES, ASSOCIATES_WITH, BIOMARKER_FOR, REGULATES
- **Example**: Cancer Immunotherapy research from Carbone Cancer Center

### **Computer Science 💻**
- **Entities**: algorithm, problem, technique, system, dataset, model
- **Relationships**: SOLVES, OPTIMIZES, OUTPERFORMS, REQUIRES, ENABLES, EVALUATES_ON, IMPLEMENTS
- **Example**: AI/ML research on Transformers and Attention Mechanisms

### **Economics 📊**
- **Entities**: policy, economic_indicator, market, theory, intervention, outcome
- **Relationships**: INFLUENCES, CORRELATES_WITH, CAUSES, MITIGATES, PREDICTS, RESPONDS_TO, DETERMINES
- **Example**: Labor Economics research on minimum wage effects

### **Political Science 🏛️**
- **Entities**: policy, actor, institution, outcome, event, movement
- **Relationships**: ADVOCATES_FOR, OPPOSES, IMPLEMENTS, LEADS_TO, INFLUENCES, RESULTS_FROM, MOBILIZES
- **Example**: Political Behavior research on social media and polarization

### **Mathematics 🔢**
- **Entities**: theorem, conjecture, method, structure, application, proof
- **Relationships**: PROVES, GENERALIZES, APPLIES_TO, BUILDS_ON, CONTRADICTS, IMPLIES, EXTENDS
- **Example**: Algebraic Topology research on Homotopy Theory

---

## 💡 Usage Guide

### **Tab 1: UW Research Examples**

1. Select a research domain from dropdown
2. View pre-loaded example knowledge graph
3. Click on edges (arrows) to see relationship details:
   - Confidence score
   - Evidence quote from paper
   - Source paper
4. Click "Generate Research Hypotheses" to get AI-generated insights

### **Tab 2: Search Papers**

1. Select research domain
2. Enter search query (e.g., "BRCA1 breast cancer" or "reinforcement learning robotics")
3. Click "Search"
4. Progress indicators show:
   - 🔍 Searching PubMed for UW Madison papers
   - 📚 Found X papers from UW researchers
   - 🔍 Supplementing with Google Scholar (if SerpAPI key provided)
   - 📄 Fetching abstracts
   - 🧬 Extracting entities with Claude AI
   - 🔗 Building knowledge graph
   - ✅ Graph ready!
5. Explore the generated graph
6. Click "Generate Research Hypotheses" for AI insights

**Search Tips**:
- Use specific keywords (gene names, algorithm names, policy terms)
- PubMed works best for biomedical queries
- Google Scholar helps for CS, Econ, PoliSci, Math
- Results are automatically filtered for UW Madison affiliation

### **Tab 3: Upload Papers**

1. Select research domain
2. Click "Choose Files" and select 1-3 PDF papers
3. Claude AI processes each PDF:
   - Extracts text and figures
   - Identifies domain-specific entities
   - Finds relationships with evidence
4. View combined knowledge graph
5. Click edges to see which page evidence came from

**Upload Tips**:
- PDFs should be text-based (not scanned images)
- Max 10MB per file
- Works best with papers in the selected domain

### **Hypothesis Generation**

After building a graph (any tab), click "Generate Research Hypotheses":

1. Claude AI analyzes the entire knowledge graph
2. Identifies:
   - Multi-hop causal chains
   - Therapeutic/application opportunities
   - Understudied connections
   - Contradictions or gaps
3. Returns 3-4 novel hypotheses with:
   - **Title**: Concise hypothesis statement
   - **Reasoning**: Why this hypothesis is plausible
   - **Confidence**: AI's confidence score (0-100%)
   - **Supporting Evidence**: Which relationships support it
   - **Suggested Experiments**: How to test it

---

## 🏗️ Architecture

### **Tech Stack**

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **Graph Visualization**: react-force-graph-2d (D3.js-based)
- **Build Tool**: Vite
- **APIs**:
  - PubMed E-utilities API (NCBI)
  - SerpAPI Google Scholar
  - Claude AI API (Anthropic)

### **Data Flow**

```
User Input → API Calls → Claude AI Extraction → Graph Data → Visualization
                                                           ↓
                                                  Hypothesis Generation
```

**Tab 2 (Search) Flow**:
1. Search PubMed with UW Madison affiliation filter
2. Parse XML response for PMIDs
3. Fetch abstracts via PubMed efetch
4. If <3 results, call Google Scholar via SerpAPI
5. Combine all abstracts into single text
6. Send to Claude API with domain-specific prompt
7. Parse JSON response (entities + relationships)
8. Build graph visualization

**Tab 3 (Upload) Flow**:
1. Convert PDFs to base64
2. Send each PDF to Claude API with document vision
3. Extract entities and relationships per paper
4. Combine all extractions
5. Build graph visualization

### **File Structure**

```
ClaudeHacks/
├── BadgerResearchGraph.jsx   # Main React component (single file app)
├── src/
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind imports
├── index.html                # HTML entry
├── package.json              # Dependencies
├── vite.config.js            # Build configuration
├── tailwind.config.js        # Tailwind setup
├── postcss.config.js         # PostCSS setup
└── README.md                 # This file
```

---

## 🎨 Design Details

### **UW Madison Branding**

- Primary Color: `#C5050C` (UW Red)
- Typography: System fonts (clean, academic)
- Icons: Emoji-based for cross-platform consistency
- Layout: Clean, card-based design with clear hierarchy

### **Graph Visualization**

- **Nodes**: Colored by entity type, sized by connection count
- **Edges**: Colored by relationship type, curved with directional arrows
- **Interactions**:
  - Click edge → view relationship details
  - Hover → show labels
  - Drag nodes to explore
  - Zoom and pan

### **Color Schemes by Domain**

Each domain has unique color palettes for entities and relationships to aid visual distinction.

---

## 🧪 Testing Recommendations

### **For Demo/Judges**

1. **Start with Tab 1** - Show pre-loaded examples (instant, no API keys needed)
   - Cycle through all 5 domains
   - Click edges to show evidence
   - Generate hypotheses for one domain

2. **Demo Tab 2** - Live search (requires Claude API key)
   - Example queries:
     - Biomedicine: "PD-1 checkpoint inhibitor"
     - CS: "transformer attention mechanism"
     - Economics: "minimum wage employment"
     - Political Science: "voter turnout mobilization"
     - Mathematics: "homotopy algebraic topology"
   - Show real-time progress
   - Demonstrate hypothesis generation

3. **Demo Tab 3** - PDF upload (requires Claude API key + PDF papers)
   - Have 1-2 sample PDFs ready in relevant domain
   - Show PDF processing in action

### **Fallback Plan**

If APIs fail during demo:
- Tab 1 always works (no APIs needed)
- Error messages are user-friendly
- Console logs help with debugging
- Can discuss architecture even if live demo fails

---

## 🐛 Troubleshooting

### **"Claude API key required"**
- Add key in Settings (⚙️)
- Verify key starts with `sk-ant-`
- Check [console.anthropic.com](https://console.anthropic.com) for key status

### **"No papers found"**
- Try different keywords
- Ensure domain matches query topic
- PubMed works best for biomedical topics
- Add SerpAPI key for better coverage in other domains

### **Graph not displaying**
- Check browser console for errors
- Ensure react-force-graph-2d loaded correctly
- Try refreshing page

### **PDF upload fails**
- Ensure PDF is text-based (not scanned image)
- Check file size (<10MB)
- Verify Claude API key is valid

### **CORS errors**
- PubMed and Claude APIs should work from browser
- SerpAPI requires valid key
- Run `npm run dev` (not opening HTML directly)

---

## 📊 API Rate Limits & Costs

### **PubMed (NCBI E-utilities)**
- **Free**: Unlimited (but rate limited to 3 requests/second)
- **No API key required**

### **SerpAPI Google Scholar**
- **Free tier**: 100 searches/month
- **Paid**: $50/month for 5,000 searches
- **Rate limit**: 1 request/second

### **Claude API (Anthropic)**
- **Pricing**: ~$3 per million input tokens, ~$15 per million output tokens
- **Estimated cost per search**: $0.01-0.05 (depending on abstract length)
- **Estimated cost per PDF**: $0.02-0.10 (depending on page count)
- **Estimated cost per hypothesis generation**: $0.01-0.03
- **Rate limit**: Varies by account tier

**For Demo**: $5-10 credit should be sufficient for multiple demonstrations

---

## 🚢 Deployment

### **Build for Production**

```bash
npm run build
```

Output in `dist/` folder, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### **Environment Variables**

For production, consider using environment variables instead of localStorage:

```javascript
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;
```

---

## 🎓 Educational Value

This application demonstrates:

1. **Multi-API Integration**: Orchestrating PubMed, Google Scholar, and Claude AI
2. **Domain-Driven Design**: Schema definitions for 5 academic fields
3. **AI/NLP**: Entity extraction and relationship mining
4. **Graph Theory**: Knowledge graph construction and visualization
5. **Data Visualization**: Interactive force-directed graphs
6. **Research Methods**: Cross-disciplinary analysis and hypothesis generation
7. **UX Design**: Loading states, error handling, progressive disclosure

---

## 📝 License

MIT License - Feel free to use for academic and research purposes.

---

## 👥 Credits

**Developed for UW Madison Research Community**

- **APIs**: NCBI PubMed, SerpAPI, Anthropic Claude
- **Libraries**: React, D3.js (via react-force-graph-2d), Tailwind CSS
- **Data**: Real-time from academic publications

---

## 🔮 Future Enhancements

- [ ] Export graph as SVG/PNG
- [ ] Save/load graph sessions
- [ ] Collaborative annotations
- [ ] Integration with UW Madison library systems
- [ ] Citation network expansion
- [ ] Semantic Scholar API integration
- [ ] Multi-graph comparison view
- [ ] Temporal analysis (research trends over time)

---

## 📧 Support

For questions or issues, please contact the development team or open an issue in the repository.

**On, Wisconsin!** 🦡
