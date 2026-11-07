import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Sample, 
  ConcreteTest, 
  AsphaltTest, 
  BaseLayerTest, 
  Client, 
  ReportPV, 
  ComplianceResult, 
  MaterialType 
} from '../types/lims';

interface LimsContextType {
  samples: Sample[];
  concreteTests: ConcreteTest[];
  asphaltTests: AsphaltTest[];
  baseLayerTests: BaseLayerTest[];
  clients: Client[];
  reports: ReportPV[];
  
  // Add actions
  addSample: (sample: Omit<Sample, 'id'>) => Sample;
  updateSampleStatus: (id: string, status: Sample['status']) => void;
  deleteSample: (id: string) => void;
  
  addConcreteTest: (test: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>) => ConcreteTest;
  addAsphaltTest: (test: Omit<AsphaltTest, 'id'>) => AsphaltTest;
  addBaseLayerTest: (test: Omit<BaseLayerTest, 'id'>) => BaseLayerTest;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  generatePV: (sampleId: string, testSummary: string, result: ComplianceResult) => ReportPV;
  
  // Stats
  stats: {
    totalSamples: number;
    pendingTests: number;
    pvsIssued: number;
    complianceRate: number;
  };
}

const initialClients: Client[] = [
  { id: 'c1', name: 'M. Karim Boudiaf', company: 'COSIDER TP', sector: 'Public (DTP / Sonatrach)', phone: '+213 34 21 44 55', email: 'k.boudiaf@cosider-tp.dz', activeProjects: 4 },
  { id: 'c2', name: 'Ing. Amina Meziane', company: 'Direction des Travaux Publics (DTP Béjaïa)', sector: 'Public (DTP / Sonatrach)', phone: '+213 34 82 10 09', email: 'contact@dtp-bejaia.dz', activeProjects: 2 },
  { id: 'c3', name: 'M. Sofiane Khelifi', company: 'SARL Batiment Tahabort', sector: 'Privé (BTP)', phone: '+213 550 12 34 56', email: 's.khelifi@tahabort-tp.dz', activeProjects: 3 },
  { id: 'c4', name: 'Bureau d’Études CEREAM', company: 'CEREAM Algérie', sector: 'Architecte / Bureau d\'études', phone: '+213 21 68 90 11', email: 'etudes@ceream.dz', activeProjects: 5 },
];

const initialSamples: Sample[] = [
  { id: 's1', code: 'BET-2026-041', clientName: 'COSIDER TP', projectName: 'RN 9 - Rectification des Virages Tichy', materialType: 'concrete', dateReceived: '2026-11-01', status: 'tested', technician: 'Rachid M.', gradeSpec: 'C25/30', samplingLocation: 'Pk 14+200 Ouvrage OA3' },
  { id: 's2', code: 'ENR-2026-018', clientName: 'Direction des Travaux Publics (DTP Béjaïa)', projectName: 'Double Voie Route du Port', materialType: 'asphalt', dateReceived: '2026-11-03', status: 'tested', technician: 'Lina B.', gradeSpec: 'BBSG 0/14 Couche de Roulement', samplingLocation: 'Tronçon Nord - Ligne 2' },
  { id: 's3', code: 'BAS-2026-012', clientName: 'SARL Batiment Tahabort', projectName: 'Lotissement Résidentiel Les Oliviers', materialType: 'base_layer', dateReceived: '2026-11-04', status: 'pending', technician: 'Samir K.', gradeSpec: 'GNT B 0/31.5', samplingLocation: 'Plateforme Bâtiment F' },
  { id: 's4', code: 'BET-2026-042', clientName: 'SARL Batiment Tahabort', projectName: 'Lotissement Résidentiel Les Oliviers', materialType: 'concrete', dateReceived: '2026-11-05', status: 'pending', technician: 'Rachid M.', gradeSpec: 'C30/37', samplingLocation: 'Fondations Semelle S4' },
];

const initialConcreteTests: ConcreteTest[] = [
  {
    id: 'ct1',
    sampleId: 's1',
    sampleCode: 'BET-2026-041',
    clientName: 'COSIDER TP',
    projectName: 'RN 9 - Rectification des Virages Tichy',
    ageDays: 28,
    dimensionA: 150,
    dimensionB: 150,
    weightKg: 8.240,
    crushingForceKN: 675.0,
    sectionalAreaCm2: 225, // 15cm x 15cm
    calculatedRcMPa: 30.0, // 675 / 225 * 10? Wait: 675 kN = 675,000 N. Area = 225 cm² = 22,500 mm². Rc = 675,000 / 22,500 = 30.0 MPa
    slumpMm: 85,
    result: 'Conforme',
    testDate: '2026-11-05',
    technician: 'Rachid M.',
    standard: 'NA 16002 / EN 12390-3',
    notes: 'Éprouvettes cylindriques conservées en bassin thermo-régulé à 20°C ± 2°C.'
  }
];

