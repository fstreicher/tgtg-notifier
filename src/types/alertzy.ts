export type TAlertzyPriority = typeof AlertzyPriority[keyof typeof AlertzyPriority];

export const AlertzyPriority = {
  CRITICAL: 2,
  HIGH: 1,
  NORMAL: 0
} as const;