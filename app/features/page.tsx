import { SparklesIcon, DevicePhoneMobileIcon, PaintBrushIcon, Cog6ToothIcon, UserGroupIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const FEATURES = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Content',
    desc: 'Generate professional content for every section using advanced AI models.'
  },
  {
    icon: PaintBrushIcon,
    title: 'Theme Customization',
    desc: 'Switch between modern, minimal, light, and dark themes instantly.'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Live Device Preview',
    desc: 'Preview your portfolio on desktop, tablet, and mobile with realistic frames.'
  },
  {
    icon: Cog6ToothIcon,
    title: 'Step-by-Step Builder',
    desc: 'Easy, guided builder flow for About, Experience, Education, Skills, Awards, Testimonials, and Contact.'
  },
  {
    icon: UserGroupIcon,
    title: 'Multiple Entries',
    desc: 'Add multiple experiences, education, awards, testimonials, and more.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Smart Suggestions',
    desc: 'Get AI-powered suggestions for skills, degrees, fields of study, and more.'
  },
  {
    icon: StarIcon,
    title: 'Achievements & Testimonials',
    desc: 'Showcase your awards and client feedback with beautiful layouts.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Contact Form',
    desc: 'Let visitors reach out to you directly from your portfolio.'
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 bg-background text-foreground">
      <h1 className="text-4xl font-extrabold mb-4 text-center">Features</h1>
      <p className="text-lg mb-12 text-center">Explore all the powerful features of the Portfolio Builder.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-6 border border-border hover:shadow-lg transition">
            <feature.icon className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
            <p className="text-center text-foreground/80">{feature.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Go to Portfolio Builder
        </Link>
      </div>
    </div>
  );
} 