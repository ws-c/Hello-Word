const mysql = require('mysql2/promise')

// 创建全局的 MySQL 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cet-4',
  port: 3306,
})
export default pool
