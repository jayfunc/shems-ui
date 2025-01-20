"use client"

export default class SettingsService {
	static initDarkMode() {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	}

	static getDarkMode(): boolean {
		this.initDarkMode();
		return localStorage.theme === "dark";
	}

	static setDarkMode(darkMode: boolean) {
		this.initDarkMode();
		if (darkMode) {
			localStorage.theme = "dark";
		} else {
			localStorage.theme = "light";
		}
	}

	static getNotif(): boolean {
		return localStorage.notif === "true";
	}

	static setNotif(val: boolean) {
		if (val) {
			localStorage.notif = "true";
		} else {
			localStorage.notif = "false";
		}
	}
}