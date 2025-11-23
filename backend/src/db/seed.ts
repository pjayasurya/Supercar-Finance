import { db } from './connection.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    try {
        console.log('🌱 Starting database seed...');

        // 1. Seed Lenders
        console.log('Seeding lenders...');
        await db.query(`DELETE FROM lenders`); // Clear existing

        const lenders = [
            {
                id: 'lender_prestige',
                name: 'Prestige Financial Group',
                min_loan: 50000,
                max_loan: 2000000,
                min_apr: 3.99,
                max_apr: 8.99,
                supported_states: ['CA', 'FL', 'NY', 'TX', 'NV'],
                email: 'approvals@prestigefinancial.com'
            },
            {
                id: 'lender_luxury_capital',
                name: 'Luxury Auto Capital',
                min_loan: 100000,
                max_loan: 5000000,
                min_apr: 4.50,
                max_apr: 12.00,
                supported_states: ['CA', 'FL', 'NY', 'TX', 'NV', 'AZ', 'WA'],
                email: 'underwriting@luxurycapital.com'
            },
            {
                id: 'lender_velocity',
                name: 'Velocity Credit Union',
                min_loan: 25000,
                max_loan: 500000,
                min_apr: 2.99,
                max_apr: 7.50,
                supported_states: ['CA', 'TX', 'AZ'],
                email: 'loans@velocitycu.com'
            }
        ];

        for (const lender of lenders) {
            await db.query(
                `INSERT INTO lenders (id, name, min_loan, max_loan, min_apr, max_apr, supported_states, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, min_loan = EXCLUDED.min_loan, max_loan = EXCLUDED.max_loan,
         min_apr = EXCLUDED.min_apr, max_apr = EXCLUDED.max_apr, supported_states = EXCLUDED.supported_states`,
                [lender.id, lender.name, lender.min_loan, lender.max_loan, lender.min_apr, lender.max_apr, lender.supported_states, lender.email]
            );
        }
        console.log('✓ Lenders seeded');

        // 2. Seed Vehicles
        console.log('Seeding vehicles...');
        await db.query(`DELETE FROM vehicles`); // Clear existing

        // Generate UUIDs for dealers
        const dealer1 = uuidv4();
        const dealer2 = uuidv4();

        const vehicles = [
            {
                make: 'Ferrari',
                model: '488 GTB',
                year: 2019,
                price: 245000,
                color: 'Rosso Corsa',
                mileage: 8500,
                description: 'Pristine condition 488 GTB with carbon fiber package and racing seats. Full service history available.',
                image_url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2940&auto=format&fit=crop',
                dealer_id: dealer1
            },
            {
                make: 'Lamborghini',
                model: 'Huracán EVO',
                year: 2021,
                price: 289000,
                color: 'Verde Mantis',
                mileage: 3200,
                description: 'Stunning Huracán EVO in pearl green. AWD, lifting system, and smartphone interface included.',
                image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2874&auto=format&fit=crop',
                dealer_id: dealer1
            },
            {
                make: 'McLaren',
                model: '720S',
                year: 2020,
                price: 265000,
                color: 'Memphis Red',
                mileage: 5100,
                description: 'Performance focused 720S. Track pack, sports exhaust, and super-lightweight forged wheels.',
                image_url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2940&auto=format&fit=crop',
                dealer_id: dealer2
            },
            {
                make: 'Porsche',
                model: '911 GT3 RS',
                year: 2023,
                price: 315000,
                color: 'Lizard Green',
                mileage: 1200,
                description: 'Track weapon. Weissach package, ceramic brakes, and front axle lift system.',
                image_url: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop',
                dealer_id: dealer2
            },
            {
                make: 'Rolls-Royce',
                model: 'Ghost',
                year: 2022,
                price: 345000,
                color: 'Diamond Black',
                mileage: 4500,
                description: 'The ultimate luxury sedan. Starlight headliner, rear theatre configuration, and picnic tables.',
                image_url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2787&auto=format&fit=crop',
                dealer_id: dealer1
            },
            {
                make: 'Aston Martin',
                model: 'DBS Superleggera',
                year: 2021,
                price: 275000,
                color: 'Hyper Red',
                mileage: 6700,
                description: 'Beautiful grand tourer with V12 twin-turbo engine. Bang & Olufsen audio system.',
                image_url: 'https://images.unsplash.com/photo-1600712242805-5f78671d24da?q=80&w=2864&auto=format&fit=crop',
                dealer_id: dealer2
            }
        ];

        for (const vehicle of vehicles) {
            await db.query(
                `INSERT INTO vehicles (make, model, year, price, color, mileage, description, image_url, dealer_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'available')`,
                [vehicle.make, vehicle.model, vehicle.year, vehicle.price, vehicle.color, vehicle.mileage, vehicle.description, vehicle.image_url, vehicle.dealer_id]
            );
        }
        console.log('✓ Vehicles seeded');

        console.log('✅ Database seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database seed failed:', error);
        process.exit(1);
    }
}

seed();
