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

function renderContributionHeatmap(data) {
    var grid = document.getElementById("contributionGrid");
    var status = document.getElementById("contributionStatus");
    var weeks = Array.isArray(data.weeks) ? data.weeks : [];

    grid.replaceChildren();

    if (weeks.length === 0) {
        status.textContent = "Waiting for the first GitHub data update.";
        return;
    }

    weeks.forEach(function (week, weekIndex) {
        week.contributionDays.forEach(function (day) {
            var cell = document.createElement("span");
            var level = String(day.contributionLevel || "NONE").toLowerCase();
            var count = Number(day.contributionCount) || 0;

            cell.className = "contributionCell";
            cell.dataset.level = level;
            cell.style.gridColumn = String(weekIndex + 1);
            cell.style.gridRow = String(Number(day.weekday) + 1);
            cell.title = day.date + ": " + count + (count === 1 ? " contribution" : " contributions");
            grid.appendChild(cell);
        });
    });

    grid.setAttribute("aria-label", data.totalContributions + " GitHub contributions in the last year");
    status.textContent = data.totalContributions + " contributions in the last year";
}

function loadContributionHeatmap() {
    fetch("./static/data/contributions.json", { cache: "no-cache" })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Contribution data request failed");
            }
            return response.json();
        })
        .then(renderContributionHeatmap)
        .catch(function () {
            document.getElementById("contributionStatus").textContent = "GitHub activity is temporarily unavailable.";
        });
}

document.addEventListener("DOMContentLoaded", function () {
    var html = document.documentElement;
    var checkbox = document.getElementById("myonoffswitch");
    var themeState = getCookie("themeState") || "Light";

    function changeTheme(theme) {
        var nextTheme = theme === "Dark" ? "Dark" : "Light";
        html.dataset.theme = nextTheme;
        checkbox.checked = nextTheme === "Light";
        setCookie("themeState", nextTheme, 365);
        themeState = nextTheme;
    }

    checkbox.addEventListener("change", function () {
        changeTheme(themeState === "Dark" ? "Light" : "Dark");
    });

    changeTheme(themeState);
    attachProjectPressEffects();
    loadContributionHeatmap();
});

window.addEventListener("load", function () {
    var pageLoading = document.getElementById("zyyo-loading");
    window.setTimeout(function () {
        pageLoading.style.opacity = "0";
    }, 100);
});
