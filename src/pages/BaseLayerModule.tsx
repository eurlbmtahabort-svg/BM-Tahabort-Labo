import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { Mountain, Plus, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';
import { ComplianceResult } from '../types/lims';

export const BaseLayerModule: React.FC = () => {
  const { baseLayerTests, addBaseLayerTest, samples, generatePV } = useLims();
  const [showModal, setShowModal] = useState(false);

  const baseLayerSamples = samples.filter(s => s.materialType === 'base_layer');
  const [selectedSampleId, setSelectedSampleId] = useState(baseLayerSamples[0]?.id || '');
  const [maxDryDensity, setMaxDryDensity] = useState<number>(2.26);
  const [optimumMoisturePct, setOptimumMoisturePct] = useState<number>(5.6);
  const [cbr95Pct, setCbr95Pct] = useState<number>(52.0);
  const [sandEquivalentVisual, setSandEquivalentVisual] = useState<number>(78.0);
  const [losAngelesPct, setLosAngelesPct] = useState<number>(22.5);
  const [notes, setNotes] = useState<string>('Grave concassée GNT 0/31.5. Essai Proctor Modifié & CBR conformes aux spécifications routières.');

  const isConforme = cbr95Pct >= 30.0 && losAngelesPct <= 30.0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sample = samples.find(s => s.id === selectedSampleId);
    if (!sample) return;

    const result: ComplianceResult = isConforme ? 'Conforme' : 'Non Conforme';

    await addBaseLayerTest({
      sampleId: sample.id,
      sampleCode: sample.code,
      clientName: sample.clientName,
      projectName: sample.projectName,
      maxDryDensity,
      optimumMoisturePct,
      cbr95Pct,
      sandEquivalentVisual,
      losAngelesPct,
      result,
      testDate: new Date().toISOString().split('T')[0],
      technician: sample.technician,
      standard: 'NA 523 / NA 520 / NA 521',
      notes
    });

    await generatePV(
      sample.id,
      `Essais Couche de Base (GNT). Proctor Modifié OMD = ${maxDryDensity} t/m³, Wopt = ${optimumMoisturePct}%, CBR @ 95% = ${cbr95Pct}%, Los Angeles = ${losAngelesPct}%. Résultat: ${result}.`,
      result
    );

    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF8C00] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Normes NA 523 (Proctor) & NA 521 (Los Angeles)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mountain className="w-6 h-6 text-[#FF8C00]" />
            <span>Couches de Base & Géotechnique Routière</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Essais Proctor Modifié, CBR, Équivalent de Sable et Résistance à la Fragmentation (Los Angeles).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Essai Géotechnique</span>
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Historique des Essais Couches de Base</h3>
          <span className="text-xs font-mono text-neutral-400">Total: {baseLayerTests.length} essais</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3">Code Échantillon</th>
                <th className="px-6 py-3">Chantier / Client</th>
                <th className="px-6 py-3">Densité Sèche Max (t/m³)</th>
                <th className="px-6 py-3">Teneur en Eau Opm (%)</th>
                <th className="px-6 py-3 font-bold text-white">CBR @ 95%</th>
                <th className="px-6 py-3">Équivalent Sable (%)</th>
                <th className="px-6 py-3">Los Angeles (%)</th>
                <th className="px-6 py-3">Résultat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300 font-mono">
              {baseLayerTests.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-bold text-white">{t.sampleCode}</td>
                  <td className="px-6 py-3 font-sans">
                    <div className="font-semibold">{t.clientName}</div>
                    <div className="text-[11px] text-neutral-400">{t.projectName}</div>
                  </td>
                  <td className="px-6 py-3">{t.maxDryDensity} t/m³</td>
                  <td className="px-6 py-3">{t.optimumMoisturePct}%</td>
                  <td className="px-6 py-3 font-bold text-base text-[#FF8C00]">{t.cbr95Pct}</td>
                  <td className="px-6 py-3">{t.sandEquivalentVisual}%</td>
                  <td className="px-6 py-3">{t.losAngelesPct}%</td>
                  <td className="px-6 py-3 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] ${
                      t.result === 'Conforme' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {t.result === 'Conforme' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{t.result}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {baseLayerTests.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-neutral-500 font-sans">
                    Aucun essai couche de base enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Base Layer Test Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#FF8C00]" />
                <span>Nouvel Essai Géotechnique (Proctor & CBR)</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Sélectionner l'Échantillon Grave GNT</label>
                <select
                  value={selectedSampleId}
                  onChange={(e) => setSelectedSampleId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                >
                  {baseLayerSamples.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.clientName} ({s.gradeSpec} - {s.projectName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Densité Sèche Maximale (t/m³)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={maxDryDensity}
                    onChange={(e) => setMaxDryDensity(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Teneur en Eau Optimum (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={optimumMoisturePct}
                    onChange={(e) => setOptimumMoisturePct(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Indice CBR @ 95% OMD</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={cbr95Pct}
                    onChange={(e) => setCbr95Pct(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Équivalent de Sable ES (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={sandEquivalentVisual}
                    onChange={(e) => setSandEquivalentVisual(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Los Angeles LA (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={losAngelesPct}
                    onChange={(e) => setLosAngelesPct(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Compliance Preview */}
              <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-[11px]">Critères routiers (CBR ≥ 30, Los Angeles ≤ 30%)</p>
                  <p className="text-white font-bold text-sm mt-0.5">Statut Estimé</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  isConforme ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {isConforme ? '✓ Conforme Normes NA' : '✕ Non Conforme'}
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Observations</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg font-semibold"
                >
                  Valider & Générer le PV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
