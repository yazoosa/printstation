export function calculateSetupFee(sheetsRequired: number): number {
  const baseSetupFee = 200;
  const breakpointSize = 10;
  const reductionPerBreakpoint = 10;

  if (sheetsRequired <= 0) return 0;

  const breakpointIndex = Math.floor((sheetsRequired - 1) / breakpointSize);
  return Math.max(baseSetupFee - (breakpointIndex * reductionPerBreakpoint), 0);
}

export function roundToNearestFive(value: number): number {
  const remainder = value % 5;
  if (remainder === 0) return value;
  return remainder < 2.5 ? value - remainder : value + (5 - remainder);
}