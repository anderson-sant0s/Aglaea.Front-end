import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow as formatDistanceToNowFns } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date | string) {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNowFns(targetDate, {
    addSuffix: true,
    locale: ptBR
  })
}