const initialAsphaltTests: AsphaltTest[] = [
  {
    id: 'at1',
    sampleId: 's2',
    sampleCode: 'ENR-2026-018',
    clientName: 'Direction des Travaux Publics (DTP Béjaïa)',
    projectName: 'Double Voie Route du Port',
    binderContentPct: 5.4,
    stabilityKN: 11.8,
    flow01mm: 32,
    voidsPct: 4.2,
    vmaPct: 15.6,
    result: 'Conforme',
    testDate: '2026-11-05',
    technician: 'Lina B.',
    standard: 'NA 5031 / EN 12697-34',
    notes: 'Essai Marshall réalisé sur 3 briquettes compactées à 75 coups par face.'
  }
];

const initialBaseLayerTests: BaseLayerTest[] = [
  {
    id: 'bt1',
    sampleId: 's3',
    sampleCode: 'BAS-2026-012',
    clientName: 'SARL Batiment Tahabort',
    projectName: 'Lotissement Résidentiel Les Oliviers',
    maxDryDensity: 2.24,
    optimumMoisturePct: 5.8,
    cbr95Pct: 48.0,
    sandEquivalentVisual: 76.5,
    losAngelesPct: 24.2,
    result: 'Conforme',
    testDate: '2026-11-06',
    technician: 'Samir K.',
    standard: 'NA 523 / NA 520 / NA 521',
    notes: 'Grave non traitée GNT type B. Indice Los Angeles conforme aux exigences routières.'
  }
];

const initialReports: ReportPV[] = [
  {
    id: 'pv1',
    pvNumber: 'PV-LT-2026-089',
    sampleId: 's1',
    sampleCode: 'BET-2026-041',
    materialType: 'concrete',
    clientName: 'COSIDER TP',
    projectName: 'RN 9 - Rectification des Virages Tichy',
    issueDate: '2026-11-05',
    standardRef: 'NA 16002 / EN 12390-3',
    testResult: 'Conforme',
    summaryText: 'Résistance caractéristique à la compression à 28 jours Rc = 30.0 MPa supérieure à la spécification C25/30 (fck ≥ 25 MPa).',
    signedBy: 'Dr. M. Tahabort (Directeur du Laboratoire)',
    qrCodeToken: 'LT-VERIFY-2026-089-BET41'
  },
  {
    id: 'pv2',
    pvNumber: 'PV-LT-2026-090',
    sampleId: 's2',
    sampleCode: 'ENR-2026-018',
    materialType: 'asphalt',
    clientName: 'Direction des Travaux Publics (DTP Béjaïa)',
    projectName: 'Double Voie Route du Port',
    issueDate: '2026-11-05',
    standardRef: 'NA 5031 / EN 12697-34',
    testResult: 'Conforme',
    summaryText: 'Stabilité Marshall = 11.8 kN (≥ 7.5 kN requis), Fluage = 3.2 mm, Teneur en liant = 5.4%. Enrobé BBSG 0/14 conforme.',
    signedBy: 'Ing. H. Belkacem (Responsable Enrobés)',
    qrCodeToken: 'LT-VERIFY-2026-090-ENR18'
  }
];

const LimsContext = createContext<LimsContextType | undefined>(undefined);

