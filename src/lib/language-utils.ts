export const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const COOKIE_NAME = 'googtrans';

export function getLanguageFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith(`${COOKIE_NAME}=`));

    if (googtrans) {
        const lang = googtrans.split('/').pop();
        return lang || null;
    }
    return null;
}

export function setLanguageCookie(langCode: string) {
    if (typeof document === 'undefined') return;

    // Set cookie for Google Translate (needs specific path and domain logic sometimes, but generic usually works for GT)
    // Google translate often looks for /auto/code or /en/code. We'll stick to what was working /en/code or just the code if simple.
    // The previous code used `/en/${langCode}`.

    const domain = window.location.hostname;
    document.cookie = `${COOKIE_NAME}=/en/${langCode};path=/;domain=${domain}`;
    document.cookie = `${COOKIE_NAME}=/en/${langCode};path=/`;
}
