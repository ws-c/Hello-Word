const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cet_4',
  port: 3306,
})

// const pool = mysql.createPool({
//   host: 'docker.maxd.gq',
//   user: 'root',
//   password: '111111',
//   database: 'cet_4',
//   port: 21087,
// })
export default pool
