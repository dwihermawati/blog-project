const getInitials = (name: string): string => {
  if (!name) return '';
  const words = name.trim().split(' ').filter(Boolean);

  const initials = words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '');
  return initials.join('');
};
export default getInitials;
