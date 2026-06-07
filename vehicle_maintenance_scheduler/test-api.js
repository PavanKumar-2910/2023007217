const http = require('http')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTMxNDMsImlhdCI6MTc4MDgxMjI0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijg2YjM0ZjAxLWU1YmQtNGY2NC05MzZmLWJmODQ3YmJjOTdiMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.BQBTfgRBQ6k-vpC0do15SQolHh40oxXiM2I-auvPfvM'
  hostname: '4.224.186.213',
  path: '/evaluation-service/vehicles',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
}

const req = http.request(options, (res) => {
  let data = ''
  console.log('Status Code:', res.statusCode)
  res.on('data', (chunk) => { data += chunk })
  res.on('end', () => {
    console.log('Response:', data)
  })
})

req.on('error', (err) => {
  console.log('Error:', err.message)
})
req.end()