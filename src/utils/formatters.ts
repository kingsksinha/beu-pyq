/**
 * Formats semester number (1, 2, 3, 4) into engineering academic year label.
 */
export const formatBTechYear = (sem: number | string | undefined | null): string => {
  if (sem === undefined || sem === null || sem === '' || sem === 'ALL') {
    return 'All Years';
  }
  const n = typeof sem === 'string' ? parseInt(sem, 10) : sem;
  switch (n) {
    case 1:
      return '1st Year';
    case 2:
      return '2nd Year';
    case 3:
      return '3rd Year';
    case 4:
      return '4th Year';
    default:
      return !isNaN(n) && n > 0 ? `Year ${n}` : 'All Years';
  }
};
