// Автоданные для фильтра и формы объявления
// Можно расширять: добавляй марку и список моделей ниже.
window.CAR_DATA = {
  modelsByMake: {
  "ВАЗ": [
    "2101",
    "2102",
    "2103",
    "2104",
    "2105",
    "2106",
    "2107",
    "2108",
    "2109",
    "21099",
    "2110",
    "2111",
    "2112",
    "2113",
    "2114",
    "2115",
    "Kalina",
    "Priora",
    "Granta",
    "Vesta",
    "Largus",
    "Niva",
    "Niva Travel",
    "XRAY"
  ],
  "BMW": [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "Z4",
    "i3",
    "i4",
    "i5",
    "i7",
    "iX",
    "iX1",
    "iX3",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8"
  ],
  "Mercedes-Benz": [
    "A-Class",
    "B-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "CLA",
    "CLS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "Vito",
    "Sprinter"
  ],
  "Audi": [
    "A1",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "Q2",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "TT",
    "R8",
    "e-tron"
  ],
  "Toyota": [
    "Corolla",
    "Camry",
    "RAV4",
    "Land Cruiser",
    "Prado",
    "Hilux",
    "Yaris",
    "Avalon",
    "C-HR",
    "Highlander",
    "Prius"
  ],
  "Honda": [
    "Civic",
    "Accord",
    "CR-V",
    "HR-V",
    "Fit",
    "Pilot"
  ],
  "Nissan": [
    "Sunny",
    "Sentra",
    "Altima",
    "Maxima",
    "X-Trail",
    "Qashqai",
    "Juke",
    "Patrol",
    "Navara",
    "Teana"
  ],
  "Hyundai": [
    "Elantra",
    "Sonata",
    "Accent",
    "Tucson",
    "Santa Fe",
    "Creta",
    "i30",
    "Palisade"
  ],
  "Kia": [
    "Rio",
    "Cerato",
    "Optima",
    "Sportage",
    "Sorento",
    "Seltos",
    "K5"
  ],
  "Volkswagen": [
    "Golf",
    "Passat",
    "Jetta",
    "Polo",
    "Tiguan",
    "Touareg",
    "Transporter"
  ],
  "Ford": [
    "Focus",
    "Fiesta",
    "Mondeo",
    "Fusion",
    "Mustang",
    "Explorer",
    "Transit"
  ],
  "Chevrolet": [
    "Cruze",
    "Aveo",
    "Malibu",
    "Spark",
    "Niva",
    "Tahoe"
  ],
  "Opel": [
    "Astra",
    "Vectra",
    "Corsa",
    "Insignia",
    "Zafira"
  ],
  "Renault": [
    "Logan",
    "Sandero",
    "Duster",
    "Megane",
    "Clio",
    "Koleos"
  ],
  "Peugeot": [
    "206",
    "207",
    "208",
    "301",
    "308",
    "407",
    "508",
    "2008",
    "3008",
    "5008"
  ],
  "Citroën": [
    "C3",
    "C4",
    "C5",
    "Berlingo",
    "C-Elysee"
  ],
  "Skoda": [
    "Octavia",
    "Superb",
    "Rapid",
    "Fabia",
    "Kodiaq",
    "Karoq"
  ],
  "SEAT": [
    "Ibiza",
    "Leon",
    "Ateca"
  ],
  "Fiat": [
    "Punto",
    "Tipo",
    "Doblo",
    "Linea"
  ],
  "Subaru": [
    "Impreza",
    "Legacy",
    "Forester",
    "Outback",
    "XV"
  ],
  "Mitsubishi": [
    "Lancer",
    "Outlander",
    "Pajero",
    "ASX"
  ],
  "Mazda": [
    "Mazda2",
    "Mazda3",
    "Mazda6",
    "CX-3",
    "CX-5",
    "CX-9"
  ],
  "Geely": [
    "Coolray",
    "Atlas",
    "Emgrand"
  ],
  "Chery": [
    "Tiggo 4",
    "Tiggo 7",
    "Tiggo 8"
  ],
  "Haval": [
    "Jolion",
    "F7",
    "H9"
  ],
  "Lexus": [
    "IS",
    "ES",
    "GS",
    "LS",
    "RX",
    "NX",
    "GX",
    "LX"
  ],
  "Infiniti": [
    "Q50",
    "Q60",
    "QX50",
    "QX60",
    "QX80"
  ],
  "Volvo": [
    "S60",
    "S90",
    "XC40",
    "XC60",
    "XC90"
  ],
  "Jaguar": [
    "XE",
    "XF",
    "XJ",
    "F-PACE",
    "E-PACE"
  ],
  "Land Rover": [
    "Range Rover",
    "Range Rover Sport",
    "Discovery",
    "Defender",
    "Evoque"
  ],
  "Porsche": [
    "Cayenne",
    "Macan",
    "Panamera",
    "911",
    "Taycan"
  ],
  "Tesla": [
    "Model S",
    "Model 3",
    "Model X",
    "Model Y"
  ],
  "Jeep": [
    "Wrangler",
    "Grand Cherokee",
    "Compass",
    "Renegade"
  ],
  "GAZ": [
    "Газель",
    "Волга",
    "Соболь"
  ],
  "UAZ": [
    "Patriot",
    "Hunter",
    "Buhanka"
  ],
  "Daewoo": [
    "Nexia",
    "Matiz",
    "Lanos"
  ],
  "VAZ (LADA)": [
    "2107",
    "21099",
    "Granta",
    "Vesta",
    "Niva"
  ]
}
};
