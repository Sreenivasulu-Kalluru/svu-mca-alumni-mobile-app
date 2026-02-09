import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageHelper';

interface UserAvatarProps {
  user: {
    name: string;
    profilePicture?: string;
  };
  className?: string; // wrapper class
  imageClassName?: string; // image specific class
  size?: number; // size in pixels for next/image
}

export default function UserAvatar({
  user,
  className = 'w-10 h-10',
  imageClassName = 'rounded-full object-cover',
  size = 40,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getImageUrl(user.profilePicture);

  // Reset error state if profile picture changes
  useEffect(() => {
    setImageError(false);
  }, [user.profilePicture]);

  if (imageUrl && !imageError) {
    return (
      <div
        className={`relative ${className} overflow-hidden rounded-full border border-gray-100 bg-gray-50`}
      >
        <Image
          src={imageUrl}
          alt={user.name}
          width={size}
          height={size}
          className={`w-full h-full ${imageClassName}`}
          unoptimized
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold border border-blue-200`}
    >
      {(user.name || 'U').charAt(0).toUpperCase()}
    </div>
  );
}
