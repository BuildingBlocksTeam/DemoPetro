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
  Save, Info, Users, Tag, Folder
} from 'lucide-react';

import AIChat from './AIChat';
import DataSourceEditor from './DataSourceEditor';

const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect, onBack, draggingNode, setDraggingNode, dragOffset, setDragOffset }) => {
  // Estados del canvas
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // Estados de paneles y modales
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showConnectionData, setShowConnectionData] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showEditWorkflowModal, setShowEditWorkflowModal] = useState(false);
  const [showEditKpiModal, setShowEditKpiModal] = useState(false);
  const [showEditNodeModal, setShowEditNodeModal] = useState(false);
  const [showDataSourceEditor, setShowDataSourceEditor] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, nodeId: null });
  
  // Estados de workflow
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
  
  // Estados de conexión
  const [connectingMode, setConnectingMode] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  
  // Estados de AI Chat
  const [aiChatMinimized, setAiChatMinimized] = useState(true);
  
  // Estados de KPIs
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
  
  const canvasRef = useRef(null);

  // Tipos de nodos expandidos
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

  // Funciones utilitarias
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

  // Datos simulados expandidos
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

  const getConnectionData = (connectionId) => ({
    throughput: Math.floor(Math.random() * 1000) + 500,
    latency: Math.floor(Math.random() * 50) + 20,
    errorRate: (Math.random() * 0.5).toFixed(2),
    status: Math.random() > 0.2 ? 'healthy' : 'warning',
    dataFlow: Array.from({ length: 5 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 300000).toLocaleTimeString(),
      value: Math.floor(Math.random() * 200) + 1000
    })).reverse(),
    conditions: [
      { type: 'if', condition: 'efficiency > 90', action: 'continue', weight: 0.8 },
      { type: 'else', condition: 'efficiency <= 90', action: 'alert_manager', weight: 0.2 }
    ],
    metadata: {
      protocol: 'HTTPS',
      encryption: 'AES-256',
      lastTested: '2024-01-15T10:00:00Z',
      reliability: '99.5%'
    }
  });

  // Funciones de manejo de eventos
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

  // Funciones de gestión de nodos
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

  // Funciones de gestión de KPIs
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

  // Funciones de canvas
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

  const resetView = () => {
    setCanvasScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

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

  // Componente de nodo mejorado
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
        {/* Main card with enhanced styling */}
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
        
        {/* Status indicator */}
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="200" 
          height="8"
          rx="8"
          fill={statusColors.main}
        />
        
        {/* Icon background */}
        <circle
          cx={node.position.x + 30}
          cy={node.position.y + 40}
          r="18"
          fill={statusColors.bg}
          stroke={statusColors.main}
          strokeWidth="2"
        />
        
        {/* Icon */}
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
        
        {/* Node title */}
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
        
        {/* Node type and status */}
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
        
        {/* Duration, cost, and owner */}
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
        
        {/* Progress bar */}
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
        
        {/* Progress text */}
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
        
        {/* KPI indicators */}
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
        
        {/* Priority indicator */}
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
        }

        .canvas-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          z-index: 5;
        }

        .canvas-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .canvas-title-section {
          flex: 1;
        }

        .canvas-title {
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .edit-title-btn {
          padding: 6px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
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
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        .canvas-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
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
          gap: 24px;
        }

        .canvas-stat {
          text-align: center;
        }

        .canvas-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .canvas-stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .canvas-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(45deg, #fafbfc 25%, transparent 25%, transparent 75%, #fafbfc 75%), 
                      linear-gradient(45deg, #fafbfc 25%, transparent 25%, transparent 75%, #fafbfc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
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

        /* KPI Sidebar */
        .kpi-sidebar {
          width: 320px;
          background: white;
          border-left: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
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

        /* Modal styles */
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

        /* Data panels */
        .data-panel {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 360px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          z-index: 25;
          max-height: calc(100vh - 120px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e8eb;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0;
        }

        .panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .metric-item {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          padding: 12px;
          text-align: center;
        }

        .metric-value {
          font-size: 18px;
          font-weight: 800;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .metric-name {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .section-title-small {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .property-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .property-item:last-child {
          border-bottom: none;
        }

        .property-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
        }

        .property-value {
          font-size: 12px;
          color: #1a1d21;
          font-weight: 700;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .log-item {
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .log-timestamp {
          font-size: 10px;
          color: #6b7280;
        }

        .log-user {
          font-size: 10px;
          color: #3b82f6;
          font-weight: 600;
        }

        .log-event {
          font-size: 12px;
          color: #374151;
          font-weight: 500;
        }

        .real-time-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e8eb;
        }

        .real-time-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
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
        }

        @media (max-width: 1024px) {
          .canvas-stats {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .form-grid {
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
                  className="action-btn primary"
                  title="Guardar Cambios"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </div>
            
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
                <div className="canvas-stat-value">{workflowData.budget}</div>
                <div className="canvas-stat-label">Presupuesto</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflowData.timeline}</div>
                <div className="canvas-stat-label">Duración</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflowData.status}</div>
                <div className="canvas-stat-label">Estado</div>
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
                {/* Connections with proper arrows */}
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
                      {/* Base connection line */}
                      <line
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        className="connection-line"
                        markerEnd="url(#arrowhead)"
                        onClick={() => handleConnectionClick(conn)}
                      />
                      
                      {/* Progress line */}
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

      {/* AI Chat Component */}
      <AIChat 
        workflow={workflowData}
        isMinimized={aiChatMinimized}
        onToggleMinimize={() => setAiChatMinimized(!aiChatMinimized)}
        onClose={() => setAiChatMinimized(true)}
      />

      {/* Data Source Editor */}
      {showDataSourceEditor && (
        <div className="modal-overlay">
          <DataSourceEditor 
            initialData={{ schema: [] }}
            onSave={(data) => {
              console.log('Data sources saved:', data);
              setShowDataSourceEditor(false);
            }}
            onCancel={() => setShowDataSourceEditor(false)}
          />
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
            className="context-menu-item danger"
            onClick={() => deleteNode(contextMenu.nodeId)}
          >
            <Trash2 size={16} />
            Eliminar
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

      {/* Enhanced Node Data Panel */}
      {showNodePanel && selectedNode && (
        <div className="data-panel">
          <div className="panel-header">
            <h4 className="panel-title">{selectedNode.name}</h4>
            <button 
              className="close-btn"
              onClick={() => setShowNodePanel(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="panel-body">
            <div className="metrics-grid">
              {getNodeData(selectedNode.id).metrics.map((metric, index) => (
                <div key={index} className="metric-item">
                  <div className="metric-value">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>{metric.unit}</span>
                  </div>
                  <div className="metric-name">{metric.name}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
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

            <div className="real-time-section">
              <h5 className="section-title-small">Datos en Tiempo Real</h5>
              <div className="real-time-grid">
                {Object.entries(getNodeData(selectedNode.id).realTimeData).map(([key, value]) => (
                  <div key={key} className="property-item">
                    <span className="property-label">{key}</span>
                    <span className="property-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="section-title-small">Registro de Eventos</h5>
              <div className="logs-list">
                {getNodeData(selectedNode.id).logs.slice(0, 5).map((log, index) => (
                  <div key={index} className="log-item">
                    <div className="log-header">
                      <div className="log-timestamp">
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </div>
                      <div className="log-user">{log.user}</div>
                    </div>
                    <div className="log-event">{log.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Connection Data Panel */}
      {showConnectionData && selectedConnection && (
        <div className="data-panel" style={{ right: '340px', left: 'auto' }}>
          <div className="panel-header">
            <h4 className="panel-title">Datos de Conexión</h4>
            <button 
              className="close-btn"
              onClick={() => setShowConnectionData(false)}
            >
              <X size={18} />
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
                  {getConnectionData(selectedConnection.id || 'default').status === 'healthy' ? 'Sano' : 'Alerta'}
                </div>
                <div className="metric-name">Estado</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h5 className="section-title-small">Metadatos de Conexión</h5>
              {Object.entries(getConnectionData(selectedConnection.id || 'default').metadata).map(([key, value]) => (
                <div key={key} className="property-item">
                  <span className="property-label">{key}</span>
                  <span className="property-value">{value}</span>
                </div>
              ))}
            </div>

            <div>
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