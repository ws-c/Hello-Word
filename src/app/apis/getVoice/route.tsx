import HTTP from '@/utils/axios'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') as string
  const audio = searchParams.get('audio') as string
  const url = `/dictvoice?type=${type}&audio=${audio}`
  try {
    const response = await HTTP({
      method: 'GET',
      url,
      responseType: 'stream',
    })
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg', // 设置响应的 Content-Type 为音频格式
      },
    });
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
