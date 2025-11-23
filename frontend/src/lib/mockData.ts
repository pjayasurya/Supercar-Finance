export const mockVehicles = [
  {
    id: '1',
    make: 'Ferrari',
    model: '488 Pista',
    year: 2020,
    price: 350000,
    mileage: 5000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    dealer_id: 'd1',
    status: 'available',
  },
  {
    id: '2',
    make: 'Lamborghini',
    model: 'Huracán EVO',
    year: 2021,
    price: 280000,
    mileage: 2500,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    dealer_id: 'd1',
    status: 'available',
  },
  {
    id: '3',
    make: 'McLaren',
    model: '720S',
    year: 2019,
    price: 295000,
    mileage: 8000,
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    dealer_id: 'd2',
    status: 'available',
  },
  {
    id: '4',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    price: 320000,
    mileage: 1200,
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    dealer_id: 'd2',
    status: 'available',
  },
  {
    id: '5',
    make: 'Aston Martin',
    model: 'DBS Superleggera',
    year: 2022,
    price: 315000,
    mileage: 3000,
    image: 'https://images.unsplash.com/photo-1600712242805-5f7c3a7a8deb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    dealer_id: 'd1',
    status: 'available',
  },
];

export const mockPreApprovals = [
  {
    lender_name: 'Chase Auto',
    apr: 5.99,
    term: 72,
    max_amount: 400000,
    monthly_payment: 4800,
    status: 'approved',
  },
  {
    lender_name: 'Bank of America',
    apr: 6.25,
    term: 60,
    max_amount: 350000,
    monthly_payment: 5100,
    status: 'approved',
  },
  {
    lender_name: 'Ally Financial',
    apr: 6.50,
    term: 84,
    max_amount: 450000,
    monthly_payment: 4200,
    status: 'approved',
  },
];

export const mockCreditAnalysis = {
  score: 785,
  factors: [
    { name: 'Payment History', status: 'Excellent' },
    { name: 'Credit Utilization', status: 'Good' },
    { name: 'Length of Credit History', status: 'Excellent' },
    { name: 'New Credit', status: 'Good' },
    { name: 'Credit Mix', status: 'Excellent' },
  ],
};

export const mockApplication = {
  id: 'app_123',
  status: 'pre_approved',
  created_at: new Date().toISOString(),
};
