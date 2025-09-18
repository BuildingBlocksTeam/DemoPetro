import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Settings, BarChart3, Zap, Activity,
  MapPin, Layers, Truck, HardHat, Wrench, Play, Clipboard,
  Building2, Factory, Gauge, Package, Circle, X, Check,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Eye, Link2, Edit3,
  Database, TrendingUp, TrendingDown, Target, DollarSign, Clock,
  MessageCircle, Send, Bot, User, Lightbulb, AlertTriangle,
  RotateCcw, Filter, RefreshCw, GitBranch, Workflow, Move,
  Hash, Calendar, ToggleLeft, FileText, Cloud, Server, Type,
  Save, Info, Users, Tag, Folder, PieChart,
  AreaChart, Shuffle, Calculator, Brain, Beaker
} from 'lucide-react';

import { 
  LineChart, Line, AreaChart as RechartsAreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Pie
} from 'recharts';

 import AIChat from './AIChat';
 import DataSourceEditor from './DataSourceEditor';

const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect, onBack, draggingNode, setDraggingNode, dragOffset, setDragOffset }) => {
  // Estados del canvas (existentes)
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // Estados de paneles y modales (existentes + nuevos)
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showConnectionData, setShowConnectionData] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showEditWorkflowModal, setShowEditWorkflowModal] = useState(false);
  const [showEditKpiModal, setShowEditKpiModal] = useState(false);
  const [showEditNodeModal, setShowEditNodeModal] = useState(false);
  const [showDataSourceEditor, setShowDataSourceEditor] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [showChartsSection, setShowChartsSection] = useState(true);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, nodeId: null });
  
  // Estados de workflow (existentes)
  const [workflowNodes, setWorkflowNodes] = useState(workflow?.nodes || []);
  const [workflowConnections, setWorkflowConnections] = useState(workflow?.connections || []);
  const [workflowData, setWorkflowData] = useState({
    name: workflow?.name || 'Nuevo Digital Twin',
    description: workflow?.description || 'Descripción del proyecto',
    budget: workflow?.budget || '$500K',
    timeline: workflow?.timeline || '6 meses',
    owner: workflow?.owner || 'Sin asignar',
    priority: workflow?.priority || 'Alta',
    status: workflow?.status || 'En progreso'
  });
  
  // Estados de conexión (existentes)
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  
  // Estados de AI Chat (existentes)
  const [aiChatMinimized, setAiChatMinimized] = useState(true);
  
  // Estados de KPIs (existentes)
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
      assignedNodes: ['node_1', 'node_2'],
      description: 'Mide el rendimiento general del sistema',
      target: 95,
      frequency: 'diario'
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
      assignedNodes: [],
      description: 'Índice de rendimiento de costos',
      target: 1.0,
      frequency: 'semanal'
    }
  ]);
  const [editingKpi, setEditingKpi] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [showKpiAssignModal, setShowKpiAssignModal] = useState(false);
  const [kpiToAssign, setKpiToAssign] = useState(null);

  // Estados mejorados para What-If scenarios
  const [whatIfScenario, setWhatIfScenario] = useState({
    selectedNodeId: null,
    nodeChanges: {
      duration: { current: 0, modified: 0, unit: 'días' },
      cost: { current: 0, modified: 0, unit: 'USD' },
      efficiency: { current: 0, modified: 0, unit: '%' },
      resources: { current: 0, modified: 0, unit: 'personas' }
    },
    predictions: null,
    isAnalyzing: false
  });

  // Datos por defecto basados en ProjectData (integración)
  const [defaultDataSources] = useState([
    {
      id: 1,
      name: 'Fuente Principal',
      type: 'excel',
      status: 'connected',
      lastSync: new Date().toISOString(),
      records: 1247,
      size: '2.3 MB',
      description: 'Datos principales del proyecto',
      schema: [
        { field: 'process_id', type: 'string', sample: 'PROC-001', description: 'Identificador del proceso' },
        { field: 'efficiency_rate', type: 'percentage', sample: 87.3, description: 'Tasa de eficiencia' },
        { field: 'processing_time', type: 'number', sample: 45, description: 'Tiempo de procesamiento en minutos' },
        { field: 'cost_per_unit', type: 'currency', sample: 125.50, description: 'Costo por unidad procesada' },
        { field: 'quality_score', type: 'percentage', sample: 94.2, description: 'Puntuación de calidad' },
        { field: 'operator_id', type: 'string', sample: 'OP-001', description: 'Identificador del operador' },
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15T10:30:00Z', description: 'Marca temporal' }
      ],
      icon: '📊'
    },
    {
      id: 2,
      name: 'Sensores IoT',
      type: 'iot',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000).toISOString(),
      records: 15420,
      size: '45 MB',
      description: 'Datos en tiempo real de sensores',
      schema: [
        { field: 'sensor_id', type: 'string', sample: 'TEMP-001', description: 'ID del sensor' },
        { field: 'temperature', type: 'number', sample: 24.5, description: 'Temperatura en Celsius' },
        { field: 'humidity', type: 'percentage', sample: 65.2, description: 'Humedad relativa' },
        { field: 'pressure', type: 'number', sample: 1013.25, description: 'Presión en mbar' },
        { field: 'vibration', type: 'number', sample: 0.8, description: 'Nivel de vibración' }
      ],
      icon: '📡'
    },
    {
      id: 3,
      name: 'Sistema ERP',
      type: 'database',
      status: 'warning',
      lastSync: new Date(Date.now() - 900000).toISOString(),
      records: 8750,
      size: '12 MB',
      description: 'Datos financieros y de recursos',
      schema: [
        { field: 'cost_center', type: 'string', sample: 'CC-001', description: 'Centro de costos' },
        { field: 'budget_used', type: 'currency', sample: 125000, description: 'Presupuesto utilizado' },
        { field: 'resource_allocation', type: 'percentage', sample: 87.5, description: 'Asignación de recursos' },
        { field: 'department', type: 'string', sample: 'Operations', description: 'Departamento' }
      ],
      icon: '🏢'
    }
  ]);
  
  const canvasRef = useRef(null);

  // Datos para gráficas (nuevos)
  const chartData = {
    efficiency: [
      { name: 'Ene', value: 85, target: 90 },
      { name: 'Feb', value: 87, target: 90 },
      { name: 'Mar', value: 89, target: 90 },
      { name: 'Abr', value: 92, target: 90 },
      { name: 'May', value: 88, target: 90 },
      { name: 'Jun', value: 94, target: 90 }
    ],
    costs: [
      { name: 'Planificación', value: 15000, budget: 20000 },
      { name: 'Desarrollo', value: 45000, budget: 50000 },
      { name: 'Testing', value: 12000, budget: 15000 },
      { name: 'Implementación', value: 28000, budget: 30000 },
      { name: 'Mantenimiento', value: 8000, budget: 10000 }
    ],
    nodeStatus: [
      { name: 'Completado', value: 12, color: '#10b981' },
      { name: 'En progreso', value: 8, color: '#3b82f6' },
      { name: 'Pendiente', value: 5, color: '#f59e0b' },
      { name: 'Bloqueado', value: 2, color: '#ef4444' }
    ],
    timeline: [
      { name: 'Sem 1', planned: 20, actual: 18 },
      { name: 'Sem 2', planned: 35, actual: 32 },
      { name: 'Sem 3', planned: 50, actual: 48 },
      { name: 'Sem 4', planned: 65, actual: 70 },
      { name: 'Sem 5', planned: 80, actual: 75 },
      { name: 'Sem 6', planned: 95, actual: 85 }
    ]
  };

  // Tipos de nodos (existente)
  const nodeTypes = [
    { id: 'process', name: 'Proceso', icon: Activity, color: '#3b82f6', description: 'Proceso de negocio' },
    { id: 'decision', name: 'Decisión', icon: Layers, color: '#f59e0b', description: 'Punto de decisión' },
    { id: 'data', name: 'Datos', icon: Gauge, color: '#10b981', description: 'Fuente de datos' },
    { id: 'integration', name: 'Integración', icon: Zap, color: '#8b5cf6', description: 'Integración de sistemas' },
    { id: 'output', name: 'Salida', icon: Play, color: '#06b6d4', description: 'Resultado final' },
    { id: 'control', name: 'Control', icon: Settings, color: '#ef4444', description: 'Control de calidad' },
    { id: 'condition', name: 'Condición', icon: GitBranch, color: '#8b5cf6', description: 'Condición lógica' },
    { id: 'automation', name: 'Automatización', icon: Workflow, color: '#f97316', description: 'Proceso automatizado' }
  ];

  // Funciones existentes (mantener todas las funciones utilitarias existentes)
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

  // Nueva función mejorada para analizar escenarios What-If
  const analyzeWhatIfScenario = async () => {
    setWhatIfScenario(prev => ({ ...prev, isAnalyzing: true }));

    // Simular análisis de IA
    setTimeout(() => {
      const { selectedNodeId, nodeChanges } = whatIfScenario;
      const selectedNode = workflowNodes.find(n => n.id === selectedNodeId);
      
      if (!selectedNode) {
        setWhatIfScenario(prev => ({ ...prev, isAnalyzing: false }));
        return;
      }

      const durationChange = nodeChanges.duration.modified - nodeChanges.duration.current;
      const costChange = nodeChanges.cost.modified - nodeChanges.cost.current;
      const efficiencyChange = nodeChanges.efficiency.modified - nodeChanges.efficiency.current;
      const resourceChange = nodeChanges.resources.modified - nodeChanges.resources.current;

      const predictions = {
        impact: 'medium',
        risks: [],
        benefits: [],
        recommendations: [],
        confidence: 82
      };

      // Lógica avanzada de predicciones basada en el tipo de nodo y cambios
      const nodeType = selectedNode.type;

      // Análisis de duración
      if (durationChange < 0) {
        const reduction = Math.abs(durationChange);
        if (reduction > 5) {
          predictions.benefits.push(`Reducir ${reduction} días en '${selectedNode.name}' acelerará la entrega del proyecto en un 15-20%.`);
          predictions.risks.push(`Comprimir el tiempo puede generar sobrecarga en recursos y aumentar la tasa de errores en un 12%.`);
          predictions.recommendations.push(`Implementar controles de calidad adicionales para mantener estándares durante la aceleración.`);
          if (nodeType === 'process') {
            predictions.risks.push(`Los procesos acelerados requieren 25% más supervisión para evitar desviaciones de calidad.`);
          }
        } else {
          predictions.benefits.push(`Optimización menor de tiempo mejorará la eficiencia sin riesgos significativos.`);
        }
      } else if (durationChange > 0) {
        predictions.risks.push(`Extender el tiempo de '${selectedNode.name}' puede retrasar nodos dependientes y aumentar costos operativos.`);
        predictions.benefits.push(`Mayor tiempo permitirá mejor calidad de ejecución y reducción de retrabajo.`);
      }

      // Análisis de costos
      if (costChange < 0) {
        const savings = Math.abs(costChange);
        predictions.benefits.push(`Ahorro de $${savings.toLocaleString()} mejorará el ROI del proyecto en un 8-12%.`);
        if (savings > 10000) {
          predictions.recommendations.push(`Verificar que la reducción de costos no comprometa la calidad de entregables.`);
        }
        if (nodeType === 'integration' || nodeType === 'automation') {
          predictions.risks.push(`Recortes en nodos técnicos pueden afectar la robustez y escalabilidad del sistema.`);
        }
      } else if (costChange > 0) {
        const increase = costChange;
        predictions.risks.push(`Incremento de $${increase.toLocaleString()} puede exceder el presupuesto asignado.`);
        if (increase > 20000) {
          predictions.recommendations.push(`Reevaluar la justificación del incremento y buscar alternativas más económicas.`);
          predictions.impact = 'high';
        }
      }

      // Análisis de eficiencia
      if (efficiencyChange > 0) {
        predictions.benefits.push(`Mejorar la eficiencia a ${nodeChanges.efficiency.modified}% optimizará el uso de recursos y reducirá desperdicios.`);
        if (nodeType === 'data' || nodeType === 'integration') {
          predictions.benefits.push(`Mayor eficiencia en nodos de datos mejorará la velocidad de procesamiento general.`);
        }
      } else if (efficiencyChange < 0) {
        predictions.risks.push(`Reducir eficiencia puede generar cuellos de botella y aumentar tiempos de ciclo.`);
        predictions.recommendations.push(`Identificar las causas de la reducción de eficiencia antes de implementar cambios.`);
      }

      // Análisis de recursos
      if (resourceChange > 0) {
        predictions.benefits.push(`Asignar ${resourceChange} recursos adicionales acelerará la ejecución y reducirá riesgos de retrasos.`);
        predictions.risks.push(`Incremento de recursos aumentará costos operativos en un 15-25%.`);
        if (nodeType === 'process' || nodeType === 'automation') {
          predictions.recommendations.push(`Asegurar que los nuevos recursos tengan la capacitación adecuada para el tipo de proceso.`);
        }
      } else if (resourceChange < 0) {
        const reduction = Math.abs(resourceChange);
        predictions.risks.push(`Reducir ${reduction} recursos puede generar sobrecarga en el equipo restante y afectar la moral.`);
        predictions.recommendations.push(`Evaluar la redistribución de tareas y considerar automatización para compensar.`);
      }

      // Análisis específico por tipo de nodo
      switch (nodeType) {
        case 'data':
          if (durationChange < 0 || efficiencyChange > 0) {
            predictions.benefits.push(`Optimizaciones en nodos de datos tienen efectos multiplicadores en nodos posteriores.`);
          }
          break;
        case 'control':
          if (durationChange < 0) {
            predictions.risks.push(`Acelerar controles de calidad puede aumentar defectos no detectados en un 18%.`);
          }
          break;
        case 'decision':
          predictions.recommendations.push(`Los nodos de decisión impactan múltiples rutas - considerar análisis de sensibilidad.`);
          break;
        case 'integration':
          predictions.risks.push(`Cambios en nodos de integración requieren pruebas exhaustivas con sistemas conectados.`);
          break;
      }

      // Ajustar confianza basada en complejidad de cambios
      let confidenceAdjust = 0;
      if (Math.abs(durationChange) > 10) confidenceAdjust -= 5;
      if (Math.abs(costChange) > 30000) confidenceAdjust -= 8;
      if (Math.abs(efficiencyChange) > 15) confidenceAdjust -= 6;
      if (Math.abs(resourceChange) > 5) confidenceAdjust -= 4;
      
      predictions.confidence = Math.max(65, Math.min(95, predictions.confidence + confidenceAdjust));

      setWhatIfScenario(prev => ({
        ...prev,
        predictions,
        isAnalyzing: false
      }));
    }, 2500);
  };

  // Nueva función para seleccionar nodo para What-If
  const selectNodeForWhatIf = (nodeId) => {
    const node = workflowNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Extraer valores actuales del nodo
    const currentDuration = parseInt(node.duration.replace(/\D/g, '')) || 30;
    const currentCost = parseInt(node.cost.replace(/[^\d]/g, '')) || 50000;
    const currentEfficiency = Math.floor(Math.random() * 20 + 80); // Simulated
    const currentResources = Math.floor(Math.random() * 10 + 5); // Simulated

    setWhatIfScenario({
      selectedNodeId: nodeId,
      nodeChanges: {
        duration: { current: currentDuration, modified: currentDuration, unit: 'días' },
        cost: { current: currentCost, modified: currentCost, unit: 'USD' },
        efficiency: { current: currentEfficiency, modified: currentEfficiency, unit: '%' },
        resources: { current: currentResources, modified: currentResources, unit: 'personas' }
      },
      predictions: null,
      isAnalyzing: false
    });
  };

  // Datos simulados expandidos (mantener función existente)
  const getNodeData = (nodeId) => ({
    metrics: [
      { name: 'Eficiencia', value: 87.3, unit: '%', trend: 'up', target: 90 },
      { name: 'Costo', value: 125000, unit: 'USD', trend: 'stable', budget: 150000 },
      { name: 'Tiempo', value: 45, unit: 'días', trend: 'down', planned: 50 },
      { name: 'Recursos', value: 12, unit: 'personas', trend: 'up', allocated: 15 },
      { name: 'Calidad', value: 94.2, unit: '%', trend: 'up', standard: 95 },
      { name: 'Riesgo', value: 3.1, unit: '/10', trend: 'down', acceptable: 4 }
    ],
    logs: [
      { timestamp: '2024-01-15T16:30:00Z', event: 'Proceso iniciado', type: 'info', user: 'Sistema' },
      { timestamp: '2024-01-15T14:22:00Z', event: 'Validación completada', type: 'success', user: 'Ana García' },
      { timestamp: '2024-01-15T12:15:00Z', event: 'Recursos asignados', type: 'info', user: 'Juan Pérez' },
      { timestamp: '2024-01-15T10:30:00Z', event: 'Configuración actualizada', type: 'warning', user: 'Sistema' },
      { timestamp: '2024-01-15T09:15:00Z', event: 'Alerta de rendimiento', type: 'error', user: 'Monitor' }
    ],
    properties: {
      owner: 'Juan Pérez',
      priority: 'Alta',
      deadline: '2024-02-15',
      budget: '$125,000',
      resources: ['Equipo A', 'Equipo B', 'Consultor externo'],
      dependencies: ['Node_001', 'Node_003'],
      tags: ['crítico', 'financiero', 'automatizable'],
      location: 'Oficina Central',
      department: 'Operaciones'
    },
    realTimeData: {
      currentStatus: 'En ejecución',
      lastUpdate: new Date().toISOString(),
      activeConnections: 3,
      throughput: '1.2K/min',
      errorRate: '0.1%',
      uptime: '99.8%'
    }
  });

  // Mantener todas las funciones de manejo de eventos existentes...
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
            progress: Math.floor(Math.random() * 100),
            conditions: [],
            type: 'data_flow'
          };
          setWorkflowConnections([...workflowConnections, newConnection]);
        }
        setConnectionStart(null);
        setConnectingMode(false);
      }
      return;
    }
    
    if (e.button === 2) {
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        nodeId: nodeId
      });
      return;
    }
    
    if (e.button === 0) {
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
    setShowNodeModal(true);
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  // Mantener todas las demás funciones existentes (handleConnectionClick, addNewNode, etc...)
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
        x: 200 + Math.random() * 600, 
        y: 150 + Math.random() * 400 
      },
      kpis: { efficiency: '0%', quality: '0%', completion: '0%' },
      automations: [],
      dataSources: [],
      description: nodeType.description,
      priority: 'Media',
      owner: 'Sin asignar'
    };
    
    setWorkflowNodes([...workflowNodes, newNode]);
    setShowAddNodeModal(false);
  };

  // Mantener todas las demás funciones de canvas, KPIs, etc. del código original...
  const deleteNode = (nodeId) => {
    setWorkflowNodes(workflowNodes.filter(node => node.id !== nodeId));
    setWorkflowConnections(workflowConnections.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  const updateNode = (nodeId, updates) => {
    setWorkflowNodes(nodes => 
      nodes.map(node => node.id === nodeId ? { ...node, ...updates } : node)
    );
  };

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
      assignedNodes: [],
      description: '',
      target: 100,
      frequency: 'diario'
    };
    setKpis([...kpis, newKpi]);
    setEditingKpi(newKpi);
    setShowEditKpiModal(true);
  };

  const updateKpi = (kpiId, updates) => {
    setKpis(kpis.map(kpi => kpi.id === kpiId ? { ...kpi, ...updates } : kpi));
  };

  const deleteKpi = (kpiId) => {
    setKpis(kpis.filter(kpi => kpi.id !== kpiId));
  };

  // Mantener funciones de canvas existentes...
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

      const newX = Math.max(50, Math.min(mouseX - dragOffset.x, 1500));
      const newY = Math.max(50, Math.min(mouseY - dragOffset.y, 800));

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
    const newScale = Math.max(0.3, Math.min(canvasScale * scaleChange, 3));
    setCanvasScale(newScale);
  }, [canvasScale]);

  const zoomIn = () => setCanvasScale(prev => Math.min(prev * 1.2, 3));
  const zoomOut = () => setCanvasScale(prev => Math.max(prev / 1.2, 0.3));

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

  // Función para cerrar modal de nodo
  const closeNodeModal = () => {
    setShowNodeModal(false);
    onNodeSelect(null);
  };

  // Componente de nodo (mantener existente)
  const NodeComponent = ({ node, onClick }) => {
    const statusColors = getStatusColor(node.status);
    const IconComponent = getNodeIcon(node);
    const isSelected = connectionStart === node.id || selectedNode?.id === node.id;
    const assignedKpis = kpis.filter(kpi => kpi.assignedNodes.includes(node.id));
    
    return (
      <g 
        className={`workflow-node ${draggingNode === node.id ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        onClick={() => onClick && onClick(node)}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: draggingNode === node.id ? 'grabbing' : connectingMode ? 'crosshair' : 'grab' }}
      >
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="200" 
          height="140"
          rx="16"
          fill="white"
          stroke={isSelected ? '#3b82f6' : statusColors.border}
          strokeWidth={isSelected ? "3" : "2"}
          filter="drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15))"
        />
        
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="200" 
          height="8"
          rx="8"
          fill={statusColors.main}
        />
        
        <circle
          cx={node.position.x + 30}
          cy={node.position.y + 40}
          r="18"
          fill={statusColors.bg}
          stroke={statusColors.main}
          strokeWidth="2"
        />
        
        <foreignObject
          x={node.position.x + 21}
          y={node.position.y + 31}
          width="18"
          height="18"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={16} color={statusColors.main} />
          </div>
        </foreignObject>
        
        <text
          x={node.position.x + 60} 
          y={node.position.y + 30}
          fontSize="14"
          fontWeight="700"
          fill="#1f2937"
          textAnchor="start"
        >
          {node.name.length > 18 ? node.name.substring(0, 16) + '...' : node.name}
        </text>
        
        <text
          x={node.position.x + 60} 
          y={node.position.y + 48}
          fontSize="11"
          fill="#6b7280"
          textAnchor="start"
          textTransform="uppercase"
          fontWeight="600"
        >
          {node.type} • {node.status}
        </text>
        
        <text
          x={node.position.x + 16} 
          y={node.position.y + 75}
          fontSize="11"
          fill="#374151"
          fontWeight="600"
        >
          {node.duration} • {node.cost}
        </text>
        
        <text
          x={node.position.x + 16} 
          y={node.position.y + 90}
          fontSize="10"
          fill="#6b7280"
        >
          Owner: {node.owner || 'Sin asignar'}
        </text>
        
        <rect
          x={node.position.x + 16} 
          y={node.position.y + 100}
          width="168" 
          height="8"
          rx="4"
          fill="#f3f4f6"
        />
        <rect
          x={node.position.x + 16} 
          y={node.position.y + 100}
          width={168 * (node.progress / 100)} 
          height="8"
          rx="4"
          fill={statusColors.main}
        />
        
        <text
          x={node.position.x + 100} 
          y={node.position.y + 125}
          fontSize="11"
          fill={statusColors.text}
          textAnchor="middle"
          fontWeight="700"
        >
          {node.progress}%
        </text>
        
        {assignedKpis.slice(0, 3).map((kpi, index) => (
          <circle
            key={kpi.id}
            cx={node.position.x + 160 + (index * 14)}
            cy={node.position.y + 30}
            r="5"
            fill={kpi.color}
            title={kpi.name}
          />
        ))}
        
        {node.priority === 'Alta' && (
          <rect
            x={node.position.x + 170}
            y={node.position.y + 45}
            width="20"
            height="12"
            rx="6"
            fill="#ef4444"
          />
        )}
      </g>
    );
  };

  return (
    <div className="main-container">
      <style jsx>{`
        .main-container {
          display: flex;
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
        }

        .canvas-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 32px 36px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          z-index: 5;
        }

        .canvas-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .canvas-title-section {
          flex: 1;
        }

        .canvas-title {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .edit-title-btn {
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
        }

        .edit-title-btn:hover {
          background: #f8fafc;
          color: #374151;
        }

        .canvas-subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .canvas-actions {
          display: flex;
          gap: 14px;
        }

        .action-btn {
          padding: 12px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .action-btn.primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .action-btn.primary:hover {
          background: #2563eb;
        }

        .canvas-stats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 36px;
          padding: 8px 0;
        }

        .canvas-stat {
          text-align: center;
          padding: 20px 0;
          background: linear-gradient(135deg, #f8fafc, white);
          border-radius: 12px;
          border: 1px solid #e5e8eb;
          transition: all 0.2s ease;
        }

        .canvas-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .canvas-stat-value {
          font-size: 28px;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 8px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .canvas-stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .canvas-area {
          flex: ${showChartsSection ? '1' : '1'};
          position: relative;
          overflow: hidden;
          background: linear-gradient(45deg, #fafbfc 25%, transparent 25%, transparent 75%, #fafbfc 75%), 
                      linear-gradient(45deg, #fafbfc 25%, transparent 25%, transparent 75%, #fafbfc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          transition: flex 0.3s ease;
          min-height: ${showChartsSection ? '50vh' : 'auto'};
        }

        .canvas-controls {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          z-index: 20;
        }

        .control-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px;
          display: flex;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 30;
        }

        .automation-btn {
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
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
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
        }

        .workflow-node.dragging {
          filter: drop-shadow(0 12px 32px rgba(0, 0, 0, 0.3));
        }

        .workflow-node.selected {
          filter: drop-shadow(0 0 24px rgba(59, 130, 246, 0.6));
        }

        .connection-line {
          stroke: #94a3b8;
          strokeWidth: 3;
          strokeDasharray: 6 6;
          fill: none;
          opacity: 0.7;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .connection-line:hover {
          stroke: #3b82f6;
          strokeWidth: 4;
          opacity: 1;
          strokeDasharray: none;
        }

        .connection-progress {
          stroke: #10b981;
          strokeWidth: 4;
          fill: none;
          cursor: pointer;
        }

        /* Nueva sección de gráficas */
        .charts-section {
          flex: 0 0 auto;
          background: white;
          border-top: 1px solid #e2e8f0;
          overflow-y: visible;
          transition: all 0.3s ease;
          min-height: fit-content;
        }

        .charts-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }

        .charts-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .charts-toggle {
          display: flex;
          gap: 8px;
        }

        .toggle-btn {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .toggle-btn:hover, .toggle-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding: 20px 24px;
        }

        .chart-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Modal mejorado para detalles de nodo */
        .node-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .node-modal-content {
          background: white;
          border-radius: 16px;
          padding: 0;
          max-width: 1000px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
        }

        .node-modal-header {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .node-modal-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .node-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .node-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .node-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e8eb;
        }

        .metrics-grid-modal {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .metric-card {
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 16px;
        }

        .metric-value-large {
          font-size: 24px;
          font-weight: 800;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .property-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .property-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .property-value {
          font-size: 13px;
          color: #1a1d21;
          font-weight: 600;
        }

        .logs-container {
          max-height: 200px;
          overflow-y: auto;
        }

        .log-entry {
          padding: 12px;
          background: #f8fafc;
          border-left: 4px solid #3b82f6;
          border-radius: 0 8px 8px 0;
          margin-bottom: 8px;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .log-time {
          font-size: 11px;
          color: #6b7280;
        }

        .log-user {
          font-size: 11px;
          color: #3b82f6;
          font-weight: 600;
        }

        .log-message {
          font-size: 13px;
          color: #1a1d21;
        }

        /* Modal para What-If */
        .whatif-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .whatif-modal-content {
          background: white;
          border-radius: 16px;
          padding: 0;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .whatif-header {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .whatif-body {
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-height: 65vh;
          overflow-y: auto;
        }

        .node-selector-section {
          grid-column: 1 / -1;
          margin-bottom: 16px;
        }

        .node-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .node-selector-btn {
          padding: 12px 16px;
          border: 2px solid #e5e8eb;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .node-selector-btn:hover {
          border-color: #6366f1;
          background: #f8fafc;
        }

        .node-selector-btn.selected {
          border-color: #6366f1;
          background: #6366f1;
          color: white;
        }

        .variables-section, .predictions-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .variable-control {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .variable-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .variable-input {
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .variable-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .variable-current {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .predictions-container {
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 16px;
          min-height: 300px;
        }

        .prediction-item {
          padding: 10px 0;
          border-bottom: 1px solid #e5e8eb;
        }

        .prediction-item:last-child {
          border-bottom: none;
        }

        .prediction-type {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .prediction-type.benefits {
          color: #10b981;
        }

        .prediction-type.risks {
          color: #ef4444;
        }

        .prediction-type.recommendations {
          color: #f59e0b;
        }

        .prediction-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
        }

        .confidence-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #6366f1;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .analyzing-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          flex-direction: column;
          gap: 12px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .whatif-actions {
          padding: 24px;
          border-top: 1px solid #e5e8eb;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        /* Resto de estilos existentes */
        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 30;
        }

        .back-button:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .kpi-sidebar {
          width: 320px;
          background: white;
          border-left: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }

        .sidebar-header {
          padding: 20px;
          justify-content: space-between;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }


        .add-kpi-btn {
          padding: 8px;
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
          padding: 16px;
        }

        .kpi-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .kpi-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .kpi-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .kpi-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .kpi-actions {
          display: flex;
          gap: 4px;
        }

        .kpi-action-btn {
          padding: 4px;
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
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 800;
          color: #1f2937;
        }

        .kpi-unit {
          font-size: 14px;
          color: #6b7280;
          margin-left: 4px;
        }

        .kpi-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
        }

        .kpi-name {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .kpi-description {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .kpi-assignments {
          font-size: 11px;
        }

        .assignments-label {
          color: #6b7280;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }

        .assigned-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }

        .node-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        .no-assignments {
          color: #9ca3af;
          font-style: italic;
        }

        .assign-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          padding: 4px 8px;
          font-size: 10px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .assign-btn:hover {
          background: #e5e7eb;
        }

        /* Modal styles (mantener estilos existentes pero optimizados) */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 28px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          color: #6b7280;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .node-types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .node-type-btn {
          padding: 16px;
          border: 1px solid #e5e8eb;
          border-radius: 10px;
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
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .node-type-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .node-type-name {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .node-type-desc {
          font-size: 11px;
          color: #6b7280;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e8eb;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
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
          background: white;
          color: #374151;
          border: 1px solid #e5e8eb;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        .context-menu {
          position: fixed;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 10px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 180px;
          overflow: hidden;
        }

        .context-menu-item {
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
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

        @media (max-width: 1400px) {
          .kpi-sidebar {
            width: 280px;
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1024px) {
          .canvas-stats {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }

          .node-modal-body {
            grid-template-columns: 1fr;
          }

          .whatif-body {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="content-area">
        <div className="workflow-canvas-container">
          <div className="canvas-header">
            <div className="canvas-header-top">
              <div className="canvas-title-section">
                <h2 className="canvas-title">
                  {workflowData.name}
                  <button 
                    className="edit-title-btn" 
                    onClick={() => setShowEditWorkflowModal(true)}
                    title="Editar Digital Twin"
                  >
                    <Edit3 size={14} />
                  </button>
                </h2>
                <p className="canvas-subtitle">{workflowData.description}</p>
              </div>
              
              <div className="canvas-actions">
                <button 
                  className="action-btn"
                  onClick={() => setShowDataSourceEditor(true)}
                  title="Fuentes de Datos"
                >
                  <Database size={16} />
                  Datos
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setShowWhatIfModal(true)}
                  title="Análisis What-If"
                >
                  <Brain size={16} />
                  What-If
                </button>
                <button 
                  className="action-btn primary"
                  title="Guardar Cambios"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </div>
          </div>

          <div className="canvas-area">
            <div className="canvas-controls">
              <button className="control-btn" onClick={zoomIn} title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button className="control-btn" onClick={zoomOut} title="Zoom Out">
                <ZoomOut size={18} />
              </button>
            </div>

            <div className="automation-controls">
              <button 
                className={`automation-btn ${connectingMode ? 'active' : ''}`}
                onClick={() => setConnectingMode(!connectingMode)}
                title="Modo Conexión"
              >
                <Link2 size={16} />
                {connectingMode ? 'Cancelar Conexión' : 'Conectar Nodos'}
              </button>
              <button 
                className="automation-btn"
                onClick={() => setShowAddNodeModal(true)}
                title="Añadir Nuevo Nodo"
              >
                <Plus size={16} />
                Añadir Nodo
              </button>
            </div>

            <svg 
              ref={canvasRef}
              className="workflow-canvas-svg" 
              viewBox="0 0 1600 1000" 
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={handleCanvasMouseDown}
              onWheel={handleWheel}
            >
              <defs>
                <marker id="arrowhead" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
                  <polygon points="0 0, 12 5, 0 10" fill="#94a3b8" />
                </marker>
                <marker id="arrowhead-progress" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
                  <polygon points="0 0, 12 5, 0 10" fill="#10b981" />
                </marker>
                <marker id="arrowhead-hover" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto">
                  <polygon points="0 0, 12 5, 0 10" fill="#3b82f6" />
                </marker>
              </defs>

              <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${canvasScale})`}>
                {workflowConnections?.map((conn, index) => {
                  const fromNode = workflowNodes.find(n => n.id === conn.from);
                  const toNode = workflowNodes.find(n => n.id === conn.to);
                  
                  if (!fromNode || !toNode) return null;

                  const x1 = fromNode.position.x + 200;
                  const y1 = fromNode.position.y + 70;
                  const x2 = toNode.position.x;
                  const y2 = toNode.position.y + 70;
                  
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

          {/* Nueva sección de gráficas */}
          {showChartsSection && (
            <div className="charts-section">
              <div className="charts-header">
                <h3 className="charts-title">
                  <BarChart3 size={20} />
                  Análisis del Proyecto
                </h3>
                <div className="charts-toggle">
                  <button 
                    className="toggle-btn active"
                    onClick={() => setShowChartsSection(false)}
                    title="Ocultar Gráficas"
                  >
                    <Minimize2 size={14} />
                    Ocultar
                  </button>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h4 className="chart-title">
                    <TrendingUp size={16} />
                    Eficiencia vs Objetivo
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData.efficiency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e8eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        name="Eficiencia Actual"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#f59e0b" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        name="Objetivo"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">
                    <DollarSign size={16} />
                    Costos por Fase
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData.costs}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e8eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" name="Costo Actual" />
                      <Bar dataKey="budget" fill="#e5e8eb" name="Presupuesto" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">
                    <Activity size={16} />
                    Estado de Nodos
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.nodeStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                        fontSize={12}
                      >
                        {chartData.nodeStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">
                    <Clock size={16} />
                    Progreso vs Planificado
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsAreaChart data={chartData.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e8eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="planned" 
                        stackId="1" 
                        stroke="#f59e0b" 
                        fill="#fef3c7" 
                        name="Planificado"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="actual" 
                        stackId="2" 
                        stroke="#3b82f6" 
                        fill="#dbeafe" 
                        name="Real"
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Botón para mostrar gráficas cuando están ocultas */}
          {!showChartsSection && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20
            }}>
              <button 
                className="control-btn"
                onClick={() => setShowChartsSection(true)}
                title="Mostrar Gráficas"
              >
                <BarChart3 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Sidebar */}
      <div className="kpi-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">KPIs del Sistema</h3>
          <button className="add-kpi-btn" onClick={addKpi}>
            <Plus size={16} />
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
                    <IconComponent size={14} />
                  </div>
                  <div className="kpi-actions">
                    <button 
                      className="kpi-action-btn"
                      onClick={() => {
                        setEditingKpi(kpi);
                        setShowEditKpiModal(true);
                      }}
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      className="kpi-action-btn"
                      onClick={() => deleteKpi(kpi.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="kpi-value-section">
                  <div className="kpi-value">
                    {kpi.value}
                    <span className="kpi-unit">{kpi.unit}</span>
                  </div>
                  <div className="kpi-change" style={{ color: kpi.trend === 'up' ? '#10b981' : '#ef4444' }}>
                    <TrendIcon size={12} />
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                
                <div className="kpi-name">{kpi.name}</div>
                <div className="kpi-description">{kpi.description}</div>
                
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
                            {node.name.length > 10 ? node.name.substring(0, 8) + '...' : node.name}
                          </span>
                        ) : null;
                      })
                    )}
                  </div>
                  <button 
                    className="assign-btn"
                    onClick={() => {
                      setKpiToAssign(kpi.id);
                      setShowKpiAssignModal(true);
                    }}
                  >
                    Asignar Nodos
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
        <ArrowLeft size={16} />
        Volver al Dashboard
      </button>

      {/* AI Chat Component - AGREGAR AQUÍ */}
      <AIChat 
        workflow={workflowData}
        isMinimized={aiChatMinimized}
        onToggleMinimize={() => setAiChatMinimized(!aiChatMinimized)}
        onClose={() => setAiChatMinimized(true)}
      />

      {showDataSourceEditor && (
        <div className="modal-overlay">
          <DataSourceEditor 
            initialData={{ 
              schema: defaultDataSources[0]?.schema || [],
              dataSources: defaultDataSources 
            }}
            onSave={(data) => {
              console.log('Data sources saved:', data);
              setShowDataSourceEditor(false);
            }}
            onCancel={() => setShowDataSourceEditor(false)}
          />
        </div>
      )}

      {/* Nuevo Modal Mejorado de What-If Scenarios */}
      {showWhatIfModal && (
        <div className="whatif-modal-overlay">
          <div className="whatif-modal-content">
            <div className="whatif-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Brain size={20} />
                Análisis de Escenarios What-If
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowWhatIfModal(false)}
                style={{ color: 'white' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="whatif-body">
              <div className="node-selector-section">
                <h4 style={{ margin: '0 0 8px 0', color: '#1a1d21' }}>Selecciona un nodo para analizar</h4>
                <div className="node-selector-grid">
                  {workflowNodes.map((node) => {
                    const IconComponent = getNodeIcon(node);
                    return (
                      <button
                        key={node.id}
                        className={`node-selector-btn ${whatIfScenario.selectedNodeId === node.id ? 'selected' : ''}`}
                        onClick={() => selectNodeForWhatIf(node.id)}
                      >
                        <IconComponent size={16} />
                        <span>{node.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {whatIfScenario.selectedNodeId && (
                <>
                  <div className="variables-section">
                    <h4 style={{ margin: '0 0 16px 0', color: '#1a1d21' }}>
                      Variables de '{workflowNodes.find(n => n.id === whatIfScenario.selectedNodeId)?.name}'
                    </h4>
                    
                    <div className="variable-control">
                      <label className="variable-label">Duración del Proceso</label>
                      <input
                        type="number"
                        className="variable-input"
                        value={whatIfScenario.nodeChanges.duration.modified}
                        onChange={(e) => setWhatIfScenario(prev => ({
                          ...prev,
                          nodeChanges: {
                            ...prev.nodeChanges,
                            duration: { ...prev.nodeChanges.duration, modified: parseInt(e.target.value) }
                          }
                        }))}
                      />
                      <div className="variable-current">
                        Actual: {whatIfScenario.nodeChanges.duration.current} {whatIfScenario.nodeChanges.duration.unit}
                      </div>
                    </div>

                    <div className="variable-control">
                      <label className="variable-label">Costo Total</label>
                      <input
                        type="number"
                        className="variable-input"
                        value={whatIfScenario.nodeChanges.cost.modified}
                        onChange={(e) => setWhatIfScenario(prev => ({
                          ...prev,
                          nodeChanges: {
                            ...prev.nodeChanges,
                            cost: { ...prev.nodeChanges.cost, modified: parseInt(e.target.value) }
                          }
                        }))}
                      />
                      <div className="variable-current">
                        Actual: ${whatIfScenario.nodeChanges.cost.current.toLocaleString()}
                      </div>
                    </div>

                    <div className="variable-control">
                      <label className="variable-label">Eficiencia Esperada (%)</label>
                      <input
                        type="number"
                        className="variable-input"
                        min="0"
                        max="100"
                        value={whatIfScenario.nodeChanges.efficiency.modified}
                        onChange={(e) => setWhatIfScenario(prev => ({
                          ...prev,
                          nodeChanges: {
                            ...prev.nodeChanges,
                            efficiency: { ...prev.nodeChanges.efficiency, modified: parseInt(e.target.value) }
                          }
                        }))}
                      />
                      <div className="variable-current">
                        Actual: {whatIfScenario.nodeChanges.efficiency.current}%
                      </div>
                    </div>

                    <div className="variable-control">
                      <label className="variable-label">Recursos Asignados</label>
                      <input
                        type="number"
                        className="variable-input"
                        value={whatIfScenario.nodeChanges.resources.modified}
                        onChange={(e) => setWhatIfScenario(prev => ({
                          ...prev,
                          nodeChanges: {
                            ...prev.nodeChanges,
                            resources: { ...prev.nodeChanges.resources, modified: parseInt(e.target.value) }
                          }
                        }))}
                      />
                      <div className="variable-current">
                        Actual: {whatIfScenario.nodeChanges.resources.current} personas
                      </div>
                    </div>
                  </div>

                  <div className="predictions-section">
                    <h4 style={{ margin: '0 0 16px 0', color: '#1a1d21' }}>Predicciones de IA</h4>
                    
                    <div className="predictions-container">
                      {whatIfScenario.isAnalyzing ? (
                        <div className="analyzing-spinner">
                          <div className="spinner"></div>
                          <span style={{ color: '#6b7280' }}>Analizando escenario con IA...</span>
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                            Evaluando impactos en {workflowNodes.find(n => n.id === whatIfScenario.selectedNodeId)?.type}
                          </span>
                        </div>
                      ) : whatIfScenario.predictions ? (
                        <div>
                          <div className="confidence-badge">
                            <Target size={12} />
                            Confianza: {whatIfScenario.predictions.confidence}%
                          </div>
                          
                          {whatIfScenario.predictions.benefits.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <div className="prediction-type benefits">Beneficios Identificados</div>
                              {whatIfScenario.predictions.benefits.map((benefit, index) => (
                                <div key={index} className="prediction-item">
                                  <div className="prediction-text">• {benefit}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {whatIfScenario.predictions.risks.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                              <div className="prediction-type risks">Riesgos Potenciales</div>
                              {whatIfScenario.predictions.risks.map((risk, index) => (
                                <div key={index} className="prediction-item">
                                  <div className="prediction-text">• {risk}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {whatIfScenario.predictions.recommendations.length > 0 && (
                            <div>
                              <div className="prediction-type recommendations">Recomendaciones</div>
                              {whatIfScenario.predictions.recommendations.map((rec, index) => (
                                <div key={index} className="prediction-item">
                                  <div className="prediction-text">• {rec}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          color: '#6b7280', 
                          padding: '60px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <Lightbulb size={32} />
                          <span>Modifica las variables y presiona "Analizar" para obtener predicciones inteligentes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="whatif-actions">
              <div>
                {whatIfScenario.selectedNodeId && (
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    Analizando: {workflowNodes.find(n => n.id === whatIfScenario.selectedNodeId)?.name}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowWhatIfModal(false)}
                >
                  <X size={16} />
                  Cerrar
                </button>
                {whatIfScenario.selectedNodeId && (
                  <button 
                    className="btn btn-primary"
                    onClick={analyzeWhatIfScenario}
                    disabled={whatIfScenario.isAnalyzing}
                  >
                    <Calculator size={16} />
                    {whatIfScenario.isAnalyzing ? 'Analizando...' : 'Analizar Escenario'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div 
            className="context-menu-item"
            onClick={() => {
              const node = workflowNodes.find(n => n.id === contextMenu.nodeId);
              handleNodeClick(node);
            }}
          >
            <Eye size={16} />
            Ver Detalles
          </div>
          <div 
            className="context-menu-item"
            onClick={() => {
              const node = workflowNodes.find(n => n.id === contextMenu.nodeId);
              setEditingNode(node);
              setShowEditNodeModal(true);
              setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
            }}
          >
            <Edit3 size={16} />
            Editar Nodo
          </div>
          <div 
            className="context-menu-item"
            onClick={() => {
              const node = workflowNodes.find(n => n.id === contextMenu.nodeId);
              selectNodeForWhatIf(node.id);
              setShowWhatIfModal(true);
              setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
            }}
          >
            <Brain size={16} />
            Analizar What-If
          </div>
          <div 
            className="context-menu-item danger"
            onClick={() => deleteNode(contextMenu.nodeId)}
          >
            <Trash2 size={16} />
            Eliminar
          </div>
        </div>
      )}

      {/* Modal Mejorado de Detalles de Nodo con botón de cierre funcional */}
      {showNodeModal && selectedNode && (
        <div className="node-modal-overlay" onClick={closeNodeModal}>
          <div className="node-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="node-modal-header">
              <h3 className="node-modal-title">
                {(() => {
                  const IconComponent = getNodeIcon(selectedNode);
                  return <IconComponent size={20} />;
                })()}
                {selectedNode.name}
              </h3>
              <button 
                className="close-btn"
                onClick={closeNodeModal}
                style={{ color: 'white' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="node-modal-body">
              <div className="node-section">
                <h4 className="node-section-title">Métricas de Rendimiento</h4>
                <div className="metrics-grid-modal">
                  {getNodeData(selectedNode.id).metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                      <div className="metric-value-large">
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                        <span style={{ fontSize: '14px', marginLeft: '4px', color: '#6b7280' }}>
                          {metric.unit}
                        </span>
                      </div>
                      <div className="metric-label">{metric.name}</div>
                      {metric.target && (
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                          Objetivo: {metric.target}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h4 className="node-section-title" style={{ marginTop: '24px' }}>Propiedades</h4>
                <div className="properties-list">
                  {Object.entries(getNodeData(selectedNode.id).properties).map(([key, value]) => (
                    <div key={key} className="property-row">
                      <span className="property-label">{key}</span>
                      <span className="property-value">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="node-section">
                <h4 className="node-section-title">Datos en Tiempo Real</h4>
                <div className="properties-list">
                  {Object.entries(getNodeData(selectedNode.id).realTimeData).map(([key, value]) => (
                    <div key={key} className="property-row">
                      <span className="property-label">{key}</span>
                      <span className="property-value">{value}</span>
                    </div>
                  ))}
                </div>

                <h4 className="node-section-title" style={{ marginTop: '24px' }}>Registro de Eventos</h4>
                <div className="logs-container">
                  {getNodeData(selectedNode.id).logs.slice(0, 8).map((log, index) => (
                    <div key={index} className="log-entry">
                      <div className="log-header">
                        <span className="log-time">
                          {new Date(log.timestamp).toLocaleString('es-ES')}
                        </span>
                        <span className="log-user">{log.user}</span>
                      </div>
                      <div className="log-message">{log.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workflow Modal */}
      {showEditWorkflowModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Editar Digital Twin</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditWorkflowModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre del Proyecto</label>
                <input
                  className="form-input"
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData({...workflowData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Propietario</label>
                <input
                  className="form-input"
                  value={workflowData.owner}
                  onChange={(e) => setWorkflowData({...workflowData, owner: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Presupuesto</label>
                <input
                  className="form-input"
                  value={workflowData.budget}
                  onChange={(e) => setWorkflowData({...workflowData, budget: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duración</label>
                <input
                  className="form-input"
                  value={workflowData.timeline}
                  onChange={(e) => setWorkflowData({...workflowData, timeline: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
                  value={workflowData.priority}
                  onChange={(e) => setWorkflowData({...workflowData, priority: e.target.value})}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={workflowData.status}
                  onChange={(e) => setWorkflowData({...workflowData, status: e.target.value})}
                >
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-textarea"
                  value={workflowData.description}
                  onChange={(e) => setWorkflowData({...workflowData, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditWorkflowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowEditWorkflowModal(false)}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit KPI Modal */}
      {showEditKpiModal && editingKpi && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Editar KPI</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditKpiModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre del KPI</label>
                <input
                  className="form-input"
                  value={editingKpi.name}
                  onChange={(e) => setEditingKpi({...editingKpi, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Valor Actual</label>
                <input
                  className="form-input"
                  type="number"
                  value={editingKpi.value}
                  onChange={(e) => setEditingKpi({...editingKpi, value: parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unidad</label>
                <input
                  className="form-input"
                  value={editingKpi.unit}
                  onChange={(e) => setEditingKpi({...editingKpi, unit: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meta</label>
                <input
                  className="form-input"
                  type="number"
                  value={editingKpi.target}
                  onChange={(e) => setEditingKpi({...editingKpi, target: parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Frecuencia</label>
                <select
                  className="form-select"
                  value={editingKpi.frequency}
                  onChange={(e) => setEditingKpi({...editingKpi, frequency: e.target.value})}
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  className="form-input"
                  type="color"
                  value={editingKpi.color}
                  onChange={(e) => setEditingKpi({...editingKpi, color: e.target.value})}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-textarea"
                  value={editingKpi.description}
                  onChange={(e) => setEditingKpi({...editingKpi, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditKpiModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  updateKpi(editingKpi.id, editingKpi);
                  setShowEditKpiModal(false);
                  setEditingKpi(null);
                }}
              >
                Guardar KPI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Node Modal */}
      {showEditNodeModal && editingNode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Editar Nodo</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditNodeModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre del Nodo</label>
                <input
                  className="form-input"
                  value={editingNode.name}
                  onChange={(e) => setEditingNode({...editingNode, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Propietario</label>
                <input
                  className="form-input"
                  value={editingNode.owner || ''}
                  onChange={(e) => setEditingNode({...editingNode, owner: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duración</label>
                <input
                  className="form-input"
                  value={editingNode.duration}
                  onChange={(e) => setEditingNode({...editingNode, duration: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Costo</label>
                <input
                  className="form-input"
                  value={editingNode.cost}
                  onChange={(e) => setEditingNode({...editingNode, cost: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Progreso (%)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="100"
                  value={editingNode.progress}
                  onChange={(e) => setEditingNode({...editingNode, progress: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select"
                  value={editingNode.priority || 'Media'}
                  onChange={(e) => setEditingNode({...editingNode, priority: e.target.value})}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-textarea"
                  value={editingNode.description || ''}
                  onChange={(e) => setEditingNode({...editingNode, description: e.target.value})}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditNodeModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  updateNode(editingNode.id, editingNode);
                  setShowEditNodeModal(false);
                  setEditingNode(null);
                }}
              >
                Guardar Nodo
              </button>
            </div>
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
                <X size={18} />
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
                      <IconComponent size={18} />
                    </div>
                    <div className="node-type-name">{type.name}</div>
                    <div className="node-type-desc">{type.description}</div>
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
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Asignar KPI a Nodos</h3>
              <button 
                className="close-btn"
                onClick={() => setShowKpiAssignModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #e5e8eb', borderRadius: '8px' }}>
              {workflowNodes.map((node) => (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                  <input
                    type="checkbox"
                    id={`node-${node.id}`}
                    defaultChecked={kpis.find(k => k.id === kpiToAssign)?.assignedNodes.includes(node.id)}
                  />
                  <label htmlFor={`node-${node.id}`} style={{ fontSize: '14px' }}>{node.name}</label>
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
                  const selectedNodes = Array.from(document.querySelectorAll('input[id^="node-"]:checked'))
                    .map(checkbox => checkbox.id.replace('node-', ''));
                  updateKpi(kpiToAssign, { assignedNodes: selectedNodes });
                  setShowKpiAssignModal(false);
                  setKpiToAssign(null);
                }}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Connection Data Panel */}
      {showConnectionData && selectedConnection && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Link2 size={20} />
                Datos de Conexión
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowConnectionData(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px 0' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1a1d21' }}>
                  Métricas de Rendimiento
                </h4>
                <div className="metrics-grid-modal">
                  <div className="metric-card">
                    <div className="metric-value-large">
                      {(() => {
                        const data = getNodeData('default'); // Using default data function
                        return Math.floor(Math.random() * 1000) + 500;
                      })()}
                    </div>
                    <div className="metric-label">Throughput/min</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value-large">
                      {Math.floor(Math.random() * 50) + 20}ms
                    </div>
                    <div className="metric-label">Latencia</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value-large">
                      {(Math.random() * 0.5).toFixed(2)}%
                    </div>
                    <div className="metric-label">Tasa Error</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value-large" style={{ 
                      color: Math.random() > 0.2 ? '#10b981' : '#ef4444' 
                    }}>
                      {Math.random() > 0.2 ? 'Sano' : 'Alerta'}
                    </div>
                    <div className="metric-label">Estado</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1a1d21' }}>
                  Configuración
                </h4>
                <div className="properties-list">
                  <div className="property-row">
                    <span className="property-label">Protocolo</span>
                    <span className="property-value">HTTPS</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Encriptación</span>
                    <span className="property-value">AES-256</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Confiabilidad</span>
                    <span className="property-value">99.5%</span>
                  </div>
                  <div className="property-row">
                    <span className="property-label">Última Prueba</span>
                    <span className="property-value">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e8eb' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1a1d21' }}>
                Condiciones de Flujo
              </h4>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>IF</span>
                  <span style={{ marginLeft: '8px', fontSize: '14px' }}>efficiency > 90</span>
                  <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '12px' }}>→ continue (80%)</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b' }}>ELSE</span>
                  <span style={{ marginLeft: '8px', fontSize: '14px' }}>efficiency ≤ 90</span>
                  <span style={{ marginLeft: '8px', color: '#ef4444', fontSize: '12px' }}>→ alert_manager (20%)</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowConnectionData(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;