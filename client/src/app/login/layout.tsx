import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your SVU MCA Alumni account.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
