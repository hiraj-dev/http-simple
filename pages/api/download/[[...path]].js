const TARGET_SERVER = 'https://nl.uzicoders.ir';

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const targetPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');
    const targetUrl = TARGET_SERVER + '/api/download' + targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] || '' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    res.status(response.status);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}
