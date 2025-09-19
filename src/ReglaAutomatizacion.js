import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Zap, Plus, Search, Play, Pause, Edit3, Trash2, Save, 
  ArrowLeft, CheckCircle, Clock, TrendingUp, Activity,
  Settings, Database, Mail, Bell, Code, Timer, Filter,
  Factory, Truck, Thermometer, Package, User, Link,
  Diamond, Circle, Target, Layers, Eye, X, ChevronDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const nodeTypes = [
  // Triggers
  {
    type: "truck_arrival",
    name: "Llegada de Camión",
    description: "Se detecta la llegada de un camión",
    icon: Truck,
    color: "#3b82f6",
    category: "triggers",
  },
  {
    type: "low_stock",
    name: "Stock Bajo",
    description: "Producto por debajo del mínimo",
    icon: Package,
    color: "#f59e0b",
    category: "triggers",
  },
  {
    type: "temperature_alert",
    name: "Alerta Temperatura",
    description: "Temperatura fuera del rango",
    icon: Thermometer,
    color: "#ef4444",
    category: "triggers",
  },
  {
    type: "schedule_trigger",
    name: "Programación",
    description: "Ejecutar en horario específico",
    icon: Clock,
    color: "#8b5cf6",
    category: "triggers",
  },
  // Conditions
  {
    type: "condition",
    name: "Condición",
    description: "Evalúa una condición específica",
    icon: Diamond,
    color: "#0ea5e9",
    category: "conditions",
  },
  // Actions
  {
    type: "move_product",
    name: "Mover Producto",
    description: "Traslada producto a otra ubicación",
    icon: Package,
    color: "#10b981",
    category: "actions",
  },
  {
    type: "assign_task",
    name: "Asignar Tarea",
    description: "Asigna tarea a un operador",
    icon: User,
    color: "#6366f1",
    category: "actions",
  },
  {
    type: "generate_report",
    name: "Generar Reporte",
    description: "Crea reportes automáticos",
    icon: Database,
    color: "#0ea5e9",
    category: "actions",
  },
  // Notifications
  {
    type: "notification",
    name: "Notificación",
    description: "Envía una notificación",
    icon: Bell,
    color: "#f59e0b",
    category: "notifications",
  },
  {
    type: "email",
    name: "Email",
    description: "Envía un email",
    icon: Mail,
    color: "#ef4444",
    category: "notifications",
  },
  // Helpers
  {
    type: "delay",
    name: "Espera",
    description: "Pausa la ejecución",
    icon: Timer,
    color: "#6b7280",
    category: "helpers",
  },
  {
    type: "code",
    name: "Código Personalizado",
    description: "Ejecuta código personalizado",
    icon: Code,
    color: "#374151",
    category: "helpers",
  }
];

