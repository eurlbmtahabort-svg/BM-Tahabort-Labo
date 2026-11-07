export type MaterialType = 'concrete' | 'asphalt' | 'base_layer';

export type TestStatus = 'pending' | 'tested' | 'validated';

export type ComplianceResult = 'Conforme' | 'Non Conforme' | 'En attente';

export interface Sample {
  id: string;
  code: string; // e.g., "BET-2026-041"
  clientName: string;
  projectName: string;
  materialType: MaterialType;
  dateReceived: string;
  status: TestStatus;
  technician: string;
  gradeSpec: string; // e.g., "C25/30", "BBSG 0/14", "GCA 0/31.5"
  samplingLocation: string;
}

export interface ConcreteTest {
  id: string;
  sampleId: string;
  sampleCode: string;
  clientName: string;
  projectName: string;
  ageDays: number; // e.g. 7 or 28
  dimensionA: number; // mm (e.g. 150)
  dimensionB: number; // mm (e.g. 150)
  weightKg: number;
  crushingForceKN: number; // kN
  sectionalAreaCm2: number; // cm²
  calculatedRcMPa: number; // MPa = (Force * 1000) / (Area * 100) -> Force / Area (since 1 kN = 1000 N, Area in cm² = 100 mm², so Rc = Force / Area)
  slumpMm: number; // mm (Abrams cone)
  result: ComplianceResult;
  testDate: string;
  technician: string;
  standard: string; // e.g. "NA 16002 / EN 12390-3"
  notes: string;
}

export interface AsphaltTest {
  id: string;
  sampleId: string;
  sampleCode: string;
  clientName: string;
  projectName: string;
  binderContentPct: number; // % bitumen
  stabilityKN: number; // kN (Marshall)
  flow01mm: number; // 0.1 mm
  voidsPct: number; // % voids (V% )
  vmaPct: number; // VMA %
  result: ComplianceResult;
  testDate: string;
  technician: string;
  standard: string; // e.g. "NA 5031 / EN 12697-34"
  notes: string;
}

export interface BaseLayerTest {
  id: string;
  sampleId: string;
  sampleCode: string;
  clientName: string;
  projectName: string;
  maxDryDensity: number; // t/m³ (Proctor Modified)
  optimumMoisturePct: number; // %
  cbr95Pct: number; // CBR at 95% OMD
  sandEquivalentVisual: number; // ESV %
  losAngelesPct: number; // LA %
  result: ComplianceResult;
  testDate: string;
  technician: string;
  standard: string; // e.g. "NA 523 / NA 520 / NA 521"
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  sector: 'Public (DTP / Sonatrach)' | 'Privé (BTP)' | 'Architecte / Bureau d\'études';
  phone: string;
  email: string;
  activeProjects: number;
}

export interface ReportPV {
  id: string;
  pvNumber: string; // e.g., "PV-LT-2026-089"
  sampleId: string;
  sampleCode: string;
  materialType: MaterialType;
  clientName: string;
  projectName: string;
  issueDate: string;
  standardRef: string;
  testResult: ComplianceResult;
  summaryText: string;
  signedBy: string;
  qrCodeToken: string;
}
