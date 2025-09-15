import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Brain, TrendingUp, AlertTriangle, Shield, DollarSign, 
  FileCheck, Cpu, Clock, BarChart3, Droplets, AlertCircle,
  MapPin, Layers, Truck, HardHat, Wrench, Play, Clipboard,
  Building2, Factory, Gauge, Package, Settings, Circle, Zap,
  Maximize2, Minimize2, ZoomIn, ZoomOut
} from 'lucide-react';

const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect, onBack, draggingNode, setDraggingNode, dragOffset, setDragOffset }) => {
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

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
      exploration: MapPin,
      analysis: Brain,
      regulatory: Shield,
      engineering: Layers,
      logistics: Truck,
      drilling: HardHat,
      completion: Wrench,
      production: Play,
      planning: Clipboard,
      legal: FileCheck,
      construction: Building2,
      facilities: Factory,
      testing: Gauge,
      operations: Cpu,
      procurement: Package,
      automation: Settings,
      commissioning: Zap,
      licensing: FileCheck,
      environmental: Droplets
    };
    return iconMap[node.type] || Circle;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'crítica': return '#dc2626';
      case 'alta': return '#ea580c';
      case 'media': return '#d97706';
      case 'baja': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'optimization': return TrendingUp;
      case 'risk': return Shield;
      case 'cost': return DollarSign;
      case 'regulatory': return FileCheck;
      case 'technical': return Cpu;
      case 'schedule': return Clock;
      case 'market': return BarChart3;
      case 'environmental': return Droplets;
      case 'efficiency': return Zap;
      default: return AlertCircle;
    }
  };

  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.button === 0) { // Left click only
      const node = workflow.nodes.find(n => n.id === nodeId);
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

  const handleCanvasMouseDown = (e) => {
    if (e.button === 0 && !draggingNode) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (draggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / canvasScale;
      const mouseY = (e.clientY - rect.top - panOffset.y) / canvasScale;

      const newX = Math.max(50, Math.min(mouseX - dragOffset.x, 950));
      const newY = Math.max(50, Math.min(mouseY - dragOffset.y, 550));

      workflow.nodes = workflow.nodes.map(node => 
        node.id === draggingNode 
          ? { ...node, position: { x: newX, y: newY } }
          : node
      );
    } else if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [draggingNode, dragOffset, canvasScale, panOffset, isPanning, lastPanPoint, workflow]);

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
        
        {/* Icon (using foreignObject to render React component) */}
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

        .ai-recommendations-panel {
          width: ${aiPanelOpen ? '320px' : '60px'};
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
          z-index: 10;
        }

        .ai-panel-header {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          min-height: 64px;
        }

        .ai-panel-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-panel-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .ai-panel-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          opacity: ${aiPanelOpen ? 1 : 0};
          transition: opacity 0.3s ease;
        }

        .ai-recommendations-list {
          flex: 1;
          overflow-y: auto;
          padding: ${aiPanelOpen ? '16px' : '8px'};
        }

        .ai-recommendation {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          border-left: 3px solid var(--priority-color);
          transition: all 0.2s ease;
          display: ${aiPanelOpen ? 'block' : 'none'};
        }

        .ai-recommendation:hover {
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .recommendation-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .recommendation-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--priority-color);
          color: white;
        }

        .recommendation-priority {
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
          background: var(--priority-color);
        }

        .recommendation-message {
          font-size: 11px;
          color: #374151;
          line-height: 1.4;
          margin: 0;
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
        }

        .connection-progress {
          stroke: #10b981;
          strokeWidth: 3;
          fill: none;
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
      `}</style>

      <div className="ai-recommendations-panel">
        <div className="ai-panel-header">
          <button 
            className="ai-panel-toggle"
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            type="button"
          >
            <Brain size={18} />
          </button>
          {aiPanelOpen && (
            <>
              <h3 className="ai-panel-title">Recomendaciones IA</h3>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>Activo</span>
              </div>
            </>
          )}
        </div>
        
        <div className="ai-recommendations-list">
          {workflow?.aiRecommendations?.map((rec, index) => {
            const IconComponent = getRecommendationIcon(rec.type);
            const priorityColor = getPriorityColor(rec.priority);
            
            return (
              <div 
                key={index} 
                className="ai-recommendation"
                style={{ '--priority-color': priorityColor }}
              >
                <div className="recommendation-header">
                  <div className="recommendation-icon">
                    <IconComponent size={12} />
                  </div>
                  <div className="recommendation-priority">
                    {rec.priority}
                  </div>
                </div>
                <p className="recommendation-message">{rec.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="workflow-canvas-container">
        <div className="canvas-header">
          <h2 className="canvas-title">{workflow?.name}</h2>
          <p className="canvas-subtitle">{workflow?.description}</p>
          <div className="canvas-stats">
            <div className="canvas-stat">
              <div className="canvas-stat-value">{workflow?.nodes?.length || 0}</div>
              <div className="canvas-stat-label">Procesos</div>
            </div>
            <div className="canvas-stat">
              <div className="canvas-stat-value">{workflow?.totalDuration}</div>
              <div className="canvas-stat-label">Duración</div>
            </div>
            <div className="canvas-stat">
              <div className="canvas-stat-value">{workflow?.estimatedCost}</div>
              <div className="canvas-stat-label">Inversión</div>
            </div>
            <div className="canvas-stat">
              <div className="canvas-stat-value">{workflow?.riskScore}/10</div>
              <div className="canvas-stat-label">Riesgo</div>
            </div>
          </div>
        </div>

        <div className="canvas-area">
          <div className="canvas-controls">
            <button className="control-btn" onClick={zoomIn} type="button" title="Zoom In">
              <ZoomIn size={16} />
            </button>
            <button className="control-btn" onClick={zoomOut} type="button" title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <button className="control-btn" onClick={resetView} type="button" title="Reset View">
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
              {workflow?.connections?.map((conn, index) => {
                const fromNode = workflow.nodes.find(n => n.id === conn.from);
                const toNode = workflow.nodes.find(n => n.id === conn.to);
                
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
                    />
                    
                    {progressLength > 0 && (
                      <line
                        x1={x1} y1={y1}
                        x2={x1Progress} y2={y1Progress}
                        className="connection-progress"
                        markerEnd={progressLength === 100 ? "url(#arrowhead-progress)" : "none"}
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {workflow?.nodes?.map((node) => (
                <NodeComponent 
                  key={node.id} 
                  node={node} 
                  onClick={onNodeSelect}
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
    </div>
  );
};

export default WorkflowCanvas;