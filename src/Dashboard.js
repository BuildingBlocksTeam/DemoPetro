import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Droplets, Zap, Activity, DollarSign,
  Users, AlertTriangle, CheckCircle, Clock, Shield, Target,
  Calendar, BarChart3, Gauge, ThermometerSun, MapPin, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [realTimeData, setRealTimeData] = useState({
    timestamp: new Date(),
    production: {
      oil: 312000,
      gas: 1.2,
      trend: 12.5
    },
    operations: {
      activePlatforms: 156,
      efficiency: 94.2,
      safetyDays: 847
    },
    financial: {
      dailyRevenue: 8200000,
      monthlyRevenue: 247000000,
      trend: 15.2
    }
  });

  const [kpis] = useState([
    {
      title: 'Producción Diaria',
      value: '312,000',
      unit: 'BOPD',
      trend: 12.5,
      icon: Droplets,
      color: '#0066cc'
    },
    {
      title: 'Gas Natural',
      value: '1.2',
      unit: 'BCFD',
      trend: 8.3,
      icon: Zap,
      color: '#f59e0b'
    },
    {
      title: 'Ingresos Diarios',
      value: '$8.2M',
      unit: 'USD',
      trend: 15.2,
      icon: DollarSign,
      color: '#22c55e'
    },
    {
      title: 'Eficiencia Operacional',
      value: '94.2%',
      unit: '',
      trend: 2.1,
      icon: Target,
      color: '#8b5cf6'
    }
  ]);

  const [projects] = useState([
    {
      id: 1,
      name: "Águila Dorada",
      type: 'upstream',
      progress: 78,
      status: 'active',
      budget: 850000000,
      spent: 663000000,
      team: 12,
      nextMilestone: 'Perforación AG-08',
      daysLeft: 23,
      location: 'Golfo de México'
    },
    {
      id: 2,
      name: "Terminal Los Andes",
      type: 'midstream',
      progress: 23,
      status: 'planning',
      budget: 420000000,
      spent: 96600000,
      team: 8,
      nextMilestone: 'Inicio construcción',
      daysLeft: 45,
      location: 'Costa del Pacífico'
    },
    {
      id: 3,
      name: "Refinería del Norte",
      type: 'downstream',
      progress: 56,
      status: 'active',
      budget: 1200000000,
      spent: 672000000,
      team: 24,
      nextMilestone: 'Pruebas FCC',
      daysLeft: 12,
      location: 'Monterrey'
    }
  ]);

  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Presión elevada en Plataforma AG-05',
      message: 'Presión de línea de producción 15% por encima del límite',
      timestamp: '2024-01-15T14:30:00Z',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Mantenimiento programado Terminal LA',
      message: 'Mantenimiento preventivo programado para el 20/01/2024',
      timestamp: '2024-01-15T13:45:00Z',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Pozo AG-07 en producción',
      message: 'Pozo completado exitosamente, producción inicial 2,400 BOPD',
      timestamp: '2024-01-15T12:15:00Z',
      priority: 'medium'
    }
  ]);

  const [operationalMetrics] = useState([
    { label: 'Plataformas Activas', value: 156, unit: 'unidades', status: 'normal' },
    { label: 'Pozos Productores', value: 892, unit: 'activos', status: 'normal' },
    { label: 'Refinerías Operando', value: 12, unit: 'plantas', status: 'normal' },
    { label: 'Personal en Campo', value: 3420, unit: 'personas', status: 'normal' },
    { label: 'Reservas Probadas', value: 847, unit: 'MMBO', status: 'good' },
    { label: 'Índice de Seguridad', value: 99.97, unit: '%', status: 'excellent' }
  ]);

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: new Date(),
        production: {
          ...prev.production,
          oil: prev.production.oil + (Math.random() - 0.5) * 100,
          gas: prev.production.gas + (Math.random() - 0.5) * 0.01
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#22c55e';
      case 'good': return '#3b82f6';
      case 'normal': return '#6b7280';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getProjectTypeColor = (type) => {
    switch (type) {
      case 'upstream': return '#3b82f6';
      case 'midstream': return '#f59e0b';
      case 'downstream': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'success': return <CheckCircle size={16} color="#22c55e" />;
      case 'info': return <Clock size={16} color="#3b82f6" />;
      default: return <AlertTriangle size={16} color="#6b7280" />;
    }
  };

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-info h1 {
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

        .real-time-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 13px;
          color: #1a1d21;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--kpi-color);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kpi-color);
          color: white;
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #22c55e;
        }

        .kpi-content {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 4px;
        }

        .kpi-value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1d21;
          line-height: 1;
        }

        .kpi-unit {
          font-size: 14px;
          color: #6b7684;
          font-weight: 500;
        }

        .kpi-title {
          font-size: 13px;
          color: #6b7684;
          font-weight: 500;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .projects-section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .project-item {
          border: 1px solid #f1f3f5;
          border-radius: 6px;
          padding: 16px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .project-item:hover {
          border-color: #e5e8eb;
          background: #f8f9fa;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .project-info h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px 0;
          color: #1a1d21;
        }

        .project-location {
          font-size: 12px;
          color: #6b7684;
          margin: 0;
        }

        .project-type {
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .project-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          font-size: 11px;
          color: #6b7684;
        }

        .metric-item {
          text-align: center;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .metric-value {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 2px;
        }

        .metric-label {
          font-size: 10px;
          color: #6b7684;
        }

        .progress-section {
          margin: 12px 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .progress-label {
          font-size: 11px;
          color: #6b7684;
        }

        .progress-percentage {
          font-size: 11px;
          font-weight: 600;
          color: #1a1d21;
        }

        .progress-bar {
          width: 100%;
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

        .alerts-section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alert-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #f1f3f5;
          transition: all 0.2s ease;
        }

        .alert-item:hover {
          border-color: #e5e8eb;
          background: #f8f9fa;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert-content {
          flex: 1;
          min-width: 0;
        }

        .alert-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 2px 0;
        }

        .alert-message {
          font-size: 12px;
          color: #6b7684;
          margin: 0 0 4px 0;
          line-height: 1.4;
        }

        .alert-timestamp {
          font-size: 10px;
          color: #9ca3af;
        }

        .metrics-section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric-card {
          text-align: center;
          padding: 16px 12px;
          border: 1px solid #f1f3f5;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .metric-card:hover {
          border-color: #e5e8eb;
          background: #f8f9fa;
        }

        .metric-card-value {
          font-size: 20px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 4px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .metric-card-unit {
          font-size: 12px;
          font-weight: 500;
          color: #6b7684;
        }

        .metric-card-label {
          font-size: 11px;
          color: #6b7684;
          font-weight: 500;
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin-left: 4px;
        }

        @media (max-width: 1024px) {
          .main-grid,
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .dashboard-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .kpis-grid {
            grid-template-columns: 1fr;
          }
          
          .project-metrics {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-info">
            <h1>Centro de Control Operacional</h1>
            <p className="header-subtitle">
              Monitoreo en tiempo real de operaciones petroleras globales
            </p>
          </div>
          
          <div className="real-time-indicator">
            <div className="live-dot"></div>
            <span>Actualizado: {realTimeData.timestamp.toLocaleTimeString('es-ES')}</span>
            <RefreshCw size={14} />
          </div>
        </div>

        <div className="kpis-grid">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={index} 
                className="kpi-card" 
                style={{'--kpi-color': kpi.color}}
              >
                <div className="kpi-header">
                  <div className="kpi-icon" style={{background: kpi.color}}>
                    <Icon size={20} />
                  </div>
                  <div className="kpi-trend">
                    <TrendingUp size={12} />
                    +{kpi.trend}%
                  </div>
                </div>
                
                <div className="kpi-content">
                  <span className="kpi-value">{kpi.value}</span>
                  {kpi.unit && <span className="kpi-unit">{kpi.unit}</span>}
                </div>
                
                <div className="kpi-title">{kpi.title}</div>
              </div>
            );
          })}
        </div>

        <div className="main-grid">
          <div className="projects-section">
            <h3 className="section-title">
              <BarChart3 size={18} />
              Proyectos Críticos
            </h3>
            
            <div className="projects-list">
              {projects.map((project) => (
                <div key={project.id} className="project-item">
                  <div className="project-header">
                    <div className="project-info">
                      <h4>{project.name}</h4>
                      <p className="project-location">
                        <MapPin size={10} style={{display: 'inline', marginRight: '4px'}} />
                        {project.location}
                      </p>
                    </div>
                    <span 
                      className="project-type" 
                      style={{background: getProjectTypeColor(project.type)}}
                    >
                      {project.type}
                    </span>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Progreso General</span>
                      <span className="progress-percentage">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${project.progress}%`}}
                      />
                    </div>
                  </div>

                  <div className="project-metrics">
                    <div className="metric-item">
                      <div className="metric-value">
                        ${(project.spent / 1000000).toFixed(0)}M
                      </div>
                      <div className="metric-label">Gastado</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">{project.team}</div>
                      <div className="metric-label">Equipo</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">{project.daysLeft}</div>
                      <div className="metric-label">Días restantes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alerts-section">
            <h3 className="section-title">
              <AlertTriangle size={18} />
              Alertas Operacionales
            </h3>
            
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-icon">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content">
                    <h4 className="alert-title">{alert.title}</h4>
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-timestamp">
                      {new Date(alert.timestamp).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <h3 className="section-title">
            <Gauge size={18} />
            Métricas Operacionales
          </h3>
          
          <div className="metrics-grid">
            {operationalMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-card-value">
                  {typeof metric.value === 'number' ? 
                    metric.value.toLocaleString('es-ES') : 
                    metric.value}
                  {metric.unit && (
                    <span className="metric-card-unit">{metric.unit}</span>
                  )}
                  <div 
                    className="status-indicator" 
                    style={{background: getStatusColor(metric.status)}}
                  />
                </div>
                <div className="metric-card-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;