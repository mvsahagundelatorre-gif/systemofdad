import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import Button from './ui/Button';

const ProfessionalPDFGenerator = ({ 
  content, 
  title = "Documento", 
  author = "Sistema Empresarial",
  subject = "Reporte Generado",
  onGeneratingChange 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    onGeneratingChange?.(true);

    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf?.internal?.pageSize?.getWidth();
      const pageHeight = pdf?.internal?.pageSize?.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Set document metadata
      pdf?.setProperties({
        title: title,
        subject: subject,
        author: author,
        creator: 'Sistema Empresarial',
        producer: 'Sistema Empresarial PDF Generator'
      });

      // Add header
      pdf?.setFillColor(41, 128, 185); // Professional blue
      pdf?.rect(0, 0, pageWidth, 30, 'F');
      
      // Company logo area (placeholder)
      pdf?.setFillColor(255, 255, 255);
      pdf?.circle(25, 15, 8, 'F');
      pdf?.setTextColor(41, 128, 185);
      pdf?.setFontSize(10);
      pdf?.setFont('helvetica', 'bold');
      pdf?.text('LOGO', 21, 17);

      // Header title
      pdf?.setTextColor(255, 255, 255);
      pdf?.setFontSize(18);
      pdf?.setFont('helvetica', 'bold');
      pdf?.text(title, 45, 20);

      // Header date
      pdf?.setFontSize(10);
      pdf?.setFont('helvetica', 'normal');
      const currentDate = new Date()?.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf?.text(`Generado el ${currentDate}`, pageWidth - margin - 60, 20);

      // Reset text color
      pdf?.setTextColor(0, 0, 0);

      // Content area
      let yPosition = 50;

      // Check if content is HTML element or string
      if (typeof content === 'string') {
        // Handle text content
        const lines = pdf?.splitTextToSize(content, contentWidth);
        pdf?.setFontSize(11);
        pdf?.setFont('helvetica', 'normal');
        pdf?.text(lines, margin, yPosition);
        yPosition += lines?.length * 5;
      } else if (content instanceof HTMLElement || React.isValidElement(content)) {
        // Handle HTML/React content - convert to canvas first
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '800px';
        tempDiv.style.padding = '20px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        
        if (React.isValidElement(content)) {
          // For React components, you'd need to render them to string
          tempDiv.innerHTML = '<div>React content conversion not implemented</div>';
        } else {
          tempDiv?.appendChild(content?.cloneNode(true));
        }
        
        document.body?.appendChild(tempDiv);
        
        try {
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas?.toDataURL('image/png');
          const imgWidth = contentWidth;
          const imgHeight = (canvas?.height * imgWidth) / canvas?.width;
          
          // Check if image fits in current page
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf?.addPage();
            yPosition = margin;
          }
          
          pdf?.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } finally {
          document.body?.removeChild(tempDiv);
        }
      }

      // Add professional footer
      const footerY = pageHeight - 15;
      pdf?.setDrawColor(41, 128, 185);
      pdf?.setLineWidth(0.5);
      pdf?.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      pdf?.setFontSize(8);
      pdf?.setTextColor(128, 128, 128);
      pdf?.text('Sistema Empresarial - Documento Generado Automáticamente', margin, footerY);
      pdf?.text(`Página 1`, pageWidth - margin - 15, footerY);

      // Add additional metadata
      const metadata = {
        'Generado por': author,
        'Fecha de generación': new Date()?.toISOString(),
        'Versión del sistema': '3.0.0'
      };

      let metadataY = yPosition + 20;
      pdf?.setFontSize(9);
      pdf?.setTextColor(100, 100, 100);
      pdf?.text('Información del Documento:', margin, metadataY);
      
      metadataY += 8;
      Object.entries(metadata)?.forEach(([key, value]) => {
        pdf?.text(`${key}: ${value}`, margin + 5, metadataY);
        metadataY += 5;
      });

      // Generate filename with timestamp
      const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-')?.split('T')?.[0];
      const filename = `${title?.replace(/\s+/g, '_')}_${timestamp}.pdf`;

      // Save the PDF
      pdf?.save(filename);

      return {
        success: true,
        filename,
        message: 'PDF generado correctamente'
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      return {
        success: false,
        error: error?.message || 'Error al generar el PDF'
      };
    } finally {
      setIsGenerating(false);
      onGeneratingChange?.(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      loading={isGenerating}
      disabled={isGenerating}
      variant="default"
      iconName="FileText"
      iconPosition="left"
    >
      {isGenerating ? 'Generando PDF...' : 'Generar PDF Profesional'}
    </Button>
  );
};

// Higher-order component for easy integration
export const withPDFGeneration = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const generateComponentPDF = async (title = "Documento") => {
      if (ref?.current) {
        // Fix: Use the component function directly instead of creating new instance
        const result = await generateProfessionalPDF({
          content: ref.current,
          title,
          onGeneratingChange: setIsGeneratingPDF
        });
        return result;
      }
    };

    return (
      <WrappedComponent
        {...props}
        ref={ref}
        generatePDF={generateComponentPDF}
        isGeneratingPDF={isGeneratingPDF}
      />
    );
  });
};

