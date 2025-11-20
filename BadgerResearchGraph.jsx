import React, { useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// ========== DOMAIN SCHEMAS ==========

const DOMAINS = {
  biomedicine: {
    name: 'Biomedicine',
    icon: '🧬',
    entities: ['gene', 'disease', 'drug', 'protein', 'pathway', 'biomarker'],
    relationships: ['CAUSES', 'TREATS', 'INHIBITS', 'ACTIVATES', 'ASSOCIATES_WITH', 'BIOMARKER_FOR', 'REGULATES'],
    colors: {
      gene: '#3b82f6',
      disease: '#ef4444',
      drug: '#10b981',
      protein: '#f59e0b',
      pathway: '#8b5cf6',
      biomarker: '#ec4899'
    },
    relationshipColors: {
      CAUSES: '#fb923c',
      TREATS: '#10b981',
      INHIBITS: '#ef4444',
      ACTIVATES: '#8b5cf6',
      ASSOCIATES_WITH: '#3b82f6',
      BIOMARKER_FOR: '#ec4899',
      REGULATES: '#14b8a6'
    }
  },
  computerscience: {
    name: 'Computer Science',
    icon: '💻',
    entities: ['algorithm', 'problem', 'technique', 'system', 'dataset', 'model', 'researcher'],
    relationships: ['SOLVES', 'OPTIMIZES', 'OUTPERFORMS', 'REQUIRES', 'ENABLES', 'EVALUATES_ON', 'IMPLEMENTS', 'RESEARCHES', 'COLLABORATES_WITH', 'AUTHORED'],
    colors: {
      algorithm: '#3b82f6',
      problem: '#ef4444',
      technique: '#10b981',
      system: '#f59e0b',
      dataset: '#8b5cf6',
      model: '#06b6d4',
      researcher: '#9333ea'
    },
    relationshipColors: {
      SOLVES: '#10b981',
      OPTIMIZES: '#8b5cf6',
      OUTPERFORMS: '#fb923c',
      REQUIRES: '#3b82f6',
      ENABLES: '#14b8a6',
      EVALUATES_ON: '#ec4899',
      IMPLEMENTS: '#f59e0b',
      RESEARCHES: '#06b6d4',
      COLLABORATES_WITH: '#ec4899',
      AUTHORED: '#9333ea'
    }
  },
  economics: {
    name: 'Economics',
    icon: '📊',
    entities: ['policy', 'economic_indicator', 'market', 'theory', 'intervention', 'outcome'],
    relationships: ['INFLUENCES', 'CORRELATES_WITH', 'CAUSES', 'MITIGATES', 'PREDICTS', 'RESPONDS_TO', 'DETERMINES'],
    colors: {
      policy: '#3b82f6',
      economic_indicator: '#ef4444',
      market: '#10b981',
      theory: '#f59e0b',
      intervention: '#8b5cf6',
      outcome: '#ec4899'
    },
    relationshipColors: {
      INFLUENCES: '#fb923c',
      CORRELATES_WITH: '#3b82f6',
      CAUSES: '#ef4444',
      MITIGATES: '#10b981',
      PREDICTS: '#8b5cf6',
      RESPONDS_TO: '#ec4899',
      DETERMINES: '#14b8a6'
    }
  },
  politicalscience: {
    name: 'Political Science',
    icon: '🏛️',
    entities: ['policy', 'actor', 'institution', 'outcome', 'event', 'movement'],
    relationships: ['ADVOCATES_FOR', 'OPPOSES', 'IMPLEMENTS', 'LEADS_TO', 'INFLUENCES', 'RESULTS_FROM', 'MOBILIZES'],
    colors: {
      policy: '#3b82f6',
      actor: '#ef4444',
      institution: '#10b981',
      outcome: '#f59e0b',
      event: '#8b5cf6',
      movement: '#ec4899'
    },
    relationshipColors: {
      ADVOCATES_FOR: '#10b981',
      OPPOSES: '#ef4444',
      IMPLEMENTS: '#3b82f6',
      LEADS_TO: '#fb923c',
      INFLUENCES: '#8b5cf6',
      RESULTS_FROM: '#ec4899',
      MOBILIZES: '#14b8a6'
    }
  },
  mathematics: {
    name: 'Mathematics',
    icon: '🔢',
    entities: ['theorem', 'conjecture', 'method', 'structure', 'application', 'proof'],
    relationships: ['PROVES', 'GENERALIZES', 'APPLIES_TO', 'BUILDS_ON', 'CONTRADICTS', 'IMPLIES', 'EXTENDS'],
    colors: {
      theorem: '#3b82f6',
      conjecture: '#ef4444',
      method: '#10b981',
      structure: '#f59e0b',
      application: '#8b5cf6',
      proof: '#14b8a6'
    },
    relationshipColors: {
      PROVES: '#10b981',
      GENERALIZES: '#3b82f6',
      APPLIES_TO: '#fb923c',
      BUILDS_ON: '#8b5cf6',
      CONTRADICTS: '#ef4444',
      IMPLIES: '#14b8a6',
      EXTENDS: '#f59e0b'
    }
  }
};

// ========== MOCK DATA FOR TAB 1 ==========

const MOCK_EXAMPLES = {
  biomedicine: {
    title: 'Cancer Immunotherapy - Carbone Cancer Center',
    papers: ['PD-1/PD-L1 Checkpoint Blockade in Melanoma', 'CTLA-4 Inhibition in Lung Cancer', 'Combination Immunotherapy Strategies'],
    nodes: [
      { id: 'PD-1', type: 'protein' },
      { id: 'PD-L1', type: 'protein' },
      { id: 'CTLA-4', type: 'protein' },
      { id: 'Melanoma', type: 'disease' },
      { id: 'Lung Cancer', type: 'disease' },
      { id: 'Pembrolizumab', type: 'drug' },
      { id: 'Nivolumab', type: 'drug' },
      { id: 'Ipilimumab', type: 'drug' },
      { id: 'CD8+ T-cell', type: 'protein' },
      { id: 'T-cell Receptor', type: 'protein' },
      { id: 'IFN-gamma', type: 'protein' },
      { id: 'Tumor Microenvironment', type: 'pathway' }
    ],
    edges: [
      { source: 'Pembrolizumab', target: 'PD-1', type: 'INHIBITS', confidence: 0.96, evidence: 'Pembrolizumab specifically binds PD-1 receptor', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'PD-1', target: 'CD8+ T-cell', type: 'INHIBITS', confidence: 0.94, evidence: 'PD-1 engagement suppresses T-cell activation', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'PD-L1', target: 'PD-1', type: 'ACTIVATES', confidence: 0.95, evidence: 'PD-L1 is the primary ligand for PD-1', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'Melanoma', target: 'PD-L1', type: 'BIOMARKER_FOR', confidence: 0.88, evidence: 'High PD-L1 expression predicts response', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'Pembrolizumab', target: 'Melanoma', type: 'TREATS', confidence: 0.92, evidence: 'FDA approved for melanoma treatment', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'Nivolumab', target: 'PD-1', type: 'INHIBITS', confidence: 0.95, evidence: 'Nivolumab blocks PD-1 checkpoint', source: 'PD-1/PD-L1 Checkpoint Blockade' },
      { source: 'Nivolumab', target: 'Lung Cancer', type: 'TREATS', confidence: 0.89, evidence: 'Approved for non-small cell lung cancer', source: 'CTLA-4 Inhibition in Lung Cancer' },
      { source: 'Ipilimumab', target: 'CTLA-4', type: 'INHIBITS', confidence: 0.93, evidence: 'Ipilimumab is anti-CTLA-4 antibody', source: 'CTLA-4 Inhibition in Lung Cancer' },
      { source: 'CTLA-4', target: 'CD8+ T-cell', type: 'INHIBITS', confidence: 0.91, evidence: 'CTLA-4 downregulates T-cell activation', source: 'CTLA-4 Inhibition in Lung Cancer' },
      { source: 'CD8+ T-cell', target: 'IFN-gamma', type: 'ACTIVATES', confidence: 0.87, evidence: 'Activated T-cells produce IFN-gamma', source: 'Combination Immunotherapy' },
      { source: 'IFN-gamma', target: 'Tumor Microenvironment', type: 'REGULATES', confidence: 0.85, evidence: 'IFN-gamma reshapes tumor microenvironment', source: 'Combination Immunotherapy' }
    ]
  },
  computerscience: {
    title: 'AI/ML Research - UW CS Department',
    papers: ['Attention Mechanisms in Deep Learning', 'Transfer Learning for Computer Vision', 'Transformer Architectures'],
    nodes: [
      { id: 'Transformer', type: 'model' },
      { id: 'BERT', type: 'model' },
      { id: 'Attention Mechanism', type: 'technique' },
      { id: 'Image Classification', type: 'problem' },
      { id: 'ResNet', type: 'model' },
      { id: 'ImageNet', type: 'dataset' },
      { id: 'Transfer Learning', type: 'technique' },
      { id: 'Natural Language Processing', type: 'problem' },
      { id: 'Fine-tuning', type: 'technique' },
      { id: 'Self-attention', type: 'algorithm' },
      { id: 'Convolutional Neural Network', type: 'model' }
    ],
    edges: [
      { source: 'Attention Mechanism', target: 'Transformer', type: 'ENABLES', confidence: 0.95, evidence: 'Transformers are built on self-attention mechanisms', source: 'Attention Mechanisms in Deep Learning' },
      { source: 'Transformer', target: 'BERT', type: 'ENABLES', confidence: 0.93, evidence: 'BERT uses transformer encoder architecture', source: 'Transformer Architectures' },
      { source: 'BERT', target: 'Natural Language Processing', type: 'SOLVES', confidence: 0.91, evidence: 'BERT achieves state-of-art on NLP tasks', source: 'Transformer Architectures' },
      { source: 'Transfer Learning', target: 'Image Classification', type: 'OPTIMIZES', confidence: 0.89, evidence: 'Transfer learning improves classification accuracy', source: 'Transfer Learning for Computer Vision' },
      { source: 'ResNet', target: 'ImageNet', type: 'EVALUATES_ON', confidence: 0.94, evidence: 'ResNet trained and tested on ImageNet', source: 'Transfer Learning for Computer Vision' },
      { source: 'ResNet', target: 'Image Classification', type: 'SOLVES', confidence: 0.92, evidence: 'ResNet solves image classification problem', source: 'Transfer Learning for Computer Vision' },
      { source: 'Transfer Learning', target: 'Fine-tuning', type: 'REQUIRES', confidence: 0.88, evidence: 'Transfer learning requires fine-tuning stage', source: 'Transfer Learning for Computer Vision' },
      { source: 'Self-attention', target: 'Attention Mechanism', type: 'IMPLEMENTS', confidence: 0.90, evidence: 'Self-attention is core attention implementation', source: 'Attention Mechanisms in Deep Learning' },
      { source: 'Transformer', target: 'Convolutional Neural Network', type: 'OUTPERFORMS', confidence: 0.86, evidence: 'Transformers outperform CNNs on many tasks', source: 'Transformer Architectures' }
    ]
  },
  economics: {
    title: 'Labor Economics Research - UW Economics Department',
    papers: ['Minimum Wage Effects on Employment', 'Job Training Program Evaluation', 'Income Inequality Dynamics'],
    nodes: [
      { id: 'Minimum Wage', type: 'policy' },
      { id: 'Employment Rate', type: 'economic_indicator' },
      { id: 'Job Training Programs', type: 'intervention' },
      { id: 'Income Inequality', type: 'economic_indicator' },
      { id: 'Labor Market', type: 'market' },
      { id: 'Wage Growth', type: 'economic_indicator' },
      { id: 'Monopsony Theory', type: 'theory' },
      { id: 'Worker Productivity', type: 'outcome' },
      { id: 'Education Attainment', type: 'outcome' },
      { id: 'Regional Economy', type: 'market' }
    ],
    edges: [
      { source: 'Minimum Wage', target: 'Employment Rate', type: 'INFLUENCES', confidence: 0.78, evidence: 'Small positive effect on employment in monopsony markets', source: 'Minimum Wage Effects on Employment' },
      { source: 'Minimum Wage', target: 'Wage Growth', type: 'CAUSES', confidence: 0.92, evidence: 'Minimum wage increases directly raise wages for low-income workers', source: 'Minimum Wage Effects on Employment' },
      { source: 'Monopsony Theory', target: 'Minimum Wage', type: 'PREDICTS', confidence: 0.85, evidence: 'Monopsony model predicts positive employment effects', source: 'Minimum Wage Effects on Employment' },
      { source: 'Job Training Programs', target: 'Worker Productivity', type: 'CAUSES', confidence: 0.82, evidence: 'Training programs increase worker productivity by 15%', source: 'Job Training Program Evaluation' },
      { source: 'Worker Productivity', target: 'Wage Growth', type: 'CORRELATES_WITH', confidence: 0.76, evidence: 'Productivity gains associated with wage increases', source: 'Job Training Program Evaluation' },
      { source: 'Income Inequality', target: 'Education Attainment', type: 'RESPONDS_TO', confidence: 0.84, evidence: 'Education is key determinant of income distribution', source: 'Income Inequality Dynamics' },
      { source: 'Job Training Programs', target: 'Income Inequality', type: 'MITIGATES', confidence: 0.79, evidence: 'Training programs reduce inequality by improving low-skill wages', source: 'Income Inequality Dynamics' },
      { source: 'Labor Market', target: 'Regional Economy', type: 'DETERMINES', confidence: 0.88, evidence: 'Labor market conditions drive regional economic growth', source: 'Minimum Wage Effects on Employment' }
    ]
  },
  politicalscience: {
    title: 'Political Behavior Research - UW Political Science Department',
    papers: ['Social Media and Political Polarization', 'Campaign Finance Reform Effects', 'Voter Turnout Determinants'],
    nodes: [
      { id: 'Social Media', type: 'institution' },
      { id: 'Political Polarization', type: 'outcome' },
      { id: 'Voter Turnout', type: 'outcome' },
      { id: 'Campaign Finance', type: 'policy' },
      { id: 'Political Parties', type: 'actor' },
      { id: 'Echo Chambers', type: 'event' },
      { id: 'Grassroots Mobilization', type: 'movement' },
      { id: 'Election Reform', type: 'policy' },
      { id: 'Public Trust', type: 'outcome' },
      { id: 'Media Literacy', type: 'policy' }
    ],
    edges: [
      { source: 'Social Media', target: 'Political Polarization', type: 'INFLUENCES', confidence: 0.82, evidence: 'Social media algorithms amplify partisan content', source: 'Social Media and Political Polarization' },
      { source: 'Social Media', target: 'Echo Chambers', type: 'LEADS_TO', confidence: 0.86, evidence: 'Platform design creates ideological echo chambers', source: 'Social Media and Political Polarization' },
      { source: 'Echo Chambers', target: 'Political Polarization', type: 'RESULTS_FROM', confidence: 0.79, evidence: 'Echo chambers reinforce existing political views', source: 'Social Media and Political Polarization' },
      { source: 'Campaign Finance', target: 'Political Parties', type: 'INFLUENCES', confidence: 0.88, evidence: 'Campaign funding shapes party strategies', source: 'Campaign Finance Reform Effects' },
      { source: 'Political Parties', target: 'Political Polarization', type: 'ADVOCATES_FOR', confidence: 0.77, evidence: 'Party platforms drive ideological divergence', source: 'Campaign Finance Reform Effects' },
      { source: 'Grassroots Mobilization', target: 'Voter Turnout', type: 'LEADS_TO', confidence: 0.84, evidence: 'Door-to-door campaigns increase turnout by 7-10%', source: 'Voter Turnout Determinants' },
      { source: 'Election Reform', target: 'Voter Turnout', type: 'IMPLEMENTS', confidence: 0.81, evidence: 'Same-day registration increases participation', source: 'Voter Turnout Determinants' },
      { source: 'Political Polarization', target: 'Public Trust', type: 'OPPOSES', confidence: 0.75, evidence: 'Polarization erodes trust in institutions', source: 'Social Media and Political Polarization' },
      { source: 'Media Literacy', target: 'Echo Chambers', type: 'OPPOSES', confidence: 0.73, evidence: 'Education helps citizens recognize bias', source: 'Social Media and Political Polarization' }
    ]
  },
  mathematics: {
    title: 'Algebraic Topology Research - UW Mathematics Department',
    papers: ['Homotopy Theory Applications', 'Categorical Frameworks in Topology', 'Homological Algebra Methods'],
    nodes: [
      { id: 'Homotopy Theory', type: 'theorem' },
      { id: 'Category Theory', type: 'structure' },
      { id: 'Fundamental Group', type: 'method' },
      { id: 'Homology', type: 'method' },
      { id: 'Manifold', type: 'structure' },
      { id: 'Topological Spaces', type: 'structure' },
      { id: 'Algebraic Invariants', type: 'application' },
      { id: 'Cohomology', type: 'method' },
      { id: 'Spectral Sequences', type: 'technique' },
      { id: 'Poincaré Conjecture', type: 'conjecture' }
    ],
    edges: [
      { source: 'Category Theory', target: 'Homotopy Theory', type: 'GENERALIZES', confidence: 0.89, evidence: 'Category theory provides abstract framework for homotopy', source: 'Categorical Frameworks in Topology' },
      { source: 'Fundamental Group', target: 'Homotopy Theory', type: 'BUILDS_ON', confidence: 0.92, evidence: 'Fundamental group is first homotopy group', source: 'Homotopy Theory Applications' },
      { source: 'Homology', target: 'Topological Spaces', type: 'APPLIES_TO', confidence: 0.94, evidence: 'Homology assigns algebraic objects to topological spaces', source: 'Homological Algebra Methods' },
      { source: 'Homology', target: 'Algebraic Invariants', type: 'PROVES', confidence: 0.88, evidence: 'Homology groups are topological invariants', source: 'Homological Algebra Methods' },
      { source: 'Cohomology', target: 'Homology', type: 'EXTENDS', confidence: 0.91, evidence: 'Cohomology is dual theory to homology', source: 'Homological Algebra Methods' },
      { source: 'Manifold', target: 'Topological Spaces', type: 'BUILDS_ON', confidence: 0.87, evidence: 'Manifolds are special topological spaces', source: 'Homotopy Theory Applications' },
      { source: 'Poincaré Conjecture', target: 'Fundamental Group', type: 'IMPLIES', confidence: 0.95, evidence: 'Simply connected 3-manifolds are 3-spheres', source: 'Homotopy Theory Applications' },
      { source: 'Spectral Sequences', target: 'Homology', type: 'APPLIES_TO', confidence: 0.86, evidence: 'Spectral sequences compute homology groups', source: 'Homological Algebra Methods' },
      { source: 'Category Theory', target: 'Cohomology', type: 'GENERALIZES', confidence: 0.84, evidence: 'Cohomology can be defined categorically', source: 'Categorical Frameworks in Topology' }
    ]
  }
};

// ========== MAIN COMPONENT ==========

export default function BadgerResearchGraph() {
  const [selectedMode, setSelectedMode] = useState(null); // null, 'manual', or 'agent'
  const [activeTab, setActiveTab] = useState('uwresearch');
  const [selectedDomain, setSelectedDomain] = useState('biomedicine');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [hypotheses, setHypotheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    serpapi: localStorage.getItem('serpapi_key') || '',
    claude: localStorage.getItem('claude_key') || ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentPapers, setCurrentPapers] = useState([]);
  const graphRef = useRef();

  // Load mock data on mount or domain change for Tab 1
  useEffect(() => {
    if (activeTab === 'uwresearch') {
      loadMockData();
    }
  }, [selectedDomain, activeTab]);

  const loadMockData = () => {
    const mockData = MOCK_EXAMPLES[selectedDomain];
    const domain = DOMAINS[selectedDomain];

    const nodes = mockData.nodes.map(node => ({
      id: node.id,
      name: node.id,
      type: node.type,
      color: domain.colors[node.type],
      val: 1
    }));

    const links = mockData.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      confidence: edge.confidence,
      evidence: edge.evidence,
      sourceInfo: edge.source,
      color: domain.relationshipColors[edge.type],
      label: `${edge.type} (${edge.confidence.toFixed(2)})`
    }));

    setGraphData({ nodes, links });
    setCurrentPapers(mockData.papers);
    setHypotheses([]);
  };

  // ========== API INTEGRATIONS ==========

  const searchPubMed = async (query, attempt = 1) => {
    try {
      // Build query with proper format
      let searchTerm = query;

      // Fallback queries if first attempt returns 0 results
      if (attempt === 2 && selectedDomain === 'computerscience') {
        console.log('🔄 Trying broader term: computer science');
        searchTerm = searchTerm.replace(/computer\s+systems?/i, 'computer science');
      } else if (attempt === 3 && selectedDomain === 'computerscience') {
        console.log('🔄 Trying broader term: operating systems');
        searchTerm = 'operating systems';
      }

      // Step 1: Search for papers with UW Madison affiliation
      const pubmedQuery = `${searchTerm}+AND+University+of+Wisconsin-Madison[Affiliation]`;
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${pubmedQuery}&retmode=json&retmax=10`;

      console.log('🔍 PubMed Search URL:', searchUrl);
      console.log('📝 Search term:', searchTerm);

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      console.log('📊 PubMed search response:', searchData);

      const pmids = searchData.esearchresult?.idlist || [];
      console.log(`✅ Found ${pmids.length} PubMed IDs:`, pmids);

      if (pmids.length === 0 && attempt < 3) {
        console.log('⚠️ No results, trying fallback query...');
        return await searchPubMed(query, attempt + 1);
      }

      if (pmids.length === 0) {
        console.log('❌ No PubMed results found after all attempts');
        return { abstracts: [], papers: [] };
      }

      setStatus(`📚 Found ${pmids.length} papers from UW researchers`);

      // Step 2: Fetch abstracts
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
      console.log('📄 Fetching abstracts from:', fetchUrl);

      const abstractsResponse = await fetch(fetchUrl);
      const abstractsXml = await abstractsResponse.text();
      console.log('📄 Received XML, length:', abstractsXml.length);

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(abstractsXml, 'text/xml');
      const articles = xmlDoc.getElementsByTagName('PubmedArticle');
      console.log(`📚 Parsed ${articles.length} articles from XML`);

      const papers = [];
      const abstracts = [];

      for (let article of articles) {
        const titleElem = article.getElementsByTagName('ArticleTitle')[0];
        const abstractElems = article.getElementsByTagName('AbstractText');
        const authorElems = article.getElementsByTagName('Author');

        const title = titleElem?.textContent || 'Untitled';
        let abstract = '';
        for (let absElem of abstractElems) {
          abstract += absElem.textContent + ' ';
        }

        // Get authors
        let authors = [];
        for (let i = 0; i < Math.min(3, authorElems.length); i++) {
          const lastName = authorElems[i].getElementsByTagName('LastName')[0]?.textContent;
          const foreName = authorElems[i].getElementsByTagName('ForeName')[0]?.textContent;
          if (lastName) {
            authors.push(foreName ? `${foreName} ${lastName}` : lastName);
          }
        }

        console.log(`📄 Paper: "${title.substring(0, 60)}..." by ${authors.join(', ')}`);

        if (abstract || title) {
          papers.push(title);
          const authorStr = authors.length > 0 ? `\nAuthors: ${authors.join(', ')}` : '';
          abstracts.push(`Title: ${title}${authorStr}\n\nAbstract: ${abstract || 'No abstract available'}\n\n`);
        }
      }

      console.log(`✅ Returning ${papers.length} papers with abstracts`);
      return { abstracts, papers };
    } catch (error) {
      console.error('❌ PubMed API error:', error);
      return { abstracts: [], papers: [] };
    }
  };

  const searchGoogleScholar = async (query) => {
    if (!apiKeys.serpapi) {
      console.log('⚠️ SerpAPI key missing - skipping Google Scholar');
      setStatus('⚠️ Add SerpAPI key in Settings for Google Scholar results');
      return { abstracts: [], papers: [] };
    }

    try {
      setStatus('🔍 Supplementing with Google Scholar...');
      const scholarQuery = `${query} author:"university of wisconsin madison"`;
      const scholarUrl = `https://serpapi.com/search?engine=google_scholar&q=${encodeURIComponent(scholarQuery)}&api_key=${apiKeys.serpapi}`;

      console.log('🎓 Google Scholar URL:', scholarUrl);

      const response = await fetch(scholarUrl);
      const data = await response.json();

      console.log('🎓 Google Scholar response:', data);

      const papers = [];
      const abstracts = [];

      const results = data.organic_results?.slice(0, 3) || [];
      console.log(`📚 Found ${results.length} Google Scholar results`);

      for (let result of results) {
        console.log(`📄 Scholar paper: "${result.title.substring(0, 60)}..."`);
        papers.push(result.title);
        abstracts.push(`Title: ${result.title}\n\nSnippet: ${result.snippet || 'No abstract available'}\n\n`);
      }

      return { abstracts, papers };
    } catch (error) {
      console.error('❌ Google Scholar API error:', error);
      return { abstracts: [], papers: [] };
    }
  };

  const extractEntitiesWithClaude = async (combinedAbstracts, papers) => {
    if (!apiKeys.claude) {
      throw new Error('Claude API key required. Please add it in Settings.');
    }

    setStatus('🧬 Extracting entities and relationships with Claude AI...');

    const domain = DOMAINS[selectedDomain];
    const prompt = `You are analyzing ${domain.name} research papers from UW Madison. Your task is to extract entities AND find relationships between them.

PAPERS:
${combinedAbstracts}

STEP 1 - EXTRACT ENTITIES:
Find all entities of these types: ${domain.entities.join(', ')}

STEP 2 - FIND RELATIONSHIPS (CRITICAL):
For each paper, look for entities that appear together and CREATE EDGES between them.

IMPORTANT RULES FOR RELATIONSHIPS:
1. When multiple entities appear in the same paragraph/section, they are likely related
2. For Computer Science: If a researcher name appears with a topic/system, create: researcher RESEARCHES topic
3. If two researchers co-author, create: researcher1 COLLABORATES_WITH researcher2
4. If a method is applied to a problem, create: method SOLVES problem
5. Look for verbs and context clues to determine relationship type
6. Create AT LEAST 3-5 relationships PER PAPER
7. Every entity should connect to at least 1-2 other entities

RELATIONSHIP TYPES to use:
${domain.relationships.join(', ')}

EXAMPLES:
- If paper mentions "Remzi developed xv6 operating system" → Remzi RESEARCHES xv6, Remzi AUTHORED xv6
- If "BERT uses transformer architecture" → BERT REQUIRES Transformer
- If "Alice and Bob collaborated on distributed systems" → Alice COLLABORATES_WITH Bob, Alice RESEARCHES distributed systems

Return ONLY valid JSON (no markdown):
{
  "entities": [
    {"name": "entity name", "type": "entity_type"}
  ],
  "relationships": [
    {
      "entity1": "first entity name",
      "entity2": "second entity name",
      "type": "RELATIONSHIP_TYPE",
      "confidence": 0.9,
      "evidence": "direct quote from paper showing this relationship",
      "source": "paper title"
    }
  ]
}

REMINDER: You MUST return MANY relationships (aim for 10-20+ total). Look for every co-occurrence of entities!`;

    try {
      console.log('🤖 Sending to Claude API...');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys.claude,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Claude API error:', response.status, errorText);
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.content[0].text;

      console.log('📝 Claude response (first 500 chars):', content.substring(0, 500));

      // Strip markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const extracted = JSON.parse(content);

      console.log(`✅ Extracted ${extracted.entities?.length || 0} entities and ${extracted.relationships?.length || 0} relationships`);

      if (extracted.relationships?.length === 0) {
        console.warn('⚠️ WARNING: No relationships extracted! This will result in nodes with no edges.');
      }

      return {
        entities: extracted.entities || [],
        relationships: extracted.relationships || []
      };
    } catch (error) {
      console.error('❌ Claude API error:', error);
      throw error;
    }
  };

  const processPDFsWithClaude = async (files) => {
    if (!apiKeys.claude) {
      throw new Error('Claude API key required. Please add it in Settings.');
    }

    setStatus('📄 Processing PDFs with Claude AI...');

    const allEntities = [];
    const allRelationships = [];
    const domain = DOMAINS[selectedDomain];

    for (let file of files) {
      // Convert to base64
      const base64 = await fileToBase64(file);

      const prompt = `Analyze this ${domain.name} research paper and extract entities AND relationships.

STEP 1 - EXTRACT ENTITIES:
Find all entities of these types: ${domain.entities.join(', ')}

STEP 2 - FIND RELATIONSHIPS (CRITICAL):
Look for entities that appear together in the paper and CREATE EDGES between them.

RULES:
1. When entities appear in same sections/paragraphs, they are likely related
2. For authors/researchers + topics → researcher RESEARCHES topic
3. For co-authors → COLLABORATES_WITH
4. For methods/techniques + problems → SOLVES, APPLIES_TO
5. Create AT LEAST 5-10 relationships
6. Every entity should connect to at least 1-2 other entities

RELATIONSHIP TYPES: ${domain.relationships.join(', ')}

Return ONLY valid JSON (no markdown):
{
  "entities": [{"name": "...", "type": "..."}],
  "relationships": [{
    "entity1": "...",
    "entity2": "...",
    "type": "...",
    "confidence": 0.9,
    "evidence": "quote from paper",
    "page": 1
  }]
}

REMINDER: Return MANY relationships! Look for every co-occurrence.`;

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKeys.claude,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: base64
                  }
                },
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }]
          })
        });

        if (!response.ok) {
          console.error(`Error processing ${file.name}`);
          continue;
        }

        const data = await response.json();
        let content = data.content[0].text;
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        console.log(`📝 PDF ${file.name} - Claude response (first 500 chars):`, content.substring(0, 500));

        const extracted = JSON.parse(content);
        console.log(`📄 PDF ${file.name} - Extracted ${extracted.entities?.length || 0} entities, ${extracted.relationships?.length || 0} relationships`);

        allEntities.push(...(extracted.entities || []));
        allRelationships.push(...(extracted.relationships || []));
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error);
      }
    }

    console.log(`✅ Total from all PDFs: ${allEntities.length} entities, ${allRelationships.length} relationships`);

    return { entities: allEntities, relationships: allRelationships };
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateHypotheses = async () => {
    if (!apiKeys.claude) {
      alert('Claude API key required. Please add it in Settings.');
      return;
    }

    setLoading(true);
    setStatus('💡 Generating research hypotheses...');

    const domain = DOMAINS[selectedDomain];
    const prompt = `Analyze this ${domain.name} knowledge graph from UW Madison research:

ENTITIES: ${JSON.stringify(graphData.nodes.map(n => ({ name: n.name, type: n.type })))}
RELATIONSHIPS: ${JSON.stringify(graphData.links.map(l => ({ from: l.source.id || l.source, to: l.target.id || l.target, type: l.type, confidence: l.confidence })))}

Generate 3-4 novel research hypotheses by finding:
1. Causal chains (multi-hop paths)
2. Therapeutic/application opportunities
3. Understudied connections
4. Contradictions or gaps

Return ONLY valid JSON (no markdown):
{
  "hypotheses": [{
    "title": "...",
    "reasoning": "...",
    "confidence": 0.85,
    "supporting_evidence": [{"relationship": "X → Y", "confidence": 0.9, "source": "..."}],
    "suggested_experiments": ["...", "..."]
  }]
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys.claude,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      const data = await response.json();
      let content = data.content[0].text;
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const result = JSON.parse(content);
      setHypotheses(result.hypotheses || []);
      setStatus('✅ Hypotheses generated!');
    } catch (error) {
      console.error('Hypothesis generation error:', error);
      setStatus('❌ Error generating hypotheses');
    } finally {
      setLoading(false);
    }
  };

  // ========== EVENT HANDLERS ==========

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setStatus('🔍 Searching PubMed for UW Madison papers...');
    setHypotheses([]);

    try {
      // Search PubMed
      let { abstracts, papers } = await searchPubMed(searchQuery);

      // Supplement with Google Scholar if needed
      if (abstracts.length < 3 && apiKeys.serpapi) {
        const scholarResults = await searchGoogleScholar(searchQuery);
        abstracts = [...abstracts, ...scholarResults.abstracts];
        papers = [...papers, ...scholarResults.papers];
      }

      if (abstracts.length === 0) {
        setStatus('❌ No papers found. Try different keywords or use example data.');
        setLoading(false);
        return;
      }

      const combinedAbstracts = abstracts.join('\n\n');

      // Extract entities with Claude
      const extracted = await extractEntitiesWithClaude(combinedAbstracts, papers);

      // Build graph
      setStatus('🔗 Building knowledge graph...');
      buildGraphFromExtraction(extracted, papers);
      setStatus(`✅ Graph ready! Analyzed ${papers.length} papers.`);
    } catch (error) {
      console.error('Search error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length === 0) return;

    setUploadedFiles(files);
    setLoading(true);
    setStatus(`📄 Processing ${files.length} PDF(s)...`);
    setHypotheses([]);

    try {
      const extracted = await processPDFsWithClaude(files);

      setStatus('🔗 Building knowledge graph...');
      const paperNames = files.map(f => f.name);
      buildGraphFromExtraction(extracted, paperNames);
      setStatus(`✅ Graph ready! Processed ${files.length} PDF(s).`);
    } catch (error) {
      console.error('PDF processing error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const buildGraphFromExtraction = (extracted, papers) => {
    console.log('🔨 Building graph from extraction...');
    console.log('📊 Raw extraction data:', extracted);

    const domain = DOMAINS[selectedDomain];

    // Deduplicate entities
    const entityMap = new Map();
    for (let entity of extracted.entities) {
      if (!entityMap.has(entity.name)) {
        entityMap.set(entity.name, {
          id: entity.name,
          name: entity.name,
          type: entity.type,
          color: domain.colors[entity.type] || '#9ca3af',
          val: 1
        });
      }
    }

    const nodes = Array.from(entityMap.values());
    console.log(`📍 Created ${nodes.length} nodes:`, nodes.map(n => n.name));

    const links = extracted.relationships.map(rel => ({
      source: rel.entity1,
      target: rel.entity2,
      type: rel.type,
      confidence: rel.confidence,
      evidence: rel.evidence,
      sourceInfo: rel.source || rel.page || 'Unknown',
      color: domain.relationshipColors[rel.type] || '#9ca3af',
      label: `${rel.type} (${rel.confidence.toFixed(2)})`
    }));

    console.log(`🔗 Created ${links.length} edges (links):`, links.map(l => `${l.source} → ${l.target}`));

    if (links.length === 0) {
      console.error('❌ WARNING: No edges created! Graph will show only disconnected nodes.');
      console.error('🔍 Check if relationships were extracted from papers');
    }

    setGraphData({ nodes, links });
    setCurrentPapers(papers);

    console.log('✅ Graph data set:', { nodes: nodes.length, links: links.length });
  };

  const saveApiKey = (key, value) => {
    localStorage.setItem(`${key}_key`, value);
    setApiKeys({ ...apiKeys, [key]: value });
  };

  // ========== RENDER ==========

  const domain = DOMAINS[selectedDomain];

  // MODE SELECTION SCREEN
  if (selectedMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        {/* Sparkly background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>

        <div className="max-w-6xl w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-7xl">🦡</span>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Badger Research Graph
              </h1>
            </div>
            <p className="text-2xl text-amber-200 mb-2">AI-Powered Knowledge Discovery</p>
            <p className="text-lg text-slate-300">UW-Madison Claude Code Hackathon</p>
          </div>

          {/* Problem Statement */}
          <div className="bg-slate-800/50 backdrop-blur border border-amber-500/30 rounded-2xl p-6 mb-8 shadow-2xl">
            <h2 className="text-xl font-bold text-amber-400 mb-3">🎯 Problem We Solve</h2>
            <p className="text-slate-200 text-lg">
              UW-Madison researchers waste <strong className="text-amber-300">hours manually reading papers</strong> to understand
              connections between concepts. Our tool uses <strong className="text-amber-300">Claude AI</strong> to automatically
              extract knowledge graphs from academic papers.
            </p>
          </div>

          {/* Mode Selection */}
          <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">Choose Your Research Mode</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* MODE 1 */}
            <button
              onClick={() => {
                setSelectedMode('manual');
                setActiveTab('upload');
              }}
              className="group bg-gradient-to-br from-purple-900/80 to-purple-700/80 hover:from-purple-800 hover:to-purple-600 border-2 border-purple-400/50 hover:border-purple-300 rounded-2xl p-8 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">📄</span>
                <div>
                  <h3 className="text-2xl font-bold text-purple-200 mb-2">MODE 1: Manual Upload</h3>
                  <p className="text-sm text-purple-300 font-semibold">For Focused Research</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">1.</span>
                  <p className="text-slate-200">Upload 1-3 specific PDFs you already have</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">2.</span>
                  <p className="text-slate-200">Claude AI extracts entities & relationships</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">3.</span>
                  <p className="text-slate-200">Instant knowledge graph from YOUR papers</p>
                </div>
              </div>

              <div className="bg-purple-950/50 rounded-lg p-3 border border-purple-400/30">
                <p className="text-xs text-purple-200 italic">
                  💡 Use Case: "I have 5 key papers for my project and need to understand them deeply"
                </p>
              </div>

              <div className="mt-6 text-center">
                <span className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full font-semibold group-hover:bg-purple-400 transition">
                  Select Manual Mode →
                </span>
              </div>
            </button>

            {/* MODE 2 */}
            <button
              onClick={() => {
                setSelectedMode('agent');
                setActiveTab('search');
              }}
              className="group bg-gradient-to-br from-blue-900/80 to-cyan-900/80 hover:from-blue-800 hover:to-cyan-800 border-2 border-cyan-400/50 hover:border-cyan-300 rounded-2xl p-8 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">🤖</span>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-200 mb-2">MODE 2: Agent Mode</h3>
                  <p className="text-sm text-cyan-300 font-semibold">Autonomous Discovery</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">1.</span>
                  <p className="text-slate-200">Enter research topic (e.g., "BRCA1 cancer")</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">2.</span>
                  <p className="text-slate-200">Agent searches PubMed & finds 5-10 UW papers</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400">3.</span>
                  <p className="text-slate-200">Auto-downloads & builds cross-paper graph</p>
                </div>
              </div>

              <div className="bg-cyan-950/50 rounded-lg p-3 border border-cyan-400/30">
                <p className="text-xs text-cyan-200 italic">
                  ✨ Use Case: "I'm starting new research and need to understand the entire landscape"
                </p>
              </div>

              <div className="mt-6 text-center">
                <span className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-full font-semibold group-hover:bg-cyan-400 transition">
                  Select Agent Mode →
                </span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <button
              onClick={() => setActiveTab('uwresearch')}
              className="text-amber-300 hover:text-amber-200 text-sm underline"
            >
              Or view example research →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-red-900 to-slate-800 text-white shadow-lg border-b-2 border-amber-500/30" style={{ backgroundImage: 'linear-gradient(to right, #1e293b, #7f1d1d, #1e293b)' }}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <span>🦡</span>
                <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  Badger Research Graph
                </span>
              </h1>
              <p className="text-amber-200 mt-2 text-lg">
                AI-Powered Cross-Disciplinary Research • UW-Madison
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMode(null)}
                className="bg-slate-700 text-amber-300 px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition border border-amber-500/30"
              >
                ← Change Mode
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800 border-b-2 border-amber-500/30 shadow-md">
          <div className="container mx-auto px-6 py-4">
            <h3 className="font-bold text-lg mb-3 text-amber-400">⚙️ API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Claude API Key (Required)</label>
                <input
                  type="password"
                  value={apiKeys.claude}
                  onChange={(e) => saveApiKey('claude', e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-slate-700 border border-amber-500/30 rounded px-3 py-2 text-white placeholder-slate-400"
                />
                <p className="text-xs text-slate-400 mt-1">Get from console.anthropic.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">SerpAPI Key (Optional)</label>
                <input
                  type="password"
                  value={apiKeys.serpapi}
                  onChange={(e) => saveApiKey('serpapi', e.target.value)}
                  placeholder="For Google Scholar search..."
                  className="w-full bg-slate-700 border border-amber-500/30 rounded px-3 py-2 text-white placeholder-slate-400"
                />
                <p className="text-xs text-slate-400 mt-1">Get free key from serpapi.com (for Google Scholar)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-800 border-b-2 border-amber-500/30">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'uwresearch', label: '🦡 UW Research' },
              { id: 'search', label: '🤖 Agent Search', show: selectedMode === 'agent' || selectedMode === null },
              { id: 'upload', label: '📄 Manual Upload', show: selectedMode === 'manual' || selectedMode === null }
            ].filter(tab => tab.show !== false).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-900 border-b-4 border-amber-700'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-amber-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Domain Selector */}
        <div className="bg-slate-800 border border-amber-500/30 rounded-lg shadow-lg p-4 mb-6">
          <label className="font-semibold text-amber-400 mr-3">Research Domain:</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-700 border-2 border-amber-500/50 rounded-lg px-4 py-2 font-medium text-white"
          >
            {Object.entries(DOMAINS).map(([key, domain]) => (
              <option key={key} value={key} className="bg-slate-700">
                {domain.icon} {domain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab 1: UW Research Examples */}
        {activeTab === 'uwresearch' && (
          <div>
            <div className="bg-blue-900/50 border-l-4 border-cyan-400 p-4 mb-6">
              <p className="font-semibold text-cyan-300">
                📚 Example: {MOCK_EXAMPLES[selectedDomain].title}
              </p>
              <p className="text-cyan-200 text-sm mt-1">
                Showing pre-loaded example from UW Madison {domain.name} research
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Search Papers */}
        {activeTab === 'search' && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-6 mb-6">
            <div className="bg-blue-900/50 border-l-4 border-cyan-400 p-3 mb-4">
              <p className="font-semibold text-cyan-300">🤖 MODE 2: AGENT MODE - Autonomous Research Discovery</p>
              <p className="text-sm text-cyan-200">The agent will search PubMed, download papers, and build a knowledge graph automatically!</p>
            </div>
            <h3 className="font-bold text-xl mb-4">🔍 Search UW Madison Research Papers</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., 'BRCA1 breast cancer' or 'machine learning optimization'"
                className="flex-1 border-2 border-amber-500/30 bg-slate-700 text-white rounded-lg px-4 py-2"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400 transition"
                style={{ backgroundColor: loading ? '#9ca3af' : '#C5050C' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {!apiKeys.claude && (
              <p className="text-orange-600 text-sm mt-2">⚠️ Claude API key required (add in Settings)</p>
            )}
          </div>
        )}

        {/* Tab 3: Upload Papers */}
        {activeTab === 'upload' && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-6 mb-6">
            <div className="bg-purple-900/50 border-l-4 border-purple-400 p-3 mb-4">
              <p className="font-semibold text-purple-300">📄 MODE 1: MANUAL UPLOAD - Analyze Your Papers</p>
              <p className="text-sm text-purple-200">Upload specific PDFs you already have for focused analysis</p>
            </div>
            <h3 className="font-bold text-xl mb-4">📄 Upload Research Papers (PDF)</h3>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-700 file:font-semibold hover:file:bg-red-100"
            />
            <p className="text-slate-400 text-sm mt-2">Upload 1-3 PDFs (max 10MB each)</p>
            {uploadedFiles.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold">Uploaded: {uploadedFiles.map(f => f.name).join(', ')}</p>
              </div>
            )}
            {!apiKeys.claude && (
              <p className="text-orange-600 text-sm mt-2">⚠️ Claude API key required (add in Settings)</p>
            )}
          </div>
        )}

        {/* Status */}
        {status && (
          <div className="bg-amber-900/50 border-l-4 border-amber-400 p-4 mb-6">
            <p className="font-medium text-amber-300">{status}</p>
          </div>
        )}

        {/* Papers List */}
        {currentPapers.length > 0 && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-4 mb-6">
            <h4 className="font-bold mb-2">📄 Analyzed Papers ({currentPapers.length}):</h4>
            <ul className="list-disc list-inside text-sm text-slate-300">
              {currentPapers.map((paper, i) => (
                <li key={i}>{paper}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Graph Visualization */}
        {graphData.nodes.length > 0 && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-xl mb-4">🔗 Knowledge Graph</h3>

            {/* Warning if no edges */}
            {graphData.links.length === 0 && (
              <div className="bg-orange-900/50 border-l-4 border-orange-400 p-4 mb-4">
                <p className="font-semibold text-orange-300">⚠️ No relationships found!</p>
                <p className="text-orange-200 text-sm">
                  The graph shows {graphData.nodes.length} entities but no connections between them.
                  Check the console for extraction details.
                </p>
              </div>
            )}

            {/* Success message */}
            {graphData.links.length > 0 && (
              <div className="bg-emerald-900/50 border-l-4 border-emerald-400 p-4 mb-4">
                <p className="font-semibold text-emerald-300">
                  ✅ Graph complete: {graphData.nodes.length} entities, {graphData.links.length} relationships
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="mb-4 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold mb-2">Entity Types:</h4>
              <div className="flex flex-wrap gap-3 mb-3">
                {domain.entities.map(entityType => (
                  <span key={entityType} className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: domain.colors[entityType] }}
                    />
                    <span className="text-sm">{entityType}</span>
                  </span>
                ))}
              </div>
              <h4 className="font-semibold mb-2">Relationship Types:</h4>
              <div className="flex flex-wrap gap-3">
                {domain.relationships.map(relType => (
                  <span key={relType} className="flex items-center gap-2">
                    <span
                      className="w-4 h-1"
                      style={{ backgroundColor: domain.relationshipColors[relType] }}
                    />
                    <span className="text-sm">{relType}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Graph */}
            <div className="border-2 border-amber-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 shadow-2xl">
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeColor={node => node.color}
                nodeVal={node => node.val * 4}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.name;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const size = node.val * 4;

                  // Sparkly gold glow effect
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = '#fbbf24';
                  ctx.fillStyle = node.color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                  ctx.fill();

                  // Reset shadow for text
                  ctx.shadowBlur = 0;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#fef3c7';
                  ctx.fillText(label, node.x, node.y + size + 10);
                }}
                linkColor={link => link.color || '#fbbf24'}
                linkLabel={link => link.label}
                linkWidth={link => 2}
                linkDirectionalArrowLength={8}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleColor={() => '#fbbf24'}
                onLinkClick={(link) => setSelectedEdge(link)}
                width={1000}
                height={600}
                backgroundColor="rgba(2, 6, 23, 0.95)"
              />
            </div>

            {/* Generate Hypotheses Button */}
            <div className="mt-4">
              <button
                onClick={generateHypotheses}
                disabled={loading || !apiKeys.claude}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:from-amber-400 hover:to-amber-500 disabled:bg-gray-400 transition shadow-lg"
              >
                {loading ? '💡 Generating...' : '✨ Generate Research Hypotheses'}
              </button>
              {!apiKeys.claude && (
                <p className="text-orange-600 text-sm mt-2">⚠️ Claude API key required</p>
              )}
            </div>
          </div>
        )}

        {/* Edge Detail Modal */}
        {selectedEdge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEdge(null)}>
            <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-xl mb-4">Relationship Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Type: </span>
                  <span
                    className="px-3 py-1 rounded-full text-white font-semibold"
                    style={{ backgroundColor: selectedEdge.color }}
                  >
                    {selectedEdge.type}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Entities: </span>
                  <span>{selectedEdge.source.id || selectedEdge.source} → {selectedEdge.target.id || selectedEdge.target}</span>
                </div>
                <div>
                  <span className="font-semibold">Confidence: </span>
                  <div className="mt-1 bg-gray-200 rounded-full h-6 w-full">
                    <div
                      className="bg-green-500 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ width: `${selectedEdge.confidence * 100}%` }}
                    >
                      {(selectedEdge.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Evidence: </span>
                  <p className="text-slate-300 italic mt-1 bg-slate-700/50 p-3 rounded">
                    "{selectedEdge.evidence}"
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Source: </span>
                  <span className="text-slate-300">{selectedEdge.sourceInfo}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEdge(null)}
                className="mt-4 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Hypotheses */}
        {hypotheses.length > 0 && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">💡 Generated Research Hypotheses</h3>
            <div className="space-y-4">
              {hypotheses.map((hyp, i) => (
                <div key={i} className="border-2 border-purple-500/30 rounded-lg p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-purple-300">{hyp.title}</h4>
                    <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {(hyp.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{hyp.reasoning}</p>

                  {hyp.supporting_evidence && (
                    <div className="mb-3">
                      <p className="font-semibold text-sm mb-1 text-amber-400">Supporting Evidence:</p>
                      <ul className="list-disc list-inside text-sm text-slate-400">
                        {hyp.supporting_evidence.map((ev, j) => (
                          <li key={j}>
                            {ev.relationship} (confidence: {(ev.confidence * 100).toFixed(0)}%)
                            {ev.source && ` - ${ev.source}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hyp.suggested_experiments && (
                    <div>
                      <p className="font-semibold text-sm mb-1 text-amber-400">Suggested Experiments:</p>
                      <ul className="list-disc list-inside text-sm text-slate-400">
                        {hyp.suggested_experiments.map((exp, j) => (
                          <li key={j}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {graphData.nodes.length === 0 && !loading && (
          <div className="bg-slate-800 border border-amber-500/20 rounded-lg shadow-md p-12 text-center">
            <p className="text-slate-400 text-lg">
              {activeTab === 'uwresearch' ? 'Select a domain to see example research' :
               activeTab === 'search' ? 'Search for UW Madison papers to build a knowledge graph' :
               'Upload PDF papers to extract entities and relationships'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
