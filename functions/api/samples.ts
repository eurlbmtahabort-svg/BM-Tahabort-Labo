export async function onRequest(context: any) {
  const { request, env } = context;
  const db = env.DB;
  const method = request.method;
  const url = new URL(request.url);

  try {
    if (method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM samples ORDER BY created_at DESC').all();
      return Response.json(results);
    }
    if (method === 'POST') {
      const data = await request.json();
      await db.prepare(
        'INSERT INTO samples (id, code, client_name, project_name, material_type, date_received, status, technician, grade_spec, sampling_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        data.id || 's_' + Date.now(),
        data.code,
        data.clientName,
        data.projectName,
        data.materialType,
        data.dateReceived,
        data.status || 'pending',
        data.technician,
        data.gradeSpec,
        data.samplingLocation
      ).run();
      return Response.json({ success: true, data });
    }
    if (method === 'PUT') {
      const data = await request.json();
      await db.prepare('UPDATE samples SET status = ? WHERE id = ?').bind(data.status, data.id).run();
      return Response.json({ success: true });
    }
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (id) {
        await db.prepare('DELETE FROM samples WHERE id = ?').bind(id).run();
        return Response.json({ success: true });
      }
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }
    return new Response('Method not allowed', { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
