
/**
 * Calculates a target date based on the current date and a number of days to add
 * @param daysToAdd Number of days to add to the current date
 * @returns A Date object representing the target date
 */
export const calculateTargetDate = (targetNumber: number): Date => {
  const now = new Date();
  const daysToAdd = targetNumber * 30; // Each target adds 30 days by default
  now.setDate(now.getDate() + daysToAdd);
  return now;
};
