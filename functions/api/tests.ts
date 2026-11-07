export async function onRequest(context: any) {
  const { request, env } = context;
  const db = env.DB;
  const method = request.method;
  const url = new URL(request.url);
  const testType = url.searchParams.get('type') || 'concrete';

  try {
    if (method === 'GET') {
      let tableName = 'concrete_tests';
      if (testType === 'asphalt') tableName = 'asphalt_tests';
      if (testType === 'base_layer') tableName = 'base_layer_tests';

      const { results } = await db.prepare(`SELECT * FROM ${tableName}`).all();
      return Response.json(results);
    }

    if (method === 'POST') {
      const data = await request.json();

      if (testType === 'concrete') {
        await db.prepare(
          `INSERT INTO concrete_tests (id, sample_id, sample_code, client_name, project_name, age_days, dimension_a, dimension_b, weight_kg, crushing_force_kn, sectional_area_cm2, calculated_rc_mpa, slump_mm, result, test_date, technician, standard, notes) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.id || 'ct_' + Date.now(),
          data.sampleId,
          data.sampleCode,
          data.clientName,
          data.projectName,
          data.ageDays,
          data.dimensionA,
          data.dimensionB,
          data.weightKg,
          data.crushingForceKN,
          data.sectionalAreaCm2,
          data.calculatedRcMPa,
          data.slumpMm,
          data.result,
          data.testDate,
          data.technician,
          data.standard,
          data.notes
        ).run();
      } else if (testType === 'asphalt') {
        await db.prepare(
          `INSERT INTO asphalt_tests (id, sample_id, sample_code, client_name, project_name, binder_content_pct, stability_kn, flow_01mm, voids_pct, vma_pct, result, test_date, technician, standard, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.id || 'at_' + Date.now(),
          data.sampleId,
          data.sampleCode,
          data.clientName,
          data.projectName,
          data.binderContentPct,
          data.stabilityKN,
          data.flow01mm,
          data.voidsPct,
          data.vmaPct,
          data.result,
          data.testDate,
          data.technician,
          data.standard,
          data.notes
        ).run();
      } else if (testType === 'base_layer') {
        await db.prepare(
          `INSERT INTO base_layer_tests (id, sample_id, sample_code, client_name, project_name, max_dry_density, optimum_moisture_pct, cbr_95_pct, sand_equivalent_visual, los_angeles_pct, result, test_date, technician, standard, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.id || 'bt_' + Date.now(),
          data.sampleId,
          data.sampleCode,
          data.clientName,
          data.projectName,
          data.maxDryDensity,
          data.optimumMoisturePct,
          data.cbr95Pct,
          data.sandEquivalentVisual,
          data.losAngelesPct,
          data.result,
          data.testDate,
          data.technician,
          data.standard,
          data.notes
        ).run();
      }

      // Also update sample status
      await db.prepare('UPDATE samples SET status = ? WHERE id = ?').bind('tested', data.sampleId).run();

      return Response.json({ success: true, data });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
