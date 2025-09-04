import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ReportDetailsModal = ({ report: propReport, onClose, className = '' }) => {
  const [report, setReport] = useState(propReport);
  const [loading, setLoading] = useState(!propReport);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If no report prop, try to get from location state
    if (!propReport && location?.state?.report) {
      setReport(location?.state?.report);
      setLoading(false);
    } else if (!propReport) {
      // Simulate loading report data
      const timer = setTimeout(() => {
        setReport({
          id: 'RPT-2025-001',
          title: 'Q1 Client Assessment Report',
          clientName: 'Acme Corporation',
          employeeName: 'John Smith',
          status: 'completed',
          priority: 'high',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-16T14:45:00Z',
          dueDate: '2025-01-20T23:59:59Z',
          description: 'Comprehensive quarterly assessment covering financial performance, operational efficiency, and strategic recommendations for Q2 planning.',
          sections: [
            {
              title: 'Executive Summary',
              content: 'Overall client performance shows strong growth trajectory with 15% revenue increase year-over-year.',
              completed: true
            },
            {
              title: 'Financial Analysis',
              content: 'Detailed breakdown of revenue streams, cost analysis, and profitability metrics.',
              completed: true
            },
            {
              title: 'Recommendations',
              content: 'Strategic recommendations for Q2 including market expansion opportunities.',
              completed: false
            }
          ],
          attachments: [
            { name: 'financial_data.xlsx', size: '2.4 MB', type: 'spreadsheet' },
            { name: 'client_presentation.pdf', size: '1.8 MB', type: 'pdf' }
          ]
        });
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [propReport, location?.state]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleEdit = () => {
    navigate('/client-report-form', { state: { report, mode: 'edit' } });
  };

  const handleDownloadPDF = () => {
    // Simulate PDF download
    console.log('Downloading PDF for report:', report?.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'spreadsheet': return 'Sheet';
      case 'image': return 'Image';
      default: return 'File';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 space-y-6 animate-pulse-gentle">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <Icon name="AlertCircle" size={48} color="var(--color-error)" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested report could not be loaded. Please try again.
          </p>
          <Button variant="default" onClick={handleClose}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{report?.title}</h1>
              <p className="text-sm text-muted-foreground">Report ID: {report?.id}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Status and Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report?.status)}`}>
                  {report?.status?.charAt(0)?.toUpperCase() + report?.status?.slice(1)}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report?.priority)}`}>
                  {report?.priority?.charAt(0)?.toUpperCase() + report?.priority?.slice(1)}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Client</label>
                <p className="text-sm text-foreground">{report?.clientName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Employee</label>
                <p className="text-sm text-foreground">{report?.employeeName}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm text-foreground font-mono">
                  {new Date(report.createdAt)?.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm text-foreground font-mono">
                  {new Date(report.updatedAt)?.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="text-sm text-foreground font-mono">
                  {new Date(report.dueDate)?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-foreground leading-relaxed">{report?.description}</p>
            </div>

            {/* Report Sections */}
            {report?.sections && report?.sections?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Report Sections</h3>
                <div className="space-y-3">
                  {report?.sections?.map((section, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{section?.title}</h4>
                        <div className="flex items-center space-x-2">
                          {section?.completed ? (
                            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                          ) : (
                            <Icon name="Clock" size={16} color="var(--color-warning)" />
                          )}
                          <span className={`text-xs ${section?.completed ? 'text-success' : 'text-warning'}`}>
                            {section?.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{section?.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {report?.attachments && report?.attachments?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Attachments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report?.attachments?.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                        <Icon name={getFileIcon(attachment?.type)} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{attachment?.name}</p>
                        <p className="text-xs text-muted-foreground">{attachment?.size}</p>
                      </div>
                      <button className="p-1 hover:bg-muted rounded transition-colors duration-200">
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              iconName="Download"
              iconPosition="left"
            >
              Download PDF
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={handleEdit}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;