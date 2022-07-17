import moment from 'moment';
import * as PIXI from "pixi.js";

function rand(min, max) {
	return Math.ceil(Math.random() * (max - min) + min);
}

function getRandomColor() {
	const colors = [
		0x3d5a80,
		0x98c1d9,
		0xee6c4d,
		0x293241,
		0x6b9080,
		0x772e25
	];

	return colors[rand(0, 5)];
}

export function getTask(task, top, totalDays) {
	const item = new PIXI.Graphics();

	// decrease days for last tasks, just for good looking presentation
	task.days = Math.min(task.days, totalDays - task.daysFromStart + 1);

	const width = task.days * 88 + Math.max((task.days - 1) * 2, 0);
	const height = 50;
	const x = task.daysFromStart * (88 + 2);
	const y = top + task.index * (height + 2);

	item.beginFill(0xffffff);
	const rect = item.drawRoundedRect(x, y, width, height, 4);
	rect.tint = task.color;
	rect.interactive = true;
	rect.buttonMode = true;
	item.endFill();

	const title = new PIXI.Text(
		task.title,
		{
			fontFamily : 'sans-serif',
			fontSize: 13,
			fontWeight: 400,
			align : 'center',
			fill: 0xffffff
		}
	);

	title.x = x + 4;
	title.y = y + 2;

	item.addChild(title);

	const line = new PIXI.Graphics();

	line.lineStyle(2, 0xffffff, 0.4);
	line.moveTo(x + width - 10, y + height - 4);
	line.lineTo(x + width - 4, y + height - 4);
	line.lineTo(x + width - 4, y + height - 10);

	item.addChild(line);

	// applyActions(rect, color, 0xf0f0f0);
	return item;
}

export function initTasks(taskPerUser, usersNum, days) {
	let tasks = [];

	const half = Math.ceil(days / 2);
	const startDate = moment().subtract(half, 'days').startOf('day');
	const start = Math.floor(startDate.utc().valueOf() / 1000);
	const end = Math.floor(moment().add(days - half, 'days').utc().valueOf() / 1000);

	for (let i = 0; i < usersNum; i++) {
		const t = [];

		for (let n = 0; n < taskPerUser; n++) {
			const timestamp = rand(start, end);
			const date = moment.unix(timestamp);

			t.push({
				timestamp: timestamp,
				start: date,
				daysFromStart: date.diff(startDate, 'days'),
				date: date.format('YYYY-MM-DD'),
				days: rand(0, 3),
				color: getRandomColor(),
				title: `Task #${n}`
			});
		}

		t.sort((x, y) => {
			return x.timestamp - y.timestamp;
		})

		const user = prepareTasks({
			user: {},
			tasks: t,
			highestIndex: 0,
		});

		tasks.push(user);
	}

	return tasks;
}

function prepareTasks(user) {
	let highestIndex = 0;
	const tasksPerDay = {};

	for (let i in user.tasks) {
		const task = user.tasks[i];

		if (typeof tasksPerDay[task.date] === 'undefined') {
			tasksPerDay[task.date] = [];
		}

		user.tasks[i].index = task.index = getIndex(tasksPerDay[task.date]);

		if (task.index > highestIndex) {
			highestIndex = task.index;
		}

		for (let d = 0; d < task.days; d++) {
			const date = d === 0 ? task.start.format('YYYY-MM-DD') : task.start.add(1, 'days').format('YYYY-MM-DD');

			if (typeof tasksPerDay[date] === 'undefined') {
				tasksPerDay[date] = [];
			}

			tasksPerDay[date].push(task);
		}
	}

	// user.tasksPerDay = tasksPerDay;
	user.highestIndex = highestIndex;

	return user;
}

function getIndex(tasks) {
	let i = 0;
	const indexes = tasks.map(t => t.index);

	while (true) {
		if (indexes.indexOf(i) === -1) {
			return i;
		}

		i++;
	}
}