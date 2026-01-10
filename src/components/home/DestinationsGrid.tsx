"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';

import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

export function DestinationsGrid() {


    const destinations = [
        {
            title: t.home.pristineBeaches,
            description: t.home.goldenSands,
            image: beachImage,
            link: '/tours?type=beach',
        },
        {
            title: t.home.ancientTemples,
            description: t.home.sacredHeritage,
            image: templeImage,
            link: '/tours?type=cultural',
        },
        {
            title: t.home.wildlifeSafari,
            description: t.home.majesticElephants,
            image: wildlifeImage,
            link: '/tours?type=wildlife',
        },
        {
            title: t.home.scenicRailways,
            description: t.home.mountainJourneys,
            image: trainImage,
            link: '/tours?destination=ella',
        },
    ];

    return (
        <section className="py-12 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 max-w-3xl mx-auto">
                    <span className="text-sunset font-serif italic text-lg tracking-wider">
                        {t.home.exploreSriLanka}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-ocean-dark dark:text-white mt-2 mb-4">
                        {t.home.unforgettableDestinations}
                    </h2>
                    <p className="text-muted-foreground dark:text-white/80 text-lg leading-relaxed">
                        {t.home.destinationsSubtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest) => (
                        <Link
                            key={dest.title}
                            href={dest.link}
                            className="group block"
                        >
                            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-soft transition-all duration-700 hover:shadow-strong group-hover:-translate-y-2">
                                <Image
                                    src={dest.image}
                                    alt={dest.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                {/* Premium Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 via-ocean-dark/20 to-transparent opacity-80" />

                                {/* Content - Slide Up on Hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                        {dest.title}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {dest.description}
                                    </p>
                                    <div className="flex items-center text-sunset text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Explore Now <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/destinations">
                        <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-ocean hover:text-white transition-colors border-2">
                            {t.home.viewAllDestinations}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
