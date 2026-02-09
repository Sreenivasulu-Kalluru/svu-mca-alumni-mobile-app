export const getImageUrl = (path: string | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${
    path.startsWith('/') ? '' : '/'
  }${path}`;
};
