const board = {
    mode: "recent",   // "recent" | "popular"
    range: "month",   // "month" | "year" (only used when mode === "popular")
    writer: "",
    page: 1
};

$(document).ready(() => {
    getContent();
})

$(document).on("click", ".load-more-btn", () => {
    const html = $(".load-more-btn").html();
    $(".load-more-btn").text("Loading...");
    board.page++;
    getContent();
    $(".load-more-btn").html(html);
})

$(document).on("click", ".all-projects-btn", function () {
    if (board.mode === "recent") return;
    board.mode = "recent";
    setActivePill(this);
    $(".popular-range-pills").hide();
    resetAndFetch();
})

$(document).on("click", ".popular-projects-btn", function () {
    if (board.mode === "popular") return;
    board.mode = "popular";
    setActivePill(this);
    $(".popular-range-pills").show();
    resetAndFetch();
})

$(document).on("click", ".range-pill", function () {
    const range = $(this).data("range");
    if (board.range === range) return;
    board.range = range;
    $(".range-pill").removeClass("active");
    $(this).addClass("active");
    resetAndFetch();
})

function setActivePill(el) {
    $(".all-projects-btn, .popular-projects-btn").removeClass("active");
    $(el).addClass("active");
}

function resetAndFetch() {
    board.page = 1;
    $(".project-list").empty();
    getContent();
}

const getContent = () => {
    const params = new URLSearchParams({ idx: board.page, mode: board.mode });
    if (board.mode === "popular") params.set("range", board.range);
    if (board.writer) params.set("writer", board.writer);

    fetch(`/api/index?${params.toString()}`)
    .then((res) => res.json())
    .then(data => {
        if(data.length == 0){
            if (board.page === 1) {
                $(".project-list").html(`<div class="board-empty">No projects found.</div>`);
                return;
            }
            const html = $(".load-more-btn").html();
            $(".load-more-btn").text("No Data...");
            setTimeout(() => {
                $(".load-more-btn").html(html);
            }, 1000);
            return;
        }
        data.forEach(d => {
            $(".project-list").append(projectBoxHTML(d));
        })
    })
}

// ---- author autocomplete ----
let allWriters = null;
let writersFetchPromise = null;
function ensureWritersLoaded() {
    if (!writersFetchPromise) {
        writersFetchPromise = fetch("/api/writers").then((res) => res.json()).then((list) => {
            allWriters = list;
            return list;
        });
    }
    return writersFetchPromise;
}

function renderSuggestions(list) {
    const $box = $(".author-suggestions");
    if (!list.length) {
        $box.hide().empty();
        return;
    }
    $box.empty();
    list.slice(0, 30).forEach((name) => {
        $box.append(`<div class="author-suggestion-item">${name}</div>`);
    });
    $box.show();
}

function showSuggestionsFor(value) {
    ensureWritersLoaded().then((list) => {
        const q = value.trim().toLowerCase();
        const filtered = q ? list.filter((name) => name.toLowerCase().includes(q)) : list;
        renderSuggestions(filtered);
    });
}

$(document).on("focus", ".board-author-input", function () {
    showSuggestionsFor(this.value);
})

let writerDebounce;
$(document).on("input", ".board-author-input", function () {
    showSuggestionsFor(this.value);

    clearTimeout(writerDebounce);
    const value = this.value;
    writerDebounce = setTimeout(() => {
        board.writer = value.trim();
        resetAndFetch();
    }, 350);
})

$(document).on("click", ".author-suggestion-item", function () {
    const name = $(this).text();
    const inputEl = $(".board-author-input")[0];
    inputEl.value = name;
    autoGrow(inputEl);
    $(".author-suggestions").hide().empty();
    board.writer = name;
    resetAndFetch();
})

$(document).on("click", (e) => {
    if (!$(e.target).closest(".board-author-search").length) {
        $(".author-suggestions").hide();
    }
})

// ---- search / author inputs grow to fit their own content instead of a fixed width ----
const AUTOGROW_MIN = 220;
const AUTOGROW_MAX = 560;
let measureCanvas;
function measureTextWidth(text, font) {
    measureCanvas = measureCanvas || document.createElement("canvas");
    const ctx = measureCanvas.getContext("2d");
    ctx.font = font;
    return ctx.measureText(text).width;
}
function autoGrow(inputEl) {
    const text = inputEl.value.length ? inputEl.value : inputEl.placeholder;
    const font = getComputedStyle(inputEl).font;
    const chrome = 70; // icon + horizontal padding
    const width = Math.min(AUTOGROW_MAX, Math.max(AUTOGROW_MIN, measureTextWidth(text, font) + chrome));
    $(inputEl).closest(".board-search").css("width", `${width}px`);
}

$(document).on("input", ".board-search-input, .board-author-input", function () {
    autoGrow(this);
})

$(function () {
    $(".board-search-input, .board-author-input").each(function () {
        autoGrow(this);
    });
})
