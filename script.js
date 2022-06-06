(function () {

    'use strict';

    // define variables
    var items = document.querySelectorAll(".timeline li");

    // check if an element is in viewport
    // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function callbackFunc() {
        for (var i = 0; i < items.length; i++) {
            if (isElementInViewport(items[i])) {
                items[i].classList.add("in-view");
            }
        }
    }

    // listen for events
    window.addEventListener("load", callbackFunc);
    window.addEventListener("resize", callbackFunc);
    window.addEventListener("scroll", callbackFunc);

})();

function ValidationMail(e) {
    var regex1 =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    var mail = document.getElementById("email").value;

    if (regex1.test(mail)) {
        errMsg.textContent = "";
    } else {
        errMsg.textContent = "Adresse mail non valide";
        isValid = false;
    }
    return isValid;
}
function ValidationFirstName(e) {
    let regex2 = /^[A-Za-z]+$/;
    let isValid = true;
    let nameForm = document.getElementById("firstName").value;
    let nameLastForm = document.getElementById("lastName").value;
    if (!regex2.test(nameForm)) {
        errMsgFirst.textContent = "Prénom non valide";
        isValid = false;
    } else {
        errMsgFirst.textContent = "";
    }
    if (!regex2.test(nameLastForm)) {
        errMsgLast.textContent = "Nom non valide";
        isValid = false;
    } else {
        errMsgLast.textContent = "";
    }
    return isValid;
}

let nameFirst = document.querySelector("input#firstName");
let nameLast = document.querySelector("input#lastName");
let adresse = document.querySelector("input#address");
let city = document.querySelector("input#city");
let email = document.querySelector("input#email");
//envoyer la commande vers le back
function send(e) {
    res = localStorage.panier;
    let panier = JSON.parse(res ? res : "[]");
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contact: {
                firstName: nameFirst.value,
                lastName: nameLast.value,
                address: adresse.value,
                city: city.value,
                email: email.value,
            },
            products: panier.map((a) => a.produit._id),
        }),
    })
        .then((res) => res.json())
        .then((order) => {
            console.log(order);
            localStorage.panier = [];
            window.location = "confirmation.html?orderId=" + order.orderId;
        });
}

let form = document.querySelector(".cart__order__form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    res = localStorage.panier;
    let panier = JSON.parse(res ? res : "[]");
    let isMailValid = ValidationMail(e);
    let isNameValid = ValidationFirstName(e);
    if (panier.length == 0) {
        alert("Veuillez remplir votre panier");
    }
    //si le contenu du formulaire est valide et le panier n'est pas vide la commande sera envoyer
    if (isMailValid && isNameValid && panier.length != 0) {
        send(e);
    }
});

function removeArticle(e, panier) {
    let articleBalise = e.target.closest(".cart__item");
    let id = articleBalise.getAttribute("data-id");
    let couleurChoisi = articleBalise.getAttribute("data-couleur");

    //on filtre que les produits qui n'ont pas la meme couleur ou qui n'ont pas le meme id (on supprime les produits qui ont le meme id et la meme couleur).
    panierFiltre = panier.filter(
        (achat) => achat.produit._id != id || achat.couleur != couleurChoisi
    );
    localStorage.panier = JSON.stringify(panierFiltre);
    initialiserPanier();
}
