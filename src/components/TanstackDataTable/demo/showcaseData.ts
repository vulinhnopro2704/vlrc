import { padStart, random, sample, times, uniqueId } from 'lodash-es';

export type UserStatus = 'active' | 'inactive' | 'invited';
export type UserRole = 'admin' | 'manager' | 'viewer';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  balance: number;
  createdAt: string;
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogRow = {
  id: string;
  ts: string;
  level: LogLevel;
  code: string;
  message: string;
  durationMs: number;
};

export type TreeNodeType = 'org' | 'team' | 'user';

export type TreeNodeRow = {
  id: string;
  name: string;
  type: TreeNodeType;
  amount: number;
  children: TreeNodeRow[];
};

const ROLES: UserRole[] = ['admin', 'manager', 'viewer'];
const STATUSES: UserStatus[] = ['active', 'inactive', 'invited'];
const LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

const pick = <T>(values: T[], fallback: T): T => {
  const v = sample(values);
  return v === undefined ? fallback : v;
};

const isoDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const makeUsers = (count: number): UserRow[] => {
  return times(count, i => {
    const idx = i + 1;
    const suffix = padStart(String(idx), 3, '0');
    const role = pick(ROLES, 'viewer');
    const status = pick(STATUSES, 'active');

    return {
      id: uniqueId('u_'),
      name: `User ${suffix}`,
      email: `user.${suffix}@example.com`,
      role,
      status,
      balance: random(0, 250_000, true),
      createdAt: isoDate(random(0, 90))
    };
  });
};

export const makeLogs = (count: number): LogRow[] => {
  return times(count, i => {
    const idx = i + 1;
    const suffix = padStart(String(idx), 4, '0');
    const level = pick(LEVELS, 'info');

    return {
      id: uniqueId('log_'),
      ts: isoDate(random(0, 7)),
      level,
      code: `EVT_${suffix}`,
      message: `Event ${suffix} handled`,
      durationMs: random(5, 2_500)
    };
  });
};

export const makeTree = (): TreeNodeRow[] => {
  return [
    {
      id: 'org-1',
      name: 'Acme Org',
      type: 'org',
      amount: 125_000,
      children: [
        {
          id: 'team-1',
          name: 'Platform Team',
          type: 'team',
          amount: 40_500,
          children: [
            { id: 'user-1', name: 'Alice', type: 'user', amount: 10_200, children: [] },
            { id: 'user-2', name: 'Bob', type: 'user', amount: 9_850, children: [] }
          ]
        },
        {
          id: 'team-2',
          name: 'Product Team',
          type: 'team',
          amount: 84_500,
          children: [
            { id: 'user-3', name: 'Carol', type: 'user', amount: 12_300, children: [] },
            { id: 'user-4', name: 'Dan', type: 'user', amount: 8_100, children: [] }
          ]
        }
      ]
    }
  ];
};
