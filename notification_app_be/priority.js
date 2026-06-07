const http = require('http')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTU2MjYsImlhdCI6MTc4MDgxNDcyNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImJjMzY0OTc3LTc1ZjEtNDE1Yi04OWQxLTNjZDJjYjU5YWM5ZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.lPW5s7TXKXK3f7Cz7WU7cN5BFIg5XNcV2T2Ud4qX5Jo'

function getTopNotifications(notifications, n) {
  const weights = { Placement: 3, Result: 2, Event: 1 }
  
  function getPriority(notif) {
    const weight = weights[notif.Type] || 1
    const timestamp = new Date(notif.Timestamp)
    const now = new Date()
    const daysDiff = (now - timestamp) / (1000 * 60 * 60 * 24)
    const recencyBonus = Math.max(0, 10 - daysDiff) * 0.5
    return weight + recencyBonus
  }
  
  const withScores = []
  for (let i = 0; i < notifications.length; i++) {
    const notif = notifications[i]
    const score = getPriority(notif)
    withScores.push({
      id: notif.ID,
      type: notif.Type,
      message: notif.Message,
      timestamp: notif.Timestamp,
      priorityScore: score
    })
  }
  
  withScores.sort((a, b) => b.priorityScore - a.priorityScore)
  return withScores.slice(0, n)
}

const options = {
  hostname: '4.224.186.213',
  path: '/evaluation-service/notifications',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
}

const req = http.request(options, (res) => {
  let data = ''
  res.on('data', (chunk) => { data += chunk })
  res.on('end', () => {
    const parsed = JSON.parse(data)
    const notifications = parsed.notifications
    const top10 = getTopNotifications(notifications, 10)
    console.log(JSON.stringify(top10, null, 2))
  })
})

req.on('error', (err) => { console.log(err) })
req.end()