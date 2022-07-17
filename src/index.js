import * as PIXI from 'pixi.js'
import { Scrollbox } from 'pixi-scrollbox';
import { drawFps } from './helpers/fps';
import { changeRenderState } from './helpers/render';
import { renderUserItem } from './helpers/user';
import { initDates } from './helpers/dates';
import { getTask, initTasks } from './helpers/tasks';
import { drawBackground } from './helpers/background';
import { getMonthAndYear, renderDay, renderHeaderDay } from './helpers/day';

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

function render(app, userNum, daysNum, taskPerUser) {
	let start = new Date();
	const dates = initDates(daysNum);
	const tasks = initTasks(taskPerUser, userNum, daysNum);
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
	const daysGraphics = new PIXI.Graphics();

	for (let i = 0; i < userNum; i++) {
		let height = (tasks[i].highestIndex + 2) * 52;

		if (height < 200) {
			height = 200;
		}

		renderUserItem(sidebar, top);

		for (let date of dates) {
			if (i === 0) {
				renderHeaderDay(date, headerGraphics);
			}

			renderDay(date, top, height, daysGraphics);
		}

		for (let t of tasks[i].tasks) {
			const task = getTask(t, top, daysNum);
			main.content.addChild(task);
		}

		top += height + 6;
	}

	daysGraphics.data = {
		'dontUpdateRenderState': true
	};

	main.content.addChildAt(daysGraphics, 0);
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

	const fps = drawFps(app);

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

				changeRenderState(childes, scroll);
			}
		}
	});

	changeRenderState(childes, scroll);

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
