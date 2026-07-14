console.log(
    "%cLeatrise's tiny lab",
    "background:#6f5cff;color:white;font-size:16px;font-weight:bold;padding:6px 10px;border-radius:6px;"
);

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i += 1) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function attachProjectPressEffects() {
    var cards = document.querySelectorAll(".projectItem");

    function press() {
        this.classList.add("pressed");
    }

    function release() {
        this.classList.remove("pressed");
    }

    cards.forEach(function (card) {
        card.addEventListener("mousedown", press);
        card.addEventListener("mouseup", release);
        card.addEventListener("mouseleave", release);
        card.addEventListener("touchstart", press, { passive: true });
        card.addEventListener("touchend", release);
        card.addEventListener("touchcancel", release);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var checkbox = document.getElementById("myonoffswitch");
    var snake = document.getElementById("tanChiShe");
    var themeState = getCookie("themeState") || "Light";

    function changeTheme(theme) {
        var nextTheme = theme === "Dark" ? "Dark" : "Light";
        html.dataset.theme = nextTheme;
        checkbox.checked = nextTheme === "Light";
        snake.src = "./static/svg/snake-" + nextTheme + ".svg";
        setCookie("themeState", nextTheme, 365);
        themeState = nextTheme;
    }

    checkbox.addEventListener("change", function () {
        changeTheme(themeState === "Dark" ? "Light" : "Dark");
    });

    changeTheme(themeState);
    attachProjectPressEffects();
});

window.addEventListener("load", function () {
    var pageLoading = document.getElementById("zyyo-loading");
    window.setTimeout(function () {
        pageLoading.style.opacity = "0";
    }, 100);
});