// Utility function for generating PDFs from any content
export const generateProfessionalPDF = async (options = {}) => {
  const {
    content = '',
    title = 'Documento',
    author = 'Sistema Empresarial',
    subject = 'Reporte Generado',
    onGeneratingChange,
    ...otherOptions
  } = options;

  // Fix: Create a temporary instance to call the generatePDF method
  const generator = React.createElement(ProfessionalPDFGenerator, {
    content,
    title,
    author,
    subject,
    onGeneratingChange,
    ...otherOptions
  });

  // Fix: Create a proper PDF generator instance
  const pdfGeneratorInstance = new (class {
    constructor(props) {
      this.props = props;
    }
    
    async generatePDF() {
      const { content, title, author, subject, onGeneratingChange } = this.props;
      const [isGenerating, setIsGenerating] = [false, (val) => {
        if (onGeneratingChange) onGeneratingChange(val);
      }];
      
      setIsGenerating(true);

      try {
        // ... keep existing PDF generation logic from ProfessionalPDFGenerator ...
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf?.internal?.pageSize?.getWidth();
        const pageHeight = pdf?.internal?.pageSize?.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        
        // Set document metadata
        pdf?.setProperties({
          title: title,
          subject: subject,
          author: author,
          creator: 'Sistema Empresarial',
          producer: 'Sistema Empresarial PDF Generator'
        });

        // Add header
        pdf?.setFillColor(41, 128, 185);
        pdf?.rect(0, 0, pageWidth, 30, 'F');
        
        pdf?.setFillColor(255, 255, 255);
        pdf?.circle(25, 15, 8, 'F');
        pdf?.setTextColor(41, 128, 185);
        pdf?.setFontSize(10);
        pdf?.setFont('helvetica', 'bold');
        pdf?.text('LOGO', 21, 17);

        pdf?.setTextColor(255, 255, 255);
        pdf?.setFontSize(18);
        pdf?.setFont('helvetica', 'bold');
        pdf?.text(title, 45, 20);

        pdf?.setFontSize(10);
        pdf?.setFont('helvetica', 'normal');
        const currentDate = new Date()?.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        pdf?.text(`Generado el ${currentDate}`, pageWidth - margin - 60, 20);

        pdf?.setTextColor(0, 0, 0);

        let yPosition = 50;

        if (typeof content === 'string') {
          const lines = pdf?.splitTextToSize(content, contentWidth);
          pdf?.setFontSize(11);
          pdf?.setFont('helvetica', 'normal');
          pdf?.text(lines, margin, yPosition);
          yPosition += lines?.length * 5;
        } else if (content instanceof HTMLElement || React.isValidElement(content)) {
          const tempDiv = document.createElement('div');
          tempDiv.style.width = '800px';
          tempDiv.style.padding = '20px';
          tempDiv.style.backgroundColor = 'white';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          
          if (React.isValidElement(content)) {
            tempDiv.innerHTML = '<div>React content conversion not implemented</div>';
          } else {
            tempDiv?.appendChild(content?.cloneNode(true));
          }
          
          document.body?.appendChild(tempDiv);
          
          try {
            const canvas = await html2canvas(tempDiv, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            
            const imgData = canvas?.toDataURL('image/png');
            const imgWidth = contentWidth;
            const imgHeight = (canvas?.height * imgWidth) / canvas?.width;
            
            if (yPosition + imgHeight > pageHeight - margin) {
              pdf?.addPage();
              yPosition = margin;
            }
            
            pdf?.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } finally {
            document.body?.removeChild(tempDiv);
          }
        }

        const footerY = pageHeight - 15;
        pdf?.setDrawColor(41, 128, 185);
        pdf?.setLineWidth(0.5);
        pdf?.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        
        pdf?.setFontSize(8);
        pdf?.setTextColor(128, 128, 128);
        pdf?.text('Sistema Empresarial - Documento Generado Automáticamente', margin, footerY);
        pdf?.text(`Página 1`, pageWidth - margin - 15, footerY);

        const metadata = {
          'Generado por': author,
          'Fecha de generación': new Date()?.toISOString(),
          'Versión del sistema': '3.0.0'
        };

        let metadataY = yPosition + 20;
        pdf?.setFontSize(9);
        pdf?.setTextColor(100, 100, 100);
        pdf?.text('Información del Documento:', margin, metadataY);
        
        metadataY += 8;
        Object.entries(metadata)?.forEach(([key, value]) => {
          pdf?.text(`${key}: ${value}`, margin + 5, metadataY);
          metadataY += 5;
        });

        const timestamp = new Date()?.toISOString()?.replace(/[:.]/g, '-')?.split('T')?.[0];
        const filename = `${title?.replace(/\s+/g, '_')}_${timestamp}.pdf`;

        pdf?.save(filename);

        return {
          success: true,
          filename,
          message: 'PDF generado correctamente'
        };

      } catch (error) {
        console.error('Error generating PDF:', error);
        return {
          success: false,
          error: error?.message || 'Error al generar el PDF'
        };
      } finally {
        setIsGenerating(false);
      }
    }
  })({
    content,
    title,
    author,
    subject,
    onGeneratingChange,
    ...otherOptions
  });

  return await pdfGeneratorInstance.generatePDF();
};

export default ProfessionalPDFGenerator;