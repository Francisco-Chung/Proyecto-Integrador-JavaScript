const menuContainer = document.querySelector(".menu-container");
const showMore = document.querySelector(".btn-load");

// ------------------------------------------------------------------
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category")

// ------------------------------------------------------------------
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
const menuBtn = document.querySelector(".menu-label");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const successModal = document.querySelector(".add-modal");
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");

// ------------------------------------------------------------------
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const textAreaInput = document.getElementById("textarea");
const formMessage = document.getElementById("message");



const createProductTemplate = (product) => {
    const { id, name, price, cardImg } = product
    return `
    <div class="menu-item">
        <img src=${cardImg} alt=${name}>
        <div class="menu-info">
            <h4>${name}</h4>
            <p>$ ${price}</p>
            <button class="btn-compra"
            data-id='${id}'
            data-name='${name}'
            data-price='${price}'
            data-img='${cardImg}'>COMPRAR</button>
        </div>
    </div>
    `
};


// ------------------------------------------------------------------
const isLastIndexOf = () => {
    return appState.currentProducts === appState.productsLimit - 1;
};

const showMoreProducts = () => {
    appState.currentProducts += 1;
    let { products, currentProducts } = appState;
    renderMenuProducts(products[currentProducts]);
    if (isLastIndexOf()) {
        showMore.classList.add("hidden");
    }
};

const renderMenuProducts = (menuList) => {
    menuContainer.innerHTML += menuList
        .map(createProductTemplate)
        .join("");
};

const renderProducts = (productList) => {
    productsContainer.innerHTML += productList
        .map(createProductsTemplate)
        .join("");
};


// ------------------------------------------------------------------
const applyFilter = ({ target }) => {
    if (!isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    menuContainer.innerHTML = '';
    if (appState.activeFilter) {
        renderFilteredProducts();
        appState.currentProducts = 0;
        return;
    }
    renderMenuProducts(appState.products[0]);
};

const isInactiveFilterBtn = (element) => {
    return (
        element.classList.contains("category") &&
        !element.classList.contains("active")
    );
};

const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibility();
};

const changeBtnActiveState = (selectedCategory) => {
    const categories = [...categoriesList];
    categories.forEach((categoryBtn) => {
        if (categoryBtn.dataset.category !== selectedCategory) {
            categoryBtn.classList.remove("active");
            return;
        }
        categoryBtn.classList.add("active");
    })
};

const setShowMoreVisibility = () => {
    if (!appState.activeFilter) {
        showMore.classList.remove("hidden")
        return
    }
    showMore.classList.add("hidden")
};

const renderFilteredProducts = () => {
    const filteredProducts = menuData.filter(
        (product) => product.category === appState.activeFilter
    );
    renderMenuProducts(filteredProducts);
};


// ------------------------------------------------------------------
const toggleCart = () => {
    cartMenu.classList.toggle("open-cart");
    if (barsMenu.classList.contains("open-menu")) {
        barsMenu.classList.remove("open-menu");
        return;
    }
    overlay.classList.toggle("show-overlay");
};

const toggleMenu = () => {
    barsMenu.classList.toggle("open-menu");
    if (cartMenu.classList.contains("open-cart")) {
        cartMenu.classList.remove("open-cart");
        return;
    }
    overlay.classList.toggle("show-overlay");
};

const closeOnScroll = () => {
    if (
        !barsMenu.classList.contains("open-menu") &&
        !cartMenu.classList.contains("open-cart")
    ) {
        return
    };
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};

const closeOnOverlayClick = () => {
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
}


// ------------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

const renderCart = () => {
    if (!cart.length) {
        productsCart.innerHTML = `
        <p class="empty-msg">No hay productos en el carrito</p>
        `;
        return;
    }
    productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

const createCartProductTemplate = (cartProduct) => {
    const { id, name, price, img, quantity } = cartProduct;
    return `
    <div class="cart-item">
        <div class="item-info">
            <img src=${img} alt=${name}>
            <h3 class="item-title">${name}</h3>
            <span class="item-price">$ ${price}</span>
        </div>
        <div class="item-handler">
            <span class="quantity-handler down" data-id=${id}>-</span>
            <span class="item-quantity">${quantity}</span>
            <span class="quantity-handler up" data-id=${id}>+</span>
        </div>
    </div>
    `
};

const showCartTotal = () => {
    total.innerHTML = `$ ${getCartTotal().toFixed(2)}`;
};

const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0)
};

const addProduct = (e) => {
    if (!e.target.classList.contains("btn-compra")) { return };

    const product = createProductData(e.target.dataset);

    if (isExistingCartProduct(product)) {
        addUnitToProduct(product);
        showSuccessModal("Se agregó una unidad del producto al carrito");
    } else {
        createCartProduct(product);
        showSuccessModal("El producto se ha agregado al carrito")
    };
    updateCartState();
};

const createProductData = (product) => {
    const { id, name, price, img } = product;
    return { id, name, price, img };
};

const isExistingCartProduct = (product) => {
    return cart.find((item) => item.id === product.id);
};

const addUnitToProduct = (product) => {
    cart = cart.map((cartProduct) =>
        cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
            : cartProduct
    );
};

const disableBtn = (btn) => {
    if (!cart.length) {
        btn.classList.add("disabled");
    } else {
        btn.classList.remove("disabled");
    }
};

