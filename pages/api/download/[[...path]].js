const TARGET_SERVER = 'https://nl.uzicoders.ir';

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const targetPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');
    const targetUrl = TARGET_SERVER + '/api/download' + targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

    // دریافت بدنه خام
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    // کپی همه هدرها بجز چندتا
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    headers['host'] = new URL(TARGET_SERVER).host;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && body.length > 0 ? body : undefined,
    });

    const responseBuffer = await response.arrayBuffer();
    
    // کپی هدرهای پاسخ
    for (const [key, value] of response.headers.entries()) {
      if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }
    
    res.status(response.status);
    res.send(Buffer.from(responseBuffer));
    
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
