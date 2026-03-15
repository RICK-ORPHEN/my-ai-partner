/**
 * AI Slide Generator - エディタJS
 * スライドの表示・編集・PDF出力を担当
 */

let slidesData = null;
let template = null;
let currentSlideIndex = 0;
let selectedElement = null;

// ===== 初期化 =====
document.addEventListener("DOMContentLoaded", () => {
    const raw = sessionStorage.getItem("slidesData");
    if (!raw) {
        alert("スライドデータがありません。トップページからやり直してください。");
        window.location.href = "/";
        return;
    }

    slidesData = JSON.parse(raw);
    template = slidesData.template;
    renderAll();
});

// ===== 全体レンダリング =====
function renderAll() {
    renderSidebar();
    renderSlide(currentSlideIndex);
    updateCounter();
}

// ===== スライドカウンター更新 =====
function updateCounter() {
    document.getElementById("current-slide").textContent = currentSlideIndex + 1;
    document.getElementById("total-slides").textContent = slidesData.slides.length;
}

// ===== サイドバーサムネイル =====
function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    slidesData.slides.forEach((slide, i) => {
        const thumb = document.createElement("div");
        thumb.className = "thumb" + (i === currentSlideIndex ? " active" : "");
        thumb.onclick = () => {
            currentSlideIndex = i;
            renderAll();
        };

        const content = document.createElement("div");
        content.className = "thumb-content";
        content.innerHTML = generateSlideHTML(slide);
        applySlideStyles(content, slide);

        const num = document.createElement("div");
        num.className = "thumb-number";
        num.textContent = i + 1;

        thumb.appendChild(content);
        thumb.appendChild(num);
        sidebar.appendChild(thumb);
    });
}

// ===== メインスライド描画 =====
function renderSlide(index) {
    const canvas = document.getElementById("slide-canvas");
    const slide = slidesData.slides[index];
    canvas.innerHTML = generateSlideHTML(slide);
    applySlideStyles(canvas, slide);

    // 全要素を編集可能にする
    canvas.querySelectorAll("[data-editable]").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            selectElement(el);
        });

        el.addEventListener("dblclick", () => {
            el.contentEditable = "true";
            el.focus();
        });

        el.addEventListener("blur", () => {
            el.contentEditable = "false";
            saveSlideContent(index);
        });
    });

    // 背景クリックで選択解除
    canvas.addEventListener("click", (e) => {
        if (e.target === canvas || e.target.classList.contains("slide-title-page") ||
            e.target.classList.contains("slide-content-page") ||
            e.target.classList.contains("slide-two-col") ||
            e.target.classList.contains("slide-img-text") ||
            e.target.classList.contains("slide-closing")) {
            deselectAll();
        }
    });
}

// ===== スライドHTML生成 =====
function generateSlideHTML(slide) {
    switch (slide.type) {
        case "title":
            return `
                <div class="slide-title-page">
                    <div class="slide-main-title" data-editable data-field="title">${escapeHTML(slide.title)}</div>
                    <div class="slide-subtitle" data-editable data-field="subtitle">${escapeHTML(slide.subtitle || "")}</div>
                </div>`;

        case "content":
            const bullets = (slide.bullets || [])
                .map((b) => `<li data-editable data-field="bullet">${escapeHTML(b)}</li>`)
                .join("");
            const note = slide.note ? `<div class="slide-note" data-editable data-field="note">${escapeHTML(slide.note)}</div>` : "";
            return `
                <div class="slide-content-page">
                    <div class="slide-heading" data-editable data-field="title">${escapeHTML(slide.title)}</div>
                    <ul class="slide-bullets">${bullets}</ul>
                    ${note}
                </div>`;

        case "two-column":
            const leftItems = (slide.left_items || []).map((b) => `<li data-editable data-field="left-item">${escapeHTML(b)}</li>`).join("");
            const rightItems = (slide.right_items || []).map((b) => `<li data-editable data-field="right-item">${escapeHTML(b)}</li>`).join("");
            return `
                <div class="slide-two-col">
                    <div class="slide-heading" data-editable data-field="title">${escapeHTML(slide.title)}</div>
                    <div class="slide-columns">
                        <div class="slide-column">
                            <h3 data-editable data-field="left_title">${escapeHTML(slide.left_title || "")}</h3>
                            <ul>${leftItems}</ul>
                        </div>
                        <div class="slide-column">
                            <h3 data-editable data-field="right_title">${escapeHTML(slide.right_title || "")}</h3>
                            <ul>${rightItems}</ul>
                        </div>
                    </div>
                </div>`;

        case "image-text":
            return `
                <div class="slide-img-text">
                    <div class="slide-heading" data-editable data-field="title">${escapeHTML(slide.title)}</div>
                    <div class="slide-img-text-body">
                        <div class="slide-img-placeholder" data-field="image">
                            ${escapeHTML(slide.image_placeholder || "クリックして画像を追加")}
                        </div>
                        <div class="text-side" data-editable data-field="text">${escapeHTML(slide.text || "")}</div>
                    </div>
                </div>`;

        case "closing":
            const cBullets = (slide.bullets || [])
                .map((b) => `<li data-editable data-field="bullet">${escapeHTML(b)}</li>`)
                .join("");
            return `
                <div class="slide-closing">
                    <div class="slide-main-title" data-editable data-field="title">${escapeHTML(slide.title)}</div>
                    <ul class="slide-bullets">${cBullets}</ul>
                    <div class="closing-msg" data-editable data-field="closing_message">${escapeHTML(slide.closing_message || "")}</div>
                </div>`;

        default:
            return `<div class="slide-content-page"><div class="slide-heading">${escapeHTML(slide.title || "")}</div></div>`;
    }
}

