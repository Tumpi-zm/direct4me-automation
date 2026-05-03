import * as fs from 'fs';
import * as path from 'path';

export interface UserCredentials {
  email: string;
  password: string;
  role: string;
  displayName: string;
  expectedRedirectPath: string;
}

export interface UsersData {
  ops: UserCredentials;
  maintainer: UserCredentials;
}

/**
 * Loads test users from data/users.json.
 * Copy data/users.example.json → data/users.json and fill in real passwords.
 */
export function loadUsers(): UsersData {
  const usersPath = path.resolve(__dirname, '../data/users.json');
  if (!fs.existsSync(usersPath)) {
    throw new Error(
      `data/users.json not found. Copy data/users.example.json to data/users.json and fill in credentials.`
    );
  }
  return JSON.parse(fs.readFileSync(usersPath, 'utf8')) as UsersData;
}

/** Formats a Date object to a readable string, e.g. "May 31, 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Returns a future date offset by the given number of days from today. */
export function futureDateByDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
