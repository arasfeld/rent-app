import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeaseDto {
  @IsString()
  propertyId: string;

  @IsString()
  tenantId: string;

  @IsEnum(['FIXED', 'MONTH_TO_MONTH'])
  type: 'FIXED' | 'MONTH_TO_MONTH';

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @IsNumber()
  @Min(0)
  securityDeposit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFeeAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(31)
  lateFeeGracePeriodDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;

  @IsOptional()
  @IsString()
  terms?: string;
}

export class UpdateLeaseDto {
  @IsOptional()
  @IsEnum(['FIXED', 'MONTH_TO_MONTH'])
  type?: 'FIXED' | 'MONTH_TO_MONTH';

  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED'])
  status?: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'RENEWED';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  securityDeposit?: number;

  @IsOptional()
  @IsBoolean()
  securityDepositPaid?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFeeAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(31)
  lateFeeGracePeriodDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;

  @IsOptional()
  @IsString()
  terms?: string;
}

export class LeaseQueryDto {
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
  @IsEnum(['DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED'])
  status?: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'RENEWED';

  @IsOptional()
  @IsEnum(['FIXED', 'MONTH_TO_MONTH'])
  type?: 'FIXED' | 'MONTH_TO_MONTH';

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}
