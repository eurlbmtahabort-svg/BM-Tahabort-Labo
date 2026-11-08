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
        refNumber: t.ref_number || t.refNumber || 'B.AK/P01/006-07/2026',
        reportNumber: t.report_number || t.reportNumber || '006-07',
        norm: t.norm || 'NA 17004 / NA 16002',
        preparedBy: t.prepared_by || t.preparedBy || 'Laboratoire',
        requestedBy: t.requested_by || t.requestedBy || t.clientName,
        placementMode: t.placement_mode || t.placementMode || 'BÉTONNIÈRE',
        concreteDesignation: t.concrete_designation || t.concreteDesignation || t.projectName,
        mixComposition: typeof t.mix_composition === 'string' ? JSON.parse(t.mix_composition) : (t.mixComposition || [
          { material: 'Gravier 15/25', provenance: 'Carrière', dosageKg: 1050, dosageLitres: 0 },
          { material: 'Gravier 8/15', provenance: 'Carrière', dosageKg: 350, dosageLitres: 0 },
          { material: 'Sable roulé', provenance: 'Oued', dosageKg: 750, dosageLitres: 0 },
          { material: 'Ciment CPJ', provenance: 'Lafarge', dosageKg: 350, dosageLitres: 0 },
          { material: 'Eau de gâchage', provenance: 'Forage', dosageKg: 175, dosageLitres: 175 }
        ]),
        specimenShape: t.specimen_shape || t.specimenShape || 'cylindrique 16 x 32 cm',
        curingCondition: t.curing_condition || t.curingCondition || 'Bassin d’eau',
        rectificationMode: t.rectification_mode || t.rectificationMode || 'Surfaçage au soufre',
        abramsSlumpCm: t.abrams_slump_cm || t.abramsSlumpCm || 8,
        temperature: t.temperature || '20° C +- 2',
        pressClass: t.press_class || t.pressClass || 'A',
        sectionalAreaCm2: t.sectional_area_cm2 || t.sectionalAreaCm2 || 201.06,
        cylinders: typeof t.cylinders === 'string' ? JSON.parse(t.cylinders) : (t.cylinders || []),
        averageMPa: t.average_mpa || t.averageMPa || t.calculated_rc_mpa || 30.0,
        averageBar: t.average_bar || t.averageBar || (t.calculated_rc_mpa ? t.calculated_rc_mpa * 10 : 300),
        calculatedRcMPa: t.calculated_rc_mpa || t.calculatedRcMPa || 30.0,
        ageDays: t.age_days || t.ageDays || 28,
        dimensionA: t.dimension_a || t.dimensionA || 160,
        dimensionB: t.dimension_b || t.dimensionB || 320,
        weightKg: t.weight_kg || t.weightKg || 8.24,
        crushingForceKN: t.crushing_force_kn || t.crushingForceKN || 600,
        slumpMm: t.slump_mm || t.slumpMm || 80,
        result: t.result || 'Conforme',
        testDate: t.test_date || t.testDate || new Date().toISOString().split('T')[0],
        technician: t.technician || 'Rachid M.',
        standard: t.standard || 'NA 17004 / NA 16002',
        notes: t.notes || ''
      }));
    } catch (e) {
      const saved = localStorage.getItem('lt_lims_concrete');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addConcreteTest(test: Omit<ConcreteTest, 'id' | 'calculatedRcMPa'>): Promise<ConcreteTest> {
    const calculatedRcMPa = test.averageMPa || Number(((test.cylinders?.[0]?.crushingForceKN || 600) / test.sectionalAreaCm2 * 10).toFixed(2));
    const newTest: ConcreteTest = { 
      ...test, 
      id: 'ct_' + Date.now(), 
      calculatedRcMPa,
      averageMPa: test.averageMPa || calculatedRcMPa,
      averageBar: test.averageBar || Number((calculatedRcMPa * 10).toFixed(1))
    };
    try {
      await fetch(`${API_BASE}/tests?type=concrete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });
    } catch (e) {}
    // Also save to localStorage fallback
    const existing = JSON.parse(localStorage.getItem('lt_lims_concrete') || '[]');
    localStorage.setItem('lt_lims_concrete', JSON.stringify([newTest, ...existing]));
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
