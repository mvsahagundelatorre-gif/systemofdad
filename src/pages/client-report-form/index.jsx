import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationBar from '../../components/ui/NavigationBar';
import FormHeader from './components/FormHeader';
import AssignmentTypeSection from './components/AssignmentTypeSection';
import ClientInformationSection from './components/ClientInformationSection';
import ReportDetailsSection from './components/ReportDetailsSection';
import DefectDescriptionSection from './components/DefectDescriptionSection';
import FormActions from './components/FormActions';
import SubmissionModal from './components/SubmissionModal';

const ClientReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    assignmentType: '',
    clientName: '',
    clientPartNumber: '',
    providerPartNumber: '',
    clientReportDate: '',
    clientReportNumber: '',
    defectDescription: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ isSuccess: false, message: '', reportNumber: '' });
  
  // Auto-generated fields
  const [captureDate, setCaptureDate] = useState('');
  const [assignmentNumber, setAssignmentNumber] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setCoordinatorName(userData?.name || 'Usuario');
      
      // Generate auto fields
      const now = new Date();
      const formattedDate = now?.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })?.replace(',', ':');
      setCaptureDate(formattedDate);
      
      // Generate assignment number: A-MMDDYYY/001
      const month = String(now?.getMonth() + 1)?.padStart(2, '0');
      const day = String(now?.getDate())?.padStart(2, '0');
      const year = now?.getFullYear();
      const sequence = '001'; // In real app, this would be incremented
      setAssignmentNumber(`A-${month}${day}${year}/${sequence}`);
      
      // Check if editing existing report
      if (location?.state?.report && location?.state?.mode === 'edit') {
        const report = location?.state?.report;
        setFormData({
          assignmentType: report?.assignmentType || '',
          clientName: report?.clientName || '',
          clientPartNumber: report?.clientPartNumber || '',
          providerPartNumber: report?.providerPartNumber || '',
          clientReportDate: report?.clientReportDate || '',
          clientReportNumber: report?.clientReportNumber || '',
          defectDescription: report?.defectDescription || ''
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, location?.state]);

  useEffect(() => {
    // Track unsaved changes
    const hasChanges = Object.values(formData)?.some(value => value?.trim() !== '');
    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.assignmentType) {
      newErrors.assignmentType = 'El tipo de asignación es obligatorio';
    }
    
    if (!formData?.clientName?.trim()) {
      newErrors.clientName = 'El nombre del cliente es obligatorio';
    }
    
    if (!formData?.clientPartNumber?.trim()) {
      newErrors.clientPartNumber = 'El número de parte del cliente es obligatorio';
    }
    
    if (!formData?.providerPartNumber?.trim()) {
      newErrors.providerPartNumber = 'El número de parte del proveedor es obligatorio';
    }
    
    if (!formData?.clientReportDate) {
      newErrors.clientReportDate = 'La fecha del informe es obligatoria';
    }
    
    if (!formData?.clientReportNumber?.trim()) {
      newErrors.clientReportNumber = 'El número de informe del cliente es obligatorio';
    }
    
    if (!formData?.defectDescription?.trim()) {
      newErrors.defectDescription = 'La descripción del defecto es obligatoria';
    } else if (formData?.defectDescription?.trim()?.length < 20) {
      newErrors.defectDescription = 'La descripción debe tener al menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate report number
      const reportNumber = `RPT-${new Date()?.getFullYear()}-${String(Math.floor(Math.random() * 1000))?.padStart(3, '0')}`;
      
      // Simulate successful submission
      setModalData({
        isSuccess: true,
        message: 'El informe ha sido procesado y enviado exitosamente. Se ha generado el PDF y enviado al supervisor.',
        reportNumber
      });
      setShowModal(true);
      setHasUnsavedChanges(false);
      
    } catch (error) {
      setModalData({
        isSuccess: false,
        message: 'Ocurrió un error al procesar el informe. Por favor, inténtelo nuevamente.',
        reportNumber: ''
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      // Simulate saving draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      
      setModalData({
        isSuccess: true,
        message: 'El borrador ha sido guardado exitosamente.',
        reportNumber: ''
      });
      setShowModal(true);
      
    } catch (error) {
      setModalData({
        isSuccess: false,
        message: 'Error al guardar el borrador. Inténtelo nuevamente.',
        reportNumber: ''
      });
      setShowModal(true);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
        navigate(user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard');
      }
    } else {
      navigate(user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalData?.isSuccess && modalData?.reportNumber) {
      // Navigate back to dashboard after successful submission
      navigate(user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar user={user} onNavigate={() => {}} />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar user={user} onNavigate={() => {}} />
      <main className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <FormHeader
              captureDate={captureDate}
              assignmentNumber={assignmentNumber}
              coordinatorName={coordinatorName}
            />
            
            <AssignmentTypeSection
              value={formData?.assignmentType}
              onChange={(value) => setFormData(prev => ({ ...prev, assignmentType: value }))}
              error={errors?.assignmentType}
            />
            
            <ClientInformationSection
              clientName={formData?.clientName}
              onClientNameChange={(value) => setFormData(prev => ({ ...prev, clientName: value }))}
              clientPartNumber={formData?.clientPartNumber}
              onClientPartNumberChange={(value) => setFormData(prev => ({ ...prev, clientPartNumber: value }))}
              providerPartNumber={formData?.providerPartNumber}
              onProviderPartNumberChange={(value) => setFormData(prev => ({ ...prev, providerPartNumber: value }))}
              errors={errors}
            />
            
            <ReportDetailsSection
              clientReportDate={formData?.clientReportDate}
              onClientReportDateChange={(value) => setFormData(prev => ({ ...prev, clientReportDate: value }))}
              clientReportNumber={formData?.clientReportNumber}
              onClientReportNumberChange={(value) => setFormData(prev => ({ ...prev, clientReportNumber: value }))}
              errors={errors}
            />
            
            <DefectDescriptionSection
              value={formData?.defectDescription}
              onChange={(value) => setFormData(prev => ({ ...prev, defectDescription: value }))}
              error={errors?.defectDescription}
            />
            
            <FormActions
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              isSavingDraft={isSavingDraft}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>
        </div>
      </main>
      <SubmissionModal
        isOpen={showModal}
        onClose={handleModalClose}
        isSuccess={modalData?.isSuccess}
        message={modalData?.message}
        reportNumber={modalData?.reportNumber}
      />
    </div>
  );
};

export default ClientReportForm;