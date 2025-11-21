import {
    Coffee, Pizza, Sandwich, Cookie, IceCream, Cake, Croissant,
    Beer, Wine, Martini, Milk, Droplet, Soup, Salad, Fish,
    Beef, Drumstick, Egg, Apple, Banana, Cherry, Grape, Citrus,
    Candy, Donut, Popcorn, Utensils, ChefHat
} from 'lucide-react';

/**
 * Smart Icon Matcher
 * Automatically assigns appropriate icons to menu items based on their names
 * @param {string} itemName - The name of the menu item
 * @returns {React.Component} - The matching Lucide icon component
 */
export const getIconForItem = (itemName) => {
    const name = itemName.toLowerCase();

    // Beverages - Hot
    if (name.includes('chai') || name.includes('tea') || name.includes('coffee') || name.includes('espresso') || name.includes('latte') || name.includes('cappuccino') || name.includes('mocha')) {
        return Coffee;
    }

    // Beverages - Cold
    if (name.includes('juice') || name.includes('smoothie') || name.includes('shake') || name.includes('water') || name.includes('soda')) {
        return Droplet;
    }

    if (name.includes('milk') || name.includes('lassi') || name.includes('buttermilk')) {
        return Milk;
    }

    if (name.includes('beer') || name.includes('ale')) {
        return Beer;
    }

    if (name.includes('wine')) {
        return Wine;
    }

    if (name.includes('cocktail') || name.includes('martini') || name.includes('mojito')) {
        return Martini;
    }

    // Main Dishes
    if (name.includes('pizza')) {
        return Pizza;
    }

    if (name.includes('sandwich') || name.includes('burger') || name.includes('wrap') || name.includes('roll')) {
        return Sandwich;
    }

    if (name.includes('soup') || name.includes('broth') || name.includes('stew')) {
        return Soup;
    }

    if (name.includes('salad') || name.includes('greens')) {
        return Salad;
    }

    if (name.includes('fish') || name.includes('seafood') || name.includes('prawn') || name.includes('shrimp')) {
        return Fish;
    }

    if (name.includes('beef') || name.includes('steak') || name.includes('mutton') || name.includes('lamb')) {
        return Beef;
    }

    if (name.includes('chicken') || name.includes('wings') || name.includes('drumstick') || name.includes('poultry')) {
        return Drumstick;
    }

    if (name.includes('egg') || name.includes('omelette') || name.includes('scrambled')) {
        return Egg;
    }

    // Snacks & Sides
    if (name.includes('fries') || name.includes('chips') || name.includes('nachos') || name.includes('popcorn')) {
        return Popcorn;
    }

    if (name.includes('samosa') || name.includes('pakora') || name.includes('bhaji') || name.includes('vada')) {
        return ChefHat;
    }

    // Desserts & Sweets
    if (name.includes('cake') || name.includes('pastry') || name.includes('tart')) {
        return Cake;
    }

    if (name.includes('cookie') || name.includes('biscuit') || name.includes('cracker')) {
        return Cookie;
    }

    if (name.includes('donut') || name.includes('doughnut')) {
        return Donut;
    }

    if (name.includes('ice cream') || name.includes('gelato') || name.includes('frozen')) {
        return IceCream;
    }

    if (name.includes('croissant') || name.includes('bread') || name.includes('bun') || name.includes('toast')) {
        return Croissant;
    }

    if (name.includes('candy') || name.includes('chocolate') || name.includes('sweet') || name.includes('toffee')) {
        return Candy;
    }

    // Fruits
    if (name.includes('apple')) {
        return Apple;
    }

    if (name.includes('banana')) {
        return Banana;
    }

    if (name.includes('cherry')) {
        return Cherry;
    }

    if (name.includes('grape')) {
        return Grape;
    }

    if (name.includes('orange') || name.includes('lemon') || name.includes('lime') || name.includes('citrus')) {
        return Citrus;
    }

    // Default fallback
    return Utensils;
};

/**
 * Get icon name as string (useful for debugging or display)
 * @param {string} itemName - The name of the menu item
 * @returns {string} - The name of the icon
 */
export const getIconName = (itemName) => {
    const IconComponent = getIconForItem(itemName);
    return IconComponent.displayName || IconComponent.name || 'Utensils';
};
