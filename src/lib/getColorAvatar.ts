const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const getColorAvatar = (name: string) => {
  if (!name) return '#ccc';
  const trimmed = name.trim();
  const initials = trimmed
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');

  const target = initials.slice(0, 2);
  return stringToColor(target);
};
export default getColorAvatar;
