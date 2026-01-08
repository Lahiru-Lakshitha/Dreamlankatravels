"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Users, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import templeImage from '@/assets/destination-temple.jpg';

import teamRajitha from '@/assets/team/team-rajitha.png';
import teamAmali from '@/assets/team/team-amali.png';
import teamChaminda from '@/assets/team/team-chaminda.png';

const team = [
  {
    name: 'Rajitha Perera',
    role: 'Founder & CEO',
    image: teamRajitha,
    description: 'With 15 years in tourism, Rajitha founded Dream Lanka Travels to share his love for Sri Lanka with the world.',
  },
  {
    name: 'Amali Fernando',
    role: 'Head of Operations',
    image: teamAmali,
    description: 'Amali ensures every tour runs smoothly, from airport pickup to the final goodbye.',
  },
  {
    name: 'Chaminda Silva',
    role: 'Lead Tour Guide',
    image: teamChaminda,
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
        description="Learn about Dream Lanka Travels - Sri Lanka's trusted tour operator since 2013. Meet our team of local experts dedicated to creating unforgettable travel experiences."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Our Story"
        title="About Dream Lanka Travels"
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
                  Founded in 2013, Dream Lanka Travels began with a simple mission: to share
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
            <div className="relative order-first lg:order-last h-[400px] lg:h-[500px] w-full">
              {/* Main Image with Premium Styling */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-700">
                <Image
                  src={templeImage}
                  alt="Travelers exploring ancient Sri Lankan heritage"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute bottom-8 -left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-elevated max-w-xs animate-float border border-white/40 hidden md:block">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-ocean/10 rounded-full text-ocean">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Trusted Excellence</p>
                    <p className="text-ocean-dark font-serif font-bold text-lg">Since 2013</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-ocean text-white flex items-center justify-center text-[10px] font-bold">+15k</div>
                  </div>
                  <div className="text-xs font-medium text-ocean-dark">Happy Travelers</div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-ocean/10 rounded-[2.5rem]" />
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
              <div key={value.title} className="bg-card dark:bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-card dark:shadow-none border border-transparent dark:border-white/10 hover:border-sunset/20 transition-all text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-sunset/20 flex items-center justify-center">
                  <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-sunset" />
                </div>
                <h3 className="font-serif text-base sm:text-xl font-bold text-card-foreground dark:text-cream-50 mb-2">
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
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-sunset font-medium tracking-wide uppercase text-sm mb-3 block">
              Meet Our Experts
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ocean-dark mb-6">
              The People Behind the Journey
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Local experts. Global standards. Meet the passionate team dedicated to crafting your unforgettable Sri Lankan experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="group bg-white dark:bg-white/5 rounded-[2rem] p-4 shadow-lg hover:shadow-2xl dark:shadow-none dark:hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-black/5 dark:border-white/10"
              >
                <div className="relative h-80 w-full overflow-hidden rounded-[1.5rem] mb-6 shadow-md dark:shadow-none">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[1.02] contrast-[1.05]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="text-center px-4 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-ocean-dark dark:text-cream-50 mb-1 group-hover:text-ocean dark:group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sunset font-bold text-sm tracking-wide uppercase mb-4">{member.role}</p>
                  <p className="text-muted-foreground dark:text-muted-foreground/80 text-base leading-relaxed opacity-90">
                    {member.description}
                  </p>
                </div>
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
