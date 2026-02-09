import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to join the SVU MCA Alumni network.',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
