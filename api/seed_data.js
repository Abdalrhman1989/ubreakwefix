
// MOCK DATA for Vercel Deployment

// 1. Categories Data (Deep Tree)
const categories = [
    // 1. TELEFON TILBEHØR
    { id: 100, name: "Telefon Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff59?auto=format&fit=crop&q=80&w=400" },

    // 1.1 Beskyttelse
    { id: 110, name: "Beskyttelse", parent_id: 100 },
    { id: 111, name: "Covers", parent_id: 110 },
    { id: 112, name: "Skærmbeskyttelse", parent_id: 110 },
    { id: 113, name: "Kamera beskyttelse", parent_id: 110 },

    // 1.2 Opladning
    { id: 120, name: "Opladning", parent_id: 100 },
    { id: 121, name: "Opladere", parent_id: 120 },
    { id: 122, name: "Kabler", parent_id: 120 },
    { id: 123, name: "Powerbanks", parent_id: 120 },

    // 1.3 Holdere & Mounts
    { id: 130, name: "Holdere & Mounts", parent_id: 100 },

    // 1.4 Kamera & Content
    { id: 140, name: "Kamera & Content", parent_id: 100 },

    // 2. TABLET TILBEHØR
    { id: 200, name: "Tablet Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400" },
    { id: 210, name: "Beskyttelse", parent_id: 200 },
    { id: 211, name: "Covers", parent_id: 210 },
    { id: 212, name: "Skærmbeskyttelse", parent_id: 210 },
    { id: 220, name: "Input", parent_id: 200 }, // Tastatur, Stylus
    { id: 230, name: "Stands", parent_id: 200 },

    // 3. LAPTOP TILBEHØR
    { id: 300, name: "Laptop Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400" },
    { id: 310, name: "Transport", parent_id: 300 }, // Sleeves, Tasker
    { id: 320, name: "Opladning", parent_id: 300 },
    { id: 330, name: "Udvidelse", parent_id: 300 }, // Hubs

    // 4. SMARTWATCH
    { id: 400, name: "Smartwatch Tilbehør", parent_id: null, image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400" },
    { id: 410, name: "Remme", parent_id: 400 },
    { id: 420, name: "Beskyttelse", parent_id: 400 },

    // 5. AUDIO
    { id: 500, name: "Audio", parent_id: null, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { id: 510, name: "Headphones", parent_id: 500 },

    // 6. GAMING
    { id: 600, name: "Gaming", parent_id: null, image_url: "https://images.unsplash.com/photo-1593305841991-05c29736560e?auto=format&fit=crop&q=80&w=400" },
];

const products = [
    // --- TELEFON COVERS (Cases) ---
    {
        id: 1,
        name: "Silicone Case - iPhone 15 Pro",
        category_id: 111,
        price: 199,
        stock_quantity: 50,
        image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400",
        description: "Soft-touch silicone case with MagSafe support.",
        specs: { brand: "Apple", model: ["iPhone 15 Pro"], type: "Cover", features: ["Silicone", "MagSafe"] }
    },
    {
        id: 2,
        name: "Clear Case - iPhone 15 Pro Max",
        category_id: 111,
        price: 249,
        stock_quantity: 30,
        image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400",
        description: "Crystal clear protection that shows off your device.",
        specs: { brand: "Apple", model: ["iPhone 15 Pro Max"], type: "Cover", features: ["Transparent", "MagSafe"] }
    },
    {
        id: 3,
        name: "Rugged Armor - Samsung S24 Ultra",
        category_id: 111,
        price: 299,
        stock_quantity: 25,
        image_url: "https://images.unsplash.com/photo-1614051680183-b7884f3cc770?auto=format&fit=crop&q=80&w=400",
        description: "Heavy duty drop protection.",
        specs: { brand: "Samsung", model: ["Galaxy S24 Ultra"], type: "Cover", features: ["Rugged", "Shockproof"] }
    },

    // --- SCREEN PROTECTION ---
    {
        id: 10,
        name: "Privacy Glass - iPhone 15 Series",
        category_id: 112,
        price: 149,
        stock_quantity: 100,
        image_url: "https://images.unsplash.com/photo-1688636511175-9e6345638a5a?auto=format&fit=crop&q=80&w=400",
        description: "Keep your screen private from prying eyes.",
        specs: { brand: "Apple", model: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15 Pro Max"], type: "Glass", features: ["Privacy", "9H Hardness"] }
    },

    // --- CHARGERS ---
    {
        id: 20,
        name: "20W USB-C Fast Charger",
        category_id: 121,
        price: 149,
        stock_quantity: 60,
        image_url: "https://plus.unsplash.com/premium_photo-1675716443562-b771d72a3da7?auto=format&fit=crop&q=80&w=400",
        description: "Compact fast charger for all devices.",
        specs: { brand: "Universal", model: [], type: "Charger", features: ["Fast Charge", "GaN"] }
    },
    {
        id: 21,
        name: "MagSafe Charger",
        category_id: 121,
        price: 299,
        stock_quantity: 40,
        image_url: "https://images.unsplash.com/photo-1625510495886-0985532ed701?auto=format&fit=crop&q=80&w=400",
        description: "Snap and charge wirelessly.",
        specs: { brand: "Apple", model: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16"], type: "Charger", features: ["MagSafe", "Wireless"] }
    },

    // --- TABLET ---
    {
        id: 30,
        name: "Keyboard Folio - iPad Pro 12.9",
        category_id: 220,
        price: 899,
        stock_quantity: 15,
        image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
        description: "Turn your tablet into a laptop.",
        specs: { brand: "Apple", model: ["iPad Pro 12.9"], type: "Keyboard", features: ["Bluetooth"] }
    }
];

// Re-using existing Brands/Models/Repairs/Users/etc.
// ... (Will append this to the user's existing data helpers)

// Helper to get category descendants
const getCategoryDescendants = (catId) => {
    const list = [parseInt(catId)];
    const children = categories.filter(c => c.parent_id == catId);
    children.forEach(child => {
        list.push(...getCategoryDescendants(child.id));
    });
    return list;
};

// ... exports
module.exports = {
    categories,
    products,
    getCategoryDescendants
}
