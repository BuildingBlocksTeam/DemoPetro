import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Settings, BarChart3, Zap, Activity,
  MapPin, Layers, Truck, HardHat, Wrench, Play, Clipboard,
  Building2, Factory, Gauge, Package, Circle, X, Check,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Eye, Link2, Edit3,
  Database, TrendingUp, TrendingDown, Target, DollarSign, Clock,
  MessageCircle, Send, Bot, User, Lightbulb, AlertTriangle,
  RotateCcw, Filter, RefreshCw, GitBranch, Workflow, Move,
  Hash, Calendar, ToggleLeft, FileText, Cloud, Server, Type
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer 
} from 'recharts';

const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect, onBack, draggingNode, setDraggingNode, dragOffset, setDragOffset }) => {
  // Canvas states
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showConnectionData, setShowConnectionData] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, nodeId: null });
  const [workflowNodes, setWorkflowNodes] = useState(workflow?.nodes || []);
  const [workflowConnections, setWorkflowConnections] = useState(workflow?.connections || []);
  
  // Connection mode states
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  
  // Data source editor
  const [showDataSourceEditor, setShowDataSourceEditor] = useState(false);
  
  // AI Chat states
  const [aiChatMinimized, setAiChatMinimized] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy tu asistente de IA para el Digital Twin. Puedo ayudarte a optimizar procesos, analizar datos y sugerir mejoras.',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 2,
      type: 'bot',
      content: 'He detectado algunas oportunidades de mejora en tu workflow actual. ¿Te gustaría que las revise contigo?',
      timestamp: new Date(Date.now() - 30000),
      suggestions: [
        { type: 'optimization', text: 'Revisar eficiencia de procesos', icon: TrendingUp },
        { type: 'cost', text: 'Análisis de reducción de costos', icon: DollarSign },
        { type: 'risk', text: 'Evaluar riesgos del proyecto', icon: AlertTriangle }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // KPIs management
  const [kpis, setKpis] = useState([
    { 
      id: 'efficiency', 
      name: 'Eficiencia Global', 
      value: 92, 
      unit: '%', 
      change: 8.5, 
      trend: 'up', 
      icon: 'Target',
      color: '#10b981',
      assignedNodes: ['node_1', 'node_2']
    },
    { 
      id: 'cost_performance', 
      name: 'Rendimiento de Costos', 
      value: 0.96, 
      unit: 'CPI', 
      change: -2.1, 
      trend: 'down', 
      icon: 'DollarSign',
      color: '#f59e0b',
      assignedNodes: []
    },
    { 
      id: 'schedule_performance', 
      name: 'Cumplimiento de Cronograma', 
      value: 1.05, 
      unit: 'SPI', 
      change: 12.3, 
      trend: 'up', 
      icon: 'Clock',
      color: '#3b82f6',
      assignedNodes: ['node_3']
    }
  ]);
  const [editingKpi, setEditingKpi] = useState(null);
  const [showKpiAssignModal, setShowKpiAssignModal] = useState(false);
  const [kpiToAssign, setKpiToAssign] = useState(null);
  
  const canvasRef = useRef(null);

  // Fixed chart data (won't reset on clicks)
  const chartData = {
    efficiency: [
      { date: '2024-01', value: 72, target: 75 },
      { date: '2024-02', value: 78, target: 75 },
      { date: '2024-03', value: 82, target: 80 },
      { date: '2024-04', value: 85, target: 80 },
      { date: '2024-05', value: 88, target: 85 },
      { date: '2024-06', value: 92, target: 85 }
    ],
    cost: [
      { month: 'Ene', planned: 1200000, actual: 1150000 },
      { month: 'Feb', planned: 1300000, actual: 1280000 },
      { month: 'Mar', planned: 1100000, actual: 1320000 },
      { month: 'Abr', planned: 1400000, actual: 1380000 },
      { month: 'May', planned: 1250000, actual: 1190000 },
      { month: 'Jun', planned: 1350000, actual: 1420000 }
    ],
    nodeTypes: [
      { name: 'Planificación', value: 15, color: '#3b82f6' },
      { name: 'Ejecución', value: 45, color: '#10b981' },
      { name: 'Control', value: 25, color: '#f59e0b' },
      { name: 'Cierre', value: 15, color: '#6b7280' }
    ],
    performance: [
      { time: '00:00', cpu: 65, memory: 72, network: 45 },
      { time: '04:00', cpu: 70, memory: 68, network: 52 },
      { time: '08:00', cpu: 85, memory: 82, network: 78 },
      { time: '12:00', cpu: 92, memory: 88, network: 85 },
      { time: '16:00', cpu: 88, memory: 85, network: 80 },
      { time: '20:00', cpu: 75, memory: 78, network: 65 }
    ]
  };

  const nodeTypes = [
    { id: 'process', name: 'Proceso', icon: Activity, color: '#3b82f6' },
    { id: 'decision', name: 'Decisión', icon: Layers, color: '#f59e0b' },
    { id: 'data', name: 'Datos', icon: Gauge, color: '#10b981' },
    { id: 'integration', name: 'Integración', icon: Zap, color: '#8b5cf6' },
    { id: 'output', name: 'Salida', icon: Play, color: '#06b6d4' },
    { id: 'control', name: 'Control', icon: Settings, color: '#ef4444' },
    { id: 'condition', name: 'Condición', icon: GitBranch, color: '#8b5cf6' },
    { id: 'automation', name: 'Automatización', icon: Workflow, color: '#f97316' }
  ];

  const dataSourceTypes = [
    { value: 'excel', label: 'Excel', icon: FileText, color: '#10b981' },
    { value: 'database', label: 'Base de Datos', icon: Database, color: '#3b82f6' },
    { value: 'api', label: 'API REST', icon: Link2, color: '#f59e0b' },
    { value: 'cloud', label: 'Servicio Cloud', icon: Cloud, color: '#8b5cf6' },
    { value: 'erp', label: 'Sistema ERP', icon: Server, color: '#dc2626' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { main: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' };
      case 'running': return { main: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' };
      case 'scheduled': return { main: '#f59e0b', bg: '#fffbeb', border: '#fed7aa', text: '#92400e' };
      case 'pending': return { main: '#6b7280', bg: '#f9fafb', border: '#d1d5db', text: '#374151' };
      default: return { main: '#6b7280', bg: '#f9fafb', border: '#d1d5db', text: '#374151' };
    }
  };

  const getNodeIcon = (node) => {
    const iconMap = {
      process: Activity, decision: Layers, data: Gauge, integration: Zap,
      output: Play, control: Settings, condition: GitBranch, automation: Workflow,
      exploration: MapPin, analysis: BarChart3, regulatory: Circle,
      engineering: Layers, logistics: Truck, drilling: HardHat,
      completion: Wrench, production: Play, planning: Clipboard,
      legal: Circle, construction: Building2, facilities: Factory,
      testing: Gauge, operations: Activity, procurement: Package,
      commissioning: Zap, licensing: Circle, environmental: Circle
    };
    return iconMap[node.type] || Activity;
  };

  const getIconComponent = (iconName) => {
    const icons = { Target, DollarSign, Clock, Activity, BarChart3, TrendingUp, AlertTriangle };
    return icons[iconName] || Target;
  };

  // Mock data functions
  const getNodeData = (nodeId) => ({
    metrics: [
      { name: 'Eficiencia', value: 87.3, unit: '%', trend: 'up' },
      { name: 'Costo', value: 125000, unit: 'USD', trend: 'stable' },
      { name: 'Tiempo', value: 45, unit: 'días', trend: 'down' },
      { name: 'Recursos', value: 12, unit: 'personas', trend: 'up' },
      { name: 'Calidad', value: 94.2, unit: '%', trend: 'up' },
      { name: 'Riesgo', value: 3.1, unit: '/10', trend: 'down' }
    ],
    logs: [
      { timestamp: '2024-01-15T16:30:00Z', event: 'Proceso iniciado', type: 'info' },
      { timestamp: '2024-01-15T14:22:00Z', event: 'Validación completada', type: 'success' },
      { timestamp: '2024-01-15T12:15:00Z', event: 'Recursos asignados', type: 'info' },
      { timestamp: '2024-01-15T10:30:00Z', event: 'Configuración actualizada', type: 'warning' }
    ],
    properties: {
      owner: 'Juan Pérez',
      priority: 'Alta',
      deadline: '2024-02-15',
      budget: '$125,000',
      resources: ['Equipo A', 'Equipo B', 'Consultor externo']
    }
  });

  const getConnectionData = (connectionId) => ({
    throughput: 1250,
    latency: 45,
    errorRate: 0.2,
    status: 'healthy',
    dataFlow: [
      { timestamp: '16:30', value: 1250 },
      { timestamp: '16:25', value: 1180 },
      { timestamp: '16:20', value: 1220 },
      { timestamp: '16:15', value: 1290 },
      { timestamp: '16:10', value: 1156 }
    ],
    conditions: [
      { type: 'if', condition: 'efficiency > 90', action: 'continue' },
      { type: 'else', condition: 'efficiency <= 90', action: 'alert_manager' }
    ]
  });

  // AI Chat functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'optimización': 'Basándome en tu workflow actual, he identificado 3 áreas clave de optimización: 1) Paralelización de tareas independientes (ahorro de 15% en tiempo), 2) Automatización de procesos manuales (reducción de 23% en errores), 3) Optimización de recursos (mejora de 18% en eficiencia).',
    'costos': 'El análisis de costos muestra oportunidades de ahorro de hasta $450K anuales mediante: consolidación de proveedores (12% ahorro), optimización energética (8% reducción), y mejora en planificación de recursos (15% eficiencia).',
    'riesgos': 'He detectado 5 riesgos potenciales en tu proyecto: 2 de alta prioridad (dependencias críticas), 2 de media prioridad (recursos compartidos), y 1 de baja prioridad (factores externos). ¿Quieres que profundice en alguno específico?'
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const messageKey = Object.keys(predefinedResponses).find(key => 
        newMessage.toLowerCase().includes(key)
      );
      
      const response = messageKey 
        ? predefinedResponses[messageKey]
        : 'Interesante pregunta. Basándome en los datos de tu Digital Twin, puedo generar un análisis detallado. ¿Podrías ser más específico sobre qué aspecto te interesa más?';

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion.text);
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '¡Hola! Soy tu asistente de IA para el Digital Twin. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
  };

  // Node and workflow functions
  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (connectingMode) {
      if (!connectionStart) {
        setConnectionStart(nodeId);
      } else {
        if (connectionStart !== nodeId) {
          const newConnection = {
            id: `conn_${Date.now()}`,
            from: connectionStart,
            to: nodeId,
            progress: 0,
            conditions: []
          };
          setWorkflowConnections([...workflowConnections, newConnection]);
        }
        setConnectionStart(null);
        setConnectingMode(false);
      }
      return;
    }
    
    if (e.button === 2) { // Right click
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        nodeId: nodeId
      });
      return;
    }
    
    if (e.button === 0) { // Left click
      const node = workflowNodes.find(n => n.id === nodeId);
      if (!node) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / canvasScale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / canvasScale;

      setDraggingNode(nodeId);
      setDragOffset({
        x: mouseX - node.position.x,
        y: mouseY - node.position.y
      });
    }
  };

  const handleNodeClick = (node) => {
    if (connectingMode) return;
    onNodeSelect(node);
    setShowNodePanel(true);
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  const handleConnectionClick = (connection) => {
    setSelectedConnection(connection);
    setShowConnectionData(true);
  };

  const addNewNode = (type) => {
    const nodeType = nodeTypes.find(nt => nt.id === type);
    const newNode = {
      id: `node_${Date.now()}`,
      name: `Nuevo ${nodeType.name}`,
      type: type,
      status: 'pending',
      duration: '15 días',
      cost: '$50K',
      progress: 0,
      position: { 
        x: 100 + Math.random() * 400, 
        y: 100 + Math.random() * 300 
      },
      kpis: { efficiency: '0%', quality: '0%', completion: '0%' },
      automations: [],
      dataSources: []
    };
    
    setWorkflowNodes([...workflowNodes, newNode]);
    setShowAddNodeModal(false);
  };

  const deleteNode = (nodeId) => {
    setWorkflowNodes(workflowNodes.filter(node => node.id !== nodeId));
    setWorkflowConnections(workflowConnections.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  // KPI management functions
  const addKpi = () => {
    const newKpi = {
      id: `kpi_${Date.now()}`,
      name: 'Nuevo KPI',
      value: 0,
      unit: '%',
      change: 0,
      trend: 'stable',
      icon: 'Target',
      color: '#6b7280',
      assignedNodes: []
    };
    setKpis([...kpis, newKpi]);
    setEditingKpi(newKpi.id);
  };

  const updateKpi = (kpiId, updates) => {
    setKpis(kpis.map(kpi => kpi.id === kpiId ? { ...kpi, ...updates } : kpi));
  };

  const deleteKpi = (kpiId) => {
    setKpis(kpis.filter(kpi => kpi.id !== kpiId));
  };

  const openKpiAssignModal = (kpiId) => {
    setKpiToAssign(kpiId);
    setShowKpiAssignModal(true);
  };

  const assignKpiToNodes = (nodeIds) => {
    updateKpi(kpiToAssign, { assignedNodes: nodeIds });
    setShowKpiAssignModal(false);
    setKpiToAssign(null);
  };

  const handleCanvasMouseDown = (e) => {
    if (e.button === 0 && !draggingNode) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  const handleMouseMove = useCallback((e) => {
    if (draggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / canvasScale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / canvasScale;

      const newX = Math.max(50, Math.min(mouseX - dragOffset.x, 1100));
      const newY = Math.max(50, Math.min(mouseY - dragOffset.y, 600));

      setWorkflowNodes(workflowNodes.map(node => 
        node.id === draggingNode 
          ? { ...node, position: { x: newX, y: newY } }
          : node
      ));
    } else if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [draggingNode, dragOffset, canvasScale, panOffset, isPanning, lastPanPoint, workflowNodes]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
    setDragOffset({ x: 0, y: 0 });
    setIsPanning(false);
  }, [setDraggingNode, setDragOffset]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(canvasScale * scaleChange, 2));
    setCanvasScale(newScale);
  }, [canvasScale]);

  const resetView = () => {
    setCanvasScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => setCanvasScale(prev => Math.min(prev * 1.2, 2));
  const zoomOut = () => setCanvasScale(prev => Math.max(prev / 1.2, 0.5));

  useEffect(() => {
    if (draggingNode || isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingNode, isPanning, handleMouseMove, handleMouseUp]);

  const NodeComponent = ({ node, onClick }) => {
    const statusColors = getStatusColor(node.status);
    const IconComponent = getNodeIcon(node);
    const isSelected = connectionStart === node.id;
    const assignedKpis = kpis.filter(kpi => kpi.assignedNodes.includes(node.id));
    
    return (
      <g 
        className={`workflow-node ${draggingNode === node.id ? 'dragging' : ''} ${isSelected ? 'connecting' : ''}`}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        onClick={() => onClick && onClick(node)}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: draggingNode === node.id ? 'grabbing' : connectingMode ? 'crosshair' : 'grab' }}
      >
        {/* Main card */}
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="180" 
          height="120"
          rx="12"
          fill="white"
          stroke={isSelected ? '#3b82f6' : statusColors.border}
          strokeWidth={isSelected ? "3" : "2"}
          filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))"
        />
        
        {/* Status indicator */}
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="180" 
          height="6"
          rx="6"
          fill={statusColors.main}
        />
        
        {/* Icon background */}
        <circle
          cx={node.position.x + 25}
          cy={node.position.y + 35}
          r="16"
          fill={statusColors.bg}
          stroke={statusColors.main}
          strokeWidth="1"
        />
        
        {/* Icon */}
        <foreignObject
          x={node.position.x + 17}
          y={node.position.y + 27}
          width="16"
          height="16"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={14} color={statusColors.main} />
          </div>
        </foreignObject>
        
        {/* Node title */}
        <text
          x={node.position.x + 50} 
          y={node.position.y + 25}
          fontSize="12"
          fontWeight="600"
          fill="#1f2937"
          textAnchor="start"
        >
          {node.name.length > 20 ? node.name.substring(0, 18) + '...' : node.name}
        </text>
        
        {/* Node type */}
        <text
          x={node.position.x + 50} 
          y={node.position.y + 40}
          fontSize="10"
          fill="#6b7280"
          textAnchor="start"
          textTransform="uppercase"
        >
          {node.type}
        </text>
        
        {/* Duration and cost */}
        <text
          x={node.position.x + 12} 
          y={node.position.y + 65}
          fontSize="10"
          fill="#374151"
          fontWeight="500"
        >
          {node.duration}
        </text>
        
        <text
          x={node.position.x + 12} 
          y={node.position.y + 80}
          fontSize="10"
          fill="#059669"
          fontWeight="600"
        >
          {node.cost}
        </text>
        
        {/* Progress bar */}
        <rect
          x={node.position.x + 12} 
          y={node.position.y + 92}
          width="156" 
          height="6"
          rx="3"
          fill="#f3f4f6"
        />
        <rect
          x={node.position.x + 12} 
          y={node.position.y + 92}
          width={156 * (node.progress / 100)} 
          height="6"
          rx="3"
          fill={statusColors.main}
        />
        
        {/* Progress text */}
        <text
          x={node.position.x + 90} 
          y={node.position.y + 110}
          fontSize="10"
          fill={statusColors.text}
          textAnchor="middle"
          fontWeight="600"
        >
          {node.progress}%
        </text>
        
        {/* KPI indicators */}
        {assignedKpis.slice(0, 3).map((kpi, index) => (
          <circle
            key={kpi.id}
            cx={node.position.x + 150 + (index * 12)}
            cy={node.position.y + 25}
            r="4"
            fill={kpi.color}
            title={kpi.name}
          />
        ))}
      </g>
    );
  };

  // AI Chat component
  const AIChat = () => {
    if (aiChatMinimized) {
      return (
        <div className="ai-chat-minimized">
          <MessageCircle size={24} color="white" onClick={() => setAiChatMinimized(false)} />
          <div className="notification-badge">3</div>
        </div>
      );
    }

    return (
      <div className="ai-chat-container">
        <div className="chat-header">
          <div className="chat-title">
            <div className="bot-avatar">
              <Bot size={16} />
            </div>
            <div>
              <div>Asistente IA</div>
              <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="status-indicator"></div>
                En línea
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={clearChat} title="Limpiar chat">
              <RotateCcw size={16} />
            </button>
            <button className="header-btn" onClick={() => setAiChatMinimized(true)} title="Minimizar">
              <Minimize2 size={16} />
            </button>
            <button className="header-btn" onClick={() => setAiChatMinimized(true)} title="Cerrar">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className={`message-avatar ${message.type === 'bot' ? 'bot-message-avatar' : 'user-message-avatar'}`}>
                {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div className="message-content">
                  {message.content}
                  {message.suggestions && (
                    <div className="suggestions-grid">
                      {message.suggestions.map((suggestion, index) => {
                        const IconComponent = suggestion.icon;
                        return (
                          <button
                            key={index}
                            className="suggestion-btn"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <IconComponent size={14} />
                            {suggestion.text}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="bot-message-avatar message-avatar">
                <Bot size={16} />
              </div>
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="input-container">
            <textarea
              className="input-field"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Pregúntame sobre optimización, análisis de datos, riesgos..."
              rows="1"
            />
            <button 
              className="send-btn" 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container">
      <style jsx>{`
        .main-container {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .workflow-canvas-container {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 75vh;
        }

        .canvas-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          z-index: 5;
        }

        .canvas-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .canvas-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .canvas-stats {
          display: flex;
          gap: 20px;
        }

        .canvas-stat {
          text-align: center;
        }

        .canvas-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .canvas-stat-label {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #fafbfc;
        }

        .canvas-controls {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
          z-index: 20;
        }

        .control-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .control-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .automation-controls {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px;
          display: flex;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 30;
        }

        .automation-btn {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .automation-btn:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .automation-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .workflow-canvas-svg {
          width: 100%;
          height: 100%;
          cursor: ${isPanning ? 'grabbing' : 'grab'};
          user-select: none;
        }

        .workflow-node {
          transition: filter 0.2s ease;
        }

        .workflow-node:hover {
          filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.15));
        }

        .workflow-node.dragging {
          filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25));
        }

        .workflow-node.connecting {
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
        }

        .connection-line {
          stroke: #94a3b8;
          strokeWidth: 2;
          strokeDasharray: 4 4;
          fill: none;
          opacity: 0.6;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .connection-line:hover {
          stroke: #3b82f6;
          strokeWidth: 3;
          opacity: 1;
        }

        .connection-progress {
          stroke: #10b981;
          strokeWidth: 3;
          fill: none;
          cursor: pointer;
        }

        .back-button {
          position: absolute;
          top: 16px;
          left: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 30;
        }

        .back-button:hover {
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Statistics Section */
        .statistics-section {
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 20px;
          height: 25vh;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .section-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .time-selector {
          padding: 4px 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          font-size: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .chart-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
        }

        .chart-title {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .chart-wrapper {
          width: 100%;
          height: 150px;
        }

        /* KPI Sidebar */
        .kpi-sidebar {
          width: 300px;
          background: white;
          border-left: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }

        .sidebar-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .add-kpi-btn {
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-kpi-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .kpis-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .kpi-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
          transition: all 0.2s ease;
        }

        .kpi-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .kpi-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .kpi-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .kpi-actions {
          display: flex;
          gap: 3px;
        }

        .kpi-action-btn {
          padding: 3px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .kpi-action-btn:hover {
          background: #f8fafc;
          color: #1f2937;
        }

        .kpi-value-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .kpi-value {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .kpi-unit {
          font-size: 12px;
          color: #6b7280;
          margin-left: 3px;
        }

        .kpi-change {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
        }

        .kpi-name {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .kpi-assignments {
          font-size: 10px;
        }

        .assignments-label {
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .assigned-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-bottom: 6px;
        }

        .node-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 500;
        }

        .no-assignments {
          color: #9ca3af;
          font-style: italic;
        }

        .assign-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 3px 6px;
          font-size: 9px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .assign-btn:hover {
          background: #e5e7eb;
        }

        /* AI Chat Styles */
        .ai-chat-minimized {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .ai-chat-minimized:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: white;
          border: 2px solid white;
        }

        .ai-chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e8eb;
        }

        .chat-header {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
        }

        .bot-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          padding: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bot-message-avatar {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .user-message-avatar {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .message-content {
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #1a1d21;
          border: 1px solid #e5e8eb;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
        }

        .message-timestamp {
          font-size: 11px;
          color: #6b7684;
          margin-top: 4px;
          text-align: right;
        }

        .message.user .message-timestamp {
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
        }

        .suggestions-grid {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #374151;
          transition: all 0.2s ease;
        }

        .suggestion-btn:hover {
          background: #f0f8ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .typing-indicator {
          display: flex;
          gap: 12px;
          padding: 0 4px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e8eb;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: #6b7684;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .chat-input {
          padding: 16px;
          border-top: 1px solid #e5e8eb;
          background: #fafbfc;
        }

        .input-container {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e8eb;
          border-radius: 24px;
          font-size: 14px;
          resize: none;
          background: white;
          max-height: 100px;
          min-height: 44px;
        }

        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .send-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        /* Context Menu and Modals */
        .context-menu {
          position: fixed;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          min-width: 160px;
          overflow: hidden;
        }

        .context-menu-item {
          padding: 10px 16px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .context-menu-item:hover {
          background: #f8fafc;
        }

        .context-menu-item.danger {
          color: #ef4444;
        }

        .context-menu-item.danger:hover {
          background: #fef2f2;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #6b7280;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .node-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .node-type-btn {
          padding: 16px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .node-type-btn:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .node-type-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .node-type-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        /* Data panels */
        .data-panel {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 320px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 25;
          max-height: calc(100vh - 120px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e8eb;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
        }

        .panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .metric-item {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .metric-name {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .properties-section {
          margin-bottom: 20px;
        }

        .section-title-small {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .property-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .property-item:last-child {
          border-bottom: none;
        }

        .property-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .property-value {
          font-size: 12px;
          color: #1a1d21;
          font-weight: 600;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .log-item {
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 3px solid #3b82f6;
        }

        .log-timestamp {
          font-size: 10px;
          color: #6b7280;
          margin-bottom: 2px;
        }

        .log-event {
          font-size: 12px;
          color: #374151;
        }

        .assign-modal-content {
          max-width: 400px;
        }

        .nodes-checklist {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          padding: 12px;
        }

        .node-checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
        }

        .node-checkbox {
          width: 16px;
          height: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        @media (max-width: 1400px) {
          .kpi-sidebar {
            width: 250px;
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .ai-chat-container {
            width: calc(100vw - 40px);
            height: calc(100vh - 40px);
          }
        }
      `}</style>

      <div className="content-area">
        <div className="workflow-canvas-container">
          <div className="canvas-header">
            <h2 className="canvas-title">{workflow?.name}</h2>
            <p className="canvas-subtitle">{workflow?.description}</p>
            <div className="canvas-stats">
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflowNodes?.length || 0}</div>
                <div className="canvas-stat-label">Nodos</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflowConnections?.length || 0}</div>
                <div className="canvas-stat-label">Conexiones</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">
                  {Math.round((workflowNodes?.reduce((acc, node) => acc + node.progress, 0) || 0) / (workflowNodes?.length || 1))}%
                </div>
                <div className="canvas-stat-label">Progreso</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflow?.riskScore || 0}/10</div>
                <div className="canvas-stat-label">Riesgo</div>
              </div>
            </div>
          </div>

          <div className="canvas-area">
            <div className="canvas-controls">
              <button className="control-btn" onClick={zoomIn} title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button className="control-btn" onClick={zoomOut} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <button className="control-btn" onClick={resetView} title="Reset View">
                <Maximize2 size={16} />
              </button>
              <button 
                className="control-btn"
                onClick={() => setShowDataSourceEditor(true)}
                title="Fuentes de Datos"
              >
                <Database size={16} />
              </button>
            </div>

            <div className="automation-controls">
              <button 
                className={`automation-btn ${connectingMode ? 'active' : ''}`}
                onClick={() => setConnectingMode(!connectingMode)}
                title="Modo Conexión"
              >
                <Link2 size={14} />
                {connectingMode ? 'Cancelar' : 'Conectar'}
              </button>
              <button 
                className="automation-btn"
                title="Constructor de Automatizaciones"
              >
                <Workflow size={14} />
                Automatizar
              </button>
              <button 
                className="automation-btn"
                onClick={() => setShowAddNodeModal(true)}
                title="Añadir Nuevo Nodo"
              >
                <Plus size={14} />
                Añadir
              </button>
            </div>

            <svg 
              ref={canvasRef}
              className="workflow-canvas-svg" 
              viewBox="0 0 1200 700" 
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleCanvasMouseDown}
              onWheel={handleWheel}
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
                <marker id="arrowhead-progress" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
              </defs>

              <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${canvasScale})`}>
                {/* Connections - ONLY one arrow at the end */}
                {workflowConnections?.map((conn, index) => {
                  const fromNode = workflowNodes.find(n => n.id === conn.from);
                  const toNode = workflowNodes.find(n => n.id === conn.to);
                  
                  if (!fromNode || !toNode) return null;

                  const x1 = fromNode.position.x + 180;
                  const y1 = fromNode.position.y + 60;
                  const x2 = toNode.position.x;
                  const y2 = toNode.position.y + 60;
                  
                  const progressLength = conn.progress || 0;
                  const x1Progress = x1 + (x2 - x1) * (progressLength / 100);
                  const y1Progress = y1 + (y2 - y1) * (progressLength / 100);

                  return (
                    <g key={index}>
                      <line
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        className="connection-line"
                        markerEnd="url(#arrowhead)"
                        onClick={() => handleConnectionClick(conn)}
                      />
                      
                      {progressLength > 0 && (
                        <line
                          x1={x1} y1={y1}
                          x2={x1Progress} y2={y1Progress}
                          className="connection-progress"
                          markerEnd={progressLength === 100 ? "url(#arrowhead-progress)" : "none"}
                          onClick={() => handleConnectionClick(conn)}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {workflowNodes?.map((node) => (
                  <NodeComponent 
                    key={node.id} 
                    node={node} 
                    onClick={handleNodeClick}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Fixed Statistics Section */}
        <div className="statistics-section">
          <div className="section-header">
            <h3 className="section-title">Estadísticas del Digital Twin</h3>
            <div className="section-controls">
              <select className="time-selector">
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
              </select>
              <button className="control-btn">
                <Filter size={14} />
              </button>
              <button className="control-btn">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          
          <div className="stats-grid">
            <div className="chart-container">
              <h4 className="chart-title">Tendencia de Eficiencia</h4>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.efficiency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Eficiencia" />
                    <Line type="monotone" dataKey="target" stroke="#6b7280" strokeDasharray="5 5" name="Meta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-container">
              <h4 className="chart-title">Análisis de Costos</h4>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.cost}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${(value/1000).toFixed(0)}K`} />
                    <Legend />
                    <Bar dataKey="planned" fill="#3b82f6" name="Planificado" />
                    <Bar dataKey="actual" fill="#10b981" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-container">
              <h4 className="chart-title">Distribución de Nodos</h4>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.nodeTypes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      label
                    >
                      {chartData.nodeTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Sidebar */}
      <div className="kpi-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">KPIs del Sistema</h3>
          <button className="add-kpi-btn" onClick={addKpi}>
            <Plus size={14} />
          </button>
        </div>
        
        <div className="kpis-list">
          {kpis.map((kpi) => {
            const IconComponent = getIconComponent(kpi.icon);
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <div key={kpi.id} className="kpi-item">
                <div className="kpi-item-header">
                  <div className="kpi-icon" style={{ background: kpi.color }}>
                    <IconComponent size={12} />
                  </div>
                  <div className="kpi-actions">
                    <button 
                      className="kpi-action-btn"
                      onClick={() => setEditingKpi(kpi.id)}
                    >
                      <Edit3 size={10} />
                    </button>
                    <button 
                      className="kpi-action-btn"
                      onClick={() => deleteKpi(kpi.id)}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                
                <div className="kpi-value-section">
                  <div className="kpi-value">
                    {kpi.value}
                    <span className="kpi-unit">{kpi.unit}</span>
                  </div>
                  <div className="kpi-change" style={{ color: kpi.trend === 'up' ? '#10b981' : '#ef4444' }}>
                    <TrendIcon size={10} />
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                
                <div className="kpi-name">{kpi.name}</div>
                
                <div className="kpi-assignments">
                  <span className="assignments-label">Asignado a:</span>
                  <div className="assigned-nodes">
                    {kpi.assignedNodes.length === 0 ? (
                      <span className="no-assignments">Sin asignar</span>
                    ) : (
                      kpi.assignedNodes.map(nodeId => {
                        const node = workflowNodes.find(n => n.id === nodeId);
                        return node ? (
                          <span key={nodeId} className="node-tag">
                            {node.name.length > 8 ? node.name.substring(0, 6) + '...' : node.name}
                          </span>
                        ) : null;
                      })
                    )}
                  </div>
                  <button 
                    className="assign-btn"
                    onClick={() => openKpiAssignModal(kpi.id)}
                  >
                    Asignar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        className="back-button"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={14} />
        Volver
      </button>

      {/* AI Chat Component */}
      <AIChat />

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="context-menu-item">
            <Eye size={14} />
            Ver Detalles
          </div>
          <div className="context-menu-item">
            <Settings size={14} />
            Configurar
          </div>
          <div className="context-menu-item">
            <Link2 size={14} />
            Conectar
          </div>
          <div className="context-menu-item">
            <Edit3 size={14} />
            Editar
          </div>
          <div 
            className="context-menu-item danger"
            onClick={() => deleteNode(contextMenu.nodeId)}
          >
            <Trash2 size={14} />
            Eliminar
          </div>
        </div>
      )}

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Añadir Nuevo Nodo</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddNodeModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="node-types-grid">
              {nodeTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    className="node-type-btn"
                    onClick={() => addNewNode(type.id)}
                  >
                    <div 
                      className="node-type-icon"
                      style={{ background: type.color }}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="node-type-name">{type.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KPI Assignment Modal */}
      {showKpiAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content assign-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Asignar KPI a Nodos</h3>
              <button 
                className="close-btn"
                onClick={() => setShowKpiAssignModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="nodes-checklist">
              {workflowNodes.map((node) => (
                <div key={node.id} className="node-checkbox-item">
                  <input
                    type="checkbox"
                    className="node-checkbox"
                    id={`node-${node.id}`}
                    defaultChecked={kpis.find(k => k.id === kpiToAssign)?.assignedNodes.includes(node.id)}
                  />
                  <label htmlFor={`node-${node.id}`}>{node.name}</label>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowKpiAssignModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  const selectedNodes = Array.from(document.querySelectorAll('.node-checkbox:checked'))
                    .map(checkbox => checkbox.id.replace('node-', ''));
                  assignKpiToNodes(selectedNodes);
                }}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Node Data Panel */}
      {showNodePanel && selectedNode && (
        <div className="data-panel">
          <div className="panel-header">
            <h4 className="panel-title">{selectedNode.name}</h4>
            <button 
              className="close-btn"
              onClick={() => setShowNodePanel(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="panel-body">
            <div className="metrics-grid">
              {getNodeData(selectedNode.id).metrics.map((metric, index) => (
                <div key={index} className="metric-item">
                  <div className="metric-value">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    <span style={{ fontSize: '9px', marginLeft: '2px' }}>{metric.unit}</span>
                  </div>
                  <div className="metric-name">{metric.name}</div>
                </div>
              ))}
            </div>

            <div className="properties-section">
              <h5 className="section-title-small">Propiedades del Nodo</h5>
              {Object.entries(getNodeData(selectedNode.id).properties).map(([key, value]) => (
                <div key={key} className="property-item">
                  <span className="property-label">{key}</span>
                  <span className="property-value">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="logs-list">
              <h5 className="section-title-small">Registro de Eventos</h5>
              {getNodeData(selectedNode.id).logs.map((log, index) => (
                <div key={index} className="log-item">
                  <div className="log-timestamp">
                    {new Date(log.timestamp).toLocaleString('es-ES')}
                  </div>
                  <div className="log-event">{log.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Connection Data Panel */}
      {showConnectionData && selectedConnection && (
        <div className="data-panel" style={{ right: '320px', left: 'auto' }}>
          <div className="panel-header">
            <h4 className="panel-title">Datos de Conexión</h4>
            <button 
              className="close-btn"
              onClick={() => setShowConnectionData(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="panel-body">
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-value">
                  {getConnectionData(selectedConnection.id || 'default').throughput}
                </div>
                <div className="metric-name">Throughput/min</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">
                  {getConnectionData(selectedConnection.id || 'default').latency}ms
                </div>
                <div className="metric-name">Latencia</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">
                  {getConnectionData(selectedConnection.id || 'default').errorRate}%
                </div>
                <div className="metric-name">Tasa Error</div>
              </div>
              <div className="metric-item">
                <div className="metric-value" style={{ 
                  color: getConnectionData(selectedConnection.id || 'default').status === 'healthy' ? '#10b981' : '#ef4444' 
                }}>
                  {getConnectionData(selectedConnection.id || 'default').status === 'healthy' ? 'Sano' : 'Error'}
                </div>
                <div className="metric-name">Estado</div>
              </div>
            </div>

            <div className="properties-section">
              <h5 className="section-title-small">Condiciones de Flujo</h5>
              {getConnectionData(selectedConnection.id || 'default').conditions.map((condition, index) => (
                <div key={index} className="property-item">
                  <span className="property-label">{condition.type.toUpperCase()}</span>
                  <span className="property-value">{condition.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;