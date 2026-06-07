const http = require('http')
const { log } = require('../logging-middleware/logger')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZG1AZ2l0YW0uaW4iLCJleHAiOjE3ODA4MTMxNDMsImlhdCI6MTc4MDgxMjI0MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijg2YjM0ZjAxLWU1YmQtNGY2NC05MzZmLWJmODQ3YmJjOTdiMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InBhdmFuIGt1bWFyIGQgbSIsInN1YiI6ImM5NDIzOWMzLWRmMjMtNGQwNC1hY2U5LWI4NGRmNTc2NGRmMSJ9LCJlbWFpbCI6InBkbUBnaXRhbS5pbiIsIm5hbWUiOiJwYXZhbiBrdW1hciBkIG0iLCJyb2xsTm8iOiIyMDIzMDA3MjE3IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYzk0MjM5YzMtZGYyMy00ZDA0LWFjZTktYjg0ZGY1NzY0ZGYxIiwiY2xpZW50U2VjcmV0Ijoic0RHemN3RFNES1BDSHVLViJ9.BQBTfgRBQ6k-vpC0do15SQolHh40oxXiM2I-auvPfvM'
function knapsack(vehicles, budget) {
  const n = vehicles.length
  const dp = new Array(n + 1)
  for(let i = 0; i <= n; i++) {
    dp[i] = new Array(budget + 1)
    for(let j = 0; j <= budget; j++) {
      dp[i][j] = 0
    }
  }
  for(let i = 1; i <= n; i++) {
    const duration = vehicles[i-1].Duration
    const impact = vehicles[i-1].Impact
    for(let j = 0; j <= budget; j++) {
      if(duration <= j) {
        dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j-duration] + impact)
      } else {
        dp[i][j] = dp[i-1][j]
      }
    }
  }
  return dp[n][budget]
}
function fetchData(path, callback) {
  const options = {
    hostname: '4.224.186.213',
    path: path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
  const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => { data += chunk })
    res.on('end', () => {
      try {
        callback(null, JSON.parse(data))
      } catch(e) {
        callback(e, null)
      }
    })
  })
  req.on('error', (err) => {
    callback(err, null)
  })
  req.end()
}
fetchData('/evaluation-service/depots', (err, depotsData) => {
  if(err) {
    log('backend', 'error', 'service', 'failed to fetch depots')
    console.log('error fetching depots', err)
    return
  }
  log('backend', 'info', 'service', 'depots fetched successfully')
  fetchData('/evaluation-service/vehicles', (err2, vehiclesData) => {
    if(err2) {
      log('backend', 'error', 'service', 'failed to fetch vehicles')
      console.log('error fetching vehicles', err2)
      return
    }
    log('backend', 'info', 'service', 'vehicles fetched successfully')
    const vehicles = vehiclesData.vehicles
    const results = []
    for(let i = 0; i < depotsData.depots.length; i++) {
      const depot = depotsData.depots[i]
      const budget = depot.MechanicHours
      const maxImpact = knapsack(vehicles, budget)
      results.push({
        depotID: depot.ID,
        budget: budget,
        maxImpact: maxImpact
      })
      log('backend', 'info', 'service', 'calculated for depot ' + depot.ID)
    }
    console.log(JSON.stringify(results, null, 2))
  })
})