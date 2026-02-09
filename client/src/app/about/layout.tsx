import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Department',
  description:
    'Learn about the Department of Computer Science at SVU, our vision, mission, and faculty.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
