import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

dotenv.config();

// Type-specific image pools
const imagePools = {
  apartment: [
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&h=800&fit=crop'
  ],
  villa: [
    'https://images.unsplash.com/photo-1613977257593-9c0120ff9d2f?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&h=800&fit=crop'
  ],
  house: [
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d53?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560448075-bb4caa6c8e0e?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600585154154-1e47e6a6fcb9?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560185008-b033106af195?w=1200&h=800&fit=crop'
  ],
  condo: [
    'https://images.unsplash.com/photo-1599423300746-b62533397364?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=800&fit=crop'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1461713086041-1c3cf1d45084?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&h=800&fit=crop'
  ],
  land: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-988cbb503d1b?w=1200&h=800&fit=crop'
  ]
};

const demoModels = [
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079555/apartnemt2_ueinwq.glb',
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/house2_o3dvos.glb',
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/house_1_mrvbpf.glb',
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/vilal_2_ss2zg3.glb',
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/villa1_xuzoha.glb',
  'https://res.cloudinary.com/dpu6txhox/image/upload/v1762079372/Apartment_hjf7bn.glb'
];

const propertiesSeed = [
  {
    title: 'Luxury Sea-Facing Apartment',
    description: 'Premium 3BHK apartment with Arabian Sea views and modern amenities.',
    price: 45000000,
    location: 'Bandra West, Mumbai, Maharashtra',
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    propertyType: 'apartment'
  },
  {
    title: 'Contemporary Villa with Pool – I',
    description: 'Elegant 5BHK villa with private pool and landscaped garden in a gated community.',
    price: 32000000,
    location: 'Whitefield, Bengaluru, Karnataka',
    bedrooms: 5,
    bathrooms: 5,
    area: 4200,
    propertyType: 'villa'
  },
  {
    title: 'Penthouse with City Skyline',
    description: 'Stylish penthouse featuring an expansive terrace and panoramic views.',
    price: 52000000,
    location: 'DLF Phase 5, Gurgaon, Haryana',
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    propertyType: 'apartment'
  },
  {
    title: 'Premium Golf Course Residence',
    description: 'Spacious 4BHK overlooking the golf greens with club access.',
    price: 30000000,
    location: 'Gachibowli, Hyderabad, Telangana',
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    propertyType: 'house'
  },
  {
    title: 'Heritage Bungalow',
    description: 'Charming restored bungalow with courtyards and teak interiors.',
    price: 25000000,
    location: 'Alwarpet, Chennai, Tamil Nadu',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    propertyType: 'house'
  },
  {
    title: 'Riverside Modern Home',
    description: 'Modern home with minimalist design and river-facing balconies.',
    price: 18000000,
    location: 'Panampilly Nagar, Kochi, Kerala',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    propertyType: 'house'
  },
  {
    title: 'Lakeview Family House',
    description: 'Bright 3BHK family home overlooking the lake with a private garden.',
    price: 19500000,
    location: 'Jubilee Hills, Hyderabad, Telangana',
    bedrooms: 3,
    bathrooms: 3,
    area: 2300,
    propertyType: 'house'
  },
  {
    title: 'Garden Courtyard Residence',
    description: 'Airy 4BHK residence featuring a central courtyard and skylights.',
    price: 28500000,
    location: 'Koramangala, Bengaluru, Karnataka',
    bedrooms: 4,
    bathrooms: 4,
    area: 3100,
    propertyType: 'house'
  },
  {
    title: 'Sunset Ridge Villa',
    description: 'Contemporary hilltop house with sunset views and large terraces.',
    price: 26500000,
    location: 'Pune University Road, Pune, Maharashtra',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    propertyType: 'house'
  },
  // Additional types
  {
    title: 'Skyline View Condo',
    description: 'High-rise condo with skyline views and clubhouse amenities.',
    price: 22000000,
    location: 'Khar West, Mumbai, Maharashtra',
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    propertyType: 'condo'
  },
  {
    title: 'Grade-A Office Space',
    description: 'Premium commercial office floor with parking and reception.',
    price: 75000000,
    location: 'BKC, Mumbai, Maharashtra',
    bedrooms: 0,
    bathrooms: 2,
    area: 9000,
    propertyType: 'commercial'
  },
  {
    title: 'Prime Residential Land Plot',
    description: 'East-facing corner plot in a gated layout with 12m wide road access.',
    price: 15000000,
    location: 'Narsingi, Hyderabad, Telangana',
    bedrooms: 0,
    bathrooms: 0,
    area: 3600,
    propertyType: 'land'
  }
];

async function seed() {
  try {
    await connectDB();

    // Ensure an admin user exists
    let admin = await User.findOne({ email: 'admin@demo.com' }).select('+password');
    if (!admin) {
      admin = await User.create({
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin'
      });
      console.log('Created demo admin: admin@demo.com / password');
    }

    // Optional: clear existing demo properties
    await Property.deleteMany({});

    // Insert properties
    const timeSeed = Date.now() % 11;
    const docs = await Property.insertMany(
      propertiesSeed.map((p, idx) => {
        const pool = imagePools[p.propertyType] || imagePools.house;
        const base = (idx + timeSeed) % pool.length;
        // Always provide 4 images, rotate so cover differs per property
        const images = [
          pool[base % pool.length],
          pool[(base + 1) % pool.length],
          pool[(base + 2) % pool.length],
          pool[(base + 3) % pool.length]
        ];
        return {
          ...p,
          images,
          modelUrl: demoModels[idx % demoModels.length],
          owner: admin._id,
          featured: idx < 6
        };
      })
    );

    console.log(`Inserted ${docs.length} properties.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
