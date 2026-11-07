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
import { apiService } from '../services/api';

interface LimsContextType {
  samples: Sample[];
  concreteTests: ConcreteTest[];
  asphaltTests: AsphaltTest[];
  baseLayerTests: BaseLayerTest[];
  clients: Client[];
  reports: ReportPV[];
  loading: boolean;
  
  // Actions
  addSample: (sample: Omit<Sample, 'id'>) => Promise<Sample>;
  updateSampleStatus: (id: string, status: Sample['status']) => Promise<void>;
  deleteSample: (id: string) => Promise<void>;
  
  addConcreteTest: (test: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>) => Promise<ConcreteTest>;
  addAsphaltTest: (test: Omit<AsphaltTest, 'id'>) => Promise<AsphaltTest>;
  addBaseLayerTest: (test: Omit<BaseLayerTest, 'id'>) => Promise<BaseLayerTest>;
  
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  generatePV: (sampleId: string, testSummary: string, result: ComplianceResult) => Promise<ReportPV>;
  
  stats: {
    totalSamples: number;
    pendingTests: number;
    pvsIssued: number;
    complianceRate: number;
  };
}

const LimsContext = createContext<LimsContextType | undefined>(undefined);

export const LimsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [concreteTests, setConcreteTests] = useState<ConcreteTest[]>([]);
  const [asphaltTests, setAsphaltTests] = useState<AsphaltTest[]>([]);
  const [baseLayerTests, setBaseLayerTests] = useState<BaseLayerTest[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<ReportPV[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from apiService (Cloudflare D1 or fallback)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cData, sData, ctData, atData, btData, rData] = await Promise.all([
          apiService.getClients(),
          apiService.getSamples(),
          apiService.getConcreteTests(),
          apiService.getAsphaltTests(),
          apiService.getBaseLayerTests(),
          apiService.getReports()
        ]);
        setClients(cData);
        setSamples(sData);
        setConcreteTests(ctData);
        setAsphaltTests(atData);
        setBaseLayerTests(btData);
        setReports(rData);
      } catch (err) {
        console.error('Error loading LIMS data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const addSample = async (sampleData: Omit<Sample, 'id'>): Promise<Sample> => {
    const newSample = await apiService.addSample(sampleData);
    setSamples(prev => [newSample, ...prev]);
    return newSample;
  };

  const updateSampleStatus = async (id: string, status: Sample['status']) => {
    await apiService.updateSampleStatus(id, status);
    setSamples(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteSample = async (id: string) => {
    await apiService.deleteSample(id);
    setSamples(prev => prev.filter(s => s.id !== id));
  };

  const addConcreteTest = async (testData: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>): Promise<ConcreteTest> => {
    const newTest = await apiService.addConcreteTest(testData);
    setConcreteTests(prev => [newTest, ...prev]);
    await updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addAsphaltTest = async (testData: Omit<AsphaltTest, 'id'>): Promise<AsphaltTest> => {
    const newTest = await apiService.addAsphaltTest(testData);
    setAsphaltTests(prev => [newTest, ...prev]);
    await updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addBaseLayerTest = async (testData: Omit<BaseLayerTest, 'id'>): Promise<BaseLayerTest> => {
    const newTest = await apiService.addBaseLayerTest(testData);
    setBaseLayerTests(prev => [newTest, ...prev]);
    await updateSampleStatus(testData.sampleId, 'tested');
    return newTest;
  };

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    const newClient = await apiService.addClient(clientData);
    setClients(prev => [...prev, newClient]);
  };

  const generatePV = async (sampleId: string, testSummary: string, result: ComplianceResult): Promise<ReportPV> => {
    const sample = samples.find(s => s.id === sampleId);
    const pvNumber = `PV-LT-2026-${String(reports.length + 91).padStart(3, '0')}`;
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

    await apiService.addReport(newReport);
    setReports(prev => [newReport, ...prev]);
    if (sample) {
      await updateSampleStatus(sampleId, 'validated');
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
      loading,
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
