import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { Box, Plus, CheckCircle2, AlertTriangle, Calculator, Layers } from 'lucide-react';
import { ComplianceResult, MixComponent, CylinderResult } from '../types/lims';
import { useTranslation } from 'react-i18next';

export const ConcreteModule: React.FC = () => {
  const { concreteTests, addConcreteTest, samples, generatePV } = useLims();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const pendingConcreteSamples = samples.filter(s => s.materialType === 'concrete');
  const [selectedSampleId, setSelectedSampleId] = useState(pendingConcreteSamples[0]?.id || '');

  // CTC General Header & Test Info
  const [refNumber, setRefNumber] = useState('B.AK/P01/006-07/2026');
  const [reportNumber, setReportNumber] = useState('006-07');
  const [norm, setNorm] = useState('NA 17004 / NA 16002');
  const [preparedBy, setPreparedBy] = useState('Laboratoire');
  const [requestedBy, setRequestedBy] = useState('ETB/TCE BERADI ABDELKADAR');
  const [placementMode, setPlacementMode] = useState('BÉTONNIÈRE');
  const [concreteDesignation, setConcreteDesignation] = useState('PLANCHER RDC + ESCALIER 2ÈME VOLÉE');

  // Mix Composition Table
  const [mixComposition, setMixComposition] = useState<MixComponent[]>([
    { material: 'Gravier 15/25', provenance: 'Carrière', dosageKg: 1050, dosageLitres: 0 },
    { material: 'Gravier 8/15', provenance: 'Carrière', dosageKg: 350, dosageLitres: 0 },
    { material: 'Sable roulé', provenance: 'Oued', dosageKg: 750, dosageLitres: 0 },
    { material: 'Ciment CPJ', provenance: 'Lafarge', dosageKg: 350, dosageLitres: 0 },
    { material: 'Eau de gâchage', provenance: 'Forage', dosageKg: 175, dosageLitres: 175 }
  ]);

  // Test Conditions
  const [specimenShape, setSpecimenShape] = useState('cylindrique 16 x 32 cm');
  const [curingCondition, setCuringCondition] = useState('Bassin d’eau');
  const [rectificationMode, setRectificationMode] = useState('Surfaçage au soufre');
  const [abramsSlumpCm, setAbramsSlumpCm] = useState(8);
  const [temperature, setTemperature] = useState('20° C +- 2');
  const [pressClass, setPressClass] = useState('A');
  const [sectionalAreaCm2, setSectionalAreaCm2] = useState(201.06); // 16x32 cm cyl area ~201.06 cm²

  // 3 Cylinders Input state
  const todayStr = new Date().toISOString().split('T')[0];
  const castingDefaultStr = new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0];

  const [cylinders, setCylinders] = useState<CylinderResult[]>([
    { castingDate: castingDefaultStr, testDate: todayStr, ageDays: 28, weightKg: 8.24, crushingForceKN: 675.0, resistanceMPa: 0, resistanceBar: 0 },
    { castingDate: castingDefaultStr, testDate: todayStr, ageDays: 28, weightKg: 8.21, crushingForceKN: 660.0, resistanceMPa: 0, resistanceBar: 0 },
    { castingDate: castingDefaultStr, testDate: todayStr, ageDays: 28, weightKg: 8.26, crushingForceKN: 690.0, resistanceMPa: 0, resistanceBar: 0 }
  ]);

  const [notes, setNotes] = useState('Éprouvettes cylindriques 16x32 cm confectionnées et testées conformément à la norme NA 17004 / NA 16002 (CTC).');

  // Compute calculated values for cylinders
  const updatedCylinders = cylinders.map(c => {
    // Formula: Resistance (MPa) = Force (kN) / Area (cm²) * 10
    const resMPa = Number(((c.crushingForceKN / sectionalAreaCm2) * 10).toFixed(2));
    const resBar = Number((resMPa * 10).toFixed(1));
    return { ...c, resistanceMPa: resMPa, resistanceBar: resBar };
  });

  const avgMPa = Number((updatedCylinders.reduce((acc, c) => acc + c.resistanceMPa, 0) / updatedCylinders.length).toFixed(2));
  const avgBar = Number((avgMPa * 10).toFixed(1));
  const isConforme = avgMPa >= 25.0; // Target fck >= 25 MPa for C25/30

  const handleMixChange = (index: number, field: keyof MixComponent, value: any) => {
    const updated = [...mixComposition];
    updated[index] = { ...updated[index], [field]: value };
    setMixComposition(updated);
  };

  const handleCylinderChange = (index: number, field: keyof CylinderResult, value: any) => {
    const updated = [...updatedCylinders];
    updated[index] = { ...updated[index], [field]: value };
    setCylinders(updated);
  };

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
      refNumber,
      reportNumber,
      norm,
      preparedBy,
      requestedBy: sample.clientName,
      placementMode,
      concreteDesignation,
      mixComposition,
      specimenShape,
      curingCondition,
      rectificationMode,
      abramsSlumpCm,
      temperature,
      pressClass,
      sectionalAreaCm2,
      cylinders: updatedCylinders,
      averageMPa: avgMPa,
      averageBar: avgBar,
      ageDays: 28,
      dimensionA: 160,
      dimensionB: 320,
      weightKg: updatedCylinders[0].weightKg,
      crushingForceKN: updatedCylinders[0].crushingForceKN,
      slumpMm: abramsSlumpCm * 10,
      result,
      testDate: todayStr,
      technician: sample.technician,
      standard: norm,
      notes
    });

    const summaryText = t('reports.concreteSummary', {
      age: 28,
      force: updatedCylinders[0].crushingForceKN,
      area: sectionalAreaCm2,
      rc: avgMPa,
      result
    });

    await generatePV(sample.id, summaryText, result);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF8C00] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Modèle Officiel CTC — Normes NA 17004 / NA 16002</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-[#FF8C00]" />
            <span>{t('concrete.title')}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {t('concrete.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('concrete.addBtn')}</span>
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Historique des Essais Béton (Modèle CTC)</h3>
          <span className="text-xs font-mono text-neutral-400">Total: {concreteTests.length} essais</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-start text-xs">
            <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-start">Réf / Rapport</th>
                <th className="px-6 py-3 text-start">{t('concrete.tableCode')}</th>
                <th className="px-6 py-3 text-start">Projet / Désignation</th>
                <th className="px-6 py-3 text-start">Éprouvettes</th>
                <th className="px-6 py-3 text-start font-bold text-white">Moyenne (Bar)</th>
                <th className="px-6 py-3 text-start font-bold text-white">Moyenne (MPa)</th>
                <th className="px-6 py-3 text-start">{t('concrete.tableConclusion')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300 font-mono">
              {concreteTests.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-bold text-white">{t.refNumber || 'B.AK/006'}</td>
                  <td className="px-6 py-3 font-semibold text-[#FF8C00]">{t.sampleCode}</td>
                  <td className="px-6 py-3 font-sans">
                    <div className="font-semibold">{t.projectName}</div>
                    <div className="text-[11px] text-neutral-400">{t.concreteDesignation || t.clientName}</div>
                  </td>
                  <td className="px-6 py-3">{t.specimenShape || 'Cylindrique 16x32'}</td>
                  <td className="px-6 py-3 font-bold text-neutral-200">{t.averageBar || (t.calculatedRcMPa * 10)} Bar</td>
                  <td className="px-6 py-3 font-bold text-base text-[#FF8C00]">{t.averageMPa || t.calculatedRcMPa} MPa</td>
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
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500 font-sans">
                    Aucun essai béton enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New CTC Concrete Test Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#FF8C00]" />
                <span>Nouveau PV Béton — Modèle Officiel CTC (NA 17004 / NA 16002)</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Sample & General Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Échantillon Laboratoire</label>
                  <select
                    value={selectedSampleId}
                    onChange={(e) => setSelectedSampleId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  >
                    {pendingConcreteSamples.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.clientName} ({s.projectName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Réf N°</label>
                  <input
                    type="text"
                    required
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Rapport d'essai N°</label>
                  <input
                    type="text"
                    required
                    value={reportNumber}
                    onChange={(e) => setReportNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Norme</label>
                  <input
                    type="text"
                    required
                    value={norm}
                    onChange={(e) => setNorm(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Confectionné par</label>
                  <input
                    type="text"
                    required
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Effectué à la demande de</label>
                  <input
                    type="text"
                    required
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Mode de mise en place</label>
                  <input
                    type="text"
                    required
                    value={placementMode}
                    onChange={(e) => setPlacementMode(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Désignation Béton / Ouvrage</label>
                  <input
                    type="text"
                    required
                    value={concreteDesignation}
                    onChange={(e) => setConcreteDesignation(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Mix Composition Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#FF8C00]" />
                    Composition du Béton (Mix Design)
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Dosage KG/M3 & Litres/M3</span>
                </div>
                <div className="border border-neutral-700 rounded-lg overflow-hidden">
                  <table className="w-full text-start text-xs font-mono">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase">
                      <tr>
                        <th className="p-2.5 text-start">Matériaux</th>
                        <th className="p-2.5 text-start">Provenance</th>
                        <th className="p-2.5 text-start">Dosage (KG/M3)</th>
                        <th className="p-2.5 text-start">Dosage (Litres/M3)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700 text-neutral-200">
                      {mixComposition.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/40">
                          <td className="p-2 font-semibold font-sans">{row.material}</td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={row.provenance} 
                              onChange={(e) => handleMixChange(idx, 'provenance', e.target.value)}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-full"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" 
                              value={row.dosageKg} 
                              onChange={(e) => handleMixChange(idx, 'dosageKg', Number(e.target.value))}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-28 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" 
                              value={row.dosageLitres} 
                              onChange={(e) => handleMixChange(idx, 'dosageLitres', Number(e.target.value))}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-28 font-mono"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Test Conditions */}
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider">Conditions d'Essai & Éprouvettes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                  <div>
                    <label className="block text-neutral-400 mb-1">Forme & Dimensions</label>
                    <input
                      type="text"
                      value={specimenShape}
                      onChange={(e) => setSpecimenShape(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Conditions Conservation</label>
                    <input
                      type="text"
                      value={curingCondition}
                      onChange={(e) => setCuringCondition(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Mode de rectification</label>
                    <input
                      type="text"
                      value={rectificationMode}
                      onChange={(e) => setRectificationMode(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Affaissement Abrams (cm)</label>
                    <input
                      type="number"
                      value={abramsSlumpCm}
                      onChange={(e) => setAbramsSlumpCm(Number(e.target.value))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Température (°C)</label>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Classe de la presse</label>
                    <input
                      type="text"
                      value={pressClass}
                      onChange={(e) => setPressClass(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-neutral-400 mb-1">Section S (cm²)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sectionalAreaCm2}
                      onChange={(e) => setSectionalAreaCm2(Number(e.target.value))}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white font-mono"
                    />
                    <span className="text-[10px] text-neutral-500">ex: 201.06 cm² pour cylindre 16x32 cm</span>
                  </div>
                </div>
              </div>

              {/* 3 Cylinders Results Table (CRITICAL) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-200 text-xs uppercase tracking-wider">Résultats & Calculs des 3 Éprouvettes</h4>
                  <span className="text-[10px] text-[#FF8C00] font-mono">Formule: MPa = (Force_KN / Section_cm²) * 10 | Bar = MPa * 10</span>
                </div>
                <div className="border border-neutral-700 rounded-lg overflow-x-auto">
                  <table className="w-full min-w-[750px] text-start text-xs font-mono">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase">
                      <tr>
                        <th className="p-2 text-start">Éprouvette</th>
                        <th className="p-2 text-start">Date Coulage</th>
                        <th className="p-2 text-start">Date Essai</th>
                        <th className="p-2 text-start">Âge (j)</th>
                        <th className="p-2 text-start">Poids (kg)</th>
                        <th className="p-2 text-start font-bold text-white">Charge Rupture (KN)</th>
                        <th className="p-2 text-start">Résist. (Bar)</th>
                        <th className="p-2 text-start text-[#FF8C00]">Résist. (MPa)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700 text-neutral-200">
                      {updatedCylinders.map((cyl, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/40">
                          <td className="p-2 font-bold font-sans">Éprouvette #{idx + 1}</td>
                          <td className="p-2">
                            <input 
                              type="date"
                              value={cyl.castingDate}
                              onChange={(e) => handleCylinderChange(idx, 'castingDate', e.target.value)}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="date"
                              value={cyl.testDate}
                              onChange={(e) => handleCylinderChange(idx, 'testDate', e.target.value)}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number"
                              value={cyl.ageDays}
                              onChange={(e) => handleCylinderChange(idx, 'ageDays', Number(e.target.value))}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-16"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number"
                              step="0.010"
                              value={cyl.weightKg}
                              onChange={(e) => handleCylinderChange(idx, 'weightKg', Number(e.target.value))}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-20"
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number"
                              step="0.1"
                              value={cyl.crushingForceKN}
                              onChange={(e) => handleCylinderChange(idx, 'crushingForceKN', Number(e.target.value))}
                              className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white w-24 font-bold text-white"
                            />
                          </td>
                          <td className="p-2 text-neutral-300 font-bold">{cyl.resistanceBar} Bar</td>
                          <td className="p-2 text-[#FF8C00] font-bold">{cyl.resistanceMPa} MPa</td>
                        </tr>
                      ))}
                      {/* Average Row */}
                      <tr className="bg-neutral-900 font-bold text-white">
                        <td colSpan={6} className="p-2.5 text-end uppercase">Moyenne Générale:</td>
                        <td className="p-2.5 text-[#FF8C00]">{avgBar} Bar</td>
                        <td className="p-2.5 text-[#FF8C00] text-sm">{avgMPa} MPa</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Preview */}
              <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-neutral-400 text-[11px]">Seuil de conformité C25/30 (Rc ≥ 25.0 MPa)</p>
                  <p className="text-white font-bold text-sm mt-0.5">Moyenne Obtenue: {avgMPa} MPa ({avgBar} Bar)</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  isConforme ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {isConforme ? '✓ Conforme (Valide CTC)' : '✕ Non Conforme'}
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Observations & Remarques</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium"
                >
                  {t('concrete.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg font-semibold shadow"
                >
                  Enregistrer & Générer le PV CTC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
