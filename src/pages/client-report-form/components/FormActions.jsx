import React from 'react';
import Button from '../../../components/ui/Button';

const FormActions = ({ 
  onSubmit, 
  onSaveDraft, 
  onCancel, 
  isSubmitting, 
  isSavingDraft, 
  hasUnsavedChanges 
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {hasUnsavedChanges && (
            <>
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span>Cambios sin guardar</span>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isSavingDraft}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            loading={isSavingDraft}
            disabled={isSubmitting}
            iconName="Save"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Guardar Borrador
          </Button>
          
          <Button
            variant="default"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={isSavingDraft}
            iconName="Send"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Enviar Informe
          </Button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <p className="text-xs text-muted-foreground">
          <strong>Nota:</strong> Al enviar el informe, se generará automáticamente un PDF con el logo de la empresa 
          y se enviará por correo electrónico al supervisor correspondiente.
        </p>
      </div>
    </div>
  );
};

export default FormActions;