export const generateClampInverse = (
  desktopPx: number, // smaller value (for desktop)
  mobilePx: number, // larger value (for mobile)
  containerMaxPx: number // max container width
): string => {
  // Convert pixel values to rem (assuming 1rem = 16px)
  const desktopRem = (desktopPx / 16).toFixed(2);
  const mobileRem = (mobilePx / 16).toFixed(2);

  // Define viewport range: from smallest (mobile) to largest (desktop)
  const minVwPx = 360;
  const maxVwPx = containerMaxPx;

  // Calculate how much the value should shrink per 1vw
  const preferredVwCoeff = (
    (mobilePx - desktopPx) /
    (maxVwPx - minVwPx)
  ).toFixed(6);

  // Return the final clamp() CSS string
  return `clamp(${desktopRem}rem, calc(${mobileRem}rem - ${preferredVwCoeff} * (100vw - ${minVwPx}px)), ${mobileRem}rem)`;
};
