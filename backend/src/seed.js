require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const Merchant = require("./models/Merchant");
const Product = require("./models/Product");

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing demo data...");

    await Product.deleteMany({
      sku: {
        $regex: /^DEMO-/,
      },
    });

    await Merchant.deleteOne({
      email: "demo@merchantos.com",
    });

    const hashedPassword = await bcrypt.hash("Demo@123456", 12);

    const merchant = await Merchant.create({
      businessName: "NovaTech Store",
      email: "demo@merchantos.com",
      password: hashedPassword,
      phone: "9876543210",
      businessType: "ecommerce",
      currency: "INR",

      growthSettings: {
        maxDiscountPercentage: 10,
        maxCampaignBudget: 5000,
        requireApprovalForFinancialActions: true,
        allowAutomaticCampaigns: false,
      },

      razorpay: {
        accountConnected: false,
      },
    });

    console.log(`Merchant created: ${merchant.businessName}`);

    const products = [
      {
        name: "Sonic X2 Gaming Headphones",
        description:
          "Wireless gaming headphones with low latency, active noise cancellation and a 50-hour battery.",
        category: "Gaming Accessories",
        price: 3999,
        compareAtPrice: 4999,
        currency: "INR",
        stock: 42,
        sku: "DEMO-HEADPHONES-X2",
        features: [
          "Low latency gaming mode",
          "Active noise cancellation",
          "50-hour battery",
          "Detachable microphone",
        ],
        tags: [
          "gaming",
          "headphones",
          "wireless",
          "noise cancellation",
        ],
        specifications: {
          connectivity: "Bluetooth 5.3",
          battery: "50 hours",
          weight: "280g",
        },
        aiMetadata: {
          targetAudience: [
            "gamers",
            "streamers",
            "remote workers",
          ],
          useCases: [
            "gaming",
            "video calls",
            "music",
            "streaming",
          ],
          compatibleWith: [
            "PC",
            "PlayStation",
            "Xbox",
            "Mobile",
          ],
          sellingPoints: [
            "Low latency",
            "Long battery life",
            "Clear microphone",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 12500,
          cartAdds: 4200,
          purchases: 310,
          revenue: 1239690,
        },
      },

      {
        name: "ProType Mechanical Keyboard",
        description:
          "RGB mechanical keyboard designed for gaming and productivity with hot-swappable switches.",
        category: "Gaming Accessories",
        price: 5499,
        compareAtPrice: 6499,
        currency: "INR",
        stock: 28,
        sku: "DEMO-KEYBOARD-PRO",
        features: [
          "Hot-swappable switches",
          "RGB lighting",
          "Aluminium frame",
          "Programmable keys",
        ],
        tags: [
          "keyboard",
          "mechanical",
          "gaming",
          "rgb",
        ],
        specifications: {
          switches: "Mechanical",
          connection: "USB-C",
          layout: "87-key",
        },
        aiMetadata: {
          targetAudience: [
            "gamers",
            "developers",
            "content creators",
          ],
          useCases: [
            "gaming",
            "programming",
            "office work",
          ],
          compatibleWith: [
            "Windows",
            "Mac",
            "Linux",
          ],
          sellingPoints: [
            "Hot-swappable",
            "Premium build",
            "Customizable RGB",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 9800,
          cartAdds: 2700,
          purchases: 420,
          revenue: 2309580,
        },
      },

      {
        name: "ErgoFlow Wireless Mouse",
        description:
          "Ergonomic wireless mouse with precision tracking and programmable buttons.",
        category: "Computer Accessories",
        price: 1299,
        compareAtPrice: 1599,
        currency: "INR",
        stock: 95,
        sku: "DEMO-MOUSE-ERGO",
        features: [
          "Ergonomic design",
          "Precision tracking",
          "Programmable buttons",
          "60-day battery",
        ],
        tags: [
          "mouse",
          "wireless",
          "ergonomic",
          "productivity",
        ],
        specifications: {
          connectivity: "2.4GHz Wireless",
          dpi: "12000 DPI",
          buttons: 7,
        },
        aiMetadata: {
          targetAudience: [
            "developers",
            "designers",
            "gamers",
            "office workers",
          ],
          useCases: [
            "programming",
            "design",
            "gaming",
            "office work",
          ],
          compatibleWith: [
            "Windows",
            "Mac",
            "Linux",
          ],
          sellingPoints: [
            "Ergonomic comfort",
            "High precision",
            "Long battery life",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 14500,
          cartAdds: 5100,
          purchases: 1250,
          revenue: 1623750,
        },
      },

      {
        name: "UltraView 27 Monitor",
        description:
          "27-inch QHD monitor with 165Hz refresh rate designed for gaming, development and creative work.",
        category: "Monitors",
        price: 24999,
        compareAtPrice: 28999,
        currency: "INR",
        stock: 14,
        sku: "DEMO-MONITOR-27",
        features: [
          "27-inch QHD display",
          "165Hz refresh rate",
          "1ms response time",
          "HDR support",
        ],
        tags: [
          "monitor",
          "gaming",
          "qhd",
          "165hz",
        ],
        specifications: {
          resolution: "2560x1440",
          refreshRate: "165Hz",
          panel: "IPS",
        },
        aiMetadata: {
          targetAudience: [
            "gamers",
            "developers",
            "designers",
          ],
          useCases: [
            "gaming",
            "programming",
            "video editing",
          ],
          compatibleWith: [
            "PC",
            "PlayStation",
            "Xbox",
          ],
          sellingPoints: [
            "QHD resolution",
            "165Hz refresh rate",
            "Large display",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 7200,
          cartAdds: 2100,
          purchases: 380,
          revenue: 9499620,
        },
      },

      {
        name: "CloudLite Laptop Stand",
        description:
          "Adjustable aluminium laptop stand designed to improve desk ergonomics and airflow.",
        category: "Desk Accessories",
        price: 1899,
        compareAtPrice: 2299,
        currency: "INR",
        stock: 120,
        sku: "DEMO-STAND-CLOUD",
        features: [
          "Adjustable height",
          "Aluminium construction",
          "Improved airflow",
          "Foldable design",
        ],
        tags: [
          "laptop stand",
          "ergonomic",
          "desk",
          "office",
        ],
        specifications: {
          material: "Aluminium",
          compatibility: "Up to 17-inch laptops",
        },
        aiMetadata: {
          targetAudience: [
            "developers",
            "students",
            "remote workers",
          ],
          useCases: [
            "programming",
            "studying",
            "remote work",
          ],
          compatibleWith: [
            "MacBook",
            "Windows laptops",
          ],
          sellingPoints: [
            "Better posture",
            "Portable",
            "Premium aluminium",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 8600,
          cartAdds: 3200,
          purchases: 980,
          revenue: 1861020,
        },
      },

      {
        name: "PowerHub 100W Charger",
        description:
          "Compact 100W GaN charger with multiple ports for laptops, phones and tablets.",
        category: "Chargers",
        price: 3499,
        compareAtPrice: 3999,
        currency: "INR",
        stock: 68,
        sku: "DEMO-CHARGER-100W",
        features: [
          "100W GaN charging",
          "3 USB-C ports",
          "1 USB-A port",
          "Compact design",
        ],
        tags: [
          "charger",
          "gan",
          "100w",
          "usb-c",
        ],
        specifications: {
          power: "100W",
          ports: 4,
          technology: "GaN",
        },
        aiMetadata: {
          targetAudience: [
            "developers",
            "travelers",
            "students",
          ],
          useCases: [
            "travel",
            "office",
            "home",
          ],
          compatibleWith: [
            "MacBook",
            "iPhone",
            "Android",
            "Windows laptops",
          ],
          sellingPoints: [
            "100W power",
            "Compact",
            "Multiple ports",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 6300,
          cartAdds: 1700,
          purchases: 460,
          revenue: 1609540,
        },
      },

      {
        name: "StreamPro USB Microphone",
        description:
          "USB condenser microphone for streaming, podcasting, gaming and video calls.",
        category: "Audio",
        price: 6999,
        compareAtPrice: 7999,
        currency: "INR",
        stock: 31,
        sku: "DEMO-MIC-STREAM",
        features: [
          "USB plug and play",
          "Cardioid pickup",
          "Real-time monitoring",
          "Adjustable gain",
        ],
        tags: [
          "microphone",
          "streaming",
          "podcast",
          "gaming",
        ],
        specifications: {
          connection: "USB-C",
          pattern: "Cardioid",
        },
        aiMetadata: {
          targetAudience: [
            "streamers",
            "podcasters",
            "gamers",
            "content creators",
          ],
          useCases: [
            "streaming",
            "podcasting",
            "video calls",
          ],
          compatibleWith: [
            "PC",
            "Mac",
            "PlayStation",
          ],
          sellingPoints: [
            "Clear voice",
            "Plug and play",
            "Low setup complexity",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 5400,
          cartAdds: 1900,
          purchases: 230,
          revenue: 1609770,
        },
      },

      {
        name: "TravelMax Laptop Backpack",
        description:
          "Water-resistant laptop backpack with dedicated compartments for technology and accessories.",
        category: "Bags",
        price: 2799,
        compareAtPrice: 3299,
        currency: "INR",
        stock: 74,
        sku: "DEMO-BAG-TRAVEL",
        features: [
          "Water resistant",
          "Laptop compartment",
          "USB charging port",
          "Anti-theft pocket",
        ],
        tags: [
          "backpack",
          "laptop bag",
          "travel",
          "office",
        ],
        specifications: {
          capacity: "25L",
          laptopSupport: "Up to 16-inch",
          material: "Water-resistant polyester",
        },
        aiMetadata: {
          targetAudience: [
            "students",
            "developers",
            "travelers",
            "professionals",
          ],
          useCases: [
            "travel",
            "office",
            "college",
          ],
          compatibleWith: [
            "15-inch laptops",
            "16-inch laptops",
          ],
          sellingPoints: [
            "Water resistant",
            "Anti-theft design",
            "Large capacity",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 9100,
          cartAdds: 3500,
          purchases: 860,
          revenue: 2407140,
        },
      },

      {
        name: "PowerDesk Smart Desk",
        description:
          "Electric height-adjustable standing desk with memory presets and cable management.",
        category: "Furniture",
        price: 32999,
        compareAtPrice: 37999,
        currency: "INR",
        stock: 9,
        sku: "DEMO-DESK-POWER",
        features: [
          "Electric height adjustment",
          "Memory presets",
          "Cable management",
          "Large desktop",
        ],
        tags: [
          "standing desk",
          "office",
          "ergonomic",
          "desk",
        ],
        specifications: {
          heightRange: "72-120cm",
          desktop: "140x70cm",
          presets: 4,
        },
        aiMetadata: {
          targetAudience: [
            "developers",
            "remote workers",
            "professionals",
          ],
          useCases: [
            "home office",
            "programming",
            "remote work",
          ],
          compatibleWith: [
            "Monitor setups",
            "Desktop PCs",
            "Laptops",
          ],
          sellingPoints: [
            "Electric adjustment",
            "Memory presets",
            "Ergonomic design",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 4300,
          cartAdds: 1400,
          purchases: 145,
          revenue: 4784855,
        },
      },

      {
        name: "VisionCam 4K Webcam",
        description:
          "4K webcam with autofocus and noise-reducing microphones for meetings and content creation.",
        category: "Webcams",
        price: 8999,
        compareAtPrice: 9999,
        currency: "INR",
        stock: 37,
        sku: "DEMO-WEBCAM-4K",
        features: [
          "4K video",
          "Autofocus",
          "Dual microphones",
          "Low-light correction",
        ],
        tags: [
          "webcam",
          "4k",
          "video calls",
          "streaming",
        ],
        specifications: {
          resolution: "4K",
          frameRate: "30 FPS",
          connection: "USB-C",
        },
        aiMetadata: {
          targetAudience: [
            "remote workers",
            "streamers",
            "content creators",
          ],
          useCases: [
            "video meetings",
            "streaming",
            "recording",
          ],
          compatibleWith: [
            "Windows",
            "Mac",
            "Linux",
          ],
          sellingPoints: [
            "4K quality",
            "Autofocus",
            "Low-light performance",
          ],
          aiSearchEnabled: true,
        },
        analytics: {
          views: 6700,
          cartAdds: 2300,
          purchases: 390,
          revenue: 3509610,
        },
      },
    ];

    const productsWithMerchant = products.map((product) => ({
      ...product,
      merchant: merchant._id,
      aiMetadata: {
        ...product.aiMetadata,
        searchableText: [
          product.name,
          product.description,
          product.category,
          ...product.features,
          ...product.tags,
          ...product.aiMetadata.targetAudience,
          ...product.aiMetadata.useCases,
          ...product.aiMetadata.compatibleWith,
          ...product.aiMetadata.sellingPoints,
        ]
          .join(" ")
          .toLowerCase(),
      },
    }));

    const createdProducts = await Product.insertMany(
      productsWithMerchant
    );

    console.log(`${createdProducts.length} products created.`);

    console.log("\n====================================");
    console.log("MerchantOS demo data ready");
    console.log("====================================");
    console.log(`Business: ${merchant.businessName}`);
    console.log(`Email: ${merchant.email}`);
    console.log("Password: Demo@123456");
    console.log(`Products: ${createdProducts.length}`);
    console.log("====================================\n");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();