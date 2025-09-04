import React from 'react';
import Select from '../../../components/ui/Select';

const AssignmentTypeSection = ({ value, onChange, error }) => {
  const assignmentOptions = [
    { value: 'quality_claims', label: 'Reclamos de Calidad' },
    { value: 'logistics_claims', label: 'Reclamos de Logística' },
    { value: 'service_claims', label: 'Reclamos de Servicio' },
    { value: 'provider_claims', label: 'Reclamos de Proveedor' },
    { value: 'internal_audit', label: 'Auditoría Interna - No Conformidades' },
    { value: 'external_audit', label: 'Auditoría Externa - No Conformidades' },
    { value: 'general_report', label: 'Informe General' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Tipo de Asignación</h3>
      <Select
        label="Seleccionar Tipo de Asignación"
        description="Elija el tipo de asignación que mejor describa este informe"
        placeholder="Seleccione una opción..."
        options={assignmentOptions}
        value={value}
        onChange={onChange}
        error={error}
        required
        searchable
      />
    </div>
  );
};

export default AssignmentTypeSection;