const showSuccessModal = (msg) => {
    successModal.classList.add("active-modal");
    successModal.textContent = msg;
    setTimeout(() => {
        successModal.classList.remove("active-modal")
    }, 1500);
};

const createCartProduct = (product) => {
    cart = [...cart, { ...product, quantity: 1 }];
};

const updateCartState = () => {
    saveCart();
    renderCart();
    showCartTotal();

    disableBtn(buyBtn);
    disableBtn(deleteBtn);
};

const handlePlusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    addUnitToProduct(existingCartProduct);
};

const handleMinusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);

    if (existingCartProduct.quantity === 1) {
        if (window.confirm("¿Desea Eliminar el producto del carrito?")) {
            removeProductFromCart(existingCartProduct);
        }
        return;
    }
    substractProductUnit(existingCartProduct);
};

const substractProductUnit = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id
            ? { ...product, quantity: Number(product.quantity) - 1 }
            : product;
    });
};

const removeProductFromCart = (existingProduct) => {
    cart = cart.filter((product) => product.id !== existingProduct.id);
    updateCartState();
};

const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
        handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
        handlePlusBtnEvent(e.target.dataset.id);
    }
    updateCartState();
};

const resetCartItems = () => {
    cart = [];
    updateCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return;
    if (window.confirm(confirmMsg)) {
        resetCartItems();
        alert(successMsg);
    }
};

const completeBuy = () => {
    completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
    completeCartAction(
        "¿Desea vaciar el carrito?",
        "No hay productos en el carrito"
    );
};

// ------------------------------------------------------------------
const isEmpty = (input) => {
    return !input.value.trim().length;
};

const isBetween = (input, min, max) => {
    return input.value.length >= min && input.value.length < max;
};

const isEmailValid = (input) => {
    const re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,4})+$/;
    //testeamos
    return re.test(input.value.trim());
};

const isPhoneValid = (input) => {
    const re = /^[0-9]{10}$/;
    return re.test(input.value.trim());
};

const isTextAreaValid = (input) => {
    const regEx = /^[^%&|<>#]*$/
    return regEx.test(input.value)
};

const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.remove("success");
    formField.classList.add("error");
    const error = formField.querySelector("small");
    error.style.display = "block";
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove("error");
    formField.classList.add("success");
    const error = formField.querySelector("small");
    error.textContent = "";
};

const checkTextInput = (input) => {
    let valid = false;
    const minCharacters = 3;
    const maxCharacters = 25;

    if (isEmpty(input)) {
        showError(input, "Este campo es obligatorio");
        return;
    }
    if (!isBetween(input, minCharacters, maxCharacters)) {
        showError(
            input,
            `Este Campo debe tener entre ${minCharacters} y ${maxCharacters} caracteres`
        );
        return;
    }
    showSuccess(input);
    valid = true;
    return valid;
};

const checkEmail = (input) => {
    let valid = false;

    if (isEmpty(input)) {
        showError(input, "El email es obligatorio");
        return;
    }
    if (!isEmailValid(input)) {
        showError(input, "El email no es válido");
        return;
    }
    showSuccess(input);
    valid = true;
    return valid;
};

const checkPhone = (input) => {
    let valid = false;

    if (isEmpty(input)) {
        showError(input, "El teléfono es obligatorio");
        return;
    }
    if (!isPhoneValid(input)) {
        showError(input, "El teléfono no es válido");
        return;
    }
    showSuccess(input);
    valid = true;
    return valid;
};

const checkTextArea = (input) => {
    let valid = false;
    if (isEmpty(input)) {
        showError(input, `Este campo es obligatorio.`)
        return;
    }
    if (!isTextAreaValid(input)) {
        showError(input, `No se permiten los siguientes caracteres: %, &, |, <, >, #`)
        return;
    };
    showSuccess(input);
    valid = true;
    return valid;
};


const validateForm = (e) => {
    e.preventDefault();

    let isNameValid = checkTextInput(nameInput);
    let isEmailValid = checkEmail(emailInput);
    let isPhoneValid = checkPhone(phoneInput);
    let isTextAreaValid = checkTextArea(textAreaInput);

    if (isNameValid && isEmailValid && isPhoneValid && isTextAreaValid) {
        formMessage.textContent = "Formulario enviado con éxito."
        // Tendras una respuesta en tu correo electronico en la brevedad.
        formMessage.classList.remove("error")
        formMessage.classList.add("success")
    };
    form.reset();
};


// ------------------------------------------------------------------
const init = () => {
    renderMenuProducts(appState.products[0]);
    showMore.addEventListener("click", showMoreProducts);
    categoriesContainer.addEventListener("click", applyFilter);

    cartBtn.addEventListener("click", toggleCart);
    menuBtn.addEventListener("click", toggleMenu);
    window.addEventListener("scroll", closeOnScroll);
    overlay.addEventListener("click", closeOnOverlayClick);

    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showCartTotal);
    menuContainer.addEventListener("click", addProduct);
    productsCart.addEventListener("click", handleQuantity);
    buyBtn.addEventListener("click", completeBuy);
    deleteBtn.addEventListener("click", deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);

    form.addEventListener("submit", validateForm);
    nameInput.addEventListener("input", () => checkTextInput(nameInput));
    emailInput.addEventListener("input", () => checkEmail(emailInput));
    phoneInput.addEventListener("input", () => checkPhone(phoneInput));
    textAreaInput.addEventListener("input", () => checkTextArea(textAreaInput));
};

init();