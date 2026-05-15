const TARGET_SERVER = 'https://nl.uzicoders.ir';

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const targetPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');
    const targetUrl = TARGET_SERVER + '/api/download' + targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

    // دریافت بدنه خام به صورت بافر (باینری)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] || 'application/octet-stream',
        'host': new URL(TARGET_SERVER).host,
      },
      body: req.method !== 'GET' && body.length > 0 ? body : undefined,
    });

    // برگردوندن کامل و خام پاسخ
    const responseBuffer = await response.arrayBuffer();
    res.status(response.status);
    res.send(Buffer.from(responseBuffer));
    
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // خیلی مهم: بدنه رو پارس نکن، خام بمونه
  },
};
