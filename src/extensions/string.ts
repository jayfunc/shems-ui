export function toTitleCase(str: string) {
	if (str === '') return str;
	return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export function insertSpaces(str: string) {
	return str.replace(/([A-Z])/g, ' $1').trim()
}