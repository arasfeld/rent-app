import { IsString, IsEmail, IsOptional, IsNumber, IsEnum, ValidateNested, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class EmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  relationship: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class EmploymentInfoDto {
  @IsString()
  employer: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyIncome?: number;

  @IsOptional()
  @IsString()
  employerPhone?: string;

  @IsOptional()
  @IsString()
  employerAddress?: string;
}

export class CreateTenantDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmploymentInfoDto)
  employmentInfo?: EmploymentInfoDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'PENDING', 'EVICTED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EVICTED';

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmploymentInfoDto)
  employmentInfo?: EmploymentInfoDto;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class TenantQueryDto {
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
  @IsEnum(['ACTIVE', 'INACTIVE', 'PENDING', 'EVICTED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EVICTED';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasActiveLease?: boolean;
}
