const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
require("dotenv").config();

// Unsplash image helper — consistent size for fast loading
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&auto=format&q=75`;

const productsByCategory = {
  Electronics: [
    {
      name: "Apple iPhone 14 Pro 256GB Space Black",
      description:
        "The iPhone 14 Pro features the Dynamic Island, a 48MP main camera, Always-On display, and the powerful A16 Bionic chip for all-day performance.",
      price: 1099,
      stock: 30,
      brand: "Apple",
      mainImage: img("1663499482523-1c0c1bae4ce1"),
      image_url: [
        img("1663499482523-1c0c1bae4ce1"),
        img("1591337676887-a217a6970a8a"),
        img("1510557880182-3d4d3cba35a5"),
      ],
    },
    {
      name: "Samsung Galaxy S23 Ultra 512GB",
      description:
        "Flagship Android smartphone with a 200MP camera, integrated S Pen, Snapdragon 8 Gen 2 chip, and a 5000mAh battery for all-day power.",
      price: 1199,
      stock: 25,
      brand: "Samsung",
      mainImage: img("1610945264803-c22b62831e8b"),
      image_url: [
        img("1610945264803-c22b62831e8b"),
        img("1565849904461-04a58ad377e0"),
      ],
    },
    {
      name: "Sony WH-1000XM5 Noise Cancelling Headphones",
      description:
        "Industry-leading noise cancellation with 8 microphones, 30-hour battery life, crystal-clear hands-free calling and multipoint connection.",
      price: 349,
      stock: 40,
      brand: "Sony",
      mainImage: img("1618366712010-f4ae9c647dcb"),
      image_url: [
        img("1618366712010-f4ae9c647dcb"),
        img("1505740420928-5e560c06d30e"),
      ],
    },
    {
      name: "Apple MacBook Air M2 13-inch",
      description:
        "Supercharged by M2 chip, the redesigned MacBook Air is incredibly thin and light with a 18-hour battery, MagSafe charging and a Liquid Retina display.",
      price: 1299,
      stock: 20,
      brand: "Apple",
      mainImage: img("1517336714731-489689fd1ca8"),
      image_url: [
        img("1517336714731-489689fd1ca8"),
        img("1496181133206-80ce9b88a853"),
      ],
    },
    {
      name: "iPad Pro 12.9-inch M2 WiFi 256GB",
      description:
        "The ultimate iPad experience with M2 chip, stunning Liquid Retina XDR display, ProRes video, Wi-Fi 6E and Apple Pencil hover support.",
      price: 1099,
      stock: 18,
      brand: "Apple",
      mainImage: img("1544244015-0df4cec9d125"),
      image_url: [
        img("1544244015-0df4cec9d125"),
        img("1561154464-062d567952d3"),
      ],
    },
    {
      name: 'LG 27" 4K UHD Monitor',
      description:
        "27-inch IPS 4K UHD display with USB-C connectivity, HDR10 support, AMD FreeSync and ergonomic stand for professional and gaming use.",
      price: 449,
      stock: 15,
      brand: "LG",
      mainImage: img("1527443224154-522ba4eef4c1"),
      image_url: [img("1527443224154-522ba4eef4c1")],
    },
    {
      name: "Logitech MX Master 3S Wireless Mouse",
      description:
        "Advanced wireless mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, ergonomic design and quiet clicks for productivity.",
      price: 99,
      stock: 60,
      brand: "Logitech",
      mainImage: img("1527864550417-7fd91fc51a46"),
      image_url: [img("1527864550417-7fd91fc51a46")],
    },
  ],

  Fashion: [
    {
      name: "Classic White Oxford Shirt",
      description:
        "Premium 100% cotton Oxford shirt with a button-down collar and chest pocket. Perfect for both formal office settings and smart casual outings.",
      price: 59,
      stock: 80,
      brand: "Ralph Lauren",
      mainImage: img("1602810318383-e386cc2a3ccf"),
      image_url: [
        img("1602810318383-e386cc2a3ccf"),
        img("1598032895455-3e08f06cfea3"),
      ],
    },
    {
      name: "Slim Fit Dark Wash Jeans",
      description:
        "Modern slim fit jeans crafted from premium stretch denim. Features a dark wash finish, five-pocket styling and a comfortable mid-rise waist.",
      price: 79,
      stock: 65,
      brand: "Levi's",
      mainImage: img("1542272604-787c3835535d"),
      image_url: [
        img("1542272604-787c3835535d"),
        img("1475180098004-ca77a66827be"),
      ],
    },
    {
      name: "Merino Wool Crewneck Sweater",
      description:
        "Luxuriously soft merino wool sweater in a classic crewneck style. Naturally temperature-regulating, odour-resistant and incredibly comfortable.",
      price: 129,
      stock: 35,
      brand: "Uniqlo",
      mainImage: img("1576566588028-4147f3842f27"),
      image_url: [img("1576566588028-4147f3842f27")],
    },
    {
      name: "Tailored Wool Blend Blazer",
      description:
        "Sharp single-breasted blazer in a wool blend fabric. Features notched lapels, two-button closure and a slim modern silhouette.",
      price: 199,
      stock: 22,
      brand: "Zara",
      mainImage: img("1593030761775-0de4df3de8fd"),
      image_url: [img("1593030761775-0de4df3de8fd")],
    },
    {
      name: "Linen Summer Shirt",
      description:
        "Breathable 100% linen shirt perfect for warm weather. Features a relaxed fit, button-front placket and a subtle texture for a laid-back summer look.",
      price: 55,
      stock: 50,
      brand: "H&M",
      mainImage: img("1489987707849-e91a2a834e90"),
      image_url: [img("1489987707849-e91a2a834e90")],
    },
  ],

  Footwear: [
    {
      name: "Nike Air Max 270 React",
      description:
        "Inspired by Air Max icons of the past, the Nike Air Max 270 React features Nike's tallest Air unit yet for an all-day, every-day cushioned experience.",
      price: 150,
      stock: 45,
      brand: "Nike",
      mainImage: img("1542291026-7eec264c27ff"),
      image_url: [
        img("1542291026-7eec264c27ff"),
        img("1600185365483-26d0a9372ac5"),
      ],
    },
    {
      name: "Adidas Ultraboost 23 Running Shoes",
      description:
        "Engineered for performance and style, the Ultraboost 23 features a fully redesigned upper, responsive Boost midsole and Continental rubber outsole.",
      price: 190,
      stock: 38,
      brand: "Adidas",
      mainImage: img("1608231387042-66d1773070a5"),
      image_url: [
        img("1608231387042-66d1773070a5"),
        img("1539185441755-09c30f9ce8a4"),
      ],
    },
    {
      name: "Classic Leather Chelsea Boots",
      description:
        "Timeless Chelsea boots crafted from genuine leather with elastic side panels, pull tab and a stacked heel. Perfect for both casual and smart occasions.",
      price: 189,
      stock: 28,
      brand: "Thursday Boot Co.",
      mainImage: img("1638247025967-b4e38f787b76"),
      image_url: [img("1638247025967-b4e38f787b76")],
    },
    {
      name: "New Balance 574 Sneakers",
      description:
        "An icon of sneaker culture, the New Balance 574 features ENCAP midsole technology and a suede/mesh upper for everyday comfort and classic style.",
      price: 89,
      stock: 55,
      brand: "New Balance",
      mainImage: img("1556906781-9f40d203f50e"),
      image_url: [img("1556906781-9f40d203f50e")],
    },
    {
      name: "Birkenstock Arizona Sandals",
      description:
        "The iconic two-strap sandal with a contoured cork-latex footbed that molds to the shape of your foot for custom comfort over time.",
      price: 110,
      stock: 42,
      brand: "Birkenstock",
      mainImage: img("1543508282-6319a3e2621f"),
      image_url: [img("1543508282-6319a3e2621f")],
    },
  ],

  Furniture: [
    {
      name: "Ergonomic Mesh Office Chair",
      description:
        "Fully adjustable ergonomic office chair with breathable mesh back, lumbar support, adjustable armrests and 5-point base for long work sessions.",
      price: 299,
      stock: 15,
      brand: "Herman Miller",
      mainImage: img("1592078615290-033ee584e267"),
      image_url: [
        img("1592078615290-033ee584e267"),
        img("1580480055273-228ff5388ef8"),
      ],
    },
    {
      name: "Minimalist Solid Oak Desk",
      description:
        "Clean and modern solid oak standing desk with integrated cable management, spacious 140cm surface and adjustable height legs.",
      price: 549,
      stock: 8,
      brand: "IKEA",
      mainImage: img("1518455027359-f3f8164ba6bd"),
      image_url: [
        img("1518455027359-f3f8164ba6bd"),
        img("1593642632559-0c6d3fc62b89"),
      ],
    },
    {
      name: "3-Seater Velvet Sofa",
      description:
        "Contemporary 3-seater sofa upholstered in premium velvet fabric with solid wood legs, high-density foam cushions and a low-profile modern design.",
      price: 899,
      stock: 6,
      brand: "West Elm",
      mainImage: img("1555041469-a586c61ea9bc"),
      image_url: [
        img("1555041469-a586c61ea9bc"),
        img("1493663284031-b7e3aaa4cab5"),
      ],
    },
    {
      name: "Floating Wall Shelf Set",
      description:
        "Set of 3 solid wood floating wall shelves in a natural oak finish. Easy to install with hidden brackets for a seamless, modern look.",
      price: 89,
      stock: 30,
      brand: "IKEA",
      mainImage: img("1558618666-fcd25c85cd64"),
      image_url: [img("1558618666-fcd25c85cd64")],
    },
    {
      name: "King Size Platform Bed Frame",
      description:
        "Low-profile platform bed frame in solid walnut wood with a slatted base, no box spring required and a sleek mid-century modern design.",
      price: 699,
      stock: 5,
      brand: "Article",
      mainImage: img("1505693416388-ac5ce068fe85"),
      image_url: [img("1505693416388-ac5ce068fe85")],
    },
  ],

  "Beauty & Health": [
    {
      name: "The Ordinary Vitamin C Suspension 23%",
      description:
        "A stable, water-free formula with 23% pure vitamin C that visibly brightens skin tone, reduces dark spots and improves skin radiance.",
      price: 12,
      stock: 150,
      brand: "The Ordinary",
      mainImage: img("1620916566398-39f1143ab7be"),
      image_url: [
        img("1620916566398-39f1143ab7be"),
        img("1556228578-0d85b1a4d571"),
      ],
    },
    {
      name: "CeraVe Moisturising Cream 454g",
      description:
        "Rich, non-greasy moisturising cream with three essential ceramides and hyaluronic acid. Developed with dermatologists for normal to dry skin.",
      price: 22,
      stock: 120,
      brand: "CeraVe",
      mainImage: img("1556228578-0d85b1a4d571"),
      image_url: [img("1556228578-0d85b1a4d571")],
    },
    {
      name: "Dyson Supersonic Hair Dryer",
      description:
        "Engineered to protect hair from extreme heat damage. Dyson's air multiplier amplifier technology delivers fast drying with intelligent heat control.",
      price: 429,
      stock: 12,
      brand: "Dyson",
      mainImage: img("1522338242992-e1d3935d8612"),
      image_url: [img("1522338242992-e1d3935d8612")],
    },
    {
      name: "La Roche-Posay SPF 50+ Sunscreen",
      description:
        "Invisible fluid sunscreen with very high UVA/UVB protection for sensitive skin. Lightweight, fast-absorbing formula that works under makeup.",
      price: 32,
      stock: 85,
      brand: "La Roche-Posay",
      mainImage: img("1598440947619-2c35fc9aa486"),
      image_url: [img("1598440947619-2c35fc9aa486")],
    },
    {
      name: "Philips Electric Toothbrush Series 9000",
      description:
        "Removes up to 20x more plaque than a manual brush. Features pressure sensor, 4 cleaning modes, smart timer and a 3-week battery life.",
      price: 189,
      stock: 20,
      brand: "Philips",
      mainImage: img("1559829285-b0d9d3f9b76b"),
      image_url: [img("1559829285-b0d9d3f9b76b")],
    },
  ],

  "Sports & Fitness": [
    {
      name: "Bowflex SelectTech 552 Adjustable Dumbbells",
      description:
        "Replaces 15 sets of weights. Adjusts from 5 to 52.5 lbs with a turn of the dial. Space-saving design with a durable moulded outer shell.",
      price: 399,
      stock: 18,
      brand: "Bowflex",
      mainImage: img("1534438327276-14e5300c3a48"),
      image_url: [
        img("1534438327276-14e5300c3a48"),
        img("1583454110551-21f2fa2afe61"),
      ],
    },
    {
      name: "Manduka PRO Yoga Mat 6mm",
      description:
        "The world's best yoga mat. Closed-cell surface prevents sweat absorption, providing superior grip. Lifetime guarantee and made sustainably.",
      price: 120,
      stock: 55,
      brand: "Manduka",
      mainImage: img("1601925228836-f4e3c3d2b0da"),
      image_url: [img("1601925228836-f4e3c3d2b0da")],
    },
    {
      name: "Garmin Forerunner 255 GPS Watch",
      description:
        "Running smartwatch with training readiness, HRV status, race predictor, morning report and up to 14 days of battery life in smartwatch mode.",
      price: 349,
      stock: 22,
      brand: "Garmin",
      mainImage: img("1575311373937-040b8058bad0"),
      image_url: [img("1575311373937-040b8058bad0")],
    },
    {
      name: "Resistance Bands Set (5 levels)",
      description:
        "Premium latex resistance bands in 5 resistance levels. Perfect for home workouts, stretching, strength training and physical therapy.",
      price: 29,
      stock: 100,
      brand: "Fit Simplify",
      mainImage: img("1598289431512-b97b0917affc"),
      image_url: [img("1598289431512-b97b0917affc")],
    },
    {
      name: "Hydro Flask 32oz Water Bottle",
      description:
        "TempShield double-wall vacuum insulation keeps drinks cold for 24hrs and hot for 12hrs. BPA-free, dishwasher safe with a wide mouth lid.",
      price: 44,
      stock: 90,
      brand: "Hydro Flask",
      mainImage: img("1602143407151-7111542de6e8"),
      image_url: [img("1602143407151-7111542de6e8")],
    },
  ],

  "Books & Stationery": [
    {
      name: "Atomic Habits by James Clear",
      description:
        "The #1 New York Times bestseller. An easy and proven way to build good habits and break bad ones using tiny changes that deliver remarkable results.",
      price: 18,
      stock: 200,
      brand: "Penguin Random House",
      mainImage: img("1544716278-ca5e3f4abd8c"),
      image_url: [
        img("1544716278-ca5e3f4abd8c"),
        img("1512820790803-83ca734da794"),
      ],
    },
    {
      name: "Moleskine Classic Hardcover Notebook A5",
      description:
        "Legendary hardcover notebook with elastic closure, ribbon bookmark, inner pocket and 240 pages of acid-free ivory paper. A tool for imagination.",
      price: 24,
      stock: 130,
      brand: "Moleskine",
      mainImage: img("1531346878377-a5be20888e57"),
      image_url: [img("1531346878377-a5be20888e57")],
    },
    {
      name: "The Psychology of Money by Morgan Housel",
      description:
        "Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money and how to think about it better.",
      price: 16,
      stock: 180,
      brand: "Harriman House",
      mainImage: img("1554224155-6726b3ff858f"),
      image_url: [img("1554224155-6726b3ff858f")],
    },
    {
      name: "Stabilo Boss Highlighter Set (8 colours)",
      description:
        "Set of 8 classic STABILO BOSS Original highlighters in assorted colours. The triangular barrel prevents rolling and the ink is smear-proof on ink and toner.",
      price: 14,
      stock: 160,
      brand: "Stabilo",
      mainImage: img("1583485088034-d0315aaa2038"),
      image_url: [img("1583485088034-d0315aaa2038")],
    },
    {
      name: "Deep Work by Cal Newport",
      description:
        "Rules for focused success in a distracted world. Newport argues that the ability to perform deep work is becoming rare and increasingly valuable.",
      price: 17,
      stock: 140,
      brand: "Grand Central Publishing",
      mainImage: img("1456513080510-7bf3a84b82f8"),
      image_url: [img("1456513080510-7bf3a84b82f8")],
    },
  ],

  "Kitchen & Home": [
    {
      name: "Nespresso Vertuo Next Coffee Machine",
      description:
        "Brews 5 cup sizes using Centrifusion technology. Simply insert a capsule, press the button and get a perfect barista-style cup every time.",
      price: 179,
      stock: 25,
      brand: "Nespresso",
      mainImage: img("1495474472287-4d71bcdd2085"),
      image_url: [
        img("1495474472287-4d71bcdd2085"),
        img("1510972562323-e9c7b483a2c4"),
      ],
    },
    {
      name: 'Lodge 12" Pre-Seasoned Cast Iron Skillet',
      description:
        "American-made cast iron skillet with superior heat retention and even distribution. Pre-seasoned with vegetable oil and ready to use right out of the box.",
      price: 39,
      stock: 55,
      brand: "Lodge",
      mainImage: img("1544233726-9f1d2b27be8b"),
      image_url: [img("1544233726-9f1d2b27be8b")],
    },
    {
      name: "KitchenAid Stand Mixer 4.8L",
      description:
        "Iconic stand mixer with a 4.8L stainless steel bowl, 10 speeds, tilt-head design and a powerful motor. Comes with flat beater, dough hook and wire whip.",
      price: 499,
      stock: 10,
      brand: "KitchenAid",
      mainImage: img("1594212699915-d8a78053a516"),
      image_url: [img("1594212699915-d8a78053a516")],
    },
    {
      name: "Instant Pot Duo 7-in-1 6Qt",
      description:
        "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. 13 one-touch programs.",
      price: 99,
      stock: 40,
      brand: "Instant Pot",
      mainImage: img("1585515320310-259814833e62"),
      image_url: [img("1585515320310-259814833e62")],
    },
    {
      name: "Yankee Candle Large Jar — Vanilla Cupcake",
      description:
        "Iconic large jar candle with up to 150 hours of fragrance. The warm, sweet scent of freshly baked vanilla cupcakes fills any room beautifully.",
      price: 32,
      stock: 75,
      brand: "Yankee Candle",
      mainImage: img("1603905088689-09b50cbcced5"),
      image_url: [img("1603905088689-09b50cbcced5")],
    },
  ],

  "Toys & Kids": [
    {
      name: "LEGO Technic Land Rover Defender",
      description:
        "Build and display the iconic Land Rover Defender 90 in LEGO Technic form. Features 2573 pieces, opening doors, bonnet, detailed interior and authentic design.",
      price: 199,
      stock: 20,
      brand: "LEGO",
      mainImage: img("1587654780291-39c9404d746b"),
      image_url: [
        img("1587654780291-39c9404d746b"),
        img("1558877385-81a1c7e67d72"),
      ],
    },
    {
      name: "Melissa & Doug Wooden Puzzle Set",
      description:
        "Set of 4 chunky wooden puzzles featuring farm animals, vehicles, sea life and dinosaurs. Encourages fine motor skills and shape recognition for ages 2+.",
      price: 28,
      stock: 65,
      brand: "Melissa & Doug",
      mainImage: img("1594736797933-d0501ba2fe65"),
      image_url: [img("1594736797933-d0501ba2fe65")],
    },
    {
      name: "Nerf Elite 2.0 Commander Blaster",
      description:
        "Features AccuStrike darts for improved accuracy, 6-dart rotating drum, pull-back priming and fires darts up to 27 metres. Ages 8 and up.",
      price: 34,
      stock: 50,
      brand: "Nerf",
      mainImage: img("1558060370-d644479cb6f7"),
      image_url: [img("1558060370-d644479cb6f7")],
    },
    {
      name: "Hot Wheels Ultimate Garage Playset",
      description:
        "Massive 4-level garage with over 100 car capacity, a working car wash, spiral ramp, elevator and a surprise monster truck that chomps cars.",
      price: 89,
      stock: 18,
      brand: "Hot Wheels",
      mainImage: img("1568515387631-8dd992b27494"),
      image_url: [img("1568515387631-8dd992b27494")],
    },
  ],

  Automotive: [
    {
      name: "Vantrue E1 Lite 4K Dash Cam",
      description:
        "4K UHD front dash cam with Sony STARVIS 2 night vision, 24/7 parking mode, GPS speed tracking, voice control and a 170° wide angle lens.",
      price: 129,
      stock: 30,
      brand: "Vantrue",
      mainImage: img("1449965408869-eaa3f722e40d"),
      image_url: [img("1449965408869-eaa3f722e40d")],
    },
    {
      name: "Anker 67W USB-C Car Charger",
      description:
        "Compact 67W dual-port car charger with one USB-C port (45W) and one USB-A port (22.5W). Charges a MacBook, iPhone and iPad simultaneously.",
      price: 35,
      stock: 80,
      brand: "Anker",
      mainImage: img("1593941707882-a5bba53b0998"),
      image_url: [img("1593941707882-a5bba53b0998")],
    },
    {
      name: "Chemical Guys Car Detailing Kit",
      description:
        "Complete 16-piece car detailing kit including foam cannon, microfibre towels, wash mitts, interior cleaner, tyre shine and a bucket organiser.",
      price: 79,
      stock: 35,
      brand: "Chemical Guys",
      mainImage: img("1520340329629-b65b7f7e3593"),
      image_url: [img("1520340329629-b65b7f7e3593")],
    },
    {
      name: "Michelin Heavy Duty Tyre Inflator",
      description:
        "Digital tyre inflator with automatic stop function, LED light and adapters for cars, bikes and sports equipment. Accurate to ±1 PSI.",
      price: 49,
      stock: 45,
      brand: "Michelin",
      mainImage: img("1486262715619-67b85e0b08d3"),
      image_url: [img("1486262715619-67b85e0b08d3")],
    },
  ],

  Other: [
    {
      name: "JBL Flip 6 Portable Bluetooth Speaker",
      description:
        "Bold JBL Original Pro Sound with powerful bass radiators, IP67 waterproof and dustproof rating, 12-hour battery and PartyBoost multi-speaker pairing.",
      price: 129,
      stock: 50,
      brand: "JBL",
      mainImage: img("1608043152269-423dbba4e7e1"),
      image_url: [
        img("1608043152269-423dbba4e7e1"),
        img("1545454675-3479a184e401"),
      ],
    },
    {
      name: "Polaroid Now+ Instant Camera",
      description:
        "Analog instant camera with 5 creative lens filters via Bluetooth app. Produces classic credit card-sized photos with the iconic Polaroid white border.",
      price: 149,
      stock: 22,
      brand: "Polaroid",
      mainImage: img("1526170375885-4d8ecf77b99f"),
      image_url: [img("1526170375885-4d8ecf77b99f")],
    },
    {
      name: "Kindle Paperwhite 16GB Signature Edition",
      description:
        'Our best Kindle ever. 6.8" display, adjustable warm light, wireless charging, auto-adjusting front light and months of battery life. Glare-free.',
      price: 189,
      stock: 30,
      brand: "Amazon",
      mainImage: img("1522202176988-66273c2fd55f"),
      image_url: [img("1522202176988-66273c2fd55f")],
    },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get a seller account
    const seller = await userModel.findOne({ role: "SELLER" });
    if (!seller) {
      console.error(
        "❌ No seller found. Create a seller account first then re-run.",
      );
      process.exit(1);
    }
    console.log(`👤 Using seller: ${seller.name} (${seller.email})\n`);

    // Clear existing products
    await productModel.deleteMany({});
    console.log("🗑️  Cleared existing products\n");

    let totalInserted = 0;

    for (const [categoryName, products] of Object.entries(productsByCategory)) {
      const category = await categoryModel.findOne({ name: categoryName });
      if (!category) {
        console.warn(`⚠️  Category not found: "${categoryName}" — skipping`);
        continue;
      }

      const toInsert = products.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        brand: p.brand,
        mainImage: p.mainImage,
        image_url: p.image_url,
        category_id: category._id,
        seller_id: seller._id,
        status: "ACTIVE",
        views: Math.floor(Math.random() * 500), // seed some views for popular/trending
      }));

      await productModel.insertMany(toInsert);
      console.log(
        `✅ ${categoryName.padEnd(20)} → ${toInsert.length} products`,
      );
      totalInserted += toInsert.length;
    }

    console.log(`\n🎉 Done! Total products seeded: ${totalInserted}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
