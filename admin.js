/* Admin panel — Kusary Services
   Tabs: Ads / Users / Logs / Tourism
   Auth: /api/login (session cookie). Admin check: /api/admin/me
*/

const $ = (id) => document.getElementById(id);

// Views
const loginView = $("loginView");
const appView = $("appView");

// Login
const loginForm = $("loginForm");
const loginIdentifier = $("loginIdentifier");
const loginPassword = $("loginPassword");
const loginRemember = $("loginRemember");
const loginError = $("loginError");
const btnToSite = $("btnToSite");

// Header
const admUser = $("admUser");
const admLogout = $("admLogout");

// Common controls
const admSearch = $("admSearch");
const tableWrap = $("tableWrap");

// Tabs toolbars
const toolbarAds = $("toolbarAds");
const toolbarUsers = $("toolbarUsers");
const toolbarLogs = $("toolbarLogs");
const toolbarTourism = $("toolbarTourism");

// Ads toolbar
const adsStatus = $("adsStatus");
const btnRefresh = $("btnRefresh");

// Users toolbar
const btnRefreshUsers = $("btnRefreshUsers");

// Logs toolbar
const btnRefreshLogs = $("btnRefreshLogs");

// Tourism toolbar
const tourismSectionFilter = $("tourismSection");
const btnRefreshTourism = $("btnRefreshTourism");
const btnAddTourism = $("btnAddTourism");

// Tourism modal (IDs are from admin.html)
const tourismModal = $("tourismModal");
const tourismModalTitle = $("tourismModalTitle");
const tourismForm = $("tourismForm");
const tourismFormSection = $("tourismFormSection");
const tourismFormTitle = $("tourismFormTitle");
const tourismFormBody = $("tourismFormBody");
const tourismFormImages = $("tourismFormImages");
const tourismFormPublished = $("tourismFormPublished");
const tourismFormError = $("tourismFormError");
const btnCloseTourismModal = $("btnCloseTourismModal");
const btnCancelTourism = $("btnCancelTourism");

let currentTab = "ads";
let me = null;

