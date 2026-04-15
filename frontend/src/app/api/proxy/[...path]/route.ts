import { NextRequest, NextResponse } from 'next/server';
import { getDirectApiBaseUrl } from '@/lib/api-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

const HOP_BY_HOP_HEADERS = [
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path } = await Promise.resolve(context.params);
  const directApiBaseUrl = getDirectApiBaseUrl();
  const targetPath = Array.isArray(path) ? path.join('/') : '';
  const targetUrl = new URL(`${directApiBaseUrl}/${targetPath}`);

  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  for (const headerName of HOP_BY_HOP_HEADERS) {
    headers.delete(headerName);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, init);
    const responseHeaders = new Headers(response.headers);

    for (const headerName of HOP_BY_HOP_HEADERS) {
      responseHeaders.delete(headerName);
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Backend proxy request failed',
        detail: error instanceof Error ? error.message : 'Unknown proxy error',
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
