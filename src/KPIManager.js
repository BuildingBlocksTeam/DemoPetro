import React, { useState } from 'react';
import { 
  Plus, Target, TrendingUp, DollarSign, Clock, Users, Activity,
  Edit3, Trash2, Link, Settings, AlertCircle, Check, X, BarChart3
} from 'lucide-react';

const KPIManager = ({ workflow, onSave, onClose }) => {
  const [kpis, setKPIs] = useState([
    {
      id: 1,
      name: 'Eficiencia Operacional',
      description: 'Porcentaje de eficiencia general del proceso',
      type: 'percentage',
      target: 85,
      current: 92,
      unit: '%',
      linkedNode: 'production_phase',
      linkedMetric: 'efficiency_rate',
      frequency: 'daily',
      icon: 'target',
      color: '#10b981',
      formula: '(output / input) * 100',
      status: 'active'
    },
    {
      id: 2,
      name: 'Cumplimiento de Presupuesto',
      description: 'Adherencia al presupuesto planificado',
      type: 'currency',
      target: 1000000,
      current: 950000,
      unit: 'USD',
      linkedNode: 'budget_control',
      linkedMetric: 'actual_cost',
      frequency: 'weekly',
      icon: 'dollar',
      color: '#3b82f6',
      formula: 'actual_cost / planned_cost',
      status: 'active'
    }
  ]);
  
  const [editingKPI, setEditingKPI] = useState(null);
  const [showKPIForm, setShowKPIForm] = useState(false);
  const [newKPI, setNewKPI] = useState({
    name: '',
    description: '',
    type: 'percentage',
    target: 0,
    unit: '%',
    linkedNode: '',
    linkedMetric: '',
    frequency: 'daily',
    icon: 'target',
    color: '#10b981',
    formula: ''
  });

  const kpiTypes = [
    { value: 'percentage', label: 'Porcentaje', unit: '%', icon: Target },
    { value: 'currency', label: 'Moneda', unit: 'USD', icon: DollarSign },
    { value: 'time', label: 'Tiempo', unit: 'hrs', icon: Clock },
    { value: 'count', label: 'Contador', unit: 'unidades', icon: Users },
    { value: 'rate', label: 'Tasa', unit: '/min', icon: Activity },
    { value: 'score', label: 'Puntuación', unit: 'pts', icon: TrendingUp }
  ];

  const iconOptions = [
    { value: 'target', icon: Target, color: '#10b981' },
    { value: 'dollar', icon: DollarSign, color: '#3b82f6' },
    { value: 'clock', icon: Clock, color: '#f59e0b' },
    { value: 'users', icon: Users, color: '#8b5cf6' },
    { value: 'activity', icon: Activity, color: '#ef4444' },
    { value: 'trending', icon: TrendingUp, color: '#06b6d4' }
  ];

  const frequencies = [
    { value: 'realtime', label: 'Tiempo Real' },
    { value: 'hourly', label: 'Cada Hora' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' }
  ];

  const availableNodes = workflow?.nodes || [];
  const availableMetrics = [
    'efficiency_rate',
    'actual_cost',
    'completion_percentage',
    'resource_utilization',
    'quality_score',
    'throughput',
    'error_rate',
    'response_time'
  ];

  const addKPI = () => {
    if (!newKPI.name.trim()) return;
    
    const kpi = {
      ...newKPI,
      id: Date.now(),
      current: Math.floor(Math.random() * newKPI.target) + (newKPI.target * 0.8),
      status: 'active'
    };
    
    setKPIs([...kpis, kpi]);
    setNewKPI({
      name: '',
      description: '',
      type: 'percentage',
      target: 0,
      unit: '%',
      linkedNode: '',
      linkedMetric: '',
      frequency: 'daily',
      icon: 'target',
      color: '#10b981',
      formula: ''
    });
    setShowKPIForm(false);
  };

  const deleteKPI = (kpiId) => {
    setKPIs(kpis.filter(kpi => kpi.id !== kpiId));
  };

  const updateKPI = (kpiId, updates) => {
    setKPIs(kpis.map(kpi => kpi.id === kpiId ? { ...kpi, ...updates } : kpi));
  };

  const getKPIIcon = (iconName) => {
    const iconConfig = iconOptions.find(opt => opt.value === iconName);
    return iconConfig ? iconConfig.icon : Target;
  };

  const getKPIColor = (iconName) => {
    const iconConfig = iconOptions.find(opt => opt.value === iconName);
    return iconConfig ? iconConfig.color : '#10b981';
  };

  const getStatusColor = (current, target, type) => {
    const ratio = current / target;
    if (type === 'percentage' && ratio >= 0.9) return '#10b981';
    if (type === 'currency' && ratio <= 1.1) return '#10b981';
    if (ratio >= 0.8) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <>
      <style jsx>{`
        .kpi-manager {
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
          padding: 20px;
        }

        .manager-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .manager-header {
          padding: 24px;
          border-bottom: 1px solid #e5e8eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }

        .manager-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .header-btn {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .manager-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .kpi-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          position: relative;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .kpi-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kpi-color);
          color: white;
        }

        .kpi-actions {
          display: flex;
          gap: 4px;
        }

        .kpi-action-btn {
          padding: 4px;
          border: 1px solid #e5e8eb;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          color: #6b7684;
          transition: all 0.2s ease;
        }

        .kpi-action-btn:hover {
          background: #f8fafc;
          color: #1a1d21;
        }

        .kpi-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 4px 0;
        }

        .kpi-description {
          font-size: 12px;
          color: #6b7684;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .kpi-value-section {
          margin-bottom: 16px;
        }

        .kpi-current {
          font-size: 24px;
          font-weight: 800;
          color: var(--status-color);
          margin-bottom: 4px;
        }

        .kpi-target {
          font-size: 12px;
          color: #6b7684;
        }

        .kpi-progress {
          width: 100%;
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .kpi-progress-fill {
          height: 100%;
          background: var(--status-color);
          transition: width 0.3s ease;
        }

        .kpi-metadata {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 11px;
          color: #6b7684;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
        }

        .metadata-label {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .linked-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
          font-size: 10px;
          font-weight: 600;
        }

        .kpi-form {
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .form-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-input {
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .form-select {
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .form-textarea {
          padding: 8px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          min-height: 60px;
        }

        .color-picker-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 8px;
        }

        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .color-option.selected {
          border-color: #1a1d21;
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
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

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7684;
        }

        .empty-icon {
          margin-bottom: 16px;
          opacity: 0.5;
        }
      `}</style>

      <div className="kpi-manager">
        <div className="manager-content">
          <div className="manager-header">
            <h2 className="manager-title">
              <Target size={24} />
              Gestor de KPIs
            </h2>
            <div className="header-actions">
              <button 
                className="header-btn"
                onClick={() => setShowKPIForm(!showKPIForm)}
              >
                <Plus size={16} />
                Nuevo KPI
              </button>
              <button className="header-btn" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div className="manager-body">
            {showKPIForm && (
              <div className="kpi-form">
                <h3 className="form-title">Crear Nuevo KPI</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombre del KPI</label>
                    <input
                      className="form-input"
                      type="text"
                      value={newKPI.name}
                      onChange={(e) => setNewKPI({...newKPI, name: e.target.value})}
                      placeholder="Ej: Eficiencia de Producción"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Tipo de Métrica</label>
                    <select
                      className="form-select"
                      value={newKPI.type}
                      onChange={(e) => setNewKPI({...newKPI, type: e.target.value})}
                    >
                      {kpiTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Valor Objetivo</label>
                    <input
                      className="form-input"
                      type="number"
                      value={newKPI.target}
                      onChange={(e) => setNewKPI({...newKPI, target: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Frecuencia</label>
                    <select
                      className="form-select"
                      value={newKPI.frequency}
                      onChange={(e) => setNewKPI({...newKPI, frequency: e.target.value})}
                    >
                      {frequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-textarea"
                    value={newKPI.description}
                    onChange={(e) => setNewKPI({...newKPI, description: e.target.value})}
                    placeholder="Describe qué mide este KPI..."
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Vincular a Nodo</label>
                    <select
                      className="form-select"
                      value={newKPI.linkedNode}
                      onChange={(e) => setNewKPI({...newKPI, linkedNode: e.target.value})}
                    >
                      <option value="">Seleccionar nodo...</option>
                      {availableNodes.map(node => (
                        <option key={node.id} value={node.id}>{node.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Métrica Fuente</label>
                    <select
                      className="form-select"
                      value={newKPI.linkedMetric}
                      onChange={(e) => setNewKPI({...newKPI, linkedMetric: e.target.value})}
                    >
                      <option value="">Seleccionar métrica...</option>
                      {availableMetrics.map(metric => (
                        <option key={metric} value={metric}>{metric}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Fórmula de Cálculo (Opcional)</label>
                  <input
                    className="form-input"
                    type="text"
                    value={newKPI.formula}
                    onChange={(e) => setNewKPI({...newKPI, formula: e.target.value})}
                    placeholder="Ej: (actual_value / target_value) * 100"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowKPIForm(false)}
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={addKPI}
                    disabled={!newKPI.name.trim()}
                  >
                    <Check size={16} />
                    Crear KPI
                  </button>
                </div>
              </div>
            )}

            {kpis.length > 0 ? (
              <div className="kpi-grid">
                {kpis.map((kpi) => {
                  const IconComponent = getKPIIcon(kpi.icon);
                  const kpiColor = getKPIColor(kpi.icon);
                  const statusColor = getStatusColor(kpi.current, kpi.target, kpi.type);
                  const progressPercentage = Math.min((kpi.current / kpi.target) * 100, 100);

                  return (
                    <div 
                      key={kpi.id} 
                      className="kpi-card"
                      style={{ 
                        '--kpi-color': kpiColor,
                        '--status-color': statusColor
                      }}
                    >
                      <div className="kpi-header">
                        <div className="kpi-icon">
                          <IconComponent size={20} />
                        </div>
                        <div className="kpi-actions">
                          <button 
                            className="kpi-action-btn"
                            onClick={() => setEditingKPI(kpi.id)}
                            title="Editar"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            className="kpi-action-btn"
                            onClick={() => deleteKPI(kpi.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="kpi-name">{kpi.name}</h4>
                      <p className="kpi-description">{kpi.description}</p>

                      <div className="kpi-value-section">
                        <div className="kpi-current">
                          {kpi.current.toLocaleString()} {kpi.unit}
                        </div>
                        <div className="kpi-target">
                          Objetivo: {kpi.target.toLocaleString()} {kpi.unit}
                        </div>
                      </div>

                      <div className="kpi-progress">
                        <div 
                          className="kpi-progress-fill"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>

                      <div className="kpi-metadata">
                        <div className="metadata-item">
                          <span className="metadata-label">Frecuencia</span>
                          <span>{frequencies.find(f => f.value === kpi.frequency)?.label}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Estado</span>
                          <span>{kpi.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                        </div>
                        {kpi.linkedNode && (
                          <div className="metadata-item">
                            <span className="metadata-label">Vinculado</span>
                            <div className="linked-indicator">
                              <Link size={10} />
                              {availableNodes.find(n => n.id === kpi.linkedNode)?.name || 'Nodo'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Target size={48} />
                </div>
                <h3>No hay KPIs configurados</h3>
                <p>Comience agregando un KPI para monitorear el rendimiento de su digital twin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KPIManager;