// GestionProyectos.js - Componente Principal Mejorado
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Link, FileSpreadsheet, ArrowLeft, ArrowRight, RefreshCw,
  CheckCircle, Check, Database, BarChart3, Workflow, Factory, Truck, Building2,
  Target
} from 'lucide-react';

// Importar todos los componentes
import ProjectNameForm from './ProjectNameForm';
import ProjectList from './ProjectList';
import WorkflowCanvas from './WorkflowCanvas';
import ProjectData from './ProjectData';
import EditProject from './EditProject';
import DataSourceEditor from './DataSourceEditor';
import StatisticsPanel from './StatisticsPanel';
import KPIManager from './KPIManager';

const GestionProyectos = () => {
  // Estados principales de navegación
  const [currentView, setCurrentView] = useState('projectList');
  const [newProjectStep, setNewProjectStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Estados para el formulario
  const [projectName, setProjectName] = useState('');
  const [operationType, setOperationType] = useState('manufacturing');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectWorkflow, setProjectWorkflow] = useState(null);

  // Estados para drag & drop
  const [dragOver, setDragOver] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Estados para modales y paneles
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showKPIManager, setShowKPIManager] = useState(false);

  // Referencias
  const fileInputRef = useRef(null);

  // Configuración global
  const [globalConfig] = useState({
    defaultFileFormat: 'excel',
    autoProcessing: true,
    realTimeUpdates: true,
    notifications: true
  });

  // Workflows genéricos y OPTIMIZADOS para diferentes tipos de operación
  const getGenericWorkflows = useCallback((operationType, projectName) => {
    const workflows = {
      manufacturing: {
        name: 'Manufactura - Proceso de Producción',
        description: 'Flujo completo desde diseño hasta entrega del producto manufacturado',
        totalDuration: '18 meses',
        estimatedCost: '$1.8B',
        riskScore: 6.2,
        aiRecommendations: [
          { type: 'optimization', message: 'Implementar lean manufacturing reduce desperdicio 25%', priority: 'alta' },
          { type: 'cost', message: 'Automatización de línea reduce costos operativos 18%', priority: 'alta' },
          { type: 'quality', message: 'Sistema Six Sigma mejora calidad y reduce defectos', priority: 'media' },
          { type: 'efficiency', message: 'IoT en equipos permite mantenimiento predictivo', priority: 'media' }
        ],
        nodes: [
          {
            id: 'product_design',
            name: 'Diseño del Producto',
            type: 'design',
            status: 'completed',
            duration: '3 meses',
            cost: '$120M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { design_reviews: '8 completadas', prototypes: '5', approval: '98%' }
          },
          {
            id: 'process_engineering',
            name: 'Ingeniería de Procesos',
            type: 'engineering',
            status: 'running',
            duration: '4 meses',
            cost: '$180M',
            progress: 75,
            position: { x: 400, y: 120 },
            kpis: { process_maps: '12', efficiency: '87%', validation: 'En proceso' }
          },
          {
            id: 'equipment_procurement',
            name: 'Adquisición Equipos',
            type: 'procurement',
            status: 'scheduled',
            duration: '6 meses',
            cost: '$450M',
            progress: 0,
            position: { x: 700, y: 120 },
            kpis: { suppliers: '24 evaluados', quotes: '156', lead_time: '16 semanas' }
          },
          {
            id: 'facility_setup',
            name: 'Configuración Instalaciones',
            type: 'construction',
            status: 'pending',
            duration: '8 meses',
            cost: '$680M',
            progress: 0,
            position: { x: 100, y: 320 },
            kpis: { space: '15,000 m²', utilities: '95% ready', safety: '100% compliance' }
          },
          {
            id: 'production_start',
            name: 'Inicio de Producción',
            type: 'production',
            status: 'pending',
            duration: '2 meses',
            cost: '$85M',
            progress: 0,
            position: { x: 400, y: 320 },
            kpis: { capacity: '1,000 units/day', quality: '99.2%', oee: '85%' }
          },
          {
            id: 'quality_control',
            name: 'Control de Calidad',
            type: 'testing',
            status: 'pending',
            duration: 'Continuo',
            cost: '$45M/año',
            progress: 0,
            position: { x: 700, y: 320 },
            kpis: { defect_rate: '<0.1%', inspections: '100%', certifications: 'ISO 9001' }
          }
        ],
        connections: [
          { from: 'product_design', to: 'process_engineering', duration: '2 semanas', progress: 100 },
          { from: 'process_engineering', to: 'equipment_procurement', duration: '3 semanas', progress: 75 },
          { from: 'equipment_procurement', to: 'facility_setup', duration: '4 semanas', progress: 0 },
          { from: 'facility_setup', to: 'production_start', duration: '2 semanas', progress: 0 },
          { from: 'production_start', to: 'quality_control', duration: '1 semana', progress: 0 },
          { from: 'process_engineering', to: 'facility_setup', duration: '6 semanas', progress: 75 }
        ]
      },
      logistics: {
        name: 'Logística - Optimización de Cadena de Suministro',
        description: 'Gestión integral de almacenes, transporte y distribución',
        totalDuration: '14 meses',
        estimatedCost: '$950M',
        riskScore: 4.8,
        aiRecommendations: [
          { type: 'optimization', message: 'Algoritmos de ruteo reducen costos transporte 22%', priority: 'alta' },
          { type: 'technology', message: 'RFID y IoT mejoran visibilidad inventario 95%', priority: 'alta' },
          { type: 'sustainability', message: 'Optimización rutas reduce huella carbono 30%', priority: 'media' },
          { type: 'partnership', message: 'Alianzas estratégicas expanden cobertura', priority: 'media' }
        ],
        nodes: [
          {
            id: 'demand_planning',
            name: 'Planificación Demanda',
            type: 'planning',
            status: 'completed',
            duration: '2 meses',
            cost: '$65M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { accuracy: '94%', forecasts: '365 días', models: '12 algoritmos' }
          },
          {
            id: 'warehouse_design',
            name: 'Diseño de Almacenes',
            type: 'design',
            status: 'running',
            duration: '4 meses',
            cost: '$180M',
            progress: 68,
            position: { x: 400, y: 120 },
            kpis: { capacity: '50,000 m²', automation: '75%', throughput: '10,000 orders/día' }
          },
          {
            id: 'transport_network',
            name: 'Red de Transporte',
            type: 'network',
            status: 'scheduled',
            duration: '6 meses',
            cost: '$320M',
            progress: 0,
            position: { x: 700, y: 120 },
            kpis: { routes: '450', vehicles: '1,200', coverage: '98% territorio' }
          },
          {
            id: 'technology_deployment',
            name: 'Despliegue Tecnológico',
            type: 'technology',
            status: 'pending',
            duration: '5 meses',
            cost: '$140M',
            progress: 0,
            position: { x: 250, y: 320 },
            kpis: { systems: 'WMS, TMS, OMS', integration: '99.5%', uptime: '99.9%' }
          },
          {
            id: 'operations_launch',
            name: 'Lanzamiento Operacional',
            type: 'operations',
            status: 'pending',
            duration: '3 meses',
            cost: '$95M',
            progress: 0,
            position: { x: 550, y: 320 },
            kpis: { sla: '99.5%', cost_per_order: '$2.50', delivery_time: '24h' }
          }
        ],
        connections: [
          { from: 'demand_planning', to: 'warehouse_design', duration: '2 semanas', progress: 100 },
          { from: 'warehouse_design', to: 'transport_network', duration: '3 semanas', progress: 68 },
          { from: 'warehouse_design', to: 'technology_deployment', duration: '4 semanas', progress: 68 },
          { from: 'transport_network', to: 'operations_launch', duration: '4 semanas', progress: 0 },
          { from: 'technology_deployment', to: 'operations_launch', duration: '2 semanas', progress: 0 }
        ]
      },
      infrastructure: {
        name: 'Infraestructura - Desarrollo de Proyecto',
        description: 'Construcción y desarrollo de infraestructura crítica',
        totalDuration: '36 meses',
        estimatedCost: '$3.2B',
        riskScore: 7.9,
        aiRecommendations: [
          { type: 'risk', message: 'Condiciones climáticas críticas - planificar ventanas', priority: 'crítica' },
          { type: 'optimization', message: 'BIM 4D optimiza secuencia constructiva 20%', priority: 'alta' },
          { type: 'sustainability', message: 'Materiales sostenibles cumplen normativas 2025', priority: 'alta' },
          { type: 'innovation', message: 'Construcción modular reduce timeline 15%', priority: 'media' }
        ],
        nodes: [
          {
            id: 'feasibility_study',
            name: 'Estudio de Factibilidad',
            type: 'analysis',
            status: 'completed',
            duration: '6 meses',
            cost: '$85M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { studies: '8 completados', viability: '95%', roi: '18.5%' }
          },
          {
            id: 'design_engineering',
            name: 'Diseño e Ingeniería',
            type: 'engineering',
            status: 'running',
            duration: '12 meses',
            cost: '$340M',
            progress: 58,
            position: { x: 400, y: 120 },
            kpis: { drawings: '2,500', bim_models: '100%', approvals: '85%' }
          },
          {
            id: 'permits_licensing',
            name: 'Permisos y Licencias',
            type: 'regulatory',
            status: 'running',
            duration: '18 meses',
            cost: '$125M',
            progress: 42,
            position: { x: 700, y: 120 },
            kpis: { permits: '45/67', agencies: '12', compliance: '100%' }
          },
          {
            id: 'site_preparation',
            name: 'Preparación del Sitio',
            type: 'construction',
            status: 'scheduled',
            duration: '8 meses',
            cost: '$280M',
            progress: 0,
            position: { x: 100, y: 320 },
            kpis: { area: '250 hectáreas', earthwork: '2.5M m³', utilities: '85 km' }
          },
          {
            id: 'main_construction',
            name: 'Construcción Principal',
            type: 'construction',
            status: 'pending',
            duration: '24 meses',
            cost: '$1,800M',
            progress: 0,
            position: { x: 400, y: 320 },
            kpis: { structures: '15', concrete: '45,000 m³', steel: '12,000 tons' }
          },
          {
            id: 'commissioning',
            name: 'Puesta en Servicio',
            type: 'commissioning',
            status: 'pending',
            duration: '6 meses',
            cost: '$185M',
            progress: 0,
            position: { x: 700, y: 320 },
            kpis: { systems: '156', tests: '2,400', performance: '98%' }
          }
        ],
        connections: [
          { from: 'feasibility_study', to: 'design_engineering', duration: '3 semanas', progress: 100 },
          { from: 'feasibility_study', to: 'permits_licensing', duration: '2 semanas', progress: 100 },
          { from: 'design_engineering', to: 'site_preparation', duration: '8 semanas', progress: 58 },
          { from: 'permits_licensing', to: 'site_preparation', duration: '4 semanas', progress: 42 },
          { from: 'site_preparation', to: 'main_construction', duration: '6 semanas', progress: 0 },
          { from: 'main_construction', to: 'commissioning', duration: '8 semanas', progress: 0 }
        ]
      }
    };

    return workflows[operationType] || workflows.manufacturing;
  }, []);

  // Datos iniciales de proyectos
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Línea de Producción Automatizada",
      operationType: 'manufacturing',
      fileType: 'google-sheets',
      googleSheetsUrl: 'https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9/edit',
      status: 'active',
      realTimeUpdates: true,
      createdAt: '2024-01-10T08:00:00Z',
      lastModified: '2024-01-15T14:30:00Z',
      budget: '$1.8B',
      completion: 67,
      team: 145,
      location: 'Planta Norte',
      nextMilestone: 'Instalación Equipos Línea 3',
      nextMilestoneDate: '2024-02-15',
      riskLevel: 'medium',
      workflow: null,
      data: {
        schema: [
          { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
          { field: 'line_id', type: 'string', sample: 'LINE-001' },
          { field: 'production_rate', type: 'number', sample: 847.5 },
          { field: 'quality_score', type: 'number', sample: 98.2 },
          { field: 'efficiency', type: 'percentage', sample: 87.5 },
          { field: 'downtime_minutes', type: 'number', sample: 15 }
        ],
        records: [
          {
            timestamp: '2024-01-15 08:30:00',
            line_id: 'LINE-001',
            production_rate: 847.5,
            quality_score: 98.2,
            efficiency: 87.5,
            downtime_minutes: 15
          }
        ]
      }
    },
    {
      id: 2,
      name: "Centro de Distribución Regional",
      operationType: 'logistics',
      fileType: 'excel',
      status: 'active',
      realTimeUpdates: false,
      createdAt: '2024-01-08T10:00:00Z',
      lastModified: '2024-01-15T16:20:00Z',
      budget: '$950M',
      completion: 89,
      team: 78,
      location: 'Zona Industrial Sur',
      nextMilestone: 'Pruebas Sistema WMS',
      nextMilestoneDate: '2024-02-01',
      riskLevel: 'low',
      workflow: null,
      data: null
    }
  ]);

  // Función para obtener información de tipo de operación
  const getOperationTypeInfo = useCallback((type) => {
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
      }
    };
    return types[type];
  }, []);

  // Inicializar workflows en los proyectos
  useEffect(() => {
    setProjects(prevProjects => 
      prevProjects.map(project => ({
        ...project,
        workflow: getGenericWorkflows(project.operationType, project.name)
      }))
    );
  }, [getGenericWorkflows]);

  // Datos simulados para proyectos
  const getSimulatedData = useCallback((operationType, projectName) => {
    const baseSchemas = {
      manufacturing: [
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
        { field: 'line_id', type: 'string', sample: 'LINE-001' },
        { field: 'production_rate', type: 'number', sample: 847.5 },
        { field: 'quality_score', type: 'number', sample: 98.2 },
        { field: 'efficiency', type: 'percentage', sample: 87.5 },
        { field: 'downtime_minutes', type: 'number', sample: 15 }
      ],
      logistics: [
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
        { field: 'warehouse_id', type: 'string', sample: 'WH-001' },
        { field: 'orders_processed', type: 'number', sample: 1250 },
        { field: 'fulfillment_rate', type: 'percentage', sample: 99.2 },
        { field: 'avg_pick_time', type: 'number', sample: 45.2 },
        { field: 'inventory_accuracy', type: 'percentage', sample: 99.8 }
      ],
      infrastructure: [
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
        { field: 'project_phase', type: 'string', sample: 'Construction' },
        { field: 'completion_percentage', type: 'percentage', sample: 67.5 },
        { field: 'budget_used', type: 'currency', sample: 2100000 },
        { field: 'safety_incidents', type: 'number', sample: 0 },
        { field: 'quality_index', type: 'percentage', sample: 96.8 }
      ]
    };

    return {
      filename: `${operationType}_data_${Date.now()}.xlsx`,
      sheets: [`${operationType.charAt(0).toUpperCase() + operationType.slice(1)}_Operations`, 'KPIs', 'Alerts'],
      schema: baseSchemas[operationType] || baseSchemas.manufacturing,
      records: [
        baseSchemas[operationType] ? baseSchemas[operationType].reduce((acc, field) => {
          acc[field.field] = field.sample;
          return acc;
        }, {}) : {}
      ],
      workflow: getGenericWorkflows(operationType, projectName)
    };
  }, [getGenericWorkflows]);

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

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const processFile = useCallback((file) => {
    setProcessing(true);
    setProjectFile(file);

    setTimeout(() => {
      const simulatedData = getSimulatedData(operationType, projectName);
      setProjectData(simulatedData);
      setProjectWorkflow(simulatedData.workflow);
      setProcessing(false);
      setShowDataEditor(true); // Mostrar editor de datos después del procesamiento
    }, 2000);
  }, [operationType, projectName, getSimulatedData]);

  const processGoogleSheets = useCallback((url) => {
    setProcessing(true);
    setGoogleSheetsUrl(url);

    setTimeout(() => {
      const simulatedData = getSimulatedData(operationType, projectName);
      setProjectData(simulatedData);
      setProjectWorkflow(simulatedData.workflow);
      setProcessing(false);
      setShowDataEditor(true); // Mostrar editor de datos después del procesamiento
    }, 1500);
  }, [operationType, projectName, getSimulatedData]);

  const createProject = useCallback(() => {
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
      budget: operationType === 'manufacturing' ? '$1.8B' : 
              operationType === 'logistics' ? '$950M' : '$3.2B',
      completion: Math.floor(Math.random() * 30) + 10,
      team: Math.floor(Math.random() * 100) + 50,
      location: 'Nueva Ubicación',
      nextMilestone: 'Fase Inicial',
      nextMilestoneDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };

    setProjects(prev => [...prev, newProject]);
    
    // Reset form states
    setProjectName('');
    setOperationType('manufacturing');
    setGoogleSheetsUrl('');
    setProjectFile(null);
    setProjectData(null);
    setProjectWorkflow(null);
    setNewProjectStep(1);
    setCurrentView('projectList');
  }, [
    projectName, operationType, projectFile, googleSheetsUrl, 
    projectData, projectWorkflow, globalConfig.defaultFileFormat
  ]);

  // Navegación
  const handleNewProject = useCallback(() => setCurrentView('newProject'), []);
  const handleBackToList = useCallback(() => setCurrentView('projectList'), []);
  const handleViewData = useCallback((project) => {
    setSelectedProject(project);
    setCurrentView('projectData');
  }, []);
  const handleViewWorkflow = useCallback((project) => {
    setSelectedProject(project);
    setCurrentView('projectWorkflow');
  }, []);
  const handleEditProject = useCallback((project) => {
    setSelectedProject(project);
    setCurrentView('editProject');
  }, []);

  // Manejadores de modales
  const handleDataEditorSave = (data) => {
    setProjectData(data);
    setShowDataEditor(false);
    if (newProjectStep === 2) {
      setNewProjectStep(3); // Continuar con el workflow después de editar datos
    }
  };

  // Componente para paso 2 del nuevo proyecto
  const NewProjectStep2 = () => (
    <>
      <style jsx>{`
        .upload-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .step-header {
          margin-bottom: 32px;
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

        .upload-area {
          border: 3px dashed #e5e8eb;
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: white;
        }

        .upload-area.drag-over {
          border-color: #3b82f6;
          background: #f0f8ff;
        }

        .upload-area.processing {
          border-color: #10b981;
          background: #f0fdf4;
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

        .processing-spinner {
          animation: spin 1s linear infinite;
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
            type="button"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <h1 className="step-title">Carga de Datos</h1>
          <p className="step-subtitle">
            Conecte su fuente de datos para el análisis del digital twin
          </p>
        </div>

        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''} ${processing ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !processing && fileInputRef.current?.click()}
        >
          {processing ? (
            <div>
              <RefreshCw className="processing-spinner" size={48} color="#10b981" />
              <h3 className="upload-title">Procesando Datos del Proyecto...</h3>
            </div>
          ) : (
            <>
              <FileSpreadsheet className="upload-icon" size={56} />
              <h3 className="upload-title">
                Arrastra tu archivo Excel aquí
              </h3>
              <p className="upload-subtitle">
                Carga datos operacionales para crear tu digital twin
              </p>
              <button className="upload-btn" type="button">
                <Upload size={16} />
                Seleccionar Archivo
              </button>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );

  // Renderizado del contenido principal
  const renderContent = () => {
    switch (currentView) {
      case 'projectList':
        return (
          <ProjectList 
            projects={projects}
            onNewProject={handleNewProject}
            onViewData={handleViewData}
            onViewWorkflow={handleViewWorkflow}
            onEditProject={handleEditProject}
          />
        );

      case 'newProject':
        if (newProjectStep === 1) {
          return (
            <ProjectNameForm
              projectName={projectName}
              setProjectName={setProjectName}
              operationType={operationType}
              setOperationType={setOperationType}
              onNext={() => setNewProjectStep(2)}
              onBack={handleBackToList}
            />
          );
        } else if (newProjectStep === 2) {
          return <NewProjectStep2 />;
        } else if (newProjectStep === 3) {
          return projectWorkflow ? (
            <>
              <WorkflowCanvas 
                workflow={projectWorkflow}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                onBack={() => setNewProjectStep(2)}
                draggingNode={draggingNode}
                setDraggingNode={setDraggingNode}
                dragOffset={dragOffset}
                setDragOffset={setDragOffset}
              />
              
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
                  onClick={() => setNewProjectStep(2)}
                  style={{ padding: '16px 24px', borderRadius: '12px' }}
                  type="button"
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
                  type="button"
                >
                  <CheckCircle size={16} />
                  Activar Digital Twin
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowKPIManager(true)}
                  style={{ 
                    padding: '16px 24px', 
                    borderRadius: '12px'
                  }}
                  type="button"
                >
                  <Target size={16} />
                  Gestionar KPIs
                </button>
              </div>
            </>
          ) : null;
        }
        break;

      case 'projectData':
        return (
          <ProjectData 
            project={selectedProject}
            getOperationTypeInfo={getOperationTypeInfo}
            onBack={handleBackToList}
          />
        );

      case 'projectWorkflow':
        return selectedProject?.workflow ? (
          <>
            <WorkflowCanvas 
              workflow={selectedProject.workflow}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
              onBack={handleBackToList}
              draggingNode={draggingNode}
              setDraggingNode={setDraggingNode}
              dragOffset={dragOffset}
              setDragOffset={setDragOffset}
            />
          
          </>
        ) : null;

      case 'editProject':
        return (
          <EditProject 
            project={selectedProject}
            onBack={handleBackToList}
            onSave={handleBackToList}
          />
        );

      default:
        return (
          <ProjectList 
            projects={projects}
            onNewProject={handleNewProject}
            onViewData={handleViewData}
            onViewWorkflow={handleViewWorkflow}
            onEditProject={handleEditProject}
          />
        );
    }
  };

  return (
    <>
      <style jsx>{`
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
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
      `}</style>

      {/* Contenido principal */}
      {renderContent()}

      {/* Editor de Datos */}
      {showDataEditor && projectData && (
        <DataSourceEditor
          initialData={projectData}
          onSave={handleDataEditorSave}
          onCancel={() => setShowDataEditor(false)}
        />
      )}

      {/* Panel de Estadísticas */}
      <StatisticsPanel 
        projectData={selectedProject?.data}
        workflow={selectedProject?.workflow}
        isVisible={showStatistics}
        onClose={() => setShowStatistics(false)}
      />

      {/* Gestor de KPIs */}
      {showKPIManager && (
        <KPIManager 
          workflow={projectWorkflow || selectedProject?.workflow}
          onSave={() => setShowKPIManager(false)}
          onClose={() => setShowKPIManager(false)}
        />
      )}
    </>
  );
};

export default GestionProyectos;