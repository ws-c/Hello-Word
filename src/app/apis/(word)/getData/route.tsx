import { NextResponse } from 'next/server'
import pool from '@/db/mysql'
import { revalidatePath } from 'next/cache'

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string
  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()

    // 执行 MySQL 查询
    const [rows, fields] = await connection.query(
      `SELECT * FROM word where id = ${id}`
    )

    // 释放连接回连接池
    connection.release()
    const row = rows[0];
    revalidatePath('/word')
    return NextResponse.json(
      {
        id: row.id,
        word: row.word,
        phonetic: row.phonetic,
        translate: JSON.parse(row.translate),
        distortion: JSON.parse(row.distortion),
        phrase: JSON.parse(row.phrase),
        samples: JSON.parse(row.samples),
        bookName: row.bookName,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
