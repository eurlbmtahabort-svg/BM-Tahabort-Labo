-- Cloudflare D1 SQL Schema for Labo Tahabort (LT-LIMS)

DROP TABLE IF EXISTS reports_pvs;
DROP TABLE IF EXISTS base_layer_tests;
DROP TABLE IF EXISTS asphalt_tests;
DROP TABLE IF EXISTS concrete_tests;
DROP TABLE IF EXISTS samples;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  sector TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  active_projects INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE samples (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  material_type TEXT NOT NULL, -- 'concrete' | 'asphalt' | 'base_layer'
  date_received TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending' | 'tested' | 'validated'
  technician TEXT NOT NULL,
  grade_spec TEXT NOT NULL,
  sampling_location TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concrete_tests (
  id TEXT PRIMARY KEY,
  sample_id TEXT NOT NULL,
  sample_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  age_days INTEGER NOT NULL,
  dimension_a REAL NOT NULL,
  dimension_b REAL NOT NULL,
  weight_kg REAL NOT NULL,
  crushing_force_kn REAL NOT NULL,
  sectional_area_cm2 REAL NOT NULL,
  calculated_rc_mpa REAL NOT NULL,
  slump_mm REAL NOT NULL,
  result TEXT NOT NULL,
  test_date TEXT NOT NULL,
  technician TEXT NOT NULL,
  standard TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE
);

CREATE TABLE asphalt_tests (
  id TEXT PRIMARY KEY,
  sample_id TEXT NOT NULL,
  sample_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  binder_content_pct REAL NOT NULL,
  stability_kn REAL NOT NULL,
  flow_01mm REAL NOT NULL,
  voids_pct REAL NOT NULL,
  vma_pct REAL NOT NULL,
  result TEXT NOT NULL,
  test_date TEXT NOT NULL,
  technician TEXT NOT NULL,
  standard TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE
);

CREATE TABLE base_layer_tests (
  id TEXT PRIMARY KEY,
  sample_id TEXT NOT NULL,
  sample_code TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  max_dry_density REAL NOT NULL,
  optimum_moisture_pct REAL NOT NULL,
  cbr_95_pct REAL NOT NULL,
  sand_equivalent_visual REAL NOT NULL,
  los_angeles_pct REAL NOT NULL,
  result TEXT NOT NULL,
  test_date TEXT NOT NULL,
  technician TEXT NOT NULL,
  standard TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE
);

CREATE TABLE reports_pvs (
  id TEXT PRIMARY KEY,
  pv_number TEXT UNIQUE NOT NULL,
  sample_id TEXT NOT NULL,
  sample_code TEXT NOT NULL,
  material_type TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  standard_ref TEXT NOT NULL,
  test_result TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  signed_by TEXT NOT NULL,
  qr_code_token TEXT NOT NULL,
  FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE
);

-- Seed initial data for testing
INSERT INTO clients (id, name, company, sector, phone, email, active_projects) VALUES
('c1', 'M. Karim Boudiaf', 'COSIDER TP', 'Public (DTP / Sonatrach)', '+213 34 21 44 55', 'k.boudiaf@cosider-tp.dz', 4),
('c2', 'Ing. Amina Meziane', 'Direction des Travaux Publics (DTP Béjaïa)', 'Public (DTP / Sonatrach)', '+213 34 82 10 09', 'contact@dtp-bejaia.dz', 2),
('c3', 'M. Sofiane Khelifi', 'SARL Batiment Tahabort', 'Privé (BTP)', '+213 550 12 34 56', 's.khelifi@tahabort-tp.dz', 3),
('c4', 'Bureau d’Études CEREAM', 'CEREAM Algérie', 'Architecte / Bureau d\'études', '+213 21 68 90 11', 'etudes@ceream.dz', 5);

INSERT INTO samples (id, code, client_name, project_name, material_type, date_received, status, technician, grade_spec, sampling_location) VALUES
('s1', 'BET-2026-041', 'COSIDER TP', 'RN 9 - Rectification des Virages Tichy', 'concrete', '2026-11-01', 'tested', 'Rachid M.', 'C25/30', 'Pk 14+200 Ouvrage OA3'),
('s2', 'ENR-2026-018', 'Direction des Travaux Publics (DTP Béjaïa)', 'Double Voie Route du Port', 'asphalt', '2026-11-03', 'tested', 'Lina B.', 'BBSG 0/14 Couche de Roulement', 'Tronçon Nord - Ligne 2'),
('s3', 'BAS-2026-012', 'SARL Batiment Tahabort', 'Lotissement Résidentiel Les Oliviers', 'base_layer', '2026-11-04', 'pending', 'Samir K.', 'GNT B 0/31.5', 'Plateforme Bâtiment F'),
('s4', 'BET-2026-042', 'SARL Batiment Tahabort', 'Lotissement Résidentiel Les Oliviers', 'concrete', '2026-11-05', 'pending', 'Rachid M.', 'C30/37', 'Fondations Semelle S4');

INSERT INTO concrete_tests (id, sample_id, sample_code, client_name, project_name, age_days, dimension_a, dimension_b, weight_kg, crushing_force_kn, sectional_area_cm2, calculated_rc_mpa, slump_mm, result, test_date, technician, standard, notes) VALUES
('ct1', 's1', 'BET-2026-041', 'COSIDER TP', 'RN 9 - Rectification des Virages Tichy', 28, 150, 150, 8.240, 675.0, 225, 30.0, 85, 'Conforme', '2026-11-05', 'Rachid M.', 'NA 16002 / EN 12390-3', 'Éprouvettes cylindriques conservées en bassin thermo-régulé à 20°C.');

INSERT INTO asphalt_tests (id, sample_id, sample_code, client_name, project_name, binder_content_pct, stability_kn, flow_01mm, voids_pct, vma_pct, result, test_date, technician, standard, notes) VALUES
('at1', 's2', 'ENR-2026-018', 'Direction des Travaux Publics (DTP Béjaïa)', 'Double Voie Route du Port', 5.4, 11.8, 32, 4.2, 15.6, 'Conforme', '2026-11-05', 'Lina B.', 'NA 5031 / EN 12697-34', 'Essai Marshall réalisé sur 3 briquettes compactées à 75 coups par face.');

INSERT INTO base_layer_tests (id, sample_id, sample_code, client_name, project_name, max_dry_density, optimum_moisture_pct, cbr_95_pct, sand_equivalent_visual, los_angeles_pct, result, test_date, technician, standard, notes) VALUES
('bt1', 's3', 'BAS-2026-012', 'SARL Batiment Tahabort', 'Lotissement Résidentiel Les Oliviers', 2.24, 5.8, 48.0, 76.5, 24.2, 'Conforme', '2026-11-06', 'Samir K.', 'NA 523 / NA 520 / NA 521', 'Grave non traitée GNT type B. Indice Los Angeles conforme.');

INSERT INTO reports_pvs (id, pv_number, sample_id, sample_code, material_type, client_name, project_name, issue_date, standard_ref, test_result, summary_text, signed_by, qr_code_token) VALUES
('pv1', 'PV-LT-2026-089', 's1', 'BET-2026-041', 'concrete', 'COSIDER TP', 'RN 9 - Rectification des Virages Tichy', '2026-11-05', 'NA 16002 / EN 12390-3', 'Conforme', 'Résistance caractéristique à la compression à 28 jours Rc = 30.0 MPa supérieure à la spécification C25/30.', 'Dr. M. Tahabort (Directeur du Laboratoire)', 'LT-VERIFY-2026-089-BET41'),
('pv2', 'PV-LT-2026-090', 's2', 'ENR-2026-018', 'asphalt', 'Direction des Travaux Publics (DTP Béjaïa)', 'Double Voie Route du Port', '2026-11-05', 'NA 5031 / EN 12697-34', 'Conforme', 'Stabilité Marshall = 11.8 kN, Fluage = 3.2 mm, Teneur en liant = 5.4%. Enrobé BBSG 0/14 conforme.', 'Ing. H. Belkacem (Responsable Enrobés)', 'LT-VERIFY-2026-090-ENR18');
