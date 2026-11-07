export async function onRequest(context: any) {
  const { request, env } = context;
  const db = env.DB;
  const method = request.method;

  try {
    if (method === 'GET') {
      const { results } = await db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
      return Response.json(results);
    }
    if (method === 'POST') {
      const data = await request.json();
      await db.prepare(
        'INSERT INTO clients (id, name, company, sector, phone, email, active_projects) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        data.id || 'c_' + Date.now(),
        data.name,
        data.company,
        data.sector,
        data.phone,
        data.email,
        data.activeProjects || 1
      ).run();
      return Response.json({ success: true, data });
    }
    return new Response('Method not allowed', { status: 405 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
