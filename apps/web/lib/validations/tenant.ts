import { z } from 'zod';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().optional(),
});

const employmentInfoSchema = z.object({
  employer: z.string().min(1, 'Employer is required'),
  position: z.string().optional(),
  monthlyIncome: z.string().optional(),
  employerPhone: z.string().optional(),
  employerAddress: z.string().optional(),
});

export const tenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: emergencyContactSchema.optional(),
  employmentInfo: employmentInfoSchema.optional(),
  notes: z.string().optional(),
});

export type TenantFormData = z.infer<typeof tenantSchema>;

// Cleaned data type for API submission
export type TenantApiData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  employmentInfo?: {
    employer: string;
    position?: string;
    monthlyIncome?: number;
    employerPhone?: string;
    employerAddress?: string;
  };
  notes?: string;
};

// Helper to clean form data for API submission
export function cleanTenantData(data: TenantFormData): TenantApiData {
  const result: TenantApiData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  };

  if (data.phone) result.phone = data.phone;
  if (data.dateOfBirth) result.dateOfBirth = data.dateOfBirth;
  if (data.notes) result.notes = data.notes;

  if (data.emergencyContact?.name) {
    result.emergencyContact = {
      name: data.emergencyContact.name,
      relationship: data.emergencyContact.relationship,
      phone: data.emergencyContact.phone,
      email: data.emergencyContact.email || undefined,
    };
  }

  if (data.employmentInfo?.employer) {
    result.employmentInfo = {
      employer: data.employmentInfo.employer,
      position: data.employmentInfo.position || undefined,
      monthlyIncome: data.employmentInfo.monthlyIncome
        ? Number(data.employmentInfo.monthlyIncome)
        : undefined,
      employerPhone: data.employmentInfo.employerPhone || undefined,
      employerAddress: data.employmentInfo.employerAddress || undefined,
    };
  }

  return result;
}
