/*!
 * AI SCHOOL — Lesson Engine (v0.1)
 * 静的HTMLのまま、JSON定義でレッスン内容を差し込むランナー。
 *
 * URLパラメータ:
 *   ?course=chatbot&lesson=chatbot-01&industry=restaurant&goal=customer_inquiry&level=beginner
 *
 * 使い方:
 *   <script src="../js/lesson-engine.js" defer></script>
 *
 * URLに ?course= が無ければ、何もせず既存UIをそのまま表示する。
 */
(function () {
  const params = new URLSearchParams(location.search);
  const courseId = params.get('course');
  if (!courseId) return; // runner mode off

  const lessonId = params.get('lesson');
  const industry = params.get('industry') || null;
  const goal = params.get('goal') || null;
  const level = params.get('level') || 'beginner';

  const DATA_BASE = location.pathname.includes('/pages/')
    ? '../data/courses/'
    : './data/courses/';

  async function loadCourse(id) {
    const res = await fetch(DATA_BASE + id + '.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('course not found: ' + id);
    return res.json();
  }

  function pickLesson(course, lid) {
    if (!lid) return course.lessons[0];
    return course.lessons.find(function (l) { return l.id === lid; }) || course.lessons[0];
  }

  function mergeDiffs(lesson) {
    // shallow merge of industry_diff / goal_diff / level_diff onto the lesson
    const merged = Object.assign({}, lesson);
    merged._notes = [];
    if (industry && lesson.industry_diff && lesson.industry_diff[industry]) {
      merged._notes.push({ label: '業種差分', text: lesson.industry_diff[industry] });
    }
    if (goal && lesson.goal_diff && lesson.goal_diff[goal]) {
      merged._notes.push({ label: '目的差分', text: lesson.goal_diff[goal] });
    }
    if (level && lesson.level_diff && lesson.level_diff[level]) {
      merged._notes.push({ label: 'レベル調整', text: lesson.level_diff[level] });
    }
    return merged;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function listHTML(arr) {
    if (!arr || !arr.length) return '';
    return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }

  function renderRunner(course, lesson) {
    document.title = course.title + ' / ' + lesson.title + ' | AI SCHOOL';

    const root = document.createElement('div');
    root.id = 'lesson-engine-root';
    root.innerHTML =
      '<style>' +
      '#lesson-engine-root{position:fixed;inset:0;background:#fafafa;color:#0A0A0A;z-index:9999;overflow:auto;font-family:"Inter","Noto Sans JP",sans-serif;}' +
      '.le-wrap{max-width:860px;margin:0 auto;padding:56px 24px 120px;}' +
      '.le-badge{display:inline-block;background:#D93B00;color:#fff;padding:4px 12px;font-size:11px;letter-spacing:2px;}' +
      '.le-title{font-size:32px;font-weight:800;margin:12px 0 8px;}' +
      '.le-goal{color:#333;margin-bottom:32px;line-height:1.7;}' +
      '.le-section{background:#fff;border:1px solid #eee;padding:24px;margin-bottom:20px;}' +
      '.le-section h3{font-size:14px;letter-spacing:2px;color:#D93B00;margin:0 0 12px;}' +
      '.le-q{font-size:22px;font-weight:700;line-height:1.6;}' +
      '.le-notes li{margin:6px 0;}' +
      '.le-hints{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}' +
      '.le-hint-btn{background:#0A0A0A;color:#fff;border:none;padding:10px 18px;font-size:13px;cursor:pointer;letter-spacing:1px;}' +
      '.le-hint-btn:hover{background:#D93B00;}' +
      '.le-hint-out{margin-top:12px;color:#333;background:#f5f5f5;padding:12px;display:none;}' +
      '.le-hint-out.show{display:block;}' +
      '.le-submit{background:#D93B00;color:#fff;border:none;padding:16px 40px;font-weight:800;letter-spacing:2px;cursor:pointer;font-size:14px;}' +
      '.le-submit:hover{background:#B83200;}' +
      '.le-textarea{width:100%;min-height:160px;padding:12px;border:1px solid #ddd;font-family:inherit;font-size:14px;}' +
      '.le-meta{display:flex;gap:16px;color:#888;font-size:12px;margin-bottom:24px;}' +
      '.le-close{position:absolute;top:16px;right:24px;background:none;border:none;font-size:14px;cursor:pointer;color:#888;}' +
      '.le-next{margin-top:24px;color:#888;font-size:12px;}' +
      '</style>' +
      '<button class="le-close" onclick="history.back()">← 戻る</button>' +
      '<div class="le-wrap">' +
        '<p class="le-badge">' + esc(course.title) + '</p>' +
        '<h1 class="le-title">Lesson ' + esc(lesson.index) + ' — ' + esc(lesson.title) + '</h1>' +
        '<p class="le-goal">🎯 ' + esc(lesson.goal) + '</p>' +
        '<div class="le-meta">' +
          '<span>業種: ' + esc(industry || '未設定') + '</span>' +
          '<span>目的: ' + esc(goal || '未設定') + '</span>' +
          '<span>レベル: ' + esc(level) + '</span>' +
        '</div>' +

        (lesson._notes.length ?
          '<div class="le-section le-notes"><h3>あなた向けの注意点</h3>' +
          '<ul>' + lesson._notes.map(function (n) {
            return '<li><strong>' + esc(n.label) + ':</strong> ' + esc(n.text) + '</li>';
          }).join('') + '</ul></div>' : '') +

        '<div class="le-section">' +
          '<h3>QUESTION</h3>' +
          '<p class="le-q">' + esc(lesson.question) + '</p>' +
          '<div class="le-hints">' +
            '<button class="le-hint-btn" data-mode="A">Mode A: 問いのみ</button>' +
            '<button class="le-hint-btn" data-mode="B">Mode B: 軽いヒント</button>' +
            '<button class="le-hint-btn" data-mode="C">Mode C: 構造ヒント</button>' +
          '</div>' +
          '<div class="le-hint-out" id="le-hint-out"></div>' +
        '</div>' +

        '<div class="le-section">' +
          '<h3>NG例</h3>' +
          listHTML(lesson.ng_examples) +
        '</div>' +

        '<div class="le-section">' +
          '<h3>提出物</h3>' +
          '<p>形式: ' + esc((lesson.deliverable && lesson.deliverable.format) || '-') +
          ' / 最低文字数: ' + esc((lesson.deliverable && lesson.deliverable.min_length) || '-') + '</p>' +
          '<p>必須セクション: ' + esc(((lesson.deliverable && lesson.deliverable.required_sections) || []).join(' / ')) + '</p>' +
          '<textarea class="le-textarea" id="le-submission" placeholder="ここに提出内容を書いてください（この版ではlocalStorageに保存されるだけです）"></textarea>' +
          '<div style="margin-top:16px;"><button class="le-submit" id="le-submit-btn">提出する</button></div>' +
        '</div>' +

        '<div class="le-section">' +
          '<h3>評価軸</h3>' +
          listHTML(lesson.evaluation) +
        '</div>' +

        (lesson.next_link ?
          '<p class="le-next">次: ' + esc(lesson.next_link) + ' → <a href="?course=' + esc(course.id) +
          '&lesson=' + esc(lesson.next_link) +
          (industry ? '&industry=' + esc(industry) : '') +
          (goal ? '&goal=' + esc(goal) : '') +
          (level ? '&level=' + esc(level) : '') +
          '">進む</a></p>' : '<p class="le-next">このコースは完了です 🎉</p>') +
      '</div>';

    document.body.appendChild(root);

    // hint handlers
    root.querySelectorAll('.le-hint-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const mode = btn.dataset.mode;
        const hints = (lesson.hints && lesson.hints[mode]) || [];
        const out = document.getElementById('le-hint-out');
        out.innerHTML = '<strong>Mode ' + mode + ':</strong><br>' + hints.map(esc).join('<br>');
        out.classList.add('show');
      });
    });

    // submit handler (MVP: save to localStorage)
    document.getElementById('le-submit-btn').addEventListener('click', function () {
      const val = document.getElementById('le-submission').value.trim();
      const key = 'aischool.submission.' + lesson.id;
      localStorage.setItem(key, val);
      alert('保存しました。\n（Phase 2 で GPT-5.4 評価エンジンに接続されます）');
    });
  }

  function renderError(msg) {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:9999;padding:80px 24px;font-family:sans-serif;';
    el.innerHTML = '<h1>レッスン読み込みエラー</h1><p>' + esc(msg) + '</p>';
    document.body.appendChild(el);
  }

  loadCourse(courseId)
    .then(function (course) {
      const lesson = mergeDiffs(pickLesson(course, lessonId));
      renderRunner(course, lesson);
    })
    .catch(function (e) { renderError(e.message); });
})();
