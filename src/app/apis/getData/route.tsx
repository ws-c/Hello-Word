import { NextResponse } from 'next/server'
const mysql = require('mysql2/promise')
 
// 创建全局的 MySQL 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cet-4',
  port: 3306
});
 
export async function GET(request:any) {
  try {
    // 从连接池中获取连接
    const connection = await pool.getConnection()
 
    // 执行 MySQL 查询
    const [rows, fields] = await connection.query('SELECT * FROM wine_cet4_word LIMIT 10')
 
    // 释放连接回连接池
    connection.release()
 
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}




