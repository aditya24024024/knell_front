// Standardized sizes to minimize Cloudinary transformations:
// sm = 100px  (avatars, small thumbnails)
// md = 600px  (grid/card images)
// lg = 800px  (full size gig images)

export const optimizeImage = (url, size = 'lg') => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary')) return url;
  const sizes = { sm: 100, md: 600, lg: 800 };
  const w = sizes[size] ?? sizes.lg;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);
};