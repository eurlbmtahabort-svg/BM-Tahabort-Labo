import React from 'react';
import { BookOpen, ShieldCheck, FileCheck } from 'lucide-react';

export const StandardsModule: React.FC = () => {
  const standardsList = [
    { code: 'NA 16002', title: 'Essai de compression sur éprouvettes de béton durci', category: 'Béton', equiv: 'EN 12390-3', description: 'Détermination de la résistance caractéristique à la compression à 7 et 28 jours.' },
    { code: 'NA 5022', title: 'Béton frais - Essai d’affaissement (Cône d’Abrams)', category: 'Béton', equiv: 'EN 12350-2', description: 'Mesure de l’ouvrabilité et de la consistance du béton sur chantier.' },
    { code: 'NA 5031', title: 'Enrobés bitumineux - Essai Marshall (Stabilité & Fluage)', category: 'Enrobés', equiv: 'EN 12697-34', description: 'Détermination de la stabilité et du fluage des mélanges hydrocarbonés chauds.' },
    { code: 'NA 523', title: 'Sols - Essai Proctor Modifié', category: 'Géotechnique / GNT', equiv: 'NF P 94-093', description: 'Détermination de la densité sèche maximale et de la teneur en eau optimum.' },
    { code: 'NA 522', title: 'Indice Portant Californien (CBR) après immersion', category: 'Géotechnique / GNT', equiv: 'NF P 94-078', description: 'Évaluation de la portance des sols et des couches de fondation/base.' },
    { code: 'NA 520', title: 'Équivalent de sable des sols et granulons (ES)', category: 'Granulats', equiv: 'EN 933-8', description: 'Détermination de la propreté des sables et des fines non plastiques.' },
    { code: 'NA 521', title: 'Essai de résistance à la fragmentation (Los Angeles - LA)', category: 'Granulats', equiv: 'EN 1097-2', description: 'Mesure de la résistance à l’usure et aux chocs des granulats pour chaussées.' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#FF8000]" />
            <span>Référentiel des Normes (NA & EN)</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Bibliothèque officielle des normes algériennes (IANOR) et équivalences européennes appliquées au Laboratoire Tahabort.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-[#FF8000]" />
          <span>Accréditation ISO/IEC 17025</span>
        </div>
      </div>

      {/* Standards Table */}
      <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-neutral-700">
              <tr>
                <th className="px-6 py-3">Norme Algérienne (NA)</th>
                <th className="px-6 py-3">Intitulé de l'Essai</th>
                <th className="px-6 py-3">Domaine / Catégorie</th>
                <th className="px-6 py-3">Équivalence Européenne</th>
                <th className="px-6 py-3">Description Technique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/60 text-neutral-300">
              {standardsList.map((st) => (
                <tr key={st.code} className="hover:bg-neutral-700/40 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-white">{st.code}</td>
                  <td className="px-6 py-3 font-semibold text-neutral-100">{st.title}</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-sans bg-neutral-900 text-neutral-300 border border-neutral-700">
                      {st.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-neutral-400">{st.equiv}</td>
                  <td className="px-6 py-3 text-neutral-400 font-sans">{st.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
