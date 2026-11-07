import React, { useState } from 'react';
import { useLims } from '../context/LimsContext';
import { Users, Plus, Building2, Phone, Mail, FolderKanban } from 'lucide-react';

export const ClientsModule: React.FC = () => {
  const { clients, addClient } = useLims();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState<'Public (DTP / Sonatrach)' | 'Privé (BTP)' | 'Architecte / Bureau d\'études'>('Privé (BTP)');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name,
      company,
      sector,
      phone,
      email,
      activeProjects: 1
    });
    setShowModal(false);
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#FF8C00]" />
            <span>Gestion des Clients & Partenaires BTP</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Répertoire des maîtres d'ouvrage, entreprises de réalisation et bureaux d'études partenaires de Labo Tahabort.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF8C00] hover:bg-[#e07b00] text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Client</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c) => (
          <div key={c.id} className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#FF8C00] font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-900 text-neutral-300 border border-neutral-700">
                  {c.sector}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{c.company}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Contact: {c.name}</p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-mono">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-mono text-neutral-400">{c.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-700/80 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-[#FF8C00]" />
                Chantiers actifs:
              </span>
              <span className="font-mono font-bold text-white bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-700">
                {c.activeProjects} Projets
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <h3 className="text-base font-bold text-white">Ajouter un Client / Maître d'Ouvrage</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nom de l'Entreprise / Organisme</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ex: ETRHB Tahar, Sonatrach, DTP..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Nom du Représentant</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: M. Ahmed Benali"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Secteur</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Public (DTP / Sonatrach)">Public (DTP / Sonatrach)</option>
                    <option value="Privé (BTP)">Privé (BTP)</option>
                    <option value="Architecte / Bureau d'études">Architecte / Bureau d'études</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 ..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@entreprise.dz"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