// ===== スライドスタイル適用 =====
function applySlideStyles(container, slide) {
    if (!template) return;

    container.style.background = template.bg;
    container.style.color = template.text;
    container.style.fontFamily = template.font;

    // タイトルバー
    container.querySelectorAll(".slide-heading").forEach((el) => {
        el.style.borderBottomColor = template.primary;
        el.style.color = template.primary;
    });

    // タイトルスライドのメインタイトル
    container.querySelectorAll(".slide-title-page .slide-main-title, .slide-closing .slide-main-title").forEach((el) => {
        el.style.color = template.primary;
    });

    // 箇条書きの丸
    container.querySelectorAll(".slide-bullets li").forEach((el) => {
        el.style.setProperty("--bullet-color", template.secondary);
    });

    // CSSカスタムプロパティでバレットカラーを適用
    const style = document.createElement("style");
    style.textContent = `
        .slide-bullets li::before { background: ${template.secondary} !important; }
        .slide-column { background: ${template.light_bg} !important; }
        .slide-img-placeholder { border-color: ${template.secondary} !important; color: ${template.secondary} !important; }
    `;
    container.appendChild(style);

    // タイトルスライドのデコレーション
    if (slide.type === "title" || slide.type === "closing") {
        const page = container.querySelector(".slide-title-page, .slide-closing");
        if (page) {
            page.style.background = `linear-gradient(135deg, ${template.bg} 0%, ${template.light_bg} 100%)`;
            page.style.borderTop = `4px solid ${template.primary}`;
        }
    }
}

// ===== 要素選択 =====
function selectElement(el) {
    deselectAll();
    el.classList.add("selected");
    selectedElement = el;
    showProperties(el);
}

function deselectAll() {
    document.querySelectorAll(".slide-element, [data-editable]").forEach((el) => {
        el.classList.remove("selected");
        el.contentEditable = "false";
    });
    selectedElement = null;
    document.getElementById("text-props").style.display = "none";
}

