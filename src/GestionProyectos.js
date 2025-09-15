// GestionProyectos.js - Componente Principal
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Link, FileSpreadsheet, ArrowLeft, ArrowRight, RefreshCw,
  CheckCircle, Check, Database, BarChart3, Workflow, Droplets, Zap, Activity
} from 'lucide-react';

// Importar todos los componentes separados
import ProjectNameForm from './ProjectNameForm';
import ProjectList from './ProjectList';
import WorkflowCanvas from './WorkflowCanvas';
import ProjectData from './ProjectData';
import EditProject from './EditProject';

const GestionProyectos = () => {
  // Estados principales de navegación
  const [currentView, setCurrentView] = useState('projectList');
  const [newProjectStep, setNewProjectStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Estados para el formulario - COMPLETAMENTE SEPARADOS
  const [projectName, setProjectName] = useState('');
  const [operationType, setOperationType] = useState('upstream');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [projectFile, setProjectFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectWorkflow, setProjectWorkflow] = useState(null);

  // Estados para drag & drop
  const [dragOver, setDragOver] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Referencias
  const fileInputRef = useRef(null);

  // Configuración global
  const [globalConfig] = useState({
    defaultFileFormat: 'excel',
    autoProcessing: true,
    realTimeUpdates: true,
    notifications: true
  });

  // Workflows específicos y OPTIMIZADOS para cada tipo de operación petrolera
  const getPetroleumWorkflows = useCallback((operationType, projectName) => {
    const workflows = {
      upstream: {
        name: 'Upstream - Exploración y Producción',
        description: 'Ciclo completo desde prospección sísmica hasta producción comercial',
        totalDuration: '32 meses',
        estimatedCost: '$2.8B',
        riskScore: 7.2,
        aiRecommendations: [
          { type: 'warning', message: 'Ventana meteorológica crítica: operaciones marinas limitadas a Mayo-Octubre', priority: 'crítica' },
          { type: 'optimization', message: 'Paralelizar estudios ambientales con diseño reduce timeline 4 meses', priority: 'alta' },
          { type: 'risk', message: 'Zona geológicamente compleja - implementar programa piloto', priority: 'alta' },
          { type: 'cost', message: 'Contratos EPC integrados pueden reducir CAPEX 15%', priority: 'media' }
        ],
        nodes: [
          {
            id: 'seismic_acquisition',
            name: 'Adquisición Sísmica 3D',
            type: 'exploration',
            status: 'completed',
            duration: '6 meses',
            cost: '$85M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { coverage: '4,500 km²', resolution: '12.5m', confidence: '96%' }
          },
          {
            id: 'geological_interpretation',
            name: 'Interpretación Geológica',
            type: 'analysis',
            status: 'completed',
            duration: '4 meses',
            cost: '$45M',
            progress: 100,
            position: { x: 400, y: 120 },
            kpis: { prospects: '8 identificados', resources: '420 MMBO', success_prob: '85%' }
          },
          {
            id: 'environmental_permits',
            name: 'Permisos Ambientales',
            type: 'regulatory',
            status: 'running',
            duration: '10 meses',
            cost: '$65M',
            progress: 85,
            position: { x: 700, y: 120 },
            kpis: { agencies: '7 involucradas', approval_prob: '92%', timeline: 'En plazo' }
          },
          {
            id: 'well_engineering',
            name: 'Ingeniería de Pozos',
            type: 'engineering',
            status: 'running',
            duration: '6 meses',
            cost: '$95M',
            progress: 75,
            position: { x: 1000, y: 120 },
            kpis: { wells_designed: '6', max_depth: '4,800m', success_rate: '87%' }
          },
          {
            id: 'rig_contracting',
            name: 'Contratación Taladro',
            type: 'procurement',
            status: 'scheduled',
            duration: '3 meses',
            cost: '$340M',
            progress: 0,
            position: { x: 100, y: 320 },
            kpis: { rig_type: 'Semisumergible', dayrate: '$485K', contract: '24 meses' }
          },
          {
            id: 'drilling_campaign',
            name: 'Campaña Perforación',
            type: 'drilling',
            status: 'pending',
            duration: '16 meses',
            cost: '$890M',
            progress: 0,
            position: { x: 400, y: 320 },
            kpis: { wells_total: '6', avg_duration: '65 días', npt_target: '<8%' }
          },
          {
            id: 'facilities_construction',
            name: 'Construcción Facilidades',
            type: 'construction',
            status: 'pending',
            duration: '20 meses',
            cost: '$1,100M',
            progress: 0,
            position: { x: 700, y: 320 },
            kpis: { platform_capacity: '45K BOPD', modules: '12', preassembly: '85%' }
          },
          {
            id: 'commissioning',
            name: 'Puesta en Marcha',
            type: 'commissioning',
            status: 'pending',
            duration: '6 meses',
            cost: '$85M',
            progress: 0,
            position: { x: 1000, y: 320 },
            kpis: { systems_tested: '127', efficiency: '94%', safety: '100%' }
          },
          {
            id: 'production_startup',
            name: 'Producción Comercial',
            type: 'production',
            status: 'pending',
            duration: '8 meses',
            cost: '$65M',
            progress: 0,
            position: { x: 550, y: 520 },
            kpis: { target_rate: '42K BOPD', plateau: '12 años', opex: '$8.50/BOE' }
          }
        ],
        connections: [
          { from: 'seismic_acquisition', to: 'geological_interpretation', duration: '2 semanas', progress: 100 },
          { from: 'geological_interpretation', to: 'environmental_permits', duration: '3 semanas', progress: 100 },
          { from: 'geological_interpretation', to: 'well_engineering', duration: '2 semanas', progress: 100 },
          { from: 'environmental_permits', to: 'rig_contracting', duration: '6 semanas', progress: 85 },
          { from: 'well_engineering', to: 'rig_contracting', duration: '4 semanas', progress: 75 },
          { from: 'rig_contracting', to: 'drilling_campaign', duration: '8 semanas', progress: 0 },
          { from: 'well_engineering', to: 'facilities_construction', duration: '12 semanas', progress: 75 },
          { from: 'drilling_campaign', to: 'commissioning', duration: '6 semanas', progress: 0 },
          { from: 'facilities_construction', to: 'commissioning', duration: '8 semanas', progress: 0 },
          { from: 'commissioning', to: 'production_startup', duration: '4 semanas', progress: 0 }
        ]
      },
      midstream: {
        name: 'Midstream - Transporte y Procesamiento',
        description: 'Infraestructura para transporte, procesamiento y distribución de gas natural',
        totalDuration: '24 meses',
        estimatedCost: '$2.2B',
        riskScore: 5.8,
        aiRecommendations: [
          { type: 'optimization', message: 'Aprovechar corredor existente reduce CAPEX 22%', priority: 'alta' },
          { type: 'regulatory', message: 'Coordinación con 12 municipios crítica para cronograma', priority: 'alta' },
          { type: 'technical', message: 'Sistema compresión dual garantiza 99.5% disponibilidad', priority: 'media' },
          { type: 'environmental', message: 'Técnica HDD minimiza impacto en cruces de ríos', priority: 'media' }
        ],
        nodes: [
          {
            id: 'route_optimization',
            name: 'Optimización de Ruta',
            type: 'planning',
            status: 'completed',
            duration: '4 meses',
            cost: '$45M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { distance: '685 km', crossings: '47', optimization: '18% vs original' }
          },
          {
            id: 'environmental_permits',
            name: 'Permisos Ambientales',
            type: 'regulatory',
            status: 'running',
            duration: '12 meses',
            cost: '$85M',
            progress: 78,
            position: { x: 400, y: 120 },
            kpis: { agencies: '9', approvals: '18/23', hearings: '6 completadas' }
          },
          {
            id: 'right_of_way',
            name: 'Derecho de Vía',
            type: 'legal',
            status: 'running',
            duration: '16 meses',
            cost: '$265M',
            progress: 72,
            position: { x: 700, y: 120 },
            kpis: { properties: '1,247', agreements: '897', compensation: '$265M' }
          },
          {
            id: 'pipeline_engineering',
            name: 'Ingeniería Ductos',
            type: 'engineering',
            status: 'running',
            duration: '8 meses',
            cost: '$125M',
            progress: 85,
            position: { x: 1000, y: 120 },
            kpis: { diameter: '42"', pressure: '1,440 psi', capacity: '3.2 BCF/d' }
          },
          {
            id: 'compressor_stations',
            name: 'Estaciones Compresoras',
            type: 'facilities',
            status: 'scheduled',
            duration: '14 meses',
            cost: '$485M',
            progress: 0,
            position: { x: 250, y: 320 },
            kpis: { stations: '4', power: '180 MW', efficiency: '96%' }
          },
          {
            id: 'pipeline_construction',
            name: 'Construcción Ducto',
            type: 'construction',
            status: 'pending',
            duration: '18 meses',
            cost: '$1,100M',
            progress: 0,
            position: { x: 550, y: 320 },
            kpis: { sections: '8', crews: '6', rate: '2.8 km/día' }
          },
          {
            id: 'testing_commissioning',
            name: 'Pruebas y Puesta en Marcha',
            type: 'testing',
            status: 'pending',
            duration: '6 meses',
            cost: '$85M',
            progress: 0,
            position: { x: 850, y: 320 },
            kpis: { pressure_test: '1,728 psi', integrity: '100%', systems: '47' }
          },
          {
            id: 'commercial_operation',
            name: 'Operación Comercial',
            type: 'operations',
            status: 'pending',
            duration: 'Continuo',
            cost: '$125M/año',
            progress: 0,
            position: { x: 550, y: 520 },
            kpis: { availability: '99.2%', throughput: '3.2 BCF/d', opex: '$0.85/MMBTU' }
          }
        ],
        connections: [
          { from: 'route_optimization', to: 'environmental_permits', duration: '3 semanas', progress: 100 },
          { from: 'route_optimization', to: 'right_of_way', duration: '4 semanas', progress: 100 },
          { from: 'route_optimization', to: 'pipeline_engineering', duration: '2 semanas', progress: 100 },
          { from: 'pipeline_engineering', to: 'compressor_stations', duration: '6 semanas', progress: 85 },
          { from: 'environmental_permits', to: 'pipeline_construction', duration: '8 semanas', progress: 78 },
          { from: 'right_of_way', to: 'pipeline_construction', duration: '4 semanas', progress: 72 },
          { from: 'compressor_stations', to: 'testing_commissioning', duration: '8 semanas', progress: 0 },
          { from: 'pipeline_construction', to: 'testing_commissioning', duration: '4 semanas', progress: 0 },
          { from: 'testing_commissioning', to: 'commercial_operation', duration: '4 semanas', progress: 0 }
        ]
      },
      downstream: {
        name: 'Downstream - Modernización Refinería',
        description: 'Modernización integral con nuevas unidades de conversión profunda',
        totalDuration: '42 meses',
        estimatedCost: '$3.8B',
        riskScore: 8.1,
        aiRecommendations: [
          { type: 'risk', message: 'Tie-ins durante paradas - ventanas críticas 96 horas máximo', priority: 'crítica' },
          { type: 'market', message: 'Demanda gasolina premium +15% - optimizar reformado', priority: 'alta' },
          { type: 'optimization', message: 'Integración energética reduce consumo 18%', priority: 'alta' },
          { type: 'environmental', message: 'Nuevos sistemas SOx/NOx cumplen estándares 2025', priority: 'media' }
        ],
        nodes: [
          {
            id: 'process_licensing',
            name: 'Licenciamiento Tecnología',
            type: 'licensing',
            status: 'completed',
            duration: '8 meses',
            cost: '$185M',
            progress: 100,
            position: { x: 100, y: 120 },
            kpis: { licenses: '5 tecnologías', licensors: 'UOP, Shell', guarantees: '98%' }
          },
          {
            id: 'detailed_engineering',
            name: 'Ingeniería Detallada',
            type: 'engineering',
            status: 'running',
            duration: '16 meses',
            cost: '$385M',
            progress: 68,
            position: { x: 400, y: 120 },
            kpis: { drawings: '12,847', '3d_model': '89%', isometrics: '7,245' }
          },
          {
            id: 'equipment_procurement',
            name: 'Procura Equipos',
            type: 'procurement',
            status: 'running',
            duration: '20 meses',
            cost: '$1,650M',
            progress: 45,
            position: { x: 700, y: 120 },
            kpis: { major_equipment: '89', reactors: '6', delivery: '18 meses' }
          },
          {
            id: 'environmental_upgrades',
            name: 'Mejoras Ambientales',
            type: 'environmental',
            status: 'scheduled',
            duration: '12 meses',
            cost: '$295M',
            progress: 0,
            position: { x: 1000, y: 120 },
            kpis: { sox_removal: '99.8%', nox_reduction: '85%', efficiency: '94%' }
          },
          {
            id: 'site_preparation',
            name: 'Preparación Sitio',
            type: 'construction',
            status: 'scheduled',
            duration: '10 meses',
            cost: '$265M',
            progress: 0,
            position: { x: 250, y: 320 },
            kpis: { area: '125 hectáreas', foundations: '847', tie_ins: '156' }
          },
          {
            id: 'unit_construction',
            name: 'Construcción Unidades',
            type: 'construction',
            status: 'pending',
            duration: '24 meses',
            cost: '$1,450M',
            progress: 0,
            position: { x: 550, y: 320 },
            kpis: { process_units: '6', piping: '185 km', structures: '95' }
          },
          {
            id: 'control_systems',
            name: 'Sistemas Control',
            type: 'automation',
            status: 'pending',
            duration: '10 meses',
            cost: '$245M',
            progress: 0,
            position: { x: 850, y: 320 },
            kpis: { control_loops: '3,567', dcs: '100%', cybersecurity: 'IEC 62443' }
          },
          {
            id: 'commissioning',
            name: 'Puesta en Marcha',
            type: 'commissioning',
            status: 'pending',
            duration: '8 meses',
            cost: '$185M',
            progress: 0,
            position: { x: 400, y: 520 },
            kpis: { units_started: '6', performance: '156 tests', specs: '100%' }
          },
          {
            id: 'commercial_production',
            name: 'Producción Comercial',
            type: 'production',
            status: 'pending',
            duration: 'Continuo',
            cost: '$185M/año',
            progress: 0,
            position: { x: 700, y: 520 },
            kpis: { capacity: '250K BPD', utilization: '92%', margin: '$8.50/bbl' }
          }
        ],
        connections: [
          { from: 'process_licensing', to: 'detailed_engineering', duration: '4 semanas', progress: 100 },
          { from: 'detailed_engineering', to: 'equipment_procurement', duration: '6 semanas', progress: 68 },
          { from: 'detailed_engineering', to: 'environmental_upgrades', duration: '8 semanas', progress: 68 },
          { from: 'equipment_procurement', to: 'site_preparation', duration: '12 semanas', progress: 45 },
          { from: 'site_preparation', to: 'unit_construction', duration: '8 semanas', progress: 0 },
          { from: 'equipment_procurement', to: 'unit_construction', duration: '16 semanas', progress: 45 },
          { from: 'unit_construction', to: 'control_systems', duration: '12 semanas', progress: 0 },
          { from: 'control_systems', to: 'commissioning', duration: '6 semanas', progress: 0 },
          { from: 'environmental_upgrades', to: 'commissioning', duration: '4 semanas', progress: 0 },
          { from: 'commissioning', to: 'commercial_production', duration: '6 semanas', progress: 0 }
        ]
      }
    };

    return workflows[operationType] || workflows.upstream;
  }, []);

  // Datos iniciales de proyectos
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
      workflow: null,
      data: {
        schema: [
          { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
          { field: 'well_id', type: 'string', sample: 'PZ-Norte-001' },
          { field: 'oil_rate_bopd', type: 'number', sample: 2847.5 }
        ],
        records: [
          {
            timestamp: '2024-01-15 08:30:00',
            well_id: 'PZ-Norte-001',
            oil_rate_bopd: 2847.5
          }
        ]
      }
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
      workflow: null,
      data: null
    }
  ]);

  // Función para obtener información de tipo de operación
  const getOperationTypeInfo = useCallback((type) => {
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
  }, []);

  // Inicializar workflows en los proyectos
  useEffect(() => {
    setProjects(prevProjects => 
      prevProjects.map(project => ({
        ...project,
        workflow: getPetroleumWorkflows(project.operationType, project.name)
      }))
    );
  }, [getPetroleumWorkflows]);

  // Datos simulados para proyectos
  const getSimulatedData = useCallback((operationType, projectName) => {
    const baseSchemas = {
      upstream: [
        { field: 'timestamp', type: 'datetime', sample: '2024-01-15 08:30:00' },
        { field: 'well_id', type: 'string', sample: 'PZ-Norte-001' },
        { field: 'oil_rate_bopd', type: 'number', sample: 2847.5 },
        { field: 'gas_rate_mscfd', type: 'number', sample: 1284.2 },
        { field: 'water_rate_bwpd', type: 'number', sample: 425.8 },
        { field: 'wellhead_pressure_psi', type: 'number', sample: 3250.0 }
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
          wellhead_pressure_psi: 3250.0
        }
      ],
      workflow: getPetroleumWorkflows(operationType, projectName)
    };
  }, [getPetroleumWorkflows]);

  // Manejadores de archivos con useCallback para estabilidad
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
      setNewProjectStep(3);
    }, 3000);
  }, [operationType, projectName, getSimulatedData]);

  const processGoogleSheets = useCallback((url) => {
    setProcessing(true);
    setGoogleSheetsUrl(url);

    setTimeout(() => {
      const simulatedData = getSimulatedData(operationType, projectName);
      setProjectData(simulatedData);
      setProjectWorkflow(simulatedData.workflow);
      setProcessing(false);
      setNewProjectStep(3);
    }, 2500);
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
  }, [
    projectName, operationType, projectFile, googleSheetsUrl, 
    projectData, projectWorkflow, globalConfig.defaultFileFormat
  ]);

  // Navegación estable con useCallback
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

        .step-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
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
                Carga datos de producción, costos y cronogramas para crear tu digital twin petrolero
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

        <div className="step-navigation">
          <button className="btn btn-secondary" onClick={() => setNewProjectStep(1)} type="button">
            <ArrowLeft size={16} />
            Anterior
          </button>
          <div></div>
        </div>
      </div>
    </>
  );

  // Componente para paso 3 del nuevo proyecto
  const NewProjectStep3 = () => (
    <>
      <style jsx>{`
        .data-preview-container {
          max-width: 1400px;
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

        .data-summary {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .summary-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0 0 24px 0;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
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
      `}</style>

      <div className="data-preview-container">
        <div className="step-header">
          <button 
            className="back-btn"
            onClick={() => setNewProjectStep(2)}
            type="button"
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
              <h2 className="summary-title">Análisis del Dataset Petrolero Completado</h2>
              <p>Se han detectado {projectData.schema.length} campos de datos y {projectData.records.length} registros históricos.</p>
              <p>El workflow personalizado para {getOperationTypeInfo(operationType).name} está listo para ser generado.</p>
            </div>

            <div className="step-navigation">
              <button className="btn btn-secondary" onClick={() => setNewProjectStep(2)} type="button">
                <ArrowLeft size={16} />
                Anterior
              </button>
              <button className="btn btn-primary" onClick={() => setNewProjectStep(4)} type="button">
                Generar Digital Twin
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
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
          return <NewProjectStep3 />;
        } else if (newProjectStep === 4) {
          return projectWorkflow ? (
            <>
              <WorkflowCanvas 
                workflow={projectWorkflow}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                onBack={() => setNewProjectStep(3)}
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
                  onClick={() => setNewProjectStep(3)}
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

  return renderContent();
};

export default GestionProyectos;