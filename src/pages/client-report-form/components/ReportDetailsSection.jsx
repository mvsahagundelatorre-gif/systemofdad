import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ReportDetailsSection = ({ 
  clientReportDate, 
  onClientReportDateChange, 
  clientReportNumber, 
  onClientReportNumberChange, 
  errors 
}) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toISOString()?.slice(0, 16);
  };

  const handleDateChange = (e) => {
    const inputDate = e?.target?.value;
    if (inputDate) {
      const date = new Date(inputDate);
      const formatted = date?.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })?.replace(',', ':');
      onClientReportDateChange(formatted);
    } else {
      onClientReportDateChange('');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Detalles del Informe</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Fecha del Informe del Cliente <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              onChange={handleDateChange}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
            </div>
          </div>
          {clientReportDate && (
            <p className="text-xs text-muted-foreground">
              Formato: {clientReportDate}
            </p>
          )}
          {errors?.clientReportDate && (
            <p className="text-xs text-error">{errors?.clientReportDate}</p>
          )}
        </div>
        
        <Input
          label="Número de Informe del Cliente"
          type="text"
          placeholder="Ej: RPT-2025-001"
          value={clientReportNumber}
          onChange={(e) => onClientReportNumberChange(e?.target?.value)}
          error={errors?.clientReportNumber}
          description="Código alfanumérico único del informe"
          required
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ReportDetailsSection;