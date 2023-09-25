const menuBtn = document.querySelector(".menu-label");
const barsMenu = document.querySelector(".navbar-list");

const registerForm = document.getElementById("register-form");
const nameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");


const toggleMenu = () => {
    barsMenu.classList.toggle('open-menu');
    overlay.classList.toggle('show-overlay');
};


// ----------------------------------------------------------------
const users = JSON.parse(localStorage.getItem("users")) || [];

const saveToLocalStorage = () => {
    localStorage.setItem("users", JSON.stringify(users));
};


// ----------------------------------------------------------------
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

const isExistingEmail = (input) => {
    return users.some((user) => user.email === input.value.trim());
};

const isPassSecure = (input) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    //probamos
    return re.test(input.value.trim());
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


// ----------------------------------------------------------------
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
    if (isExistingEmail(input)) {
        showError(input, "El email ya se encuentra registrado");
        return;
    }
    showSuccess(input);
    valid = true;
    return valid;
};

const checkPassword = (input) => {
    let valid = false;
    if (isEmpty(input)) {
        showError(input, "La contraseña es obligatoria");
        return;
    }
    if (!isPassSecure(input)) {
        showError(input, "La contraseña debe tener al menos 8 caracteres, una mayúscula y una minúscula");
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
    let isPasswordValid = checkPassword(passInput);

    let isValidForm =
        isNameValid &&
        isEmailValid &&
        isPasswordValid;

    if (isValidForm) {
        users.push({
            name: nameInput.value,
            email: emailInput.value,
            password: passInput.value,
        });
        saveToLocalStorage(users);
        alert("Te has registrado con éxito");
        window.location.href = "login.html";
    }
};


// ----------------------------------------------------------------
const init = () => {
    menuBtn.addEventListener('click', toggleMenu);

    registerForm.addEventListener("submit", validateForm);
    nameInput.addEventListener("input", () => checkTextInput(nameInput));
    emailInput.addEventListener("input", () => checkEmail(emailInput));
    passInput.addEventListener("input", () => checkPassword(passInput));
};

init();