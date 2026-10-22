// Theme preference: "light" or "dark" is stored and set as <html data-theme>;
// "auto" clears both so the stylesheet follows prefers-color-scheme.
// This runs in <head> so the stored theme applies before first paint.
(() => {
	const storageKey = "theme";
	const themes = ["auto", "light", "dark"];

	const readTheme = () => {
		try {
			const value = localStorage.getItem(storageKey);
			return themes.includes(value) ? value : "auto";
		} catch {
			return "auto";
		}
	};

	const storeTheme = (theme) => {
		try {
			if (theme === "auto") localStorage.removeItem(storageKey);
			else localStorage.setItem(storageKey, theme);
		} catch {
			// Storage can be blocked; the choice then lasts for this page only.
		}
	};

	const applyTheme = (theme) => {
		if (theme === "auto") delete document.documentElement.dataset.theme;
		else document.documentElement.dataset.theme = theme;
	};

	let current = readTheme();
	applyTheme(current);

	document.addEventListener("DOMContentLoaded", () => {
		const control = document.querySelector(".theme-switch");
		if (!control) return;

		const inputs = control.querySelectorAll("input[name=theme]");
		const showCurrent = () => {
			for (const input of inputs) input.checked = input.value === current;
		};

		control.addEventListener("change", (event) => {
			current = event.target.value;
			applyTheme(current);
			storeTheme(current);
		});

		// Keep other open tabs in step with a change made here.
		window.addEventListener("storage", (event) => {
			if (event.key !== storageKey && event.key !== null) return;
			current = readTheme();
			applyTheme(current);
			showCurrent();
		});

		showCurrent();
		control.hidden = false;
	});
})();
