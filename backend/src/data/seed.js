const { v4: uuidv4 } = require("uuid");

const nowIso = new Date().toISOString();

const products = [
  {
    id: uuidv4(),
    name: "Wireless Earbuds Pro",
    description: "Noise-cancelling earbuds with charging case.",
    price: 129.99,
    category: "electronics",
    stock: 42,
    image_url: "https://picsum.photos/seed/earbuds/800/600",
  },
  {
    id: uuidv4(),
    name: '4K Monitor 27"',
    description: "Ultra HD monitor for work and gaming.",
    price: 299.0,
    category: "electronics",
    stock: 18,
    image_url: "https://picsum.photos/seed/monitor/800/600",
  },
  {
    id: uuidv4(),
    name: "Mechanical Keyboard",
    description: "Tactile switches with RGB backlight.",
    price: 89.5,
    category: "electronics",
    stock: 25,
    image_url: "https://picsum.photos/seed/keyboard/800/600",
  },
  {
    id: uuidv4(),
    name: "Ergonomic Office Chair",
    description: "Adjustable lumbar support and breathable mesh.",
    price: 219.99,
    category: "furniture",
    stock: 12,
    image_url: "https://picsum.photos/seed/chair/800/600",
  },
  {
    id: uuidv4(),
    name: "Standing Desk",
    description: "Electric height-adjustable desk.",
    price: 399.99,
    category: "furniture",
    stock: 7,
    image_url: "https://picsum.photos/seed/desk/800/600",
  },
  {
    id: uuidv4(),
    name: "Bookshelf Oak",
    description: "Five-tier oak bookshelf.",
    price: 159.0,
    category: "furniture",
    stock: 0,
    image_url: "https://picsum.photos/seed/bookshelf/800/600",
  },
  {
    id: uuidv4(),
    name: "Leather Wallet",
    description: "Slim bifold wallet with RFID blocking.",
    price: 35.0,
    category: "accessories",
    stock: 80,
    image_url: "https://picsum.photos/seed/wallet/800/600",
  },
  {
    id: uuidv4(),
    name: "Travel Backpack",
    description: "Water-resistant backpack with laptop sleeve.",
    price: 74.99,
    category: "accessories",
    stock: 34,
    image_url: "https://picsum.photos/seed/backpack/800/600",
  },
  {
    id: uuidv4(),
    name: "Polarized Sunglasses",
    description: "UV400 protection with lightweight frame.",
    price: 49.99,
    category: "accessories",
    stock: 56,
    image_url: "https://picsum.photos/seed/sunglasses/800/600",
  },
  {
    id: uuidv4(),
    name: "Bluetooth Speaker",
    description: "Portable speaker with deep bass.",
    price: 69.99,
    category: "electronics",
    stock: 29,
    image_url: "https://picsum.photos/seed/speaker/800/600",
  },
  {
    id: uuidv4(),
    name: "Floor Lamp",
    description: "Minimalist lamp with warm ambient light.",
    price: 95.0,
    category: "furniture",
    stock: 15,
    image_url: "https://picsum.photos/seed/floorlamp/800/600",
  },
  {
    id: uuidv4(),
    name: "Smart Watch Band",
    description: "Breathable silicone replacement band.",
    price: 19.99,
    category: "accessories",
    stock: 120,
    image_url: "https://picsum.photos/seed/watchband/800/600",
  },
];

const users = [
  {
    id: uuidv4(),
    email: "test@shopflow.dev",
    password: "Test1234!",
    role: "user",
    created_at: nowIso,
  },
];

const promoCodes = [
  {
    id: uuidv4(),
    code: "SAVE10",
    discount_percent: 10,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    is_active: true,
  },
  {
    id: uuidv4(),
    code: "WELCOME20",
    discount_percent: 20,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    is_active: true,
  },
  {
    id: uuidv4(),
    code: "EXPIRED50",
    discount_percent: 50,
    expires_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    is_active: false,
  },
];

const sessions = {};
const cartItems = [];
const orders = [];

const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

module.exports = {
  products,
  users,
  promoCodes,
  sessions,
  cartItems,
  orders,
  toPublicUser,
};
