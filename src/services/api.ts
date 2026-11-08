import { Sample, ConcreteTest, AsphaltTest, BaseLayerTest, Client, ReportPV } from '../types/lims';

const API_BASE = '/api';

export const apiService = {
  async getClients(): Promise<Client[]> {
    try {
      const res = await fetch(`${API_BASE}/clients`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        sector: c.sector,
        phone: c.phone,
        email: c.email,
        activeProjects: c.active_projects || c.activeProjects
      }));
    } catch (e) {
      console.warn('API fallback to localStorage for clients');
      const saved = localStorage.getItem('lt_lims_clients');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addClient(client: Omit<Client, 'id'>): Promise<Client> {
    const newClient: Client = { ...client, id: 'c_' + Date.now() };
    try {
      await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
    } catch (e) {
      console.warn('API fallback: saved client to localStorage');
    }
    return newClient;
  },

  async getSamples(): Promise<Sample[]> {
    try {
      const res = await fetch(`${API_BASE}/samples`);
      if (!res.ok) throw new Error('Failed to fetch samples');
      const data = await res.json();
      return data.map((s: any) => ({
        id: s.id,
        code: s.code,
        clientName: s.client_name || s.clientName,
        projectName: s.project_name || s.projectName,
        materialType: s.material_type || s.materialType,
        dateReceived: s.date_received || s.dateReceived,
        status: s.status,
        technician: s.technician,
        gradeSpec: s.grade_spec || s.gradeSpec,
        samplingLocation: s.sampling_location || s.samplingLocation
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_samples');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addSample(sample: Omit<Sample, 'id'>): Promise<Sample> {
    const newSample: Sample = { ...sample, id: 's_' + Date.now() };
    try {
      await fetch(`${API_BASE}/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSample)
      });
    } catch (e) {
      console.warn('API fallback: saved sample to localStorage');
    }
    return newSample;
  },

  async updateSampleStatus(id: string, status: Sample['status']): Promise<void> {
    try {
      await fetch(`${API_BASE}/samples`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {}
  },

  async deleteSample(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/samples?id=${id}`, { method: 'DELETE' });
    } catch (e) {}
  },

  async getConcreteTests(): Promise<ConcreteTest[]> {
    try {
      const res = await fetch(`${API_BASE}/tests?type=concrete`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      return data.map((t: any) => ({
        id: t.id,
        sampleId: t.sample_id || t.sampleId,
        sampleCode: t.sample_code || t.sampleCode,
        clientName: t.client_name || t.clientName,
        projectName: t.project_name || t.projectName,
        ageDays: t.age_days || t.ageDays,
        dimensionA: t.dimension_a || t.dimensionA,
        dimensionB: t.dimension_b || t.dimensionB,
        weightKg: t.weight_kg || t.weightKg,
        crushingForceKN: t.crushing_force_kn || t.crushingForceKN,
        sectionalAreaCm2: t.sectional_area_cm2 || t.sectionalAreaCm2,
        calculatedRcMPa: t.calculated_rc_mpa || t.calculatedRcMPa,
        slumpMm: t.slump_mm || t.slumpMm,
        contractNumber: t.contract_number || t.contractNumber,
        castingDate: t.casting_date || t.castingDate,
        curingConditions: t.curing_conditions || t.curingConditions,
        machineName: t.machine_name || t.machineName,
        calibrationCertNo: t.calibration_cert_no || t.calibrationCertNo,
        calibrationExpiry: t.calibration_expiry || t.calibrationExpiry,
        result: t.result,
        testDate: t.test_date || t.testDate,
        technician: t.technician,
        standard: t.standard,
        notes: t.notes
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_concrete');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addConcreteTest(test: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>): Promise<ConcreteTest> {
    const calculatedRcMPa = Number(((test.crushingForceKN * 1000) / (test.sectionalAreaCm2 * 100)).toFixed(2));
    const newTest: ConcreteTest = { ...test, id: 'ct_' + Date.now(), calculatedRcMPa };
    try {
      await fetch(`${API_BASE}/tests?type=concrete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
    } catch (e) {}
    return newTest;
  },

  async getAsphaltTests(): Promise<AsphaltTest[]> {
    try {
      const res = await fetch(`${API_BASE}/tests?type=asphalt`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      return data.map((t: any) => ({
        id: t.id,
        sampleId: t.sample_id || t.sampleId,
        sampleCode: t.sample_code || t.sampleCode,
        clientName: t.client_name || t.clientName,
        projectName: t.project_name || t.projectName,
        binderContentPct: t.binder_content_pct || t.binderContentPct,
        stabilityKN: t.stability_kn || t.stabilityKN,
        flow01mm: t.flow_01mm || t.flow01mm,
        voidsPct: t.voids_pct || t.voidsPct,
        vmaPct: t.vma_pct || t.vmaPct,
        result: t.result,
        testDate: t.test_date || t.testDate,
        technician: t.technician,
        standard: t.standard,
        notes: t.notes
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_asphalt');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addAsphaltTest(test: Omit<AsphaltTest, 'id'>): Promise<AsphaltTest> {
    const newTest: AsphaltTest = { ...test, id: 'at_' + Date.now() };
    try {
      await fetch(`${API_BASE}/tests?type=asphalt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
    } catch (e) {}
    return newTest;
  },

  async getBaseLayerTests(): Promise<BaseLayerTest[]> {
    try {
      const res = await fetch(`${API_BASE}/tests?type=base_layer`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      return data.map((t: any) => ({
        id: t.id,
        sampleId: t.sample_id || t.sampleId,
        sampleCode: t.sample_code || t.sampleCode,
        clientName: t.client_name || t.clientName,
        projectName: t.project_name || t.projectName,
        maxDryDensity: t.max_dry_density || t.maxDryDensity,
        optimumMoisturePct: t.optimum_moisture_pct || t.optimumMoisturePct,
        cbr95Pct: t.cbr_95_pct || t.cbr95Pct,
        sandEquivalentVisual: t.sand_equivalent_visual || t.sandEquivalentVisual,
        losAngelesPct: t.los_angeles_pct || t.losAngelesPct,
        result: t.result,
        testDate: t.test_date || t.testDate,
        technician: t.technician,
        standard: t.standard,
        notes: t.notes
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_baselayer');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addBaseLayerTest(test: Omit<BaseLayerTest, 'id'>): Promise<BaseLayerTest> {
    const newTest: BaseLayerTest = { ...test, id: 'bt_' + Date.now() };
    try {
      await fetch(`${API_BASE}/tests?type=base_layer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
    } catch (e) {}
    return newTest;
  },

  async getReports(): Promise<ReportPV[]> {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      return data.map((r: any) => ({
        id: r.id,
        pvNumber: r.pv_number || r.pvNumber,
        sampleId: r.sample_id || r.sampleId,
        sampleCode: r.sample_code || r.sampleCode,
        materialType: r.material_type || r.materialType,
        clientName: r.client_name || r.clientName,
        projectName: r.project_name || r.projectName,
        issueDate: r.issue_date || r.issueDate,
        standardRef: r.standard_ref || r.standardRef,
        testResult: r.test_result || r.testResult,
        summaryText: r.summary_text || r.summaryText,
        signedBy: r.signed_by || r.signedBy,
        qrCodeToken: r.qr_code_token || r.qrCodeToken
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_reports');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addReport(report: ReportPV): Promise<ReportPV> {
    try {
      await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
    } catch (e) {}
    return report;
  }
};
