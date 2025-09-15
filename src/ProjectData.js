import React from 'react';
import { ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

const ProjectData = ({ project, getOperationTypeInfo, onBack }) => {
  
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

        .tables-grid {
          display: grid;
          gap: 32px;
        }

        .table-section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .table-section-header {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 20px 24px;
          border-bottom: 1px solid #e5e8eb;
        }

        .table-section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
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

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 14px;
          color: #1a1d21;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .field-name {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 700;
          color: #3b82f6;
        }

        .table-footer {
          padding: 16px 24px;
          font-size: 13px;
          color: #6b7684;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
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

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          {project?.realTimeUpdates && (
            <div className="realtime-status">
              <RefreshCw size={18} className="animate-spin" />
              Datos actualizándose en tiempo real
            </div>
          )}
        </div>

        {project?.data && (
          <div className="tables-grid">
            <div className="table-section">
              <div className="table-section-header">
                <h3 className="table-section-title">Esquema de Datos Petroleros</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
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
                          {field.field.includes('pressure') ? 'Presión en cabeza de pozo' :
                           field.field.includes('temperature') ? 'Temperatura de flujo' :
                           field.field.includes('oil_rate') ? 'Tasa de producción de petróleo' :
                           field.field.includes('gas_rate') ? 'Tasa de producción de gas' :
                           field.field.includes('water_rate') ? 'Tasa de producción de agua' :
                           field.field.includes('well_id') ? 'Identificador único del pozo' :
                           field.field.includes('choke') ? 'Apertura del choke en 64avos' :
                           'Parámetro operacional'}
                        </td>
                        <td style={{ color: '#6b7684', fontSize: '12px' }}>
                          {field.field.includes('pressure') ? 'psi' :
                           field.field.includes('temperature') ? '°F' :
                           field.field.includes('oil_rate') ? 'BOPD' :
                           field.field.includes('gas_rate') ? 'MSCFD' :
                           field.field.includes('water_rate') ? 'BWPD' :
                           field.field.includes('choke') ? '64ths' :
                           field.field.includes('percent') ? '%' :
                           'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-section">
              <div className="table-section-header">
                <h3 className="table-section-title">Datos de Producción en Tiempo Real</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(project.data.records[0]).slice(0, 8).map((key) => (
                        <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {project.data.records.map((record, index) => (
                      <tr key={index}>
                        {Object.values(record).slice(0, 8).map((value, idx) => (
                          <td key={idx}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Object.keys(project.data.records[0]).length > 8 && (
                <div className="table-footer">
                  Mostrando 8 de {Object.keys(project.data.records[0]).length} campos disponibles. 
                  {project.realTimeUpdates && " Datos actualizándose automáticamente cada 5 minutos."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectData;