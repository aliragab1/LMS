'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Link from 'next/link';

interface FeatureType {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureType[] = [
  {
    title: 'Comprehensive Courses',
    description:
      'Access a wide range of carefully curated courses designed by industry experts.',
    icon: '📚',
  },
  {
    title: 'Interactive Learning',
    description:
      'Engage with interactive content and hands-on projects to enhance your learning experience.',
    icon: '🎮',
  },
  {
    title: 'Progress Tracking',
    description:
      'Monitor your learning journey with our advanced progress tracking features.',
    icon: '📈',
  },
  {
    title: 'Community Support',
    description:
      'Connect with a vibrant community of learners and educators for support and collaboration.',
    icon: '🤝',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={'outline'}>The Future of Online Education</Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Learning Experience
          </h1>
          <p className="max-w-3xl md:text-xl text-muted-foreground">
            Discover a new way to learn with our our modern, interactive
            learning management system. Access high-quality courses anytime,
            anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={'/courses'} className={buttonVariants({ size: 'lg' })}>
              Explore Courses
            </Link>
            <Link
              href={'/login'}
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
