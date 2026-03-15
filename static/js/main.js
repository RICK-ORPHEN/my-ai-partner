/**
 * AI Slide Generator - メインJS
 */

let selectedTemplate = "business-blue";
let uploadedContent = "";

// ===== テンプレート選択 =====
document.querySelectorAll(".template-card").forEach((card) => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".template-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedTemplate = card.dataset.template;
    });
});

// ===== タブ切り替え =====
document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
});

// ===== ステップ切り替え =====
function goToStep(step) {
    document.querySelectorAll(".step-content").forEach((s) => s.classList.remove("active"));
    document.getElementById("step" + step).classList.add("active");

    document.querySelectorAll(".step").forEach((s) => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove("active", "done");
        if (sNum < step) s.classList.add("done");
        if (sNum === step) s.classList.add("active");
    });
}

// ===== ファイルアップロード =====
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");

if (dropZone) {
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
}

if (fileInput) {
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedContent = e.target.result;
        document.getElementById("file-name").textContent = file.name;
        document.getElementById("file-content").value = uploadedContent;
        document.getElementById("drop-zone").style.display = "none";
        document.getElementById("file-preview").style.display = "block";
    };
    reader.readAsText(file);
}

function clearFile() {
    uploadedContent = "";
    document.getElementById("drop-zone").style.display = "block";
    document.getElementById("file-preview").style.display = "none";
    fileInput.value = "";
}

// ===== スライド生成 =====
async function generateSlides() {
    const textContent = document.getElementById("content-input").value.trim();
    const content = textContent || uploadedContent;

    if (!content) {
        alert("スライドの内容を入力してください。");
        return;
    }

    const slideCount = document.getElementById("slide-count").value;

    // 生成中画面へ
    goToStep(3);

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                template_id: selectedTemplate,
                content: content,
                slide_count: parseInt(slideCount),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "生成に失敗しました");
        }

        // スライドデータをsessionStorageに保存してエディタへ遷移
        sessionStorage.setItem("slidesData", JSON.stringify(data));
        window.location.href = "/editor";
    } catch (error) {
        alert("エラー: " + error.message);
        goToStep(2);
    }
}
