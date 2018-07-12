let express = require('./index')

let app = express()

app.get('/name', function (req, res) {
	res.end('get name')
})

let server = app.listen(3000, 'localhost', function () {
	console.log(`app is listening at http://${server.address().address}:${server.address().port}`)
})