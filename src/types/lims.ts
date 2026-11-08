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

export interface MixComponent {
  material: string;
  provenance: string;
  dosageKg: number;
  dosageLitres: number;
}

export interface CylinderResult {
  castingDate: string;
  testDate: string;
  ageDays: number;
  weightKg: number;
  crushingForceKN: number;
  resistanceMPa: number;
  resistanceBar: number;
}

export interface ConcreteTest {
  id: string;
  sampleId: string;
  sampleCode: string;
  clientName: string;
  projectName: string;
  refNumber: string; // e.g. "B.AK/P01/006-07/2026"
  reportNumber: string; // e.g. "006-07"
  norm: string; // e.g. "NA 17004 / NA 16002"
  preparedBy: string; // e.g. "Laboratoire"
  requestedBy: string; // e.g. "ETB/TCE BERADI ABDELKADAR"
  placementMode: string; // e.g. "BÉTONNIÈRE"
  concreteDesignation: string; // e.g. "PLANCHER RDC + ESCALIER 2ÈME VOLÉE"
  
  mixComposition: MixComponent[];
  
  specimenShape: string; // e.g. "cylindrique 16 x 32 cm"
  curingCondition: string; // e.g. "Bassin d’eau"
  rectificationMode: string; // e.g. "Surfaçage au soufre"
  abramsSlumpCm: number; // e.g. 8
  temperature: string; // e.g. "20° C +- 2"
  pressClass: string; // e.g. "A"
  sectionalAreaCm2: number; // e.g. 201.06
  
  cylinders: CylinderResult[]; // 3 cylinders
  averageMPa: number;
  averageBar: number;
  calculatedRcMPa: number; // for backward compatibility
  ageDays: number;
  dimensionA?: number;
  dimensionB?: number;
  weightKg?: number;
  crushingForceKN?: number;
  slumpMm?: number;
  
  result: ComplianceResult;
  testDate: string;
  technician: string;
  standard: string;
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
