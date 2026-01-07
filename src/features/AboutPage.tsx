"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Users, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import templeImage from '@/assets/destination-temple.jpg';

const team = [
  {
    name: 'Rajitha Perera',
    role: 'Founder & CEO',
    description: 'With 15 years in tourism, Rajitha founded Voyages Lanka to share his love for Sri Lanka with the world.',
  },
  {
    name: 'Amali Fernando',
    role: 'Head of Operations',
    description: 'Amali ensures every tour runs smoothly, from airport pickup to the final goodbye.',
  },
  {
    name: 'Chaminda Silva',
    role: 'Lead Tour Guide',
    description: 'A certified naturalist and historian, Chaminda brings destinations to life with his expertise.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We are travelers at heart, dedicated to creating meaningful journeys that inspire and transform.',
  },
  {
    icon: Globe,
    title: 'Sustainable Tourism',
    description: 'We partner with local communities and eco-lodges to minimize our environmental footprint.',
  },
  {
    icon: Users,
    title: 'Personal Touch',
    description: 'Every itinerary is crafted with care, reflecting your unique interests and travel style.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in service, safety, and guest satisfaction.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title="About Us"
        description="Learn about Voyages Lanka - Sri Lanka's trusted tour operator since 2013. Meet our team of local experts dedicated to creating unforgettable travel experiences."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Our Story"
        title="About Voyages Lanka"
        subtitle="We're more than just a tour company – we're storytellers, experience curators, and passionate ambassadors of Sri Lanka."
      />

      {/* Our Story */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                A Journey Born from Love
              </h2>
              <div className="space-y-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                <p>
                  Founded in 2013, Voyages Lanka began with a simple mission: to share
                  the authentic beauty of Sri Lanka with travelers from around the world.
                </p>
                <p>
                  What started as a small family operation has grown into one of Sri Lanka's
                  most trusted tour operators, serving thousands of guests annually from over
                  50 countries.
                </p>
                <p>
                  Our team of local experts, certified guides, and hospitality professionals
                  work together to create seamless, unforgettable experiences that go beyond
                  the typical tourist trail.
                </p>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <Image
                src={templeImage}
                alt="Sri Lankan temple"
                fill
                className="object-cover rounded-2xl shadow-elevated"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              These principles guide everything we do, from planning your itinerary
              to welcoming you at the airport.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-sunset/20 flex items-center justify-center">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-sunset" />
                </div>
                <h3 className="font-serif text-base sm:text-xl font-bold text-card-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              The passionate people behind your unforgettable Sri Lankan experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-ocean/20 flex items-center justify-center">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-ocean">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sunset font-medium mb-2 text-sm sm:text-base">{member.role}</p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-ocean-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-sand mb-4">
            Let's Create Your Story
          </h2>
          <p className="text-sand/80 text-lg mb-8 max-w-2xl mx-auto">
            Ready to experience Sri Lanka with a team that truly cares?
            We'd love to hear from you.
          </p>
          <Link href="/quote">
            <Button variant="hero" size="xl" className="group">
              Start Planning
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