// Tourism editing state
let editingTourismId = null;
let editingTourismImages = []; // array of dataURL strings

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function apiJson(url, opts = {}){
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: Object.assign({ "Content-Type": "application/json" }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: "same-origin"
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) ? (data.error || data.message) : (res.status + " " + res.statusText);
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

function fmtDate(iso){
  const d = new Date(iso);
  if (!isFinite(d.getTime())) return String(iso || "");
  return d.toLocaleString();
}

function showLoginError(msg){
  if (!loginError) return;
  loginError.textContent = String(msg || "");
  loginError.hidden = !msg;
}

function showTourismError(msg){
  if (!tourismFormError) return;
  tourismFormError.textContent = String(msg || "");
  tourismFormError.hidden = !msg;
}

function setView(isAdmin){
  if (loginView) loginView.hidden = !!isAdmin;
  if (appView) appView.hidden = !isAdmin;
  if (admLogout) admLogout.hidden = !isAdmin;
}

function setActiveTab(tab){
  currentTab = tab;
  document.querySelectorAll(".adminTab").forEach(b => {
    b.classList.toggle("isOn", b.dataset.tab === tab);
  });

  if (toolbarAds) toolbarAds.hidden = tab !== "ads";
  if (toolbarUsers) toolbarUsers.hidden = tab !== "users";
  if (toolbarLogs) toolbarLogs.hidden = tab !== "logs";
  if (toolbarTourism) toolbarTourism.hidden = tab !== "tourism";
}

function getQuery(){
  return String(admSearch?.value || "").trim();
}

async function checkAdmin(){
  try{
    me = await apiJson("/api/admin/me");
    if (admUser) admUser.textContent = me.identifier ? `${me.identifier} (ID ${me.id})` : `ID ${me.id}`;
    setView(true);
    await refreshCurrent();
  }catch{
    me = null;
    if (admUser) admUser.textContent = "—";
    setView(false);
  }
}

async function doLogin(identifier, password){
  await apiJson("/api/login", {
    method: "POST",
    body: { identifier, password, remember: (loginRemember ? !!loginRemember.checked : true) }
  });
  await checkAdmin();
  if (!me) throw new Error("Вы вошли, но у этого аккаунта нет прав администратора.");
}

async function doLogout(){
  try{ await apiJson("/api/logout", { method: "POST" }); }catch{}
  me = null;
  if (admUser) admUser.textContent = "—";
  showLoginError("");
  setView(false);
}

async function refreshCurrent(){
  if (currentTab === "ads") return refreshAds();
  if (currentTab === "users") return refreshUsers();
  if (currentTab === "logs") return refreshLogs();
  if (currentTab === "tourism") return refreshTourism();
}

function badge(status){
  const s = String(status || "").toLowerCase();
  const map = { active: "Активно", pending: "На модерации", hidden: "Скрыто" };
  return `<span class="badge ${escapeHtml(s)}">${escapeHtml(map[s] || s)}</span>`;
}

/* ===== ADS ===== */
async function refreshAds(){
  const q = getQuery();
  const status = String(adsStatus?.value || "all");
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (q) params.set("q", q);

  if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Загрузка…</div>`;

  const list = await apiJson(`/api/admin/ads?${params.toString()}`);
  if (!Array.isArray(list) || list.length === 0){
    if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Ничего не найдено.</div>`;
    return;
  }

  const rows = list.map(a => {
    const st = String(a.status || (a.active ? "active" : "hidden"));
    const btns = [];

    if (st === "active") btns.push(`<button class="btn" data-act="hide" data-id="${escapeHtml(a.id)}" type="button">Скрыть</button>`);
    else if (st === "hidden") btns.push(`<button class="btn" data-act="activate" data-id="${escapeHtml(a.id)}" type="button">Сделать активным</button>`);
    else if (st === "pending"){
      btns.push(`<button class="btn primary" data-act="approve" data-id="${escapeHtml(a.id)}" type="button">Одобрить</button>`);
      btns.push(`<button class="btn" data-act="hide" data-id="${escapeHtml(a.id)}" type="button">Скрыть</button>`);
    } else {
      btns.push(`<button class="btn" data-act="activate" data-id="${escapeHtml(a.id)}" type="button">Активировать</button>`);
    }

    btns.push(`<button class="btn" data-act="delete" data-id="${escapeHtml(a.id)}" type="button">Удалить</button>`);

    const owner = a.ownerIdentifier ? `${a.ownerIdentifier} (ID ${a.ownerId})` : `ID ${a.ownerId}`;

    return `
      <tr>
        <td><div><b>${escapeHtml(a.id)}</b></div><div style="opacity:.75">${escapeHtml(fmtDate(a.created_at || a.date))}</div></td>
        <td>
          <div><b>${escapeHtml(a.title)}</b></div>
          <div style="opacity:.8">${escapeHtml(a.categoryId)} / ${escapeHtml(a.subcategoryId)}</div>
          <div style="opacity:.8">${escapeHtml(a.phone)} • ${escapeHtml(a.price)} ₽</div>
        </td>
        <td>${escapeHtml(owner)}</td>
        <td>${badge(st)}</td>
        <td class="adminActions">${btns.join(" ")}</td>
      </tr>
    `;
  }).join("");

  if (tableWrap) tableWrap.innerHTML = `
    <table class="adminTable">
      <thead>
        <tr>
          <th>ID / Дата</th>
          <th>Объявление</th>
          <th>Владелец</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  tableWrap.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const act = btn.getAttribute("data-act");
      if (!id || !act) return;

      if (act === "delete"){
        if (!confirm("Удалить объявление навсегда?")) return;
        await apiJson(`/api/admin/ads/${encodeURIComponent(id)}`, { method: "DELETE" });
        return refreshAds();
      }

      if (act === "hide"){
        await apiJson(`/api/admin/ads/${encodeURIComponent(id)}/status`, { method:"POST", body:{ status:"hidden" } });
        return refreshAds();
      }

      if (act === "activate"){
        await apiJson(`/api/admin/ads/${encodeURIComponent(id)}/status`, { method:"POST", body:{ status:"active" } });
        return refreshAds();
      }

      if (act === "approve"){
        await apiJson(`/api/admin/ads/${encodeURIComponent(id)}/status`, { method:"POST", body:{ status:"active" } });
        return refreshAds();
      }
    });
  });
}

/* ===== USERS ===== */
async function refreshUsers(){
  const q = getQuery();
  const params = new URLSearchParams();
  if (q) params.set("q", q);

  if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Загрузка…</div>`;

  const list = await apiJson(`/api/admin/users?${params.toString()}`);
  if (!Array.isArray(list) || list.length === 0){
    if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Ничего не найдено.</div>`;
    return;
  }

  const rows = list.map(u => {
    const flags = [
      u.is_admin ? `<span class="badge active">Админ</span>` : `<span class="badge">Пользователь</span>`,
      u.is_blocked ? `<span class="badge hidden">Заблокирован</span>` : `<span class="badge">Активен</span>`
    ].join(" ");

    const btns = [];
    btns.push(`<button class="btn" data-uact="${u.is_blocked ? "unblock" : "block"}" data-uid="${u.id}" type="button">${u.is_blocked ? "Разблок" : "Блок"}</button>`);
    btns.push(`<button class="btn" data-uact="${u.is_admin ? "demote" : "promote"}" data-uid="${u.id}" type="button">${u.is_admin ? "Снять админа" : "Сделать админом"}</button>`);

    return `
      <tr>
        <td><b>${escapeHtml(u.id)}</b></td>
        <td>
          <div><b>${escapeHtml(u.identifier)}</b></div>
          <div style="opacity:.75">${escapeHtml(fmtDate(u.created_at))}</div>
        </td>
        <td>${escapeHtml(u.ads_count)} шт.</td>
        <td>${flags}</td>
        <td class="adminActions">${btns.join(" ")}</td>
      </tr>
    `;
  }).join("");

  if (tableWrap) tableWrap.innerHTML = `
    <table class="adminTable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Пользователь</th>
          <th>Объявления</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  tableWrap.querySelectorAll("button[data-uact]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const uid = btn.getAttribute("data-uid");
      const act = btn.getAttribute("data-uact");
      if (!uid || !act) return;

      if (act === "block"){
        if (!confirm("Заблокировать пользователя?")) return;
        await apiJson(`/api/admin/users/${uid}/block`, { method:"POST", body:{ blocked:true } });
        return refreshUsers();
      }
      if (act === "unblock"){
        await apiJson(`/api/admin/users/${uid}/block`, { method:"POST", body:{ blocked:false } });
        return refreshUsers();
      }
      if (act === "promote"){
        if (!confirm("Сделать этого пользователя админом?")) return;
        await apiJson(`/api/admin/users/${uid}/admin`, { method:"POST", body:{ is_admin:true } });
        return refreshUsers();
      }
      if (act === "demote"){
        if (!confirm("Снять роль админа у пользователя?")) return;
        await apiJson(`/api/admin/users/${uid}/admin`, { method:"POST", body:{ is_admin:false } });
        return refreshUsers();
      }
    });
  });
}

