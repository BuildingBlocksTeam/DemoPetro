import React, { useState } from 'react';
import { 
  ArrowLeft, RefreshCw, CheckCircle, Edit3, Plus, Settings, 
  Database, FileSpreadsheet, Cloud, Link, Trash2, Eye, 
  Download, Upload, Filter, Search, X
} from 'lucide-react';
import DataSourceEditor from './DataSourceEditor';

const ProjectData = ({ project, getOperationTypeInfo, onBack }) => {
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para múltiples fuentes de datos del proyecto
  const [dataSources, setDataSources] = useState([
    {
      id: 1,
      name: 'Fuente Principal',
      type: 'excel',
      status: 'connected',
      lastSync: project?.lastModified || '2024-01-15T16:30:00Z',
      records: project?.data?.records?.length || 1,
      size: '2.3 MB',
      description: 'Datos principales del proyecto',
      schema: project?.data?.schema || [],
      icon: '📊'
    },
    {
      id: 2,
      name: 'Sensores IoT',
      type: 'iot',
      status: 'connected',
      lastSync: '2024-01-15T16:25:00Z',
      records: 15420,
      size: '45 MB',
      description: 'Datos en tiempo real de sensores',
      schema: [
        { field: 'sensor_id', type: 'string', sample: 'TEMP-001' },
        { field: 'temperature', type: 'number', sample: 24.5 },
        { field: 'humidity', type: 'percentage', sample: 65.2 },
        { field: 'pressure', type: 'number', sample: 1013.25 }
      ],
      icon: '📡'
    },
    {
      id: 3,
      name: 'Sistema ERP',
      type: 'database',
      status: 'warning',
      lastSync: '2024-01-15T14:15:00Z',
      records: 8750,
      size: '12 MB',
      description: 'Datos financieros y de recursos',
      schema: [
        { field: 'cost_center', type: 'string', sample: 'CC-001' },
        { field: 'budget_used', type: 'currency', sample: 125000 },
        { field: 'resource_allocation', type: 'percentage', sample: 87.5 }
      ],
      icon: '🏢'
    }
  ]);

  const sourceTypes = [
    { value: 'excel', label: 'Excel', icon: <FileSpreadsheet size={16} />, color: '#10b981' },
    { value: 'database', label: 'Base de Datos', icon: <Database size={16} />, color: '#3b82f6' },
    { value: 'api', label: 'API REST', icon: <Link size={16} />, color: '#f59e0b' },
    { value: 'cloud', label: 'Servicio Cloud', icon: <Cloud size={16} />, color: '#8b5cf6' },
    { value: 'iot', label: 'Sensores IoT', icon: <span>📡</span>, color: '#ef4444' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} className="status-connected" />;
      case 'warning': return <span className="status-warning">⚠️</span>;
      case 'error': return <span className="status-error">❌</span>;
      default: return <span className="status-pending">⏳</span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeInfo = (type) => {
    return sourceTypes.find(st => st.value === type) || sourceTypes[0];
  };

  const addNewDataSource = (sourceType) => {
    const newSource = {
      id: Date.now(),
      name: `Nueva ${sourceTypes.find(s => s.value === sourceType)?.label}`,
      type: sourceType,
      status: 'pending',
      lastSync: null,
      records: 0,
      size: '0 MB',
      description: 'Fuente de datos recién agregada',
      schema: [],
      icon: sourceTypes.find(s => s.value === sourceType)?.icon || '📄'
    };
    
    setDataSources([...dataSources, newSource]);
    setShowAddSourceModal(false);
  };

  const removeDataSource = (sourceId) => {
    setDataSources(dataSources.filter(source => source.id !== sourceId));
  };

  const editDataSource = (source) => {
    setSelectedDataSource(source);
    setShowDataEditor(true);
  };

  const handleDataEditorSave = (updatedData) => {
    if (selectedDataSource) {
      setDataSources(dataSources.map(source => 
        source.id === selectedDataSource.id 
          ? { ...source, schema: updatedData.columns, lastSync: new Date().toISOString() }
          : source
      ));
    }
    setShowDataEditor(false);
    setSelectedDataSource(null);
  };

  const filteredSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style jsx>{`
        .project-data-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: #6b7684;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 16px;
          transition: color 0.2s ease;
        }

        .back-btn:hover {
          color: #1a1d21;
        }

        .data-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e8eb;
        }

        .data-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #1a1d21;
        }

        .data-subtitle {
          font-size: 16px;
          color: #6b7684;
          margin: 0;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .realtime-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          color: #166534;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #22c55e;
        }

        .sources-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7684;
        }

        .controls-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 10px 16px;
          border-radius: 8px;
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
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: white;
          color: #6b7684;
          border: 1px solid #e5e8eb;
        }

        .btn-secondary:hover {
          background: #f8fafc;
        }

        .data-sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .source-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .source-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--source-color);
        }

        .source-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .source-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .source-info {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .source-icon {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e8eb;
        }

        .source-details h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 4px 0;
        }

        .source-type {
          font-size: 12px;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .source-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--status-color);
        }

        .status-connected { color: #10b981; }
        .status-warning { color: #f59e0b; }
        .status-error { color: #ef4444; }
        .status-pending { color: #6b7280; }

        .source-description {
          font-size: 13px;
          color: #6b7684;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .source-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .metric-item {
          text-align: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .metric-value {
          font-size: 14px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 2px;
        }

        .metric-label {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
        }

        .source-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          background: white;
          color: #6b7684;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #374151;
        }

        .action-btn.danger:hover {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .schema-section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 20px 24px;
          border-bottom: 1px solid #e5e8eb;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0;
        }

        .schema-table {
          width: 100%;
          border-collapse: collapse;
        }

        .schema-table th {
          background: #f8fafc;
          padding: 16px 20px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e8eb;
        }

        .schema-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 14px;
          color: #1a1d21;
        }

        .schema-table tr:hover {
          background: #f8fafc;
        }

        .field-name {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 700;
          color: #3b82f6;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-number {
          background: #dbeafe;
          color: #2563eb;
        }

        .type-datetime {
          background: #dcfce7;
          color: #16a34a;
        }

        .type-string {
          background: #f1f5f9;
          color: #475569;
        }

        .type-percentage {
          background: #fef3c7;
          color: #d97706;
        }

        .type-currency {
          background: #ecfdf5;
          color: #059669;
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

        .source-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .source-type-btn {
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

        .source-type-btn:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .source-type-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .source-type-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .data-sources-grid {
            grid-template-columns: 1fr;
          }

          .sources-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .controls-actions {
            justify-content: stretch;
          }
        }
      `}</style>

      <div className="project-data-container">
        <button 
          className="back-btn"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>

        <div className="data-header">
          <div>
            <h1>{project?.name}</h1>
            <p className="data-subtitle">
              Análisis de datos - {getOperationTypeInfo(project?.operationType).description}
            </p>
          </div>
          <div className="header-actions">
            {project?.realTimeUpdates && (
              <div className="realtime-status">
                <RefreshCw size={18} className="animate-spin" />
                Datos actualizándose en tiempo real
              </div>
            )}
          </div>
        </div>

        <div className="sources-controls">
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar fuentes de datos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="controls-actions">
            <button className="btn btn-secondary">
              <RefreshCw size={16} />
              Sincronizar Todo
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddSourceModal(true)}
            >
              <Plus size={16} />
              Añadir Fuente
            </button>
          </div>
        </div>

        <div className="data-sources-grid">
          {filteredSources.map((source) => {
            const typeInfo = getTypeInfo(source.type);
            const statusColor = getStatusColor(source.status);
            
            return (
              <div 
                key={source.id} 
                className="source-card"
                style={{ '--source-color': typeInfo.color, '--status-color': statusColor }}
              >
                <div className="source-header">
                  <div className="source-info">
                    <div className="source-icon">{source.icon}</div>
                    <div className="source-details">
                      <h3>{source.name}</h3>
                      <div className="source-type">{typeInfo.label}</div>
                    </div>
                  </div>
                  <div className="source-status">
                    {getStatusIcon(source.status)}
                    {source.status === 'connected' ? 'Conectado' : 
                     source.status === 'warning' ? 'Advertencia' : 
                     source.status === 'error' ? 'Error' : 'Pendiente'}
                  </div>
                </div>

                <p className="source-description">{source.description}</p>

                <div className="source-metrics">
                  <div className="metric-item">
                    <div className="metric-value">{source.records.toLocaleString()}</div>
                    <div className="metric-label">Registros</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{source.size}</div>
                    <div className="metric-label">Tamaño</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{source.schema.length}</div>
                    <div className="metric-label">Campos</div>
                  </div>
                </div>

                <div className="source-actions">
                  <button 
                    className="action-btn"
                    onClick={() => editDataSource(source)}
                  >
                    <Edit3 size={12} />
                    Editar
                  </button>
                  <button className="action-btn">
                    <Eye size={12} />
                    Ver
                  </button>
                  <button className="action-btn">
                    <Settings size={12} />
                    Config
                  </button>
                  {source.id > 1 && (
                    <button 
                      className="action-btn danger"
                      onClick={() => removeDataSource(source.id)}
                    >
                      <Trash2 size={12} />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {project?.data?.schema && (
          <div className="schema-section">
            <div className="section-header">
              <h3 className="section-title">Esquema de Datos Principal</h3>
            </div>
            <table className="schema-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Tipo</th>
                  <th>Valor Ejemplo</th>
                  <th>Descripción Técnica</th>
                  <th>Unidades</th>
                </tr>
              </thead>
              <tbody>
                {project.data.schema.map((field, index) => (
                  <tr key={index}>
                    <td className="field-name">{field.field}</td>
                    <td>
                      <span className={`type-badge type-${field.type}`}>
                        {field.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>{field.sample}</td>
                    <td style={{ color: '#6b7684' }}>
                      {field.field.includes('pressure') ? 'Presión del sistema' :
                       field.field.includes('temperature') ? 'Temperatura operacional' :
                       field.field.includes('rate') ? 'Tasa de procesamiento' :
                       field.field.includes('efficiency') ? 'Eficiencia operacional' :
                       field.field.includes('quality') ? 'Índice de calidad' :
                       field.field.includes('id') ? 'Identificador único' :
                       'Parámetro operacional'}
                    </td>
                    <td style={{ color: '#6b7684', fontSize: '12px' }}>
                      {field.field.includes('pressure') ? 'bar' :
                       field.field.includes('temperature') ? '°C' :
                       field.field.includes('rate') ? 'units/hr' :
                       field.field.includes('efficiency') ? '%' :
                       field.field.includes('quality') ? 'score' :
                       field.field.includes('minutes') ? 'min' :
                       'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para añadir nueva fuente */}
        {showAddSourceModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Añadir Nueva Fuente de Datos</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddSourceModal(false)}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="source-types-grid">
                {sourceTypes.map((type) => (
                  <button
                    key={type.value}
                    className="source-type-btn"
                    onClick={() => addNewDataSource(type.value)}
                  >
                    <div 
                      className="source-type-icon"
                      style={{ background: type.color }}
                    >
                      {type.icon}
                    </div>
                    <div className="source-type-name">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor de datos */}
        {showDataEditor && selectedDataSource && (
          <DataSourceEditor
            initialData={{ schema: selectedDataSource.schema }}
            onSave={handleDataEditorSave}
            onCancel={() => {
              setShowDataEditor(false);
              setSelectedDataSource(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ProjectData;