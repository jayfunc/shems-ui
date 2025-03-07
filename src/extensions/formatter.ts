export default class Formatter {
	static timeFormatter(value: string) {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			return value;
		} else {
			return date.toLocaleTimeString("en-US", {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		}
	}
}