import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo landlord user
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@rentapp.com' },
    update: {},
    create: {
      email: 'demo@rentapp.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Landlord',
      phone: '555-123-4567',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      ownerId: user.id,
      name: 'Sunset Apartments Unit 101',
      type: 'APARTMENT',
      status: 'OCCUPIED',
      street: '123 Sunset Blvd',
      unit: '101',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 850,
      yearBuilt: 1985,
      description: 'Cozy 2-bedroom apartment with updated kitchen',
      amenities: ['Parking', 'Laundry', 'Pool'],
      monthlyRent: 2200,
      securityDeposit: 2200,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      ownerId: user.id,
      name: 'Oak Street House',
      type: 'SINGLE_FAMILY',
      status: 'AVAILABLE',
      street: '456 Oak Street',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      yearBuilt: 1972,
      description: 'Charming single-family home with backyard',
      amenities: ['Garage', 'Backyard', 'Central AC'],
      monthlyRent: 3500,
      securityDeposit: 3500,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      ownerId: user.id,
      name: 'Downtown Condo 5B',
      type: 'CONDO',
      status: 'OCCUPIED',
      street: '789 Main Street',
      unit: '5B',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90015',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 650,
      yearBuilt: 2015,
      description: 'Modern downtown condo with city views',
      amenities: ['Gym', 'Rooftop', 'Concierge', 'Parking'],
      monthlyRent: 2800,
      securityDeposit: 2800,
    },
  });

  console.log('✅ Created 3 sample properties');

  // Create sample tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      ownerId: user.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '555-234-5678',
      status: 'ACTIVE',
      employer: 'Tech Corp',
      employerPosition: 'Software Engineer',
      monthlyIncome: 8500,
      emergencyContactName: 'Michael Johnson',
      emergencyContactPhone: '555-345-6789',
      emergencyRelationship: 'Brother',
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      ownerId: user.id,
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@email.com',
      phone: '555-456-7890',
      status: 'ACTIVE',
      employer: 'Marketing Agency',
      employerPosition: 'Marketing Manager',
      monthlyIncome: 7200,
      emergencyContactName: 'Lisa Chen',
      emergencyContactPhone: '555-567-8901',
      emergencyRelationship: 'Spouse',
    },
  });

  const tenant3 = await prisma.tenant.create({
    data: {
      ownerId: user.id,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '555-678-9012',
      status: 'PENDING',
      employer: 'Healthcare Inc',
      employerPosition: 'Nurse',
      monthlyIncome: 6500,
    },
  });

  console.log('✅ Created 3 sample tenants');

  // Create sample leases
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const sixMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 6, 1);

  const lease1 = await prisma.lease.create({
    data: {
      propertyId: property1.id,
      tenantId: tenant1.id,
      ownerId: user.id,
      type: 'FIXED',
      status: 'ACTIVE',
      startDate: oneYearAgo,
      endDate: oneYearFromNow,
      monthlyRent: 2200,
      securityDeposit: 2200,
      securityDepositPaid: true,
      lateFeeAmount: 100,
      lateFeeGracePeriodDays: 5,
      paymentDueDay: 1,
    },
  });

  const lease2 = await prisma.lease.create({
    data: {
      propertyId: property3.id,
      tenantId: tenant2.id,
      ownerId: user.id,
      type: 'FIXED',
      status: 'ACTIVE',
      startDate: sixMonthsAgo,
      endDate: sixMonthsFromNow,
      monthlyRent: 2800,
      securityDeposit: 2800,
      securityDepositPaid: true,
      lateFeeAmount: 150,
      lateFeeGracePeriodDays: 5,
      paymentDueDay: 1,
    },
  });

  console.log('✅ Created 2 sample leases');

  // Create sample payments
  const payments = [];

  // Create payments for the last 3 months for lease1
  for (let i = 2; i >= 0; i--) {
    const paymentDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    payments.push({
      leaseId: lease1.id,
      tenantId: tenant1.id,
      propertyId: property1.id,
      ownerId: user.id,
      type: 'RENT' as const,
      status: 'COMPLETED' as const,
      amount: 2200,
      totalAmount: 2200,
      method: 'BANK_TRANSFER' as const,
      dueDate: paymentDate,
      paidDate: new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 3),
      periodStart,
      periodEnd,
    });
  }

  // Create payments for lease2
  for (let i = 2; i >= 0; i--) {
    const paymentDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    payments.push({
      leaseId: lease2.id,
      tenantId: tenant2.id,
      propertyId: property3.id,
      ownerId: user.id,
      type: 'RENT' as const,
      status: i === 0 ? 'PENDING' as const : 'COMPLETED' as const,
      amount: 2800,
      totalAmount: 2800,
      method: i === 0 ? null : 'ZELLE' as const,
      dueDate: paymentDate,
      paidDate: i === 0 ? null : new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1),
      periodStart,
      periodEnd,
    });
  }

  await prisma.payment.createMany({ data: payments });

  console.log('✅ Created 6 sample payments');

  // Create sample reminders
  await prisma.reminder.createMany({
    data: [
      {
        ownerId: user.id,
        type: 'LEASE_EXPIRATION',
        title: 'Lease expiring soon - Sunset Apartments 101',
        description: 'Sarah Johnson\'s lease expires in 30 days. Consider sending renewal offer.',
        dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        relatedEntityId: lease1.id,
        relatedEntityType: 'lease',
      },
      {
        ownerId: user.id,
        type: 'RENT_DUE',
        title: 'Rent due - Downtown Condo 5B',
        description: 'David Chen\'s rent payment is due.',
        dueDate: new Date(now.getFullYear(), now.getMonth(), 1),
        relatedEntityId: lease2.id,
        relatedEntityType: 'payment',
      },
      {
        ownerId: user.id,
        type: 'INSPECTION',
        title: 'Annual inspection - Oak Street House',
        description: 'Schedule annual property inspection.',
        dueDate: new Date(now.getFullYear(), now.getMonth() + 2, 15),
        relatedEntityId: property2.id,
        relatedEntityType: 'property',
      },
    ],
  });

  console.log('✅ Created 3 sample reminders');

  console.log('🎉 Database seeding completed!');
  console.log('\n📧 Demo login credentials:');
  console.log('   Email: demo@rentapp.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
