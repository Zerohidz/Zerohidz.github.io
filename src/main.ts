import './style.css';

function toggleTheme(): void {
    const root = document.documentElement;
    const light = root.dataset.theme !== 'light';

    if (light) {
        root.dataset.theme = 'light';
    } else {
        delete root.dataset.theme;
    }

    try {
        localStorage.setItem('theme', light ? 'light' : 'dark');
    } catch {
        // Storage can be blocked; the theme still applies for this visit.
    }
}

document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
