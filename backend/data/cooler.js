db.coolers.drop();
db.coolers.insertMany([
    {
        name: 'NH-U12A',
        brand: 'Noctua',
        water: false,
        fans: 2,
        fan_size: 120,
        MSRP: 110
    },
    {
        name: 'NH-D15',
        brand: 'Noctua',
        water: false,
        fans: 2,
        fan_size: 140,
        MSRP: 110
    },
    {
        name: 'NH-U12S',
        brand: 'Noctua',
        water: false,
        fans: 1,
        fan_size: 120,
        MSRP: 70
    },
    {
        name: 'LT720',
        brand: 'Deepcool',
        water: true,
        fans: 3,
        fan_size: 120,
        MSRP: 140
    },
    {
        name: 'LT520',
        brand: 'Deepcool',
        water: true,
        fans: 2,
        fan_size: 120,
        MSRP: 100
    },
    {
        name: 'Basic 240',
        brand: 'EK',
        water: true,
        fans: 2,
        fan_size: 120,
        MSRP: 120
    },
    {
        name: 'Kraken Z73',
        brand: 'NZXT',
        water: true,
        fans: 3,
        fan_size: 120,
        MSRP: 249
    },
    {
        name: 'Hyper 212',
        brand: 'Cooler Master',
        water: false,
        fans: 1,
        fan_size: 120,
        MSRP: 46
    },
    {
        name: 'Dark Rock Pro 4',
        brand: 'be quiet!',
        water: false,
        fans: 1,
        fan_size: 135,
        MSRP: 75
    },
    {
        name: 'PA120',
        brand: 'Thermalright',
        water: false,
        fans: 2,
        fan_size: 120,
        MSRP: 35
    },
    {
        name: 'H150i',
        brand: 'Corsair',
        water: true,
        fans: 3,
        fan_size: 120,
        MSRP: 180
    },
    {
        name: 'AK620',
        brand: 'Deepcool',
        water: false,
        fans: 2,
        fan_size: 120,
        MSRP: 65
    },
]);