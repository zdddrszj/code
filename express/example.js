let express = require('./index')

let app = express()

app.get('/name', function (req, res) {
	console.log(req.path)
	console.log(req.hostname)
	console.log(req.query)
	res.end('get name')
})

let server = app.listen(3000, 'localhost', function () {
	console.log(`app is listening at http://${server.address().address}:${server.address().port}`)
})