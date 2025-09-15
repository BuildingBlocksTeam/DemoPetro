import React from 'react';
import { ArrowLeft, Check, Plus, Brain, Bell, BarChart3 } from 'lucide-react';

const EditProject = ({ project, onBack, onSave }) => {
  
  return (
    <>
      <style jsx>{`
        .edit-container {
          max-width: 1000px;
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
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        .data-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .data-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .edit-form {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
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

        .edit-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 40px;
          padding-top: 32px;
          border-top: 2px solid #e5e8eb;
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
          background: #f8f9fa;
          border-color: #d0d5db;
          transform: translateY(-1px);
        }

        .config-card {
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .config-card:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .config-icon {
          margin-bottom: 12px;
          color: #6b7684;
        }

        .config-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .config-desc {
          font-size: 12px;
          color: #6b7684;
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

        <div className="data-header">
          <div>
            <h1>Configuración del Proyecto</h1>
            <p className="data-subtitle">{project?.name}</p>
          </div>
        </div>

        <div className="edit-form">
          <div className="form-section">
            <h3 className="section-title">Información General</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-project-name">Nombre del Proyecto</label>
                <input
                  id="edit-project-name"
                  type="text"
                  className="form-input"
                  defaultValue={project?.name}
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-project-location">Ubicación</label>
                <input
                  id="edit-project-location"
                  type="text"
                  className="form-input"
                  defaultValue={project?.location}
                  placeholder="Ubicación geográfica"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-project-type">Tipo de Operación</label>
                <select 
                  id="edit-project-type"
                  className="form-input" 
                  defaultValue={project?.operationType}
                >
                  <option value="upstream">Upstream - Exploración y Producción</option>
                  <option value="midstream">Midstream - Transporte y Procesamiento</option>
                  <option value="downstream">Downstream - Refinación y Productos</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-project-budget">Presupuesto</label>
                <input
                  id="edit-project-budget"
                  type="text"
                  className="form-input"
                  defaultValue={project?.budget}
                  placeholder="$0.0B"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Configuración de Datos</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-file-type">Fuente de Datos</label>
                <select 
                  id="edit-file-type"
                  className="form-input" 
                  defaultValue={project?.fileType}
                >
                  <option value="google-sheets">Google Sheets</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-risk-level">Nivel de Riesgo</label>
                <select 
                  id="edit-risk-level"
                  className="form-input" 
                  defaultValue={project?.riskLevel}
                >
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </div>
            </div>
            {project?.googleSheetsUrl && (
              <div className="form-group">
                <label className="form-label" htmlFor="edit-sheets-url">URL de Google Sheets</label>
                <input
                  id="edit-sheets-url"
                  type="url"
                  className="form-input"
                  defaultValue={project.googleSheetsUrl}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <h3 className="section-title">Herramientas Avanzadas</h3>
            <div className="form-grid">
              <div className="config-card">
                <Plus className="config-icon" size={32} />
                <div className="config-title">Campos Personalizados</div>
                <div className="config-desc">Añadir campos específicos del proyecto</div>
              </div>
              <div className="config-card">
                <Brain className="config-icon" size={32} />
                <div className="config-title">IA Predictiva</div>
                <div className="config-desc">Configurar modelos de machine learning</div>
              </div>
              <div className="config-card">
                <Bell className="config-icon" size={32} />
                <div className="config-title">Alertas Inteligentes</div>
                <div className="config-desc">Sistema de notificaciones automáticas</div>
              </div>
              <div className="config-card">
                <BarChart3 className="config-icon" size={32} />
                <div className="config-title">Dashboard Ejecutivo</div>
                <div className="config-desc">Configurar métricas y KPIs</div>
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
              onClick={onSave}
              type="button"
            >
              <Check size={16} />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProject;