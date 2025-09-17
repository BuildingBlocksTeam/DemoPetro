import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Plus, Brain, Bell, BarChart3, Database, 
  Factory, Truck, Building2, Settings, Users, Shield, Target,
  Edit3, Trash2, Link, Zap, Calendar, DollarSign, AlertTriangle
} from 'lucide-react';

const EditProject = ({ project, onBack, onSave }) => {
  const [projectData, setProjectData] = useState({
    name: project?.name || '',
    location: project?.location || '',
    operationType: project?.operationType || 'manufacturing',
    budget: project?.budget || '',
    status: project?.status || 'active',
    riskLevel: project?.riskLevel || 'medium',
    team: project?.team || 0,
    description: project?.description || '',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    priority: project?.priority || 'medium'
  });

  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Sistema ERP', type: 'database', status: 'connected', icon: '🏢' },
    { id: 2, name: 'Sensores IoT', type: 'iot', status: 'connected', icon: '📡' },
    { id: 3, name: 'Analytics Platform', type: 'api', status: 'warning', icon: '📊' }
  ]);

  const [kpis, setKpis] = useState([
    { id: 1, name: 'Eficiencia Operacional', target: 85, current: 87.3, unit: '%', trend: 'up' },
    { id: 2, name: 'Cumplimiento Presupuesto', target: 1.0, current: 0.96, unit: 'ratio', trend: 'down' },
    { id: 3, name: 'Índice de Calidad', target: 95, current: 96.8, unit: '%', trend: 'up' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'milestone', message: 'Recordatorio: Reunión de revisión mañana', active: true },
    { id: 2, type: 'budget', message: 'Alerta de presupuesto al 80%', active: true },
    { id: 3, type: 'quality', message: 'Reporte semanal de calidad', active: false }
  ]);

  const operationTypes = [
    { value: 'manufacturing', label: 'Manufactura', icon: Factory, color: '#3b82f6', description: 'Procesos de producción y fabricación' },
    { value: 'logistics', label: 'Logística', icon: Truck, color: '#f59e0b', description: 'Cadena de suministro y distribución' },
    { value: 'infrastructure', label: 'Infraestructura', icon: Building2, color: '#10b981', description: 'Construcción y desarrollo de infraestructura' }
  ];

  const riskLevels = [
    { value: 'low', label: 'Bajo', color: '#10b981', description: 'Riesgo mínimo, pocas variables críticas' },
    { value: 'medium', label: 'Medio', color: '#f59e0b', description: 'Riesgo moderado, requiere monitoreo' },
    { value: 'high', label: 'Alto', color: '#ef4444', description: 'Riesgo elevado, atención prioritaria' }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planificación', color: '#6b7280' },
    { value: 'active', label: 'Activo', color: '#10b981' },
    { value: 'paused', label: 'Pausado', color: '#f59e0b' },
    { value: 'completed', label: 'Completado', color: '#3b82f6' },
    { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja', color: '#6b7280' },
    { value: 'medium', label: 'Media', color: '#f59e0b' },
    { value: 'high', label: 'Alta', color: '#ef4444' },
    { value: 'critical', label: 'Crítica', color: '#dc2626' }
  ];

  const handleInputChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIntegration = () => {
    const newIntegration = {
      id: Date.now(),
      name: 'Nueva Integración',
      type: 'api',
      status: 'pending',
      icon: '🔗'
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const removeIntegration = (id) => {
    setIntegrations(integrations.filter(int => int.id !== id));
  };

  const addKPI = () => {
    const newKPI = {
      id: Date.now(),
      name: 'Nuevo KPI',
      target: 100,
      current: 0,
      unit: '%',
      trend: 'stable'
    };
    setKpis([...kpis, newKPI]);
  };

  const removeKPI = (id) => {
    setKpis(kpis.filter(kpi => kpi.id !== id));
  };

  const updateKPI = (id, field, value) => {
    setKpis(kpis.map(kpi => 
      kpi.id === id ? { ...kpi, [field]: value } : kpi
    ));
  };

  const toggleNotification = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, active: !notif.active } : notif
    ));
  };

  const handleSave = () => {
    const updatedProject = {
      ...project,
      ...projectData,
      integrations,
      kpis,
      notifications: notifications.filter(n => n.active),
      lastModified: new Date().toISOString()
    };
    onSave(updatedProject);
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.color || '#6b7280';
  };

  const getIntegrationStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <>
      <style jsx>{`
        .edit-container {
          max-width: 1200px;
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

        .edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        .edit-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .edit-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .edit-sections {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .main-form {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .sidebar-panels {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .operation-types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 8px;
        }

        .operation-type-card {
          padding: 16px;
          border: 2px solid #e5e8eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          position: relative;
        }

        .operation-type-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .operation-type-card.selected {
          border-color: var(--type-color);
          background: var(--type-bg-color);
        }

        .operation-icon {
          margin-bottom: 8px;
          color: var(--type-color);
        }

        .operation-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .operation-desc {
          font-size: 12px;
          color: #6b7684;
          line-height: 1.3;
        }

        .risk-levels {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .risk-level {
          flex: 1;
          padding: 12px;
          border: 2px solid #e5e8eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .risk-level:hover {
          border-color: var(--risk-color);
        }

        .risk-level.selected {
          border-color: var(--risk-color);
          background: var(--risk-bg-color);
        }

        .risk-label {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 2px;
        }

        .risk-desc {
          font-size: 11px;
          color: #6b7684;
        }

        .integrations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .integration-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .integration-item:hover {
          border-color: #e5e8eb;
          background: #f8fafc;
        }

        .integration-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .integration-icon {
          font-size: 20px;
        }

        .integration-details h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 2px 0;
        }

        .integration-status {
          font-size: 11px;
          color: #6b7684;
        }

        .integration-actions {
          display: flex;
          gap: 4px;
        }

        .action-btn {
          padding: 4px;
          border: 1px solid #e5e8eb;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          color: #6b7684;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f8fafc;
          color: #1a1d21;
        }

        .add-btn {
          width: 100%;
          padding: 10px;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          background: #f8fafc;
          color: #6b7684;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .add-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #f0f8ff;
        }

        .kpis-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .kpi-item {
          padding: 12px;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .kpi-item:hover {
          border-color: #e5e8eb;
          background: #f8fafc;
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .kpi-name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
        }

        .kpi-values {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .kpi-value-input {
          padding: 4px 8px;
          border: 1px solid #e5e8eb;
          border-radius: 4px;
          font-size: 12px;
        }

        .kpi-progress {
          width: 100%;
          height: 4px;
          background: #f1f5f9;
          border-radius: 2px;
          overflow: hidden;
        }

        .kpi-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.3s ease;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border: 1px solid #f1f5f9;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          border-color: #e5e8eb;
        }

        .notification-toggle {
          width: 16px;
          height: 16px;
          border: 2px solid #e5e8eb;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .notification-toggle.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .notification-message {
          font-size: 12px;
          color: #374151;
          line-height: 1.4;
        }

        .edit-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e5e8eb;
        }

        .btn {
          padding: 12px 24px;
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

        .btn-primary:hover:not(:disabled) {
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
          background: #f8fafc;
          border-color: #d0d5db;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .edit-sections {
            grid-template-columns: 1fr;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .operation-types-grid {
            grid-template-columns: 1fr;
          }
          
          .risk-levels {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="edit-container">
        <button 
          className="back-btn"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>

        <div className="edit-header">
          <div>
            <h1>Configuración del Proyecto</h1>
            <p className="edit-subtitle">Personalice los parámetros y configuraciones del digital twin</p>
          </div>
        </div>

        <div className="edit-sections">
          <div className="main-form">
            <div className="form-section">
              <h3 className="section-title">
                <Settings size={20} />
                Información General
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="project-name">Nombre del Proyecto</label>
                  <input
                    id="project-name"
                    type="text"
                    className="form-input"
                    value={projectData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nombre del proyecto"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="project-location">Ubicación</label>
                  <input
                    id="project-location"
                    type="text"
                    className="form-input"
                    value={projectData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ubicación geográfica"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="project-budget">Presupuesto</label>
                  <input
                    id="project-budget"
                    type="text"
                    className="form-input"
                    value={projectData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="$0.0B"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="project-team">Tamaño del Equipo</label>
                  <input
                    id="project-team"
                    type="number"
                    className="form-input"
                    value={projectData.team}
                    onChange={(e) => handleInputChange('team', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="start-date">Fecha de Inicio</label>
                  <input
                    id="start-date"
                    type="date"
                    className="form-input"
                    value={projectData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="end-date">Fecha de Finalización</label>
                  <input
                    id="end-date"
                    type="date"
                    className="form-input"
                    value={projectData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label" htmlFor="project-description">Descripción</label>
                  <textarea
                    id="project-description"
                    className="form-input form-textarea"
                    value={projectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe los objetivos y alcance del proyecto..."
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <Factory size={20} />
                Tipo de Operación
              </h3>
              <div className="operation-types-grid">
                {operationTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`operation-type-card ${projectData.operationType === type.value ? 'selected' : ''}`}
                      style={{
                        '--type-color': type.color,
                        '--type-bg-color': type.color + '20'
                      }}
                      onClick={() => handleInputChange('operationType', type.value)}
                    >
                      <div className="operation-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="operation-name">{type.label}</div>
                      <div className="operation-desc">{type.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">
                <AlertTriangle size={20} />
                Gestión de Riesgo
              </h3>
              <div className="risk-levels">
                {riskLevels.map((risk) => (
                  <div
                    key={risk.value}
                    className={`risk-level ${projectData.riskLevel === risk.value ? 'selected' : ''}`}
                    style={{
                      '--risk-color': risk.color,
                      '--risk-bg-color': risk.color + '20'
                    }}
                    onClick={() => handleInputChange('riskLevel', risk.value)}
                  >
                    <div className="risk-label">{risk.label}</div>
                    <div className="risk-desc">{risk.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-panels">
            <div className="panel">
              <h4 className="panel-title">
                <Link size={18} />
                Integraciones
              </h4>
              <div className="integrations-list">
                {integrations.map((integration) => (
                  <div key={integration.id} className="integration-item">
                    <div className="integration-info">
                      <span className="integration-icon">{integration.icon}</span>
                      <div className="integration-details">
                        <h4>{integration.name}</h4>
                        <div className="integration-status">
                          {getIntegrationStatusIcon(integration.status)} {integration.status}
                        </div>
                      </div>
                    </div>
                    <div className="integration-actions">
                      <button className="action-btn" title="Configurar">
                        <Settings size={14} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => removeIntegration(integration.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="add-btn" onClick={addIntegration}>
                  <Plus size={14} />
                  Añadir Integración
                </button>
              </div>
            </div>

            <div className="panel">
              <h4 className="panel-title">
                <Target size={18} />
                KPIs del Proyecto
              </h4>
              <div className="kpis-list">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="kpi-item">
                    <div className="kpi-header">
                      <input
                        type="text"
                        className="kpi-name"
                        value={kpi.name}
                        onChange={(e) => updateKPI(kpi.id, 'name', e.target.value)}
                        style={{ border: 'none', background: 'transparent', fontWeight: '600' }}
                      />
                      <div className="integration-actions">
                        <button className="action-btn" title="Editar">
                          <Edit3 size={12} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => removeKPI(kpi.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="kpi-values">
                      <input
                        type="number"
                        className="kpi-value-input"
                        placeholder="Objetivo"
                        value={kpi.target}
                        onChange={(e) => updateKPI(kpi.id, 'target', parseFloat(e.target.value))}
                      />
                      <input
                        type="number"
                        className="kpi-value-input"
                        placeholder="Actual"
                        value={kpi.current}
                        onChange={(e) => updateKPI(kpi.id, 'current', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="kpi-progress">
                      <div 
                        className="kpi-progress-fill"
                        style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <button className="add-btn" onClick={addKPI}>
                  <Plus size={14} />
                  Añadir KPI
                </button>
              </div>
            </div>

            <div className="panel">
              <h4 className="panel-title">
                <Bell size={18} />
                Notificaciones
              </h4>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <button
                      className={`notification-toggle ${notification.active ? 'active' : ''}`}
                      onClick={() => toggleNotification(notification.id)}
                    >
                      {notification.active && <Check size={12} />}
                    </button>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="edit-actions">
          <button 
            className="btn btn-secondary"
            onClick={onBack}
            type="button"
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            type="button"
          >
            <Check size={16} />
            Guardar Configuración
          </button>
        </div>
      </div>
    </>
  );
};

export default EditProject;