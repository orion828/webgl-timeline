import * as PIXI from 'pixi.js'

export function getMonthAndYear() {
	const month = new PIXI.Text(
		'',
		{
			fontFamily : 'sans-serif',
			fontSize: 10.4,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	const year = new PIXI.Text(
		'',
		{
			fontFamily : 'sans-serif',
			fontSize: 16,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	month.anchor.set(0.5, 0.5);
	month.x = 32;
	month.y = 20;

	year.anchor.set(0.5, 0.5);
	year.x = 32;
	year.y = 34;

	return [month, year];
}

export function renderHeaderDay(date, graphics) {
	const x = date.index * (88 + 2);
	let color = date.isWeekday ? 0xffffff : 0xf4f5f7;

	if (date.isToday) {
		color =  0x2f4f9a;
	}

	graphics.beginFill(color);
	graphics.drawRoundedRect(x, 24, 88, 24, 4);
	graphics.endFill();

	const text = new PIXI.Text(
		date.date.locale('en').format('ddd D'),
		{
			fontFamily : 'sans-serif',
			fontSize: 11.4,
			fontWeight: 500,
			align : 'center',
			fill: date.isToday ? 0xffffff : 0x000000
		}
	);

	text.anchor.set(0.5, 0.5);
	text.x = x + 44;
	text.y = 36;

	graphics.addChild(text);
}

export function getDay(date, y, height) {
	const day = new PIXI.Graphics();

	const x = date.index * (88 + 2);
	let color = date.isWeekday ? 0xf4f5f7 : 0xfafafa;

	if (date.isToday) {
		color = 0xe7eef7;
	}

	day.beginFill(0xffffff);
	const rect = day.drawRoundedRect(x, y, 88, height, 4);
	rect.tint = color;
	applyActions(rect, color, 0xf0f0f0);

	day.endFill();

	return day;
}


function applyActions(rect, initialColor, activeColor) {
	// rect.interactive = true;
	// rect.buttonMode = true;

	// rect.on('mouseout', () => {
	// 	rect.tint = initialColor;
	// }).on('mouseover', () => {
	// 	rect.tint = activeColor;
	// });
}