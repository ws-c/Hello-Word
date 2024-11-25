const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'rm-wz910td2iz8v3hmjyho.mysql.rds.aliyuncs.com',
  user: 'wangshuai',
  password: 'Ws-118816742',
  database: 'cet4',
  port: 3306,
})

export default pool
