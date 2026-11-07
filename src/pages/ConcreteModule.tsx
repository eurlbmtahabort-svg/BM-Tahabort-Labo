import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { Box, Plus, CheckCircle2, AlertTriangle, FileText, Trash2, Calculator } from 'lucide-react';
import { ComplianceResult } from '../types/lims';

export const ConcreteModule: React.FC = () => {
  const { concreteTests, addConcreteTest, samples, generatePV } = useLims();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const pendingConcreteSamples = samples.filter(s => s.materialType === 'concrete');
  const [selectedSampleId, setSelectedSampleId] = useState(pendingConcreteSamples[0]?.id || '');
  const [ageDays, setAgeDays] = useState<number>(28);
  const [dimensionA, setDimensionA] = useState<number>(150);
  const [dimensionB, setDimensionB] = useState<number>(150);
  const [weightKg, setWeightKg] = useState<number>(8.200);
  const [crushingForceKN, setCrushingForceKN] = useState<number>(680);
  const [sectionalAreaCm2, setSectionalAreaCm2] = useState<number>(225); // 15x15 cm = 225 cm²
  const [slumpMm, setSlumpMm] = useState<number>(80);
  const [notes, setNotes] = useState<string>('Éprouvettes cylindriques 16x32 ou cubiques 15x15. Conforme NA 16002.');

  // Auto-calculated preview
  const calculatedRc = Number(((crushingForceKN * 1000) / (sectionalAreaCm2 * 100)).toFixed(2));
  const isConforme = calculatedRc >= 25.0; // Assume C25/30 threshold fck >= 25 MPa

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sample = samples.find(s => s.id === selectedSampleId);
    if (!sample) return;

    const result: ComplianceResult = isConforme ? 'Conforme' : 'Non Conforme';

    const newTest = await addConcreteTest({
      sampleId: sample.id,
      sampleCode: sample.code,
      clientName: sample.clientName,
      projectName: sample.projectName,
      ageDays,
      dimensionA,
      dimensionB,
      weightKg,
      crushingForceKN,
      sectionalAreaCm2,
      slumpMm,
      result,
      testDate: new Date().toISOString().split('T')[0],
      technician: sample.technician,
      standard: 'NA 16002 / EN 12390-3',
      notes
    });

    // Also offer to generate PV
    await generatePV(
      sample.id,
      `Écrasement éprouvette béton à ${ageDays} jours. Force de rupture = ${crushingForceKN} kN, Surface = ${sectionalAreaCm2} cm², Résistance Rc = ${newTest.calculatedRcMPa} MPa. Résultat: ${result}.`,
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
            <span>Normes Algériennes NA 16002 & Européennes EN 12390-3</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-[#FF8C00]" />
            <span>Contrôle Qualité Béton & Écrasement</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Essais de résistance à la compression sur éprouvettes de béton durci et mesure d'ouvrabilité au cône d'Abrams.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Essai de Compression</span>
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Historique des Essais Béton</h3>
          <span className="text-xs font-mono text-neutral-400">Total: {concreteTests.length} essais</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3">Code Échantillon</th>
                <th className="px-6 py-3">Chantier / Client</th>
                <th className="px-6 py-3">Âge (Jours)</th>
                <th className="px-6 py-3">Force Rupture (kN)</th>
                <th className="px-6 py-3">Section (cm²)</th>
                <th className="px-6 py-3 font-bold text-white">Résistance Rc (MPa)</th>
                <th className="px-6 py-3">Affaissement (mm)</th>
                <th className="px-6 py-3">Résultat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300 font-mono">
              {concreteTests.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-bold text-white">{t.sampleCode}</td>
                  <td className="px-6 py-3 font-sans">
                    <div className="font-semibold">{t.clientName}</div>
                    <div className="text-[11px] text-neutral-400">{t.projectName}</div>
                  </td>
                  <td className="px-6 py-3">{t.ageDays} J</td>
                  <td className="px-6 py-3">{t.crushingForceKN} kN</td>
                  <td className="px-6 py-3">{t.sectionalAreaCm2} cm²</td>
                  <td className="px-6 py-3 font-bold text-base text-[#FF8C00]">{t.calculatedRcMPa} MPa</td>
                  <td className="px-6 py-3">{t.slumpMm} mm</td>
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
              {concreteTests.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-neutral-500 font-sans">
                    Aucun essai béton enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Concrete Test Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#FF8C00]" />
                <span>Nouvel Essai de Compression Béton (NA 16002)</span>
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
                <label className="block text-neutral-400 mb-1">Sélectionner l'Échantillon Béton</label>
                <select
                  value={selectedSampleId}
                  onChange={(e) => setSelectedSampleId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                >
                  {pendingConcreteSamples.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.clientName} ({s.gradeSpec} - {s.projectName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Âge de l'éprouvette (Jours)</label>
                  <select
                    value={ageDays}
                    onChange={(e) => setAgeDays(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value={7}>7 Jours (Résistance jeune)</option>
                    <option value={14}>14 Jours</option>
                    <option value={28}>28 Jours (Résistance caractéristique)</option>
                    <option value={90}>90 Jours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Affaissement Cône Abrams (mm)</label>
                  <input
                    type="number"
                    value={slumpMm}
                    onChange={(e) => setSlumpMm(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Force de Rupture F (kN)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={crushingForceKN}
                    onChange={(e) => setCrushingForceKN(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Section S (cm²)</label>
                  <input
                    type="number"
                    required
                    value={sectionalAreaCm2}
                    onChange={(e) => setSectionalAreaCm2(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">ex: 225 cm² (15x15)</span>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Masse (kg)</label>
                  <input
                    type="number"
                    step="0.010"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Live Calculation Preview Box */}
              <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Calcul Automatique de Résistance Rc (MPa):</span>
                  <span className="text-[10px] font-mono">Rc = (F × 1000) / (S × 100)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-[#FF8C00]">{calculatedRc} MPa</span>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    isConforme ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {isConforme ? '✓ Conforme au C25/30' : '✕ Non Conforme'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Observations & Remarques Laboratoire</label>
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