const ReglaAutomatizacion = () => {
  const [activeView, setActiveView] = useState('automations');
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [automationName, setAutomationName] = useState('Nueva Automatización');
  const [automationDescription, setAutomationDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingAutomationId, setEditingAutomationId] = useState(null);
  
  const canvasRef = useRef(null);

  // Estados para el panel de configuración
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [nodeConfig, setNodeConfig] = useState({
    name: '',
    description: '',
    settings: {}
  });

  // Base de datos falsa de automatizaciones
  const [savedAutomations, setSavedAutomations] = useState([
    {
      id: 'auto_001',
      name: 'Control Temperatura Zona Fría',
      description: 'Monitorea temperatura en cámaras frigoríficas y activa sistemas de emergencia',
      status: 'active',
      nodeCount: 6,
      connectionCount: 5,
      lastRun: new Date('2024-01-15T10:30:00'),
      executions: 1247,
      successRate: 98.3,
      createdAt: new Date('2024-01-10T09:00:00'),
      category: 'Control Ambiental',
      priority: 'alta',
      nodes: [
        {
          id: 'node-1',
          type: 'temperature_alert',
          name: 'Sensor Temperatura',
          description: 'Monitorea temperatura cámara frigorífica',
          position: { x: 50, y: 100 },
          config: { minTemp: -18, maxTemp: -15 }
        },
        {
          id: 'node-2',
          type: 'condition',
          name: 'Evaluar Rango',
          description: 'Verificar si está fuera del rango',
          position: { x: 300, y: 100 },
          config: {}
        },
        {
          id: 'node-3',
          type: 'notification',
          name: 'Alerta Inmediata',
          description: 'Notificar al equipo de mantenimiento',
          position: { x: 550, y: 50 },
          config: { recipients: 'mantenimiento' }
        },
        {
          id: 'node-4',
          type: 'assign_task',
          name: 'Crear Tarea',
          description: 'Asignar revisión de sistema',
          position: { x: 550, y: 150 },
          config: { taskType: 'maintenance', priority: 'urgent' }
        }
      ],
      connections: [
        { id: 'conn-1', from: 'node-1', to: 'node-2', label: 'Temperatura detectada' },
        { id: 'conn-2', from: 'node-2', to: 'node-3', label: 'Fuera de rango' },
        { id: 'conn-3', from: 'node-2', to: 'node-4', label: 'Requiere acción' }
      ]
    },
    {
      id: 'auto_002',
      name: 'Reposición Automática Stock',
      description: 'Detecta niveles críticos de inventario y genera órdenes automáticamente',
      status: 'active',
      nodeCount: 8,
      connectionCount: 7,
      lastRun: new Date('2024-01-15T09:15:00'),
      executions: 856,
      successRate: 94.7,
      createdAt: new Date('2024-01-08T14:30:00'),
      category: 'Inventario',
      priority: 'media',
      nodes: [],
      connections: []
    },
    {
      id: 'auto_003',
      name: 'Mantenimiento Predictivo Equipos',
      description: 'Sistema de detección temprana de fallos basado en sensores IoT',
      status: 'active',
      nodeCount: 10,
      connectionCount: 9,
      lastRun: new Date('2024-01-15T11:20:00'),
      executions: 2156,
      successRate: 99.1,
      createdAt: new Date('2024-01-02T08:00:00'),
      category: 'Mantenimiento',
      priority: 'alta',
      nodes: [],
      connections: []
    },
    {
      id: 'auto_004',
      name: 'Control Calidad Automático',
      description: 'Inspección continua con cámaras IA y sensores de precisión',
      status: 'paused',
      nodeCount: 9,
      connectionCount: 8,
      lastRun: new Date('2024-01-15T14:10:00'),
      executions: 5678,
      successRate: 99.8,
      createdAt: new Date('2024-01-04T15:20:00'),
      category: 'Calidad',
      priority: 'alta',
      nodes: [],
      connections: []
    },
    {
      id: 'auto_005',
      name: 'Seguridad Perimetral Nocturna',
      description: 'Sistema automatizado de vigilancia y respuesta de seguridad',
      status: 'draft',
      nodeCount: 11,
      connectionCount: 10,
      lastRun: null,
      executions: 0,
      successRate: 0,
      createdAt: new Date('2024-01-06T16:00:00'),
      category: 'Seguridad',
      priority: 'media',
      nodes: [],
      connections: []
    }
  ]);

  const handleDragStart = (nodeType) => {
    setDraggedNode(nodeType);
  };

  const handleCanvasDrop = useCallback((e) => {
    e.preventDefault();
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nodeType = nodeTypes.find(n => n.type === draggedNode);
    if (!nodeType) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: draggedNode,
      name: nodeType.name,
      description: nodeType.description,
      position: { x: x - 90, y: y - 35 },
      config: {},
    };

    setNodes(prev => [...prev, newNode]);
    setDraggedNode(null);
  }, [draggedNode]);

  // Event listener para teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeView === 'editor') {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          if (selectedNode) {
            setNodes(prev => prev.filter(node => node.id !== selectedNode.id));
            setConnections(prev => prev.filter(conn => 
              conn.from !== selectedNode.id && conn.to !== selectedNode.id
            ));
            setSelectedNode(null);
            setShowConfigPanel(false);
          } else if (selectedConnection) {
            setConnections(prev => prev.filter(conn => conn.id !== selectedConnection.id));
            setSelectedConnection(null);
          }
        }
        if (e.key === 'Escape') {
          setConnectionMode(false);
          setConnectingFrom(null);
          setSelectedNode(null);
          setSelectedConnection(null);
          setShowConfigPanel(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeView, selectedNode, selectedConnection]);

  const handleNodeClick = (node, e) => {
    e.stopPropagation();
    
    if (connectionMode) {
      if (connectingFrom === null) {
        setConnectingFrom(node.id);
      } else if (connectingFrom !== node.id) {
        const newConnection = {
          id: `conn-${Date.now()}`,
          from: connectingFrom,
          to: node.id,
          label: ''
        };
        setConnections(prev => [...prev, newConnection]);
        setConnectingFrom(null);
        setConnectionMode(false);
      }
    } else {
      setSelectedNode(node);
      setSelectedConnection(null);
      setNodeConfig({
        name: node.name,
        description: node.description,
        settings: { ...node.config }
      });
      setShowConfigPanel(true);
    }
  };

  const handleConnectionClick = (connection, e) => {
    e.stopPropagation();
    if (activeView === 'editor') {
      setSelectedConnection(connection);
      setSelectedNode(null);
      setShowConfigPanel(false);
    }
  };

  const handleNodeMouseDown = (node, e) => {
    if (connectionMode) return;
    
    setIsDragging(true);
    setSelectedNode(node);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.position.x,
      y: e.clientY - rect.top - node.position.y,
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !selectedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id 
        ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : node
    ));
  }, [isDragging, selectedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getNodeIcon = (type) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    return nodeType?.icon || Circle;
  };

  const getNodeColor = (type) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    return nodeType?.color || '#6b7280';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-50';
      case 'media': return 'text-yellow-600 bg-yellow-50';
      case 'baja': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConnectionPoints = (fromNode, toNode) => {
    const nodeWidth = 180;
    const nodeHeight = 70;
    
    const fromCenterX = fromNode.position.x + nodeWidth / 2;
    const fromCenterY = fromNode.position.y + nodeHeight / 2;
    const toCenterX = toNode.position.x + nodeWidth / 2;
    const toCenterY = toNode.position.y + nodeHeight / 2;

    const deltaX = toCenterX - fromCenterX;
    const deltaY = toCenterY - fromCenterY;

    let fromX, fromY, toX, toY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        fromX = fromNode.position.x + nodeWidth;
        fromY = fromCenterY;
      } else {
        fromX = fromNode.position.x;
        fromY = fromCenterY;
      }
    } else {
      if (deltaY > 0) {
        fromX = fromCenterX;
        fromY = fromNode.position.y + nodeHeight;
      } else {
        fromX = fromCenterX;
        fromY = fromNode.position.y;
      }
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        toX = toNode.position.x;
        toY = toCenterY;
      } else {
        toX = toNode.position.x + nodeWidth;
        toY = toCenterY;
      }
    } else {
      if (deltaY > 0) {
        toX = toCenterX;
        toY = toNode.position.y;
      } else {
        toX = toCenterX;
        toY = toNode.position.y + nodeHeight;
      }
    }

    return { fromX, fromY, toX, toY };
  };

  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || node.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredAutomations = savedAutomations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || automation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const saveAutomation = () => {
    const automationData = {
      name: automationName,
      description: automationDescription,
      nodes,
      connections,
      nodeCount: nodes.length,
      connectionCount: connections.length,
      lastModified: new Date(),
      status: 'draft'
    };

    if (editingAutomationId) {
      setSavedAutomations(prev => prev.map(auto => 
        auto.id === editingAutomationId 
          ? { ...auto, ...automationData }
          : auto
      ));
    } else {
      const newAutomation = {
        ...automationData,
        id: `auto_${String(Date.now()).slice(-3)}`,
        executions: 0,
        successRate: 0,
        createdAt: new Date(),
        category: 'Personalizada',
        priority: 'media'
      };
      setSavedAutomations(prev => [...prev, newAutomation]);
    }

    setNodes([]);
    setConnections([]);
    setAutomationName('Nueva Automatización');
    setAutomationDescription('');
    setEditingAutomationId(null);
    setActiveView('automations');
  };

  const editAutomation = (automation) => {
    setEditingAutomationId(automation.id);
    setAutomationName(automation.name);
    setAutomationDescription(automation.description);
    setNodes(automation.nodes || []);
    setConnections(automation.connections || []);
    setActiveView('editor');
  };

  const viewAutomation = (automation) => {
    setEditingAutomationId(automation.id);
    setAutomationName(automation.name);
    setAutomationDescription(automation.description);
    setNodes(automation.nodes || []);
    setConnections(automation.connections || []);
    setActiveView('viewer');
  };

  const toggleAutomationStatus = (automationId) => {
    setSavedAutomations(prev => prev.map(auto => {
      if (auto.id === automationId) {
        const newStatus = auto.status === 'active' ? 'paused' : 'active';
        return {
          ...auto,
          status: newStatus,
          lastRun: newStatus === 'active' ? new Date() : auto.lastRun
        };
      }
      return auto;
    }));
  };

  const deleteAutomation = (automationId) => {
    setSavedAutomations(prev => prev.filter(auto => auto.id !== automationId));
  };

  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    setSelectedNode(null);
    setShowConfigPanel(false);
  };

  const deleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setSelectedConnection(null);
  };

  // Calcular estadísticas
  const stats = {
    total: savedAutomations.length,
    active: savedAutomations.filter((a) => a.status === 'active').length,
    paused: savedAutomations.filter((a) => a.status === 'paused').length,
    totalExecutions: savedAutomations.reduce((sum, a) => sum + a.executions, 0),
    avgSuccess: savedAutomations.length > 0
      ? Math.round(savedAutomations.reduce((sum, a) => sum + a.successRate, 0) / savedAutomations.length)
      : 0,
  };

  return (
    <div className="automation-container">
      {/* Header */}
      <div className="content-header">
        <div className="header-top">
          <div className="header-info">
            <h1>
              {activeView === 'automations' ? 'Automatizaciones' : 
               activeView === 'editor' ? (editingAutomationId ? 'Editar Automatización' : 'Nueva Automatización') :
               'Vista de Automatización'}
            </h1>
            <p>
              {activeView === 'automations' ? 'Diseña y gestiona flujos de trabajo automatizados' : 
               activeView === 'editor' ? 'Construye tu automatización arrastrando componentes' :
               'Visualización de solo lectura'}
            </p>
          </div>
          <div className="header-actions">
            {activeView === 'automations' && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setEditingAutomationId(null);
                  setAutomationName('Nueva Automatización');
                  setAutomationDescription('');
                  setNodes([]);
                  setConnections([]);
                  setActiveView('editor');
                }}
              >
                <Plus size={16} />
                Nueva Automatización
              </button>
            )}
            {(activeView === 'editor' || activeView === 'viewer') && (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveView('automations');
                    setEditingAutomationId(null);
                  }}
                >
                  <ArrowLeft size={16} />
                  Volver
                </button>
                {activeView === 'editor' && (
                  <button className="btn btn-primary" onClick={saveAutomation}>
                    <Save size={16} />
                    {editingAutomationId ? 'Actualizar' : 'Guardar'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder={activeView === 'automations' ? "Buscar automatizaciones..." : "Buscar componentes..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={activeView === 'automations' ? filterStatus : filterCategory}
            onChange={(e) => activeView === 'automations' ? setFilterStatus(e.target.value) : setFilterCategory(e.target.value)}
          >
            {activeView === 'automations' ? (
              <>
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="paused">Pausados</option>
                <option value="draft">Borradores</option>
              </>
            ) : (
              <>
                <option value="all">Todas las categorías</option>
                <option value="triggers">Disparadores</option>
                <option value="conditions">Condiciones</option>
                <option value="actions">Acciones</option>
                <option value="notifications">Notificaciones</option>
                <option value="helpers">Utilidades</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Workspace */}
      <div className="workspace">
        {activeView === 'automations' ? (
          /* Vista de Automatizaciones */
          <div className="automations-grid">
            <div className="grid-container">
              {filteredAutomations.map(automation => (
                <div key={automation.id} className="automation-card">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">{automation.name}</h3>
                      <div className="card-meta">
                        <span className={`status-badge ${getStatusColor(automation.status)}`}>
                          {automation.status === 'active' ? 'Activo' : 
                           automation.status === 'paused' ? 'Pausado' : 'Borrador'}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(automation.priority)}`}>
                          {automation.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="card-description">{automation.description}</p>
                  
                  <div className="card-stats">
                    <div className="stat-item">
                      <div className="stat-value">{automation.executions.toLocaleString()}</div>
                      <div className="stat-label">Ejecuciones</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{automation.successRate}%</div>
                      <div className="stat-label">Éxito</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{automation.nodeCount}</div>
                      <div className="stat-label">Nodos</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{automation.connectionCount}</div>
                      <div className="stat-label">Conexiones</div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => viewAutomation(automation)}
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => editAutomation(automation)}
                    >
                      <Edit3 size={14} />
                      Editar
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleAutomationStatus(automation.id)}
                    >
                      {automation.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      {automation.status === 'active' ? 'Pausar' : 'Activar'}
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAutomation(automation.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Vista del Editor/Viewer */
          <div className="canvas-area">
            <div className="canvas-toolbar">
              <div className="canvas-info">
                <span>{nodes.length} nodos</span>
                <span>{connections.length} conexiones</span>
                {activeView === 'viewer' && <span>Modo Solo Lectura</span>}
              </div>
              {activeView === 'editor' && (
                <button 
                  className={`btn btn-secondary ${connectionMode ? 'btn-primary' : ''}`}
                  onClick={() => setConnectionMode(!connectionMode)}
                >
                  <Link size={16} />
                  {connectionMode ? 'Cancelar conexión' : 'Conectar nodos'}
                </button>
              )}
            </div>
            
            <div 
              ref={canvasRef}
              className={`automation-canvas ${activeView === 'viewer' ? 'viewer-mode' : ''}`}
              onDrop={activeView === 'editor' ? handleCanvasDrop : undefined}
              onDragOver={activeView === 'editor' ? (e) => e.preventDefault() : undefined}
              onClick={() => {
                if (activeView === 'editor') {
                  if (connectionMode) {
                    setConnectingFrom(null);
                    setConnectionMode(false);
                  }
                  setSelectedNode(null);
                  setSelectedConnection(null);
                  setShowConfigPanel(false);
                }
              }}
            >
              <svg className="connections-svg">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                  </marker>
                </defs>
                {connections.map(connection => {
                  const fromNode = nodes.find(n => n.id === connection.from);
                  const toNode = nodes.find(n => n.id === connection.to);
                  if (!fromNode || !toNode) return null;

                  const { fromX, fromY, toX, toY } = getConnectionPoints(fromNode, toNode);
                  
                  return (
                    <g key={connection.id}>
                      <path
                        d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
                        className={`connection-path ${selectedConnection?.id === connection.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectionClick(connection, e);
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {nodes.map(node => {
                const Icon = getNodeIcon(node.type);
                const isConnecting = connectingFrom === node.id;
                return (
                  <div
                    key={node.id}
                    className={`automation-node ${selectedNode?.id === node.id ? 'selected' : ''} ${isConnecting ? 'connecting' : ''}`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                    }}
                    onMouseDown={activeView === 'editor' ? (e) => handleNodeMouseDown(node, e) : undefined}
                    onClick={activeView === 'editor' ? (e) => handleNodeClick(node, e) : undefined}
                  >
                    <div className="node-header">
                      <div className="node-left">
                        <div 
                          className="node-icon" 
                          style={{ backgroundColor: getNodeColor(node.type) }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="node-title">{node.name}</div>
                      </div>
                      {activeView === 'editor' && (
                        <div className="node-actions">
                          <button 
                            className="node-action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            title="Eliminar nodo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="node-description">{node.description}</div>
                  </div>
                );
              })}

              {nodes.length === 0 && activeView === 'editor' && (
                <div className="empty-canvas">
                  <h3>Construye tu automatización</h3>
                  <p>Arrastra componentes desde el panel lateral para comenzar</p>
                </div>
              )}

              {connectionMode && activeView === 'editor' && (
                <div className="connection-mode-indicator">
                  {connectingFrom ? 'Selecciona el nodo destino' : 'Selecciona el nodo origen'}
                </div>
              )}

              {(selectedNode || selectedConnection) && activeView === 'editor' && (
                <div className="delete-indicator">
                  Presiona Delete o Backspace para eliminar
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar derecho - Aparece para todas las vistas */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {activeView === 'automations' ? 'Resumen' :
               activeView === 'editor' ? 'Componentes' :
               'Información'}
            </h2>
            <p className="sidebar-subtitle">
              {activeView === 'automations' ? 'Estadísticas y filtros' :
               activeView === 'editor' ? 'Arrastra elementos al canvas' :
               'Detalles de la automatización'}
            </p>
          </div>
          
          <div className="sidebar-content">
            {activeView === 'editor' && (
              <>
                <div className="component-categories">
                  <div className="category-tabs">
                    {['all', 'triggers', 'conditions', 'actions', 'notifications', 'helpers'].map(category => (
                      <button
                        key={category}
                        className={`category-tab ${filterCategory === category ? 'active' : ''}`}
                        onClick={() => setFilterCategory(category)}
                      >
                        {category === 'all' ? 'Todos' : 
                         category === 'triggers' ? 'Disparadores' :
                         category === 'conditions' ? 'Condiciones' :
                         category === 'actions' ? 'Acciones' :
                         category === 'notifications' ? 'Notificaciones' : 'Utilidades'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="components-list">
                    {filteredNodes.map(nodeType => {
                      const Icon = nodeType.icon;
                      return (
                        <div
                          key={nodeType.type}
                          className="component-item"
                          draggable
                          onDragStart={() => handleDragStart(nodeType.type)}
                        >
                          <div className="component-content">
                            <div 
                              className="component-icon" 
                              style={{ backgroundColor: nodeType.color }}
                            >
                              <Icon size={14} />
                            </div>
                            <div className="component-info">
                              <h4 className="component-name">{nodeType.name}</h4>
                              <p className="component-description">{nodeType.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeView === 'automations' && (
              <>
                <div className="component-categories">
                  <h4 className="section-title">Resumen General</h4>
                  <div className="summary-stats">
                    <div className="summary-item">
                      <div className="summary-icon" style={{ backgroundColor: '#10b981' }}>
                        <CheckCircle size={16} />
                      </div>
                      <div className="summary-info">
                        <span className="summary-value">{stats.active}</span>
                        <span className="summary-label">Activas</span>
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon" style={{ backgroundColor: '#f59e0b' }}>
                        <Pause size={16} />
                      </div>
                      <div className="summary-info">
                        <span className="summary-value">{stats.paused}</span>
                        <span className="summary-label">Pausadas</span>
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-icon" style={{ backgroundColor: '#3b82f6' }}>
                        <TrendingUp size={16} />
                      </div>
                      <div className="summary-info">
                        <span className="summary-value">{stats.avgSuccess}%</span>
                        <span className="summary-label">Éxito</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {(activeView === 'viewer' || activeView === 'editor') && (
              <div className="automation-info">
                <div className="info-field">
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={automationName}
                    onChange={(e) => setAutomationName(e.target.value)}
                    placeholder="Nombre de la automatización"
                    disabled={activeView === 'viewer'}
                  />
                </div>
                
                <div className="info-field">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-textarea"
                    value={automationDescription}
                    onChange={(e) => setAutomationDescription(e.target.value)}
                    placeholder="Describe qué hace esta automatización"
                    disabled={activeView === 'viewer'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel de configuración - solo cuando hay algo seleccionado */}
      {showConfigPanel && selectedNode && activeView === 'editor' && (
        <div className="config-panel">
          <div className="config-header">
            <h3>Configuración</h3>
            <button 
              onClick={() => setShowConfigPanel(false)}
              className="close-config"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="config-content">
            <div className="config-field">
              <label>Nombre del Componente</label>
              <input 
                type="text" 
                value={nodeConfig.name}
                onChange={(e) => {
                  setNodeConfig(prev => ({ ...prev, name: e.target.value }));
                  setNodes(prev => prev.map(node => 
                    node.id === selectedNode.id ? { ...node, name: e.target.value } : node
                  ));
                }}
                className="config-input"
              />
            </div>
            
            <div className="config-field">
              <label>Descripción</label>
              <textarea 
                value={nodeConfig.description}
                onChange={(e) => {
                  setNodeConfig(prev => ({ ...prev, description: e.target.value }));
                  setNodes(prev => prev.map(node => 
                    node.id === selectedNode.id ? { ...node, description: e.target.value } : node
                  ));
                }}
                rows={3}
                className="config-textarea"
              />
            </div>

            {/* Configuración específica por tipo de nodo */}
            {selectedNode.type === 'temperature_alert' && (
              <div className="config-section">
                <h4>Configuración de Temperatura</h4>
                <div className="config-row">
                  <div className="config-field">
                    <label>Min. °C</label>
                    <input 
                      type="number" 
                      placeholder="-18"
                      className="config-input"
                    />
                  </div>
                  <div className="config-field">
                    <label>Max. °C</label>
                    <input 
                      type="number" 
                      placeholder="-15"
                      className="config-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedNode.type === 'low_stock' && (
              <div className="config-section">
                <h4>Configuración de Stock</h4>
                <div className="config-field">
                  <label>Umbral Mínimo</label>
                  <input 
                    type="number" 
                    placeholder="50"
                    className="config-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .automation-container {
          background: #fafbfc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .content-header {
          background: white;
          border-bottom: 1px solid #e5e8eb;
          padding: 16px 24px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info h1 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 4px 0;
        }

        .header-info p {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
        }

        .btn-primary:hover {
          background: #0052a3;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          color: #6b7684;
          border: 1px solid #e5e8eb;
        }

        .btn-secondary:hover {
          background: #f8f9fa;
          border-color: #d0d5db;
        }

        .btn-danger {
          background: white;
          color: #ef4444;
          border: 1px solid #fecaca;
        }

        .btn-danger:hover {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          border-bottom: 1px solid #e5e8eb;
          background: white;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          width: 320px;
          height: 38px;
          padding: 0 14px 0 40px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          background: #f8f9fa;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #0066cc;
          background: white;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7684;
        }

        .filter-select {
          padding: 10px 14px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #0066cc;
        }

        .workspace {
          display: flex;
          min-height: calc(100vh - 140px);
        }

        .canvas-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .canvas-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: #f8f9fa;
          border-bottom: 1px solid #e5e8eb;
        }

        .canvas-info {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #6b7684;
        }

        .automation-canvas {
          flex: 1;
          position: relative;
          background: white;
          background-image: radial-gradient(circle, #e5e8eb 1px, transparent 1px);
          background-size: 20px 20px;
          overflow: auto;
          cursor: default;
          min-height: 500px;
        }

        .automation-node {
          position: absolute;
          background: white;
          border: 2px solid #e5e8eb;
          border-radius: 12px;
          padding: 16px;
          width: 180px;
          min-height: 70px;
          cursor: move;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          z-index: 2;
        }

        .automation-node:hover {
          border-color: #0066cc;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
        }

        .automation-node.selected {
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
        }

        .automation-node.connecting {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .node-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .node-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .node-actions {
          display: flex;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .automation-node:hover .node-actions {
          opacity: 1;
        }

        .node-action-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: #6b7684;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .node-action-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .node-action-btn.delete:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        .node-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .node-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1d21;
          flex: 1;
          line-height: 1.3;
        }

        .node-description {
          font-size: 13px;
          color: #6b7684;
          line-height: 1.4;
        }

        .empty-canvas {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #6b7684;
        }

        .empty-canvas h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #1a1d21;
        }

        .empty-canvas p {
          font-size: 16px;
          margin: 0;
        }

        .automations-grid {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .automation-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.2s ease;
        }

        .automation-card:hover {
          border-color: #d0d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .card-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .status-badge, .priority-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-description {
          font-size: 14px;
          color: #6b7684;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .card-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 8px 14px;
          font-size: 12px;
          flex: 1;
          justify-content: center;
        }

        .sidebar {
          width: 320px;
          background: white;
          border-left: 1px solid #e5e8eb;
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 140px);
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e5e8eb;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 6px 0;
        }

        .sidebar-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .component-categories {
          margin-bottom: 24px;
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .category-tab {
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          background: white;
          color: #6b7684;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .category-tab.active {
          background: #0066cc;
          border-color: #0066cc;
          color: white;
        }

        .category-tab:hover:not(.active) {
          border-color: #d0d5db;
          background: #f8f9fa;
        }

        .components-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .component-item {
          padding: 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          background: white;
          cursor: move;
          transition: all 0.2s ease;
        }

        .component-item:hover {
          border-color: #0066cc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
        }

        .component-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .component-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .component-info {
          flex: 1;
          min-width: 0;
        }

        .component-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1d21;
          margin: 0 0 2px 0;
        }

        .component-description {
          font-size: 11px;
          color: #6b7684;
          margin: 0;
          line-height: 1.3;
        }

        .automation-info {
          padding: 16px;
          border-top: 1px solid #e5e8eb;
          background: #f8f9fa;
        }

        .info-field {
          margin-bottom: 16px;
        }

        .info-field:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #1a1d21;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #0066cc;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .connection-path {
          stroke: #6b7280;
          stroke-width: 2;
          fill: none;
          marker-end: url(#arrowhead);
          transition: stroke 0.2s ease, stroke-width 0.2s ease;
          pointer-events: all;
          cursor: pointer;
        }

        .connection-path:hover {
          stroke: #0066cc;
          stroke-width: 3;
        }

        .connection-path.selected {
          stroke: #0066cc;
          stroke-width: 3;
          filter: drop-shadow(0 0 4px rgba(0, 102, 204, 0.3));
        }

        .connection-mode-indicator {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #dbeafe;
          border: 1px solid #93c5fd;
          color: #1e40af;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 10;
        }

        .delete-indicator {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 10;
        }

        .viewer-mode {
          pointer-events: none;
        }

        .viewer-mode .automation-node {
          cursor: default;
        }

        .viewer-mode .connection-path {
          cursor: default;
        }

        .summary-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          background: white;
          transition: all 0.2s ease;
        }

        .summary-item:hover {
          border-color: #d0d5db;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .summary-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .summary-info {
          flex: 1;
          min-width: 0;
        }

        .summary-value {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 2px;
        }

        .summary-label {
          font-size: 12px;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .config-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 350px;
          height: 100vh;
          background: white;
          border-left: 1px solid #e5e8eb;
          z-index: 100;
          display: flex;
          flex-direction: column;
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e8eb;
        }

        .config-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
        }

        .close-config {
          background: none;
          border: none;
          color: #6b7684;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-config:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .config-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .config-field {
          margin-bottom: 16px;
        }

        .config-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .config-input, .config-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .config-input:focus, .config-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }

        .config-section {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .config-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .config-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .workspace {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            max-height: 300px;
          }

          .config-panel {
            width: 100%;
            height: 50vh;
            top: auto;
            bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ReglaAutomatizacion;