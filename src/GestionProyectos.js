import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Plus, Search, Filter, Download, Eye, Edit3, MoreVertical, 
  Upload, Link, FileSpreadsheet, FileText, Calendar, 
  DollarSign, Users, TrendingUp, AlertCircle, X, Check,
  Droplets, Zap, Activity, ArrowLeft, ArrowRight, RefreshCw,
  CheckCircle, Clock, AlertTriangle, GitBranch, Database,
  BarChart3, MapPin, Trash2, Settings, Circle, Play,
  Gauge, Thermometer, Wrench, Shield, Target, Layers,
  HardHat, FileCheck, Truck, Factory, PieChart, LineChart,
  Hammer, Clipboard, Building2, Workflow, MonitorSpeaker,
  BookOpen, Calculator, Archive, Award, Brain, Bell,
  Cpu, Zap as Lightning, Fuel, Package, ShoppingCart
} from 'lucide-react';

// Componente ProjectNameForm MOVIDO FUERA del componente principal
const ProjectNameForm = React.memo(({ projectName, setProjectName, operationType, setOperationType, onNext, onBack }) => {
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
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>
        <h1 className="step-title">Crear Nuevo Digital Twin</h1>
        <p className="step-subtitle">Configuración inicial del proyecto petrolero</p>
      </div>

      <div className="form-container">
        <div className="form-section">
          <label className="form-label">Nombre del Proyecto</label>
          <input
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
          >
            Configurar Fuente de Datos
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

const GestionProyectos = () => {
  const [currentView, setCurrentView] = useState('projectList');
  const [newProjectStep, setNewProjectStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // Estado para el formulario - correctamente estructurado para evitar pérdida de focus
  const [projectName, setProjectName] = useState('');
  const [operationType, setOperationType] = useState('upstream');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectWorkflow, setProjectWorkflow] = useState(null);

  // Configuración global
  const [globalConfig] = useState({
    defaultFileFormat: 'excel',
    autoProcessing: true,
    realTimeUpdates: true,
    notifications: true
  });

  // Workflows específicos y realistas para cada tipo de operación
  const getPetroleumWorkflows = (operationType, projectName) => {
    const workflows = {
      upstream: {
        name: 'Upstream - Exploración y Producción',
        description: 'Ciclo completo desde prospección hasta producción comercial',
        totalDuration: '28 meses',
        estimatedCost: '$2.8B',
        riskScore: 7.2,
        aiRecommendations: [
          { type: 'warning', message: 'Considerar ventana estacional para operaciones marinas (Mayo-Septiembre)', priority: 'alta' },
          { type: 'optimization', message: 'Paralelizar estudios ambientales con diseño de pozos para reducir 3 meses', priority: 'media' },
          { type: 'risk', message: 'Riesgo geológico alto - implementar programa de perforación piloto', priority: 'alta' },
          { type: 'cost', message: 'Oportunidad de ahorro del 12% mediante contratos EPC integrados', priority: 'media' }
        ],
        nodes: [
          {
            id: 'seismic_survey',
            name: 'Prospección Sísmica',
            type: 'exploration',
            status: 'completed',
            duration: '4 meses',
            cost: '$45M',
            progress: 100,
            position: { x: 100, y: 100 },
            kpis: { coverage: '2,500 km²', resolution: '12.5m', confidence: '94%' }
          },
          {
            id: 'geological_analysis',
            name: 'Análisis Geológico',
            type: 'analysis',
            status: 'completed', 
            duration: '2 meses',
            cost: '$18M',
            progress: 100,
            position: { x: 400, y: 100 },
            kpis: { prospects: '8 identificados', pbr: '68%', resources: '280 MMBO' }
          },
          {
            id: 'environmental_permits',
            name: 'Permisos Ambientales',
            type: 'regulatory',
            status: 'running',
            duration: '6 meses',
            cost: '$32M',
            progress: 75,
            position: { x: 700, y: 100 },
            kpis: { agencies: '5 involucradas', approval_prob: '89%', timeline: '4.2 meses' }
          },
          {
            id: 'drilling_design',
            name: 'Diseño de Perforación',
            type: 'engineering',
            status: 'running',
            duration: '3 meses',
            cost: '$25M',
            progress: 60,
            position: { x: 100, y: 300 },
            kpis: { wells: '6 planificados', depth_avg: '4,200m', success_prob: '85%' }
          },
          {
            id: 'rig_mobilization',
            name: 'Movilización Equipo',
            type: 'logistics',
            status: 'scheduled',
            duration: '1 mes',
            cost: '$85M',
            progress: 0,
            position: { x: 400, y: 300 },
            kpis: { rigs: '2 contratadas', mobilization: '21 días', dayrate: '$485K' }
          },
          {
            id: 'drilling_operations',
            name: 'Operaciones Perforación',
            type: 'drilling',
            status: 'pending',
            duration: '8 meses',
            cost: '$340M',
            progress: 0,
            position: { x: 700, y: 300 },
            kpis: { wells_total: '6', duration_avg: '45 días', target_depth: '4,200m' }
          },
          {
            id: 'completion_operations',
            name: 'Completación',
            type: 'completion',
            status: 'pending',
            duration: '4 meses',
            cost: '$180M',
            progress: 0,
            position: { x: 250, y: 500 },
            kpis: { completion_type: 'Inteligente', monitoring: '24/7', efficiency: '96%' }
          },
          {
            id: 'production_startup',
            name: 'Inicio Producción',
            type: 'production',
            status: 'pending',
            duration: '2 meses',
            cost: '$45M',
            progress: 0,
            position: { x: 550, y: 500 },
            kpis: { target_rate: '25K BOPD', ramp_up: '21 días', plateau: '8 años' }
          }
        ],
        connections: [
          { from: 'seismic_survey', to: 'geological_analysis', duration: '2 semanas', progress: 100 },
          { from: 'geological_analysis', to: 'environmental_permits', duration: '1 semana', progress: 100 },
          { from: 'geological_analysis', to: 'drilling_design', duration: '1 semana', progress: 100 },
          { from: 'environmental_permits', to: 'rig_mobilization', duration: '3 semanas', progress: 75 },
          { from: 'drilling_design', to: 'rig_mobilization', duration: '2 semanas', progress: 60 },
          { from: 'rig_mobilization', to: 'drilling_operations', duration: '1 semana', progress: 0 },
          { from: 'drilling_operations', to: 'completion_operations', duration: '2 semanas', progress: 0 },
          { from: 'completion_operations', to: 'production_startup', duration: '1 semana', progress: 0 }
        ]
      },
      midstream: {
        name: 'Midstream - Transporte y Procesamiento',
        description: 'Infraestructura para transporte, procesamiento y almacenamiento',
        totalDuration: '18 meses',
        estimatedCost: '$1.2B',
        riskScore: 5.8,
        aiRecommendations: [
          { type: 'optimization', message: 'Aprovechar corredor de ductos existente reduce costos 18%', priority: 'alta' },
          { type: 'regulatory', message: 'Coordinar con autoridades locales anticipadamente', priority: 'media' },
          { type: 'technical', message: 'Considerar tecnología de compresión dual para flexibilidad', priority: 'media' }
        ],
        nodes: [
          {
            id: 'route_survey',
            name: 'Levantamiento de Ruta',
            type: 'planning',
            status: 'completed',
            duration: '3 meses',
            cost: '$25M',
            progress: 100,
            position: { x: 100, y: 100 },
            kpis: { distance: '450 km', terrain: 'Mixto', crossings: '28' }
          },
          {
            id: 'right_of_way',
            name: 'Derecho de Vía',
            type: 'legal',
            status: 'running',
            duration: '5 meses',
            cost: '$85M',
            progress: 70,
            position: { x: 400, y: 100 },
            kpis: { properties: '340', agreements: '238 firmados', completion: '70%' }
          },
          {
            id: 'pipeline_design',
            name: 'Diseño Ductos',
            type: 'engineering',
            status: 'running',
            duration: '4 meses',
            cost: '$45M',
            progress: 85,
            position: { x: 700, y: 100 },
            kpis: { diameter: '36 pulgadas', pressure: '1,440 psi', capacity: '2.1 BCF/d' }
          },
          {
            id: 'construction',
            name: 'Construcción',
            type: 'construction',
            status: 'scheduled',
            duration: '12 meses',
            cost: '$680M',
            progress: 0,
            position: { x: 250, y: 300 },
            kpis: { sections: '6 tramos', crews: '4 activas', progress_rate: '2.1 km/día' }
          },
          {
            id: 'commissioning',
            name: 'Puesta en Marcha',
            type: 'testing',
            status: 'pending',
            duration: '3 meses',
            cost: '$35M',
            progress: 0,
            position: { x: 550, y: 300 },
            kpis: { tests: '15 protocolos', pressure_test: '1,728 psi', integrity: '100%' }
          }
        ],
        connections: [
          { from: 'route_survey', to: 'right_of_way', duration: '2 semanas', progress: 100 },
          { from: 'route_survey', to: 'pipeline_design', duration: '1 semana', progress: 100 },
          { from: 'right_of_way', to: 'construction', duration: '4 semanas', progress: 70 },
          { from: 'pipeline_design', to: 'construction', duration: '2 semanas', progress: 85 },
          { from: 'construction', to: 'commissioning', duration: '2 semanas', progress: 0 }
        ]
      },
      downstream: {
        name: 'Downstream - Refinación y Productos',
        description: 'Modernización y expansión de capacidad de refinación',
        totalDuration: '36 meses',
        estimatedCost: '$3.5B',
        riskScore: 8.1,
        aiRecommendations: [
          { type: 'risk', message: 'Alto riesgo de paradas no programadas durante tie-ins - planificar ventanas de 72h', priority: 'crítica' },
          { type: 'market', message: 'Demanda de gasolina premium creciendo 8% anual - priorizar unidad de reformado', priority: 'alta' }
        ],
        nodes: [
          {
            id: 'process_design',
            name: 'Diseño de Proceso',
            type: 'engineering',
            status: 'completed',
            duration: '6 meses',
            cost: '$120M',
            progress: 100,
            position: { x: 100, y: 100 },
            kpis: { capacity: '250K BPD', efficiency: '94%', products: '12 tipos' }
          },
          {
            id: 'equipment_procurement',
            name: 'Procura Equipos',
            type: 'procurement',
            status: 'running',
            duration: '12 meses',
            cost: '$1,200M',
            progress: 45,
            position: { x: 400, y: 100 },
            kpis: { items: '2,450', critical: '180', delivery_avg: '18 meses' }
          },
          {
            id: 'site_preparation',
            name: 'Preparación Sitio',
            type: 'construction',
            status: 'running',
            duration: '8 meses',
            cost: '$180M',
            progress: 60,
            position: { x: 700, y: 100 },
            kpis: { area: '45 hectáreas', foundations: '320', utilities: '12 sistemas' }
          },
          {
            id: 'unit_construction',
            name: 'Construcción Unidades',
            type: 'construction',
            status: 'scheduled',
            duration: '18 meses',
            cost: '$1,500M',
            progress: 0,
            position: { x: 250, y: 350 },
            kpis: { units: '8 principales', structures: '450', piping: '125 km' }
          },
          {
            id: 'startup_operations',
            name: 'Arranque Refinería',
            type: 'operations',
            status: 'pending',
            duration: '6 meses',
            cost: '$150M',
            progress: 0,
            position: { x: 550, y: 350 },
            kpis: { capacity_ramp: '85%', products_spec: '98%', efficiency: '91%' }
          }
        ],
        connections: [
          { from: 'process_design', to: 'equipment_procurement', duration: '3 semanas', progress: 100 },
          { from: 'process_design', to: 'site_preparation', duration: '4 semanas', progress: 100 },
          { from: 'equipment_procurement', to: 'unit_construction', duration: '6 semanas', progress: 45 },
          { from: 'site_preparation', to: 'unit_construction', duration: '2 semanas', progress: 60 },
          { from: 'unit_construction', to: 'startup_operations', duration: '4 semanas', progress: 0 }
        ]
      }
    };

    return workflows[operationType] || workflows.upstream;
  };

  // Datos más ricos y realistas para proyectos
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Complejo Águila Dorada - GoM",
      operationType: 'upstream',
      fileType: 'google-sheets',
      googleSheetsUrl: 'https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9/edit',
      status: 'active',
      realTimeUpdates: true,
      createdAt: '2024-01-10T08:00:00Z',
      lastModified: '2024-01-15T14:30:00Z',
      budget: '$2.8B',
      completion: 67,
      team: 145,
      location: 'Golfo de México',
      nextMilestone: 'Perforación Pozo AG-003',
      nextMilestoneDate: '2024-02-15',
      riskLevel: 'medium',
      workflow: null
    },
    {
      id: 2,
      name: "Terminal Los Andes Hub",
      operationType: 'midstream',
      fileType: 'excel',
      status: 'active',
      realTimeUpdates: false,
      createdAt: '2024-01-08T10:00:00Z',
      lastModified: '2024-01-15T16:20:00Z',
      budget: '$1.2B',
      completion: 89,
      team: 78,
      location: 'Venezuela',
      nextMilestone: 'Pruebas de Integridad',
      nextMilestoneDate: '2024-02-01',
      riskLevel: 'low',
      workflow: null
    },
    {
      id: 3,
      name: "Refinería Pacífico Modernización",
      operationType: 'downstream',
      fileType: 'csv',
      status: 'active',
      realTimeUpdates: false,
      createdAt: '2023-11-15T14:00:00Z',
      lastModified: '2024-01-15T11:45:00Z',
      budget: '$3.5B',
      completion: 34,
      team: 234,
      location: 'Costa del Pacífico',
      nextMilestone: 'Instalación FCC',
      nextMilestoneDate: '2024-03-10',
      riskLevel: 'high',
      workflow: null
    }
  ]);

  // Añadir workflows a los proyectos existentes
  useEffect(() => {
    setProjects(prevProjects => 
      prevProjects.map(project => ({
        ...project,
        workflow: getPetroleumWorkflows(project.operationType, project.name)
      }))
    );
  }, []);

  // Canvas profesional rediseñado - NUEVA VERSIÓN NO SCROLLEABLE Y MODULAR
  const WorkflowCanvas = ({ workflow, selectedNode, onNodeSelect }) => {
    const [aiPanelOpen, setAiPanelOpen] = useState(true);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef(null);

    useEffect(() => {
      const updateCanvasSize = () => {
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          setCanvasSize({ width: rect.width, height: rect.height });
        }
      };

      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return { main: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' };
        case 'running': return { main: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' };
        case 'scheduled': return { main: '#f59e0b', bg: '#fffbeb', border: '#fed7aa' };
        case 'pending': return { main: '#6b7280', bg: '#f9fafb', border: '#d1d5db' };
        default: return { main: '#6b7280', bg: '#f9fafb', border: '#d1d5db' };
      }
    };

    const getNodeIcon = (node) => {
      const iconMap = {
        exploration: MapPin,
        analysis: Brain,
        regulatory: Shield,
        engineering: Layers,
        logistics: Truck,
        drilling: HardHat,
        completion: Wrench,
        production: Play,
        planning: Clipboard,
        legal: FileCheck,
        construction: Building2,
        facilities: Factory,
        testing: Gauge,
        operations: Cpu,
        procurement: Package,
        utilities: Lightning,
        automation: Settings
      };
      return iconMap[node.type] || Circle;
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'crítica': return '#dc2626';
        case 'alta': return '#ea580c';
        case 'media': return '#d97706';
        case 'baja': return '#65a30d';
        default: return '#6b7280';
      }
    };

    const getRecommendationIcon = (type) => {
      switch (type) {
        case 'warning': return AlertTriangle;
        case 'optimization': return TrendingUp;
        case 'risk': return Shield;
        case 'cost': return DollarSign;
        case 'regulatory': return FileCheck;
        case 'technical': return Cpu;
        case 'schedule': return Clock;
        case 'market': return BarChart3;
        case 'environmental': return Droplets;
        case 'efficiency': return Lightning;
        default: return AlertCircle;
      }
    };

    // Funciones para drag and drop de nodos
    const handleMouseDown = (e, nodeId) => {
      e.preventDefault();
      const node = workflow.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasSize.width / 1000; // Viewport virtual de 1000x600
      const scaleY = canvasSize.height / 600;
      
      const mouseX = (e.clientX - rect.left) / scaleX;
      const mouseY = (e.clientY - rect.top) / scaleY;

      setDraggingNode(nodeId);
      setDragOffset({
        x: mouseX - node.position.x,
        y: mouseY - node.position.y
      });
    };

    const handleMouseMove = useCallback((e) => {
      if (!draggingNode || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasSize.width / 1000;
      const scaleY = canvasSize.height / 600;
      
      const mouseX = (e.clientX - rect.left) / scaleX;
      const mouseY = (e.clientY - rect.top) / scaleY;

      const newX = Math.max(0, Math.min(mouseX - dragOffset.x, 1000 - 200));
      const newY = Math.max(0, Math.min(mouseY - dragOffset.y, 600 - 100));

      // Actualizar la posición del nodo en el workflow
      workflow.nodes = workflow.nodes.map(node => 
        node.id === draggingNode 
          ? { ...node, position: { x: newX, y: newY } }
          : node
      );

      // Forzar re-render
      setSelectedProject(prev => ({ ...prev }));
    }, [draggingNode, dragOffset, canvasSize, workflow]);

    const handleMouseUp = useCallback(() => {
      setDraggingNode(null);
      setDragOffset({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
      if (draggingNode) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [draggingNode, handleMouseMove, handleMouseUp]);

    return (
      <div className="digital-twin-canvas">
        <style jsx>{`
          .digital-twin-canvas {
            display: flex;
            height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .ai-recommendations-panel {
            width: 350px;
            background: white;
            border-right: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            flex-shrink: 0;
          }

          .ai-recommendations-panel.collapsed {
            width: 60px;
          }

          .ai-panel-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #1e293b, #334155);
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
          }

          .ai-panel-toggle {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background 0.2s ease;
          }

          .ai-panel-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .ai-panel-title {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }

          .ai-recommendations-list {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
          }

          .ai-recommendation {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            border-left: 4px solid var(--priority-color);
            transition: all 0.2s ease;
            position: relative;
          }

          .ai-recommendation:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .recommendation-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }

          .recommendation-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--priority-color);
            color: white;
          }

          .recommendation-priority {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: white;
            background: var(--priority-color);
          }

          .recommendation-message {
            font-size: 13px;
            color: #374151;
            line-height: 1.4;
            margin: 0;
          }

          .workflow-canvas-container {
            flex: 1;
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .canvas-header {
            background: white;
            border-bottom: 1px solid #e2e8f0;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
          }

          .canvas-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 8px 0;
          }

          .canvas-subtitle {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 16px 0;
          }

          .canvas-stats {
            display: flex;
            gap: 24px;
          }

          .canvas-stat {
            text-align: center;
          }

          .canvas-stat-value {
            font-size: 20px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 4px;
          }

          .canvas-stat-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }

          .canvas-area {
            flex: 1;
            position: relative;
            overflow: hidden;
          }

          .workflow-canvas-svg {
            width: 100%;
            height: 100%;
            cursor: grab;
          }

          .workflow-canvas-svg:active {
            cursor: grabbing;
          }

          .workflow-node {
            cursor: move;
            transition: all 0.2s ease;
          }

          .workflow-node:hover {
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
          }

          .workflow-node.dragging {
            filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25));
            z-index: 1000;
          }

          .node-card {
            fill: white;
            stroke: var(--node-border-color);
            stroke-width: 2;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
            transition: all 0.2s ease;
          }

          .node-icon-container {
            overflow: hidden;
          }

          .node-icon-bg {
            fill: var(--node-main-color);
          }

          .node-content {
            pointer-events: none;
          }

          .node-title {
            font-size: 12px;
            font-weight: 700;
            fill: #1e293b;
            text-anchor: start;
            dominant-baseline: middle;
          }

          .node-type {
            font-size: 9px;
            font-weight: 600;
            fill: #64748b;
            text-anchor: start;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .node-duration, .node-cost {
            font-size: 10px;
            font-weight: 600;
            fill: #374151;
            text-anchor: start;
          }

          .node-progress-bg {
            fill: #f1f5f9;
          }

          .node-progress-fill {
            fill: var(--node-main-color);
          }

          .node-progress-text {
            font-size: 9px;
            font-weight: 600;
            fill: var(--node-main-color);
            text-anchor: middle;
            dominant-baseline: middle;
          }

          .connection-line {
            stroke: #94a3b8;
            stroke-width: 2;
            stroke-dasharray: 6 3;
            fill: none;
            opacity: 0.7;
            transition: all 0.3s ease;
          }

          .connection-progress {
            stroke: #10b981;
            stroke-width: 3;
            fill: none;
            transition: all 0.3s ease;
          }

          .connection-time-bg {
            fill: white;
            stroke: #e2e8f0;
            stroke-width: 1;
            rx: 8;
            filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
          }

          .connection-time-text {
            font-size: 9px;
            font-weight: 600;
            fill: #374151;
            text-anchor: middle;
            dominant-baseline: middle;
          }

          .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 50;
          }

          .back-button:hover {
            background: #f8fafc;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
        `}</style>

        <div className={`ai-recommendations-panel ${!aiPanelOpen ? 'collapsed' : ''}`}>
          <div className="ai-panel-header">
            <button 
              className="ai-panel-toggle"
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
            >
              <Brain size={20} />
            </button>
            {aiPanelOpen && (
              <>
                <h3 className="ai-panel-title">Recomendaciones IA</h3>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>Activo</span>
                </div>
              </>
            )}
          </div>
          
          {aiPanelOpen && (
            <div className="ai-recommendations-list">
              {workflow?.aiRecommendations?.map((rec, index) => {
                const IconComponent = getRecommendationIcon(rec.type);
                const priorityColor = getPriorityColor(rec.priority);
                
                return (
                  <div 
                    key={index} 
                    className="ai-recommendation"
                    style={{ '--priority-color': priorityColor }}
                  >
                    <div className="recommendation-header">
                      <div className="recommendation-icon">
                        <IconComponent size={16} />
                      </div>
                      <div className="recommendation-priority">
                        {rec.priority}
                      </div>
                    </div>
                    <p className="recommendation-message">{rec.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="workflow-canvas-container">
          <div className="canvas-header">
            <h2 className="canvas-title">{workflow?.name}</h2>
            <p className="canvas-subtitle">{workflow?.description}</p>
            <div className="canvas-stats">
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflow?.nodes?.length || 0}</div>
                <div className="canvas-stat-label">Procesos</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflow?.totalDuration}</div>
                <div className="canvas-stat-label">Duración</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflow?.estimatedCost}</div>
                <div className="canvas-stat-label">Inversión</div>
              </div>
              <div className="canvas-stat">
                <div className="canvas-stat-value">{workflow?.riskScore}/10</div>
                <div className="canvas-stat-label">Riesgo</div>
              </div>
            </div>
          </div>

          <div className="canvas-area" ref={canvasRef}>
            <svg className="workflow-canvas-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                </marker>
                <marker id="arrowhead-progress" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
                </marker>
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Conexiones */}
              {workflow?.connections?.map((conn, index) => {
                const fromNode = workflow.nodes.find(n => n.id === conn.from);
                const toNode = workflow.nodes.find(n => n.id === conn.to);
                
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.position.x + 100;
                const y1 = fromNode.position.y + 50;
                const x2 = toNode.position.x + 100;
                const y2 = toNode.position.y + 50;
                
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                
                const progressLength = conn.progress || 0;
                const x1Progress = x1 + (x2 - x1) * (progressLength / 100);
                const y1Progress = y1 + (y2 - y1) * (progressLength / 100);

                return (
                  <g key={index}>
                    <line
                      x1={x1} y1={y1}
                      x2={x2} y2={y2}
                      className="connection-line"
                      markerEnd="url(#arrowhead)"
                    />
                    
                    {progressLength > 0 && (
                      <line
                        x1={x1} y1={y1}
                        x2={x1Progress} y2={y1Progress}
                        className="connection-progress"
                        markerEnd={progressLength === 100 ? "url(#arrowhead-progress)" : "none"}
                      />
                    )}
                    
                    <rect
                      x={midX - 30} y={midY - 10}
                      width="60" height="20"
                      className="connection-time-bg"
                    />
                    <text
                      x={midX} y={midY}
                      className="connection-time-text"
                    >
                      {conn.duration}
                    </text>
                  </g>
                );
              })}

              {/* Nodos */}
              {workflow?.nodes?.map((node) => {
                const statusColors = getStatusColor(node.status);
                const IconComponent = getNodeIcon(node);
                
                return (
                  <g 
                    key={node.id} 
                    className={`workflow-node ${draggingNode === node.id ? 'dragging' : ''}`}
                    style={{
                      '--node-main-color': statusColors.main,
                      '--node-bg-color': statusColors.bg,
                      '--node-border-color': statusColors.border
                    }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={() => onNodeSelect(node)}
                  >
                    {/* Tarjeta principal - tamaño fijo 200x100 */}
                    <rect
                      x={node.position.x} y={node.position.y}
                      width="200" height="100"
                      rx="12"
                      className="node-card"
                      style={{ cursor: 'move' }}
                    />
                    
                    {/* Contenedor para icono - corregido */}
                    <g className="node-icon-container">
                      <rect
                        x={node.position.x + 12} y={node.position.y + 12}
                        width="36" height="36"
                        rx="8"
                        className="node-icon-bg"
                      />
                      {/* Icono centrado correctamente */}
                      <g transform={`translate(${node.position.x + 30}, ${node.position.y + 30})`}>
                        <IconComponent size={18} color="white" />
                      </g>
                    </g>
                    
                    {/* Contenido del nodo - mejor posicionamiento */}
                    <g className="node-content">
                      {/* Título - ajustado para texto más largo */}
                      <text
                        x={node.position.x + 60} y={node.position.y + 24}
                        className="node-title"
                      >
                        {node.name.length > 18 ? node.name.substring(0, 16) + '...' : node.name}
                      </text>
                      
                      {/* Tipo */}
                      <text
                        x={node.position.x + 60} y={node.position.y + 38}
                        className="node-type"
                      >
                        {node.type}
                      </text>
                      
                      {/* Duración y Costo - mejor espaciado */}
                      <text
                        x={node.position.x + 15} y={node.position.y + 60}
                        className="node-duration"
                      >
                        {node.duration}
                      </text>
                      <text
                        x={node.position.x + 110} y={node.position.y + 60}
                        className="node-cost"
                      >
                        {node.cost}
                      </text>
                      
                      {/* Barra de progreso - mejorada */}
                      <rect
                        x={node.position.x + 15} y={node.position.y + 72}
                        width="170" height="6"
                        rx="3"
                        className="node-progress-bg"
                      />
                      <rect
                        x={node.position.x + 15} y={node.position.y + 72}
                        width={170 * (node.progress / 100)} height="6"
                        rx="3"
                        className="node-progress-fill"
                      />
                      
                      {/* Porcentaje de progreso */}
                      <text
                        x={node.position.x + 100} y={node.position.y + 88}
                        className="node-progress-text"
                      >
                        {node.progress}%
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <button 
          className="back-button"
          onClick={() => setCurrentView('projectList')}
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>
      </div>
    );
  };

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

  const getRiskLevelInfo = (level) => {
    const levels = {
      low: { color: '#10b981', bgColor: '#dcfce7', label: 'Bajo' },
      medium: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Medio' },
      high: { color: '#ef4444', bgColor: '#fee2e2', label: 'Alto' }
    };
    return levels[level];
  };

  // Datos simulados mejorados
  const getSimulatedData = (operationType, projectName) => {
    const baseSchemas = {
      upstream: [
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
        { field: 'well_id', type: 'string', sample: 'PZ-Norte-001' },
        { field: 'oil_rate_bopd', type: 'number', sample: 2847.5 },
        { field: 'gas_rate_mscfd', type: 'number', sample: 1284.2 },
        { field: 'water_rate_bwpd', type: 'number', sample: 425.8 },
        { field: 'wellhead_pressure_psi', type: 'number', sample: 3250.0 },
        { field: 'flowing_temperature_f', type: 'number', sample: 185.2 },
        { field: 'choke_size_64ths', type: 'number', sample: 48 },
        { field: 'gas_oil_ratio_scf_stb', type: 'number', sample: 450.8 },
        { field: 'water_cut_percent', type: 'number', sample: 15.2 }
      ]
    };

    return {
      filename: `${operationType}_data_${Date.now()}.xlsx`,
      sheets: [`${operationType.charAt(0).toUpperCase() + operationType.slice(1)}_Operations`, 'KPIs', 'Alarms'],
      schema: baseSchemas[operationType] || baseSchemas.upstream,
      records: [
        {
          timestamp: '2024-01-15 08:30:00',
          well_id: 'PZ-Norte-001',
          oil_rate_bopd: 2847.5,
          gas_rate_mscfd: 1284.2,
          water_rate_bwpd: 425.8,
          wellhead_pressure_psi: 3250.0,
          flowing_temperature_f: 185.2,
          choke_size_64ths: 48,
          gas_oil_ratio_scf_stb: 450.8,
          water_cut_percent: 15.2
        }
      ],
      workflow: getPetroleumWorkflows(operationType, projectName)
    };
  };

  // Manejadores de archivos
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        processFile(file);
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setProcessing(true);
    setProjectFile(file);

    setTimeout(() => {
      const simulatedData = getSimulatedData(operationType, projectName);
      setProjectData(simulatedData);
      setProjectWorkflow(simulatedData.workflow);
      setProcessing(false);
      setNewProjectStep(3);
    }, 3000);
  };

  const processGoogleSheets = (url) => {
    setProcessing(true);
    setGoogleSheetsUrl(url);

    setTimeout(() => {
      const simulatedData = getSimulatedData(operationType, projectName);
      setProjectData(simulatedData);
      setProjectWorkflow(simulatedData.workflow);
      setProcessing(false);
      setNewProjectStep(3);
    }, 2500);
  };

  const createProject = () => {
    const newProject = {
      id: Date.now(),
      name: projectName,
      operationType: operationType,
      file: projectFile,
      googleSheetsUrl: googleSheetsUrl,
      data: projectData,
      workflow: projectWorkflow,
      fileType: globalConfig.defaultFileFormat,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'active',
      realTimeUpdates: globalConfig.defaultFileFormat === 'google-sheets',
      budget: operationType === 'upstream' ? '$2.5B' : 
              operationType === 'midstream' ? '$1.2B' : '$3.1B',
      completion: Math.floor(Math.random() * 30) + 10,
      team: Math.floor(Math.random() * 100) + 50,
      location: 'Nuevo Campo',
      nextMilestone: 'Fase Inicial',
      nextMilestoneDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };

    setProjects(prev => [...prev, newProject]);
    
    // Reset form states
    setProjectName('');
    setOperationType('upstream');
    setGoogleSheetsUrl('');
    setProjectFile(null);
    setProjectData(null);
    setProjectWorkflow(null);
    setNewProjectStep(1);
    setCurrentView('projectList');
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Lista de proyectos mejorada
  const ProjectList = () => (
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
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
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

        .action-btn.delete:hover {
          border-color: #dc2626;
          color: #dc2626;
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
        }
      `}</style>

      <div className="projects-container">
        <div className="projects-header">
          <div className="header-left">
            <h1>Digital Twin Petrolero</h1>
            <p className="header-subtitle">
              Gestión integral de proyectos upstream, midstream y downstream
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
            <button className="btn btn-secondary">
              <Download size={16} />
              Exportar Dashboard
            </button>
            <button className="btn btn-secondary">
              <BarChart3 size={16} />
              Analytics
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentView('newProject')}
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
              <option value="upstream">Upstream</option>
              <option value="midstream">Midstream</option>
              <option value="downstream">Downstream</option>
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
              <option value="gom">Golfo de México</option>
              <option value="venezuela">Venezuela</option>
              <option value="pacific">Costa del Pacífico</option>
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
                    <p>Tareas</p>
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
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentView('projectData');
                    }}
                  >
                    <Database size={14} />
                    Datos
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentView('projectWorkflow');
                    }}
                  >
                    <Workflow size={14} />
                    Digital Twin
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentView('editProject');
                    }}
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

  // Vista del workflow del proyecto con canvas profesional
  const ProjectWorkflow = () => {
    return (
      <>
        {selectedProject?.workflow && (
          <WorkflowCanvas 
            workflow={selectedProject.workflow}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        )}
      </>
    );
  };

  // Vista mejorada para nuevo proyecto - INPUT COMPLETAMENTE ARREGLADO
  const NewProject = () => {
    if (newProjectStep === 1) {
      return (
        <ProjectNameForm
          projectName={projectName}
          setProjectName={setProjectName}
          operationType={operationType}
          setOperationType={setOperationType}
          onNext={() => setNewProjectStep(2)}
          onBack={() => setCurrentView('projectList')}
        />
      );
    }

    if (newProjectStep === 2) {
      return (
        <>
          <style jsx>{`
            .upload-container {
              max-width: 900px;
              margin: 0 auto;
              padding: 0 20px;
            }

            .upload-area {
              border: 3px dashed #e5e8eb;
              border-radius: 16px;
              padding: 60px 40px;
              text-align: center;
              transition: all 0.3s ease;
              cursor: pointer;
              background: white;
              position: relative;
              overflow: hidden;
            }

            .upload-area::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              opacity: 0;
              transition: opacity 0.3s ease;
            }

            .upload-area.drag-over {
              border-color: #3b82f6;
              background: #f0f8ff;
            }

            .upload-area.drag-over::before {
              opacity: 1;
            }

            .upload-area.processing {
              border-color: #10b981;
              background: #f0fdf4;
            }

            .upload-content {
              position: relative;
              z-index: 1;
            }

            .upload-icon {
              margin-bottom: 20px;
              color: #6b7684;
            }

            .upload-title {
              font-size: 24px;
              font-weight: 700;
              color: #1a1d21;
              margin-bottom: 12px;
            }

            .upload-subtitle {
              font-size: 16px;
              color: #6b7684;
              margin-bottom: 32px;
              line-height: 1.5;
            }

            .upload-btn {
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              color: white;
              padding: 16px 32px;
              border-radius: 12px;
              border: none;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .upload-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }

            .sheets-form {
              background: white;
              border: 1px solid #e5e8eb;
              border-radius: 16px;
              padding: 40px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .sheets-header {
              text-align: center;
              margin-bottom: 40px;
            }

            .sheets-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #dcfce7, #bbf7d0);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
            }

            .url-input {
              width: 100%;
              padding: 16px 20px;
              border: 2px solid #e5e8eb;
              border-radius: 12px;
              font-size: 16px;
              margin-bottom: 16px;
              transition: all 0.2s ease;
              background: #fafbfc;
              box-sizing: border-box;
            }

            .url-input:focus {
              outline: none;
              border-color: #10b981;
              box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
              background: white;
            }

            .benefits-box {
              background: linear-gradient(135deg, #f0fdf4, #dcfce7);
              border: 1px solid #bbf7d0;
              border-radius: 12px;
              padding: 20px;
              margin-top: 20px;
            }

            .benefits-title {
              font-size: 16px;
              font-weight: 700;
              color: #166534;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .benefits-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
            }

            .benefits-list li {
              font-size: 13px;
              color: #15803d;
              margin-bottom: 4px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .step-navigation {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
            }

            .btn-secondary {
              background: white;
              color: #6b7684;
              border: 2px solid #e5e8eb;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .btn-secondary:hover {
              background: #f8f9fa;
              border-color: #d0d5db;
              transform: translateY(-1px);
            }

            .processing-state {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }

            .processing-spinner {
              animation: spin 1s linear infinite;
            }

            .processing-steps {
              display: flex;
              flex-direction: column;
              gap: 8px;
              text-align: center;
            }

            .processing-step {
              font-size: 14px;
              color: #6b7684;
              padding: 8px 16px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #f1f5f9;
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>

          <div className="upload-container">
            <div className="step-header">
              <button 
                className="back-btn"
                onClick={() => setNewProjectStep(1)}
              >
                <ArrowLeft size={16} />
                Volver
              </button>
              <h1 className="step-title">
                {globalConfig.defaultFileFormat === 'google-sheets' ? 'Integración con Google Sheets' : 'Carga de Datos'}
              </h1>
              <p className="step-subtitle">
                Conecte su fuente de datos para el análisis del digital twin
              </p>
            </div>

            {globalConfig.defaultFileFormat === 'google-sheets' ? (
              <div className="sheets-form">
                <div className="sheets-header">
                  <div className="sheets-icon">
                    <Link size={40} color="#10b981" />
                  </div>
                  <h3 className="upload-title">Conectar Google Sheets</h3>
                  <p className="upload-subtitle">
                    Integre su hoja de cálculo para obtener datos en tiempo real y análisis continuo del proyecto
                  </p>
                </div>

                <div>
                  <label className="form-label">URL de Google Sheets</label>
                  <input
                    type="url"
                    className="url-input"
                    value={googleSheetsUrl}
                    onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0"
                    autoComplete="off"
                    key="sheets-url-input"
                  />
                  <p className="form-help">
                    Asegúrese de que el documento tenga permisos de lectura públicos o esté compartido con el sistema.
                  </p>
                </div>

                <div className="benefits-box">
                  <div className="benefits-title">
                    <CheckCircle size={20} />
                    Ventajas del Digital Twin en Tiempo Real
                  </div>
                  <ul className="benefits-list">
                    <li><Check size={14} /> Monitoreo continuo de KPIs</li>
                    <li><Check size={14} /> Alertas automáticas de desviaciones</li>
                    <li><Check size={14} /> Análisis predictivo avanzado</li>
                    <li><Check size={14} /> Optimización de recursos</li>
                    <li><Check size={14} /> Simulaciones de escenarios</li>
                    <li><Check size={14} /> Dashboards ejecutivos</li>
                  </ul>
                </div>

                {processing && (
                  <div className="processing-state" style={{ marginTop: '32px' }}>
                    <RefreshCw className="processing-spinner" size={40} color="#10b981" />
                    <div className="processing-steps">
                      <div className="processing-step">Conectando con Google Sheets...</div>
                      <div className="processing-step">Analizando estructura de datos...</div>
                      <div className="processing-step">Generando workflow personalizado...</div>
                    </div>
                  </div>
                )}

                <div className="step-navigation">
                  <button className="btn btn-secondary" onClick={() => setNewProjectStep(1)}>
                    <ArrowLeft size={16} />
                    Anterior
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => processGoogleSheets(googleSheetsUrl)}
                    disabled={!googleSheetsUrl.trim() || processing}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {processing ? 'Conectando...' : 'Conectar Digital Twin'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`upload-area ${dragOver ? 'drag-over' : ''} ${processing ? 'processing' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !processing && fileInputRef.current?.click()}
                >
                  <div className="upload-content">
                    {processing ? (
                      <div className="processing-state">
                        <RefreshCw className="processing-spinner" size={48} color="#10b981" />
                        <h3 className="upload-title">Procesando Datos del Proyecto...</h3>
                        <div className="processing-steps">
                          <div className="processing-step">Analizando estructura petroleum-specific</div>
                          <div className="processing-step">Detectando patrones operacionales</div>
                          <div className="processing-step">Generando modelo digital twin</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FileSpreadsheet className="upload-icon" size={56} />
                        <h3 className="upload-title">
                          Arrastra tu archivo {globalConfig.defaultFileFormat === 'excel' ? 'Excel' : 'CSV'} aquí
                        </h3>
                        <p className="upload-subtitle">
                          Carga datos de producción, costos y cronogramas para crear tu digital twin petrolero
                        </p>
                        <button className="upload-btn">
                          <Upload size={16} />
                          Seleccionar Archivo
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={globalConfig.defaultFileFormat === 'excel' ? '.xlsx,.xls' : '.csv'}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <div className="step-navigation">
                  <button className="btn btn-secondary" onClick={() => setNewProjectStep(1)}>
                    <ArrowLeft size={16} />
                    Anterior
                  </button>
                  <div></div>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

    if (newProjectStep === 3) {
      return (
        <>
          <style jsx>{`
            .data-preview-container {
              max-width: 1400px;
              margin: 0 auto;
              padding: 0 20px;
            }

            .data-summary {
              background: white;
              border: 1px solid #e5e8eb;
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 32px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .summary-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 24px;
            }

            .summary-title {
              font-size: 24px;
              font-weight: 700;
              color: #1a1d21;
              margin: 0;
            }

            .realtime-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              background: linear-gradient(135deg, #dcfce7, #bbf7d0);
              color: #166534;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border: 1px solid #22c55e;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            }

            .summary-item {
              text-align: center;
              padding: 24px;
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              border-radius: 12px;
              border: 1px solid #e2e8f0;
              transition: all 0.2s ease;
            }

            .summary-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            }

            .summary-icon {
              margin-bottom: 12px;
              color: var(--item-color);
            }

            .summary-value {
              font-size: 28px;
              font-weight: 800;
              color: #1a1d21;
              margin-bottom: 8px;
            }

            .summary-label {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .schema-table {
              background: white;
              border: 1px solid #e5e8eb;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .table-header {
              background: linear-gradient(135deg, #f8fafc, #f1f5f9);
              padding: 20px;
              border-bottom: 1px solid #e5e8eb;
            }

            .table-title {
              font-size: 20px;
              font-weight: 700;
              color: #1a1d21;
              margin: 0;
            }

            .table-content {
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

            .type-badge {
              padding: 4px 8px;
              border-radius: 16px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .type-number {
              background: linear-gradient(135deg, #dbeafe, #bfdbfe);
              color: #1e40af;
              border: 1px solid #3b82f6;
            }

            .type-datetime {
              background: linear-gradient(135deg, #dcfce7, #bbf7d0);
              color: #15803d;
              border: 1px solid #22c55e;
            }

            .type-string {
              background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
              color: #475569;
              border: 1px solid #64748b;
            }

            .status-validated {
              display: flex;
              align-items: center;
              gap: 6px;
              color: #10b981;
              font-size: 12px;
              font-weight: 600;
            }
          `}</style>

          <div className="data-preview-container">
            <div className="step-header">
              <button 
                className="back-btn"
                onClick={() => setNewProjectStep(2)}
              >
                <ArrowLeft size={16} />
                Volver
              </button>
              <h1 className="step-title">Datos Analizados</h1>
              <p className="step-subtitle">Validación del esquema y estructura de datos petroleros</p>
            </div>

            {projectData && (
              <>
                <div className="data-summary">
                  <div className="summary-header">
                    <h2 className="summary-title">Análisis del Dataset Petrolero</h2>
                    {googleSheetsUrl && (
                      <div className="realtime-badge">
                        <RefreshCw size={12} />
                        Tiempo Real Activo
                      </div>
                    )}
                  </div>
                  
                  <div className="summary-grid">
                    <div className="summary-item" style={{ '--item-color': '#3b82f6' }}>
                      <Database className="summary-icon" size={36} style={{ color: '#3b82f6' }} />
                      <div className="summary-value">{projectData.schema.length}</div>
                      <div className="summary-label">Campos Detectados</div>
                    </div>
                    <div className="summary-item" style={{ '--item-color': '#10b981' }}>
                      <BarChart3 className="summary-icon" size={36} style={{ color: '#10b981' }} />
                      <div className="summary-value">{projectData.records.length}</div>
                      <div className="summary-label">Registros Históricos</div>
                    </div>
                    <div className="summary-item" style={{ '--item-color': '#8b5cf6' }}>
                      <FileSpreadsheet className="summary-icon" size={36} style={{ color: '#8b5cf6' }} />
                      <div className="summary-value">{projectData.sheets.length}</div>
                      <div className="summary-label">Hojas de Datos</div>
                    </div>
                    <div className="summary-item" style={{ '--item-color': '#f59e0b' }}>
                      <Workflow className="summary-icon" size={36} style={{ color: '#f59e0b' }} />
                      <div className="summary-value">{getOperationTypeInfo(operationType).name}</div>
                      <div className="summary-label">Tipo de Operación</div>
                    </div>
                  </div>
                </div>

                <div className="schema-table">
                  <div className="table-header">
                    <h3 className="table-title">Esquema de Campos Petroleros Detectados</h3>
                  </div>
                  <div className="table-content">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Campo de Datos</th>
                          <th>Tipo</th>
                          <th>Valor de Muestra</th>
                          <th>Descripción Petrolera</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectData.schema.map((field, index) => (
                          <tr key={index}>
                            <td className="field-name">{field.field}</td>
                            <td>
                              <span className={`type-badge type-${field.type}`}>
                                {field.type}
                              </span>
                            </td>
                            <td style={{ fontWeight: '600' }}>{field.sample}</td>
                            <td style={{ color: '#6b7684' }}>
                              {field.field.includes('pressure') ? 'Presión operacional (psi)' :
                               field.field.includes('temperature') ? 'Temperatura de proceso (°F)' :
                               field.field.includes('rate') ? 'Tasa de flujo (bopd/mscfd)' :
                               field.field.includes('oil') ? 'Parámetros de petróleo crudo' :
                               field.field.includes('gas') ? 'Mediciones de gas natural' :
                               field.field.includes('water') ? 'Contenido de agua (bwpd)' :
                               field.field.includes('well') ? 'Identificador de pozo' :
                               field.field.includes('choke') ? 'Configuración de choke' :
                               'Parámetro operacional estándar'}
                            </td>
                            <td>
                              <div className="status-validated">
                                <CheckCircle size={16} />
                                Validado
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="step-navigation">
                  <button className="btn btn-secondary" onClick={() => setNewProjectStep(2)}>
                    <ArrowLeft size={16} />
                    Anterior
                  </button>
                  <button className="btn btn-primary" onClick={() => setNewProjectStep(4)}>
                    Generar Digital Twin
                    <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      );
    }

    if (newProjectStep === 4) {
      return (
        <>
          {projectWorkflow && (
            <WorkflowCanvas 
              workflow={projectWorkflow}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              showHeader={false}
              showAIPanel={true}
            />
          )}
          
          {/* Botón flotante para finalizar */}
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            display: 'flex',
            gap: '16px',
            zIndex: 60
          }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setNewProjectStep(3)}
              style={{ padding: '16px 24px', borderRadius: '12px' }}
            >
              <ArrowLeft size={16} />
              Anterior
            </button>
            <button 
              className="btn btn-primary" 
              onClick={createProject}
              style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '16px 24px', 
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <CheckCircle size={16} />
              Activar Digital Twin
            </button>
          </div>

          {/* Botón de volver flotante personalizado */}
          <button 
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: '60'
            }}
            onClick={() => setNewProjectStep(3)}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            <ArrowLeft size={16} />
            Anterior
          </button>
        </>
      );
    }
  };

  // Vista de datos del proyecto
  const ProjectData = () => (
    <>
      <style jsx>{`
        .project-data-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
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
      `}</style>

      <div className="project-data-container">
        <button 
          className="back-btn"
          onClick={() => setCurrentView('projectList')}
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>

        <div className="data-header">
          <div>
            <h1>{selectedProject?.name}</h1>
            <p className="data-subtitle">
              Análisis de datos - {getOperationTypeInfo(selectedProject?.operationType).description}
            </p>
          </div>
          {selectedProject?.realTimeUpdates && (
            <div className="realtime-status">
              <RefreshCw size={18} className="animate-spin" />
              Datos actualizándose en tiempo real
            </div>
          )}
        </div>

        {selectedProject?.data && (
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
                    {selectedProject.data.schema.map((field, index) => (
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
                      {Object.keys(selectedProject.data.records[0]).slice(0, 8).map((key) => (
                        <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.data.records.map((record, index) => (
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
              {Object.keys(selectedProject.data.records[0]).length > 8 && (
                <div className="table-footer">
                  Mostrando 8 de {Object.keys(selectedProject.data.records[0]).length} campos disponibles. 
                  {selectedProject.realTimeUpdates && " Datos actualizándose automáticamente cada 5 minutos."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Vista de edición de proyecto
  const EditProject = () => (
    <>
      <style jsx>{`
        .edit-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
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

        .edit-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 40px;
          padding-top: 32px;
          border-top: 2px solid #e5e8eb;
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
          onClick={() => setCurrentView('projectList')}
        >
          <ArrowLeft size={16} />
          Volver al Dashboard
        </button>

        <div className="data-header">
          <div>
            <h1>Configuración del Proyecto</h1>
            <p className="data-subtitle">{selectedProject?.name}</p>
          </div>
        </div>

        <div className="edit-form">
          <div className="form-section">
            <h3 className="section-title">Información General</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre del Proyecto</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={selectedProject?.name}
                  placeholder="Nombre del proyecto"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ubicación</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={selectedProject?.location}
                  placeholder="Ubicación geográfica"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Operación</label>
                <select className="form-input" defaultValue={selectedProject?.operationType}>
                  <option value="upstream">Upstream - Exploración y Producción</option>
                  <option value="midstream">Midstream - Transporte y Procesamiento</option>
                  <option value="downstream">Downstream - Refinación y Productos</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Presupuesto</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={selectedProject?.budget}
                  placeholder="$0.0B"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Configuración de Datos</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Fuente de Datos</label>
                <select className="form-input" defaultValue={selectedProject?.fileType}>
                  <option value="google-sheets">Google Sheets</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nivel de Riesgo</label>
                <select className="form-input" defaultValue={selectedProject?.riskLevel}>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </div>
            </div>
            {selectedProject?.googleSheetsUrl && (
              <div className="form-group">
                <label className="form-label">URL de Google Sheets</label>
                <input
                  type="url"
                  className="form-input"
                  defaultValue={selectedProject.googleSheetsUrl}
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
              onClick={() => setCurrentView('projectList')}
            >
              Cancelar
            </button>
            <button className="btn btn-primary">
              <Check size={16} />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Renderizado principal
  const renderContent = () => {
    switch (currentView) {
      case 'projectList':
        return <ProjectList />;
      case 'newProject':
        return <NewProject />;
      case 'projectData':
        return <ProjectData />;
      case 'projectWorkflow':
        return <ProjectWorkflow />;
      case 'editProject':
        return <EditProject />;
      default:
        return <ProjectList />;
    }
  };

  return (
    <>
      <style jsx>{`
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
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
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

        .form-help {
          font-size: 12px;
          color: #6b7684;
          margin-top: 4px;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
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

        .step-header {
          margin-bottom: 32px;
        }

        .step-title {
          font-size: 24px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 4px 0;
        }

        .step-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }
      `}</style>
      
      {renderContent()}
    </>
  );
};

export default GestionProyectos;