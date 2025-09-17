import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Settings, BarChart3, Zap, Activity,
  MapPin, Layers, Truck, HardHat, Wrench, Play, Clipboard,
  Building2, Factory, Gauge, Package, Circle, X, Check,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Eye, Link2
} from 'lucide-react';
import AIChat from './AIChat';
import StatisticsPanel from './StatisticsPanel';

const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect, onBack, draggingNode, setDraggingNode, dragOffset, setDragOffset }) => {
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showConnectionData, setShowConnectionData] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [addNodePosition, setAddNodePosition] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, nodeId: null });
  const [aiChatMinimized, setAiChatMinimized] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);
  const [workflowNodes, setWorkflowNodes] = useState(workflow?.nodes || []);
  const [workflowConnections, setWorkflowConnections] = useState(workflow?.connections || []);
  
  const canvasRef = useRef(null);

  const nodeTypes = [
    { id: 'process', name: 'Proceso', icon: Activity, color: '#3b82f6' },
    { id: 'decision', name: 'Decisión', icon: Layers, color: '#f59e0b' },
    { id: 'data', name: 'Datos', icon: Gauge, color: '#10b981' },
    { id: 'integration', name: 'Integración', icon: Zap, color: '#8b5cf6' },
    { id: 'output', name: 'Salida', icon: Play, color: '#06b6d4' },
    { id: 'control', name: 'Control', icon: Settings, color: '#ef4444' }
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
      process: Activity,
      decision: Layers,
      data: Gauge,
      integration: Zap,
      output: Play,
      control: Settings,
      exploration: MapPin,
      analysis: BarChart3,
      regulatory: Circle,
      engineering: Layers,
      logistics: Truck,
      drilling: HardHat,
      completion: Wrench,
      production: Play,
      planning: Clipboard,
      legal: Circle,
      construction: Building2,
      facilities: Factory,
      testing: Gauge,
      operations: Activity,
      procurement: Package,
      automation: Settings,
      commissioning: Zap,
      licensing: Circle,
      environmental: Circle
    };
    return iconMap[node.type] || Activity;
  };

  // Datos simulados para nodos y conexiones
  const getNodeData = (nodeId) => ({
    metrics: [
      { name: 'Eficiencia', value: 87.3, unit: '%', trend: 'up' },
      { name: 'Costo', value: 125000, unit: 'USD', trend: 'stable' },
      { name: 'Tiempo', value: 45, unit: 'días', trend: 'down' },
      { name: 'Recursos', value: 12, unit: 'personas', trend: 'up' }
    ],
    logs: [
      { timestamp: '2024-01-15T16:30:00Z', event: 'Proceso iniciado', type: 'info' },
      { timestamp: '2024-01-15T14:22:00Z', event: 'Validación completada', type: 'success' },
      { timestamp: '2024-01-15T12:15:00Z', event: 'Recursos asignados', type: 'info' }
    ]
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
    ]
  });

  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    onNodeSelect(node);
    setShowNodePanel(true);
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  const handleConnectionClick = (connection) => {
    setSelectedConnection(connection);
    setShowConnectionData(true);
  };

  const addNewNode = (type, position) => {
    const nodeType = nodeTypes.find(nt => nt.id === type);
    const newNode = {
      id: `node_${Date.now()}`,
      name: `Nuevo ${nodeType.name}`,
      type: type,
      status: 'pending',
      duration: '15 días',
      cost: '$50K',
      progress: 0,
      position: position,
      kpis: { efficiency: '0%', quality: '0%', completion: '0%' }
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

  const handleCanvasDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / canvasScale;
    const y = (e.clientY - rect.top - panOffset.y) / canvasScale;
    
    setAddNodePosition({ x: Math.max(50, x - 90), y: Math.max(50, y - 60) });
    setShowAddNodeModal(true);
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

      const newX = Math.max(50, Math.min(mouseX - dragOffset.x, 950));
      const newY = Math.max(50, Math.min(mouseY - dragOffset.y, 550));

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
    
    return (
      <g 
        className={`workflow-node ${draggingNode === node.id ? 'dragging' : ''}`}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
        onClick={() => onClick && onClick(node)}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: draggingNode === node.id ? 'grabbing' : 'grab' }}
      >
        {/* Main card */}
        <rect
          x={node.position.x} 
          y={node.position.y}
          width="180" 
          height="120"
          rx="12"
          fill="white"
          stroke={statusColors.border}
          strokeWidth="2"
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
      </g>
    );
  };

  return (
    <div className="digital-twin-canvas">
      <style jsx>{`
        .digital-twin-canvas {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
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

        .data-panel {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 300px;
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

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #f1f5f9;
        }

        .metric-name {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        .metric-value {
          font-size: 14px;
          font-weight: 700;
          color: #1a1d21;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
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

        .connection-panel {
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          width: 280px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 25;
          overflow: hidden;
        }

        .connection-metrics {
          padding: 16px;
        }

        .connection-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .connection-metric:last-child {
          border-bottom: none;
        }
      `}</style>

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
            <button 
              className={`control-btn ${showStatistics ? 'active' : ''}`} 
              onClick={() => setShowStatistics(!showStatistics)} 
              title="Estadísticas"
            >
              <BarChart3 size={16} />
            </button>
            <button className="control-btn" onClick={zoomIn} title="Zoom In">
              <ZoomIn size={16} />
            </button>
            <button className="control-btn" onClick={zoomOut} title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <button className="control-btn" onClick={resetView} title="Reset View">
              <Maximize2 size={16} />
            </button>
          </div>

          <svg 
            ref={canvasRef}
            className="workflow-canvas-svg" 
            viewBox="0 0 1200 700" 
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
            onDoubleClick={handleCanvasDoubleClick}
          >
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
              </marker>
              <marker id="arrowhead-progress" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#10b981" />
              </marker>
            </defs>

            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${canvasScale})`}>
              {/* Connections */}
              {workflowConnections?.map((conn, index) => {
                const fromNode = workflowNodes.find(n => n.id === conn.from);
                const toNode = workflowNodes.find(n => n.id === conn.to);
                
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.position.x + 90;
                const y1 = fromNode.position.y + 60;
                const x2 = toNode.position.x + 90;
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

      <button 
        className="back-button"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={14} />
        Volver
      </button>

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
                    onClick={() => addNewNode(type.id, addNodePosition)}
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

      {/* Node Data Panel */}
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
            <div className="metrics-list">
              {getNodeData(selectedNode.id).metrics.map((metric, index) => (
                <div key={index} className="metric-item">
                  <span className="metric-name">{metric.name}</span>
                  <span className="metric-value">
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value} {metric.unit}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="logs-list">
              <h5 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', color: '#374151' }}>
                Registro de Eventos
              </h5>
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

      {/* Connection Data Panel */}
      {showConnectionData && selectedConnection && (
        <div className="connection-panel">
          <div className="panel-header">
            <h4 className="panel-title">Datos de Conexión</h4>
            <button 
              className="close-btn"
              onClick={() => setShowConnectionData(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="connection-metrics">
            {(() => {
              const data = getConnectionData(selectedConnection.id || 'default');
              return (
                <>
                  <div className="connection-metric">
                    <span>Throughput</span>
                    <span style={{ fontWeight: '600' }}>{data.throughput}/min</span>
                  </div>
                  <div className="connection-metric">
                    <span>Latencia</span>
                    <span style={{ fontWeight: '600' }}>{data.latency}ms</span>
                  </div>
                  <div className="connection-metric">
                    <span>Tasa de Error</span>
                    <span style={{ fontWeight: '600', color: data.errorRate > 1 ? '#ef4444' : '#10b981' }}>
                      {data.errorRate}%
                    </span>
                  </div>
                  <div className="connection-metric">
                    <span>Estado</span>
                    <span style={{ 
                      fontWeight: '600', 
                      color: data.status === 'healthy' ? '#10b981' : '#ef4444' 
                    }}>
                      {data.status === 'healthy' ? 'Saludable' : 'Con problemas'}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* AI Chat */}
      <AIChat 
        workflow={workflow}
        isMinimized={aiChatMinimized}
        onToggleMinimize={() => setAiChatMinimized(!aiChatMinimized)}
        onClose={() => setAiChatMinimized(true)}
      />

      {/* Statistics Panel */}
      <StatisticsPanel 
        projectData={null}
        workflow={workflow}
        isVisible={showStatistics}
        onClose={() => setShowStatistics(false)}
      />
    </div>
  );
};

export default WorkflowCanvas;