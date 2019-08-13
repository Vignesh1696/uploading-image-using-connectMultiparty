'use strict'

const express = require('express')
const fileType = require('file-type')
const fs = require('fs')
const app = express()
const router = express.Router()
var multiparty = require('connect-multiparty');
const port = process.env.PORT || 3000;


var multipartMiddleware = multiparty({
	uploadDir: './images'
});



app.post('/upload', multipartMiddleware, function(req, resp) {
	console.log(req.files)

	resp.status(200).send('OK');

});


router.get('/images/:imagename', (req, res) => {

	let imagename = req.params.imagename
	let imagepath = __dirname + "/images/" + imagename
	let image = fs.readFileSync(imagepath)
	let mime = fileType(image).mime
	res.writeHead(200, {
		'Content-Type': mime
	})
	res.end(image, 'binary')
})


app.use('/', router)

app.use((err, req, res, next) => {

	if (err.code == 'ENOENT') {

		res.status(404).json({
			message: 'Image Not Found !'
		})

	} else {

		res.status(500).json({
			message: err.message
		})
	}
})


app.listen(port)
console.log(`App Runs on ${port}`)