import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// ============================================================================
// BADGER RESEARCH GRAPH - UW Madison AI Research Knowledge Graph Tool
// ============================================================================

const BadgerResearchGraph = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState('biomedicine');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hypotheses, setHypotheses] = useState([]);
  const [showHypotheses, setShowHypotheses] = useState(false);

  // API Keys
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [serpApiKey, setSerpApiKey] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');
  const [paperSources, setPaperSources] = useState([]);

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const graphRef = useRef();

  // ============================================================================
  // DOMAIN CONFIGURATIONS
  // ============================================================================

  const domains = {
    biomedicine: {
      name: 'Biomedicine',
      icon: '🧬',
      entityTypes: ['gene', 'disease', 'drug', 'protein', 'pathway', 'cell_type'],
      relationshipTypes: ['CAUSES', 'TREATS', 'INHIBITS', 'ACTIVATES', 'ASSOCIATES_WITH', 'BIOMARKER_FOR'],
      entityColors: {
        gene: '#3B82F6',
        disease: '#EF4444',
        drug: '#10B981',
        protein: '#F59E0B',
        pathway: '#8B5CF6',
        cell_type: '#EC4899'
      },
      relationshipColors: {
        CAUSES: '#F97316',
        TREATS: '#10B981',
        INHIBITS: '#EF4444',
        ACTIVATES: '#8B5CF6',
        ASSOCIATES_WITH: '#3B82F6',
        BIOMARKER_FOR: '#EC4899'
      }
    },
    computer_science: {
      name: 'Computer Science',
      icon: '💻',
      entityTypes: ['algorithm', 'problem', 'technique', 'system', 'dataset', 'model'],
      relationshipTypes: ['SOLVES', 'OPTIMIZES', 'OUTPERFORMS', 'REQUIRES', 'ENABLES', 'EVALUATES_ON'],
      entityColors: {
        algorithm: '#3B82F6',
        problem: '#EF4444',
        technique: '#10B981',
        system: '#F59E0B',
        dataset: '#8B5CF6',
        model: '#06B6D4'
      },
      relationshipColors: {
        SOLVES: '#10B981',
        OPTIMIZES: '#8B5CF6',
        OUTPERFORMS: '#F97316',
        REQUIRES: '#3B82F6',
        ENABLES: '#14B8A6',
        EVALUATES_ON: '#EC4899'
      }
    },
    economics: {
      name: 'Economics',
      icon: '📊',
      entityTypes: ['policy', 'economic_indicator', 'market', 'theory', 'intervention', 'outcome'],
      relationshipTypes: ['INFLUENCES', 'CORRELATES_WITH', 'CAUSES', 'MITIGATES', 'PREDICTS', 'RESPONDS_TO'],
      entityColors: {
        policy: '#3B82F6',
        economic_indicator: '#EF4444',
        market: '#10B981',
        theory: '#F59E0B',
        intervention: '#8B5CF6',
        outcome: '#EC4899'
      },
      relationshipColors: {
        INFLUENCES: '#F97316',
        CORRELATES_WITH: '#3B82F6',
        CAUSES: '#EF4444',
        MITIGATES: '#10B981',
        PREDICTS: '#8B5CF6',
        RESPONDS_TO: '#EC4899'
      }
    },
    political_science: {
      name: 'Political Science',
      icon: '🏛️',
      entityTypes: ['policy', 'actor', 'institution', 'outcome', 'event', 'ideology'],
      relationshipTypes: ['ADVOCATES_FOR', 'OPPOSES', 'IMPLEMENTS', 'LEADS_TO', 'INFLUENCES', 'RESULTS_FROM'],
      entityColors: {
        policy: '#3B82F6',
        actor: '#EF4444',
        institution: '#10B981',
        outcome: '#F59E0B',
        event: '#8B5CF6',
        ideology: '#EC4899'
      },
      relationshipColors: {
        ADVOCATES_FOR: '#10B981',
        OPPOSES: '#EF4444',
        IMPLEMENTS: '#3B82F6',
        LEADS_TO: '#F97316',
        INFLUENCES: '#8B5CF6',
        RESULTS_FROM: '#EC4899'
      }
    },
    mathematics: {
      name: 'Mathematics',
      icon: '🔢',
      entityTypes: ['theorem', 'conjecture', 'method', 'structure', 'application', 'proof'],
      relationshipTypes: ['PROVES', 'GENERALIZES', 'APPLIES_TO', 'BUILDS_ON', 'CONTRADICTS', 'IMPLIES'],
      entityColors: {
        theorem: '#3B82F6',
        conjecture: '#EF4444',
        method: '#10B981',
        structure: '#F59E0B',
        application: '#8B5CF6',
        proof: '#06B6D4'
      },
      relationshipColors: {
        PROVES: '#10B981',
        GENERALIZES: '#3B82F6',
        APPLIES_TO: '#F97316',
        BUILDS_ON: '#8B5CF6',
        CONTRADICTS: '#EF4444',
        IMPLIES: '#14B8A6'
      }
    }
  };

  // ============================================================================
  // MOCK DATA FOR TAB 1 (UW Research Examples)
  // ============================================================================

  const mockData = {
    biomedicine: {
      title: 'Cancer Immunotherapy - Carbone Cancer Center',
      nodes: [
        { id: 'PD-1', type: 'protein', label: 'PD-1' },
        { id: 'PD-L1', type: 'protein', label: 'PD-L1' },
        { id: 'CTLA-4', type: 'protein', label: 'CTLA-4' },
        { id: 'Melanoma', type: 'disease', label: 'Melanoma' },
        { id: 'Lung Cancer', type: 'disease', label: 'Lung Cancer' },
        { id: 'Pembrolizumab', type: 'drug', label: 'Pembrolizumab' },
        { id: 'Nivolumab', type: 'drug', label: 'Nivolumab' },
        { id: 'Ipilimumab', type: 'drug', label: 'Ipilimumab' },
        { id: 'CD8+ T-cell', type: 'cell_type', label: 'CD8+ T-cell' },
        { id: 'T-cell Receptor', type: 'protein', label: 'T-cell Receptor' },
        { id: 'IFN-gamma', type: 'protein', label: 'IFN-gamma' },
        { id: 'BRAF', type: 'gene', label: 'BRAF' }
      ],
      links: [
        { source: 'Pembrolizumab', target: 'PD-1', type: 'INHIBITS', confidence: 0.96, evidence: 'Pembrolizumab is a humanized monoclonal antibody that blocks PD-1 receptor', source_paper: 'UW Carbone Cancer Center Study 2023' },
        { source: 'PD-1', target: 'CD8+ T-cell', type: 'INHIBITS', confidence: 0.94, evidence: 'PD-1 signaling suppresses T-cell activation and cytotoxicity', source_paper: 'Nature Immunology 2022' },
        { source: 'PD-L1', target: 'PD-1', type: 'ACTIVATES', confidence: 0.95, evidence: 'PD-L1 binds to PD-1 to initiate inhibitory signaling', source_paper: 'Cell 2021' },
        { source: 'Nivolumab', target: 'PD-1', type: 'INHIBITS', confidence: 0.95, evidence: 'Nivolumab blocks PD-1 checkpoint pathway', source_paper: 'NEJM 2022' },
        { source: 'Ipilimumab', target: 'CTLA-4', type: 'INHIBITS', confidence: 0.93, evidence: 'Ipilimumab blocks CTLA-4 to enhance T-cell activation', source_paper: 'Science 2020' },
        { source: 'CD8+ T-cell', target: 'Melanoma', type: 'TREATS', confidence: 0.88, evidence: 'Activated CD8+ T-cells directly kill melanoma cells', source_paper: 'Cancer Research 2023' },
        { source: 'CD8+ T-cell', target: 'Lung Cancer', type: 'TREATS', confidence: 0.85, evidence: 'T-cell infiltration correlates with improved outcomes', source_paper: 'JCO 2022' },
        { source: 'IFN-gamma', target: 'PD-L1', type: 'ACTIVATES', confidence: 0.91, evidence: 'IFN-gamma induces PD-L1 expression on tumor cells', source_paper: 'Immunity 2021' },
        { source: 'BRAF', target: 'Melanoma', type: 'CAUSES', confidence: 0.89, evidence: 'BRAF V600E mutation drives melanoma progression', source_paper: 'Nature Genetics 2022' },
        { source: 'T-cell Receptor', target: 'CD8+ T-cell', type: 'ACTIVATES', confidence: 0.92, evidence: 'TCR engagement triggers T-cell activation cascade', source_paper: 'Annual Review Immunology 2023' }
      ]
    },
    computer_science: {
      title: 'AI/ML Research - UW CS Department',
      nodes: [
        { id: 'Transformer', type: 'model', label: 'Transformer' },
        { id: 'BERT', type: 'model', label: 'BERT' },
        { id: 'Attention Mechanism', type: 'technique', label: 'Attention Mechanism' },
        { id: 'Image Classification', type: 'problem', label: 'Image Classification' },
        { id: 'ResNet', type: 'model', label: 'ResNet' },
        { id: 'ImageNet', type: 'dataset', label: 'ImageNet' },
        { id: 'Transfer Learning', type: 'technique', label: 'Transfer Learning' },
        { id: 'NLP', type: 'problem', label: 'NLP' },
        { id: 'GPT', type: 'model', label: 'GPT' },
        { id: 'Gradient Descent', type: 'algorithm', label: 'Gradient Descent' },
        { id: 'Neural Architecture Search', type: 'technique', label: 'Neural Architecture Search' },
        { id: 'CIFAR-10', type: 'dataset', label: 'CIFAR-10' }
      ],
      links: [
        { source: 'Attention Mechanism', target: 'Transformer', type: 'ENABLES', confidence: 0.95, evidence: 'Self-attention is the core component of Transformer architecture', source_paper: 'UW CS NLP Group 2023' },
        { source: 'Transformer', target: 'BERT', type: 'ENABLES', confidence: 0.94, evidence: 'BERT uses bidirectional Transformer encoder', source_paper: 'ACL 2022' },
        { source: 'BERT', target: 'NLP', type: 'SOLVES', confidence: 0.92, evidence: 'BERT achieves SOTA on multiple NLP benchmarks', source_paper: 'EMNLP 2021' },
        { source: 'ResNet', target: 'Image Classification', type: 'SOLVES', confidence: 0.93, evidence: 'ResNet won ImageNet challenge with 3.57% error rate', source_paper: 'CVPR 2022' },
        { source: 'ResNet', target: 'ImageNet', type: 'EVALUATES_ON', confidence: 0.96, evidence: 'Standard benchmark for image classification models', source_paper: 'ICLR 2021' },
        { source: 'Transfer Learning', target: 'BERT', type: 'ENABLES', confidence: 0.91, evidence: 'Pre-training enables transfer to downstream tasks', source_paper: 'NeurIPS 2022' },
        { source: 'GPT', target: 'NLP', type: 'SOLVES', confidence: 0.94, evidence: 'GPT demonstrates strong few-shot learning on NLP tasks', source_paper: 'OpenAI 2023' },
        { source: 'Gradient Descent', target: 'Transformer', type: 'OPTIMIZES', confidence: 0.89, evidence: 'Adam optimizer commonly used for training Transformers', source_paper: 'JMLR 2022' },
        { source: 'Neural Architecture Search', target: 'ResNet', type: 'OPTIMIZES', confidence: 0.85, evidence: 'NAS can discover efficient residual architectures', source_paper: 'ICML 2023' },
        { source: 'ResNet', target: 'CIFAR-10', type: 'EVALUATES_ON', confidence: 0.95, evidence: 'CIFAR-10 commonly used for architecture ablation studies', source_paper: 'ArXiv 2022' }
      ]
    },
    economics: {
      title: 'Labor Economics Research - UW Economics',
      nodes: [
        { id: 'Minimum Wage', type: 'policy', label: 'Minimum Wage' },
        { id: 'Employment Rate', type: 'economic_indicator', label: 'Employment Rate' },
        { id: 'Job Training Programs', type: 'intervention', label: 'Job Training Programs' },
        { id: 'Income Inequality', type: 'outcome', label: 'Income Inequality' },
        { id: 'Labor Market', type: 'market', label: 'Labor Market' },
        { id: 'Human Capital Theory', type: 'theory', label: 'Human Capital Theory' },
        { id: 'Unemployment Benefits', type: 'policy', label: 'Unemployment Benefits' },
        { id: 'GDP Growth', type: 'economic_indicator', label: 'GDP Growth' },
        { id: 'Wage Growth', type: 'economic_indicator', label: 'Wage Growth' },
        { id: 'Education Investment', type: 'intervention', label: 'Education Investment' },
        { id: 'Productivity', type: 'economic_indicator', label: 'Productivity' }
      ],
      links: [
        { source: 'Minimum Wage', target: 'Employment Rate', type: 'INFLUENCES', confidence: 0.78, evidence: 'Moderate minimum wage increases have minimal employment effects', source_paper: 'UW Economics Working Paper 2023' },
        { source: 'Job Training Programs', target: 'Income Inequality', type: 'MITIGATES', confidence: 0.82, evidence: 'Skills training reduces wage gaps for low-income workers', source_paper: 'QJE 2022' },
        { source: 'Human Capital Theory', target: 'Education Investment', type: 'PREDICTS', confidence: 0.88, evidence: 'Theory predicts positive returns to education investment', source_paper: 'AER 2021' },
        { source: 'Education Investment', target: 'Wage Growth', type: 'CAUSES', confidence: 0.85, evidence: 'Higher education correlates with 10-15% wage premium', source_paper: 'JPE 2023' },
        { source: 'Unemployment Benefits', target: 'Labor Market', type: 'INFLUENCES', confidence: 0.76, evidence: 'Extended benefits affect job search duration', source_paper: 'NBER 2022' },
        { source: 'Labor Market', target: 'GDP Growth', type: 'CORRELATES_WITH', confidence: 0.91, evidence: 'Labor market tightness strongly correlated with GDP', source_paper: 'Econometrica 2023' },
        { source: 'Productivity', target: 'Wage Growth', type: 'CAUSES', confidence: 0.87, evidence: 'Productivity growth historically drives wage increases', source_paper: 'REStud 2022' },
        { source: 'Minimum Wage', target: 'Income Inequality', type: 'MITIGATES', confidence: 0.74, evidence: 'Higher minimum wage compresses wage distribution', source_paper: 'JLE 2023' },
        { source: 'Job Training Programs', target: 'Productivity', type: 'INFLUENCES', confidence: 0.79, evidence: 'Sector-specific training improves worker productivity', source_paper: 'AEJ Applied 2022' }
      ]
    },
    political_science: {
      title: 'Political Behavior Research - UW Political Science',
      nodes: [
        { id: 'Social Media', type: 'institution', label: 'Social Media' },
        { id: 'Political Polarization', type: 'outcome', label: 'Political Polarization' },
        { id: 'Voter Turnout', type: 'outcome', label: 'Voter Turnout' },
        { id: 'Campaign Finance', type: 'policy', label: 'Campaign Finance' },
        { id: 'Electoral College', type: 'institution', label: 'Electoral College' },
        { id: 'Partisan Media', type: 'institution', label: 'Partisan Media' },
        { id: 'Civic Education', type: 'policy', label: 'Civic Education' },
        { id: 'Political Parties', type: 'actor', label: 'Political Parties' },
        { id: 'Misinformation', type: 'event', label: 'Misinformation' },
        { id: 'Democratic Norms', type: 'ideology', label: 'Democratic Norms' },
        { id: 'Voter ID Laws', type: 'policy', label: 'Voter ID Laws' }
      ],
      links: [
        { source: 'Social Media', target: 'Political Polarization', type: 'INFLUENCES', confidence: 0.82, evidence: 'Algorithm-driven content increases affective polarization', source_paper: 'UW Political Science Quarterly 2023' },
        { source: 'Partisan Media', target: 'Political Polarization', type: 'CAUSES', confidence: 0.85, evidence: 'Partisan news consumption correlates with extreme views', source_paper: 'APSR 2022' },
        { source: 'Campaign Finance', target: 'Electoral College', type: 'INFLUENCES', confidence: 0.78, evidence: 'Spending concentrated in battleground states', source_paper: 'JOP 2023' },
        { source: 'Civic Education', target: 'Voter Turnout', type: 'LEADS_TO', confidence: 0.76, evidence: 'Civics courses increase youth voter participation', source_paper: 'Political Behavior 2022' },
        { source: 'Misinformation', target: 'Democratic Norms', type: 'OPPOSES', confidence: 0.88, evidence: 'False claims erode trust in electoral processes', source_paper: 'Nature Human Behaviour 2023' },
        { source: 'Political Parties', target: 'Political Polarization', type: 'ADVOCATES_FOR', confidence: 0.81, evidence: 'Party elites drive ideological sorting', source_paper: 'BJPS 2022' },
        { source: 'Social Media', target: 'Misinformation', type: 'ENABLES', confidence: 0.89, evidence: 'Platforms amplify viral false content', source_paper: 'Science 2023' },
        { source: 'Voter ID Laws', target: 'Voter Turnout', type: 'INFLUENCES', confidence: 0.72, evidence: 'Strict ID laws reduce turnout among minorities', source_paper: 'QJPS 2022' },
        { source: 'Electoral College', target: 'Campaign Finance', type: 'RESULTS_FROM', confidence: 0.75, evidence: 'Winner-take-all system shapes campaign strategies', source_paper: 'Electoral Studies 2023' }
      ]
    },
    mathematics: {
      title: 'Algebraic Topology Research - UW Mathematics',
      nodes: [
        { id: 'Homotopy Theory', type: 'method', label: 'Homotopy Theory' },
        { id: 'Category Theory', type: 'structure', label: 'Category Theory' },
        { id: 'Fundamental Group', type: 'structure', label: 'Fundamental Group' },
        { id: 'Homology', type: 'method', label: 'Homology' },
        { id: 'Manifold', type: 'structure', label: 'Manifold' },
        { id: 'Poincaré Conjecture', type: 'theorem', label: 'Poincaré Conjecture' },
        { id: 'Spectral Sequences', type: 'method', label: 'Spectral Sequences' },
        { id: 'K-Theory', type: 'method', label: 'K-Theory' },
        { id: 'Topology Optimization', type: 'application', label: 'Topology Optimization' },
        { id: 'Riemann Hypothesis', type: 'conjecture', label: 'Riemann Hypothesis' },
        { id: 'Cohomology', type: 'method', label: 'Cohomology' }
      ],
      links: [
        { source: 'Category Theory', target: 'Homotopy Theory', type: 'GENERALIZES', confidence: 0.89, evidence: 'Higher category theory provides natural framework for homotopy', source_paper: 'UW Math Annals 2023' },
        { source: 'Fundamental Group', target: 'Homotopy Theory', type: 'BUILDS_ON', confidence: 0.92, evidence: 'Fundamental group is first homotopy group π₁', source_paper: 'Topology 2022' },
        { source: 'Homology', target: 'Manifold', type: 'APPLIES_TO', confidence: 0.94, evidence: 'Homology groups classify manifolds up to homotopy', source_paper: 'Annals of Math 2021' },
        { source: 'Spectral Sequences', target: 'Homology', type: 'PROVES', confidence: 0.88, evidence: 'Spectral sequences compute homology of fiber bundles', source_paper: 'JAMS 2022' },
        { source: 'K-Theory', target: 'Category Theory', type: 'BUILDS_ON', confidence: 0.86, evidence: 'K-theory uses categorical constructions extensively', source_paper: 'Inventiones 2023' },
        { source: 'Poincaré Conjecture', target: 'Manifold', type: 'APPLIES_TO', confidence: 0.95, evidence: 'Characterizes 3-sphere among 3-manifolds', source_paper: 'Acta Math 2022' },
        { source: 'Topology Optimization', target: 'Homology', type: 'APPLIES_TO', confidence: 0.78, evidence: 'Persistent homology used in structural optimization', source_paper: 'SIAM 2023' },
        { source: 'Cohomology', target: 'Homology', type: 'GENERALIZES', confidence: 0.91, evidence: 'Cohomology is dual theory with ring structure', source_paper: 'Duke Math J 2022' },
        { source: 'Riemann Hypothesis', target: 'K-Theory', type: 'IMPLIES', confidence: 0.72, evidence: 'Connections to motivic cohomology and algebraic K-theory', source_paper: 'GAFA 2023' }
      ]
    }
  };

  // ============================================================================
  // LOAD MOCK DATA FOR TAB 1
  // ============================================================================

  useEffect(() => {
    if (activeTab === 0) {
      loadMockData(selectedDomain);
    }
  }, [activeTab, selectedDomain]);

  const loadMockData = (domain) => {
    const data = mockData[domain];
    if (data) {
      const domainConfig = domains[domain];
      const nodes = data.nodes.map(node => ({
        ...node,
        color: domainConfig.entityColors[node.type] || '#6B7280'
      }));
      const links = data.links.map(link => ({
        ...link,
        color: domainConfig.relationshipColors[link.type] || '#6B7280'
      }));
      setGraphData({ nodes, links });
      setPaperSources([data.title]);
      setError('');
    }
  };

  // ============================================================================
  // PUBMED API INTEGRATION
  // ============================================================================

  const searchPubMed = async (query) => {
    setLoadingStatus('🔍 Searching PubMed for UW Madison papers...');

    const pubmedQuery = `${query} AND University of Wisconsin-Madison[Affiliation]`;
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=5&retmode=json`;

    try {
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      const pmids = searchData.esearchresult?.idlist || [];

      if (pmids.length === 0) {
        return { papers: [], abstracts: '' };
      }

      setLoadingStatus(`📚 Found ${pmids.length} papers from UW researchers`);
      setLoadingStatus('📄 Fetching abstracts...');

      // Fetch abstracts
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
      const abstractsResponse = await fetch(fetchUrl);
      const abstractsXml = await abstractsResponse.text();

      // Parse XML to extract paper info
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(abstractsXml, 'text/xml');
      const articles = xmlDoc.getElementsByTagName('PubmedArticle');

      const papers = [];
      let combinedAbstracts = '';

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const titleNode = article.getElementsByTagName('ArticleTitle')[0];
        const abstractNode = article.getElementsByTagName('AbstractText')[0];

        const title = titleNode ? titleNode.textContent : 'Untitled';
        const abstract = abstractNode ? abstractNode.textContent : '';

        papers.push(title);
        if (abstract) {
          combinedAbstracts += `\n\nPaper: ${title}\nAbstract: ${abstract}`;
        }
      }

      return { papers, abstracts: combinedAbstracts };
    } catch (error) {
      console.error('PubMed API error:', error);
      return { papers: [], abstracts: '' };
    }
  };

  // ============================================================================
  // GOOGLE SCHOLAR API (via SerpAPI)
  // ============================================================================

  const searchGoogleScholar = async (query) => {
    if (!serpApiKey) {
      return { papers: [], abstracts: '' };
    }

    setLoadingStatus('🔍 Supplementing with Google Scholar...');

    const scholarQuery = `${query} author:university of wisconsin madison`;
    const scholarUrl = `https://serpapi.com/search?engine=google_scholar&q=${encodeURIComponent(scholarQuery)}&api_key=${serpApiKey}`;

    try {
      const response = await fetch(scholarUrl);
      const data = await response.json();

      const papers = [];
      let abstracts = '';

      if (data.organic_results) {
        for (const result of data.organic_results.slice(0, 3)) {
          papers.push(result.title);
          abstracts += `\n\nPaper: ${result.title}\nSnippet: ${result.snippet || ''}`;
        }
      }

      return { papers, abstracts };
    } catch (error) {
      console.error('Google Scholar API error:', error);
      return { papers: [], abstracts: '' };
    }
  };

  // ============================================================================
  // CLAUDE API - ENTITY EXTRACTION
  // ============================================================================

  const extractEntitiesWithClaude = async (combinedAbstracts, domain, papers) => {
    if (!claudeApiKey) {
      setError('Claude API key required for entity extraction. Please add it in Settings.');
      return null;
    }

    setLoadingStatus('🧬 Extracting entities with Claude AI...');

    const domainConfig = domains[domain];

    const prompt = `Extract from these ${domainConfig.name} research papers by UW Madison researchers:

${combinedAbstracts}

Extract:
1. ENTITIES: ${domainConfig.entityTypes.join(', ')}
2. RELATIONSHIPS: ${domainConfig.relationshipTypes.join(', ')}

Each relationship needs: entity1, entity2, type, confidence (0-1), evidence (brief quote), source (paper title)

Return ONLY valid JSON (no markdown code blocks):
{
  "papers": ${JSON.stringify(papers)},
  "entities": [{"name": "...", "type": "..."}],
  "relationships": [{
    "entity1": "...",
    "entity2": "...",
    "type": "...",
    "confidence": 0.9,
    "evidence": "quote from paper",
    "source": "paper title"
  }]
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
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
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Claude API request failed');
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse JSON from response (handle potential markdown wrapping)
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      return JSON.parse(jsonStr.trim());
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  };

  // ============================================================================
  // SEARCH PAPERS (TAB 2)
  // ============================================================================

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError('');
    setHypotheses([]);
    setShowHypotheses(false);

    try {
      // Search PubMed
      const pubmedResult = await searchPubMed(searchQuery);

      // If not enough results, supplement with Google Scholar
      let scholarResult = { papers: [], abstracts: '' };
      if (pubmedResult.papers.length < 3 && serpApiKey) {
        scholarResult = await searchGoogleScholar(searchQuery);
      }

      // Combine results
      const allPapers = [...pubmedResult.papers, ...scholarResult.papers];
      const combinedAbstracts = pubmedResult.abstracts + scholarResult.abstracts;

      if (allPapers.length === 0) {
        setError('No papers found. Try a different search query or add SerpAPI key for Google Scholar.');
        setIsLoading(false);
        return;
      }

      setPaperSources(allPapers);

      // Extract entities with Claude
      const extractedData = await extractEntitiesWithClaude(combinedAbstracts, selectedDomain, allPapers);

      if (!extractedData) {
        setIsLoading(false);
        return;
      }

      setLoadingStatus('🔗 Building knowledge graph...');

      // Build graph data
      const domainConfig = domains[selectedDomain];
      const nodes = extractedData.entities.map(entity => ({
        id: entity.name,
        label: entity.name,
        type: entity.type,
        color: domainConfig.entityColors[entity.type] || '#6B7280'
      }));

      const links = extractedData.relationships.map(rel => ({
        source: rel.entity1,
        target: rel.entity2,
        type: rel.type,
        confidence: rel.confidence,
        evidence: rel.evidence,
        source_paper: rel.source,
        color: domainConfig.relationshipColors[rel.type] || '#6B7280'
      }));

      setGraphData({ nodes, links });
      setLoadingStatus('✅ Graph ready!');

    } catch (error) {
      console.error('Search error:', error);
      setError(`Error: ${error.message}. Would you like to use example data instead?`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // PDF UPLOAD AND PROCESSING (TAB 3)
  // ============================================================================

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).slice(0, 3);
    setUploadedFiles(files);
  };

  const processPDFs = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one PDF file');
      return;
    }

    if (!claudeApiKey) {
      setError('Claude API key required for PDF processing. Please add it in Settings.');
      return;
    }

    setIsLoading(true);
    setError('');
    setHypotheses([]);
    setShowHypotheses(false);

    try {
      const domainConfig = domains[selectedDomain];
      const allEntities = [];
      const allRelationships = [];
      const paperTitles = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setLoadingStatus(`📄 Processing PDF ${i + 1}/${uploadedFiles.length}: ${file.name}...`);

        // Convert to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        setLoadingStatus(`🧬 Extracting entities from ${file.name}...`);

        const prompt = `Extract from this ${domainConfig.name} paper:
1. ENTITIES: ${domainConfig.entityTypes.join(', ')}
2. RELATIONSHIPS: ${domainConfig.relationshipTypes.join(', ')}

Return ONLY valid JSON (no markdown):
{
  "title": "paper title",
  "entities": [{"name": "...", "type": "..."}],
  "relationships": [{
    "entity1": "...",
    "entity2": "...",
    "type": "...",
    "confidence": 0.9,
    "evidence": "quote",
    "page": 1
  }]
}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
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
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'PDF processing failed');
        }

        const data = await response.json();
        const content = data.content[0].text;

        // Parse JSON
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }

        const extracted = JSON.parse(jsonStr.trim());

        paperTitles.push(extracted.title || file.name);
        allEntities.push(...extracted.entities);
        allRelationships.push(...extracted.relationships.map(rel => ({
          ...rel,
          source_paper: extracted.title || file.name
        })));
      }

      setLoadingStatus('🔗 Building knowledge graph...');

      // Build graph data
      const nodes = allEntities.map(entity => ({
        id: entity.name,
        label: entity.name,
        type: entity.type,
        color: domainConfig.entityColors[entity.type] || '#6B7280'
      }));

      // Remove duplicate nodes
      const uniqueNodes = nodes.filter((node, index, self) =>
        index === self.findIndex(n => n.id === node.id)
      );

      const links = allRelationships.map(rel => ({
        source: rel.entity1,
        target: rel.entity2,
        type: rel.type,
        confidence: rel.confidence,
        evidence: rel.evidence,
        source_paper: rel.source_paper,
        page: rel.page,
        color: domainConfig.relationshipColors[rel.type] || '#6B7280'
      }));

      setGraphData({ nodes: uniqueNodes, links });
      setPaperSources(paperTitles);
      setLoadingStatus('✅ Graph ready!');

    } catch (error) {
      console.error('PDF processing error:', error);
      setError(`Error processing PDFs: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // HYPOTHESIS GENERATION
  // ============================================================================

  const generateHypotheses = async () => {
    if (graphData.nodes.length === 0) {
      setError('Please load or create a knowledge graph first');
      return;
    }

    if (!claudeApiKey) {
      setError('Claude API key required for hypothesis generation. Please add it in Settings.');
      return;
    }

    setIsLoading(true);
    setLoadingStatus('🔬 Generating research hypotheses...');

    try {
      const domainConfig = domains[selectedDomain];

      const prompt = `Analyze this ${domainConfig.name} knowledge graph from UW Madison research:

ENTITIES: ${JSON.stringify(graphData.nodes.map(n => ({ name: n.id, type: n.type })))}
RELATIONSHIPS: ${JSON.stringify(graphData.links.map(l => ({
  from: l.source.id || l.source,
  to: l.target.id || l.target,
  type: l.type,
  confidence: l.confidence
})))}

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

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Hypothesis generation failed');
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse JSON
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const result = JSON.parse(jsonStr.trim());
      setHypotheses(result.hypotheses);
      setShowHypotheses(true);
      setLoadingStatus('');

    } catch (error) {
      console.error('Hypothesis generation error:', error);
      setError(`Error generating hypotheses: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // USE EXAMPLE DATA (FALLBACK)
  // ============================================================================

  const useExampleData = () => {
    loadMockData(selectedDomain);
    setError('');
  };

  // ============================================================================
  // GRAPH EVENT HANDLERS
  // ============================================================================

  const handleLinkClick = useCallback((link) => {
    setSelectedEdge(link);
    setShowModal(true);
  }, []);

  const handleNodeClick = useCallback((node) => {
    // Highlight connected edges
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  const domainConfig = domains[selectedDomain];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4" style={{ borderBottomColor: '#C5050C' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#C5050C' }}>
                🦡 Badger Research Graph
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                AI-Powered Cross-Disciplinary Research • UW-Madison
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          {[
            { icon: '🦡', label: 'UW Research' },
            { icon: '🔍', label: 'Search Papers' },
            { icon: '📄', label: 'Upload Papers' }
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setError('');
                setHypotheses([]);
                setShowHypotheses(false);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === idx
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Domain Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Domain
          </label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {Object.entries(domains).map(([key, domain]) => (
              <option key={key} value={key}>
                {domain.icon} {domain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Tab 1: UW Research (Mock Data) */}
          {activeTab === 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {domainConfig.icon} {mockData[selectedDomain]?.title}
              </h2>
              <p className="text-gray-600 mb-4">
                Pre-loaded example data showcasing UW Madison research connections
              </p>
            </div>
          )}

          {/* Tab 2: Search Papers */}
          {activeTab === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                🔍 Search UW Madison Papers
              </h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g., BRCA1 breast cancer, transformer attention..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-6 py-2 text-white rounded-lg font-medium disabled:opacity-50"
                  style={{ backgroundColor: '#C5050C' }}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Searches PubMed for UW Madison-affiliated papers. Add SerpAPI key in Settings for Google Scholar results.
              </p>
            </div>
          )}

          {/* Tab 3: Upload Papers */}
          {activeTab === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                📄 Upload Research Papers
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer"
                >
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-gray-600">
                    Click to upload PDFs (max 3 files)
                  </p>
                </label>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Selected files:</p>
                  <ul className="text-sm text-gray-600">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>📄 {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={processPDFs}
                disabled={isLoading || uploadedFiles.length === 0}
                className="px-6 py-2 text-white rounded-lg font-medium disabled:opacity-50"
                style={{ backgroundColor: '#C5050C' }}
              >
                {isLoading ? 'Processing...' : 'Process PDFs'}
              </button>
            </div>
          )}
        </div>

        {/* Loading Status */}
        {loadingStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{loadingStatus}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 mb-2">{error}</p>
            {activeTab !== 0 && (
              <button
                onClick={useExampleData}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Use example data instead
              </button>
            )}
          </div>
        )}

        {/* Paper Sources */}
        {paperSources.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">📚 Sources:</h3>
            <ul className="text-sm text-gray-600">
              {paperSources.map((paper, idx) => (
                <li key={idx}>• {paper}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Graph Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Knowledge Graph</h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Entities: </span>
              {Object.entries(domainConfig.entityColors).map(([type, color]) => (
                <span key={type} className="inline-flex items-center mr-3">
                  <span
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: color }}
                  />
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Relationships: </span>
              {Object.entries(domainConfig.relationshipColors).map(([type, color]) => (
                <span key={type} className="inline-flex items-center mr-3">
                  <span
                    className="w-3 h-3 mr-1"
                    style={{ backgroundColor: color }}
                  />
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Graph */}
          <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {graphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel={node => `${node.label} (${node.type})`}
                nodeColor={node => node.color}
                nodeRelSize={6}
                linkColor={link => link.color}
                linkWidth={2}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.2}
                onNodeClick={handleNodeClick}
                onLinkClick={handleLinkClick}
                linkLabel={link => `${link.type} (${(link.confidence * 100).toFixed(0)}%)`}
                cooldownTicks={100}
                onEngineStop={() => graphRef.current?.zoomToFit(400)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {isLoading ? 'Loading graph...' : 'No graph data. Search for papers or upload PDFs to build a knowledge graph.'}
              </div>
            )}
          </div>
        </div>

        {/* Generate Hypotheses Button */}
        {graphData.nodes.length > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={generateHypotheses}
              disabled={isLoading}
              className="px-8 py-3 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
              style={{ backgroundColor: '#C5050C' }}
            >
              🔬 Generate Research Hypotheses
            </button>
          </div>
        )}

        {/* Hypotheses Display */}
        {showHypotheses && hypotheses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">🔬 Generated Research Hypotheses</h3>
            {hypotheses.map((hypothesis, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold">{hypothesis.title}</h4>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: hypothesis.confidence > 0.8 ? '#10B981' :
                                      hypothesis.confidence > 0.6 ? '#F59E0B' : '#EF4444'
                    }}
                  >
                    {(hypothesis.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{hypothesis.reasoning}</p>

                {hypothesis.supporting_evidence && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Supporting Evidence:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {hypothesis.supporting_evidence.map((evidence, eIdx) => (
                        <li key={eIdx}>
                          • {evidence.relationship} ({(evidence.confidence * 100).toFixed(0)}%) - {evidence.source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hypothesis.suggested_experiments && (
                  <div>
                    <h5 className="font-medium mb-2">Suggested Experiments:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {hypothesis.suggested_experiments.map((exp, eIdx) => (
                        <li key={eIdx}>• {exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edge Detail Modal */}
      {showModal && selectedEdge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Relationship Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-medium">Type: </span>
                <span
                  className="px-2 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: selectedEdge.color }}
                >
                  {selectedEdge.type}
                </span>
              </div>

              <div>
                <span className="font-medium">Connection: </span>
                <span className="text-gray-700">
                  {selectedEdge.source.id || selectedEdge.source} → {selectedEdge.target.id || selectedEdge.target}
                </span>
              </div>

              <div>
                <span className="font-medium">Confidence: </span>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${selectedEdge.confidence * 100}%`,
                        backgroundColor: selectedEdge.confidence > 0.8 ? '#10B981' :
                                        selectedEdge.confidence > 0.6 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {(selectedEdge.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {selectedEdge.evidence && (
                <div>
                  <span className="font-medium">Evidence: </span>
                  <p className="text-gray-700 text-sm italic mt-1">
                    "{selectedEdge.evidence}"
                  </p>
                </div>
              )}

              {selectedEdge.source_paper && (
                <div>
                  <span className="font-medium">Source: </span>
                  <span className="text-gray-700 text-sm">
                    {selectedEdge.source_paper}
                  </span>
                </div>
              )}

              {selectedEdge.page && (
                <div>
                  <span className="font-medium">Page: </span>
                  <span className="text-gray-700">{selectedEdge.page}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">⚙️ Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claude API Key (Required)
                </label>
                <input
                  type="password"
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your key from console.anthropic.com
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SerpAPI Key (Optional)
                </label>
                <input
                  type="password"
                  value={serpApiKey}
                  onChange={(e) => setSerpApiKey(e.target.value)}
                  placeholder="Enter SerpAPI key..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PubMed works without key. Google Scholar needs free SerpAPI key from serpapi.com
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 text-white rounded-lg font-medium"
                style={{ backgroundColor: '#C5050C' }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgerResearchGraph;
