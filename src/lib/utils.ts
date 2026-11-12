import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SHOP_CLOSE_HOUR, SHOP_OPEN_HOUR } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const shortFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const monthFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatDate(value: Date | string) {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return `${dateTimeFormatter.format(new Date(value))} WIB`;
}

export function formatShortDate(value: Date | string) {
  return shortFormatter.format(new Date(value));
}

export function formatMonthYear(value: Date | string) {
  return monthFormatter.format(new Date(value));
}

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (digits.startsWith("8")) return `0${digits}`;
  return digits;
}

export function formatPhone(phone: string) {
  const p = normalizePhone(phone);
  if (p.length < 8) return p;
  return `${p.slice(0, 4)}-${p.slice(4, 8)}-${p.slice(8)}`;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getJakartaHour(date = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );
}

export function isShopOpen(date = new Date()) {
  const hour = getJakartaHour(date);
  return hour >= SHOP_OPEN_HOUR && hour < SHOP_CLOSE_HOUR;
}
