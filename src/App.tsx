/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Roll Republik - Single File Full Code Application
 */

import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 1. TYPES & DATA MODELS
// ==========================================
export type ScreenTab = 
  | 'menu-and-drops' 
  | 'custom-roll-lab' 
  | 'late-night-munchies' 
  | 'order-tracker' 
  | 'republik-rewards';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  subtitle: string;
  quantity: number;
  image?: string;
  emoji?: string;
  customDetails?: {
    wrap: string;
    protein: string;
    greens: string[];
    sauces: string[];
    seasoning: string;
    calories: number;
  };
}

export interface MenuItem {
  id: string;
  title: string;
  category: string;
  price: number;
  calories: number;
  spiceLevel: 'Mild' | 'Medium' | 'High' | 'Nuclear';
  spiceRating: number;
  tag: string;
  tagColor: string;
  description: string;
  highlightBadge: string;
  image: string;
  isBestseller?: boolean;
}

export interface DipAddon {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export interface WrapOption {
  id: string;
  name: string;
  price: number;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

export interface ProteinOption {
  id: string;
  name: string;
  basePrice: number;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  spice: number;
  tag?: string;
  description: string;
}

export interface SauceOption {
  id: string;
  name: string;
  subtitle: string;
  heat: number;
  icon: string;
  bgColor: string;
}

export interface SeasoningOption {
  id: string;
  name: string;
  description: string;
}

export interface CommunityPreset {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  reviewCount: string;
  badge: string;
  badgeColor: string;
  wrap: string;
  protein: string;
  image: string;
  calories: number;
  macroNotes: string;
}

export interface LateNightCombo {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  badge: string;
  badgeType: string;
  serves: string;
  description: string;
  featureTag: string;
  featureIcon: string;
  image: string;
  spanClass: string;
}

export interface MidnightSide {
  id: string;
  title: string;
  price: number;
  description: string;
  tag: string;
  image: string;
}

// ==========================================
// 2. DATA CONSTANTS & BRAND ASSETS
// ==========================================
export const BRAND_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1WZMrgKeOPNIDbOQc-wf2UTmz0H5qYppHp1hI_wb344yFoAW-xhbWygPTNJqNGOAhuVmgCkWLqco6CAdKpXuhdMQkwxbIetcm88jc9ntiIhH7iRhi6Iic08aA1B-FJgLeo0PirzvV6KBMqx28fkONcFosqCTGzJtjso6cUzugbwbky8d_KJa3kLJPNE0GzFfRkgV19UJjjuJhbn4mGj6Efo69-YCbiAI-qbT1wszpvXfp3l5mTfNRyIa2aA',
  userProfile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD928NAocKOYzw9Op837atYfTgPUXUw5UCqQgRi8O9eIJezyk7NlKG7gFLpfFaPzTp6JovseCxRkDmbGptZc_HM6UFBB_zwPrYiUfiDKYnqXn8BolmvMw-tR6a_L-VX56R_i40GCly-G8Iz7bVWKjOZs4aR9KF7rT_nE6701bEsgWAGRvwlzJJ7qdeibI4sJA-rzHqdYoy3Rc_CwAa0rdKXf-QnRUqOUVoMUhfuBjyLtJIjQXKPwuJ5hg',
  heroItem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoUSAuK3_C2oXQQT3eyYKVu0-EaQr5kZuCFIJUUq6F17PdoMsaxyDQlAhVDknCJBaO3QNf9mFvnBQqMLZontgrN7A-jt56wZmt9NLydFrCizWGcmoFKuth1sPp-9ejtsoUmlJa6ygSwos_tTHRsAxI3l_Xm_4WiyYiLYXY_WnMa-ritDUeU_gF_G8vY4IrTEG4E48ZlMs8m6ABTP2saaA3RWVJC7ZH8vy3pPjNR8NR8XmgEBnl765Z5w',
  cartThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAykxeDJNNPz6swdJAb67qw0Fv_9Fv4eInIPR43C3HIfeW_3us8OYwc2yIaFqvw1gbuyNLHnZoBdbY1CF_Jsxq2a5M3eE7acraeH0ijkpErgVjCqoi6kDvEUolfI4Ejbmw9Vmo0adsLpv4WyI_7ZERMuF7Jizbju3YldAPDV7bDelC1pvbwJ8YehiC-X2EWRjnfTMDhpl8Je5rbAibCEuWzgNG04TlvWSx85FTU__PntxQDEGTO7QytFw',
  kitchenCam: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfbfxNN0XfBaBXD6edVSAQHqwfDPNeRKEFprk2AEZQdr-8XwIQT3IYnPbv-FHX-osDC7-favODjYBaLa8ixRZ8Km7qW-iKlUPF1bCVqvYebcSguILtKQQKS2Z3UwJpxaBMWIF8aHswiZzjYXcu-OdAgEXeDK7k1F_kNwWko-rCL-J6JDXZesjBGmry9J0i9BvK91WoGHRl7aocvzHeS9abvbE0bfBBdtTSr-RJNVtmnG-jDquyAKlBsg',
  mapBackground: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8bNUtH2gooLXgN07PY9MOEndT3_YGNKDfd7sX_LXDdYj4ETszNNzHnEFL2opbLXP856Gqak1z7KMSCF3NNLQdWskMjpNSoAyMFkzjKcQ1RxN23uYdDyAPx5amtPYZkqcNGljmhxx4sP-amVUml2FJh193cm8-0p7hFu8-EqaVDFhdkBi8rmKJj0ZDVvgq7KvXUJpVVvh8rE91lvQ41YDJYuEAfG1pstQ6llPvbmYsoFefWBaBSEylKw',
  riderPortrait: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAVnTgev-61dZ0sUhgMJoWQIJfH99EQZO7GpxGWVD_RYAEDF-P4RbO96A40RtVAK91p5ZIzvc7IF15KpIUIMO0JJjL9hNz0-uoPCW2jTWdI80sFdMljKyQEfUQzf1FwswOS35nnsEpvG6E1XuqxPRusBmR7PReFLTbdak--ox_rbI_oLvrCmelp8WqgR8ptOEWHQX6OpvuHPMWFhfPxMKsez9VjVBEiQQ7uG3qw1nXBleAiR50J9V8pg'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'roll-1',
    title: 'THE O.G. DOUBLE CHICKEN TIKKA ROLL',
    category: 'Butter Chicken & Tikka',
    price: 189,
    calories: 480,
    spiceLevel: 'High',
    spiceRating: 3,
    tag: 'Bestseller ⭐',
    tagColor: 'bg-[#feb700] text-[#271900]',
    description: 'Charcoal grilled smoky tikka, mint jalapeño mayo, crisp pickled onions, layered flaky paratha.',
    highlightBadge: '100% Desi Ghee Laccha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvSv7aoJ0WUB9c8fL_HqAzBl-3OOycGVsLqZB5fjurlZSAV0KXPNJAdEBLZDTNbG8hB4Y9K0H7Z7z_ItfXAYWfROw8AcYYgavPSmnmbulUQo_UEi_VLKcYFEo8DHy4nWZuhlF7nghKi5k7HcEgl5n_P10UF4oTjbOnZ_eWk-INUmjwioCJ6n0NgCxwWpnWcOOxPPID9oMl_M98XANpUgIww9U0wHHO0-Xqy_b6ID6cysQ5J4kYQUH0_w',
    isBestseller: true
  },
  {
    id: 'roll-2',
    title: 'TRIPLE CHEESE PANEER MAKHANI ROLL',
    category: 'Paneer & Cheese',
    price: 169,
    calories: 520,
    spiceLevel: 'Medium',
    spiceRating: 2,
    tag: 'Trending 🔥',
    tagColor: 'bg-[#dc320d] text-white',
    description: 'Malai paneer cubes dunked in velvet makhani gravy, mozzarella stretch, aromatic tandoori spices.',
    highlightBadge: 'Mozzarella + Cheddar Blend',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa_ufDX8jiMXO6_hzGTffTIlnwre4lvXC1DBQufUwx90wizbDP9EzVHZJQuSDq2zMIpcSaLdQFXUyoo2EDUtP82srHNHPKAjgpFLcdvS57gqsVM3N9Lo4DzkCyXr4Ds-TlIRcjr4vY41GAG-mOKi4kjxJZgDRkUkRkNnCC86FTUBbRc1Ecgb6tvi3RSMAi3lM8JKw4sYJS6J4rDbsG-z6tGYoW-fkLSU4cXcb-2UMxKKL2ZgKs-jEi8A'
  },
  {
    id: 'roll-3',
    title: 'KOLKATA STREET EGG-CHICKEN FUSION',
    category: 'Double Egg',
    price: 159,
    calories: 460,
    spiceLevel: 'High',
    spiceRating: 3,
    tag: 'OG Street Classic',
    tagColor: 'bg-[#00855b] text-white',
    description: 'Double farm eggs layered paratha with spiced minced chicken bhuna, kashundi mustard punch.',
    highlightBadge: '2 Farm Eggs Glazed',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYE_mTQx-5ZD4wrF2ChShCEp0kmGjphJEhpFqnAmCLiUXX5lqsJPgX3g-BdgwM_DrBoLx6IKxKIjeH7AUjUXGxGD4_eGsxgNOwnFKGfWr088K57JYJDuty8Ju99xMFerENKnpChSu6zfKQflbWEDvyfQwbcyV_wHYjLzikWy0I-Uv9TLo-jib00eu6igRTD0LTbP6gvpLpqF3Gh6fDf0cpWEbal2ig2BxIXo7ne3PrkZueqKYt6QvUvw'
  },
  {
    id: 'roll-4',
    title: 'GHOST PEPPER PERI-PERI ROLL',
    category: 'Extreme Spicy Club',
    price: 199,
    calories: 510,
    spiceLevel: 'Nuclear',
    spiceRating: 4,
    tag: 'Extreme 💀',
    tagColor: 'bg-[#1b1b1e] text-[#ffba20]',
    description: 'For spicy thrill-seekers! Shredded fiery chicken with habanero chili crunch & garlic aioli.',
    highlightBadge: 'Waiver Signed Drop',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_70YYpUmtUNABXLTKOPBMHvXz4M4vBoNJXuIqS2vHr9eXhkvUNb5oUPAzjQhZ9JqEz1HH7pR2AbDwPlURuCLBQUXW4WlY4alFatHB4t-uG9AP3vWiwiDFqqjNOV-vU2NpWAYd6wK1aRHGti-kfsFC7Mq9le-o_Ns4GhfosKbV91zgOBrO0s81ropPi-QcOOaRi2ZcNe3HNTuXpPs4ckUKadLDdzDtmFSgQZfA5MS-qrOfRrQZoeELQg'
  },
  {
    id: 'roll-5',
    title: 'CRISPY FALAFEL & BEET HUMMUS ROLL',
    category: 'Multi-Grain Wraps',
    price: 149,
    calories: 390,
    spiceLevel: 'Mild',
    spiceRating: 1,
    tag: 'Vegan Vibe 🌿',
    tagColor: 'bg-[#006947] text-white',
    description: 'Mediterranean street wrap with crunchy falafels, tahini drizzle, ruby pomegranate pearls.',
    highlightBadge: '100% Whole Wheat Paratha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0_KmpdyLx_VhFsBu2vqhsUWYXMN8v7j8lqr-DFjWbpyyd6WEXV9wiD_LgcEu8QDrGK4ujHWMj5JdVYBx5SpMW8neS_8vPWunKaABkvINtuy5osXRfsFOryr4ce_XUXtl-XV4PPKUF-zxqR2hIa4DTTsajqZ74OB6MhESvLiPK9uyiEyT_PFq8oH5q_Rq3_nziy7C7L5tzlVKJXw9X_lcDofN77226_g5BKlwNw9u0EAcahnrm-jsAeA'
  },
  {
    id: 'roll-6',
    title: 'NUTELLA BANANA CRUNCH ROLL',
    category: 'Crinkle Fries & Dips',
    price: 129,
    calories: 440,
    spiceLevel: 'Mild',
    spiceRating: 1,
    tag: 'Sweet Tooth 🍫',
    tagColor: 'bg-[#feb700] text-[#271900]',
    description: 'Sweet cravings! Crispy paratha rolled with hazelnut Nutella, sliced bananas and caramelized almonds.',
    highlightBadge: 'Pure Hazelnut Spread',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3iQlavnUjmlwp7klu9w097vd-ZE5JFjbVrf9Huinq6p4elkUKONnsQnjq_5JYeO8QtGITf14K6NonwlqkizXGDRh9yHFmVUUvNaO2_bvTKs3hgnVo-IUTiKc04sJiu3r9woNEBF8TKNJCYIZ90HzjEyoqjsDcuQa2myzW2uc6v2m_juSAue3U93VKtQQ4rF0X-Snh8q46NWY37UvUnIW1ffr0H8no-I5T8Xb1hugfEP8bNAuVCRAgJw'
  }
];

