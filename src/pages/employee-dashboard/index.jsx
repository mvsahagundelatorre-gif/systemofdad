import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import WelcomeHeader from './components/WelcomeHeader';
import ActivityMetricsCards from './components/ActivityMetricsCards';
import ActivityTable from './components/ActivityTable';

const EmployeeDashboard = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser);
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for employee reports
  const mockReports = [
    {
      id: 'RPT-001',
      assignmentNumber: 'A-010425/001',
      clientName: 'Industrias Tecnológicas S.A.',
      clientPartNumber: 'TEC-2024-001',
      providerPartNumber: 'PROV-456789',
      reportDate: '2025-01-04T10:30:00Z',
      assignmentType: 'Reclamos de calidad',
      status: 'completed',
      defectDescription: 'Defecto en el acabado superficial de componentes metálicos que afecta la funcionalidad del producto final.',
      clientReportNumber: 'CLI-2025-001',
      coordinatorName: user?.name || 'María González',
      createdAt: '2025-01-04T08:15:00Z',
      updatedAt: '2025-01-04T14:22:00Z'
    },
    {
      id: 'RPT-002',
      assignmentNumber: 'A-010325/002',
      clientName: 'Manufacturas del Norte Ltda.',
      clientPartNumber: 'MAN-2024-078',
      providerPartNumber: 'PROV-123456',
      reportDate: '2025-01-03T14:45:00Z',
      assignmentType: 'Reclamos logísticos',
      status: 'pending',
      defectDescription: 'Retraso en la entrega de componentes críticos que impacta la línea de producción.',
      clientReportNumber: 'CLI-2025-002',
      coordinatorName: user?.name || 'María González',
      createdAt: '2025-01-03T12:30:00Z',
      updatedAt: '2025-01-03T16:10:00Z'
    },
    {
      id: 'RPT-003',
      assignmentNumber: 'A-010225/003',
      clientName: 'Sistemas Integrados Corp.',
      clientPartNumber: 'SIS-2024-045',
      providerPartNumber: 'PROV-789012',
      reportDate: '2025-01-02T09:20:00Z',
      assignmentType: 'Reclamos de servicio',
      status: 'draft',
      defectDescription: 'Falla en el servicio de mantenimiento preventivo que resultó en parada no programada.',
      clientReportNumber: 'CLI-2025-003',
      coordinatorName: user?.name || 'María González',
      createdAt: '2025-01-02T07:45:00Z',
      updatedAt: '2025-01-02T11:30:00Z'
    },
    {
      id: 'RPT-004',
      assignmentNumber: 'A-123124/004',
      clientName: 'Componentes Especializados S.L.',
      clientPartNumber: 'COM-2024-089',
      providerPartNumber: 'PROV-345678',
      reportDate: '2024-12-31T16:00:00Z',
      assignmentType: 'Auditoría interna de no conformidades',
      status: 'completed',
      defectDescription: 'No conformidades detectadas en el proceso de control de calidad durante auditoría interna.',
      clientReportNumber: 'CLI-2024-089',
      coordinatorName: user?.name || 'María González',
      createdAt: '2024-12-31T14:20:00Z',
      updatedAt: '2025-01-02T09:15:00Z'
    },
    {
      id: 'RPT-005',
      assignmentNumber: 'A-123024/005',
      clientName: 'Soluciones Industriales Avanzadas',
      clientPartNumber: 'SOL-2024-156',
      providerPartNumber: 'PROV-901234',
      reportDate: '2024-12-30T11:30:00Z',
      assignmentType: 'Reclamos de proveedor',
      status: 'pending',
      defectDescription: 'Incumplimiento de especificaciones técnicas por parte del proveedor en lote de materiales.',
      clientReportNumber: 'CLI-2024-156',
      coordinatorName: user?.name || 'María González',
      createdAt: '2024-12-30T09:45:00Z',
      updatedAt: '2024-12-30T15:20:00Z'
    }
  ];

  useEffect(() => {
    // Get user from localStorage if not provided via props
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/login');
          return;
        }
      } else {
        navigate('/login');
        return;
      }
    }

    // Simulate loading and set mock data
    const timer = setTimeout(() => {
      setReports(mockReports);
      
      // Calculate metrics
      const totalReports = mockReports?.length;
      const pendingReports = mockReports?.filter(r => r?.status === 'pending')?.length;
      const completedReports = mockReports?.filter(r => r?.status === 'completed')?.length;
      const thisMonth = mockReports?.filter(r => {
        const reportDate = new Date(r.createdAt);
        const now = new Date();
        return reportDate?.getMonth() === now?.getMonth() && reportDate?.getFullYear() === now?.getFullYear();
      })?.length;

      setMetrics({
        totalReports,
        pendingReports,
        completedReports,
        thisMonth
      });
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleCreateReport = () => {
    navigate('/client-report-form');
  };

  const handleViewReport = (report) => {
    navigate('/report-details-view', { state: { report } });
  };

  const handleEditReport = (report) => {
    navigate('/client-report-form', { state: { report, mode: 'edit' } });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Cargando panel de empleado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar 
        user={user} 
        onNavigate={handleNavigation}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WelcomeHeader 
            user={user} 
            onCreateReport={handleCreateReport}
          />
          
          <ActivityMetricsCards 
            metrics={metrics} 
            loading={loading}
          />
          
          <ActivityTable
            reports={reports}
            onViewReport={handleViewReport}
            onEditReport={handleEditReport}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;