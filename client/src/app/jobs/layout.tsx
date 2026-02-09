import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Board',
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
