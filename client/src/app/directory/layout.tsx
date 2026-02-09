import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumni Directory',
};

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
