import http from 'http'
import app from './express'
const server = http.createServer(app)
server.listen(global.Config.PORT)
console.log(global.Config.PORT);

export default server