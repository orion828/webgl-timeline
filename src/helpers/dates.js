import moment from 'moment';

export function initDates(days) {
	let dates = [];
	const half = Math.ceil(days / 2);

	const today = moment();
	const start = moment().subtract(half, 'days').utc().valueOf() / 1000;
	const end = moment().add(days - half, 'days').utc().valueOf() / 1000;

	for (let i = start; i <= end; i += 86400) {
		const date = moment.unix(i);
		const id = date.format('YYYY-MM-DD');

		dates.push({
			id: id,
			timestamp: i,
			index: dates.length,
			key: 'date_' + id,
			date: date,
			isWeekday: date.format('E') === '6' || date.format('E') === '7',
			isToday: date.isSame(today, 'day'),
			isFirstDayOfMonth: date.format('D') === '1',
		});
	}

	return dates;
}