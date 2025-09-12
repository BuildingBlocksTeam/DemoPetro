import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, Database, FileSpreadsheet, 
  Download, Upload, Link, Users, Shield, Monitor, 
  Edit3, Trash2, Plus, ChevronRight, ChevronDown,
  Workflow, Circle, ArrowRight, CheckCircle, Clock,
  AlertTriangle, Zap, Droplets, Activity
} from 'lucide-react';

const Configuracion = () => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState({
    defaultFileFormat: 'xlsx',
    autoSync: true,
    notifications: true,
    dataRetention: 365,
    backupFrequency: 'daily',
    timezone: 'America/Mexico_City',
    language: 'es',
    currency: 'USD'
  });

  // Datos de flujos de tareas petroleras
  const [workflowData] = useState([
    {
      id: 1,
      phase: 'Exploración Sísmica',
      duration: 45,
      cost: 2500000,
      dependencies: [],
      resources: ['Equipo sísmico', 'Geólogos', 'Permisos'],
      status: 'active',
      progress: 78,
      type: 'upstream'
    },
    {
      id: 2,
      phase: 'Análisis Geológico',
      duration: 65,
      cost: 1800000,
      dependencies: [1],
      resources: ['Software Petrel', 'Geofísicos', 'Laboratorio'],
      status: 'planning',
      progress: 0,
      type: 'upstream'
    },
    {
      id: 3,
      phase: 'Perforación Exploratoria',
      duration: 85,
      cost: 5200000,
      dependencies: [2],
      resources: ['Plataforma de perforación', 'Crew', 'Equipos BOP'],
      status: 'pending',
      progress: 0,
      type: 'upstream'
    },
    {
      id: 4,
      phase: 'Evaluación de Formación',
      duration: 25,
      cost: 900000,
      dependencies: [3],
      resources: ['Wire-line tools', 'Analistas', 'Laboratorio'],
      status: 'pending',
      progress: 0,
      type: 'upstream'
    },
    {
      id: 5,
      phase: 'Ingeniería de Pipeline',
      duration: 95,
      cost: 3800000,
      dependencies: [4],
      resources: ['Ingenieros', 'Software CAESAR II', 'Permisos'],
      status: 'pending',
      progress: 0,
      type: 'midstream'
    },
    {
      id: 6,
      phase: 'Construcción Pipeline',
      duration: 120,
      cost: 8500000,
      dependencies: [5],
      resources: ['Contratistas', 'Materiales', 'Equipos pesados'],
      status: 'pending',
      progress: 0,
      type: 'midstream'
    },
    {
      id: 7,
      phase: 'Refinación - Destilación',
      duration: 180,
      cost: 15000000,
      dependencies: [6],
      resources: ['Unidad de destilación', 'Operadores', 'Catalizadores'],
      status: 'pending',
      progress: 0,
      type: 'downstream'
    }
  ]);

  const [integrations] = useState([
    { name: 'SAP ERP', status: 'connected', lastSync: '2024-01-15T16:00:00Z', format: 'API' },
    { name: 'AVEVA PI System', status: 'connected', lastSync: '2024-01-15T16:15:00Z', format: 'OPC' },
    { name: 'Petrel', status: 'connected', lastSync: '2024-01-15T15:30:00Z', format: 'XML' },
    { name: 'Google Sheets', status: 'disconnected', lastSync: null, format: 'Sheets API' },
    { name: 'Microsoft Excel', status: 'configured', lastSync: '2024-01-15T14:45:00Z', format: 'XLSX' }
  ]);

  // Canvas drawing para workflow
  useEffect(() => {
    drawWorkflowCanvas();
  }, [workflowData]);

  const drawWorkflowCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const nodeWidth = 160;
    const nodeHeight = 80;
    const spacing = 200;
    const startX = 50;
    const startY = 100;
    
    // Colors for different types
    const colors = {
      upstream: '#3b82f6',
      midstream: '#f59e0b',
      downstream: '#22c55e'
    };

    const statusColors = {
      active: '#22c55e',
      planning: '#f59e0b',
      pending: '#6b7280',
      completed: '#3b82f6'
    };

    workflowData.forEach((task, index) => {
      const x = startX + (index % 3) * spacing;
      const y = startY + Math.floor(index / 3) * 120;
      
      // Draw dependencies (arrows)
      task.dependencies.forEach(depId => {
        const depIndex = workflowData.findIndex(t => t.id === depId);
        if (depIndex !== -1) {
          const depX = startX + (depIndex % 3) * spacing + nodeWidth;
          const depY = startY + Math.floor(depIndex / 3) * 120 + nodeHeight / 2;
          
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(depX, depY);
          ctx.lineTo(x, y + nodeHeight / 2);
          ctx.stroke();
          
          // Arrow head
          ctx.fillStyle = '#6b7280';
          ctx.beginPath();
          ctx.moveTo(x - 10, y + nodeHeight / 2 - 5);
          ctx.lineTo(x, y + nodeHeight / 2);
          ctx.lineTo(x - 10, y + nodeHeight / 2 + 5);
          ctx.fill();
        }
      });
      
      // Draw node
      ctx.fillStyle = colors[task.type];
      ctx.fillRect(x, y, nodeWidth, nodeHeight);
      
      // Status indicator
      ctx.fillStyle = statusColors[task.status];
      ctx.fillRect(x + nodeWidth - 20, y + 10, 10, 10);
      
      // Progress bar
      if (task.progress > 0) {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(x + 10, y + nodeHeight - 15, nodeWidth - 20, 5);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x + 10, y + nodeHeight - 15, (nodeWidth - 20) * (task.progress / 100), 5);
      }
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // Phase name (wrapped)
      const words = task.phase.split(' ');
      const maxWidth = nodeWidth - 20;
      let line = '';
      let lines = [];
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      lines.push(line);
      
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line.trim(), x + nodeWidth / 2, y + 25 + lineIndex * 14);
      });
      
      // Duration and cost
      ctx.font = '10px Arial';
      ctx.fillText(`${task.duration} días`, x + nodeWidth / 2, y + 55);
      ctx.fillText(`$${(task.cost / 1000000).toFixed(1)}M`, x + nodeWidth / 2, y + 68);
    });
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Guardando configuración:', config);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} color="#22c55e" />;
      case 'disconnected': return <Circle size={16} color="#ef4444" />;
      case 'configured': return <Clock size={16} color="#f59e0b" />;
      default: return <AlertTriangle size={16} color="#6b7280" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upstream': return <Droplets size={16} />;
      case 'midstream': return <Zap size={16} />;
      case 'downstream': return <Activity size={16} />;
      default: return <Settings size={16} />;
    }
  };

  return (
    <>
      <style jsx>{`
        .config-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        .header-left h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .header-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .config-tabs {
          display: flex;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .tab-button {
          padding: 12px 20px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 500;
          color: #6b7684;
          cursor: pointer;
          transition: all 0.2s ease;
          border-right: 1px solid #e5e8eb;
        }

        .tab-button:last-child {
          border-right: none;
        }

        .tab-button:hover {
          background: #f8f9fa;
          color: #1a1d21;
        }

        .tab-button.active {
          background: #0066cc;
          color: white;
        }

        .config-content {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 24px;
        }

        .config-section {
          margin-bottom: 32px;
        }

        .config-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .config-label {
          font-size: 13px;
          font-weight: 500;
          color: #1a1d21;
        }

        .config-input {
          height: 36px;
          padding: 0 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .config-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .config-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: #e5e8eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-switch.active {
          background: #0066cc;
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-switch.active .toggle-knob {
          transform: translateX(20px);
        }

        .workflow-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 16px;
        }

        .workflow-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e8eb;
        }

        .workflow-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 13px;
          color: #1a1d21;
        }

        .workflow-table tr:last-child td {
          border-bottom: none;
        }

        .workflow-table tr:hover {
          background: #f8f9fa;
        }

        .phase-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-badge {
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-upstream {
          background: #dbeafe;
          color: #2563eb;
        }

        .type-midstream {
          background: #fef3c7;
          color: #d97706;
        }

        .type-downstream {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-planning {
          background: #fef3c7;
          color: #d97706;
        }

        .status-pending {
          background: #f1f5f9;
          color: #64748b;
        }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: #f1f3f5;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066cc, #0052a3);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 11px;
          font-weight: 500;
          color: #6b7684;
          min-width: 30px;
        }

        .canvas-container {
          margin-top: 24px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
          background: #fafbfc;
          overflow-x: auto;
        }

        .workflow-canvas {
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          background: white;
          width: 100%;
          min-width: 800px;
          height: 400px;
        }

        .integrations-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .integrations-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e8eb;
        }

        .integrations-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 13px;
          color: #1a1d21;
        }

        .integrations-table tr:last-child td {
          border-bottom: none;
        }

        .integrations-table tr:hover {
          background: #f8f9fa;
        }

        .integration-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .last-sync {
          font-size: 12px;
          color: #6b7684;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e8eb;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
        }

        .btn-primary:hover {
          background: #0052a3;
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

        .canvas-legend {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7684;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .config-tabs {
            flex-direction: column;
          }

          .tab-button {
            border-right: none;
            border-bottom: 1px solid #e5e8eb;
          }

          .config-grid {
            grid-template-columns: 1fr;
          }

          .canvas-container {
            padding: 12px;
          }

          .workflow-canvas {
            min-width: 600px;
            height: 300px;
          }
        }
      `}</style>

      <div className="config-container">
        <div className="config-header">
          <div className="header-left">
            <h1>Configuración del Sistema</h1>
            <p className="header-subtitle">
              Administración y personalización de la plataforma PetroDT
            </p>
          </div>
        </div>

        <div className="config-tabs">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            Configuración General
          </button>
          <button 
            className={`tab-button ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            Flujos de Trabajo
          </button>
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integraciones
          </button>
        </div>

        <div className="config-content">
          {activeTab === 'general' && (
            <>
              <div className="config-section">
                <h3 className="section-title">
                  <FileSpreadsheet size={20} />
                  Configuración de Archivos
                </h3>
                <div className="config-grid">
                  <div className="config-item">
                    <label className="config-label">Formato de Archivo Predeterminado</label>
                    <select 
                      className="config-input"
                      value={config.defaultFileFormat}
                      onChange={(e) => handleConfigChange('defaultFileFormat', e.target.value)}
                    >
                      <option value="xlsx">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="xls">Excel Legacy (.xls)</option>
                      <option value="sheets">Google Sheets</option>
                    </select>
                  </div>
                  
                  <div className="config-item">
                    <label className="config-label">Retención de Datos (días)</label>
                    <input 
                      type="number"
                      className="config-input"
                      value={config.dataRetention}
                      onChange={(e) => handleConfigChange('dataRetention', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="config-item">
                    <label className="config-label">Frecuencia de Respaldo</label>
                    <select 
                      className="config-input"
                      value={config.backupFrequency}
                      onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                    >
                      <option value="hourly">Cada Hora</option>
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Settings size={20} />
                  Configuración del Sistema
                </h3>
                <div className="config-grid">
                  <div className="config-item">
                    <label className="config-label">Zona Horaria</label>
                    <select 
                      className="config-input"
                      value={config.timezone}
                      onChange={(e) => handleConfigChange('timezone', e.target.value)}
                    >
                      <option value="America/Mexico_City">México (GMT-6)</option>
                      <option value="America/New_York">Nueva York (GMT-5)</option>
                      <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Idioma</label>
                    <select 
                      className="config-input"
                      value={config.language}
                      onChange={(e) => handleConfigChange('language', e.target.value)}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Moneda</label>
                    <select 
                      className="config-input"
                      value={config.currency}
                      onChange={(e) => handleConfigChange('currency', e.target.value)}
                    >
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>

                <div className="config-grid" style={{marginTop: '20px'}}>
                  <div className="config-item">
                    <label className="config-label">Sincronización Automática</label>
                    <div className="config-toggle">
                      <div 
                        className={`toggle-switch ${config.autoSync ? 'active' : ''}`}
                        onClick={() => handleConfigChange('autoSync', !config.autoSync)}
                      >
                        <div className="toggle-knob"></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#6b7684'}}>
                        {config.autoSync ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Notificaciones</label>
                    <div className="config-toggle">
                      <div 
                        className={`toggle-switch ${config.notifications ? 'active' : ''}`}
                        onClick={() => handleConfigChange('notifications', !config.notifications)}
                      >
                        <div className="toggle-knob"></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#6b7684'}}>
                        {config.notifications ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'workflows' && (
            <>
              <div className="config-section">
                <h3 className="section-title">
                  <Workflow size={20} />
                  Datos de Flujos de Trabajo Petroleros
                </h3>
                
                <table className="workflow-table">
                  <thead>
                    <tr>
                      <th>Fase</th>
                      <th>Tipo</th>
                      <th>Duración</th>
                      <th>Costo</th>
                      <th>Estado</th>
                      <th>Progreso</th>
                      <th>Recursos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowData.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <div className="phase-cell">
                            {getTypeIcon(task.type)}
                            {task.phase}
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge type-${task.type}`}>
                            {task.type}
                          </span>
                        </td>
                        <td>{task.duration} días</td>
                        <td>${(task.cost / 1000000).toFixed(1)}M</td>
                        <td>
                          <span className={`status-badge status-${task.status}`}>
                            {task.status === 'active' ? 'Activo' : 
                             task.status === 'planning' ? 'Planificación' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="progress-text">{task.progress}%</span>
                          </div>
                        </td>
                        <td style={{fontSize: '11px', color: '#6b7684'}}>
                          {task.resources.slice(0, 2).join(', ')}
                          {task.resources.length > 2 && ` +${task.resources.length - 2}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Monitor size={20} />
                  Canvas de Proceso de Tareas
                </h3>
                
                <div className="canvas-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#3b82f6'}}></div>
                    <span>Upstream</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#f59e0b'}}></div>
                    <span>Midstream</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#22c55e'}}></div>
                    <span>Downstream</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#22c55e'}}></div>
                    <span>Activo</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#f59e0b'}}></div>
                    <span>Planificación</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#6b7280'}}></div>
                    <span>Pendiente</span>
                  </div>
                </div>

                <div className="canvas-container">
                  <canvas 
                    ref={canvasRef}
                    className="workflow-canvas"
                    width={800}
                    height={400}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'integrations' && (
            <div className="config-section">
              <h3 className="section-title">
                <Database size={20} />
                Integraciones del Sistema
              </h3>
              
              <table className="integrations-table">
                <thead>
                  <tr>
                    <th>Sistema</th>
                    <th>Estado</th>
                    <th>Formato</th>
                    <th>Última Sincronización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {integrations.map((integration, index) => (
                    <tr key={index}>
                      <td>
                        <div className="integration-name">
                          {getStatusIcon(integration.status)}
                          {integration.name}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${integration.status === 'connected' ? 'active' : integration.status}`}>
                          {integration.status === 'connected' ? 'Conectado' : 
                           integration.status === 'configured' ? 'Configurado' : 'Desconectado'}
                        </span>
                      </td>
                      <td>{integration.format}</td>
                      <td>
                        {integration.lastSync ? (
                          <div className="last-sync">
                            {new Date(integration.lastSync).toLocaleString('es-ES')}
                          </div>
                        ) : (
                          <span style={{color: '#6b7684', fontSize: '12px'}}>Nunca</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{padding: '4px 8px', fontSize: '12px'}}>
                          <Settings size={12} />
                          Configurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn btn-secondary">
              <RefreshCw size={16} />
              Restaurar Valores
            </button>
            <button className="btn btn-primary" onClick={saveConfiguration}>
              <Save size={16} />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracion;