import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Clock, Target,
  DollarSign, Users, AlertTriangle, RefreshCw, Maximize2, Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
         BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatisticsPanel = ({ projectData, workflow, isVisible, onClose }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['efficiency', 'cost', 'progress']);
  const [realTimeData, setRealTimeData] = useState({});

  // Datos simulados para gráficos
  const [chartData] = useState({
    efficiency: [
      { date: '2024-01', value: 72, target: 75 },
      { date: '2024-02', value: 78, target: 75 },
      { date: '2024-03', value: 82, target: 80 },
      { date: '2024-04', value: 85, target: 80 },
      { date: '2024-05', value: 88, target: 85 },
      { date: '2024-06', value: 92, target: 85 }
    ],
    cost: [
      { month: 'Ene', planned: 1200000, actual: 1150000 },
      { month: 'Feb', planned: 1300000, actual: 1280000 },
      { month: 'Mar', planned: 1100000, actual: 1320000 },
      { month: 'Abr', planned: 1400000, actual: 1380000 },
      { month: 'May', planned: 1250000, actual: 1190000 },
      { month: 'Jun', planned: 1350000, actual: 1420000 }
    ],
    nodeTypes: [
      { name: 'Planificación', value: 15, color: '#3b82f6' },
      { name: 'Ejecución', value: 45, color: '#10b981' },
      { name: 'Control', value: 25, color: '#f59e0b' },
      { name: 'Cierre', value: 15, color: '#6b7280' }
    ],
    performance: [
      { time: '00:00', cpu: 65, memory: 72, network: 45 },
      { time: '04:00', cpu: 70, memory: 68, network: 52 },
      { time: '08:00', cpu: 85, memory: 82, network: 78 },
      { time: '12:00', cpu: 92, memory: 88, network: 85 },
      { time: '16:00', cpu: 88, memory: 85, network: 80 },
      { time: '20:00', cpu: 75, memory: 78, network: 65 }
    ]
  });

  const [kpis] = useState([
    { 
      id: 'efficiency', 
      name: 'Eficiencia Global', 
      value: 92, 
      unit: '%', 
      change: 8.5, 
      trend: 'up', 
      icon: Target,
      color: '#10b981'
    },
    { 
      id: 'cost_performance', 
      name: 'Rendimiento de Costos', 
      value: 0.96, 
      unit: 'CPI', 
      change: -2.1, 
      trend: 'down', 
      icon: DollarSign,
      color: '#f59e0b'
    },
    { 
      id: 'schedule_performance', 
      name: 'Cumplimiento de Cronograma', 
      value: 1.05, 
      unit: 'SPI', 
      change: 12.3, 
      trend: 'up', 
      icon: Clock,
      color: '#3b82f6'
    },
    { 
      id: 'quality_index', 
      name: 'Índice de Calidad', 
      value: 94, 
      unit: '%', 
      change: 5.2, 
      trend: 'up', 
      icon: Activity,
      color: '#8b5cf6'
    }
  ]);

  // Simulación de datos en tiempo real
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: new Date(),
        activeNodes: Math.floor(Math.random() * 10) + 15,
        throughput: (Math.random() * 100 + 850).toFixed(1),
        errors: Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const getStatusColor = (trend) => {
    return trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        .statistics-panel {
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

        .panel-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 1400px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          padding: 24px;
          border-bottom: 1px solid #e5e8eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }

        .panel-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .panel-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .control-select {
          padding: 6px 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 13px;
        }

        .control-btn {
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .kpi-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
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
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kpi-color);
          color: white;
        }

        .kpi-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--change-color);
        }

        .kpi-value {
          font-size: 32px;
          font-weight: 800;
          color: #1a1d21;
          margin-bottom: 4px;
          line-height: 1;
        }

        .kpi-unit {
          font-size: 14px;
          color: #6b7684;
          display: inline;
          margin-left: 4px;
        }

        .kpi-name {
          font-size: 13px;
          color: #6b7684;
          font-weight: 500;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 16px 0;
        }

        .chart-container {
          width: 100%;
          height: 300px;
        }

        .real-time-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .real-time-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .real-time-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .real-time-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #166534;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .performance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .performance-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="statistics-panel">
        <div className="panel-content">
          <div className="panel-header">
            <h2 className="panel-title">
              <BarChart3 size={24} />
              Estadísticas del Digital Twin
            </h2>
            <div className="panel-controls">
              <select 
                className="control-select"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
              </select>
              <button className="control-btn" title="Filtros">
                <Filter size={16} />
              </button>
              <button className="control-btn" title="Maximizar">
                <Maximize2 size={16} />
              </button>
              <button className="control-btn" onClick={onClose} title="Cerrar">
                ✕
              </button>
            </div>
          </div>

          <div className="panel-body">
            <div className="live-indicator">
              <div className="live-dot"></div>
              Datos en tiempo real - Actualizado: {realTimeData.timestamp?.toLocaleTimeString('es-ES')}
            </div>

            <div className="kpis-grid">
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
                
                return (
                  <div 
                    key={kpi.id} 
                    className="kpi-card"
                    style={{ '--kpi-color': kpi.color }}
                  >
                    <div className="kpi-header">
                      <div className="kpi-icon">
                        <Icon size={20} />
                      </div>
                      <div 
                        className="kpi-change"
                        style={{ '--change-color': getStatusColor(kpi.trend) }}
                      >
                        <TrendIcon size={12} />
                        {Math.abs(kpi.change)}%
                      </div>
                    </div>
                    <div className="kpi-value">
                      {kpi.value}
                      <span className="kpi-unit">{kpi.unit}</span>
                    </div>
                    <div className="kpi-name">{kpi.name}</div>
                  </div>
                );
              })}
            </div>

            <div className="real-time-stats">
              <div className="real-time-card">
                <div className="real-time-value">{realTimeData.activeNodes || 18}</div>
                <div className="real-time-label">Nodos Activos</div>
              </div>
              <div className="real-time-card">
                <div className="real-time-value">{realTimeData.throughput || '892.3'}</div>
                <div className="real-time-label">Rendimiento/min</div>
              </div>
              <div className="real-time-card">
                <div className="real-time-value">{realTimeData.errors || 0}</div>
                <div className="real-time-label">Errores Activos</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3 className="chart-title">Tendencia de Eficiencia</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.efficiency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Eficiencia Actual"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#6b7280" 
                        strokeDasharray="5 5"
                        name="Meta"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">Distribución por Tipo de Nodo</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.nodeTypes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {chartData.nodeTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="performance-grid">
              <div className="chart-card">
                <h3 className="chart-title">Análisis de Costos</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.cost}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${(value/1000).toFixed(0)}K`} />
                      <Legend />
                      <Bar dataKey="planned" fill="#3b82f6" name="Planificado" />
                      <Bar dataKey="actual" fill="#10b981" name="Real" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">Rendimiento del Sistema</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.performance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="cpu" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#fecaca"
                        name="CPU %"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="memory" 
                        stackId="2" 
                        stroke="#3b82f6" 
                        fill="#bfdbfe"
                        name="Memoria %"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="network" 
                        stackId="3" 
                        stroke="#10b981" 
                        fill="#bbf7d0"
                        name="Red %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsPanel;