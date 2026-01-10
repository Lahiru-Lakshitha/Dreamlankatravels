export function getOrigin() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
}

export function getStatusRedirect(path: string, type?: string, next?: string) {
    const origin = getOrigin();
    const params = new URLSearchParams();

    if (type) params.set('type', type);
    if (next) params.set('next', next);

    const queryString = params.toString();
    return `${origin}${path}${queryString ? `?${queryString}` : ''}`;
}
