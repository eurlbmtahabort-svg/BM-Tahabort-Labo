import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { TestTube2, Plus, Search, Filter, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Sample, MaterialType } from '../types/lims';
import { useTranslation } from 'react-i18next';

export const SamplesModule: React.FC = () => {
  const { samples, addSample, deleteSample, clients } = useLims();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [code, setCode] = useState(`BET-2026-0${samples.length + 45}`);
  const [clientName, setClientName] = useState(clients[0]?.company || 'COSIDER TP');
  const [projectName, setProjectName] = useState('Chantier Route Nationale');
  const [materialType, setMaterialType] = useState<MaterialType>('concrete');
  const [gradeSpec, setGradeSpec] = useState('C25/30');
  const [samplingLocation, setSamplingLocation] = useState('Zone Est');
  const [technician, setTechnician] = useState('Rachid M.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSample({
      code,
      clientName,
      projectName,
      materialType,
      dateReceived: new Date().toISOString().split('T')[0],
      status: 'pending',
      technician,
      gradeSpec,
      samplingLocation
    });
    setShowModal(false);
    setCode(`ECH-2026-0${samples.length + 50}`);
  };

  const filteredSamples = samples.filter(s => {
    const matchesSearch = s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = filterMaterial === 'all' || s.materialType === filterMaterial;
    return matchesSearch && matchesMaterial;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <TestTube2 className="w-6 h-6 text-[#FF8C00]" />
            <span>{t('samples.title')}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {t('samples.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('samples.registerBtn')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute start-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('samples.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg ps-9 pe-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#FF8C00]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-neutral-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> {t('samples.materialLabel')}:
          </span>
          {['all', 'concrete', 'asphalt', 'base_layer'].map((mat) => (
            <button
              key={mat}
              onClick={() => setFilterMaterial(mat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterMaterial === mat
                  ? 'bg-[#FF8C00] text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              {mat === 'all' ? t('dashboard.viewAll') : mat === 'concrete' ? t('dashboard.matConcrete') : mat === 'asphalt' ? t('dashboard.matAsphalt') : t('dashboard.matBase')}
            </button>
          ))}
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-start text-xs">
            <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-start">{t('samples.tableCode')}</th>
                <th className="px-6 py-3 text-start">{t('samples.tableClient')}</th>
                <th className="px-6 py-3 text-start">{t('dashboard.tableProject')}</th>
                <th className="px-6 py-3 text-start">{t('samples.tableMaterial')}</th>
                <th className="px-6 py-3 text-start">{t('samples.tablePoint')}</th>
                <th className="px-6 py-3 text-start">{t('samples.tableDate')}</th>
                <th className="px-6 py-3 text-start">{t('samples.tableStatus')}</th>
                <th className="px-6 py-3 text-end">{t('samples.tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300 font-mono">
              {filteredSamples.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-bold text-white">{s.code}</td>
                  <td className="px-6 py-3 font-sans font-medium">{s.clientName}</td>
                  <td className="px-6 py-3 text-neutral-400 font-sans">{s.projectName}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans ${
                      s.materialType === 'concrete' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      s.materialType === 'asphalt' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {s.materialType === 'concrete' ? t('dashboard.matConcrete') : s.materialType === 'asphalt' ? t('dashboard.matAsphalt') : t('dashboard.matBase')} ({s.gradeSpec})
                    </span>
                  </td>
                  <td className="px-6 py-3 font-sans text-neutral-400">{s.samplingLocation}</td>
                  <td className="px-6 py-3 text-neutral-400">{s.dateReceived}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans ${
                      s.status === 'validated' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      s.status === 'tested' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {s.status === 'validated' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{s.status === 'validated' ? t('dashboard.validated') : s.status === 'tested' ? t('dashboard.tested') : t('dashboard.pending')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3 text-end">
                    <button
                      onClick={() => deleteSample(s.id)}
                      className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-neutral-400 hover:text-rose-300 rounded transition-colors"
                      title={t('samples.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSamples.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-neutral-500 font-sans">
                    Aucun échantillon ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sample Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <h3 className="text-base font-bold text-white">{t('samples.modalTitle')}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t('samples.tableCode')}</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('samples.materialLabel')}</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="concrete">{t('dashboard.matConcrete')} (NA 16002)</option>
                    <option value="asphalt">{t('dashboard.matAsphalt')} (NA 5031)</option>
                    <option value="base_layer">{t('dashboard.matBase')} (NA 523)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">{t('samples.clientLabel')}</label>
                  <select
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.company}>{c.company} ({c.name})</option>
                    ))}
                    <option value="Autre Client">Autre Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('samples.projectLabel')}</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Spécification / Dosage</label>
                  <input
                    type="text"
                    required
                    value={gradeSpec}
                    onChange={(e) => setGradeSpec(e.target.value)}
                    placeholder="ex: C25/30 ou BBSG 0/14"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">{t('samples.samplingPoint')}</label>
                  <input
                    type="text"
                    required
                    value={samplingLocation}
                    onChange={(e) => setSamplingLocation(e.target.value)}
                    placeholder="ex: Pk 12+500 Voie Sud"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Technicien Responsable</label>
                <input
                  type="text"
                  required
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium"
                >
                  {t('samples.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg font-semibold"
                >
                  {t('samples.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
