import React from 'react';
import { useLims } from '../context/LimsContext';
import { 
  TestTube2, 
  Clock, 
  FileCheck, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Box, 
  Layers, 
  Mountain,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { stats, samples, concreteTests, asphaltTests, baseLayerTests, reports } = useLims();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#2D2D2D] to-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FF8000] text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF8000] animate-pulse"></span>
            Laboratoire de Contrôle Qualité — Plateforme LT-LIMS v0.1
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Tableau de Bord Laboratoire
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Suivi en temps réel des essais géotechniques, bétons et enrobés bitumineux conformes aux normes NA & EN.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/samples"
            className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Échantillon</span>
          </Link>
          <Link 
            to="/reports"
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>Émettre un PV</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Échantillons Reçus</span>
            <div className="w-9 h-9 rounded-lg bg-blue-950/80 text-blue-400 flex items-center justify-center">
              <TestTube2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{stats.totalSamples}</span>
            <span className="text-xs text-emerald-400 font-medium">+3 cette semaine</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Essais en Attente</span>
            <div className="w-9 h-9 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{stats.pendingTests}</span>
            <span className="text-xs text-neutral-400">En cours au labo</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">PV Officiels Émis</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{stats.pvsIssued}</span>
            <span className="text-xs text-emerald-400 font-medium">Validés & Signés</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Taux de Conformité</span>
            <div className="w-9 h-9 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{stats.complianceRate}%</span>
            <span className="text-xs text-emerald-400 font-medium">Normes NA & EN</span>
          </div>
        </div>
      </div>

      {/* Material Sections Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Concrete Card */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-900/40 text-blue-400 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Béton & Éprouvettes</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">NA 16002</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Compression uniaxiale, affaissement cône Abrams, cure thermique.
            </p>
            <div className="flex items-center justify-between text-xs py-2 border-t border-neutral-700/60">
              <span className="text-neutral-400">Essais enregistrés:</span>
              <span className="font-mono font-bold text-white">{concreteTests.length}</span>
            </div>
          </div>
          <Link 
            to="/concrete"
            className="mt-4 w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Gérer le Béton</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asphalt Card */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-amber-900/40 text-amber-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Enrobés Bitumineux</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">NA 5031</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Essai Marshall (stabilité, fluage), teneur en liant, vides.
            </p>
            <div className="flex items-center justify-between text-xs py-2 border-t border-neutral-700/60">
              <span className="text-neutral-400">Essais enregistrés:</span>
              <span className="font-mono font-bold text-white">{asphaltTests.length}</span>
            </div>
          </div>
          <Link 
            to="/asphalt"
            className="mt-4 w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Gérer les Enrobés</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Base Layer Card */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-900/40 text-emerald-400 flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Couches de Base (GNT)</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">NA 523</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Proctor Modifié, CBR, équivalent de sable, Los Angeles.
            </p>
            <div className="flex items-center justify-between text-xs py-2 border-t border-neutral-700/60">
              <span className="text-neutral-400">Essais enregistrés:</span>
              <span className="font-mono font-bold text-white">{baseLayerTests.length}</span>
            </div>
          </div>
          <Link 
            to="/base-layer"
            className="mt-4 w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Gérer Couches de Base</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Samples Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-[#FF8C00]" />
            <h3 className="text-sm font-bold text-white">Derniers Échantillons Reçus</h3>
          </div>
          <Link to="/samples" className="text-xs text-[#FF8C00] hover:underline font-medium">
            Voir tout ({samples.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/60 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3">Code Échantillon</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Chantier / Projet</th>
                <th className="px-6 py-3">Matériau</th>
                <th className="px-6 py-3">Date Réception</th>
                <th className="px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300 font-mono">
              {samples.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-semibold text-white">{s.code}</td>
                  <td className="px-6 py-3">{s.clientName}</td>
                  <td className="px-6 py-3 text-neutral-400">{s.projectName}</td>
                  <td className="px-6 py-3 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-sans ${
                      s.materialType === 'concrete' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      s.materialType === 'asphalt' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {s.materialType === 'concrete' ? 'Béton' : s.materialType === 'asphalt' ? 'Enrobé' : 'Grave GNT'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-neutral-400">{s.dateReceived}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans ${
                      s.status === 'validated' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      s.status === 'tested' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {s.status === 'validated' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span className="capitalize">{s.status === 'validated' ? 'Validé (PV)' : s.status === 'tested' ? 'Testé' : 'En Attente'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
