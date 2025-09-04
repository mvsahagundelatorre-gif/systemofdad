import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionModal = ({ isOpen, onClose, isSuccess, message, reportNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isSuccess ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <Icon 
              name={isSuccess ? "CheckCircle" : "AlertCircle"} 
              size={32} 
              color={isSuccess ? "var(--color-success)" : "var(--color-error)"} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isSuccess ? '¡Informe Enviado Exitosamente!' : 'Error al Enviar Informe'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {message}
            </p>
            {isSuccess && reportNumber && (
              <p className="text-sm text-primary font-mono mt-2">
                Número de Informe: {reportNumber}
              </p>
            )}
          </div>
          
          {isSuccess && (
            <div className="bg-success/5 border border-success/20 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <Icon name="Mail" size={16} color="var(--color-success)" className="mt-0.5" />
                <div className="text-left">
                  <p className="text-xs font-medium text-success">PDF Generado y Enviado</p>
                  <p className="text-xs text-muted-foreground">
                    El informe ha sido enviado automáticamente al supervisor con el PDF adjunto.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant="default"
            onClick={onClose}
            className="w-full"
          >
            {isSuccess ? 'Continuar' : 'Intentar Nuevamente'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;