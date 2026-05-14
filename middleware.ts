import { NextRequest, NextResponse } from 'next/server';

// این آدرس رو با آدرس سرور شخصی خودت عوض کن
const TARGET_SERVER = 'https://your-personal-server.com';

export function middleware(request: NextRequest) {
  // هر مسیری که با /relay شروع بشه رو بگیر
  if (request.nextUrl.pathname.startsWith('/relay')) {
    // مسیر رو از /relay جدا کن و به سرور مقصد بچسبون
    // مثال: /relay/api/data -> /api/data
    const targetPath = request.nextUrl.pathname.replace('/relay', '');
    const targetUrl = new URL(targetPath + request.nextUrl.search, TARGET_SERVER);

    console.log(`Relaying ${request.method} ${request.nextUrl.pathname} to ${targetUrl}`);

    // درخواست رو مستقیم به سرور شخصی بفرست
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    });
  }

  // بقیه مسیرها رو نادیده بگیر
  return NextResponse.next();
}

// فقط مسیرهای /relay رو پردازش کن
export const config = {
  matcher: '/relay/:path*',
};
