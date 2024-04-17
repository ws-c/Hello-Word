import { NextResponse } from 'next/server'
import pool from '@/db/mysql'

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const currentPage = searchParams.get('currentpage') as string
  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()

    // 执行 MySQL 查询

    const idNum = (parseInt(currentPage) - 1) * 7
    const [rows, fields] = await connection.query(
      `SELECT id,cet4_word,cet4_translate FROM cet4_starlist limit ${idNum},7`
    )

    // 释放连接回连接池
    connection.release()

    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
