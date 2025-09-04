import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import ExecutiveMetricsCards from './components/ExecutiveMetricsCards';
import AdvancedFilters from './components/AdvancedFilters';
import ReportsDataTable from './components/ReportsDataTable';
import Button from '../../components/ui/Button';


const ExecutiveDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  // Mock data for executive dashboard
  const mockReports = [
    {
      id: 'RPT-001',
      assignmentNumber: 'A-040925/001',
      employeeName: 'María García',
      department: 'Control de Calidad',
      clientName: 'Industrias Acme S.L.',
      clientPartNumber: 'ACM-2024-001',
      providerPartNumber: 'PRV-QC-001',
      assignmentType: 'reclamo_calidad',
      assignmentTypeLabel: 'Reclamo de Calidad',
      status: 'completado',
      priority: 'alta',
      createdAt: '2025-01-15T08:30:00Z',
      updatedAt: '2025-01-16T14:45:00Z',
      reportDate: '2025-01-15T10:00:00Z',
      clientReportNumber: 'CLI-2025-001',
      defectDescription: `Defecto detectado en componente principal durante inspección de calidad.\nSe observaron irregularidades en el acabado superficial que no cumplen con especificaciones técnicas.\nRequiere análisis detallado y plan de acción correctiva.`,
      coordinatorName: 'María García'
    },
    {
      id: 'RPT-002',
      assignmentNumber: 'A-040925/002',
      employeeName: 'Carlos Rodríguez',
      department: 'Logística',
      clientName: 'Tecnología Avanzada S.A.',
      clientPartNumber: 'TAV-2024-002',
      providerPartNumber: 'PRV-LOG-002',
      assignmentType: 'reclamo_logistica',
      assignmentTypeLabel: 'Reclamo de Logística',
      status: 'pendiente',
      priority: 'media',
      createdAt: '2025-01-14T09:15:00Z',
      updatedAt: '2025-01-15T11:20:00Z',
      reportDate: '2025-01-14T14:30:00Z',
      clientReportNumber: 'CLI-2025-002',
      defectDescription: `Retraso en entrega de componentes críticos para línea de producción.\nImpacto en cronograma de manufactura y compromisos con cliente final.\nNecesario revisar procesos de planificación y coordinación con proveedores.`,
      coordinatorName: 'Carlos Rodríguez'
    },
    {
      id: 'RPT-003',
      assignmentNumber: 'A-040925/003',
      employeeName: 'Ana Martínez',
      department: 'Servicios al Cliente',
      clientName: 'Soluciones Empresariales Ltda.',
      clientPartNumber: 'SOL-2024-003',
      providerPartNumber: 'PRV-SRV-003',
      assignmentType: 'reclamo_servicio',
      assignmentTypeLabel: 'Reclamo de Servicio',
      status: 'en_revision',
      priority: 'alta',
      createdAt: '2025-01-13T11:45:00Z',
      updatedAt: '2025-01-14T16:30:00Z',
      reportDate: '2025-01-13T15:00:00Z',
      clientReportNumber: 'CLI-2025-003',
      defectDescription: `Cliente reporta insatisfacción con tiempo de respuesta del servicio técnico.\nQuejas recurrentes sobre disponibilidad de repuestos y soporte especializado.\nRequiere implementación de mejoras en proceso de atención al cliente.`,
      coordinatorName: 'Ana Martínez'
    },
    {
      id: 'RPT-004',
      assignmentNumber: 'A-040925/004',
      employeeName: 'Luis Fernández',
      department: 'Gestión de Proveedores',
      clientName: 'Manufactura Integral S.A.',
      clientPartNumber: 'MAN-2024-004',
      providerPartNumber: 'PRV-GES-004',
      assignmentType: 'reclamo_proveedor',
      assignmentTypeLabel: 'Reclamo de Proveedor',
      status: 'completado',
      priority: 'baja',
      createdAt: '2025-01-12T13:20:00Z',
      updatedAt: '2025-01-13T09:45:00Z',
      reportDate: '2025-01-12T16:45:00Z',
      clientReportNumber: 'CLI-2025-004',
      defectDescription: `Incumplimiento de especificaciones técnicas por parte de proveedor secundario.\nMateriales recibidos no cumplen con estándares de calidad establecidos.\nSe requiere renegociación de términos contractuales y plan de mejora.`,
      coordinatorName: 'Luis Fernández'
    },
    {
      id: 'RPT-005',
      assignmentNumber: 'A-040925/005',
      employeeName: 'Sofía López',
      department: 'Auditoría Interna',
      clientName: 'Corporación Global S.L.',
      clientPartNumber: 'COR-2024-005',
      providerPartNumber: 'PRV-AUD-005',
      assignmentType: 'auditoria_interna',
      assignmentTypeLabel: 'Auditoría Interna',
      status: 'borrador',
      priority: 'media',
      createdAt: '2025-01-11T10:00:00Z',
      updatedAt: '2025-01-12T14:15:00Z',
      reportDate: '2025-01-11T12:30:00Z',
      clientReportNumber: 'CLI-2025-005',
      defectDescription: `Auditoría interna revela desviaciones en procesos de control de calidad.\nIdentificadas oportunidades de mejora en documentación y trazabilidad.\nRecomendaciones para optimización de procedimientos operativos.`,
      coordinatorName: 'Sofía López'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setReports(mockReports);
      setFilteredReports(mockReports);
      
      // Calculate metrics
      const totalReports = mockReports?.length;
      const pendingReports = mockReports?.filter(r => r?.status === 'pendiente' || r?.status === 'en_revision')?.length;
      const completedReports = mockReports?.filter(r => r?.status === 'completado')?.length;
      const completionRate = totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;
      
      setMetrics({
        totalReports,
        pendingReports,
        completedReports,
        completionRate
      });
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...mockReports];
    
    // Apply search query
    if (newFilters?.searchQuery) {
      const query = newFilters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(report => 
        report?.clientName?.toLowerCase()?.includes(query) ||
        report?.assignmentNumber?.toLowerCase()?.includes(query) ||
        report?.employeeName?.toLowerCase()?.includes(query) ||
        report?.clientPartNumber?.toLowerCase()?.includes(query)
      );
    }
    
    // Apply department filter
    if (newFilters?.department) {
      filtered = filtered?.filter(report => 
        report?.department?.toLowerCase()?.includes(newFilters?.department?.toLowerCase())
      );
    }
    
    // Apply employee filter
    if (newFilters?.employee) {
      filtered = filtered?.filter(report => 
        report?.employeeName?.toLowerCase()?.includes(newFilters?.employee?.toLowerCase())
      );
    }
    
    // Apply assignment type filter
    if (newFilters?.assignmentType) {
      filtered = filtered?.filter(report => report?.assignmentType === newFilters?.assignmentType);
    }
    
    // Apply status filter
    if (newFilters?.status) {
      filtered = filtered?.filter(report => report?.status === newFilters?.status);
    }
    
    // Apply date range filters
    if (newFilters?.dateFrom) {
      const fromDate = new Date(newFilters.dateFrom);
      filtered = filtered?.filter(report => new Date(report.createdAt) >= fromDate);
    }
    
    if (newFilters?.dateTo) {
      const toDate = new Date(newFilters.dateTo);
      toDate?.setHours(23, 59, 59, 999); // End of day
      filtered = filtered?.filter(report => new Date(report.createdAt) <= toDate);
    }
    
    setFilteredReports(filtered);
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = [
      ['Número de Asignación', 'Empleado', 'Departamento', 'Cliente', 'Tipo', 'Estado', 'Fecha Creación'],
      ...filteredReports?.map(report => [
        report?.assignmentNumber,
        report?.employeeName,
        report?.department,
        report?.clientName,
        report?.assignmentTypeLabel,
        report?.status,
        new Date(report.createdAt)?.toLocaleDateString('es-ES')
      ])
    ]?.map(row => row?.join(','))?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `informes_ejecutivos_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleCreateReport = () => {
    navigate('/client-report-form');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar user={user} onNavigate={navigate} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-border mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Panel Ejecutivo - Bienvenido, {user?.name || 'Ejecutivo'}
                </h1>
                <p className="text-muted-foreground">
                  Supervise el rendimiento del equipo y revise informes de todos los departamentos con acceso completo de solo lectura.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar Datos
                </Button>
                <Button
                  variant="default"
                  onClick={handleCreateReport}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Nuevo Informe
                </Button>
              </div>
            </div>
          </div>

          {/* Executive Metrics */}
          <ExecutiveMetricsCards metrics={metrics} loading={loading} />

          {/* Advanced Filters */}
          <AdvancedFilters 
            onFiltersChange={handleFiltersChange}
            resultsCount={filteredReports?.length}
          />

          {/* Reports Data Table */}
          <ReportsDataTable 
            reports={filteredReports}
            loading={loading}
            onExport={handleExport}
          />

          {/* Quick Actions - Mobile */}
          <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleExport}
              iconName="Download"
              className="rounded-full shadow-lg"
            >
              Exportar
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleCreateReport}
              iconName="Plus"
              className="rounded-full shadow-lg"
            >
              Nuevo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;