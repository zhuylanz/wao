const express = require('express');
const app = express();
const ngin = require('./engine.js')

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/scanpage', async (req, res) => {
	console.log(req.query);
	let uri = req.query.uri; let start = req.query.start; let end = req.query.end; let mode = req.query.mode; 
	if (uri && start && end) {
		let puppy = await new ngin.Pup('zhuylanz20@gmail.com', 'iamarobot');
		let data = await puppy.scanPage(uri, {start: start, end: end}, mode);
		res.send(data);
	} else {
		res.send('uri, start and end are compulsory ^^');
	}
});

app.listen(8003, () => console.log('Wao Server is running on port 8003'));