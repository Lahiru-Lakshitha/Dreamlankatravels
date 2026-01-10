import Image from 'next/image';
import heroSigiriya from '@/assets/hero-sigiriya.jpg';

export function HeroPlaceholder() {
    return (
        <section className="relative w-full h-[75vh] sm:h-[80vh] lg:h-[88vh] xl:h-[90vh] overflow-hidden bg-black">
            <div className="absolute inset-0">
                <Image
                    src={heroSigiriya}
                    alt="Discover the Jewel of Asia"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15" />
            </div>
            <div className="relative z-20 h-full flex items-center justify-center">
                {/* Minimal static content to prevent layout shift */}
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-sand leading-[1.15] tracking-tight opacity-0">
                            Discover the Jewel of Asia
                        </h1>
                    </div>
                </div>
            </div>
        </section>
    );
}