export const DIP_ADDONS: DipAddon[] = [
  { id: 'dip-1', name: 'Smoked Garlic Aioli', emoji: '🧄', price: 29 },
  { id: 'dip-2', name: 'Naga Ghost Crunch', emoji: '🌶️', price: 29 },
  { id: 'dip-3', name: 'Kolkata Kasundi Mayo', emoji: '🌿', price: 29 },
  { id: 'dip-4', name: 'Avo Crema Dip', emoji: '🥑', price: 35 }
];

export const WRAP_OPTIONS: WrapOption[] = [
  { id: 'wrap-1', name: 'Crispy Laccha Paratha', price: 0, kcal: 240, protein: 6, carbs: 32, fats: 11, description: 'Multi-layered flaky ghee paratha. The OG street purist choice.' },
  { id: 'wrap-2', name: 'Whole Wheat Roti', price: 0, kcal: 160, protein: 5, carbs: 30, fats: 2, description: 'Lightly roasted, zero oil. High on complex fiber.' },
  { id: 'wrap-3', name: 'Gluten-Free Oats Wrap', price: 35, kcal: 180, protein: 8, carbs: 28, fats: 4, description: 'Sprouted oat-flour flatbread rolled with flaxseeds.' },
  { id: 'wrap-4', name: 'Cheesy Garlic Crust', price: 50, kcal: 290, protein: 9, carbs: 31, fats: 16, description: 'Infused with roasted garlic butter and molten cheddar ribbons.' }
];

export const PROTEIN_OPTIONS: ProteinOption[] = [
  { id: 'prot-1', name: 'Smoky Tandoori Chicken Tikka', basePrice: 190, kcal: 220, protein: 24, carbs: 6, fats: 7, spice: 3, tag: "Chef's Bestseller", description: 'Char-grilled boneless thigh chunks with kasuri methi zing.' },
  { id: 'prot-2', name: 'Crispy Fried Paneer', basePrice: 170, kcal: 260, protein: 16, carbs: 12, fats: 16, spice: 2, tag: 'Veg Legend', description: 'Panko-crusted fresh cottage cheese batons tossed in amchur.' },
  { id: 'prot-3', name: 'Malai Soya Chaap', basePrice: 160, kcal: 210, protein: 21, carbs: 14, fats: 8, spice: 1, description: 'Melt-in-mouth soya skewers steeped in cashew cardamom cream.' },
  { id: 'prot-4', name: 'Double Egg Masala Omelette', basePrice: 140, kcal: 175, protein: 14, carbs: 3, fats: 11, spice: 2, description: 'Kolkata street-style beaten eggs with chopped onions and coriander.' },
  { id: 'prot-5', name: 'Fiery Mutton Seekh Kebab', basePrice: 230, kcal: 280, protein: 26, carbs: 4, fats: 18, spice: 4, tag: 'Supreme', description: 'Coarsely minced spiced lamb smoked on iron skewers.' }
];

export const GREENS_OPTIONS = [
  'Pickled Sirka Pyaz',
  'Charred Jalapeños',
  'Iceberg Shreds',
  'Charred Sweet Corn',
  'Tricolor Bell Peppers'
];

export const SAUCE_OPTIONS: SauceOption[] = [
  { id: 'sauce-1', name: 'Mint Mayo', subtitle: 'Pudina Herb Blast', heat: 1, icon: 'soup_kitchen', bgColor: 'bg-[#6ffbbe] text-[#002113]' },
  { id: 'sauce-2', name: 'Fiery Ghost Chili', subtitle: 'Naga Bhut Jolokia', heat: 4, icon: 'whatshot', bgColor: 'bg-[#b32100] text-white' },
  { id: 'sauce-3', name: 'Cheesy Jalapeño', subtitle: 'Warm Nacho Velvet', heat: 2, icon: 'lunch_dining', bgColor: 'bg-[#feb700] text-[#271900]' },
  { id: 'sauce-4', name: 'Tandoori Smokey', subtitle: 'Coal Infused', heat: 2, icon: 'skillet', bgColor: 'bg-[#e4e1e6] text-[#5c403a]' },
  { id: 'sauce-5', name: 'Tangy Imli', subtitle: 'Sweet-Sour Jaggery', heat: 1, icon: 'local_bar', bgColor: 'bg-[#e4e1e6] text-[#5c403a]' },
  { id: 'sauce-6', name: 'Garlic Aioli', subtitle: 'Confit Garlic Pulp', heat: 1, icon: 'grain', bgColor: 'bg-[#e4e1e6] text-[#5c403a]' }
];

export const SEASONING_OPTIONS: SeasoningOption[] = [
  { id: 'seas-1', name: 'Gunpowder Podi', description: 'Roasted lentils, red chilis, and curry leaf ashes.' },
  { id: 'seas-2', name: 'Chaat Crunch', description: 'Pounded cumin, black salt, and tart pomegranate seeds.' },
  { id: 'seas-3', name: 'Oregano Garlic Dust', description: 'Toasted wild oregano, sea salt crystals, and dry roasted garlic.' }
];

export const COMMUNITY_PRESETS: CommunityPreset[] = [
  {
    id: 'comm-1',
    title: 'The Midnight Stuffed Beast',
    author: '@arjun_rolls',
    price: 245,
    rating: 4.9,
    reviewCount: '1.4k',
    badge: 'Top Ranked #1',
    badgeColor: 'bg-[#dc320d] text-white',
    wrap: 'Crispy Laccha Paratha',
    protein: 'Smoky Tandoori Chicken Tikka',
    calories: 620,
    macroNotes: 'Laccha + Double Tikka',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOtvojY5FOcyNl933mgEd4YLNOlBvzR4m3wqiU9j4eCvytzjler37a-C3CufHiTwEiEx1E0jah6lycPTGdDJkCU2Yn8_51KrHWISDN9FG1GR56KBVVToF3A4cQF_tRwzNv99Xo4BAgLh3nki7qJwH07cG-g_d7esikk57xc6QYhGvGyQH0OpNUcvFiDw1Sw3wH1AbxCx-giYxKEeZQohNbK0og4FjV6Zbp6iw53Du0nQloL6Swqw0UUg'
  },
  {
    id: 'comm-2',
    title: 'Green Goddess Protein Wrap',
    author: '@tanvi_fits',
    price: 205,
    rating: 4.8,
    reviewCount: '890',
    badge: 'Gym Bro Pick',
    badgeColor: 'bg-[#006947] text-white',
    wrap: 'Whole Wheat Roti',
    protein: 'Crispy Fried Paneer',
    calories: 420,
    macroNotes: 'Roti + Paneer (34g Prot)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNgo-Le7AfcLQOIsK6_mXfGXs8wz-QQ7qxfDppNtcjXutugIB4o71mFfyKsQRoHjjn2e5Ics7H4NT7jur5MaJdwNWzEfveN7VkzybEDfmggk5iPgP4DaYMvrdmL3Qco-i5QqtpN7neZlGOhewhL7QZ_bSp-gmkY0d-kwhMuzDy1oF1mKnrDTEBcNwUfq8n0Y8LgdOVeoasniHUBM43lV71IMxx82k87PKw7ILPt6GI19GplsY7FS9qbg'
  },
  {
    id: 'comm-3',
    title: 'Ghost Fire Mutton Torpedo',
    author: '@sauce_emperor',
    price: 280,
    rating: 5.0,
    reviewCount: '610',
    badge: 'Spice Challenge',
    badgeColor: 'bg-[#ba1a1a] text-white',
    wrap: 'Cheesy Garlic Crust',
    protein: 'Fiery Mutton Seekh Kebab',
    calories: 680,
    macroNotes: 'Garlic Crust + Seekh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMdlGQYVsp-eyoKXyOl-E_v7GCZv2QCblnVI7s3Nlt3hud9ZiDDt_4WjXAn-roUhxREoFb0rHpdVAPkUEoCOCKNjYX_9PH0iXyqVtlaTNgNJbY7aQKPruSO0JnDWw6bcivKidAwVxUfx4Y2UsFF0gVFCJzMOXPqfZa0D5lYAsGgnmbd2gjQKZxq5Gi2h1z7rv0WS-lh_zL19d_017SDHbA552AL-we5REhlVsRG6Zfh7ruiKDUw7Asw'
  }
];

