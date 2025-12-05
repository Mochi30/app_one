
export interface UsageData {
  name: string;
  kwh: number;
  cost: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'smart_plug' | 'ac' | 'light' | 'fridge' | 'tv' | 'other';
  wattage: number; // Current real-time wattage
  isOn: boolean;
  room: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  tokenCode?: string;
  kwh: number;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
}

export enum Period {
  DAILY = 'Harian',
  WEEKLY = 'Mingguan',
  MONTHLY = 'Bulanan'
}

export interface TokenPackage {
  id: string;
  price: number;
  kwh: number;
  name: string;
}

export type Screen = 'dashboard' | 'scan' | 'shop' | 'history' | 'profile' | 'notifications';

export interface User {
  name: string;
  id: string;
  meterId: string;
  balance: number;
  email: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}

export type Language = 'id' | 'en' | 'ar';
