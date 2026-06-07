const http= require('http')
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MDk1MDgsImlhdCI6MTc4MDgwODYwOCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjlmMTdjOTkwLWYzYWMtNDk1ZS04OTY4LTk4MmQwMWUzY2QxYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.6zt4cYxSExAoKgzfhixyDVSyUC8DqyFTIPDKXFTK_FA'
function log(stack,level,packageName,message){
    const data=JSON.stringify({
        stack: stack,
        level: level,
        package:packageName,
        message:message
    })
    const options={
        hostname:'4.224.186.213',
        path:'/evaluation-service/logs',
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer' + token,
            'Content-Length':Buffer.byteLength(data)
        }
    }
    const req = http.request(options, (res) => {
    let responseData = ''
    res.on('data', (chunk) => { responseData += chunk })
    res.on('end', () => {})
  })
  req.on('error',(err)=> {})
  req.write(data)
  req.end()
}
module.exports={log}