export const LATE_NIGHT_COMBOS: LateNightCombo[] = [
  {
    id: 'combo-1',
    title: 'The All-Nighter Study Combo',
    price: 349,
    originalPrice: 450,
    badge: '⚡ Save 22% OFF',
    badgeType: 'bg-[#feb700] text-[#271900]',
    serves: 'Serves 1-2 Hungry Bros',
    description: '2 Double Egg Chicken Kathi Rolls + Salted Crinkle Fries + Chilled Red Bull / Cold Soda + Extra Warm Cheddar Melt Dip. Built to sustain continuous 4 AM cramming.',
    featureTag: 'High-Protein Fuel',
    featureIcon: 'local_fire_department',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0kfuslIl60rGzzMgoQzK8um_GUM1otDSm27B6CLeb0bVam--ysyK5uQxFS3nElU-X8l9Gi7iZMdNXn2CWRc8VYSjruu2Gn7F9gmP6S_yxKGpUlBKpSRfmmlzwGKpP_i_H6XPF1gTJ-CbKl-x3sOn7TXBhFk1jIkhgMBYzTFQmld7iIqxrgC-J4QuWOq9GE72KE0bbEwMfRkgayxKzllGlxpAARY4jKMWgJyz58hKpUrIESsxP-FugYQ',
    spanClass: 'md:col-span-7'
  },
  {
    id: 'combo-2',
    title: 'Roommate Sharing Box (4 Jumbo Rolls)',
    price: 649,
    badge: 'Dorm Party Box',
    badgeType: 'bg-[#1b1b1e] text-[#f3f0f4]',
    serves: 'Serves 3-4 People',
    description: '2x Butter Chicken Rolls + 2x Paneer Makhani Rolls + 2 Thums Up Bottles (500ml) + Loaded Desi Masala Nachos. Zero fighting over the last bite.',
    featureTag: 'Wing-tested combo',
    featureIcon: 'group',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo-8rQrFciFunsLzyAce9SCCyRBmO9s71OAq-IjkA18o8EFlVTUO4LHMRTPARg4yjGPyY8jflX1rNXBxKrZltpjSMOPZnnicEcenOHYTo0omdCenU5dQBcLNKcEHumOqm76eOC8f3gQ9boSuR1i7G54Uz0XpKbYfD4LuhUBlFXNh8-pm1qHYFx7atxU4UEUlAqKyk1AhKyN0uovjdnPLlv6WxNWyCr3EogZ7PALdcVAflOAony9lvBZA',
    spanClass: 'md:col-span-5'
  }
];

export const EMERGENCY_MUNCHIE = {
  id: 'emergency-1',
  title: 'Post-Party Emergency Munchie',
  price: 239,
  spiceTag: '🌶️ EXTRA SPICY LEVEL 4',
  craveTag: 'CRAVING DESTROYER',
  description: 'Tender Fiery Mutton Bhuna roll spiced with roasted Naga peppers, bundled with double mint-garlic mayo & iced salted lime soda to revitalize you.',
  prepTime: 'Quick 10m Prep',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTXuoO_OF7hGUowP_WiMcaRdVHM9VESlbs8pHYKFalPy6ZhhrC6Lp3ON-nGSVrKBXyBwED41GVreNpTkxfeEZLzxzDIJEan4D_DxXRBsZebHAsyms7yAWBKjMG64PaxxWA2TmFWUVwp-XkGjKgCIddQTT5FgGMCTG9vY-ptYXgvl563PMHMk6htFC1ITg13G6E_-4S3mhIxWgyXSETY2Wulvm5s_KwtblfnUzG1GmUwrv5TocnyLPzhA'
};

export const MIDNIGHT_SIDES: MidnightSide[] = [
  {
    id: 'side-1',
    title: 'Cheesy Peri-Peri Fries',
    price: 119,
    description: 'Crisp crinkle cut dusted with house ghost pepper spice and warm cheese fondue.',
    tag: 'Cheesy & Tangy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe59nyJYsHcLXR0zwKad_zaYGfpiw_IsjU9BXmsE9D_h_eafD_r12EiKZld2Y1zhcknvy7-BtQKPipB9PNZsB4FvaxQDBFTmDA3klz9FkFl4wJM0v30EJqsVodfH_Wa4gwjH5KGNjPMhRqM1B66SEnahCo4K7XbJGfBrt_QznMUBixMkHvX9VWhM6XlbsmdLVKWCjpY7epOPVPkCIels7hNZHt5mp5XeQr6_6TDPPf1vDyaHNzjofDwQ'
  },
  {
    id: 'side-2',
    title: 'Loaded Nachos w/ Roll Gravy',
    price: 149,
    description: 'Corn crisps ladled with slow-cooked buttery roll gravy and melted blend cheese.',
    tag: 'Chef Special',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXdDYVxEQJKvQ53k3tpHXnCayWtfJFkwPllijcsT-8DXoQdGMbPDEd4zrmYnY93HAPaCIWKVTUUQRFf4B_LM8m1VDi2FDQb2ixQ8VeH08EGjF3NR55l1aIZNV616PE9vJlnAtjEGDsAGp_QSmfv1yDLz13P2KOkUIhlT8wIffl7d3TbQUdOR5VBhYAsYXhm9WBehwHKM-lp0EOygQX2pC4BVX1VinhelaqS1DTgCsmwgDkRPXyiV3eZQ'
  },
  {
    id: 'side-3',
    title: 'Desi Chai Flask (500ml)',
    price: 99,
    description: 'Ginger & green cardamom brewed kadak chai. Arrives piping hot with 2 clay kulhads.',
    tag: 'Hot for 90 mins',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPYsmsXBIvmli2_mgAFrhZnrwpRK8qMFuSKb4qLIumQTrL05tRiTCbPQpTFZvW2oBzeOXpAevcyyCZCFnZwIfHPJZT402cKXsOzvA4p-RCwsQiMQxyLaIf1Zd9GKYnkKVoRf_WuNSMoR54dPIwXXgTb_RjiEcgFOXEV1Pbrw4f87-l6G0DtYIj4r7HRWyPNjhPoVGe1ANANR5F_GI5wrNHcaiZ0rC3h5xHiR4IVxRBJRAQTkOungftxw'
  },
  {
    id: 'side-4',
    title: 'Midnight Brownie Roll',
    price: 129,
    description: 'Crispy lachha paratha loaded with fudge brownie, warm melted chocolate & hazelnut crumble.',
    tag: 'Sweet Craving',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp4b5PrBSPb8haqqKmQB84YEnHRjv3Lc-K2b-QfFxhgmXslD1wgwGzSoMEd8I01IVdexm53ezAjmg-FSDZzmvSTCtAPu1PhndrvA31CNbZhuIL0maCR9yLvT6bT9YHq5hdvEwxwl5-FCbmxETotZwa_29DGvND3d-v6WrbaYRjRcd6JQD8_T0m_Jxgcslk0FU6tCHGznbOqrhtZTxOG6GPBR52RkWsrfY_RpOlEpUNnvZd8EZIsWZZ1g'
  }
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-init-1',
    name: 'DOUBLE CHICKEN TIKKA',
    price: 189,
    subtitle: 'Laccha Ghee • Med Spice',
    quantity: 1,
    image: BRAND_ASSETS.cartThumb
  },
  {
    id: 'cart-init-2',
    name: 'TANDOORI GARLIC DIP',
    price: 39,
    subtitle: '50ml Dip Cup',
    quantity: 1,
    emoji: '🧄'
  }
];

