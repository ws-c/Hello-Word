const mysql = require('mysql2/promise')

// 创建全局的 MySQL 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cet_4',
  port: 3306,
})

// const pool = mysql.createPool({
//   host: 'sql.wsfdb.cn',
//   user: '853800186word',
//   password: '118816742',
//   database: '853800186word',
//   port: 3306,
// })

// const pool = mysql.createPool({
//   host: 'docker.maxd.gq',
//   user: 'root',
//   password: '111111',
//   database: 'cet_4',
//   port: 21087,
// })
export default pool
