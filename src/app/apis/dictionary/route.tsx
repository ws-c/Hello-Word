import { NextResponse } from 'next/server'
import pool from '@/db/mysql'
import { revalidatePath } from 'next/cache'

export async function GET(request: any) {
  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()

    // 执行 MySQL 查询
    const [rows, fields] = await connection.query(
      `SELECT id, cet4_word FROM wine_cet4_word`
    )

    // 释放连接回连接池
    connection.release()
    revalidatePath('/dictionary')
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
