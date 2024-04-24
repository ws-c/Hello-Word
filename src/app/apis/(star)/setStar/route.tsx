import { NextResponse } from 'next/server'
import pool from '@/db/mysql'

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  const token = searchParams.get('token') as string

  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()

    // 执行 MySQL 查询
    const [rows, fields] = await connection.execute(
      `insert into user_starWord (user_id, word_id) 
    values(?, ?)`,
      [token, id]
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
