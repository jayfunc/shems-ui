"use client"

export default class SettingsService {
	static initDarkMode() {
		if (typeof window !== 'undefined') {
			document.documentElement.classList.toggle(
				'dark',
				localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			);
		}
	}

	static getDarkMode(): boolean {
		// this.initDarkMode();
		if (typeof window !== 'undefined') {
			return localStorage.theme === "dark";
		} else {
			return false;
		}
	}

	static setDarkMode(darkMode: boolean) {
		// this.initDarkMode();
		if (typeof window !== 'undefined') {
			if (darkMode) {
				localStorage.theme = "dark";
			} else {
				localStorage.theme = "light";
			}
		}
	}

	static getNotif(): boolean {
		if (typeof window !== 'undefined') {
			return localStorage.notif === "true";
		} else {
			return false;
		}
	}

	static setNotif(val: boolean) {
		if (typeof window !== 'undefined') {
			if (val) {
				localStorage.notif = "true";
			} else {
				localStorage.notif = "false";
			}
		}
	}
}