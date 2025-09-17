import React, { useState } from 'react';
import { 
  Database, Plus, RefreshCw, Settings, Search, Filter,
  FileSpreadsheet, Cloud, Server, Link, Zap, CheckCircle,
  AlertTriangle, Clock, Edit3, Trash2, Upload, Download,
  BarChart3, Activity, Wifi, WifiOff
} from 'lucide-react';

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [dataSources] = useState([
    {
      id: 1,
      name: 'Sistema ERP Principal',
      type: 'database',
      status: 'connected',
      lastSync: '2024-01-15T16:30:00Z',
      records: 125430,
      size: '2.3 GB',
      frequency: 'realtime',
      tables: ['products', 'orders', 'customers', 'inventory'],
      health: 98.5,
      logo: '🗃️'
    },
    {
      id: 2,
      name: 'Google Sheets - Ventas',
      type: 'cloud',
      status: 'connected',
      lastSync: '2024-01-15T16:15:00Z',
      records: 8734,
      size: '45 MB',
      frequency: 'hourly',
      tables: ['sales_data', 'targets', 'regions'],
      health: 95.2,
      logo: '📊'
    },
    {
      id: 3,
      name: 'API Analytics',
      type: 'api',
      status: 'warning',
      lastSync: '2024-01-15T14:22:00Z',
      records: 45670,
      size: '156 MB',
      frequency: 'daily',
      tables: ['metrics', 'events', 'users'],
      health: 78.3,
      logo: '🔗'
    },
    {
      id: 4,
      name: 'Sensores IoT',
      type: 'iot',
      status: 'error',
      lastSync: '2024-01-15T12:00:00Z',
      records: 0,
      size: '0 MB',
      frequency: 'realtime',
      tables: ['temperature', 'pressure', 'humidity'],
      health: 0,
      logo: '📡'
    },
    {
      id: 5,
      name: 'Excel Reportes',
      type: 'file',
      status: 'connected',
      lastSync: '2024-01-15T15:45:00Z',
      records: 3420,
      size: '12 MB',
      frequency: 'manual',
      tables: ['monthly_report', 'kpis', 'forecasts'],
      health: 100,
      logo: '📁'
    }
  ]);

  const [integrations] = useState([
    {
      name: 'SAP ERP',
      logo: '🔷',
      status: 'available',
      description: 'Sistema de planificación empresarial',
      category: 'ERP'
    },
    {
      name: 'Salesforce',
      logo: '☁️',
      status: 'available',
      description: 'CRM y automatización de ventas',
      category: 'CRM'
    },
    {
      name: 'Microsoft Power BI',
      logo: '📊',
      status: 'available',
      description: 'Análisis de datos y visualización',
      category: 'Analytics'
    },
    {
      name: 'Tableau',
      logo: '📈',
      status: 'available',
      description: 'Visualización y análisis de datos',
      category: 'Analytics'
    },
    {
      name: 'MongoDB',
      logo: '🍃',
      status: 'available',
      description: 'Base de datos NoSQL',
      category: 'Database'
    },
    {
      name: 'Amazon S3',
      logo: '📦',
      status: 'available',
      description: 'Almacenamiento en la nube',
      category: 'Storage'
    },
    {
      name: 'Apache Kafka',
      logo: '⚡',
      status: 'available',
      description: 'Streaming de datos en tiempo real',
      category: 'Streaming'
    },
    {
      name: 'Oracle Database',
      logo: '🏛️',
      status: 'available',
      description: 'Sistema de gestión de base de datos',
      category: 'Database'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} className="status-connected" />;
      case 'warning': return <AlertTriangle size={16} className="status-warning" />;
      case 'error': return <Wifi size={16} className="status-error" />;
      default: return <Clock size={16} className="status-pending" />;
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const filteredSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || source.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <style jsx>{`
        .data-management-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .management-header {
          margin-bottom: 32px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 800;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .header-subtitle {
          font-size: 16px;
          color: #6b7684;
          margin: 0 0 24px 0;
        }

        .header-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .management-tabs {
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
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        .controls-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .search-filters {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;
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

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
        }

        .action-buttons {
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

        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .source-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
          background: var(--health-color);
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

        .source-logo {
          font-size: 24px;
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
        }

        .status-connected { color: #10b981; }
        .status-warning { color: #f59e0b; }
        .status-error { color: #ef4444; }
        .status-pending { color: #6b7280; }

        .source-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
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

        .health-bar {
          margin-bottom: 16px;
        }

        .health-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: 12px;
        }

        .health-progress {
          width: 100%;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
        }

        .health-fill {
          height: 100%;
          background: var(--health-color);
          transition: width 0.3s ease;
          border-radius: 3px;
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

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .integration-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .integration-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .integration-logo {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .integration-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 8px;
        }

        .integration-description {
          font-size: 13px;
          color: #6b7684;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .integration-category {
          display: inline-block;
          padding: 4px 8px;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .header-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .sources-grid,
          .integrations-grid {
            grid-template-columns: 1fr;
          }
          
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-filters {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="data-management-container">
        <div className="management-header">
          <h1 className="header-title">Gestión de Fuentes de Datos</h1>
          <p className="header-subtitle">
            Administre y monitoree todas las fuentes de datos conectadas a sus proyectos
          </p>
          
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{dataSources.length}</div>
              <div className="stat-label">Fuentes Conectadas</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {dataSources.reduce((acc, source) => acc + source.records, 0).toLocaleString()}
              </div>
              <div className="stat-label">Registros Totales</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {dataSources.filter(s => s.status === 'connected').length}
              </div>
              <div className="stat-label">Fuentes Activas</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {Math.round(dataSources.reduce((acc, source) => acc + source.health, 0) / dataSources.length)}%
              </div>
              <div className="stat-label">Salud Promedio</div>
            </div>
          </div>
        </div>

        <div className="management-tabs">
          <button 
            className={`tab-button ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            <Database size={16} />
            Fuentes de Datos
          </button>
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <Zap size={16} />
            Integraciones Disponibles
          </button>
          <button 
            className={`tab-button ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            <BarChart3 size={16} />
            Monitoreo
          </button>
        </div>

        {activeTab === 'sources' && (
          <>
            <div className="controls-section">
              <div className="search-filters">
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
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="connected">Conectado</option>
                  <option value="warning">Advertencia</option>
                  <option value="error">Error</option>
                </select>
              </div>
              
              <div className="action-buttons">
                <button className="btn btn-secondary">
                  <RefreshCw size={16} />
                  Sincronizar Todo
                </button>
                <button className="btn btn-primary">
                  <Plus size={16} />
                  Añadir Fuente
                </button>
              </div>
            </div>

            <div className="sources-grid">
              {filteredSources.map((source) => (
                <div 
                  key={source.id} 
                  className="source-card"
                  style={{ '--health-color': getHealthColor(source.health) }}
                >
                  <div className="source-header">
                    <div className="source-info">
                      <div className="source-logo">{source.logo}</div>
                      <div className="source-details">
                        <h3>{source.name}</h3>
                        <div className="source-type">{source.type}</div>
                      </div>
                    </div>
                    <div className="source-status">
                      {getStatusIcon(source.status)}
                      {source.status === 'connected' ? 'Conectado' : 
                       source.status === 'warning' ? 'Advertencia' : 
                       source.status === 'error' ? 'Error' : 'Pendiente'}
                    </div>
                  </div>

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
                      <div className="metric-value">{source.frequency}</div>
                      <div className="metric-label">Frecuencia</div>
                    </div>
                  </div>

                  <div className="health-bar">
                    <div className="health-label">
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                        Salud del Sistema
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: getHealthColor(source.health) }}>
                        {source.health}%
                      </span>
                    </div>
                    <div className="health-progress">
                      <div 
                        className="health-fill"
                        style={{ width: `${source.health}%` }}
                      />
                    </div>
                  </div>

                  <div className="source-actions">
                    <button className="action-btn">
                      <Settings size={12} />
                      Configurar
                    </button>
                    <button className="action-btn">
                      <RefreshCw size={12} />
                      Sincronizar
                    </button>
                    <button className="action-btn">
                      <BarChart3 size={12} />
                      Métricas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'integrations' && (
          <>
            <div className="controls-section">
              <div className="search-filters">
                <div className="search-container">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar integraciones..."
                  />
                </div>
                <select className="filter-select">
                  <option value="all">Todas las categorías</option>
                  <option value="erp">ERP</option>
                  <option value="crm">CRM</option>
                  <option value="analytics">Analytics</option>
                  <option value="database">Database</option>
                  <option value="storage">Storage</option>
                </select>
              </div>
              
              <div className="action-buttons">
                <button className="btn btn-secondary">
                  <Filter size={16} />
                  Filtros Avanzados
                </button>
              </div>
            </div>

            <div className="integrations-grid">
              {integrations.map((integration, index) => (
                <div key={index} className="integration-card">
                  <div className="integration-logo">{integration.logo}</div>
                  <h3 className="integration-name">{integration.name}</h3>
                  <p className="integration-description">{integration.description}</p>
                  <div className="integration-category">{integration.category}</div>
                  <button className="btn btn-primary" style={{ width: '100%' }}>
                    <Plus size={16} />
                    Conectar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'monitoring' && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7684' }}>
            <Activity size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>Panel de Monitoreo</h3>
            <p>Métricas en tiempo real y alertas de rendimiento próximamente</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DataManagement;