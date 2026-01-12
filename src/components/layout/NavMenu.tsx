import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { t } from '@/data/translations';

interface NavMenuProps {
    isScrolled: boolean;
    isHome: boolean;
}

export function NavMenu({ isScrolled, isHome }: NavMenuProps) {
    const pathname = usePathname();

    const navItems = [
        { name: t.nav.home, path: '/' },
        { name: t.nav.destinations, path: '/destinations' },
        { name: t.nav.tours, path: '/tours' },
        { name: t.home?.planYourJourney || 'Plan Trip', path: '/trip-planner' },
        { name: t.nav.about, path: '/about' },
        { name: t.nav.blog, path: '/blog' },
        { name: "FAQ", path: "/faq" },
        { name: t.nav.contact, path: '/contact' },
    ];

    // Logic: Text is white ONLY if we are on Home AND at the top.
    // Otherwise (scrolled OR not on home), text is standard foreground (dark/light).
    const isTransparent = !isScrolled && isHome;
    const textColor = isTransparent ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-primary";
    const underlineColor = isTransparent ? "bg-white" : "bg-primary";

    return (
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "relative group py-2 text-sm uppercase tracking-widest font-medium transition-colors duration-300",
                            textColor,
                            isActive && (isTransparent ? "text-white font-semibold" : "text-primary font-semibold")
                        )}
                    >
                        {item.name}

                        {/* Center-out Gold Underline Animation */}
                        <span
                            className={cn(
                                "absolute bottom-0 left-1/2 w-full h-[2px] -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center",
                                underlineColor
                            )}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