export const LimsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [samples, setSamples] = useState<Sample[]>(() => {
    const saved = localStorage.getItem('lt_lims_samples');
    return saved ? JSON.parse(saved) : initialSamples;
  });

  const [concreteTests, setConcreteTests] = useState<ConcreteTest[]>(() => {
    const saved = localStorage.getItem('lt_lims_concrete');
    return saved ? JSON.parse(saved) : initialConcreteTests;
  });

  const [asphaltTests, setAsphaltTests] = useState<AsphaltTest[]>(() => {
    const saved = localStorage.getItem('lt_lims_asphalt');
    return saved ? JSON.parse(saved) : initialAsphaltTests;
  });

  const [baseLayerTests, setBaseLayerTests] = useState<BaseLayerTest[]>(() => {
    const saved = localStorage.getItem('lt_lims_baselayer');
    return saved ? JSON.parse(saved) : initialBaseLayerTests;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('lt_lims_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [reports, setReports] = useState<ReportPV[]>(() => {
    const saved = localStorage.getItem('lt_lims_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  useEffect(() => {
    localStorage.setItem('lt_lims_samples', JSON.stringify(samples));
  }, [samples]);

  useEffect(() => {
    localStorage.setItem('lt_lims_concrete', JSON.stringify(concreteTests));
  }, [concreteTests]);

  useEffect(() => {
    localStorage.setItem('lt_lims_asphalt', JSON.stringify(asphaltTests));
  }, [asphaltTests]);

  useEffect(() => {
    localStorage.setItem('lt_lims_baselayer', JSON.stringify(baseLayerTests));
  }, [baseLayerTests]);

  useEffect(() => {
    localStorage.setItem('lt_lims_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('lt_lims_reports', JSON.stringify(reports));
  }, [reports]);

  const addSample = (sampleData: Omit<Sample, 'id'>): Sample => {
    const newSample: Sample = {
      ...sampleData,
      id: 's_' + Date.now()
    };
    setSamples([newSample, ...samples]);
    return newSample;
  };

  const updateSampleStatus = (id: string, status: Sample['status']) => {
    setSamples(samples.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteSample = (id: string) => {
    setSamples(samples.filter(s => s.id !== id));
  };

  const addConcreteTest = (testData: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>): ConcreteTest => {
    // Area in cm², force in kN. Rc in MPa = (Force (kN) * 1000) / (Area (cm²) * 100) = Force / Area * 10? Wait.
    // Let's verify formula: 1 MPa = 1 N/mm² = 100 N/cm².
    // If Area is in cm² (e.g. 225 cm²), Area in mm² is 22,500 mm².
    // Force in N = Force (kN) * 1000.
    // Rc (MPa) = (Force * 1000) / (Area_cm2 * 100) = (Force / Area_cm2) * 10.
    // E.g. For 15x15 cylinder (225 cm²), Force = 675 kN -> 675000 / 22500 = 30.0 MPa. Correct!
    const calculatedRcMPa = Number(((testData.crushingForceKN * 1000) / (testData.sectionalAreaCm2 * 100)).toFixed(2));
    
    const newTest: ConcreteTest = {
      ...testData,
      id: 'ct_' + Date.now(),
      calculatedRcMPa
    };
    setConcreteTests([newTest, ...concreteTests]);
    updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addAsphaltTest = (testData: Omit<AsphaltTest, 'id'>): AsphaltTest => {
    const newTest: AsphaltTest = {
      ...testData,
      id: 'at_' + Date.now()
    };
    setAsphaltTests([newTest, ...asphaltTests]);
    updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addBaseLayerTest = (testData: Omit<BaseLayerTest, 'id'>): BaseLayerTest => {
    const newTest: BaseLayerTest = {
      ...testData,
      id: 'bt_' + Date.now()
    };
    setBaseLayerTests([newTest, ...baseLayerTests]);
    updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: 'c_' + Date.now()
    };
    setClients([...clients, newClient]);
  };

  const generatePV = (sampleId: string, testSummary: string, result: ComplianceResult): ReportPV => {
    const sample = samples.find(s => s.id === sampleId);
    const pvNumber = `PV-LT-2026-${String(reports.length + 88).padStart(3, '0')}`;
    const newReport: ReportPV = {
      id: 'pv_' + Date.now(),
      pvNumber,
      sampleId,
      sampleCode: sample ? sample.code : 'UNKNOWN',
      materialType: sample ? sample.materialType : 'concrete',
      clientName: sample ? sample.clientName : 'Client Général',
      projectName: sample ? sample.projectName : 'Projet Travaux Publics',
      issueDate: new Date().toISOString().split('T')[0],
      standardRef: sample?.materialType === 'concrete' ? 'NA 16002 / EN 12390-3' : sample?.materialType === 'asphalt' ? 'NA 5031 / EN 12697-34' : 'NA 523 / NA 520',
      testResult: result,
      summaryText: testSummary,
      signedBy: 'Dr. M. Tahabort (Directeur du Laboratoire)',
      qrCodeToken: `LT-VERIFY-${Date.now()}`
    };
    setReports([newReport, ...reports]);
    if (sample) {
      updateSampleStatus(sampleId, 'validated');
    }
    return newReport;
  };

  const stats = {
    totalSamples: samples.length,
    pendingTests: samples.filter(s => s.status === 'pending').length,
    pvsIssued: reports.length,
    complianceRate: 94.5
  };

  return (
    <LimsContext.Provider value={{
      samples,
      concreteTests,
      asphaltTests,
      baseLayerTests,
      clients,
      reports,
      addSample,
      updateSampleStatus,
      deleteSample,
      addConcreteTest,
      addAsphaltTest,
      addBaseLayerTest,
      addClient,
      generatePV,
      stats
    }}>
      {children}
    </LimsContext.Provider>
  );
};

export const useLims = () => {
  const context = useContext(LimsContext);
  if (!context) {
    throw new Error('useLims must be used within a LimsProvider');
  }
  return context;
};
