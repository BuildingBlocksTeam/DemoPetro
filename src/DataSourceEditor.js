import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Check, X, Type, Hash, Calendar, 
  ToggleLeft, FileText, Link, Database, Cloud, Server
} from 'lucide-react';

const DataSourceEditor = ({ initialData, onSave, onCancel }) => {
  const [columns, setColumns] = useState(initialData?.schema || []);
  const [dataSources, setDataSources] = useState([
    { id: 1, name: 'Excel Principal', type: 'excel', status: 'connected' }
  ]);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showAddSource, setShowAddSource] = useState(false);

  const dataTypes = [
    { value: 'string', label: 'Texto', icon: <Type size={14} />, color: '#6b7280' },
    { value: 'number', label: 'Número', icon: <Hash size={14} />, color: '#3b82f6' },
    { value: 'datetime', label: 'Fecha/Hora', icon: <Calendar size={14} />, color: '#10b981' },
    { value: 'boolean', label: 'Verdadero/Falso', icon: <ToggleLeft size={14} />, color: '#f59e0b' },
    { value: 'currency', label: 'Moneda', icon: <span>$</span>, color: '#059669' },
    { value: 'percentage', label: 'Porcentaje', icon: <span>%</span>, color: '#dc2626' }
  ];

  const sourceTypes = [
    { value: 'excel', label: 'Excel', icon: <FileText size={16} />, color: '#10b981' },
    { value: 'database', label: 'Base de Datos', icon: <Database size={16} />, color: '#3b82f6' },
    { value: 'api', label: 'API REST', icon: <Link size={16} />, color: '#f59e0b' },
    { value: 'cloud', label: 'Servicio Cloud', icon: <Cloud size={16} />, color: '#8b5cf6' },
    { value: 'erp', label: 'Sistema ERP', icon: <Server size={16} />, color: '#dc2626' }
  ];

  const addColumn = () => {
    const newColumn = {
      id: Date.now(),
      field: `nueva_columna_${columns.length + 1}`,
      type: 'string',
      sample: 'Valor ejemplo',
      required: false,
      description: ''
    };
    setColumns([...columns, newColumn]);
    setEditingColumn(newColumn.id);
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const updateColumn = (columnId, updates) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const addDataSource = (sourceType) => {
    const newSource = {
      id: Date.now(),
      name: `${sourceTypes.find(s => s.value === sourceType)?.label} ${dataSources.length + 1}`,
      type: sourceType,
      status: 'configuring'
    };
    setDataSources([...dataSources, newSource]);
    setShowAddSource(false);
  };

  const getTypeInfo = (type) => {
    return dataTypes.find(dt => dt.value === type) || dataTypes[0];
  };

  return (
    <>
      <style jsx>{`
        .data-editor-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .editor-header {
          margin-bottom: 32px;
        }

        .editor-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .editor-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .editor-sections {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .section {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .columns-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }

        .columns-table th {
          background: #f8fafc;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e8eb;
        }

        .columns-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 13px;
          color: #1a1d21;
        }

        .column-field {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
          color: #3b82f6;
        }

        .column-type {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          background: var(--type-color);
          color: white;
          width: fit-content;
        }

        .column-actions {
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

        .editing-row {
          background: #f0f8ff;
        }

        .edit-input {
          padding: 6px 8px;
          border: 1px solid #e5e8eb;
          border-radius: 4px;
          font-size: 12px;
          width: 100%;
        }

        .edit-select {
          padding: 6px 8px;
          border: 1px solid #e5e8eb;
          border-radius: 4px;
          font-size: 12px;
          background: white;
        }

        .add-column-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7684;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .add-column-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #f0f8ff;
        }

        .data-sources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .source-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .source-item:hover {
          border-color: #cbd5e1;
        }

        .source-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--source-color);
          color: white;
        }

        .source-info {
          flex: 1;
        }

        .source-name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 2px 0;
        }

        .source-status {
          font-size: 11px;
          color: #6b7684;
          margin: 0;
        }

        .source-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .source-type-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .source-type-btn:hover {
          border-color: var(--source-color);
          background: var(--source-color);
          color: white;
        }

        .editor-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .btn {
          padding: 10px 20px;
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
      `}</style>

      <div className="data-editor-container">
        <div className="editor-header">
          <h2 className="editor-title">Editor de Fuentes de Datos</h2>
          <p className="editor-subtitle">
            Configure las columnas, tipos de datos y fuentes adicionales para su proyecto
          </p>
        </div>

        <div className="editor-sections">
          <div className="section">
            <h3 className="section-title">
              <Edit3 size={20} />
              Columnas y Tipos de Datos
            </h3>

            <table className="columns-table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Tipo</th>
                  <th>Valor Ejemplo</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((column) => (
                  <tr key={column.id} className={editingColumn === column.id ? 'editing-row' : ''}>
                    <td>
                      {editingColumn === column.id ? (
                        <input
                          className="edit-input"
                          value={column.field}
                          onChange={(e) => updateColumn(column.id, { field: e.target.value })}
                        />
                      ) : (
                        <span className="column-field">{column.field}</span>
                      )}
                    </td>
                    <td>
                      {editingColumn === column.id ? (
                        <select
                          className="edit-select"
                          value={column.type}
                          onChange={(e) => updateColumn(column.id, { type: e.target.value })}
                        >
                          {dataTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      ) : (
                        <div 
                          className="column-type"
                          style={{ '--type-color': getTypeInfo(column.type).color }}
                        >
                          {getTypeInfo(column.type).icon}
                          {getTypeInfo(column.type).label}
                        </div>
                      )}
                    </td>
                    <td>
                      {editingColumn === column.id ? (
                        <input
                          className="edit-input"
                          value={column.sample}
                          onChange={(e) => updateColumn(column.id, { sample: e.target.value })}
                        />
                      ) : (
                        column.sample
                      )}
                    </td>
                    <td>
                      {editingColumn === column.id ? (
                        <input
                          className="edit-input"
                          value={column.description || ''}
                          onChange={(e) => updateColumn(column.id, { description: e.target.value })}
                          placeholder="Descripción opcional"
                        />
                      ) : (
                        column.description || 'Sin descripción'
                      )}
                    </td>
                    <td>
                      <div className="column-actions">
                        {editingColumn === column.id ? (
                          <>
                            <button 
                              className="action-btn"
                              onClick={() => setEditingColumn(null)}
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => setEditingColumn(null)}
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="action-btn"
                              onClick={() => setEditingColumn(column.id)}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => deleteColumn(column.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="add-column-btn" onClick={addColumn}>
              <Plus size={16} />
              Añadir Nueva Columna
            </button>
          </div>

          <div className="section">
            <h3 className="section-title">
              <Database size={20} />
              Fuentes de Datos Adicionales
            </h3>

            <div className="data-sources-list">
              {dataSources.map((source) => {
                const sourceType = sourceTypes.find(s => s.value === source.type);
                return (
                  <div 
                    key={source.id} 
                    className="source-item"
                    style={{ '--source-color': sourceType?.color }}
                  >
                    <div className="source-icon">
                      {sourceType?.icon}
                    </div>
                    <div className="source-info">
                      <p className="source-name">{source.name}</p>
                      <p className="source-status">
                        Estado: {source.status === 'connected' ? 'Conectado' : 
                                source.status === 'configuring' ? 'Configurando' : 'Desconectado'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddSource ? (
              <div className="source-types-grid">
                {sourceTypes.map((type) => (
                  <button
                    key={type.value}
                    className="source-type-btn"
                    style={{ '--source-color': type.color }}
                    onClick={() => addDataSource(type.value)}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            ) : (
              <button 
                className="add-column-btn"
                onClick={() => setShowAddSource(true)}
                style={{ marginTop: '16px' }}
              >
                <Plus size={16} />
                Añadir Fuente de Datos
              </button>
            )}
          </div>
        </div>

        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={16} />
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => onSave({ columns, dataSources })}>
            <Check size={16} />
            Guardar Configuración
          </button>
        </div>
      </div>
    </>
  );
};

export default DataSourceEditor;