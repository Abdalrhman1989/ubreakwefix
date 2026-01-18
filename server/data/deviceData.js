module.exports = {
    'Apple': [
        {
            family: 'iPhone',
            models: [
                "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
                "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
                "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
                "iPhone 13", "iPhone 13 mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
                "iPhone 12", "iPhone 12 mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
                "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
                "iPhone XS", "iPhone XS Max", "iPhone XR", "iPhone X",
                "iPhone 8", "iPhone 8 Plus", "iPhone 7", "iPhone 7 Plus",
                "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
                "iPhone SE (2022)", "iPhone SE (2020)", "iPhone SE (2016)"
            ]
        },
        {
            family: 'iPad',
            models: [
                "iPad Pro 12.9\" (6. gen)", "iPad Pro 12.9\" (5. gen)", "iPad Pro 12.9\" (4. gen)", "iPad Pro 12.9\" (3. gen)",
                "iPad Pro 11\" (4. gen)", "iPad Pro 11\" (3. gen)", "iPad Pro 11\" (2. gen)", "iPad Pro 11\" (1. gen)",
                "iPad Air (5. gen)", "iPad Air (4. gen)", "iPad Air (3. gen)", "iPad Air 2",
                "iPad (10. gen)", "iPad (9. gen)", "iPad (8. gen)", "iPad (7. gen)", "iPad (6. gen)", "iPad (5. gen)",
                "iPad mini (6. gen)", "iPad mini (5. gen)", "iPad mini 4"
            ]
        },
        {
            family: 'MacBook',
            models: [
                "MacBook Pro 16\" (M3)", "MacBook Pro 14\" (M3)",
                "MacBook Pro 16\" (M2)", "MacBook Pro 14\" (M2)",
                "MacBook Pro 16\" (M1)", "MacBook Pro 14\" (M1)",
                "MacBook Pro 13\" (M2)", "MacBook Pro 13\" (M1)",
                "MacBook Pro 16\" (Intel)", "MacBook Pro 15\"", "MacBook Pro 13\"",
                "MacBook Air 15\" (M3)", "MacBook Air 13\" (M3)",
                "MacBook Air 15\" (M2)", "MacBook Air 13\" (M2)",
                "MacBook Air 13\" (M1)",
                "MacBook Air 13\" (Retina)", "MacBook Air 11\""
            ]
        },
        {
            family: 'Apple Watch',
            models: [
                "Apple Watch Ultra 2", "Apple Watch Ultra",
                "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch Series 7",
                "Apple Watch Series 6", "Apple Watch Series 5", "Apple Watch Series 4",
                "Apple Watch Series 3", "Apple Watch Series 2", "Apple Watch Series 1", "Apple Watch (1. gen)",
                "Apple Watch SE (2. gen)", "Apple Watch SE (1. gen)"
            ]
        }
    ],
    'Samsung': [
        {
            family: 'Galaxy S Series',
            models: [
                "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
                "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
                "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
                "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
                "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20", "Galaxy S20 FE",
                "Galaxy S10+", "Galaxy S10", "Galaxy S10e",
                "Galaxy S9+", "Galaxy S9",
                "Galaxy S8+", "Galaxy S8"
            ]
        },
        {
            family: 'Galaxy Z Series',
            models: [
                "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4", "Galaxy Z Fold 3",
                "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4", "Galaxy Z Flip 3"
            ]
        },
        {
            family: 'Galaxy A Series',
            models: [
                "Galaxy A55", "Galaxy A54", "Galaxy A35", "Galaxy A34",
                "Galaxy A25", "Galaxy A24", "Galaxy A15", "Galaxy A14",
                "Galaxy A05s", "Galaxy A05",
                "Galaxy A72", "Galaxy A71"
            ]
        },
        {
            family: 'Galaxy Note Series',
            models: [
                "Galaxy Note 20 Ultra", "Galaxy Note 20",
                "Galaxy Note 10+", "Galaxy Note 10",
                "Galaxy Note 9", "Galaxy Note 8"
            ]
        },
        {
            family: 'Galaxy Tab',
            models: [
                "Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9",
                "Galaxy Tab S8 Ultra", "Galaxy Tab S8+", "Galaxy Tab S8",
                "Galaxy Tab S7+", "Galaxy Tab S7",
                "Galaxy Tab S6",
                "Galaxy Tab A9+", "Galaxy Tab A9", "Galaxy Tab A8", "Galaxy Tab A7"
            ]
        },
        {
            family: 'Galaxy Watch',
            models: [
                "Galaxy Watch6 Classic", "Galaxy Watch6",
                "Galaxy Watch5 Pro", "Galaxy Watch5",
                "Galaxy Watch4 Classic", "Galaxy Watch4",
                "Galaxy Watch3",
                "Galaxy Watch Active 2", "Galaxy Watch Active"
            ]
        }
    ],
    'Google': [
        {
            family: 'Pixel Phones',
            models: [
                "Pixel 8 Pro", "Pixel 8",
                "Pixel 7 Pro", "Pixel 7",
                "Pixel 6 Pro", "Pixel 6", "Pixel 6a",
                "Pixel 5", "Pixel 5a",
                "Pixel 4 XL", "Pixel 4", "Pixel 4a"
            ]
        },
        { family: 'Pixel Tablet', models: ["Pixel Tablet"] },
        { family: 'Pixel Watch', models: ["Pixel Watch 2", "Pixel Watch"] }
    ],
    'OnePlus': [
        {
            family: 'OnePlus Series',
            models: [
                "OnePlus 12", "OnePlus 11", "OnePlus 10 Pro",
                "OnePlus 9 Pro", "OnePlus 9",
                "OnePlus 8 Pro", "OnePlus 8"
            ]
        },
        {
            family: 'Nord Series',
            models: ["OnePlus Nord 3", "OnePlus Nord 2", "OnePlus Nord CE 3", "OnePlus Nord CE 2"]
        },
        { family: 'OnePlus Pad', models: ["OnePlus Pad"] }
    ],
    'Huawei': [
        { family: 'P Series', models: ["P60 Pro", "P50 Pro", "P40 Pro", "P30 Pro"] },
        { family: 'Mate Series', models: ["Mate 60 Pro", "Mate 50 Pro", "Mate 40 Pro", "Mate 30 Pro"] },
        { family: 'Nova Series', models: ["Nova 11", "Nova 10", "Nova 9"] }
    ],
    'Oppo': [
        { family: 'Find X Series', models: ["Find X6 Pro", "Find X5 Pro", "Find X3 Pro"] },
        { family: 'Reno Series', models: ["Reno 10", "Reno 8", "Reno 6"] },
        { family: 'A Series', models: ["A98", "A78", "A54"] }
    ],
    'Xiaomi': [
        { family: 'Xiaomi Series', models: ["Xiaomi 14", "Xiaomi 13", "Xiaomi 12", "Mi 11", "Mi 10"] },
        { family: 'Redmi Note', models: ["Redmi Note 13", "Redmi Note 12", "Redmi Note 11"] },
        { family: 'Redmi Series', models: ["Redmi 12", "Redmi 10"] },
        { family: 'POCO', models: ["POCO F5", "POCO X5", "POCO F4"] }
    ],
    'Sony': [
        { family: 'Xperia 1', models: ["Xperia 1 V", "Xperia 1 IV", "Xperia 1 III"] },
        { family: 'Xperia 5', models: ["Xperia 5 V", "Xperia 5 IV", "Xperia 5 III"] },
        { family: 'Xperia 10', models: ["Xperia 10 V", "Xperia 10 IV", "Xperia 10 III"] }
    ],
    'Nokia': [
        { family: 'X Series', models: ["Nokia X30", "Nokia X20"] },
        { family: 'G Series', models: ["Nokia G60", "Nokia G50", "Nokia G21"] },
        { family: 'C Series', models: ["Nokia C32", "Nokia C22"] }
    ],
    'PlayStation': [
        {
            family: 'PlayStation 5',
            models: [
                "PlayStation 5 Standard", "PlayStation 5 Digital", "PlayStation 5 Slim Standard", "PlayStation 5 Slim Digital", "PlayStation 5 Pro"
            ]
        },
        {
            family: 'PlayStation 4',
            models: [
                "PlayStation 4 Pro", "PlayStation 4 Slim", "PlayStation 4 (Fat)"
            ]
        }
    ]
};
