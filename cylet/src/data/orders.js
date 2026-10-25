// Mock orders dataset for Cylet Supermarket Admin Portal
// 25 realistic orders with customer details, line items, and financial summaries in KES

export const INITIAL_ORDERS = [
  {
    "id": "FM-9425",
    "customer": {
      "name": "Sophia Patel",
      "email": "sophia.patel@gmail.com",
      "phone": "+1 (555) 234-8910"
    },
    "address": {
      "street": "450 Greenpark Way, Apt 12C",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Please buzz code 1212. Leave outside the apartment door."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 640
      },
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 1920
      },
      {
        "productId": "prod-20",
        "name": "Artisan Sourdough Loaf",
        "price": 270,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (650g)",
        "total": 270
      }
    ],
    "subtotal": 2830,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 3080,
    "paymentMethod": "Credit / Debit Card (Visa •••• 4242)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Pending",
    "date": "2026-10-18T09:42:00Z",
    "formattedDate": "Today, 9:42 AM"
  },
  {
    "id": "FM-9424",
    "customer": {
      "name": "James Wilson",
      "email": "j.wilson99@outlook.com",
      "phone": "+1 (555) 781-4421"
    },
    "address": {
      "street": "104 Market Street, Suite 500",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Reception desk on the 5th floor."
    },
    "items": [
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 450
      },
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 640
      },
      {
        "productId": "prod-25",
        "name": "Cold Pressed Green Detox Juice",
        "price": 270,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        "unit": "16 fl oz",
        "total": 1080
      }
    ],
    "subtotal": 2170,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 300,
    "total": 2120,
    "paymentMethod": "M-Pesa Mobile Money (254712***456)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Processing",
    "date": "2026-10-18T08:55:00Z",
    "formattedDate": "Today, 8:55 AM"
  },
  {
    "id": "FM-9423",
    "customer": {
      "name": "Amina Kimani",
      "email": "amina.k@safari.co.ke",
      "phone": "+1 (555) 612-9082"
    },
    "address": {
      "street": "72 Westlands Ring Road",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Gate 3, security guard will direct to Villa 14."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 2340
      },
      {
        "productId": "prod-15",
        "name": "Artisan Greek Yogurt Plain",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        "unit": "32 oz tub",
        "total": 540
      },
      {
        "productId": "prod-3",
        "name": "Organic Baby Spinach",
        "price": 90,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz clamshell",
        "total": 180
      }
    ],
    "subtotal": 3060,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 650,
    "total": 2410,
    "paymentMethod": "M-Pesa Mobile Money (254722***891)",
    "paymentStatus": "Paid",
    "fulfillmentType": "pickup",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Processing",
    "date": "2026-10-18T08:12:00Z",
    "formattedDate": "Today, 8:12 AM"
  },
  {
    "id": "FM-9422",
    "customer": {
      "name": "David Ochieng",
      "email": "dochieng@techhub.net",
      "phone": "+1 (555) 441-2390"
    },
    "address": {
      "street": "18 Riverside Drive, Block B",
      "city": "Riverside",
      "postalCode": "10006",
      "instructions": "Leave with concierge."
    },
    "items": [
      {
        "productId": "prod-28",
        "name": "Single Origin Whole Bean Dark Roast",
        "price": 840,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz bag",
        "total": 1680
      },
      {
        "productId": "prod-22",
        "name": "French Butter Croissants",
        "price": 300,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 4",
        "total": 600
      }
    ],
    "subtotal": 2280,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2530,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 8821)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Dallas Estate Hub",
    "status": "Delivered",
    "date": "2026-10-18T07:30:00Z",
    "formattedDate": "Today, 7:30 AM"
  },
  {
    "id": "FM-9421",
    "customer": {
      "name": "Emily Davis",
      "email": "emily.davis@designstudio.org",
      "phone": "+1 (555) 890-1234"
    },
    "address": {
      "street": "320 Karen Road",
      "city": "Karen",
      "postalCode": "10008",
      "instructions": "Main gate call button 4."
    },
    "items": [
      {
        "productId": "prod-10",
        "name": "Organic Boneless Chicken Breast",
        "price": 540,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
        "unit": "1.5 lb pack",
        "total": 1620
      },
      {
        "productId": "prod-5",
        "name": "Organic Sweet Blueberries",
        "price": 120,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
        "unit": "6 oz pint",
        "total": 240
      },
      {
        "productId": "prod-34",
        "name": "Artisan Mixed Roasted Nuts",
        "price": 480,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz jar",
        "total": 480
      }
    ],
    "subtotal": 2340,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2590,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Pending",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Siakago Town Branch",
    "status": "Pending",
    "date": "2026-10-18T06:45:00Z",
    "formattedDate": "Today, 6:45 AM"
  },
  {
    "id": "FM-9420",
    "customer": {
      "name": "Robert Mugabe",
      "email": "rmugabe@globalhealth.org",
      "phone": "+1 (555) 772-9102"
    },
    "address": {
      "street": "15 Parklands Avenue, Floor 3",
      "city": "Parklands",
      "postalCode": "10009",
      "instructions": "Deliver to front office."
    },
    "items": [
      {
        "productId": "prod-30",
        "name": "Eco-Friendly Plant Dish Liquid",
        "price": 240,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?auto=format&fit=crop&w=800&q=80",
        "unit": "25 fl oz bottle",
        "total": 720
      },
      {
        "productId": "prod-31",
        "name": "Concentrated Laundry Detergent",
        "price": 720,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80",
        "unit": "64 fl oz (64 loads)",
        "total": 720
      }
    ],
    "subtotal": 1440,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1690,
    "paymentMethod": "Credit / Debit Card (Visa •••• 1109)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Runyenjes Branch",
    "status": "Pending",
    "date": "2026-10-18T05:10:00Z",
    "formattedDate": "Today, 5:10 AM"
  },
  {
    "id": "FM-9419",
    "customer": {
      "name": "Chloe Tremblay",
      "email": "chloe.t@montreal.ca",
      "phone": "+1 (555) 302-8871"
    },
    "address": {
      "street": "55 Kilimani Square, Apt 8",
      "city": "Kilimani",
      "postalCode": "10010",
      "instructions": "Doorbell code 88."
    },
    "items": [
      {
        "productId": "prod-4",
        "name": "Farm Fresh Heirloom Tomatoes",
        "price": 140,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 280
      },
      {
        "productId": "prod-17",
        "name": "Aged English Farmhouse Cheddar",
        "price": 360,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz block",
        "total": 720
      },
      {
        "productId": "prod-21",
        "name": "Warm Sesame Brioche Buns",
        "price": 240,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 6",
        "total": 240
      }
    ],
    "subtotal": 1240,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1490,
    "paymentMethod": "Credit / Debit Card (Visa •••• 9920)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Manyatta Outpost",
    "status": "Cancelled",
    "date": "2026-10-17T21:40:00Z",
    "formattedDate": "Yesterday, 9:40 PM"
  },
  {
    "id": "FM-9418",
    "customer": {
      "name": "Alexander Novak",
      "email": "a.novak@eastern.eu",
      "phone": "+1 (555) 492-3810"
    },
    "address": {
      "street": "10 Village Market Parkway",
      "city": "Gigiri",
      "postalCode": "10011",
      "instructions": "Deliver to Embassy security annex."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 3840
      },
      {
        "productId": "prod-29",
        "name": "Organic Sparkling Lemon Mineral Water",
        "price": 360,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
        "unit": "pack of 6 x 12 oz",
        "total": 1080
      }
    ],
    "subtotal": 4920,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 980,
    "total": 3940,
    "paymentMethod": "Credit / Debit Card (Amex •••• 3001)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Ishiara Branch",
    "status": "Delivered",
    "date": "2026-10-17T18:15:00Z",
    "formattedDate": "Yesterday, 6:15 PM"
  },
  {
    "id": "FM-9417",
    "customer": {
      "name": "Grace Wanjiku",
      "email": "wanjiku.grace@gmail.com",
      "phone": "+1 (555) 912-4501"
    },
    "address": {
      "street": "12 South End Highway",
      "city": "Nairobi South",
      "postalCode": "10012",
      "instructions": "House with the green perimeter gate."
    },
    "items": [
      {
        "productId": "prod-11",
        "name": "Fresh Wild Tiger Prawns",
        "price": 990,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb raw deveined",
        "total": 1980
      },
      {
        "productId": "prod-6",
        "name": "Organic Hass Avocados Box",
        "price": 80,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "box of 8",
        "total": 80
      }
    ],
    "subtotal": 2060,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2310,
    "paymentMethod": "M-Pesa Mobile Money (254701***239)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Majengo Center",
    "status": "Delivered",
    "date": "2026-10-17T16:20:00Z",
    "formattedDate": "Yesterday, 4:20 PM"
  },
  {
    "id": "FM-9416",
    "customer": {
      "name": "Liam Murphy",
      "email": "liam.murphy@ireland.ie",
      "phone": "+1 (555) 782-9011"
    },
    "address": {
      "street": "450 Greenpark Way, Suite 4",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Curbside slot #3."
    },
    "items": [
      {
        "productId": "prod-23",
        "name": "Kettle-Boiled Everything Bagels",
        "price": 240,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 6",
        "total": 480
      },
      {
        "productId": "prod-18",
        "name": "European Salted Butter",
        "price": 260,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz block",
        "total": 520
      }
    ],
    "subtotal": 1000,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 0,
    "total": 1000,
    "paymentMethod": "Credit / Debit Card (Visa •••• 5512)",
    "paymentStatus": "Paid",
    "fulfillmentType": "pickup",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Delivered",
    "date": "2026-10-17T14:10:00Z",
    "formattedDate": "Yesterday, 2:10 PM"
  },
  {
    "id": "FM-9415",
    "customer": {
      "name": "Maria Santos",
      "email": "maria.santos@latam.org",
      "phone": "+1 (555) 671-2918"
    },
    "address": {
      "street": "104 Market Street, Apt 19B",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Deliver between 1 PM and 2 PM."
    },
    "items": [
      {
        "productId": "prod-7",
        "name": "Crisp English Cucumbers",
        "price": 160,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
        "unit": "each",
        "total": 640
      },
      {
        "productId": "prod-12",
        "name": "Lean Ground Beef 90/10",
        "price": 420,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb vacuum pack",
        "total": 1260
      },
      {
        "productId": "prod-37",
        "name": "Dark Chocolate Sea Salt Caramels",
        "price": 330,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
        "unit": "7 oz box",
        "total": 660
      }
    ],
    "subtotal": 2560,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2810,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 7733)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-17T11:05:00Z",
    "formattedDate": "Yesterday, 11:05 AM"
  },
  {
    "id": "FM-9414",
    "customer": {
      "name": "Kenneth Mwangi",
      "email": "k.mwangi@capital.co.ke",
      "phone": "+1 (555) 431-8977"
    },
    "address": {
      "street": "72 Westlands Ring Road, Penthouse",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Leave with concierge."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 5,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 4800
      },
      {
        "productId": "prod-16",
        "name": "Fresh Mozzarella di Bufala Ball",
        "price": 290,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=800&q=80",
        "unit": "8 oz in brine",
        "total": 870
      }
    ],
    "subtotal": 5670,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 1130,
    "total": 4540,
    "paymentMethod": "M-Pesa Mobile Money (254711***982)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-16T19:22:00Z",
    "formattedDate": "Oct 16, 7:22 PM"
  },
  {
    "id": "FM-9413",
    "customer": {
      "name": "Jessica Taylor",
      "email": "jess.taylor@nyu.edu",
      "phone": "+1 (555) 883-1200"
    },
    "address": {
      "street": "88 Valley Arcade Square",
      "city": "Lavington",
      "postalCode": "10004",
      "instructions": "Corner townhouse."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 1280
      },
      {
        "productId": "prod-13",
        "name": "Organic Whole Milk Glass Bottle",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
        "unit": "64 fl oz (half gallon)",
        "total": 540
      }
    ],
    "subtotal": 1820,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2070,
    "paymentMethod": "Credit / Debit Card (Visa •••• 6602)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Siakago Road Wholesale Hub",
    "status": "Delivered",
    "date": "2026-10-16T15:10:00Z",
    "formattedDate": "Oct 16, 3:10 PM"
  },
  {
    "id": "FM-9412",
    "customer": {
      "name": "Daniel Kiprotich",
      "email": "dkiprotich@athletics.org",
      "phone": "+1 (555) 332-9019"
    },
    "address": {
      "street": "200 Airport Road Gateway",
      "city": "Embakasi",
      "postalCode": "10007",
      "instructions": "Cargo terminal gate 2."
    },
    "items": [
      {
        "productId": "prod-35",
        "name": "Organic Raw Wildflower Honey",
        "price": 510,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz jar",
        "total": 1020
      },
      {
        "productId": "prod-27",
        "name": "Sparkling Berry Kombucha",
        "price": 210,
        "quantity": 6,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
        "unit": "14 fl oz",
        "total": 1260
      }
    ],
    "subtotal": 2280,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2530,
    "paymentMethod": "M-Pesa Mobile Money (254705***443)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-16T11:45:00Z",
    "formattedDate": "Oct 16, 11:45 AM"
  },
  {
    "id": "FM-9411",
    "customer": {
      "name": "Sarah Connor",
      "email": "sarah.c@cyberdyne.org",
      "phone": "+1 (555) 198-4202"
    },
    "address": {
      "street": "104 Market Street, Room 102",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Deliver to front desk."
    },
    "items": [
      {
        "productId": "prod-33",
        "name": "All-Natural Almond Butter Crunchy",
        "price": 420,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz jar",
        "total": 840
      },
      {
        "productId": "prod-24",
        "name": "Whole Wheat Farmhouse Sliced Bread",
        "price": 230,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (600g)",
        "total": 460
      }
    ],
    "subtotal": 1300,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1550,
    "paymentMethod": "Credit / Debit Card (Visa •••• 1004)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-15T16:30:00Z",
    "formattedDate": "Oct 15, 4:30 PM"
  },
  {
    "id": "FM-9410",
    "customer": {
      "name": "Victor Vance",
      "email": "vvance@vicecity.com",
      "phone": "+1 (555) 777-8899"
    },
    "address": {
      "street": "72 Westlands Ring Road",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Ring bell at entrance."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 3120
      }
    ],
    "subtotal": 3120,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 620,
    "total": 2500,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 9928)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-15T14:15:00Z",
    "formattedDate": "Oct 15, 2:15 PM"
  },
  {
    "id": "FM-9409",
    "customer": {
      "name": "Nadia Petrova",
      "email": "n.petrova@nordic.com",
      "phone": "+1 (555) 881-2391"
    },
    "address": {
      "street": "18 Riverside Drive, Apt 3",
      "city": "Riverside",
      "postalCode": "10006",
      "instructions": "Ground floor unit."
    },
    "items": [
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 300
      },
      {
        "productId": "prod-3",
        "name": "Organic Baby Spinach",
        "price": 90,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
        "unit": "16 oz clamshell",
        "total": 270
      }
    ],
    "subtotal": 570,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 820,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Dallas Estate Hub",
    "status": "Delivered",
    "date": "2026-10-15T09:20:00Z",
    "formattedDate": "Oct 15, 9:20 AM"
  },
  {
    "id": "FM-9408",
    "customer": {
      "name": "Brian Otieno",
      "email": "botieno@energy.ke",
      "phone": "+1 (555) 902-3341"
    },
    "address": {
      "street": "320 Karen Road, House 7",
      "city": "Karen",
      "postalCode": "10008",
      "instructions": "Deliver to main veranda."
    },
    "items": [
      {
        "productId": "prod-10",
        "name": "Organic Boneless Chicken Breast",
        "price": 540,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
        "unit": "1.5 lb pack",
        "total": 2160
      }
    ],
    "subtotal": 2160,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2410,
    "paymentMethod": "M-Pesa Mobile Money (254728***119)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Siakago Town Branch",
    "status": "Delivered",
    "date": "2026-10-14T17:50:00Z",
    "formattedDate": "Oct 14, 5:50 PM"
  },
  {
    "id": "FM-9407",
    "customer": {
      "name": "Hannah Abbott",
      "email": "hannah.a@hufflepuff.org",
      "phone": "+1 (555) 431-7722"
    },
    "address": {
      "street": "15 Parklands Avenue, Apt 2B",
      "city": "Parklands",
      "postalCode": "10009",
      "instructions": "Doorbell is loud."
    },
    "items": [
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 960
      },
      {
        "productId": "prod-20",
        "name": "Artisan Sourdough Loaf",
        "price": 270,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "unit": "loaf (650g)",
        "total": 540
      }
    ],
    "subtotal": 1500,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1750,
    "paymentMethod": "Credit / Debit Card (Visa •••• 4490)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Evening (5 PM - 8 PM)",
    "branchName": "Cylet Supermarket - Runyenjes Branch",
    "status": "Delivered",
    "date": "2026-10-14T13:40:00Z",
    "formattedDate": "Oct 14, 1:40 PM"
  },
  {
    "id": "FM-9406",
    "customer": {
      "name": "Samuel Jackson",
      "email": "s.jackson@shield.gov",
      "phone": "+1 (555) 911-0007"
    },
    "address": {
      "street": "55 Kilimani Square, Suite 900",
      "city": "Kilimani",
      "postalCode": "10010",
      "instructions": "Top floor executive suite."
    },
    "items": [
      {
        "productId": "prod-8",
        "name": "Grass-Fed Ribeye Steak",
        "price": 960,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz cut",
        "total": 2880
      },
      {
        "productId": "prod-28",
        "name": "Single Origin Whole Bean Dark Roast",
        "price": 840,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        "unit": "12 oz bag",
        "total": 1680
      }
    ],
    "subtotal": 4560,
    "deliveryFee": 0,
    "tax": 0,
    "discount": 910,
    "total": 3650,
    "paymentMethod": "Credit / Debit Card (Amex •••• 1009)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Manyatta Outpost",
    "status": "Delivered",
    "date": "2026-10-13T16:15:00Z",
    "formattedDate": "Oct 13, 4:15 PM"
  },
  {
    "id": "FM-9405",
    "customer": {
      "name": "Zoe Saldana",
      "email": "zoe.s@hollywood.com",
      "phone": "+1 (555) 345-6789"
    },
    "address": {
      "street": "10 Village Market Parkway, Villa 2",
      "city": "Gigiri",
      "postalCode": "10011",
      "instructions": "Private drive."
    },
    "items": [
      {
        "productId": "prod-25",
        "name": "Cold Pressed Green Detox Juice",
        "price": 270,
        "quantity": 6,
        "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
        "unit": "16 fl oz",
        "total": 1620
      },
      {
        "productId": "prod-36",
        "name": "Organic Chia & Hemp Seed Clusters",
        "price": 360,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "unit": "10 oz pouch",
        "total": 1080
      }
    ],
    "subtotal": 2700,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2950,
    "paymentMethod": "Credit / Debit Card (Visa •••• 7711)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Ishiara Branch",
    "status": "Delivered",
    "date": "2026-10-13T11:20:00Z",
    "formattedDate": "Oct 13, 11:20 AM"
  },
  {
    "id": "FM-9404",
    "customer": {
      "name": "Patrick Njoroge",
      "email": "pnjoroge@finance.ke",
      "phone": "+1 (555) 601-2384"
    },
    "address": {
      "street": "12 South End Highway",
      "city": "Nairobi South",
      "postalCode": "10012",
      "instructions": "Front desk reception."
    },
    "items": [
      {
        "productId": "prod-11",
        "name": "Fresh Wild Tiger Prawns",
        "price": 990,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb raw deveined",
        "total": 1980
      },
      {
        "productId": "prod-12",
        "name": "Lean Ground Beef 90/10",
        "price": 420,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb vacuum pack",
        "total": 840
      }
    ],
    "subtotal": 2820,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 3070,
    "paymentMethod": "M-Pesa Mobile Money (254721***002)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Supermarket - Majengo Center",
    "status": "Delivered",
    "date": "2026-10-12T15:45:00Z",
    "formattedDate": "Oct 12, 3:45 PM"
  },
  {
    "id": "FM-9403",
    "customer": {
      "name": "Alice Cooper",
      "email": "alice.cooper@rock.net",
      "phone": "+1 (555) 666-1818"
    },
    "address": {
      "street": "104 Market Street, Suite 200",
      "city": "Metropolis",
      "postalCode": "10001",
      "instructions": "Knock loudly."
    },
    "items": [
      {
        "productId": "prod-37",
        "name": "Dark Chocolate Sea Salt Caramels",
        "price": 330,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
        "unit": "7 oz box",
        "total": 1320
      }
    ],
    "subtotal": 1320,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1570,
    "paymentMethod": "Credit / Debit Card (Mastercard •••• 3321)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Night Express (8 PM - 10 PM)",
    "branchName": "Cylet Supermarket - Embu Main Branch",
    "status": "Delivered",
    "date": "2026-10-12T19:30:00Z",
    "formattedDate": "Oct 12, 7:30 PM"
  },
  {
    "id": "FM-9402",
    "customer": {
      "name": "Lucas Scott",
      "email": "lucas.scott@raven.org",
      "phone": "+1 (555) 443-8822"
    },
    "address": {
      "street": "450 Greenpark Way, Apt 5",
      "city": "Greenpark",
      "postalCode": "10005",
      "instructions": "Side entrance door."
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Organic Honeycrisp Apples",
        "price": 320,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
        "unit": "per lb",
        "total": 960
      },
      {
        "productId": "prod-14",
        "name": "Pasture-Raised Grade A Large Eggs",
        "price": 320,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
        "unit": "carton of 12",
        "total": 640
      }
    ],
    "subtotal": 1600,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 1850,
    "paymentMethod": "Cash on Delivery (COD)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Morning (8 AM - 11 AM)",
    "branchName": "Cylet Express - Kubukubu Road Junction",
    "status": "Delivered",
    "date": "2026-10-12T08:10:00Z",
    "formattedDate": "Oct 12, 8:10 AM"
  },
  {
    "id": "FM-9401",
    "customer": {
      "name": "Brooke Davis",
      "email": "clothes.over.bros@treehill.com",
      "phone": "+1 (555) 991-3820"
    },
    "address": {
      "street": "72 Westlands Ring Road, Penthouse A",
      "city": "Westlands",
      "postalCode": "10002",
      "instructions": "Elevator keycard required."
    },
    "items": [
      {
        "productId": "prod-9",
        "name": "Wild Caught Atlantic Salmon Fillet",
        "price": 780,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
        "unit": "1 lb fresh fillet",
        "total": 1560
      },
      {
        "productId": "prod-2",
        "name": "Fresh Hass Avocados",
        "price": 150,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
        "unit": "bag of 4",
        "total": 300
      }
    ],
    "subtotal": 1860,
    "deliveryFee": 250,
    "tax": 0,
    "discount": 0,
    "total": 2110,
    "paymentMethod": "Credit / Debit Card (Visa •••• 9901)",
    "paymentStatus": "Paid",
    "fulfillmentType": "delivery",
    "deliverySlot": "Afternoon (12 PM - 3 PM)",
    "branchName": "Cylet Supermarket - Kangaru Branch",
    "status": "Delivered",
    "date": "2026-10-11T12:00:00Z",
    "formattedDate": "Oct 11, 12:00 PM"
  }
];
