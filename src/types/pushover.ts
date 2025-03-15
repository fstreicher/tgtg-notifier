export type TPushoverPriority = typeof PushoverPriority[keyof typeof PushoverPriority];

export const PushoverPriority = {
  LOWEST: -2,
  LOW: -1,
  NORMAL: 0,
  HIGH: 1,
  EMERGENCY: 2
} as const;
