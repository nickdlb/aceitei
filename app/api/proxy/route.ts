import { NextRequest, NextResponse } from 'next/server';
import { handler as proxyResourceHandler } from './proxy-resource';
import { handler as proxyHandler } from './proxy';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const pathname = req.nextUrl.pathname;

  if (pathname.includes('proxy-resource')) {
    return proxyResourceHandler(req, NextResponse);
  } else {
    return proxyHandler(req, NextResponse);
  }
}

export const dynamic = 'force-dynamic';
