// آدرس سرور HTTP شخصیت رو بذار
const TARGET_SERVER = 'http://141.11.21.189'; // یا http://192.168.1.100:3000

export default async function handler(req, res) {
  try {
    // مسیر کامل بعد از /api/download رو می‌سازیم
    const { path } = req.query;
    const targetPath = '/' + (Array.isArray(path) ? path.join('/') : path || '');
    const targetUrl = TARGET_SERVER + '/api/download' + targetPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');

    console.log(`Relaying ${req.method} to ${targetUrl}`);

    // هدرهای مورد نیاز رو کپی کن
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
      // هدرهای مجاز
      if (['content-type', 'authorization', 'accept', 'user-agent', 'x-forwarded-for'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    // اضافه کردن هدر Host
    headers['host'] = new URL(TARGET_SERVER).host;

    // تنظیمات درخواست
    const fetchOptions = {
      method: req.method,
      headers: headers,
      redirect: 'manual',
    };

    // برای متدهای غیر GET بدنه رو اضافه کن
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // ارسال به سرور HTTP
    const response = await fetch(targetUrl, fetchOptions);

    // کپی هدرهای پاسخ
    for (const [key, value] of response.headers.entries()) {
      if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    }

    // ارسال وضعیت و بدنه
    res.status(response.status);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Relay error:', error);
    res.status(502).json({ 
      error: 'Bad Gateway', 
      message: error.message,
      tip: 'Make sure your HTTP server is running and accessible from the internet'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // برای فایل‌های بزرگ
    },
    responseLimit: '50mb',
  },
};
