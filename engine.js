const puppeteer = require('puppeteer');
const rp = require('request-promise');


let Pup = function(username, password) {
	this._login = async function(username, pass) {
		let jquery = await rp('https://code.jquery.com/jquery-3.3.1.min.js');
		let browser = await puppeteer.launch({ headless : false });
		let page = await browser.newPage();
		await page.goto('https://facebook.com', { waitUntil : 'domcontentloaded', timeout : 20000 });
		await page.addScriptTag({content : jquery});
		await page.evaluate(({username: username, pass: pass}) => {
			$('#email').val(username);
			$('#pass').val(pass);
			$("input[data-testid='royal_login_button']").click();
		}, {username: username, pass: pass});
		
		await page.waitFor(2000);
		this.broswer = browser; this.page = page; this.jquery = jquery;
		return this;
	}

	this.scanPage = async function(uri, date_range, mode) {
		let page = this.page;
		page.goto(uri, {waitUntil: 'domcontentloaded', timeout: 20000});

	}


	//main
	return this._login(username, password);
}

async function test() {
	let pupu = await new Pup('zhuylanz20@gmail.com', 'iamarobot');
	await pupu.scanPage('https://www.facebook.com/nuhulacoffee');
}

test();