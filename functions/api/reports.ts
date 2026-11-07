export async function onRequest(context: any) {
  const { request, env } = context;
  const db = env.DB;
  const method = request.method;

  try {
    if (method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM reports_pvs ORDER BY issue_date DESC').all();
      return Response.json(results);
    }
    if (method === 'POST') {
      const data = await request.json();
      await db.prepare(
        `INSERT INTO reports_pvs (id, pv_number, sample_id, sample_code, material_type, client_name, project_name, issue_date, standard_ref, test_result, summary_text, signed_by, qr_code_token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        data.id || 'pv_' + Date.now(),
        data.pvNumber,
        data.sampleId,
        data.sampleCode,
        data.materialType,
        data.clientName,
        data.projectName,
        data.issueDate,
        data.standardRef,
        data.testResult,
        data.summaryText,
        data.signedBy,
        data.qrCodeToken
      ).run();

      // Update sample status to validated
      await db.prepare('UPDATE samples SET status = ? WHERE id = ?').bind('validated', data.sampleId).run();

      return Response.json({ success: true, data });
    }
    return new Response('Method not allowed', { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
