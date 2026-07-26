import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function getShortMonthNameFromDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(date);
}

export function getDateStrFromDate(date: Date): string {
  // YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA").format(date);
}

export function formatCustomDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function parseCustomDate(dateStr: string): Date {
  const date = new Date(dateStr.replace(" ", "T"));

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  return date;
}

export function isValidDateTime(dateStr: string): boolean {
  const formattedString = dateStr.replace(" ", "T");
  const timestamp = Date.parse(formattedString);

  return !isNaN(timestamp);
}