/* ===== LOGS ===== */
async function refreshLogs(){
  if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Загрузка…</div>`;

  const list = await apiJson(`/api/admin/logs?limit=300`);
  if (!Array.isArray(list) || list.length === 0){
    if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Логов пока нет.</div>`;
    return;
  }

  const rows = list.map(l => {
    let meta = "";
    try{ meta = JSON.stringify(l.meta || {}, null, 0); }catch{ meta = "{}"; }
    return `
      <tr>
        <td><b>#${escapeHtml(l.id)}</b><div style="opacity:.75">${escapeHtml(fmtDate(l.created_at))}</div></td>
        <td>${escapeHtml(l.admin_identifier)} (ID ${escapeHtml(l.admin_id)})</td>
        <td>${escapeHtml(l.action)}</td>
        <td>${escapeHtml(l.target_type)}: <b>${escapeHtml(l.target_id)}</b></td>
        <td><code>${escapeHtml(meta)}</code></td>
      </tr>
    `;
  }).join("");

  if (tableWrap) tableWrap.innerHTML = `
    <table class="adminTable">
      <thead>
        <tr>
          <th>Время</th>
          <th>Админ</th>
          <th>Действие</th>
          <th>Цель</th>
          <th>Детали</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

/* ===== TOURISM ===== */
function tourismBadge(isPublished){
  return isPublished ? '<span class="badge active">Опубликовано</span>' : '<span class="badge pending">Черновик</span>';
}

function openTourismModal(post){
  if (!tourismModal) return;
  editingTourismId = post ? String(post.id || "") : null;
  editingTourismImages = Array.isArray(post?.images) ? post.images.filter(Boolean) : [];

  if (tourismModalTitle) tourismModalTitle.textContent = editingTourismId ? `Публикация #${editingTourismId}` : "Новая публикация";
  if (tourismFormSection) tourismFormSection.value = post ? String(post.section || "mountains") : "mountains";
  if (tourismFormTitle) tourismFormTitle.value = post ? String(post.title || "") : "";
  if (tourismFormBody) tourismFormBody.value = post ? String(post.body || "") : "";
  if (tourismFormPublished) tourismFormPublished.checked = post ? !!post.is_published : true;
  if (tourismFormImages) tourismFormImages.value = "";

  showTourismError("");
  tourismModal.hidden = false;
  document.body.classList.add("lock");
}

