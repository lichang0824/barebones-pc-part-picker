db.psus.drop();
db.psus.insertMany([
    {
        name: 'RM1000x', 
        brand: 'Corsair', 
        efficiency: 'Gold', 
        power: 1000, 
        modular: true, 
        MSRP: 168
    },
    {
        name: 'RM850x', 
        brand: 'Corsair', 
        efficiency: 'Gold', 
        power: 850, 
        modular: true, 
        MSRP: 132
    },
    {
        name: 'RM750x', 
        brand: 'Corsair', 
        efficiency: 'Gold', 
        power: 750, 
        modular: true, 
        MSRP: 100
    },
    {
        name: 'PRIME', 
        brand: 'Seasonic', 
        efficiency: 'Titanium', 
        power: 1000, 
        modular: true, 
        MSRP: 329
    },
    {
        name: 'PRIME', 
        brand: 'Seasonic', 
        efficiency: 'Titanium', 
        power: 850, 
        modular: true, 
        MSRP: 259
    },
    {
        name: 'FOCUS', 
        brand: 'Seasonic', 
        efficiency: 'Gold', 
        power: 750, 
        modular: true, 
        MSRP: 139
    },
    {
        name: 'FOCUS', 
        brand: 'Seasonic', 
        efficiency: 'Gold', 
        power: 850, 
        modular: true, 
        MSRP: 159
    },
    {
        name: 'FOCUS', 
        brand: 'Seasonic', 
        efficiency: 'Gold', 
        power: 1000, 
        modular: true, 
        MSRP: 203
    },
    {
        name: 'SuperNOVA', 
        brand: 'EVGA', 
        efficiency: 'Gold', 
        power: 750, 
        modular: true, 
        MSRP: 98
    },
    {
        name: 'N1', 
        brand: 'EVGA', 
        efficiency: 'Not Certified', 
        power: 750, 
        modular: false, 
        MSRP: 70
    },
    {
        name: '850 GQ', 
        brand: 'EVGA', 
        efficiency: 'Gold', 
        power: 850, 
        modular: true, 
        MSRP: 139
    },
]);