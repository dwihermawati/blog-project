import { format } from 'date-fns';

export const formatDateTime = (
  isoString: string,
  withTime: boolean = true
): string => {
  const date = new Date(isoString);
  return format(date, withTime ? 'dd MMM yyyy, HH:mm' : 'dd MMM yyyy');
};