// ===== プロパティパネル =====
function showProperties(el) {
    const panel = document.getElementById("text-props");
    panel.style.display = "block";

    const computedStyle = window.getComputedStyle(el);
    const fontSize = parseInt(computedStyle.fontSize);
    const fontWeight = computedStyle.fontWeight;
    const color = rgbToHex(computedStyle.color);

    document.getElementById("prop-font-size").value = fontSize;
    document.getElementById("prop-font-size-val").textContent = fontSize + "px";
    document.getElementById("prop-font-weight").value = fontWeight;
    document.getElementById("prop-text-color").value = color;

    // イベントリスナー設定
    document.getElementById("prop-font-size").oninput = (e) => {
        el.style.fontSize = e.target.value + "px";
        document.getElementById("prop-font-size-val").textContent = e.target.value + "px";
    };

    document.getElementById("prop-font-weight").onchange = (e) => {
        el.style.fontWeight = e.target.value;
    };

    document.getElementById("prop-text-color").oninput = (e) => {
        el.style.color = e.target.value;
    };

    document.querySelectorAll(".align-btn").forEach((btn) => {
        btn.onclick = () => {
            document.querySelectorAll(".align-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            el.style.textAlign = btn.dataset.align;
        };
    });
}

// ===== スライド内容保存 =====
function saveSlideContent(index) {
    const canvas = document.getElementById("slide-canvas");
    const slide = slidesData.slides[index];

    // タイトル
    const titleEl = canvas.querySelector('[data-field="title"]');
    if (titleEl) slide.title = titleEl.textContent;

    // サブタイトル
    const subtitleEl = canvas.querySelector('[data-field="subtitle"]');
    if (subtitleEl) slide.subtitle = subtitleEl.textContent;

    // 箇条書き
    const bulletEls = canvas.querySelectorAll('[data-field="bullet"]');
    if (bulletEls.length) {
        slide.bullets = Array.from(bulletEls).map((el) => el.textContent);
    }

    // ノート
    const noteEl = canvas.querySelector('[data-field="note"]');
    if (noteEl) slide.note = noteEl.textContent;

    // 2カラム
    const leftTitleEl = canvas.querySelector('[data-field="left_title"]');
    if (leftTitleEl) slide.left_title = leftTitleEl.textContent;
    const rightTitleEl = canvas.querySelector('[data-field="right_title"]');
    if (rightTitleEl) slide.right_title = rightTitleEl.textContent;

    // テキスト
    const textEl = canvas.querySelector('[data-field="text"]');
    if (textEl) slide.text = textEl.textContent;

    // クロージング
    const closingEl = canvas.querySelector('[data-field="closing_message"]');
    if (closingEl) slide.closing_message = closingEl.textContent;

    // sessionStorageに保存
    sessionStorage.setItem("slidesData", JSON.stringify(slidesData));

    // サムネイル更新
    renderSidebar();
}

// ===== スライド操作 =====
function addSlide() {
    const newSlide = {
        type: "content",
        title: "新しいスライド",
        bullets: ["ポイント1", "ポイント2", "ポイント3"],
    };
    slidesData.slides.splice(currentSlideIndex + 1, 0, newSlide);
    currentSlideIndex++;
    renderAll();
}

function duplicateSlide() {
    const copy = JSON.parse(JSON.stringify(slidesData.slides[currentSlideIndex]));
    slidesData.slides.splice(currentSlideIndex + 1, 0, copy);
    currentSlideIndex++;
    renderAll();
}

function deleteSlide() {
    if (slidesData.slides.length <= 1) {
        alert("最後のスライドは削除できません。");
        return;
    }
    if (!confirm("このスライドを削除しますか？")) return;
    slidesData.slides.splice(currentSlideIndex, 1);
    if (currentSlideIndex >= slidesData.slides.length) {
        currentSlideIndex = slidesData.slides.length - 1;
    }
    renderAll();
}

// ===== PDF出力 =====
function exportPDF() {
    deselectAll();

    // 全スライドを一時的に表示してPDF出力
    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.cssText = "position:fixed;top:0;left:0;width:100%;z-index:9999;background:#fff;";

    slidesData.slides.forEach((slide) => {
        const page = document.createElement("div");
        page.style.cssText = "width:960px;height:540px;margin:0 auto;page-break-after:always;overflow:hidden;position:relative;";
        page.innerHTML = generateSlideHTML(slide);
        applySlideStyles(page, slide);
        printContainer.appendChild(page);
    });

    document.body.appendChild(printContainer);

    // 少し待ってから印刷ダイアログを開く
    setTimeout(() => {
        window.print();
        document.body.removeChild(printContainer);
    }, 300);
}

// ===== キーボードショートカット =====
document.addEventListener("keydown", (e) => {
    // Ctrl+P: PDF出力
    if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        exportPDF();
    }

    // Delete: 要素のテキストクリア（編集中でなければ）
    if (e.key === "Delete" && selectedElement && selectedElement.contentEditable !== "true") {
        selectedElement.textContent = "";
        saveSlideContent(currentSlideIndex);
    }

    // 矢印キーでスライド切り替え（編集中でなければ）
    if (!selectedElement || selectedElement.contentEditable !== "true") {
        if (e.key === "ArrowLeft" && currentSlideIndex > 0) {
            currentSlideIndex--;
            renderAll();
        }
        if (e.key === "ArrowRight" && currentSlideIndex < slidesData.slides.length - 1) {
            currentSlideIndex++;
            renderAll();
        }
    }
});

// ===== ユーティリティ =====
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return "#000000";
    return "#" + [match[1], match[2], match[3]]
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("");
}