function closeTourismModal(){
  if (!tourismModal) return;
  tourismModal.hidden = true;
  document.body.classList.remove("lock");
}

async function refreshTourism(){
  const q = getQuery();
  const section = String(tourismSectionFilter?.value || "all");
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (section && section !== "all") params.set("section", section);

  if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Загрузка…</div>`;

  const list = await apiJson(`/api/admin/tourism/posts?${params.toString()}`);
  if (!Array.isArray(list) || list.length === 0){
    if (tableWrap) tableWrap.innerHTML = `<div class="adminEmpty">Публикаций пока нет. Нажми “Добавить публикацию”.</div>`;
    return;
  }

  const rows = list.map(p => {
    const st = !!p.is_published;
    return `
      <tr>
        <td><div><b>${escapeHtml(p.id)}</b></div><div style="opacity:.75">${escapeHtml(fmtDate(p.updated_at || p.created_at))}</div></td>
        <td><div><b>${escapeHtml(p.title)}</b></div><div style="opacity:.8">Раздел: ${escapeHtml(p.section)}</div></td>
        <td>${tourismBadge(st)}</td>
        <td class="adminActions">
          <button class="btn" data-tact="edit" data-tid="${escapeHtml(p.id)}" type="button">Редактировать</button>
          <button class="btn ${st ? "" : "primary"}" data-tact="toggle" data-tid="${escapeHtml(p.id)}" data-pub="${st ? "1" : "0"}" type="button">${st ? "Снять с публикации" : "Опубликовать"}</button>
          <button class="btn" data-tact="delete" data-tid="${escapeHtml(p.id)}" type="button">Удалить</button>
        </td>
      </tr>
    `;
  }).join("");

  if (tableWrap) tableWrap.innerHTML = `
    <table class="adminTable">
      <thead>
        <tr>
          <th>ID / Дата</th>
          <th>Публикация</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  const byId = new Map(list.map(x => [String(x.id), x]));

  tableWrap.querySelectorAll("button[data-tact]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-tid");
      const act = btn.getAttribute("data-tact");
      if (!id || !act) return;

      if (act === "edit"){
        openTourismModal(byId.get(String(id)) || null);
        return;
      }

      if (act === "delete"){
        if (!confirm("Удалить публикацию навсегда?")) return;
        await apiJson(`/api/admin/tourism/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
        return refreshTourism();
      }

      if (act === "toggle"){
        const pub = btn.getAttribute("data-pub") === "1";
        await apiJson(`/api/admin/tourism/posts/${encodeURIComponent(id)}/publish`, { method: "POST", body: { is_published: !pub } });
        return refreshTourism();
      }
    });
  });
}

async function readFilesAsDataUrls(fileList){
  const files = Array.from(fileList || []);
  const out = [];
  for (const f of files){
    if (!f) continue;
    if (f.size > 3_000_000){
      // 3MB limit per image
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const data = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = () => resolve("");
      r.readAsDataURL(f);
    });
    if (data) out.push(data);
  }
  return out;
}

async function saveTourismPost(){
  showTourismError("");

  const section = String(tourismFormSection?.value || "").trim() || "mountains";
  const title = String(tourismFormTitle?.value || "").trim();
  const body = String(tourismFormBody?.value || "").trim();
  const is_published = !!tourismFormPublished?.checked;

  if (!title){
    showTourismError("Укажи заголовок.");
    return;
  }

  // If user selected new images — append them
  if (tourismFormImages && tourismFormImages.files && tourismFormImages.files.length){
    const newly = await readFilesAsDataUrls(tourismFormImages.files);
    if (newly.length){
      editingTourismImages = [...editingTourismImages, ...newly];
    } else {
      showTourismError("Фото не добавлены (слишком большие или ошибка чтения). Лимит 3MB на фото.");
    }
  }

  const payload = {
    section,
    title,
    body,
    images: editingTourismImages,
    is_published
  };

  if (editingTourismId){
    await apiJson(`/api/admin/tourism/posts/${encodeURIComponent(editingTourismId)}`, { method: "PUT", body: payload });
  } else {
    await apiJson(`/api/admin/tourism/posts`, { method: "POST", body: payload });
  }

  closeTourismModal();
  await refreshTourism();
}

function bindTourismModalEvents(){
  if (!tourismModal) return;

  // backdrop close
  if (!tourismModal.dataset.bound){
    tourismModal.dataset.bound = "1";
    tourismModal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute && e.target.getAttribute("data-close") === "1"){
        closeTourismModal();
      }
    });
  }

  if (btnCloseTourismModal) btnCloseTourismModal.addEventListener("click", closeTourismModal);
  if (btnCancelTourism) btnCancelTourism.addEventListener("click", closeTourismModal);

  if (tourismForm && !tourismForm.dataset.bound){
    tourismForm.dataset.bound = "1";
    tourismForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try{
        await saveTourismPost();
      }catch(err){
        showTourismError(err?.message || "Ошибка сохранения.");
      }
    });
  }
}

/* ===== INIT ===== */
function bindEvents(){
  bindTourismModalEvents();

  // Tabs
  document.querySelectorAll(".adminTab").forEach(b => {
    b.addEventListener("click", async () => {
      setActiveTab(b.dataset.tab);
      await refreshCurrent();
    });
  });

  // Top buttons
  if (btnToSite) btnToSite.addEventListener("click", () => { window.location.href = "/"; });
  if (admLogout) admLogout.addEventListener("click", doLogout);

  // Refresh buttons
  if (btnRefresh) btnRefresh.addEventListener("click", refreshAds);
  if (btnRefreshUsers) btnRefreshUsers.addEventListener("click", refreshUsers);
  if (btnRefreshLogs) btnRefreshLogs.addEventListener("click", refreshLogs);
  if (btnRefreshTourism) btnRefreshTourism.addEventListener("click", refreshTourism);

  // Tourism toolbar
  if (btnAddTourism) btnAddTourism.addEventListener("click", () => openTourismModal(null));
  if (tourismSectionFilter) tourismSectionFilter.addEventListener("change", () => {
    if (currentTab === "tourism") refreshTourism();
  });

  // Search enter
  if (admSearch){
    admSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") refreshCurrent();
    });
  }

  // Login
  if (loginForm){
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoginError("");
      const identifier = String(loginIdentifier?.value || "").trim();
      const password = String(loginPassword?.value || "");
      if (!identifier || !password){
        showLoginError("Введите логин и пароль.");
        return;
      }
      try{
        await doLogin(identifier, password);
      }catch(err){
        showLoginError(err?.message || "Ошибка входа.");
      }
    });
  }
}

bindEvents();
checkAdmin();
