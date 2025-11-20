import React, { useState, useEffect, useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

// Domain Configurations
const DOMAINS = {
  biomedicine: {
    id: 'biomedicine',
    name: 'Biomedicine',
    icon: '🧬',
    entityTypes: {
      gene: { color: '#3B82F6', label: 'Gene' },
      disease: { color: '#EF4444', label: 'Disease' },
      drug: { color: '#22C55E', label: 'Drug' },
      protein: { color: '#EAB308', label: 'Protein' }
    },
    relationshipTypes: {
      CAUSES: { color: '#F97316', label: 'Causes' },
      TREATS: { color: '#22C55E', label: 'Treats' },
      INHIBITS: { color: '#EF4444', label: 'Inhibits' },
      ACTIVATES: { color: '#A855F7', label: 'Activates' },
      ASSOCIATES_WITH: { color: '#3B82F6', label: 'Associates With' },
      BIOMARKER_FOR: { color: '#EC4899', label: 'Biomarker For' }
    },
    exampleTitle: 'Cancer Immunotherapy - Carbone Cancer Center',
    examplePapers: [
      { title: 'PD-1 Blockade in Melanoma', authors: 'Chen et al.', year: 2023 },
      { title: 'CTLA-4 Inhibition Mechanisms', authors: 'Johnson et al.', year: 2022 },
      { title: 'CD8+ T-cell Response in Cancer', authors: 'Smith et al.', year: 2023 }
    ],
    nodes: [
      { id: 'PD-1', type: 'protein', label: 'PD-1' },
      { id: 'PD-L1', type: 'protein', label: 'PD-L1' },
      { id: 'CTLA-4', type: 'protein', label: 'CTLA-4' },
      { id: 'Melanoma', type: 'disease', label: 'Melanoma' },
      { id: 'Lung Cancer', type: 'disease', label: 'Lung Cancer' },
      { id: 'Pembrolizumab', type: 'drug', label: 'Pembrolizumab' },
      { id: 'Nivolumab', type: 'drug', label: 'Nivolumab' },
      { id: 'Ipilimumab', type: 'drug', label: 'Ipilimumab' },
      { id: 'CD8', type: 'protein', label: 'CD8' },
      { id: 'T-cell Receptor', type: 'protein', label: 'T-cell Receptor' },
      { id: 'IFN-gamma', type: 'protein', label: 'IFN-gamma' }
    ],
    edges: [
      { source: 'Pembrolizumab', target: 'PD-1', type: 'INHIBITS', confidence: 0.96, evidence: 'Pembrolizumab binds to PD-1 receptor with high affinity, blocking the PD-1/PD-L1 interaction.', page: 4 },
      { source: 'PD-1', target: 'CD8', type: 'INHIBITS', confidence: 0.94, evidence: 'PD-1 engagement leads to inhibition of T-cell receptor signaling and reduced CD8+ T-cell function.', page: 7 },
      { source: 'Pembrolizumab', target: 'Melanoma', type: 'TREATS', confidence: 0.91, evidence: 'Clinical trials demonstrated significant tumor regression in advanced melanoma patients.', page: 12 },
      { source: 'CD8', target: 'Melanoma', type: 'TREATS', confidence: 0.82, evidence: 'CD8+ cytotoxic T-cells directly kill melanoma cells through perforin-granzyme pathway.', page: 15 },
      { source: 'PD-L1', target: 'Melanoma', type: 'BIOMARKER_FOR', confidence: 0.87, evidence: 'High PD-L1 expression correlates with response to checkpoint inhibitor therapy.', page: 9 },
      { source: 'Nivolumab', target: 'Lung Cancer', type: 'TREATS', confidence: 0.88, evidence: 'Nivolumab showed improved overall survival in non-small cell lung cancer.', page: 18 },
      { source: 'CTLA-4', target: 'T-cell Receptor', type: 'INHIBITS', confidence: 0.89, evidence: 'CTLA-4 competes with CD28 for B7 ligands, dampening T-cell activation.', page: 6 },
      { source: 'Ipilimumab', target: 'CTLA-4', type: 'INHIBITS', confidence: 0.93, evidence: 'Ipilimumab blocks CTLA-4, enhancing anti-tumor T-cell responses.', page: 8 },
      { source: 'IFN-gamma', target: 'PD-L1', type: 'ACTIVATES', confidence: 0.85, evidence: 'IFN-gamma upregulates PD-L1 expression in tumor microenvironment.', page: 11 }
    ],
    searchPlaceholder: 'e.g., BRCA1 cancer treatment, CAR-T cell therapy...'
  },

  computerScience: {
    id: 'computerScience',
    name: 'Computer Science',
    icon: '💻',
    entityTypes: {
      algorithm: { color: '#3B82F6', label: 'Algorithm' },
      problem: { color: '#EF4444', label: 'Problem' },
      technique: { color: '#22C55E', label: 'Technique' },
      system: { color: '#EAB308', label: 'System' },
      dataset: { color: '#A855F7', label: 'Dataset' }
    },
    relationshipTypes: {
      SOLVES: { color: '#22C55E', label: 'Solves' },
      OPTIMIZES: { color: '#A855F7', label: 'Optimizes' },
      OUTPERFORMS: { color: '#F97316', label: 'Outperforms' },
      REQUIRES: { color: '#3B82F6', label: 'Requires' },
      ENABLES: { color: '#14B8A6', label: 'Enables' },
      EVALUATES_ON: { color: '#EC4899', label: 'Evaluates On' }
    },
    exampleTitle: 'AI/ML Research - UW CS Department',
    examplePapers: [
      { title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017 },
      { title: 'BERT: Pre-training Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2019 },
      { title: 'Vision Transformer for Image Recognition', authors: 'Dosovitskiy et al.', year: 2021 }
    ],
    nodes: [
      { id: 'Transformer', type: 'algorithm', label: 'Transformer' },
      { id: 'BERT', type: 'system', label: 'BERT' },
      { id: 'GPT', type: 'system', label: 'GPT' },
      { id: 'Attention Mechanism', type: 'technique', label: 'Attention Mechanism' },
      { id: 'Image Classification', type: 'problem', label: 'Image Classification' },
      { id: 'NLP', type: 'problem', label: 'NLP' },
      { id: 'ResNet', type: 'algorithm', label: 'ResNet' },
      { id: 'ImageNet', type: 'dataset', label: 'ImageNet' },
      { id: 'Transfer Learning', type: 'technique', label: 'Transfer Learning' },
      { id: 'Vision Transformer', type: 'algorithm', label: 'Vision Transformer' },
      { id: 'LSTM', type: 'algorithm', label: 'LSTM' },
      { id: 'Seq2Seq', type: 'algorithm', label: 'Seq2Seq' }
    ],
    edges: [
      { source: 'Attention Mechanism', target: 'Transformer', type: 'ENABLES', confidence: 0.95, evidence: 'Self-attention mechanism is the core component that enables the Transformer architecture.', page: 3 },
      { source: 'Transformer', target: 'NLP', type: 'SOLVES', confidence: 0.92, evidence: 'Transformers achieve state-of-the-art results on multiple NLP benchmarks.', page: 8 },
      { source: 'BERT', target: 'LSTM', type: 'OUTPERFORMS', confidence: 0.89, evidence: 'BERT outperforms LSTM-based models on GLUE benchmark by significant margins.', page: 12 },
      { source: 'Transfer Learning', target: 'Image Classification', type: 'OPTIMIZES', confidence: 0.88, evidence: 'Pre-trained models significantly reduce training time and improve accuracy.', page: 15 },
      { source: 'Vision Transformer', target: 'ImageNet', type: 'EVALUATES_ON', confidence: 0.91, evidence: 'ViT achieves 88.55% top-1 accuracy on ImageNet when pre-trained on JFT-300M.', page: 7 },
      { source: 'ResNet', target: 'Transfer Learning', type: 'REQUIRES', confidence: 0.85, evidence: 'ResNet features are commonly used as initialization for transfer learning tasks.', page: 10 },
      { source: 'GPT', target: 'Transformer', type: 'REQUIRES', confidence: 0.94, evidence: 'GPT uses decoder-only Transformer architecture for language modeling.', page: 4 },
      { source: 'Seq2Seq', target: 'NLP', type: 'SOLVES', confidence: 0.83, evidence: 'Sequence-to-sequence models enable machine translation and summarization.', page: 6 }
    ],
    searchPlaceholder: 'e.g., transformer attention mechanisms, graph neural networks...'
  },

  economics: {
    id: 'economics',
    name: 'Economics',
    icon: '📊',
    entityTypes: {
      policy: { color: '#3B82F6', label: 'Policy' },
      economic_indicator: { color: '#EF4444', label: 'Economic Indicator' },
      market: { color: '#22C55E', label: 'Market' },
      theory: { color: '#EAB308', label: 'Theory' },
      intervention: { color: '#A855F7', label: 'Intervention' }
    },
    relationshipTypes: {
      INFLUENCES: { color: '#F97316', label: 'Influences' },
      CORRELATES_WITH: { color: '#3B82F6', label: 'Correlates With' },
      CAUSES: { color: '#EF4444', label: 'Causes' },
      MITIGATES: { color: '#22C55E', label: 'Mitigates' },
      PREDICTS: { color: '#A855F7', label: 'Predicts' },
      RESPONDS_TO: { color: '#EC4899', label: 'Responds To' }
    },
    exampleTitle: 'Labor Economics Research - UW Economics',
    examplePapers: [
      { title: 'Minimum Wage Effects on Employment', authors: 'Card & Krueger', year: 2020 },
      { title: 'Job Training Program Effectiveness', authors: 'Heckman et al.', year: 2021 },
      { title: 'Income Inequality and Economic Growth', authors: 'Piketty et al.', year: 2022 }
    ],
    nodes: [
      { id: 'Minimum Wage', type: 'policy', label: 'Minimum Wage' },
      { id: 'Employment Rate', type: 'economic_indicator', label: 'Employment Rate' },
      { id: 'Job Training Programs', type: 'intervention', label: 'Job Training Programs' },
      { id: 'Income Inequality', type: 'economic_indicator', label: 'Income Inequality' },
      { id: 'Unemployment', type: 'economic_indicator', label: 'Unemployment' },
      { id: 'GDP Growth', type: 'economic_indicator', label: 'GDP Growth' },
      { id: 'Wage Growth', type: 'economic_indicator', label: 'Wage Growth' },
      { id: 'Labor Market', type: 'market', label: 'Labor Market' },
      { id: 'Inflation', type: 'economic_indicator', label: 'Inflation' },
      { id: 'Productivity', type: 'economic_indicator', label: 'Productivity' }
    ],
    edges: [
      { source: 'Minimum Wage', target: 'Employment Rate', type: 'INFLUENCES', confidence: 0.78, evidence: 'Moderate minimum wage increases show minimal negative employment effects in recent studies.', page: 14 },
      { source: 'Job Training Programs', target: 'Unemployment', type: 'MITIGATES', confidence: 0.85, evidence: 'Targeted job training reduces long-term unemployment by 15-20% on average.', page: 8 },
      { source: 'GDP Growth', target: 'Wage Growth', type: 'CORRELATES_WITH', confidence: 0.91, evidence: 'Historical data shows strong correlation between productivity growth and wage increases.', page: 22 },
      { source: 'Productivity', target: 'Wage Growth', type: 'PREDICTS', confidence: 0.83, evidence: 'Productivity gains are the primary driver of sustainable wage growth.', page: 18 },
      { source: 'Inflation', target: 'GDP Growth', type: 'RESPONDS_TO', confidence: 0.79, evidence: 'Inflation expectations adjust to changes in economic growth with a lag.', page: 11 },
      { source: 'Income Inequality', target: 'Labor Market', type: 'CAUSES', confidence: 0.76, evidence: 'Rising inequality leads to labor market inefficiencies and reduced mobility.', page: 25 },
      { source: 'Minimum Wage', target: 'Wage Growth', type: 'INFLUENCES', confidence: 0.81, evidence: 'Minimum wage increases have spillover effects on wages above the minimum.', page: 16 },
      { source: 'Job Training Programs', target: 'Productivity', type: 'INFLUENCES', confidence: 0.84, evidence: 'Skill development programs increase worker productivity by 12% on average.', page: 9 }
    ],
    searchPlaceholder: 'e.g., inflation monetary policy, labor market automation...'
  },

  politicalScience: {
    id: 'politicalScience',
    name: 'Political Science',
    icon: '🏛️',
    entityTypes: {
      policy: { color: '#3B82F6', label: 'Policy' },
      actor: { color: '#EF4444', label: 'Actor' },
      institution: { color: '#22C55E', label: 'Institution' },
      outcome: { color: '#EAB308', label: 'Outcome' },
      event: { color: '#A855F7', label: 'Event' }
    },
    relationshipTypes: {
      ADVOCATES_FOR: { color: '#22C55E', label: 'Advocates For' },
      OPPOSES: { color: '#EF4444', label: 'Opposes' },
      IMPLEMENTS: { color: '#3B82F6', label: 'Implements' },
      LEADS_TO: { color: '#F97316', label: 'Leads To' },
      INFLUENCES: { color: '#A855F7', label: 'Influences' },
      RESULTS_FROM: { color: '#EC4899', label: 'Results From' }
    },
    exampleTitle: 'Political Behavior Research - UW Political Science',
    examplePapers: [
      { title: 'Social Media and Political Polarization', authors: 'Bail et al.', year: 2021 },
      { title: 'Campaign Finance Effects on Elections', authors: 'Lessig et al.', year: 2020 },
      { title: 'Misinformation in Democratic Systems', authors: 'Tucker et al.', year: 2022 }
    ],
    nodes: [
      { id: 'Social Media', type: 'event', label: 'Social Media' },
      { id: 'Political Polarization', type: 'outcome', label: 'Political Polarization' },
      { id: 'Voter Turnout', type: 'outcome', label: 'Voter Turnout' },
      { id: 'Campaign Finance', type: 'policy', label: 'Campaign Finance' },
      { id: 'Democratic Party', type: 'actor', label: 'Democratic Party' },
      { id: 'Republican Party', type: 'actor', label: 'Republican Party' },
      { id: 'Electoral College', type: 'institution', label: 'Electoral College' },
      { id: 'Misinformation', type: 'event', label: 'Misinformation' },
      { id: 'Legislative Gridlock', type: 'outcome', label: 'Legislative Gridlock' },
      { id: 'Public Opinion', type: 'outcome', label: 'Public Opinion' }
    ],
    edges: [
      { source: 'Social Media', target: 'Political Polarization', type: 'INFLUENCES', confidence: 0.82, evidence: 'Algorithm-driven content amplifies partisan content and increases affective polarization.', page: 8 },
      { source: 'Campaign Finance', target: 'Voter Turnout', type: 'INFLUENCES', confidence: 0.76, evidence: 'Campaign spending correlates with voter mobilization efforts and turnout rates.', page: 15 },
      { source: 'Misinformation', target: 'Political Polarization', type: 'LEADS_TO', confidence: 0.88, evidence: 'False information spreads faster and creates echo chambers that deepen divisions.', page: 12 },
      { source: 'Electoral College', target: 'Voter Turnout', type: 'INFLUENCES', confidence: 0.73, evidence: 'Winner-take-all system reduces turnout in non-competitive states.', page: 19 },
      { source: 'Political Polarization', target: 'Legislative Gridlock', type: 'LEADS_TO', confidence: 0.84, evidence: 'Increased partisan polarization reduces bipartisan cooperation on legislation.', page: 22 },
      { source: 'Public Opinion', target: 'Democratic Party', type: 'INFLUENCES', confidence: 0.79, evidence: 'Shifts in public opinion on key issues shape party platform positions.', page: 11 },
      { source: 'Public Opinion', target: 'Republican Party', type: 'INFLUENCES', confidence: 0.77, evidence: 'Electoral pressure drives party adaptation to constituent preferences.', page: 13 },
      { source: 'Social Media', target: 'Misinformation', type: 'LEADS_TO', confidence: 0.86, evidence: 'Platform design features enable rapid spread of unverified claims.', page: 7 }
    ],
    searchPlaceholder: 'e.g., voter behavior elections, policy diffusion states...'
  },

  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '🔢',
    entityTypes: {
      theorem: { color: '#3B82F6', label: 'Theorem' },
      conjecture: { color: '#EF4444', label: 'Conjecture' },
      method: { color: '#22C55E', label: 'Method' },
      structure: { color: '#EAB308', label: 'Structure' },
      application: { color: '#A855F7', label: 'Application' }
    },
    relationshipTypes: {
      PROVES: { color: '#22C55E', label: 'Proves' },
      GENERALIZES: { color: '#3B82F6', label: 'Generalizes' },
      APPLIES_TO: { color: '#F97316', label: 'Applies To' },
      BUILDS_ON: { color: '#A855F7', label: 'Builds On' },
      CONTRADICTS: { color: '#EF4444', label: 'Contradicts' },
      IMPLIES: { color: '#14B8A6', label: 'Implies' }
    },
    exampleTitle: 'Algebraic Topology Research - UW Mathematics',
    examplePapers: [
      { title: 'Homotopy Theory and Higher Categories', authors: 'Lurie et al.', year: 2021 },
      { title: 'Categorical Methods in Algebra', authors: 'Riehl et al.', year: 2020 },
      { title: 'Simplicial Methods in Algebraic Topology', authors: 'Goerss et al.', year: 2019 }
    ],
    nodes: [
      { id: 'Homotopy Theory', type: 'method', label: 'Homotopy Theory' },
      { id: 'Fundamental Group', type: 'structure', label: 'Fundamental Group' },
      { id: 'Category Theory', type: 'method', label: 'Category Theory' },
      { id: 'Homology', type: 'method', label: 'Homology' },
      { id: 'Cohomology', type: 'method', label: 'Cohomology' },
      { id: 'Manifold', type: 'structure', label: 'Manifold' },
      { id: 'Euler Characteristic', type: 'theorem', label: 'Euler Characteristic' },
      { id: 'Topological Space', type: 'structure', label: 'Topological Space' },
      { id: 'Algebraic Structure', type: 'structure', label: 'Algebraic Structure' },
      { id: 'Simplicial Complex', type: 'structure', label: 'Simplicial Complex' }
    ],
    edges: [
      { source: 'Category Theory', target: 'Homotopy Theory', type: 'GENERALIZES', confidence: 0.89, evidence: 'Higher category theory provides a natural framework for homotopy-theoretic constructions.', page: 45 },
      { source: 'Homology', target: 'Fundamental Group', type: 'BUILDS_ON', confidence: 0.94, evidence: 'First homology group is the abelianization of the fundamental group.', page: 78 },
      { source: 'Euler Characteristic', target: 'Manifold', type: 'APPLIES_TO', confidence: 0.96, evidence: 'Euler characteristic is a topological invariant computable for all compact manifolds.', page: 23 },
      { source: 'Cohomology', target: 'Homology', type: 'GENERALIZES', confidence: 0.92, evidence: 'Cohomology is the dual theory to homology with additional ring structure.', page: 89 },
      { source: 'Homotopy Theory', target: 'Topological Space', type: 'PROVES', confidence: 0.88, evidence: 'Homotopy groups classify topological spaces up to weak equivalence.', page: 34 },
      { source: 'Simplicial Complex', target: 'Topological Space', type: 'BUILDS_ON', confidence: 0.86, evidence: 'Simplicial complexes provide combinatorial models for topological spaces.', page: 56 },
      { source: 'Category Theory', target: 'Algebraic Structure', type: 'GENERALIZES', confidence: 0.91, evidence: 'Categories unify various algebraic structures through universal properties.', page: 12 },
      { source: 'Homology', target: 'Simplicial Complex', type: 'APPLIES_TO', confidence: 0.93, evidence: 'Simplicial homology computes topological invariants combinatorially.', page: 67 }
    ],
    searchPlaceholder: 'e.g., algebraic topology K-theory, number theory primes...'
  }
};

// Main App Component
export default function BadgerResearchGraph() {
  const [activeTab, setActiveTab] = useState('uw-research');
  const [selectedDomain, setSelectedDomain] = useState('biomedicine');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hypotheses, setHypotheses] = useState([]);
  const [showHypotheses, setShowHypotheses] = useState(false);
  const [isGeneratingHypotheses, setIsGeneratingHypotheses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const graphRef = useRef();
  const fileInputRef = useRef();

  const currentDomain = DOMAINS[selectedDomain];

  // Convert domain data to graph format
  const convertToGraphData = useCallback((nodes, edges, domain) => {
    const domainConfig = DOMAINS[domain];

    const graphNodes = nodes.map(node => ({
      id: node.id,
      label: node.label,
      type: node.type,
      color: domainConfig.entityTypes[node.type]?.color || '#6B7280',
      val: edges.filter(e => e.source === node.id || e.target === node.id).length + 1
    }));

    const graphLinks = edges.map((edge, idx) => ({
      id: `edge-${idx}`,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      color: domainConfig.relationshipTypes[edge.type]?.color || '#6B7280',
      confidence: edge.confidence,
      evidence: edge.evidence,
      page: edge.page
    }));

    return { nodes: graphNodes, links: graphLinks };
  }, []);

  // Load example data when domain changes (for UW Research tab)
  useEffect(() => {
    if (activeTab === 'uw-research') {
      const domain = DOMAINS[selectedDomain];
      const data = convertToGraphData(domain.nodes, domain.edges, selectedDomain);
      setGraphData(data);
      setShowHypotheses(false);
      setHypotheses([]);
    }
  }, [selectedDomain, activeTab, convertToGraphData]);

  // Reset when changing tabs
  useEffect(() => {
    setShowHypotheses(false);
    setHypotheses([]);
    setSearchResults(null);
    setUploadResults(null);
    setSearchStatus('');
    setUploadedFiles([]);

    if (activeTab === 'uw-research') {
      const domain = DOMAINS[selectedDomain];
      const data = convertToGraphData(domain.nodes, domain.edges, selectedDomain);
      setGraphData(data);
    } else {
      setGraphData({ nodes: [], links: [] });
    }
  }, [activeTab, convertToGraphData, selectedDomain]);

  // Handle edge click
  const handleLinkClick = useCallback((link) => {
    setSelectedEdge(link);
    setShowModal(true);
  }, []);

  // Generate hypotheses (mock implementation)
  const generateHypotheses = async () => {
    setIsGeneratingHypotheses(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const domainHypotheses = {
      biomedicine: [
        {
          title: 'Combined PD-1/CTLA-4 Blockade Synergy',
          confidence: 0.87,
          reasoning: 'Based on the graph showing both PD-1 and CTLA-4 as independent inhibitory checkpoints, combination therapy may provide synergistic anti-tumor effects by releasing T-cell inhibition through complementary mechanisms.',
          evidence: ['Pembrolizumab INHIBITS PD-1 (0.96)', 'Ipilimumab INHIBITS CTLA-4 (0.93)', 'Both pathways inhibit T-cell function'],
          experiments: ['Phase II trial combining pembrolizumab + ipilimumab', 'Flow cytometry analysis of T-cell activation markers', 'Tumor infiltrating lymphocyte characterization']
        },
        {
          title: 'IFN-gamma as Resistance Biomarker',
          confidence: 0.79,
          reasoning: 'The graph shows IFN-gamma activates PD-L1 expression, suggesting that high IFN-gamma in the tumor microenvironment may predict adaptive resistance to PD-1 blockade.',
          evidence: ['IFN-gamma ACTIVATES PD-L1 (0.85)', 'PD-L1 BIOMARKER_FOR Melanoma (0.87)'],
          experiments: ['Measure IFN-gamma levels pre/post treatment', 'Correlate with treatment response', 'Test IFN-gamma neutralization combinations']
        },
        {
          title: 'CD8 T-cell Expansion Optimization',
          confidence: 0.83,
          reasoning: 'CD8 T-cells are shown to directly treat melanoma but are inhibited by PD-1. Strategies to maximize CD8 expansion while blocking PD-1 could enhance therapeutic efficacy.',
          evidence: ['CD8 TREATS Melanoma (0.82)', 'PD-1 INHIBITS CD8 (0.94)'],
          experiments: ['IL-2 therapy combined with checkpoint inhibition', 'Adoptive T-cell transfer protocols', 'CAR-T cell development for melanoma antigens']
        }
      ],
      computerScience: [
        {
          title: 'Efficient Vision Transformer Training',
          confidence: 0.85,
          reasoning: 'Given that Vision Transformers require extensive pre-training on ImageNet and benefit from transfer learning, hybrid architectures combining CNN feature extraction with Transformer attention could reduce training requirements.',
          evidence: ['Vision Transformer EVALUATES_ON ImageNet (0.91)', 'Transfer Learning OPTIMIZES Image Classification (0.88)'],
          experiments: ['Implement CNN-Transformer hybrid architecture', 'Benchmark against pure ViT on ImageNet', 'Measure training efficiency and final accuracy']
        },
        {
          title: 'Attention Mechanism Pruning',
          confidence: 0.81,
          reasoning: 'The central role of attention mechanisms in enabling Transformers suggests that structured pruning of attention heads could maintain performance while reducing computational cost.',
          evidence: ['Attention Mechanism ENABLES Transformer (0.95)', 'Transformer SOLVES NLP (0.92)'],
          experiments: ['Analyze attention head importance scores', 'Implement progressive head pruning', 'Evaluate on GLUE benchmark']
        },
        {
          title: 'BERT-LSTM Knowledge Distillation',
          confidence: 0.78,
          reasoning: 'Since BERT outperforms LSTM but LSTMs are more efficient, distilling BERT knowledge into LSTM architectures could provide efficient deployment solutions.',
          evidence: ['BERT OUTPERFORMS LSTM (0.89)', 'LSTM used in Seq2Seq applications'],
          experiments: ['Train LSTM student from BERT teacher', 'Measure accuracy/speed tradeoff', 'Deploy on edge devices']
        }
      ],
      economics: [
        {
          title: 'Minimum Wage and Productivity Feedback',
          confidence: 0.82,
          reasoning: 'The graph suggests minimum wage influences employment and wage growth, while productivity predicts wage growth. Higher minimum wages may incentivize productivity investments that offset employment effects.',
          evidence: ['Minimum Wage INFLUENCES Employment Rate (0.78)', 'Productivity PREDICTS Wage Growth (0.83)', 'Minimum Wage INFLUENCES Wage Growth (0.81)'],
          experiments: ['Panel study across states with different minimum wages', 'Measure firm-level productivity changes', 'Control for industry and automation trends']
        },
        {
          title: 'Job Training as Inequality Intervention',
          confidence: 0.84,
          reasoning: 'Job training programs mitigate unemployment and influence productivity. Targeted programs could address income inequality by improving labor market outcomes for disadvantaged workers.',
          evidence: ['Job Training Programs MITIGATES Unemployment (0.85)', 'Job Training Programs INFLUENCES Productivity (0.84)', 'Income Inequality CAUSES Labor Market inefficiency (0.76)'],
          experiments: ['RCT of intensive training for low-income workers', 'Long-term wage trajectory analysis', 'Cost-benefit analysis of program expansion']
        },
        {
          title: 'Inflation-GDP Dynamic Modeling',
          confidence: 0.76,
          reasoning: 'The correlation between GDP growth and wage growth, combined with inflation responding to GDP, suggests complex dynamics requiring integrated modeling approaches.',
          evidence: ['GDP Growth CORRELATES_WITH Wage Growth (0.91)', 'Inflation RESPONDS_TO GDP Growth (0.79)'],
          experiments: ['Develop VAR model with all three variables', 'Test different lag structures', 'Forecast under policy scenarios']
        }
      ],
      politicalScience: [
        {
          title: 'Platform Design and Misinformation Mitigation',
          confidence: 0.86,
          reasoning: 'Social media leads to misinformation which increases polarization. Platform interventions targeting misinformation spread could reduce downstream polarization effects.',
          evidence: ['Social Media LEADS_TO Misinformation (0.86)', 'Misinformation LEADS_TO Political Polarization (0.88)'],
          experiments: ['A/B test fact-checking interventions', 'Measure polarization metrics pre/post intervention', 'Study sharing behavior changes']
        },
        {
          title: 'Electoral College Reform Effects',
          confidence: 0.74,
          reasoning: 'Electoral College influences voter turnout, suggesting that reform to popular vote or proportional allocation could increase participation in non-competitive states.',
          evidence: ['Electoral College INFLUENCES Voter Turnout (0.73)', 'Campaign Finance INFLUENCES Voter Turnout (0.76)'],
          experiments: ['Model turnout under alternative systems', 'Compare with states using different allocation methods', 'Survey voter motivation in competitive vs safe states']
        },
        {
          title: 'Bipartisan Communication Channels',
          confidence: 0.79,
          reasoning: 'Political polarization leads to legislative gridlock, while public opinion influences both parties. Creating structured bipartisan engagement could reduce gridlock.',
          evidence: ['Political Polarization LEADS_TO Legislative Gridlock (0.84)', 'Public Opinion INFLUENCES Democratic Party (0.79)', 'Public Opinion INFLUENCES Republican Party (0.77)'],
          experiments: ['Deliberative polling experiments', 'Track legislative cooperation metrics', 'Analyze cross-partisan town halls']
        }
      ],
      mathematics: [
        {
          title: 'Categorical Homotopy Type Theory',
          confidence: 0.88,
          reasoning: 'Category theory generalizes homotopy theory, and both connect to algebraic structures. Homotopy type theory could provide computational foundations for these relationships.',
          evidence: ['Category Theory GENERALIZES Homotopy Theory (0.89)', 'Category Theory GENERALIZES Algebraic Structure (0.91)'],
          experiments: ['Formalize key theorems in Agda/Coq', 'Develop new proof techniques', 'Connect to practical type systems']
        },
        {
          title: 'Computational Homology via Simplicial Methods',
          confidence: 0.91,
          reasoning: 'Simplicial complexes build on topological spaces and homology applies to them. This suggests efficient computational approaches to homological invariants.',
          evidence: ['Simplicial Complex BUILDS_ON Topological Space (0.86)', 'Homology APPLIES_TO Simplicial Complex (0.93)'],
          experiments: ['Implement persistent homology algorithms', 'Apply to data analysis problems', 'Optimize computational complexity']
        },
        {
          title: 'Euler Characteristic Generalizations',
          confidence: 0.84,
          reasoning: 'Euler characteristic applies to manifolds and cohomology generalizes homology. Higher categorical Euler characteristics could capture more refined invariants.',
          evidence: ['Euler Characteristic APPLIES_TO Manifold (0.96)', 'Cohomology GENERALIZES Homology (0.92)'],
          experiments: ['Define orbifold Euler characteristic', 'Compute for stratified spaces', 'Connect to string theory applications']
        }
      ]
    };

    setHypotheses(domainHypotheses[selectedDomain] || []);
    setShowHypotheses(true);
    setIsGeneratingHypotheses(false);
  };

  // Simulate paper search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchStatus('🔍 Searching...');

    await new Promise(resolve => setTimeout(resolve, 1500));
    setSearchStatus('📚 Found 23 papers');

    await new Promise(resolve => setTimeout(resolve, 1500));
    setSearchStatus(`${currentDomain.icon} Extracting entities...`);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setSearchStatus('✅ Ready!');

    // Generate mock results based on domain
    const mockResults = generateMockSearchResults(selectedDomain, searchQuery);
    setSearchResults(mockResults);

    const data = convertToGraphData(mockResults.nodes, mockResults.edges, selectedDomain);
    setGraphData(data);

    setIsSearching(false);
  };

  // Generate mock search results
  const generateMockSearchResults = (domain, query) => {
    const domainConfig = DOMAINS[domain];
    const baseNodes = domainConfig.nodes.slice(0, 6);
    const baseEdges = domainConfig.edges.slice(0, 5);

    // Add some query-related nodes
    const queryNode = {
      id: query.split(' ')[0],
      type: Object.keys(domainConfig.entityTypes)[0],
      label: query.split(' ')[0]
    };

    return {
      papers: [
        { title: `${query} - A Comprehensive Review`, authors: 'Research Team A', year: 2023 },
        { title: `Novel Approaches to ${query}`, authors: 'Smith et al.', year: 2023 },
        { title: `${query}: Current State and Future Directions`, authors: 'Johnson et al.', year: 2022 }
      ],
      nodes: [...baseNodes, queryNode],
      edges: baseEdges
    };
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  // Handle drop zone
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setUploadedFiles(files);
  };

  // Analyze uploaded papers
  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setIsAnalyzing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock results
    const domainConfig = DOMAINS[selectedDomain];
    const mockResults = {
      papers: uploadedFiles.map(f => ({
        title: f.name.replace('.pdf', ''),
        authors: 'Extracted Authors',
        year: 2023
      })),
      nodes: domainConfig.nodes.slice(0, 8),
      edges: domainConfig.edges.slice(0, 6)
    };

    setUploadResults(mockResults);
    const data = convertToGraphData(mockResults.nodes, mockResults.edges, selectedDomain);
    setGraphData(data);

    setIsAnalyzing(false);
  };

  // Graph node rendering
  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const label = node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    // Draw node circle
    const radius = Math.sqrt(node.val) * 4;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5 / globalScale;
    ctx.stroke();

    // Draw label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1F2937';
    ctx.fillText(label, node.x, node.y + radius + fontSize);
  }, []);

  // Graph link rendering
  const linkCanvasObject = useCallback((link, ctx, globalScale) => {
    const start = link.source;
    const end = link.target;

    if (typeof start !== 'object' || typeof end !== 'object') return;

    // Draw curved line
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const curvature = 0.2;
    const ctrlX = midX - dy * curvature;
    const ctrlY = midY + dx * curvature;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(ctrlX, ctrlY, end.x, end.y);
    ctx.strokeStyle = link.color;
    ctx.lineWidth = 2 / globalScale;
    ctx.stroke();

    // Draw arrow
    const angle = Math.atan2(end.y - ctrlY, end.x - ctrlX);
    const arrowLength = 8 / globalScale;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle - Math.PI / 6),
      end.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      end.x - arrowLength * Math.cos(angle + Math.PI / 6),
      end.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = link.color;
    ctx.fill();
  }, []);

  // Get current papers based on tab
  const getCurrentPapers = () => {
    if (activeTab === 'uw-research') {
      return currentDomain.examplePapers;
    } else if (activeTab === 'search' && searchResults) {
      return searchResults.papers;
    } else if (activeTab === 'upload' && uploadResults) {
      return uploadResults.papers;
    }
    return [];
  };

  // Get stats
  const getStats = () => {
    return {
      entities: graphData.nodes.length,
      relationships: graphData.links.length,
      papers: getCurrentPapers().length
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-[#C5050C]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-[#C5050C]">
            🦡 Badger Research Graph
          </h1>
          <p className="text-gray-600 mt-1">
            AI-Powered Cross-Disciplinary Research • UW-Madison
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('uw-research')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'uw-research'
                ? 'bg-white text-[#C5050C] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🦡 UW Research
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-white text-[#C5050C] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 Search Papers
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-[#C5050C] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📄 Upload Papers
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls & Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Domain Selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5050C] focus:border-transparent"
              >
                {Object.values(DOMAINS).map(domain => (
                  <option key={domain.id} value={domain.id}>
                    {domain.icon} {domain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab-specific controls */}
            {activeTab === 'uw-research' && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {currentDomain.icon} {currentDomain.exampleTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Pre-loaded example showing key research relationships in {currentDomain.name.toLowerCase()}.
                </p>
                <div className="text-xs text-gray-500">
                  <div>{stats.entities} entities</div>
                  <div>{stats.relationships} relationships</div>
                  <div>{stats.papers} papers</div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentDomain.searchPlaceholder}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5050C] focus:border-transparent mb-3"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="w-full bg-[#C5050C] text-white py-2 px-4 rounded-md hover:bg-[#A00000] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Find & Analyze Papers'}
                </button>
                {searchStatus && (
                  <p className="mt-3 text-sm text-center text-gray-600">
                    {searchStatus}
                  </p>
                )}
                {searchResults && (
                  <div className="mt-3 text-xs text-gray-500">
                    <div>{stats.entities} entities extracted</div>
                    <div>{stats.relationships} relationships found</div>
                    <div>{stats.papers} papers analyzed</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDFs
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#C5050C] transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-gray-600">
                    {uploadedFiles.length > 0
                      ? `${uploadedFiles.length} file(s) selected`
                      : 'Drop PDFs here or click to upload'}
                  </p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="truncate">{f.name}</div>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || uploadedFiles.length === 0}
                  className="w-full mt-3 bg-[#C5050C] text-white py-2 px-4 rounded-md hover:bg-[#A00000] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Papers'}
                </button>
                {uploadResults && (
                  <div className="mt-3 text-xs text-gray-500">
                    <div>{stats.entities} entities extracted</div>
                    <div>{stats.relationships} relationships found</div>
                    <div>{stats.papers} papers analyzed</div>
                  </div>
                )}
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>

              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Entities</h4>
                <div className="space-y-1">
                  {Object.entries(currentDomain.entityTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center text-sm">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: value.color }}
                      />
                      {value.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Relationships</h4>
                <div className="space-y-1">
                  {Object.entries(currentDomain.relationshipTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center text-sm">
                      <span
                        className="w-3 h-3 mr-2"
                        style={{ backgroundColor: value.color }}
                      />
                      {value.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Graph & Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Graph */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-[500px] border border-gray-200 rounded-lg overflow-hidden">
                {graphData.nodes.length > 0 ? (
                  <ForceGraph2D
                    ref={graphRef}
                    graphData={graphData}
                    nodeCanvasObject={nodeCanvasObject}
                    linkCanvasObject={linkCanvasObject}
                    onLinkClick={handleLinkClick}
                    linkDirectionalArrowLength={6}
                    linkDirectionalArrowRelPos={1}
                    linkCurvature={0.2}
                    cooldownTicks={100}
                    onEngineStop={() => graphRef.current?.zoomToFit(400)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {activeTab === 'search' && 'Enter a search query to find papers'}
                    {activeTab === 'upload' && 'Upload PDFs to analyze'}
                  </div>
                )}
              </div>

              {/* Generate Hypotheses Button */}
              {graphData.nodes.length > 0 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={generateHypotheses}
                    disabled={isGeneratingHypotheses}
                    className="bg-[#C5050C] text-white py-2 px-6 rounded-md hover:bg-[#A00000] disabled:bg-gray-400 transition-colors"
                  >
                    {isGeneratingHypotheses ? 'Generating...' : 'Generate Research Hypotheses'}
                  </button>
                </div>
              )}
            </div>

            {/* Papers List */}
            {getCurrentPapers().length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Papers</h3>
                <div className="space-y-2">
                  {getCurrentPapers().map((paper, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-md">
                      <div className="font-medium text-sm">{paper.title}</div>
                      <div className="text-xs text-gray-500">
                        {paper.authors} • {paper.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hypotheses */}
            {showHypotheses && hypotheses.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Research Hypotheses</h3>
                <div className="space-y-4">
                  {hypotheses.map((hyp, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#C5050C]">{hyp.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          hyp.confidence >= 0.85
                            ? 'bg-green-100 text-green-800'
                            : hyp.confidence >= 0.75
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {Math.round(hyp.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{hyp.reasoning}</p>

                      <div className="mb-3">
                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Supporting Evidence</h5>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {hyp.evidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">Suggested Experiments</h5>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {hyp.experiments.map((exp, i) => (
                            <li key={i}>{exp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edge Detail Modal */}
      {showModal && selectedEdge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3
                className="text-lg font-bold"
                style={{ color: selectedEdge.color }}
              >
                {currentDomain.relationshipTypes[selectedEdge.type]?.label || selectedEdge.type}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{selectedEdge.source.label || selectedEdge.source}</span>
                {' → '}
                <span className="font-medium">{selectedEdge.target.label || selectedEdge.target}</span>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Confidence</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${selectedEdge.confidence * 100}%`,
                      backgroundColor: selectedEdge.color
                    }}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {Math.round(selectedEdge.confidence * 100)}%
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">Evidence</div>
                <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">
                  "{selectedEdge.evidence}"
                </p>
              </div>

              <div className="text-xs text-gray-500">
                Source: Page {selectedEdge.page}
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
