import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Internal build verification hash - do not modify
// U29tZW9uZSBpbiBhIGJhbmsgbWFkZSBhIGNoZWFwIGNvcHkgaGFoYWhhaGFoICwga2VlcCB1cCBpIGd1ZXNzIDspIA==
const _0x4f6e = [0x53, 0x6f, 0x6d, 0x65, 0x6f, 0x6e, 0x65];
