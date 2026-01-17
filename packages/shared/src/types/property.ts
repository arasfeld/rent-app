export type PropertyType = 'single_family' | 'multi_family' | 'apartment' | 'condo' | 'townhouse' | 'commercial';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'inactive';

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  address: Address;
  units: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  description?: string;
  amenities: string[];
  monthlyRent: number;
  securityDeposit?: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreatePropertyDto {
  name: string;
  type: PropertyType;
  address: Address;
  units?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  description?: string;
  amenities?: string[];
  monthlyRent: number;
  securityDeposit?: number;
}

export interface UpdatePropertyDto {
  name?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  address?: Partial<Address>;
  units?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  description?: string;
  amenities?: string[];
  monthlyRent?: number;
  securityDeposit?: number;
}

export interface PropertyFilters {
  ownerId?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  state?: string;
  minRent?: number;
  maxRent?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
}
