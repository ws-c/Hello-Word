import { NextResponse } from 'next/server'
import pool from '@/db/mysql'
import { revalidatePath } from 'next/cache'

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const currentPage = searchParams.get('currentpage') as string
  const token = searchParams.get('token') as string
  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()

    // 执行 MySQL 查询
    const idNum = (parseInt(currentPage) - 1) * 8
    const [rows, fields] = await connection.query(
      `SELECT id,word,translate from CET_4,user_starWord
          where user_starWord.word_id = CET_4.id and user_id = ?
              limit ?,8`,
      [token, idNum]
    )
    // 释放连接回连接池
    connection.release()
    revalidatePath('/star-book')
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
