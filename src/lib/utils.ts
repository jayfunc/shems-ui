import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string) {
  if (str === '') return str;
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export function insertSpaces(str: string) {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

export function delay(ms: number) {
  new Promise(resolve => setTimeout(resolve, ms));
}

export function randomInt(min: number = 1, max: number = 100) {
  return Math.floor(Math.random() * (max - min) + min)
}