import React from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Droplets, Zap, Activity } from 'lucide-react';

const ProjectNameForm = ({ projectName, setProjectName, operationType, setOperationType, onNext, onBack }) => {
  // Función para obtener icono de tipo de operación
  const getOperationTypeInfo = (type) => {
    const types = {
      upstream: {
        name: 'Upstream',
        description: 'Exploración y Producción',
        icon: <Droplets size={18} />,
        color: '#3b82f6',
        bgColor: '#dbeafe'
      },
      midstream: {
        name: 'Midstream', 
        description: 'Transporte y Procesamiento',
        icon: <Zap size={18} />,
        color: '#f59e0b',
        bgColor: '#fef3c7'
      },
      downstream: {
        name: 'Downstream',
        description: 'Refinación y Productos',
        icon: <Activity size={18} />,
        color: '#10b981',
        bgColor: '#dcfce7'
      }
    };
    return types[type];
  };

  return (
    <div className="new-project-container">
      <style jsx>{`
        .new-project-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .step-header {
          margin-bottom: 40px;
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
          margin-bottom: 20px;
          transition: color 0.2s ease;
        }

        .back-btn:hover {
          color: #1a1d21;
        }

        .step-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a1d21;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #1a1d21, #374151);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .step-subtitle {
          font-size: 16px;
          color: #6b7684;
          margin: 0;
          font-weight: 500;
        }

        .form-container {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          margin-bottom: 40px;
        }

        .form-section:last-child {
          margin-bottom: 0;
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
          padding: 16px 20px;
          border: 2px solid #e5e8eb;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: #fafbfc;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .form-help {
          font-size: 12px;
          color: #6b7684;
          margin-top: 6px;
        }

        .operation-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .operation-type {
          padding: 24px;
          border: 2px solid #e5e8eb;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          background: white;
          position: relative;
          overflow: hidden;
        }

        .operation-type::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--operation-color, #e5e8eb);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .operation-type:hover {
          border-color: var(--operation-color, #d0d5db);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .operation-type:hover::before {
          opacity: 1;
        }

        .operation-type.selected {
          border-color: var(--operation-color);
          background: var(--operation-bg-color);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .operation-type.selected::before {
          opacity: 1;
        }

        .operation-icon {
          margin-bottom: 16px;
          color: var(--operation-color, #6b7684);
          display: flex;
          justify-content: center;
        }

        .operation-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 8px;
        }

        .operation-desc {
          font-size: 13px;
          color: #6b7684;
          line-height: 1.5;
        }

        .info-box {
          background: linear-gradient(135deg, #f0f8ff, #e0f2fe);
          border: 1px solid #b3d9ff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
        }

        .info-icon {
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-content h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .info-content p {
          font-size: 13px;
          color: #6b7684;
          margin: 0;
          line-height: 1.5;
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }

        .btn {
          padding: 16px 24px;
          border-radius: 12px;
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

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>

      <div className="step-header">
        <button 
          className="back-btn"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>
        <h1 className="step-title">Crear Nuevo Digital Twin</h1>
        <p className="step-subtitle">Configuración inicial del proyecto petrolero</p>
      </div>

      <div className="form-container">
        <div className="form-section">
          <label className="form-label" htmlFor="project-name-input">Nombre del Proyecto</label>
          <input
            id="project-name-input"
            type="text"
            className="form-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej: Campo Marino Golfo Norte - Fase 1"
            autoComplete="off"
          />
          <p className="form-help">
            Use nombres descriptivos que identifiquen la ubicación, tipo de operación y fase del proyecto
          </p>
        </div>

        <div className="form-section">
          <label className="form-label">Tipo de Operación Petrolera</label>
          <div className="operation-types">
            {['upstream', 'midstream', 'downstream'].map((type) => {
              const info = getOperationTypeInfo(type);
              return (
                <div
                  key={type}
                  className={`operation-type ${operationType === type ? 'selected' : ''}`}
                  style={{
                    '--operation-color': info.color,
                    '--operation-bg-color': info.bgColor
                  }}
                  onClick={() => setOperationType(type)}
                >
                  <div className="operation-icon">
                    {React.cloneElement(info.icon, { size: 32 })}
                  </div>
                  <div className="operation-name">{info.name}</div>
                  <div className="operation-desc">{info.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-section">
          <div className="info-box">
            <AlertCircle className="info-icon" size={24} />
            <div className="info-content">
              <h4>Configuración del Digital Twin</h4>
              <p>
                El sistema generará automáticamente un workflow personalizado basado en el tipo de operación seleccionada. 
                Los datos se integrarán desde Excel para crear una simulación en tiempo real del proyecto.
              </p>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <div></div>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!projectName.trim() || !operationType}
            type="button"
          >
            Configurar Fuente de Datos
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectNameForm;