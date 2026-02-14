import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export class AddressDto {
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsEnum([
    'SINGLE_FAMILY',
    'MULTI_FAMILY',
    'APARTMENT',
    'CONDO',
    'TOWNHOUSE',
    'COMMERCIAL',
  ])
  type:
    | 'SINGLE_FAMILY'
    | 'MULTI_FAMILY'
    | 'APARTMENT'
    | 'CONDO'
    | 'TOWNHOUSE'
    | 'COMMERCIAL';

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsNumber()
  @Min(1)
  units?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  squareFeet?: number;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(2100)
  yearBuilt?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  securityDeposit?: number;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum([
    'SINGLE_FAMILY',
    'MULTI_FAMILY',
    'APARTMENT',
    'CONDO',
    'TOWNHOUSE',
    'COMMERCIAL',
  ])
  type?:
    | 'SINGLE_FAMILY'
    | 'MULTI_FAMILY'
    | 'APARTMENT'
    | 'CONDO'
    | 'TOWNHOUSE'
    | 'COMMERCIAL';

  @IsOptional()
  @IsEnum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE'])
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: Partial<AddressDto>;

  @IsOptional()
  @IsNumber()
  @Min(1)
  units?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  squareFeet?: number;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(2100)
  yearBuilt?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  securityDeposit?: number;
}

export class PropertyQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'INACTIVE'])
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE';

  @IsOptional()
  @IsEnum([
    'SINGLE_FAMILY',
    'MULTI_FAMILY',
    'APARTMENT',
    'CONDO',
    'TOWNHOUSE',
    'COMMERCIAL',
  ])
  type?:
    | 'SINGLE_FAMILY'
    | 'MULTI_FAMILY'
    | 'APARTMENT'
    | 'CONDO'
    | 'TOWNHOUSE'
    | 'COMMERCIAL';

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minRent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxRent?: number;
}
