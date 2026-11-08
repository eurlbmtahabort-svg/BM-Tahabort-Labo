import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { FileText, Printer, ShieldCheck, QrCode, Search, CheckCircle2 } from 'lucide-react';
import { ReportPV } from '../types/lims';
import { useTranslation } from 'react-i18next';

export const ReportsModule: React.FC = () => {
  const { reports } = useLims();
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<ReportPV | null>(reports[0] || null);

  const filteredReports = reports.filter(r => 
    r.pvNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sampleCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const isRtl = i18n.language === 'ar';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#FF8C00]" />
            <span>{t('reports.title')}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
        {selectedReport && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{t('reports.printBtn')}</span>
          </button>
        )}
      </div>

      {/* Main Layout: List on left, preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports List */}
        <div className="lg:col-span-5 bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-neutral-700">
            <div className="relative">
              <Search className="absolute start-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder={t('reports.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg ps-9 pe-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#FF8C00]"
              />
            </div>
          </div>

          <div className="divide-y divide-neutral-700/60 max-h-[500px] overflow-y-auto">
            {filteredReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedReport?.id === r.id ? 'bg-neutral-700/60 border-s-4 border-[#FF8C00]' : 'hover:bg-neutral-700/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-white text-xs">{r.pvNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                    r.testResult === 'Conforme' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {r.testResult}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-200">{r.clientName}</p>
                <p className="text-[11px] text-neutral-400 truncate">{r.projectName}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>{t('reports.sample')} {r.sampleCode}</span>
                  <span>{r.issueDate}</span>
                </div>
              </div>
            ))}
            {filteredReports.length === 0 && (
              <div className="p-6 text-center text-neutral-400 text-xs">
                {t('reports.noReport')}
              </div>
            )}
          </div>
        </div>

        {/* PV Official Preview Document */}
        <div 
          dir={isRtl ? 'rtl' : 'ltr'} 
          className="lg:col-span-7 bg-white text-neutral-900 rounded-xl p-6 md:p-8 shadow-2xl border border-neutral-300 relative print:shadow-none print:w-full print:p-0"
        >
          {selectedReport ? (
            <div className="space-y-6">
              {/* PV Header */}
              <div className="border-b-2 border-neutral-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2D2D2D] text-[#FF8C00] font-bold text-xl rounded-lg flex items-center justify-center shrink-0">
                    LT
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm tracking-tight text-neutral-900">{t('reports.labName')}</h3>
                    <p className="text-[10px] sm:text-[11px] text-neutral-600">{t('reports.labSubtitle')}</p>
                    <p className="text-[9px] sm:text-[10px] text-neutral-500 font-mono">{t('reports.algerac')}</p>
                  </div>
                </div>
                <div className="text-start sm:text-end w-full sm:w-auto">
                  <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono font-bold text-xs rounded">
                    {selectedReport.pvNumber}
                  </span>
                  <p className="text-[10px] text-neutral-500 mt-1">Date: {selectedReport.issueDate}</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2 bg-neutral-100 rounded border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                  {t('reports.reportTitle')}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-neutral-600">{t('reports.standardRef')} {selectedReport.standardRef}</p>
              </div>

              {/* Client & Project Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-3 sm:p-4 rounded border border-neutral-200 font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">{t('reports.clientOwner')}</span>
                  <span className="font-bold text-neutral-900 font-sans text-xs sm:text-sm">{selectedReport.clientName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">{t('reports.projectSite')}</span>
                  <span className="font-bold text-neutral-900 font-sans text-xs sm:text-sm">{selectedReport.projectName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">{t('reports.sampleCode')}</span>
                  <span className="font-bold text-neutral-900">{selectedReport.sampleCode}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">{t('reports.materialType')}</span>
                  <span className="font-bold text-neutral-900 capitalize">{selectedReport.materialType}</span>
                </div>
              </div>

              {/* Test Results Summary */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{t('reports.resultsAnalysis')}</h5>
                <div className="p-3 sm:p-4 bg-neutral-100 border border-neutral-300 rounded text-xs text-neutral-800 leading-relaxed font-mono">
                  {selectedReport.summaryText}
                </div>
              </div>

              {/* Compliance Conclusion Box */}
              <div className="p-3 sm:p-4 rounded border-2 flex items-center justify-between bg-neutral-50 border-neutral-300">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase">{t('reports.complianceConclusion')}</p>
                    <p className="text-[10px] sm:text-[11px] text-neutral-600">{t('reports.complianceText')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded font-bold text-[11px] sm:text-xs uppercase tracking-wider ${
                  selectedReport.testResult === 'Conforme' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {selectedReport.testResult}
                </span>
              </div>

              {/* Signatures & QR Code */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-600 font-mono text-[10px]">
                    <QrCode className="w-7 h-7 text-neutral-800 shrink-0" />
                    <div>
                      <p className="font-bold text-neutral-900">{t('reports.verificationToken')}</p>
                      <p className="text-neutral-500 truncate max-w-[180px] sm:max-w-none">{selectedReport.qrCodeToken}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-neutral-400">{t('reports.nonReprod')}</p>
                </div>

                <div className="text-start sm:text-end space-y-1 w-full sm:w-auto">
                  <p className="font-bold text-neutral-900">{t('reports.directorTitle')}</p>
                  <div className="h-10 flex items-center sm:justify-end">
                    <span className="font-serif italic text-xs sm:text-sm text-neutral-700 font-bold border-b border-dashed border-neutral-400 pb-0.5">
                      Dr. M. Tahabort
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-500">{t('reports.stampSign')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 px-6 text-center text-neutral-500 text-xs bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
              {t('reports.selectPrompt')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
