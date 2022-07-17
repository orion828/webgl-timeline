import * as PIXI from 'pixi.js'
import { Scrollbox } from 'pixi-scrollbox';
import { initDates } from './helpers/dates';
import { getTask, initTasks } from './helpers/tasks';
import { drawBackground } from './helpers/background';
import { getDay, getMonthAndYear, renderHeaderDay } from './helpers/day';

function createApp(width, height) {
	return new PIXI.Application({
		antialias: true,
		width: width,
		height: height,
		backgroundColor: 0xffffff,
		resolution: window.devicePixelRatio || 1,
	});
}

function createScrollBar(width, height, size) {
	return new Scrollbox({
		boxWidth: width,
		boxHeight: height,
		scrollbarSize: size,
	});
}

function renderUserItem(holder, height) {
	// draw user icons
	const icon = PIXI.Sprite.from('user.svg');
	icon.width = 46;
	icon.height = 46;
	icon.antialias = true;
	icon.anchor.set(0.5);
	icon.x = 32;
	icon.y = height + 25;

	const firstName = new PIXI.Text(
		'Gary',
		{
			fontFamily : 'sans-serif',
			fontSize: 11,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	const lastName = new PIXI.Text(
		'ROMERO',
		{
			fontFamily : 'sans-serif',
			fontSize: 11,
			fontWeight: 400,
			align : 'center',
			fill: 0x000000
		}
	);

	firstName.anchor.set(0.5);
	firstName.x = 32;
	firstName.y = height + 58;

	lastName.anchor.set(0.5);
	lastName.x = 32;
	lastName.y = height + 72;

	holder.content.addChild(icon);
	holder.content.addChild(firstName);
	holder.content.addChild(lastName);
}

function render(app, userNum, days, taskPerUser) {
	let start = new Date();
	const dates = initDates(days);
	const tasks = initTasks(taskPerUser, userNum, days);
	let end = new Date();

	document.querySelector('#users_num').innerHTML = userNum;
	document.querySelector('#tasks_num').innerHTML = (taskPerUser * userNum).toString();
	document.querySelector('#generation_time').innerHTML = (end.getTime() - start.getTime()) + ' ms';

	start = new Date();
	const header = createScrollBar(document.body.offsetWidth - 68, 50, 0);
	const main = createScrollBar(document.body.offsetWidth - 68, document.body.offsetHeight - 52, 4);
	const sidebar = createScrollBar(66, document.body.offsetHeight - 52, 0);
	sidebar.dragScroll = false;

	let top = 0;
	const headerGraphics = new PIXI.Graphics();

	for (let i = 0; i < userNum; i++) {
		let height = (tasks[i].highestIndex + 2) * 52;

		if (height < 200) {
			height = 200;
		}

		renderUserItem(sidebar, top);

		for (let date of dates) {
			// draw header items
			if (i === 0) {
				renderHeaderDay(date, headerGraphics);
			}

			const day = getDay(date, top, height);
			main.content.addChild(day);
		}

		for (let t of tasks[i].tasks) {
			const task = getTask(t, top);
			main.content.addChild(task);
		}

		top += height + 6;
	}

	header.content.addChild(headerGraphics);

	header.x = 66;
	header.y = 0;
	header.update();

	sidebar.x = 0;
	sidebar.y = 54;
	sidebar.update();

	main.x = 66;
	main.y = 54;
	main.update();

	let [month, year] = getMonthAndYear();

	app.stage.addChild(main);
	app.stage.addChild(header);

	app.stage.addChild(month);
	app.stage.addChild(year);

	app.stage.addChild(sidebar);

	// draw rect to save scroll box size
	const bg = new PIXI.Graphics();
	bg.beginFill(0xffffff);
	bg.drawRect(0, 0, main.scrollWidth, main.scrollHeight);
	bg.endFill();
	bg.data = {
		'dontUpdateRenderState': true
	};

	main.content.addChildAt(bg, 0);

	// TODO: draw only visible part and offset
	// Do it only if scroll was changed
	const changeRenderState = function (childes) {
		for (let child of childes) {
			if (child.data && child.data.dontUpdateRenderState) {
				continue;
			}

			const bounds = child.getBounds();

			child.visible = (
				// elements that starts in the visible part
				(
					bounds.x >= -scroll.offset &&
					bounds.x <= scroll.width + scroll.offset &&
					bounds.y >= -scroll.offset &&
					bounds.y <= scroll.height + scroll.offset
				) ||

				// elements that ends in the visible part
				(
					bounds.x + bounds.width >= -scroll.offset &&
					bounds.x + bounds.width <= scroll.width + scroll.offset &&
					bounds.y + bounds.height >= -scroll.offset &&
					bounds.y + bounds.height <= scroll.height + scroll.offset
				)
			);
		}
	}

	const scroll = {
		left: 0,
		top: 0,
		width: main.width,
		height: main.height,
		offset: 400,
		lastChange: {
			left: 0,
			top: 0,
			activationOffset: 300,
		}
	};

	function withChildes(items) {
		const result = [];

		for (const i of items) {
			result.push(i);
			result.concat(withChildes(i.children));
		}

		return result;
	}

	const childes = withChildes(main.content.children);

	// draw fps
	const fpsBg = new PIXI.Graphics();
	fpsBg.beginFill(0x000000, 0.5);
	fpsBg.drawRect(document.body.offsetWidth - 80, document.body.offsetHeight - 60, 80, 60);
	fpsBg.endFill();
	app.stage.addChild(fpsBg);

	const fps = new PIXI.Text(
		Math.round(app.ticker.FPS),
		{
			fontFamily : 'sans-serif',
			fontSize: 30,
			fontWeight: 500,
			align : 'center',
			fill: 0xffffff
		}
	);

	fps.anchor.set(0.5);
	fps.x = document.body.offsetWidth - 40;
	fps.y = document.body.offsetHeight - 30;
	app.stage.addChild(fps);

	app.ticker.add(() => {
		fps.text = Math.round(app.ticker.FPS);

		if (scroll.left !== main.scrollLeft || scroll.top !== main.scrollTop) {
			header.scrollLeft = main.scrollLeft;
			sidebar.scrollTop = main.scrollTop;

			scroll.left = main.scrollLeft;
			scroll.top = main.scrollTop;
			scroll.right = main.scrollLeft + main.width;
			scroll.bottom = main.scrollTop + main.height;

			const index = Math.ceil(scroll.left / 90);

			month.text = dates[index].date.locale('en').format('MMMM');
			year.text = dates[index].date.locale('en').format('YYYY');

			if (
				Math.abs(scroll.lastChange.left - scroll.left)  > scroll.lastChange.activationOffset ||
				Math.abs(scroll.lastChange.top - scroll.top)  > scroll.lastChange.activationOffset
			) {
				scroll.lastChange.left = scroll.left;
				scroll.lastChange.top = scroll.top;

				changeRenderState(childes);
			}
		}
	});

	end = new Date();
	document.querySelector('#rendering_time').innerHTML = (end.getTime() - start.getTime()) + ' ms';

	document.querySelector('#loader').style.display = 'none';
	document.querySelector('#result').style.display = 'block';
	document.querySelector('#background').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelector('#result button').addEventListener('pointerup', () => {
		document.querySelector('#result').style.display = 'none';
		document.querySelector('#background').style.display = 'none';
	});

	document.querySelector('#form button').addEventListener('pointerup', () => {
		const users = document.querySelector('#users').value;
		const days = document.querySelector('#days').value;
		const tasksPerUser = document.querySelector('#tasks_per_user').value;

		document.querySelector('#form').style.display = 'none';
		document.querySelector('#loader').style.display = 'block';

		setTimeout(() => {
			const app = createApp(document.body.offsetWidth, document.body.offsetHeight);
			document.body.appendChild(app.view);

			const background = drawBackground(document.body.offsetWidth, document.body.offsetHeight);

			app.stage.addChild(background);
			render(app, users, days, tasksPerUser);
		}, 100);
	});
});


