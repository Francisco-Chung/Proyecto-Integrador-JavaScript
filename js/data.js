const menuData = [
    {
        id: 1,
        name: "Americano",
        price: 250,
        category: "Caliente",
        cardImg: "./assets/img/menu-1.png",
    },
    {
        id: 2,
        name: "Latte",
        price: 280,
        category: "Caliente",
        cardImg: "./assets/img/menu-2.png",
    },
    {
        id: 3,
        name: "Caramel Macchiato",
        price: 350,
        category: "Caliente",
        cardImg: "./assets/img/menu-3.png",
    },
    {
        id: 4,
        name: "Mocha Blanco",
        price: 400,
        category: "Frío",
        cardImg: "./assets/img/menu-4.png",
    },
    {
        id: 5,
        name: "Cappuccino",
        price: 280,
        category: "Caliente",
        cardImg: "./assets/img/menu-5.png",
    },
    {
        id: 6,
        name: "Vainilla Latte Helado",
        price: 300,
        category: "Frío",
        cardImg: "./assets/img/menu-6.png",
    },
    {
        id: 7,
        name: "Café Tostado Italia",
        price: 4250,
        category:"Café en granos",
        cardImg: "./assets/img/product-1.png",
    },
    {
        id: 8,
        name: "Café Tostado Brazil",
        price: 3750,
        category:"Café en granos",
        cardImg: "./assets/img/product-2.png",
    },
    {
        id: 9,
        name: "Café Tostado Marruecos",
        price: 4500,
        category:"Café en granos",
        cardImg: "./assets/img/product-3.png",
    },
];

const divideProducts = (size) => {
    let menuList = []
    for (let i = 0; i < menuData.length; i += size)
        menuList.push(menuData.slice(i, i + size));
    return menuList
};

const appState = {
    products: divideProducts(3),
    currentProducts: 0,
    productsLimit: divideProducts(3).length,
    activeFilter: null
};