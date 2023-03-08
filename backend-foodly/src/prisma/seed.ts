import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { slugify } from '../shared/utils/slugify.util';
const prisma = new PrismaClient();

async function main() {
    await addAdminUser();
    await addManagerUser();
    await addDeliveryUser();
    await addCustomerUser();
    // await addCategories();
    // await addPizzaProducts();
    // await addBurgerProducts();
    // await addLongerProducts();
    // await addDrinksProducts();
    // await addHotDogProducts();
    // await addSandwitchProducts();
    // await addSaladProducts();
    // await addSnacksProducts();
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

async function addPizzaProducts() {
    type Pizza = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const pizzas: Pizza[] = [
        {
            product_name: 'Salsa',
            product_description: 'Chicken, salsa sauce, tender mozzarella cheese, jalapenos, bell peppers and tomatoes. Size: 32cm',
            product_price: 65000,
            product_image: 'uploads/products/salsa.png'
        },
        {
            product_name: 'Gurme',
            product_description: 'Pizza sauce, olives, pepperoni, mushrooms, oregano, tender mozzarella cheese and tomatoes. Size: 32cm',
            product_price: 65000,
            product_image: 'uploads/products/gurme.png'
        },
        {
            product_name: 'Pepperoni',
            product_description: 'Pizza sauce, pepperoni, tender mozzarella cheese and tomatoes. Size: 32cm',
            product_price: 70000,
            product_image: 'uploads/products/pepperoni.png'
        },
        {
            product_name: 'Margarita',
            product_description: 'Pizza sauce, tender mozzarella cheese and tomatoes. Size: 32cm',
            product_price: 60000,
            product_image: 'uploads/products/margarita.png'
        },
        {
            product_name: 'Hawaian',
            product_description: 'Pizza sauce, tender mozzarella cheese, pineapple and tomatoes. Size: 32cm',
            product_price: 65000,
            product_image: 'uploads/products/hawaian.png'
        },
        {
            product_name: 'Vegetarian',
            product_description: 'Tomatoes, crispy bell peppers, oregano, mushrooms and shallots paired with mozzarella cheese and olives in tomato sauce. Size: 32cm',
            product_image: 'uploads/products/vegetarian.png',
            product_price: 60000,
        },
        {
            product_name: 'Chicken',
            product_description: 'Chicken, tender mozzarella cheese, bell peppers, tomatoes and olives. Size: 32cm',
            product_price: 65000,
            product_image: 'uploads/products/chicken.png'
        },
        {
            product_name: 'Meat',
            product_description: 'Pizza sauce, pepperoni, tender mozzarella cheese, bell peppers, tomatoes and olives. Size: 32cm',
            product_price: 70000,
            product_image: 'uploads/products/meat.png'
        },
        {
            product_name: 'Sicilian',
            product_description: 'Pizza sauce, tender mozzarella cheese, bell peppers, tomatoes and olives. Size: 32cm',
            product_price: 65000,
            product_image: 'uploads/products/sicilian.png'
        },
        {
            product_name: 'Xalapeno',
            product_description: 'Turkey fillet, tender beef, shallots, tomatoes, spicy jalapeno peppers, mozzarella cheese and barbecue sauce. Size: 32cm',
            product_price: 70000,
            product_image: 'uploads/products/xalapeno.png',
        },
        {
            product_name: 'Tuna',
            product_description: 'Tuna, tender mozzarella cheese, bell peppers, tomatoes and olives. Size: 32cm',
            product_price: 62000,
            product_image: 'uploads/products/tuna.png'
        },
        {
            product_name: 'Seafood',
            product_description: 'Shrimp, tender mozzarella cheese, bell peppers, tomatoes and olives. Size: 32cm',
            product_price: 70000,
            product_image: 'uploads/products/seafood.png'
        }
    ];

    const seedablePizzas = pizzas.map((pizza) => ({
        product_price: pizza.product_price,
        product_description: pizza.product_description,
        product_name: pizza.product_name,
        product_image: pizza.product_image,
        product_category_id: 3
    }));

    await prisma.product.createMany({
        data: seedablePizzas,
    });
}

async function addBurgerProducts() {
    type Burger = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const burgers: Burger[] = [
        {
            product_name: 'Ceasar',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, iceberg lettuce, Caesar dressing',
            product_image: 'uploads/products/ceasar.png',
            product_price: 22000
        },
        {
            product_name: 'Double Chicken Cheese',
            product_description: 'Soft bun, two juicy chicken cutlets (Halal), cheddar cheese, fresh tomatoes, pickled cucumbers, iceberg lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/double-chicken-cheese.png',
            product_price: 28000
        },
        {
            product_name: 'Singer',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, iceberg lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/singer.png',
            product_price: 22000
        },
        {
            product_name: 'Hamburger',
            product_description: 'Butter bun, signature sauce, iceberg, pickles, beef patty, tomatoes, Brunswick sweet onion rings, cheddar cheese',
            product_image: 'uploads/products/hamburger.png',
            product_price: 21000
        },
        {
            product_name: 'Bigger',
            product_description: 'Soft bun, smoked beef (Halal), tender chicken fillet (Halal) in firm breading, cheddar cheese, fresh tomatoes, pickled cucumbers, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/bigger.png',
            product_price: 24000
        },
        {
            product_name: 'Barbecue Burger',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in special breading, fresh tomatoes, iceberg lettuce, mayonnaise sauce and delicious BBQ sauce with a hint of honey',
            product_image: 'uploads/products/barbecue-burger.png',
            product_price: 22000
        },
        {
            product_name: 'Classic',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, iceberg lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/classic.png',
            product_price: 20000
        },
        {
            product_name: 'Cheeseburger',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, cheddar cheese, fresh tomatoes, iceberg lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/cheeseburger.png',
            product_price: 23000
        }
    ];

    await prisma.product.createMany({
        data: burgers.map((burger) => ({
            ...burger,
            product_category_id: 4,
        })),
    });
}

async function addLongerProducts() {
    type Longer = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const longer: Longer[] = [
        {
            product_name: 'Longer Classic',
            product_description: 'Soft bun, tender chicken fillet (Halal) in branded breading, fresh tomatoes, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-classic.png',
            product_price: 17000
        },
        {
            product_name: 'Longer Rings',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-rings.png',
            product_price: 18000
        },
        {
            product_name: 'Longer Cheese',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, cheddar cheese, fresh tomatoes, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-cheese.png',
            product_price: 19000
        },
        {
            product_name: 'Longer Barbecue',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in special breading, fresh tomatoes, lettuce, mayonnaise sauce and delicious BBQ sauce with a hint of honey',
            product_image: 'uploads/products/longer-barbecue.png',
            product_price: 18000
        },
        {
            product_name: 'Longer Ceasar',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, lettuce, Caesar dressing',
            product_image: 'uploads/products/longer-ceasar.png',
            product_price: 17000
        },
        {
            product_name: 'Longer Tandoor',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-tandoor.png',
            product_price: 20000
        },
        {
            product_name: 'Longer Double',
            product_description: 'Soft bun, two juicy chicken cutlets (Halal), cheddar cheese, fresh tomatoes, pickled cucumbers, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-double.png',
            product_price: 23000
        },
        {
            product_name: 'Longer Xalapeno',
            product_description: 'Soft bun, juicy chicken cutlet (Halal) in firm breading, fresh tomatoes, lettuce, mayonnaise and ketchup sauces',
            product_image: 'uploads/products/longer-xalapeno.png',
            product_price: 21000
        }
    ];

    await prisma.product.createMany({
        data: longer.map((longer) => ({
            ...longer,
            product_category_id: 10,
        })),
    });
}

async function addDrinksProducts() {
    type Drink = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const drinks: Drink[] = [
        {
            product_name: 'Coca-Cola 0.5L',
            product_description: 'Coca-Cola bottle 0.5L. Good addition to any meal',
            product_image: 'uploads/products/coca-cola-0.5l.png',
            product_price: 7000
        },
        {
            product_name: 'Fanta 0.5L',
            product_description: 'Fanta bottle 0.5L. Good addition to any meal',
            product_image: 'uploads/products/fanta-0.5l.png',
            product_price: 7000
        },
        {
            product_name: 'Sprite 0.5L',
            product_description: 'Sprite bottle 0.5L. Good addition to any meal',
            product_image: 'uploads/products/sprite-0.5l.png',
            product_price: 7000
        },
        {
            product_name: 'Mohito',
            product_description: 'Natural, ice-cold drink with lemon and mint. Good addition to any meal',
            product_image: 'uploads/products/mohito.png',
            product_price: 15000
        },
        {
            product_name: 'Ice Tea',
            product_description: 'Natural, ice-cold drink with lemon and mint. Good addition to any meal',
            product_image: 'uploads/products/ice-tea.png',
            product_price: 15000
        },
        {
            product_name: 'Ice Coffee Milk',
            product_description: 'Natural, ice-cold drink with coffee and milk. Good addition to any meal',
            product_image: 'uploads/products/ice-coffee-milk.png',
            product_price: 16000
        },
        {
            product_name: 'Ice Coffee Black',
            product_description: 'Natural, ice-cold drink with coffee and dark beans. Good addition to any meal',
            product_image: 'uploads/products/ice-coffee-black.png',
            product_price: 16000
        }
    ];

    await prisma.product.createMany({
        data: drinks.map((drink) => ({
            ...drink,
            product_category_id: 8,
        })),
    });
}

async function addHotDogProducts() {
    type HotDog = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const hotdogs: HotDog[] = [
        {
            product_name: 'Hot Dog Classic',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions',
            product_image: 'uploads/products/hot-dog-classic.png',
            product_price: 11000
        },
        {
            product_name: 'Hot Dog Cheese',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese',
            product_image: 'uploads/products/hot-dog-cheese.png',
            product_price: 12000
        },
        {
            product_name: 'Hot Dog Xalapeno',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese, xalapeno',
            product_image: 'uploads/products/hot-dog-xalapeno.png',
            product_price: 15000
        },
        {
            product_name: 'Hot Dog King',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese, xalapeno, bacon',
            product_image: 'uploads/products/hot-dog-king.png',
            product_price: 20000
        }
    ];

    await prisma.product.createMany({
        data: hotdogs.map((hotdog) => ({
            ...hotdog,
            product_category_id: 5,
        })),
    });
}

async function addSandwitchProducts() {
    type Sandwitch = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const sandwitches: Sandwitch[] = [
        {
            product_name: 'Sandwitch Classic',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions',
            product_image: 'uploads/products/sandwitch-classic.png',
            product_price: 27000
        },
        {
            product_name: 'Sandwitch Cheese',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese',
            product_image: 'uploads/products/sandwitch-cheese.png',
            product_price: 28000
        },
        {
            product_name: 'Sandwitch Xalapeno',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese, xalapeno',
            product_image: 'uploads/products/sandwitch-xalapeno.png',
            product_price: 31000
        },
        {
            product_name: 'Sandwitch King',
            product_description: 'Lush bun, sausage, ketchup, mayonnaise, squash caviar, cucumbers, tomatoes, onions, cheddar cheese, xalapeno, bacon',
            product_image: 'uploads/products/sandwitch-king.png',
            product_price: 32000
        }
    ];

    await prisma.product.createMany({
        data: sandwitches.map((sandwitch) => ({
            ...sandwitch,
            product_category_id: 6,
        })),
    });

}

async function addSaladProducts() {
    type Salad = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const salads: Salad[] = [
        {
            product_name: 'Greek Salad',
            product_description: 'Salad of juicy lettuce leaves, tomatoes, olives, fresh cucumbers and fetax cheese, seasoned with lemon sauce and basil sauce',
            product_image: 'uploads/products/greek-salad.png',
            product_price: 21000
        },
        {
            product_name: 'Caesar Salad',
            product_description: 'Salad of juicy lettuce leaves, tomatoes, olives, fresh cucumbers and fetax cheese, seasoned with lemon sauce and basil sauce',
            product_image: 'uploads/products/caesar-salad.png',
            product_price: 19000
        },
        {
            product_name: 'Sezam Salad',
            product_description: 'Salad of juicy lettuce leaves, tomatoes, olives, fresh cucumbers and fetax cheese, seasoned with lemon sauce and basil sauce',
            product_image: 'uploads/products/sezam-salad.png',
            product_price: 18000
        },
        {
            product_name: 'Coulslaw Salad',
            product_description: 'Salad of juicy lettuce leaves, tomatoes, olives, fresh cucumbers and fetax cheese, seasoned with lemon sauce and basil sauce',
            product_image: 'uploads/products/coulslaw-salad.png',
            product_price: 17000
        }
    ];

    await prisma.product.createMany({
        data: salads.map((salad) => ({
            ...salad,
            product_category_id: 7,
        })),
    });
}

async function addSnacksProducts() {
    type Snack = {
        product_name: string;
        product_description: string;
        product_price: number;
        product_image: string;
    };

    const snacks: Snack[] = [
        {
            product_name: 'French Fries',
            product_description: 'French fries with ketchup',
            product_image: 'uploads/products/french-fries.png',
            product_price: 10000
        },
        {
            product_name: 'Chicken Wings',
            product_description: 'Chicken wings with ketchup. 5 pieces',
            product_image: 'uploads/products/chicken-wings.png',
            product_price: 15000
        },
        {
            product_name: 'Xalapeno Snacks',
            product_description: 'Xalapeno snacks. Go well with any meal. 4 pieces',
            product_image: 'uploads/products/xalapeno-snacks.png',
            product_price: 5000
        },
        {
            product_name: 'Rustic Potatoes',
            product_description: 'Rustic potatoes with ketchup',
            product_image: 'uploads/products/rustic-potatoes.png',
            product_price: 14000
        }
    ];

    await prisma.product.createMany({
        data: snacks.map((snack) => ({
            ...snack,
            product_category_id: 9,
        })),
    });
}