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
		let browser = this.browser; let page = this.page; let jquery = this.jquery;
		await page.goto(uri, {waitUntil: 'domcontentloaded', timeout: 20000});
		await page.addScriptTag({content : jquery});
		await page.waitFor(5000);

		await page.keyboard.press('Escape');
		await page.waitFor(2000);
		await page.keyboard.press('Escape');
		while (true) {
			await page.waitFor(2000);
			let comment_load_links = await page.evaluate(() => {
				$('.UFIReplySocialSentenceLinkText.UFIReplySocialSentenceVerified').click();
				return $('.UFIPagerLink').length;
			});
			console.log(comment_load_links);
			for (var i=0; i<comment_load_links; i++) {
				await page.click(`.UFIPagerLink:eq(${i})`);
			}
			let data = await page.evaluate((date_range) => {
				let should_continue = true; let data = [];

				$('._5pcr.userContentWrapper').each((i, el) => {
					let caption = ''; let link, utime, react, comment, share;
					utime = $(el).find('abbr').attr('data-utime');
					if (utime >= date_range.start && utime <= date_range.end) {
						$(el).find('._5pbx.userContent p').each((j, ele) => { caption += $(ele).text().trim() + '\n'; });
						link = 'https://www.facebook.com'+$(el).find('.fsm.fwn.fcg a').attr('href');
						react = $(el).find('._1g5v').text();
						comment = $(el).find('.UFIRow.UFIComment').length;
						share = $(el).find('.UFIShareLink').text().match(/\d*/)[0];
						data.push({
							utime: utime,
							link: link,
							caption: caption,
							react: react,
							comment: comment,
							share: share,
						});
					} else if (utime < date_range.start) {
						should_continue = false;
					}
				});

				if (should_continue) { return should_continue; } else { return data; }
			}, date_range);

			if (data === true) {
				console.log(data);
				await page.evaluate(() => { window.scrollBy(0, document.documentElement.scrollHeight) });
			} else {
				console.log(data);
				break;
			}
		}

		switch (mode) {
			case 1:
			break;

			default:
			break;
		}
	}


	//main
	return this._login(username, password);
}

async function test() {
	let pupu = await new Pup('zhuylanz20@gmail.com', 'iamarobot');
	// await pupu.scanPage('https://www.facebook.com/nuhulacoffee');
	await pupu.scanPage('https://www.facebook.com/nuhulacoffee', {start: 1501561354, end: 1502425354});
}

test();