// ==========================================
// 3. MAIN CONTROLLER
// ==========================================
export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('menu-and-drops');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHub, setSelectedHub] = useState<string>('Campus Hub / Store #04');
  const [appliedPromo, setAppliedPromo] = useState<string>('');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isKitchenModalOpen, setIsKitchenModalOpen] = useState<boolean>(false);
  const [isHubModalOpen, setIsHubModalOpen] = useState<boolean>(false);
  const [isKitchenChatOpen, setIsKitchenChatOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'collab' | 'sauces' | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ visible: boolean; title: string; desc: string }>({
    visible: false,
    title: '',
    desc: ''
  });

  const showToast = (title: string, desc: string) => {
    setToast({ visible: true, title, desc });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  const handleAddToCart = (newItem: {
    name: string;
    price: number;
    subtitle: string;
    image?: string;
    emoji?: string;
    customDetails?: CartItem['customDetails'];
  }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === newItem.name && item.subtitle === newItem.subtitle);
      if (existing) {
        return prev.map(item => 
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: newItem.name,
          price: newItem.price,
          subtitle: newItem.subtitle,
          quantity: 1,
          image: newItem.image,
          emoji: newItem.emoji,
          customDetails: newItem.customDetails
        }
      ];
    });
    showToast(`Added to Basket!`, `${newItem.name} (₹${newItem.price})`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleOrderSuccess = (details: { total: number }) => {
    showToast('🔥 Order Fired on Iron Tawa!', `Order #RR-8921 confirmed (₹${details.total}). Tracking live kitchen.`);
    setCurrentTab('order-tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalRollsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e] flex flex-col antialiased selection:bg-[#ffdea8] selection:text-[#271900]">
      {/* 1. Header */}
      <Header 
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartTotal={cartSubtotal}
        totalRollsCount={totalRollsCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentTab !== 'menu-and-drops') {
            setCurrentTab('menu-and-drops');
          }
        }}
        onOpenHubModal={() => setIsHubModalOpen(true)}
        selectedHub={selectedHub}
      />

      {/* 2. SubNavigation */}
      <SubNav 
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenKitchenModal={() => setIsKitchenModalOpen(true)}
      />

      {/* 3. Main Workspace */}
      <main className="w-full pt-36 pb-20 flex-1 flex flex-col">
        {currentTab === 'menu-and-drops' && (
          <MenuDropsView 
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            cartSubtotal={cartSubtotal}
            onUpdateCartQty={handleUpdateCartQty}
            onCheckout={() => setIsCheckoutOpen(true)}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
          />
        )}

        {currentTab === 'custom-roll-lab' && (
          <CustomRollLabView 
            onAddToCart={handleAddToCart}
            showToast={showToast}
          />
        )}

        {currentTab === 'late-night-munchies' && (
          <LateNightMunchiesView 
            onAddToCart={handleAddToCart}
            onApplyPromo={(code) => setAppliedPromo(code)}
            showToast={showToast}
          />
        )}

        {currentTab === 'order-tracker' && (
          <OrderTrackerView 
            showToast={showToast}
            onOpenLiveChat={() => setIsKitchenChatOpen(true)}
            onOpenKitchenModal={() => setIsKitchenModalOpen(true)}
          />
        )}

        {currentTab === 'republik-rewards' && (
          <RewardsView 
            showToast={showToast}
            onApplyPromo={(code) => setAppliedPromo(code)}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 4. Footer */}
      <Footer 
        onOpenPrivacyModal={() => setInfoModalType('privacy')}
        onOpenCollabModal={() => setInfoModalType('collab')}
        onOpenSecretSauceModal={() => setInfoModalType('sauces')}
      />

      {/* 5. Live Feed Ticker */}
      <LiveFeedTicker onOpenKitchenCam={() => setIsKitchenModalOpen(true)} />

      {/* 6. Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        appliedPromo={appliedPromo}
        onApplyPromo={(code) => {
          setAppliedPromo(code);
          showToast(`Promo Code Applied!`, `${code} activated on bill.`);
        }}
        onOrderSuccess={handleOrderSuccess}
      />

      <LiveKitchenModal 
        isOpen={isKitchenModalOpen}
        onClose={() => setIsKitchenModalOpen(false)}
      />

      <CampusHubModal 
        isOpen={isHubModalOpen}
        onClose={() => setIsHubModalOpen(false)}
        selectedHub={selectedHub}
        onSelectHub={(hub) => {
          setSelectedHub(hub);
          showToast('Campus Hub Updated', `Switched to ${hub}.`);
        }}
      />

      <LiveKitchenChatModal 
        isOpen={isKitchenChatOpen}
        onClose={() => setIsKitchenChatOpen(false)}
        showToast={showToast}
      />

      <InfoModal 
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* 7. Action Toast */}
      <div 
        className={`fixed bottom-14 right-4 sm:right-6 z-50 transform transition-all duration-300 pointer-events-none ${
          toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`}
      >
        <div className="bg-[#1b1b1e] text-[#f3f0f4] px-5 py-3.5 rounded-2xl border-2 border-[#dc320d] brutal-shadow-lg flex items-center gap-3.5 max-w-sm pointer-events-auto">
          <span className="material-symbols-outlined text-[#feb700] text-[26px] shrink-0">
            check_circle
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-sm text-white truncate">
              {toast.title}
            </span>
            <span className="font-body text-xs text-[#dcd9dd] line-clamp-1">
              {toast.desc}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. HEADER COMPONENT
// ==========================================
interface HeaderProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  cartTotal: number;
  totalRollsCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenHubModal: () => void;
  selectedHub: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  cartTotal,
  totalRollsCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenHubModal,
  selectedHub
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e4e1e6]">
      <div className="h-20 w-full px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            type="button" 
            onClick={() => onSelectTab('menu-and-drops')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <img 
              alt="Roll Republik Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              src={BRAND_ASSETS.logo}
            />
            <span className="font-headline font-bold text-xl uppercase text-[#1b1b1e] tracking-tight hidden xl:inline">
              Roll Republik
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#feb700] text-[#271900] font-label text-xs uppercase font-bold brutal-shadow-sm">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            <span>Fresh Rolls Only 🔥</span>
          </div>

          <button
            type="button"
            onClick={onOpenHubModal}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0edf1] hover:bg-[#eae7eb] text-[#5c403a] font-label text-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#b32100] text-[16px]">storefront</span>
            <span className="font-medium">{selectedHub} • 12 mins avg prep</span>
            <span className="material-symbols-outlined text-[14px] text-[#916f68]">expand_more</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-[#5c403a] text-[18px]">
              search
            </span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-[#f0edf1] rounded-full text-[#1b1b1e] placeholder:text-[#5c403a] font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#b32100] border border-transparent focus:border-[#b32100] transition-all" 
              placeholder="Search rolls, spicy levels, secret dips..." 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-[#916f68] hover:text-[#1b1b1e] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#dc320d] hover:bg-[#b32100] text-white rounded-full font-label text-xs sm:text-sm font-bold brutal-shadow active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer" 
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="font-label">₹{cartTotal}</span>
            <span className="px-2 py-0.5 bg-white text-[#b32100] rounded-full text-[11px] font-bold">
              {totalRollsCount} rolls
            </span>
          </button>

          <button 
            type="button"
            onClick={() => onSelectTab('republik-rewards')}
            className="flex items-center gap-2.5 pl-1 group text-left cursor-pointer"
          >
            <img 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-[#feb700] ring-2 ring-[#feb700]/30 group-hover:scale-105 transition-transform" 
              src={BRAND_ASSETS.userProfile}
            />
            <div className="hidden xl:flex flex-col">
              <span className="font-label text-[11px] text-[#1b1b1e] uppercase font-bold tracking-tight">
                Republik Member
              </span>
              <span className="font-label text-[11px] text-[#7c5800] font-bold">
                Sauce God ⭐ Level 4
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

// ==========================================
// 5. SUBNAV COMPONENT
// ==========================================
interface SubNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onOpenKitchenModal: () => void;
}

export const SubNav: React.FC<SubNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenKitchenModal
}) => {
  const navItems: { tab: ScreenTab; label: string }[] = [
    { tab: 'menu-and-drops', label: 'Menu & Drops' },
    { tab: 'custom-roll-lab', label: 'Custom Roll Lab' },
    { tab: 'late-night-munchies', label: 'Late Night Munchies' },
    { tab: 'order-tracker', label: 'Order Tracker' },
    { tab: 'republik-rewards', label: 'Republik Rewards ⚡' }
  ];

  return (
    <div className="fixed top-20 left-0 w-full z-40 h-12 px-4 sm:px-8 bg-[#f6f2f7] border-b border-[#e4e1e6] flex items-center justify-between overflow-x-auto scrollbar-none">
      <nav className="flex items-center gap-2 py-1 shrink-0">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => onSelectTab(item.tab)}
              className={`px-4 py-1.5 rounded-full font-label text-xs sm:text-sm uppercase transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#b32100] text-white font-bold brutal-shadow-sm'
                  : 'text-[#5c403a] hover:text-[#1b1b1e] hover:bg-[#eae7eb]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onOpenKitchenModal}
        className="hidden md:flex items-center gap-1.5 font-label text-xs text-[#006947] font-bold shrink-0 hover:bg-[#e4e1e6] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#006947] animate-pulse"></span>
        <span>Kitchen Live: 8 Woks Firing</span>
      </button>
    </div>
  );
};

// ==========================================
// 6. SCREEN 1: MENU & DROPS
// ==========================================
interface MenuDropsViewProps {
  onAddToCart: (item: {
    name: string;
    price: number;
    subtitle: string;
    image?: string;
    emoji?: string;
  }) => void;
  cartItems: CartItem[];
  cartSubtotal: number;
  onUpdateCartQty: (id: string, delta: number) => void;
  onCheckout: () => void;
  onNavigateToTab: (tab: ScreenTab) => void;
  searchQuery: string;
}

export const MenuDropsView: React.FC<MenuDropsViewProps> = ({
  onAddToCart,
  cartItems,
  cartSubtotal,
  onUpdateCartQty,
  onCheckout,
  onNavigateToTab,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedHeat, setSelectedHeat] = useState<string>('All');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'All', label: '🔥 All Rolls' },
    { id: 'Butter Chicken & Tikka', label: '🍗 Butter Chicken & Tikka' },
    { id: 'Paneer & Cheese', label: '🧀 Paneer & Cheese' },
    { id: 'Double Egg', label: '🍳 Double Egg' },
    { id: 'Extreme Spicy Club', label: '🌶️ Extreme Spicy Club' },
    { id: 'Multi-Grain Wraps', label: '🥑 Multi-Grain Wraps' },
    { id: 'Crinkle Fries & Dips', label: '🍟 Crinkle Fries & Dips' }
  ];

  const heatOptions = [
    { id: 'All', label: 'All Heat' },
    { id: 'Mild', label: 'Mild 😊' },
    { id: 'Medium', label: 'Medium 🌶️' },
    { id: 'Nuclear', label: 'Nuclear 💥' }
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      const matchesHeat = selectedHeat === 'All' || 
        (selectedHeat === 'Mild' && item.spiceLevel === 'Mild') ||
        (selectedHeat === 'Medium' && (item.spiceLevel === 'Medium' || item.spiceLevel === 'High')) ||
        (selectedHeat === 'Nuclear' && item.spiceLevel === 'Nuclear');

      return matchesSearch && matchesCategory && matchesHeat;
    });
  }, [searchQuery, selectedCategory, selectedHeat]);

  const handleAddClick = (item: MenuItem) => {
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    onAddToCart({
      name: item.title,
      price: item.price,
      subtitle: `${item.highlightBadge} • ${item.spiceLevel} Spice`,
      image: item.image
    });
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [item.id]: false }));
    }, 1000);
  };

  const handleAddDip = (dip: DipAddon) => {
    setAddedIds(prev => ({ ...prev, [dip.id]: true }));
    onAddToCart({
      name: dip.name,
      price: dip.price,
      subtitle: '50ml Secret Dip Cup',
      emoji: dip.emoji
    });
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [dip.id]: false }));
    }, 1000);
  };

  const packagingFee = cartItems.length > 0 ? 18 : 0;
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + packagingFee : 0;

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Hero Banner */}
      <section className="w-full px-4 sm:px-8 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#b32100] via-[#dc320d] to-[#feb700] shadow-xl p-5 sm:p-8 lg:p-10 border-2 border-[#1b1b1e]">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#303033] text-[#ffdea8] font-label text-xs sm:text-sm tracking-wider uppercase brutal-shadow -rotate-1">
                  <span className="material-symbols-outlined text-[#ffdea8] text-[16px]">local_fire_department</span>
                  THE ROLL REPUBLIK 🌯⚡
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#b32100] font-label text-xs uppercase font-bold brutal-shadow-sm rotate-1">
                  DROPPING HOT 🔥
                </span>
              </div>

              <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-none">
                CRISP LACCHA.<br className="hidden sm:inline" />OVERLOADED DIPS.<br />
                <span className="text-[#ffdea8] drop-shadow-[2px_2px_0px_#3e0500]">
                  ZERO MID VIBES.
                </span>
              </h1>

              <p className="font-body text-sm sm:text-base text-[#ffdad3] max-w-xl">
                Flaky, multi-layered tawa parathas stuffed till bursting with charcoal tikka, molten cheese floods & small-batch ghost chili churns.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => onAddToCart({
                    name: 'SMOKED TIKKA CRUNCH',
                    price: 189,
                    subtitle: '100% Desi Ghee Laccha • Drop #982',
                    image: BRAND_ASSETS.heroItem
                  })}
                  className="px-6 py-3 rounded-full bg-[#303033] hover:bg-[#1b1b1e] text-[#ffdea8] font-label text-sm uppercase tracking-wider font-bold border-2 border-white/20 brutal-shadow flex items-center gap-2 cursor-pointer transition-transform active:scale-95" 
                  type="button"
                >
                  <span>Claim Daily Drop (₹189)</span>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </button>
                <button 
                  type="button"
                  onClick={() => onNavigateToTab('custom-roll-lab')}
                  className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-[#1b1b1e] font-label text-sm uppercase font-bold border border-[#1b1b1e] brutal-shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#b32100]">science</span>
                  <span>Build Custom Roll</span>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-3 border-white brutal-shadow-lg rotate-2 group">
                <img 
                  alt="Daily Drop Signature Kathi Roll" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={BRAND_ASSETS.heroItem}
                />
                <div className="absolute top-3 left-3 bg-[#1b1b1e] text-[#ffba20] text-xs font-label uppercase px-2.5 py-1 rounded-full font-bold border border-[#ffba20]">
                  Drop #982 • 43 Left
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <section className="w-full px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Menu Catalog (Left Column) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Category Filter Pills */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs uppercase font-bold text-[#5c403a] tracking-wider">
                  Select Craving Category
                </span>
                <span className="font-label text-xs text-[#916f68]">
                  Showing {filteredItems.length} items
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 rounded-full font-label text-xs sm:text-sm uppercase whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#1b1b1e] text-[#f3f0f4] font-bold border-[#1b1b1e] brutal-shadow-sm'
                        : 'bg-[#f0edf1] hover:bg-[#eae7eb] text-[#5c403a] border-transparent'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Heat Level Filter */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#f6f2f7] border border-[#e4e1e6]">
              <span className="material-symbols-outlined text-[#b32100] text-[20px]">whatshot</span>
              <span className="font-label text-xs font-bold uppercase text-[#1b1b1e] mr-2">
                Spice Filter:
              </span>
              <div className="flex gap-2 flex-wrap">
                {heatOptions.map(h => (
                  <button 
                    key={h.id}
                    onClick={() => setSelectedHeat(h.id)}
                    className={`px-3 py-1 rounded-full text-xs font-label uppercase transition-colors cursor-pointer ${
                      selectedHeat === h.id
                        ? 'bg-[#b32100] text-white font-bold'
                        : 'bg-white text-[#5c403a] hover:bg-[#eae7eb]'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rolls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl overflow-hidden border-2 border-[#1b1b1e] brutal-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1b1b1e] transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#f0edf1]">
                    <img 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      src={item.image}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full font-label text-xs uppercase font-bold border border-[#1b1b1e] brutal-shadow-sm ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-[#1b1b1e]/90 text-white font-label text-xs uppercase px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
                      {item.calories} kcal
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-label text-[#5c403a] mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#f0edf1] font-bold text-[#b32100]">
                          {item.highlightBadge}
                        </span>
                        <span>•</span>
                        <span>Spice {item.spiceLevel}</span>
                      </div>
                      <h3 className="font-headline font-bold text-base sm:text-lg text-[#1b1b1e] leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-body text-xs text-[#5c403a] mt-1.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#f0edf1]">
                      <div>
                        <span className="font-label text-xs text-[#916f68]">Price</span>
                        <p className="font-headline font-extrabold text-xl text-[#1b1b1e]">
                          ₹{item.price}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleAddClick(item)}
                        className={`px-4 py-2 rounded-full font-label text-xs uppercase tracking-wider font-bold border-2 border-[#1b1b1e] transition-all flex items-center gap-1.5 cursor-pointer ${
                          addedIds[item.id]
                            ? 'bg-[#00855b] text-white border-[#00855b]'
                            : 'bg-[#feb700] hover:bg-[#ffc633] text-[#271900] brutal-shadow-sm active:translate-x-0.5 active:translate-y-0.5'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {addedIds[item.id] ? 'done' : 'add'}
                        </span>
                        <span>{addedIds[item.id] ? 'Added' : 'Add to Bag'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Secret Sauce Bar */}
            <div className="bg-[#f6f2f7] rounded-2xl p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-base text-[#1b1b1e]">
                    Republik Secret Dips (50ml Cups)
                  </h4>
                  <p className="font-body text-xs text-[#5c403a]">
                    Hand-churned twice daily in our cold storage hub.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#feb700] text-[#271900] font-label text-xs font-bold uppercase">
                  Addon Specials
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {DIP_ADDONS.map(dip => (
                  <button 
                    key={dip.id}
                    onClick={() => handleAddDip(dip)}
                    type="button"
                    className="p-3 bg-white rounded-xl border border-[#e4e1e6] hover:border-[#1b1b1e] transition-all flex flex-col items-center text-center cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{dip.emoji}</span>
                    <span className="font-headline font-bold text-xs text-[#1b1b1e] truncate w-full">
                      {dip.name}
                    </span>
                    <span className="font-label text-xs text-[#b32100] font-bold mt-1">
                      +₹{dip.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Mini Basket Summary (Right Column) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 border-2 border-[#1b1b1e] brutal-shadow-md sticky top-36 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0edf1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#dc320d] text-[22px]">
                    shopping_basket
                  </span>
                  <h3 className="font-headline font-bold text-lg text-[#1b1b1e]">
                    Live Order Basket
                  </h3>
                </div>
                <span className="font-label text-xs px-2.5 py-0.5 bg-[#f0edf1] rounded-full text-[#5c403a] font-bold">
                  {cartItems.length} distinct
                </span>
              </div>

              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-[#5c403a] text-xs">
                    Your basket is empty! Add your favorite hot rolls.
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-[#e4e1e6]" />
                        ) : (
                          <span className="w-9 h-9 rounded-lg bg-[#f0edf1] flex items-center justify-center text-lg">{item.emoji || '🌯'}</span>
                        )}
                        <div className="min-w-0">
                          <p className="font-headline font-bold text-[#1b1b1e] truncate">{item.name}</p>
                          <p className="font-body text-[#5c403a] truncate text-[11px]">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 bg-[#f0edf1] px-2 py-1 rounded-full border border-[#e4e1e6]">
                        <button onClick={() => onUpdateCartQty(item.id, -1)} className="text-[#5c403a] hover:text-[#1b1b1e] font-bold px-1 cursor-pointer" type="button">-</button>
                        <span className="font-label font-bold text-xs">{item.quantity}</span>
                        <button onClick={() => onUpdateCartQty(item.id, 1)} className="text-[#b32100] hover:text-[#dc320d] font-bold px-1 cursor-pointer" type="button">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Breakdown */}
              <div className="flex flex-col gap-1.5 pt-2 text-[#1b1b1e] text-xs border-t border-[#f0edf1]">
                <div className="flex justify-between text-[#5c403a]">
                  <span>Item Subtotal</span>
                  <span className="font-label font-bold">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#5c403a]">
                  <span>Campus Delivery</span>
                  <span className="text-[#006947] font-label font-bold uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-[#5c403a]">
                  <span>Eco Packaging</span>
                  <span className="font-label font-bold">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between font-headline text-lg text-[#1b1b1e] font-extrabold pt-2 border-t border-[#e4e1e6]">
                  <span>To Pay</span>
                  <span className="text-[#b32100]">₹{finalTotal}</span>
                </div>
              </div>

              <button 
                onClick={onCheckout}
                disabled={cartItems.length === 0}
                className="w-full py-3.5 rounded-full bg-[#b32100] hover:bg-[#dc320d] disabled:opacity-50 text-white font-label text-sm uppercase font-bold tracking-wider border-2 border-[#1b1b1e] brutal-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95" 
                type="button"
              >
                <span>Checkout Now (GPay/UPI)</span>
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 7. SCREEN 2: CUSTOM ROLL LAB
// ==========================================
interface CustomRollLabViewProps {
  onAddToCart: (item: {
    name: string;
    price: number;
    subtitle: string;
    image?: string;
    emoji?: string;
    customDetails?: CartItem['customDetails'];
  }) => void;
  showToast: (title: string, desc: string) => void;
}

export const CustomRollLabView: React.FC<CustomRollLabViewProps> = ({
  onAddToCart,
  showToast
}) => {
  const [selectedWrap, setSelectedWrap] = useState<WrapOption>(WRAP_OPTIONS[0]);
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption>(PROTEIN_OPTIONS[0]);
  const [selectedGreens, setSelectedGreens] = useState<string[]>(['Pickled Sirka Pyaz', 'Charred Jalapeños']);
  const [selectedSauces, setSelectedSauces] = useState<string[]>(['Mint Mayo', 'Fiery Ghost Chili']);
  const [selectedSeasoning, setSelectedSeasoning] = useState<SeasoningOption>(SEASONING_OPTIONS[0]);
  const [rollName, setRollName] = useState<string>('Midnight Boss Roll');

  const greensCalories = selectedGreens.length * 15;
  const saucesCalories = selectedSauces.length * 35;
  const totalCalories = selectedWrap.kcal + selectedProtein.kcal + greensCalories + saucesCalories;
  
  const totalProtein = selectedWrap.protein + selectedProtein.protein;
  const totalCarbs = selectedWrap.carbs + selectedProtein.carbs + 6;
  const totalFats = selectedWrap.fats + selectedProtein.fats + (selectedSauces.length * 4);
  const totalPrice = selectedProtein.basePrice + selectedWrap.price;

  const handleToggleGreen = (name: string) => {
    if (selectedGreens.includes(name)) {
      setSelectedGreens(selectedGreens.filter(g => g !== name));
    } else {
      setSelectedGreens([...selectedGreens, name]);
    }
  };

  const handleToggleSauce = (name: string) => {
    if (selectedSauces.includes(name)) {
      setSelectedSauces(selectedSauces.filter(s => s !== name));
    } else {
      if (selectedSauces.length >= 2) {
        setSelectedSauces([...selectedSauces.slice(1), name]);
      } else {
        setSelectedSauces([...selectedSauces, name]);
      }
    }
  };

  const handleSaveAndDropInBag = () => {
    const finalName = rollName.trim() || 'Custom Monster Roll';
    onAddToCart({
      name: finalName.toUpperCase(),
      price: totalPrice,
      subtitle: `${selectedWrap.name} • ${selectedProtein.name}`,
      image: BRAND_ASSETS.cartThumb,
      customDetails: {
        wrap: selectedWrap.name,
        protein: selectedProtein.name,
        greens: selectedGreens,
        sauces: selectedSauces,
        seasoning: selectedSeasoning.name,
        calories: totalCalories
      }
    });
    showToast(`Saved "${finalName}"!`, `Custom formulation added to bag (₹${totalPrice}).`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Lab Banner */}
      <div className="w-full px-4 sm:px-8 mb-6">
        <div className="bg-[#feb700] text-[#271900] p-4 sm:p-5 rounded-2xl border-2 border-[#1b1b1e] brutal-shadow flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-[#271900] text-[#feb700] rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </span>
            <div>
              <span className="font-headline font-bold text-base sm:text-lg uppercase tracking-tight block">
                ROLL LAB WORKBENCH 2.0
              </span>
              <span className="font-body text-xs sm:text-sm opacity-90">
                Design your bespoke monster roll. Layer it, sauce it, and fire it on the live tawa.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-label text-xs uppercase bg-white/90 px-3 py-1.5 rounded-full text-[#1b1b1e] border border-[#1b1b1e] font-bold brutal-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#b32100] animate-ping"></span>
            <span>Tandoor Temp: 420°C</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Visualizer & Macros (Left Column) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#f6f2f7] rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-md sticky top-36 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-[#e4e1e6]">
                <div>
                  <span className="font-label text-xs uppercase text-[#7c5800] font-bold tracking-wider">
                    Live Stacking View
                  </span>
                  <h2 className="font-headline font-bold text-lg sm:text-xl text-[#1b1b1e]">
                    Your Masterpiece
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#6ffbbe] text-[#002113] font-label text-xs uppercase font-bold flex items-center gap-1 border border-[#002113]">
                  <span className="material-symbols-outlined text-[14px]">tune</span> 
                  Active
                </span>
              </div>

              {/* Graphical Stack */}
              <div className="relative w-full h-80 rounded-xl bg-gradient-to-b from-[#f0edf1] via-[#eae7eb] to-[#f6f2f7] border-2 border-[#1b1b1e] overflow-hidden flex flex-col items-center justify-center p-3 my-3">
                <div className="relative w-full max-w-[250px] flex flex-col items-center justify-center gap-2 z-10">
                  <div className="w-4/5 py-1.5 px-3 rounded-full bg-[#ffdea8] text-[#271900] font-label text-xs font-bold text-center border border-[#1b1b1e] brutal-shadow-sm flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">grain</span>
                    <span className="truncate">{selectedSeasoning.name}</span>
                  </div>

                  <div className="w-[88%] py-2 px-3 rounded-xl bg-[#b32100] text-white font-label text-xs text-center border border-[#1b1b1e] brutal-shadow-sm flex items-center justify-between">
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                    <span className="truncate font-bold px-1">
                      {selectedSauces.length ? selectedSauces.join(' + ') : 'Zero Dips'}
                    </span>
                    <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  </div>

                  <div className="w-[92%] py-2 px-3 rounded-xl bg-[#006947] text-white font-label text-xs text-center border border-[#1b1b1e] brutal-shadow-sm flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                    <span className="truncate font-medium">
                      {selectedGreens.length ? selectedGreens.join(' & ') : 'No Greens Selected'}
                    </span>
                  </div>

                  <div className="w-[96%] py-3 px-3 rounded-xl bg-[#dc320d] text-white font-headline font-bold text-sm text-center border border-[#1b1b1e] brutal-shadow flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">kebab_dining</span>
                    <span className="truncate">{selectedProtein.name}</span>
                  </div>

                  <div className="w-full py-2.5 px-4 rounded-full bg-[#feb700] text-[#271900] font-label text-xs sm:text-sm font-bold text-center border-2 border-[#1b1b1e] brutal-shadow flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cookie</span>
                    <span className="truncate">{selectedWrap.name}</span>
                  </div>
                </div>
              </div>

              {/* Macro Index */}
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#e4e1e6] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-label text-xs uppercase text-[#5c403a] font-bold">
                    Macro Index
                  </span>
                  <span className="font-headline font-extrabold text-lg text-[#b32100]">
                    {totalCalories} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-[#f6f2f7] p-2 rounded-lg text-center flex flex-col border border-[#e4e1e6]">
                    <span className="font-label text-[10px] text-[#5c403a] uppercase font-bold">Protein</span>
                    <span className="font-label font-bold text-sm text-[#006947]">{totalProtein}g</span>
                  </div>
                  <div className="bg-[#f6f2f7] p-2 rounded-lg text-center flex flex-col border border-[#e4e1e6]">
                    <span className="font-label text-[10px] text-[#5c403a] uppercase font-bold">Carbs</span>
                    <span className="font-label font-bold text-sm text-[#7c5800]">{totalCarbs}g</span>
                  </div>
                  <div className="bg-[#f6f2f7] p-2 rounded-lg text-center flex flex-col border border-[#e4e1e6]">
                    <span className="font-label text-[10px] text-[#5c403a] uppercase font-bold">Fats</span>
                    <span className="font-label font-bold text-sm text-[#b32100]">{totalFats}g</span>
                  </div>
                </div>
              </div>

              {/* Naming & Action */}
              <div className="pt-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between bg-white px-4 py-2 rounded-full border border-[#1b1b1e] brutal-shadow-sm">
                  <span className="font-label text-xs uppercase text-[#5c403a] font-bold">
                    Build Total
                  </span>
                  <span className="font-headline font-extrabold text-xl text-[#1b1b1e]">
                    ₹{totalPrice}
                  </span>
                </div>

                <input 
                  className="w-full px-4 py-2 bg-white text-[#1b1b1e] rounded-full font-body text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#b32100] border border-[#1b1b1e] brutal-shadow-sm" 
                  placeholder="Give your custom roll a name..." 
                  type="text" 
                  value={rollName}
                  onChange={(e) => setRollName(e.target.value)}
                />

                <button 
                  onClick={handleSaveAndDropInBag}
                  className="w-full py-3 px-6 rounded-full bg-[#dc320d] hover:bg-[#b32100] text-white font-label text-sm uppercase tracking-wide border-2 border-[#1b1b1e] brutal-shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  <span>Save &amp; Drop in Bag</span>
                </button>
              </div>

            </div>
          </div>

          {/* Steps Configurator (Center Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Step 1: Wrap */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                1. Choose Your Base Wrap
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WRAP_OPTIONS.map((w) => (
                  <div 
                    key={w.id}
                    onClick={() => setSelectedWrap(w)}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      selectedWrap.id === w.id 
                        ? 'bg-[#ffdea8]/30 border-[#b32100] brutal-shadow-sm' 
                        : 'bg-[#f6f2f7] border-[#e4e1e6] hover:bg-[#eae7eb]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-headline font-bold text-sm text-[#1b1b1e]">{w.name}</span>
                      <span className="material-symbols-outlined text-[18px] text-[#b32100]">
                        {selectedWrap.id === w.id ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="font-label text-xs text-[#5c403a] mt-2">
                      {w.price === 0 ? 'Included (₹0)' : `+₹${w.price}`} • {w.kcal} kcal
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 2: Core Filling */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                2. Choose The Core Filling
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROTEIN_OPTIONS.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedProtein(p)}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      selectedProtein.id === p.id 
                        ? 'bg-[#ffdea8]/30 border-[#b32100] brutal-shadow-sm' 
                        : 'bg-[#f6f2f7] border-[#e4e1e6] hover:bg-[#eae7eb]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-headline font-bold text-sm text-[#1b1b1e]">{p.name}</span>
                      <span className="material-symbols-outlined text-[18px] text-[#b32100]">
                        {selectedProtein.id === p.id ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <span className="font-label text-xs text-[#5c403a] mt-2">
                      ₹{p.basePrice} • {p.kcal} kcal
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 3: Greens */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                3. Crunchy Greens (Multi-Select)
              </h3>
              <div className="flex flex-wrap gap-2">
                {GREENS_OPTIONS.map(g => {
                  const active = selectedGreens.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleToggleGreen(g)}
                      className={`px-3 py-1.5 rounded-full font-label text-xs uppercase font-bold border transition-all cursor-pointer ${
                        active 
                          ? 'bg-[#006947] text-white border-[#006947]' 
                          : 'bg-[#f6f2f7] text-[#5c403a] border-[#e4e1e6]'
                      }`}
                    >
                      {active ? '✓ ' : '+ '} {g}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 4: Sauces */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                4. House Sauces (Pick up to 2)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SAUCE_OPTIONS.map(s => {
                  const active = selectedSauces.includes(s.name);
                  return (
                    <div 
                      key={s.id}
                      onClick={() => handleToggleSauce(s.name)}
                      className={`p-2.5 rounded-xl border cursor-pointer text-center transition-all ${
                        active 
                          ? 'bg-[#b32100] text-white border-[#b32100]' 
                          : 'bg-[#f6f2f7] text-[#1b1b1e] border-[#e4e1e6]'
                      }`}
                    >
                      <span className="font-headline font-bold text-xs block">{s.name}</span>
                      <span className={`text-[10px] block ${active ? 'text-[#ffdad3]' : 'text-[#5c403a]'}`}>{s.subtitle}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 5: Seasoning */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                5. Dust & Seasoning
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SEASONING_OPTIONS.map(seas => (
                  <div
                    key={seas.id}
                    onClick={() => setSelectedSeasoning(seas)}
                    className={`p-2.5 rounded-xl border cursor-pointer text-center transition-all ${
                      selectedSeasoning.id === seas.id 
                        ? 'bg-[#ffdea8] text-[#271900] border-[#1b1b1e] font-bold' 
                        : 'bg-[#f6f2f7] text-[#5c403a] border-[#e4e1e6]'
                    }`}
                  >
                    <span className="font-headline text-xs block">{seas.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Community Presets (Right Column) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-[#f6f2f7] rounded-2xl p-4 border-2 border-[#1b1b1e] brutal-shadow-sm flex flex-col gap-3">
              <h3 className="font-headline font-bold text-base text-[#1b1b1e]">
                Community Top Formulas
              </h3>
              <div className="flex flex-col gap-3">
                {COMMUNITY_PRESETS.map(preset => (
                  <div key={preset.id} className="bg-white p-3 rounded-xl border border-[#e4e1e6] flex flex-col gap-2">
                    <img src={preset.image} alt={preset.title} className="w-full h-24 object-cover rounded-lg" />
                    <div>
                      <span className="font-headline font-bold text-xs text-[#1b1b1e] block truncate">{preset.title}</span>
                      <span className="font-body text-[11px] text-[#5c403a]">{preset.author} • {preset.macroNotes}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#f0edf1]">
                      <span className="font-headline font-bold text-sm text-[#b32100]">₹{preset.price}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setRollName(preset.title);
                          showToast('Loaded Preset', `${preset.title} mapped to workbench.`);
                        }}
                        className="px-3 py-1 bg-[#1b1b1e] text-white text-xs font-label uppercase font-bold rounded-full"
                      >
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. SCREEN 3: LATE NIGHT MUNCHIES
// ==========================================
interface LateNightMunchiesViewProps {
  onAddToCart: (item: {
    name: string;
    price: number;
    subtitle: string;
    image?: string;
  }) => void;
  onApplyPromo: (code: string) => void;
  showToast: (title: string, desc: string) => void;
}

export const LateNightMunchiesView: React.FC<LateNightMunchiesViewProps> = ({
  onAddToCart,
  onApplyPromo,
  showToast
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 41,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59, hours: prev.hours };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Banner */}
      <div className="w-full px-4 sm:px-8 mb-6">
        <div className="bg-[#1b1b1e] text-[#f3f0f4] p-5 sm:p-6 rounded-2xl border-2 border-[#1b1b1e] brutal-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-[#dc320d] text-white rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">nightlight</span>
            </span>
            <div>
              <span className="font-headline font-bold text-lg sm:text-xl uppercase text-white tracking-tight block">
                MIDNIGHT CRUSH PROTOCOL (11 PM - 4 AM)
              </span>
              <p className="font-body text-xs sm:text-sm text-[#dcd9dd]">
                High-calorie, ultra-savory sharing boxes and hot desi chai flasks dispatched in under 20 mins.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#303033] px-4 py-2 rounded-xl border border-white/10 font-label text-sm">
            <span className="text-[#feb700] uppercase font-bold">Window Closes In:</span>
            <span className="font-headline font-extrabold text-[#ffba20]">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Sharing Boxes */}
      <div className="w-full px-4 sm:px-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {LATE_NIGHT_COMBOS.map(combo => (
            <div key={combo.id} className={`${combo.spanClass} bg-white rounded-2xl overflow-hidden border-2 border-[#1b1b1e] brutal-shadow flex flex-col justify-between group`}>
              <div className="relative h-60 overflow-hidden bg-[#f0edf1]">
                <img src={combo.image} alt={combo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-label text-xs uppercase font-bold border border-[#1b1b1e] ${combo.badgeType}`}>
                  {combo.badge}
                </span>
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 text-white font-label text-xs font-bold">
                  {combo.serves}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <h3 className="font-headline font-bold text-lg text-[#1b1b1e]">{combo.title}</h3>
                <p className="font-body text-xs text-[#5c403a]">{combo.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[#f0edf1]">
                  <div>
                    <span className="font-headline font-extrabold text-2xl text-[#b32100]">₹{combo.price}</span>
                    {combo.originalPrice && <span className="font-body text-xs text-[#916f68] line-through ml-2">₹{combo.originalPrice}</span>}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => onAddToCart({
                      name: combo.title.toUpperCase(),
                      price: combo.price,
                      subtitle: combo.serves,
                      image: combo.image
                    })}
                    className="px-5 py-2.5 bg-[#b32100] hover:bg-[#dc320d] text-white font-label text-xs uppercase font-bold rounded-full border-2 border-[#1b1b1e] brutal-shadow-sm cursor-pointer"
                  >
                    Add Combo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post-Party Emergency Munchie Feature */}
        <div className="bg-gradient-to-r from-[#1b1b1e] to-[#2d1b18] text-white rounded-2xl p-5 sm:p-6 border-2 border-[#1b1b1e] brutal-shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={EMERGENCY_MUNCHIE.image} alt={EMERGENCY_MUNCHIE.title} className="w-24 h-24 rounded-xl object-cover border-2 border-[#dc320d]" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#dc320d] text-white rounded text-[10px] font-label font-bold uppercase">{EMERGENCY_MUNCHIE.spiceTag}</span>
                <span className="px-2 py-0.5 bg-[#feb700] text-[#271900] rounded text-[10px] font-label font-bold uppercase">{EMERGENCY_MUNCHIE.prepTime}</span>
              </div>
              <h4 className="font-headline font-bold text-lg text-white">{EMERGENCY_MUNCHIE.title}</h4>
              <p className="font-body text-xs text-[#dcd9dd] max-w-lg mt-1">{EMERGENCY_MUNCHIE.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-headline font-extrabold text-2xl text-[#feb700]">₹{EMERGENCY_MUNCHIE.price}</span>
            <button 
              type="button"
              onClick={() => onAddToCart({
                name: EMERGENCY_MUNCHIE.title.toUpperCase(),
                price: EMERGENCY_MUNCHIE.price,
                subtitle: 'Post-Party Emergency Kit',
                image: EMERGENCY_MUNCHIE.image
              })}
              className="px-5 py-3 bg-[#dc320d] hover:bg-[#b32100] text-white font-label text-xs uppercase font-bold rounded-full border border-white/20 cursor-pointer"
            >
              Rush This Order 🔥
            </button>
          </div>
        </div>

        {/* Midnight Sides */}
        <div className="mt-4">
          <h3 className="font-headline font-bold text-xl text-[#1b1b1e] mb-4">Midnight Add-ons & Chai</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MIDNIGHT_SIDES.map(side => (
              <div key={side.id} className="bg-white rounded-xl overflow-hidden border border-[#1b1b1e] brutal-shadow-sm p-3 flex flex-col justify-between gap-3">
                <img src={side.image} alt={side.title} className="w-full h-32 object-cover rounded-lg" />
                <div>
                  <h4 className="font-headline font-bold text-sm text-[#1b1b1e]">{side.title}</h4>
                  <p className="font-body text-xs text-[#5c403a] line-clamp-2 mt-1">{side.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f0edf1]">
                  <span className="font-headline font-bold text-base text-[#1b1b1e]">₹{side.price}</span>
                  <button 
                    type="button"
                    onClick={() => onAddToCart({
                      name: side.title.toUpperCase(),
                      price: side.price,
                      subtitle: side.tag,
                      image: side.image
                    })}
                    className="px-3 py-1.5 bg-[#feb700] text-[#271900] font-label text-xs uppercase font-bold rounded-full cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. SCREEN 4: ORDER TRACKER
// ==========================================
interface OrderTrackerViewProps {
  showToast: (title: string, desc: string) => void;
  onOpenLiveChat: () => void;
  onOpenKitchenModal: () => void;
}

export const OrderTrackerView: React.FC<OrderTrackerViewProps> = ({
  showToast,
  onOpenLiveChat,
  onOpenKitchenModal
}) => {
  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Telemetry Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 border-2 border-[#1b1b1e] brutal-shadow flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0edf1]">
              <div>
                <span className="font-label text-xs uppercase text-[#b32100] font-bold">Active Order #RR-8921</span>
                <h2 className="font-headline font-bold text-xl text-[#1b1b1e]">Estimated Arrival: 14 Mins</h2>
              </div>
              <span className="px-3 py-1 bg-[#6ffbbe] text-[#002113] rounded-full font-label text-xs font-bold uppercase border border-[#002113]">
                On Iron Tawa 🔥
              </span>
            </div>

            {/* Stepper */}
            <div className="flex flex-col gap-4">
              {[
                { title: 'Order Accepted & Billed', time: '12:04 AM', done: true },
                { title: 'Marinated Meat on Live Charcoal', time: '12:08 AM', done: true },
                { title: 'Rolling in Flaky Laccha Paratha', time: '12:12 AM', done: false, active: true },
                { title: 'Rider Out for Campus Delivery', time: 'Est. 12:18 AM', done: false }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step.done ? 'bg-[#006947] text-white' : step.active ? 'bg-[#dc320d] text-white animate-pulse' : 'bg-[#e4e1e6] text-[#5c403a]'
                  }`}>
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-headline text-sm font-bold ${step.active ? 'text-[#b32100]' : 'text-[#1b1b1e]'}`}>{step.title}</p>
                    <p className="font-body text-xs text-[#5c403a]">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#f0edf1]">
              <button 
                type="button" 
                onClick={onOpenKitchenModal}
                className="flex-1 py-2.5 bg-[#f0edf1] hover:bg-[#eae7eb] font-label text-xs uppercase font-bold text-[#1b1b1e] rounded-full border border-[#1b1b1e] cursor-pointer"
              >
                View Kitchen Cam
              </button>
              <button 
                type="button" 
                onClick={onOpenLiveChat}
                className="flex-1 py-2.5 bg-[#b32100] text-white font-label text-xs uppercase font-bold rounded-full cursor-pointer"
              >
                Chat With Master Chef
              </button>
            </div>
          </div>
        </div>

        {/* Right Rider Map Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#1b1b1e] brutal-shadow flex flex-col">
            <div className="relative h-56 bg-slate-200">
              <img src={BRAND_ASSETS.mapBackground} alt="Map" className="w-full h-full object-cover" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-[#b32100] text-white rounded-full brutal-shadow">
                <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <img src={BRAND_ASSETS.riderPortrait} alt="Rider" className="w-12 h-12 rounded-full object-cover border border-[#1b1b1e]" />
              <div className="flex-1">
                <h4 className="font-headline font-bold text-sm text-[#1b1b1e]">Rider: Manpreet Singh</h4>
                <p className="font-body text-xs text-[#5c403a]">Hero Splendor • 4.9 ⭐ (840 deliveries)</p>
              </div>
              <button 
                type="button" 
                onClick={() => showToast('Calling Rider...', '+91 98765-XXXXX')}
                className="p-2.5 bg-[#006947] text-white rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. SCREEN 5: REPUBLIK REWARDS
// ==========================================
interface RewardsViewProps {
  showToast: (title: string, desc: string) => void;
  onApplyPromo: (code: string) => void;
  onNavigateToTab: (tab: ScreenTab) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  showToast,
  onApplyPromo,
  onNavigateToTab
}) => {
  return (
    <div className="flex flex-col w-full pb-16 px-4 sm:px-8">
      <div className="bg-[#1b1b1e] text-[#f3f0f4] p-6 rounded-2xl border-2 border-[#1b1b1e] brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#feb700] text-[#271900] font-headline font-extrabold text-2xl flex items-center justify-center border-2 border-white">
            ⚡ 4
          </div>
          <div>
            <span className="font-label text-xs text-[#ffdea8] uppercase font-bold">Republik VIP Club</span>
            <h2 className="font-headline font-bold text-2xl text-white">Tier: Sauce God Level</h2>
            <p className="font-body text-xs text-[#dcd9dd]">You have earned 420 Roll Coins this academic season.</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={() => {
            onApplyPromo('REPUBLIK50');
            showToast('Free Thums Up Activated!', 'Promo REPUBLIK50 added to checkout.');
          }}
          className="px-6 py-3 bg-[#dc320d] text-white font-label text-xs uppercase font-bold rounded-full border border-white/20 cursor-pointer"
        >
          Redeem Free Roll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: 'Free Desi Dip on All Orders', desc: 'Unlocked permanently at Level 2.', active: true },
          { title: 'Midnight Delivery Waiver', desc: 'Zero surge or night fee on any order.', active: true },
          { title: 'Access to Secret Drops', desc: 'Taste experimental drops 24h early.', active: false }
        ].map((perk, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-[#1b1b1e] brutal-shadow-sm flex flex-col justify-between gap-3">
            <div>
              <span className={`px-2 py-0.5 rounded-full font-label text-[10px] font-bold uppercase ${perk.active ? 'bg-[#006947] text-white' : 'bg-[#e4e1e6] text-[#5c403a]'}`}>
                {perk.active ? 'ACTIVE' : 'LOCKED'}
              </span>
              <h3 className="font-headline font-bold text-base text-[#1b1b1e] mt-2">{perk.title}</h3>
              <p className="font-body text-xs text-[#5c403a] mt-1">{perk.desc}</p>
            </div>
            <button 
              type="button" 
              onClick={() => onNavigateToTab('menu-and-drops')}
              className="text-[#b32100] font-label text-xs uppercase font-bold text-left cursor-pointer"
            >
              Order Rolls Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 11. FOOTER & LIVE TICKER
// ==========================================
export const LiveFeedTicker: React.FC<{ onOpenKitchenCam: () => void }> = ({ onOpenKitchenCam }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-[#1b1b1e] text-[#f3f0f4] h-10 border-t border-[#303033] flex items-center px-4 overflow-hidden">
      <div className="flex items-center gap-2 whitespace-nowrap animate-marquee">
        <span className="w-2 h-2 rounded-full bg-[#00855b] animate-ping"></span>
        <span className="font-label text-xs uppercase text-[#ffba20] font-bold">LIVE TAWA METRICS:</span>
        <span className="font-body text-xs text-[#dcd9dd]">Store #04 Campus Hub • 14 orders queued • Iron Tawa at 380°C • Laccha Ghee Batches: 100% Fresh • Avg delivery 14 mins</span>
      </div>
      <button 
        type="button" 
        onClick={onOpenKitchenCam}
        className="ml-auto bg-[#303033] hover:bg-black text-white px-3 py-1 rounded-full text-[11px] font-label uppercase font-bold shrink-0 cursor-pointer"
      >
        Watch Live Cam
      </button>
    </div>
  );
};

export const Footer: React.FC<{
  onOpenPrivacyModal: () => void;
  onOpenCollabModal: () => void;
  onOpenSecretSauceModal: () => void;
}> = ({ onOpenPrivacyModal, onOpenCollabModal, onOpenSecretSauceModal }) => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#e4e1e6] py-10 px-4 sm:px-8 mt-auto mb-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline font-bold text-lg uppercase text-[#1b1b1e]">Roll Republik</span>
          <span className="font-body text-xs text-[#5c403a]">Kolkata Style Street Kathi Rolls × Gen-Z Lab</span>
        </div>
        <div className="flex gap-4 text-xs font-label uppercase text-[#5c403a]">
          <button type="button" onClick={onOpenSecretSauceModal} className="hover:text-[#b32100] cursor-pointer">Secret Sauces</button>
          <button type="button" onClick={onOpenCollabModal} className="hover:text-[#b32100] cursor-pointer">Campus Reps</button>
          <button type="button" onClick={onOpenPrivacyModal} className="hover:text-[#b32100] cursor-pointer">Terms & Privacy</button>
        </div>
        <div className="text-xs font-body text-[#916f68]">© 2026 Roll Republik Inc.</div>
      </div>
    </footer>
  );
};

// ==========================================
// 12. CART DRAWER & CHECKOUT MODAL
// ==========================================
export const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}> = ({ isOpen, onClose, cartItems, subtotal, onUpdateQty, onCheckout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between brutal-shadow">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0edf1]">
          <h2 className="font-headline font-bold text-xl text-[#1b1b1e]">Your Roll Bag</h2>
          <button type="button" onClick={onClose} className="text-xl font-bold p-1 cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-[#f6f2f7] rounded-xl">
              <div>
                <p className="font-headline font-bold text-sm text-[#1b1b1e]">{item.name}</p>
                <p className="font-body text-xs text-[#5c403a]">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-[#e4e1e6]">
                <button type="button" onClick={() => onUpdateQty(item.id, -1)} className="font-bold px-1 cursor-pointer">-</button>
                <span className="font-label font-bold text-xs">{item.quantity}</span>
                <button type="button" onClick={() => onUpdateQty(item.id, 1)} className="font-bold px-1 cursor-pointer">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#f0edf1] flex flex-col gap-3">
          <div className="flex justify-between font-headline font-bold text-lg">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <button 
            type="button" 
            onClick={onCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 bg-[#b32100] text-white font-label text-sm uppercase font-bold rounded-full border border-[#1b1b1e] brutal-shadow cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export const CheckoutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  appliedPromo: string;
  onApplyPromo: (code: string) => void;
  onOrderSuccess: (details: { address: string; phone: string; paymentMethod: string; items: CartItem[]; total: number }) => void;
}> = ({ isOpen, onClose, cartItems, subtotal, appliedPromo, onApplyPromo, onOrderSuccess }) => {
  const [address, setAddress] = useState('Dorm Block 4, Room 312, North Campus');
  const [phone, setPhone] = useState('+91 98765-43210');
  const [promoInput, setPromoInput] = useState('');

  if (!isOpen) return null;
  const discount = appliedPromo ? 50 : 0;
  const total = Math.max(0, subtotal + 18 - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 border-2 border-[#1b1b1e] brutal-shadow flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0edf1]">
          <h3 className="font-headline font-bold text-xl text-[#1b1b1e]">Express Campus Checkout</h3>
          <button type="button" onClick={onClose} className="font-bold text-xl cursor-pointer">✕</button>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-label uppercase font-bold text-[#5c403a] block mb-1">Hostel Delivery Point</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-[#f0edf1] rounded-lg border border-[#e4e1e6]" 
            />
          </div>
          <div>
            <label className="font-label uppercase font-bold text-[#5c403a] block mb-1">Student Phone / OTP</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-[#f0edf1] rounded-lg border border-[#e4e1e6]" 
            />
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Promo Code (e.g. REPUBLIK50)" 
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 p-2 bg-[#f0edf1] rounded-lg border border-[#e4e1e6]" 
            />
            <button 
              type="button" 
              onClick={() => onApplyPromo(promoInput)}
              className="px-4 py-2 bg-[#1b1b1e] text-white font-label uppercase font-bold rounded-lg cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="p-3 bg-[#f6f2f7] rounded-xl flex justify-between font-headline font-extrabold text-lg">
          <span>Amount To Pay</span>
          <span className="text-[#b32100]">₹{total}</span>
        </div>

        <button 
          type="button" 
          onClick={() => {
            onClose();
            onOrderSuccess({ address, phone, paymentMethod: 'UPI', items: cartItems, total });
          }}
          className="w-full py-3.5 bg-[#00855b] hover:bg-[#006947] text-white font-label text-sm uppercase font-bold rounded-full border border-[#1b1b1e] brutal-shadow cursor-pointer"
        >
          Pay with UPI / GPay
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 13. AUXILIARY MODALS
// ==========================================
export const LiveKitchenModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl bg-[#1b1b1e] text-white rounded-2xl p-6 border-2 border-white/20 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
            <span className="font-headline font-bold text-lg uppercase">Live Kitchen Cam (Cam 02: Main Tawa)</span>
          </div>
          <button type="button" onClick={onClose} className="text-xl font-bold cursor-pointer">✕</button>
        </div>
        <img src={BRAND_ASSETS.kitchenCam} alt="Kitchen" className="w-full h-80 object-cover rounded-xl" />
        <div className="flex justify-between text-xs font-label uppercase text-[#ffba20]">
          <span>Tawa Temperature: 395°C</span>
          <span>Rolling Station: 6 Chefs Active</span>
        </div>
      </div>
    </div>
  );
};

export const CampusHubModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedHub: string;
  onSelectHub: (hub: string) => void;
}> = ({ isOpen, onClose, selectedHub, onSelectHub }) => {
  if (!isOpen) return null;
  const hubs = ['Campus Hub / Store #04', 'North Tech Campus / Kiosk #01', 'Hostel Zone 2 Dark Kitchen'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 border-2 border-[#1b1b1e] brutal-shadow flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">Select Campus Hub</h3>
          <button type="button" onClick={onClose} className="font-bold text-xl cursor-pointer">✕</button>
        </div>
        <div className="flex flex-col gap-2">
          {hubs.map(h => (
            <button 
              key={h}
              type="button" 
              onClick={() => { onSelectHub(h); onClose(); }}
              className={`p-3 rounded-xl border text-left font-label text-xs uppercase font-bold cursor-pointer ${selectedHub === h ? 'bg-[#b32100] text-white' : 'bg-[#f6f2f7]'}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LiveKitchenChatModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  showToast: (title: string, desc: string) => void;
}> = ({ isOpen, onClose, showToast }) => {
  const [msg, setMsg] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 border-2 border-[#1b1b1e] brutal-shadow flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">Direct Kitchen Ping</h3>
          <button type="button" onClick={onClose} className="font-bold text-xl cursor-pointer">✕</button>
        </div>
        <textarea 
          rows={3}
          value={msg} 
          onChange={(e) => setMsg(e.target.value)} 
          placeholder="E.g. Extra sirka pyaz please, do not add chili flakes..." 
          className="w-full p-3 bg-[#f0edf1] rounded-xl text-xs border border-[#e4e1e6]" 
        />
        <button 
          type="button" 
          onClick={() => {
            showToast('Note Transmitted', 'Kitchen screen alerted.');
            onClose();
          }}
          className="w-full py-3 bg-[#b32100] text-white font-label text-xs uppercase font-bold rounded-full cursor-pointer"
        >
          Send to Head Chef
        </button>
      </div>
    </div>
  );
};

export const InfoModal: React.FC<{
  type: 'privacy' | 'collab' | 'sauces' | null;
  onClose: () => void;
}> = ({ type, onClose }) => {
  if (!type) return null;
  const content = {
    privacy: { title: 'Terms & Student Privacy', body: 'All student details are encrypted with end-to-end telemetry protocols.' },
    collab: { title: 'Campus Rep Program', body: 'Earn free rolls for your hostel wing by becoming an official Roll Republik ambassador.' },
    sauces: { title: 'Secret Sauce Formulas', body: 'Our sauces are made fresh every 12 hours with unpasteurized farm curd and Naga bhut jolokia peppers.' }
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 border-2 border-[#1b1b1e] brutal-shadow flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">{content.title}</h3>
          <button type="button" onClick={onClose} className="font-bold text-xl cursor-pointer">✕</button>
        </div>
        <p className="font-body text-xs text-[#5c403a]">{content.body}</p>
        <button 
          type="button" 
          onClick={onClose}
          className="w-full py-2.5 bg-[#1b1b1e] text-white font-label text-xs uppercase font-bold rounded-full mt-2 cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
