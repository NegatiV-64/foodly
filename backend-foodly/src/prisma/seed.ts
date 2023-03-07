import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { slugify } from '../shared/utils/slugify.util';
const prisma = new PrismaClient();

async function main() {
    await addAdminUser();
    await addManagerUser();
    await addDeliveryUser();
    await addCustomerUser();
    await addCategories();
}

main()
    .then(() => console.log('⚡ Seeding completed successfully'))
    .catch(e => {
        console.log('⚡ Seeding failed');
        console.log(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

async function addAdminUser() {
    // Check if admin with email test@test.com exists
    const adminUser = await prisma.user.findUnique({
        where: {
            user_email: 'admin@test.com',
        },
    });

    // If admin does not exist, create it
    if (!adminUser) {
        await prisma.user.create({
            data: {
                user_email: 'admin@test.com',
                user_password: await hash('admin'),
                user_firstname: 'Admin',
                user_lastname: 'Adminer',
                user_type: 'ADMIN',
                user_phone: '123456789',
                user_address: 'Admin street 1',
                user_is_verified: true,
            }
        });
    }
}

async function addManagerUser() {
    // Check if manager with email manager@test.com exists
    const managerUser = await prisma.user.findUnique({
        where: {
            user_email: 'manager@test.com',
        }
    });

    // If manager does not exist, create it
    if (!managerUser) {
        await prisma.user.create({
            data: {
                user_email: 'manager@test.com',
                user_password: await hash('manager'),
                user_firstname: 'Manager',
                user_lastname: 'Managerer',
                user_type: 'MANAGER',
                user_phone: '123456789',
                user_is_verified: true,
            }
        });
    }
}

async function addDeliveryUser() {
    // Check if delivery user with email delivery@test.com exists
    const deliveryUser = await prisma.user.findUnique({
        where: {
            user_email: 'delivery@test.com'
        }
    });

    // If delivery user does not exist, create it
    if (!deliveryUser) {
        await prisma.user.create({
            data: {
                user_email: 'delivery@test.com',
                user_password: await hash('delivery'),
                user_firstname: 'Delivery',
                user_lastname: 'Deliveryer',
                user_type: 'DELIVERY_BOY',
                user_phone: '123456789',
                user_is_verified: true,
            }
        });
    }
}

async function addCustomerUser() {
    await prisma.user.upsert({
        where: {
            user_email: 'customer@test.com'
        },
        create: {
            user_email: 'customer@test.com',
            user_password: await hash('customer'),
            user_firstname: 'Customer',
            user_lastname: 'Customerer',
            user_type: 'CUSTOMER',
            user_phone: '123456789',
            user_is_verified: true,
        },
        update: {}
    });
}

async function addCategories() {
    const categories = [
        {
            category_name: 'Pizza',
            category_icon: '🍕'
        },
        {
            category_name: 'Burger',
            category_icon: '🍔'
        },
        {
            category_name: 'Hot Dog',
            category_icon: '🌭'
        },
        {
            category_name: 'Sandwich',
            category_icon: '🥪'
        },
        {
            category_name: 'Salad',
            category_icon: '🥗'
        },
        {
            category_name: 'Drinks',
            category_icon: '🥤',
        },
        {
            category_name: 'Snacks',
            category_icon: '🍟'
        },
        {
            category_name: 'Longers',
            category_icon: '🌯'
        }
    ];

    await prisma.category.createMany({
        data: categories.map((category) => ({
            ...category,
            category_slug: slugify(category.category_name)
        })),
        skipDuplicates: true
    });
}