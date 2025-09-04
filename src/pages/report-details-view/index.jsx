import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import ReportHeader from './components/ReportHeader';
import ReportMetadata from './components/ReportMetadata';
import ReportContent from './components/ReportContent';
import AuditTrail from './components/AuditTrail';
import ActionButtons from './components/ActionButtons';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';

const ReportDetailsView = () => {
  const [user, setUser] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data para el reporte
  const mockReport = {
    id: 'RPT-2025-001',
    numeroAsignacion: 'A-04092025/001',
    fechaCaptura: 'Sep-04/2025:05',
    coordinador: 'María García López',
    nombreCliente: 'Industrias Tecnológicas S.A.',
    numeroParteCliente: 'ITS-2025-4567',
    numeroParteProveedor: 'PROV-8901-2345',
    nombreProveedor: 'Componentes Avanzados S.L.',
    fechaReporteCliente: '02/09/2025:14',
    numeroReporteCliente: 'ITS-RPT-092025-001',
    tipoAsignacion: 'Reclamos de calidad',
    descripcionDefecto: `Se ha identificado un defecto crítico en el componente principal que afecta la funcionalidad del producto final.\n\nDetalles específicos:\n- Dimensiones fuera de tolerancia en el eje principal\n- Material presenta fisuras microscópicas\n- Acabado superficial no cumple con especificaciones\n\nImpacto en producción:\n- Parada de línea de ensamble durante 4 horas\n- 150 unidades afectadas en inventario\n- Retraso en entrega a cliente final\n\nAcciones inmediatas requeridas:\n1. Inspección completa del lote actual\n2. Contacto directo con proveedor para análisis de causa raíz\n3. Implementación de controles adicionales en recepción`,
    estado: 'pendiente',
    prioridad: 'alta',
    fechaCreacion: '2025-09-04T05:09:34.830Z',
    fechaActualizacion: '2025-09-04T08:15:22.445Z',
    fechaVencimiento: '2025-09-11T23:59:59.999Z',
    departamento: 'Control de Calidad'
  };

  useEffect(() => {
    // Verificar autenticación
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Simular carga de datos del reporte
      const timer = setTimeout(() => {
        // Si viene desde location state, usar esos datos
        if (location?.state?.report) {
          setReport(location?.state?.report);
        } else {
          // Usar datos mock
          setReport(mockReport);
        }
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      navigate('/login');
    }
  }, [navigate, location?.state]);

  const handleEdit = () => {
    navigate('/client-report-form', { 
      state: { 
        report, 
        mode: 'edit' 
      } 
    });
  };

  const handleDownloadPDF = async () => {
    // Simular generación de PDF
    console.log('Generando PDF para reporte:', report?.numeroAsignacion);
    
    // En una implementación real, aquí se generaría el PDF
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('PDF generado exitosamente');
        resolve();
      }, 2000);
    });
  };

  const handleEmailSupervisor = async () => {
    // Simular envío de email
    console.log('Enviando email a supervisor para reporte:', report?.numeroAsignacion);
    
    // En una implementación real, aquí se enviaría el email
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Email enviado exitosamente');
        resolve();
      }, 2000);
    });
  };

  const handleBack = () => {
    const dashboardRoute = user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard';
    navigate(dashboardRoute);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar user={user} onNavigate={handleNavigate} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6 animate-pulse">
              {/* Header skeleton */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Content skeleton */}
              {[...Array(3)]?.map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar user={user} onNavigate={handleNavigate} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Reporte No Encontrado
              </h2>
              <p className="text-muted-foreground mb-6">
                El reporte solicitado no pudo ser cargado. Por favor, intente nuevamente.
              </p>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar user={user} onNavigate={handleNavigate} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation user={user} reportId={report?.numeroAsignacion} />
          
          <ReportHeader
            report={report}
            user={user}
            onEdit={handleEdit}
            onDownloadPDF={handleDownloadPDF}
            onEmailSupervisor={handleEmailSupervisor}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <ReportMetadata report={report} user={user} />
              <ReportContent report={report} />
            </div>
            
            <div className="space-y-6">
              <ActionButtons
                report={report}
                user={user}
                onEdit={handleEdit}
                onDownloadPDF={handleDownloadPDF}
                onEmailSupervisor={handleEmailSupervisor}
                onBack={handleBack}
              />
              
              <AuditTrail report={report} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsView;