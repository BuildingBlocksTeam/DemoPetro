import React from 'react';
import { 
  Plus, Download, BarChart3, MapPin, Database, Workflow, Settings,
  Factory, Truck, Building2, CreditCard, TrendingUp, Target, Users,
  ShoppingCart, PieChart, Search, Headphones
} from 'lucide-react';

const ProjectList = ({ projects, onNewProject, onSelectProject, onEditProject, onViewData, onViewWorkflow }) => {
  
  const getOperationTypeInfo = (type) => {
    const types = {
      manufacturing: {
        name: 'Manufactura',
        description: 'Procesos de Producción',
        icon: <Factory size={18} />,
        color: '#3b82f6',
        bgColor: '#dbeafe'
      },
      logistics: {
        name: 'Logística', 
        description: 'Cadena de Suministro',
        icon: <Truck size={18} />,
        color: '#f59e0b',
        bgColor: '#fef3c7'
      },
      infrastructure: {
        name: 'Infraestructura',
        description: 'Construcción y Desarrollo',
        icon: <Building2 size={18} />,
        color: '#10b981',
        bgColor: '#dcfce7'
      },
      billing: {
        name: 'Facturación',
        description: 'Gestión Financiera',
        icon: <CreditCard size={18} />,
        color: '#8b5cf6',
        bgColor: '#ede9fe'
      },
      business: {
        name: 'Negocio',
        description: 'Estrategia y Análisis',
        icon: <TrendingUp size={18} />,
        color: '#06b6d4',
        bgColor: '#cffafe'
      },
      marketing: {
        name: 'Marketing',
        description: 'Promoción y Ventas',
        icon: <Target size={18} />,
        color: '#ec4899',
        bgColor: '#fce7f3'
      },
      hr: {
        name: 'Recursos Humanos',
        description: 'Gestión de Personal',
        icon: <Users size={18} />,
        color: '#84cc16',
        bgColor: '#ecfccb'
      },
      sales: {
        name: 'Ventas',
        description: 'Canal Comercial',
        icon: <ShoppingCart size={18} />,
        color: '#f97316',
        bgColor: '#fed7aa'
      },
      finance: {
        name: 'Finanzas',
        description: 'Análisis Financiero',
        icon: <PieChart size={18} />,
        color: '#6366f1',
        bgColor: '#e0e7ff'
      },
      research: {
        name: 'Investigación',
        description: 'I+D+i',
        icon: <Search size={18} />,
        color: '#14b8a6',
        bgColor: '#ccfbf1'
      },
      support: {
        name: 'Soporte',
        description: 'Atención al Cliente',
        icon: <Headphones size={18} />,
        color: '#ef4444',
        bgColor: '#fee2e2'
      }
    };
    return types[type] || types.manufacturing;
  };

  const getRiskLevelInfo = (level) => {
    const levels = {
      low: { color: '#10b981', bgColor: '#dcfce7', label: 'Bajo' },
      medium: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Medio' },
      high: { color: '#ef4444', bgColor: '#fee2e2', label: 'Alto' }
    };
    return levels[level];
  };

  return (
    <>
      <style jsx>{`
        .projects-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e8eb;
        }

        .header-left h1 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #1a1d21;
          background: linear-gradient(135deg, #1a1d21, #374151);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          font-size: 16px;
          color: #6b7684;
          margin: 0;
          font-weight: 500;
        }

        .header-stats {
          display: flex;
          gap: 24px;
          margin-top: 16px;
        }

        .stat-card {
          text-align: center;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
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

        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #6b7684;
          border: 1px solid #e5e8eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .btn-secondary:hover {
          background: #f8f9fa;
          border-color: #d0d5db;
          transform: translateY(-1px);
        }

        .filters-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e8eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 180px;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          color: #374151;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 24px;
        }

        .project-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--project-color), var(--project-color-dark));
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .project-info h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #1a1d21;
          line-height: 1.3;
        }

        .project-location {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .project-type {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--project-bg-color);
          color: var(--project-color);
        }

        .project-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .metric-card {
          text-align: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .metric-card h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .metric-card p {
          font-size: 10px;
          color: #64748b;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
        }

        .project-progress {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .progress-percentage {
          font-size: 14px;
          font-weight: 700;
          color: var(--project-color);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--project-color), var(--project-color-light));
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .project-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .status-item {
          text-align: center;
          flex: 1;
        }

        .status-value {
          font-size: 14px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 2px;
        }

        .status-label {
          font-size: 9px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
        }

        .project-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .action-btn {
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          background: white;
          color: #6b7684;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .action-btn:hover {
          border-color: var(--project-color);
          color: var(--project-color);
          transform: translateY(-1px);
        }

        .risk-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--risk-bg-color);
          color: var(--risk-color);
          border: 1px solid var(--risk-color);
        }

        @media (max-width: 768px) {
          .projects-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .filters-section {
            flex-direction: column;
          }

          .project-metrics {
            grid-template-columns: 1fr 1fr;
          }

          .header-stats {
            flex-wrap: wrap;
            gap: 16px;
          }
        }
      `}</style>

      <div className="projects-container">
        <div className="projects-header">
          <div className="header-left">
            <h1>Digital Twin Platform</h1>
            <p className="header-subtitle">
              Gestión integral de proyectos con gemelos digitales avanzados
            </p>
            <div className="header-stats">
              <div className="stat-card">
                <div className="stat-value">{projects.length}</div>
                <div className="stat-label">Proyectos Activos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {projects.reduce((acc, p) => acc + (p.team || 0), 0)}
                </div>
                <div className="stat-label">Personal Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  ${(projects.reduce((acc, p) => {
                    const budget = p.budget?.replace(/[$B]/g, '') || '0';
                    return acc + parseFloat(budget);
                  }, 0)).toFixed(1)}B
                </div>
                <div className="stat-label">Inversión Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {Math.round(projects.reduce((acc, p) => acc + (p.completion || 0), 0) / projects.length)}%
                </div>
                <div className="stat-label">Progreso Promedio</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" type="button">
              <Download size={16} />
              Exportar Dashboard
            </button>
            <button 
              className="btn btn-primary"
              onClick={onNewProject}
              type="button"
            >
              <Plus size={16} />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Tipo de Operación</label>
            <select className="filter-select">
              <option value="">Todos</option>
              <option value="manufacturing">Manufactura</option>
              <option value="logistics">Logística</option>
              <option value="infrastructure">Infraestructura</option>
              <option value="billing">Facturación</option>
              <option value="business">Negocio</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Recursos Humanos</option>
              <option value="sales">Ventas</option>
              <option value="finance">Finanzas</option>
              <option value="research">Investigación</option>
              <option value="support">Soporte</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Estado</label>
            <select className="filter-select">
              <option value="">Todos</option>
              <option value="active">Activo</option>
              <option value="planning">Planificación</option>
              <option value="completed">Completado</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Nivel de Riesgo</label>
            <select className="filter-select">
              <option value="">Todos</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Ubicación</label>
            <select className="filter-select">
              <option value="">Todas</option>
              <option value="north">Zona Norte</option>
              <option value="south">Zona Sur</option>
              <option value="central">Zona Central</option>
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const operationInfo = getOperationTypeInfo(project.operationType);
            const riskInfo = getRiskLevelInfo(project.riskLevel);
            return (
              <div 
                key={project.id} 
                className="project-card"
                style={{
                  '--project-color': operationInfo.color,
                  '--project-color-dark': operationInfo.color + '20',
                  '--project-color-light': operationInfo.color + '40',
                  '--project-bg-color': operationInfo.bgColor,
                  '--risk-color': riskInfo.color,
                  '--risk-bg-color': riskInfo.bgColor
                }}
              >
                <div className="risk-badge">
                  Riesgo {riskInfo.label}
                </div>

                <div className="project-header">
                  <div className="project-info">
                    <div className="project-location">
                      <MapPin size={12} />
                      {project.location}
                    </div>
                    <h3>{project.name}</h3>
                    <div className="project-type">
                      {operationInfo.icon}
                      {operationInfo.name}
                    </div>
                  </div>
                </div>

                <div className="project-metrics">
                  <div className="metric-card">
                    <h4>{project.budget}</h4>
                    <p>Presupuesto</p>
                  </div>
                  <div className="metric-card">
                    <h4>{project.team}</h4>
                    <p>Personal</p>
                  </div>
                  <div className="metric-card">
                    <h4>{project.workflow?.nodes?.length || 0}</h4>
                    <p>Procesos</p>
                  </div>
                </div>

                <div className="project-progress">
                  <div className="progress-header">
                    <span className="progress-label">Progreso del Proyecto</span>
                    <span className="progress-percentage">{project.completion}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                </div>

                <div className="project-status">
                  <div className="status-item">
                    <div className="status-value">{project.nextMilestone}</div>
                    <div className="status-label">Próximo Hito</div>
                  </div>
                  <div className="status-item">
                    <div className="status-value">{project.nextMilestoneDate}</div>
                    <div className="status-label">Fecha Target</div>
                  </div>
                </div>

                <div className="project-actions">
                  <button 
                    className="action-btn"
                    onClick={() => onViewData(project)}
                    type="button"
                  >
                    <Database size={14} />
                    Datos
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => onViewWorkflow(project)}
                    type="button"
                  >
                    <Workflow size={14} />
                    Digital Twin
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => onEditProject(project)}
                    type="button"
                  >
                    <Settings size={14} />
                    Config
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProjectList;