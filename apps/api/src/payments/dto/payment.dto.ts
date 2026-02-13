import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsString()
  leaseId: string;

  @IsEnum([
    'RENT',
    'SECURITY_DEPOSIT',
    'LATE_FEE',
    'MAINTENANCE',
    'UTILITY',
    'OTHER',
  ])
  type:
    | 'RENT'
    | 'SECURITY_DEPOSIT'
    | 'LATE_FEE'
    | 'MAINTENANCE'
    | 'UTILITY'
    | 'OTHER';

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFee?: number;

  @IsOptional()
  @IsEnum([
    'CASH',
    'CHECK',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'VENMO',
    'ZELLE',
    'OTHER',
  ])
  method?:
    | 'CASH'
    | 'CHECK'
    | 'BANK_TRANSFER'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'VENMO'
    | 'ZELLE'
    | 'OTHER';

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RecordPaymentDto {
  @IsString()
  leaseId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum([
    'CASH',
    'CHECK',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'VENMO',
    'ZELLE',
    'OTHER',
  ])
  method:
    | 'CASH'
    | 'CHECK'
    | 'BANK_TRANSFER'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'VENMO'
    | 'ZELLE'
    | 'OTHER';

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'])
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lateFee?: number;

  @IsOptional()
  @IsEnum([
    'CASH',
    'CHECK',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'VENMO',
    'ZELLE',
    'OTHER',
  ])
  method?:
    | 'CASH'
    | 'CHECK'
    | 'BANK_TRANSFER'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'VENMO'
    | 'ZELLE'
    | 'OTHER';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PaymentQueryDto {
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
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'])
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

  @IsOptional()
  @IsEnum([
    'RENT',
    'SECURITY_DEPOSIT',
    'LATE_FEE',
    'MAINTENANCE',
    'UTILITY',
    'OTHER',
  ])
  type?:
    | 'RENT'
    | 'SECURITY_DEPOSIT'
    | 'LATE_FEE'
    | 'MAINTENANCE'
    | 'UTILITY'
    | 'OTHER';

  @IsOptional()
  @IsEnum([
    'CASH',
    'CHECK',
    'BANK_TRANSFER',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'VENMO',
    'ZELLE',
    'OTHER',
  ])
  method?:
    | 'CASH'
    | 'CHECK'
    | 'BANK_TRANSFER'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'VENMO'
    | 'ZELLE'
    | 'OTHER';

  @IsOptional()
  @IsString()
  leaseId?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;
}
