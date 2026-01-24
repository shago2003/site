from __future__ import annotations

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, Optional

from flask import Flask, jsonify, request, send_from_directory, session
from werkzeug.security import check_password_hash, generate_password_hash

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(APP_DIR, "app.db")

app = Flask(
    __name__,
    static_folder=os.path.join(APP_DIR, "static"),
    static_url_path="",
)

# Для локального запуска. В проде поменяй на своё значение.
app.secret_key = os.environ.get("KUSARY_SECRET_KEY", "dev-secret-key-change-me")

# Session settings ("Запомнить меня")
SESSION_DAYS = int(os.environ.get("KUSARY_SESSION_DAYS", "30"))
app.permanent_session_lifetime = timedelta(days=SESSION_DAYS)
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def json_error(msg: str, code: int = 400):
    return jsonify({"error": msg}), code


def safe_str(x: Any, max_len: int = 5000) -> str:
    s = str(x or "").strip()
    if len(s) > max_len:
        s = s[:max_len]
    return s


def norm_identifier(x: str) -> str:
    return (x or "").strip().lower()


def parse_bool(v, default=False) -> bool:
    if v is None:
        return default
    if isinstance(v, bool):
        return v
    s = str(v).strip().lower()
    if s in ("1", "true", "yes", "y", "on"):
        return True
    if s in ("0", "false", "no", "n", "off"):
        return False
    return default


def ensure_column(db: sqlite3.Connection, table: str, col_name: str, col_sql: str) -> None:
    cols = [r["name"] for r in db.execute(f"PRAGMA table_info({table})").fetchall()]
    if col_name not in cols:
        db.execute(f"ALTER TABLE {table} ADD COLUMN {col_sql}")


def init_db() -> None:
    """Создаёт таблицы и делает простые миграции (ADD COLUMN)."""
    with get_db() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                identifier TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        # миграции пользователей
        ensure_column(db, "users", "is_admin", "is_admin INTEGER NOT NULL DEFAULT 0")
        ensure_column(db, "users", "is_blocked", "is_blocked INTEGER NOT NULL DEFAULT 0")

        db.execute(
            """
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ad_id TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                rating INTEGER NOT NULL DEFAULT 0,
                comment TEXT NOT NULL DEFAULT '',
                updated_at TEXT NOT NULL,
                UNIQUE(ad_id, user_id),
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )

        db.execute(
            """
            CREATE TABLE IF NOT EXISTS ads (
                id TEXT PRIMARY KEY,
                owner_id INTEGER NOT NULL,
                active INTEGER NOT NULL DEFAULT 1,
                title TEXT NOT NULL,
                category_id TEXT NOT NULL,
                subcategory_id TEXT NOT NULL,
                phone TEXT NOT NULL,
                price INTEGER NOT NULL DEFAULT 0,
                description TEXT NOT NULL DEFAULT '',
                address TEXT NOT NULL DEFAULT '',
                coords TEXT NOT NULL DEFAULT '',
                photo_data_url TEXT,
                extra_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        # миграции объявлений
        ensure_column(db, "ads", "status", "status TEXT NOT NULL DEFAULT 'active'")

        db.execute(
            """
            CREATE TABLE IF NOT EXISTS admin_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                target_type TEXT NOT NULL,
                target_id TEXT NOT NULL,
                meta_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                FOREIGN KEY(admin_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )



        # ===== TOURISM POSTS (CMS) =====
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS tourism_posts (
                id TEXT PRIMARY KEY,
                section TEXT NOT NULL,
                title TEXT NOT NULL,
                body TEXT NOT NULL DEFAULT '',
                images_json TEXT NOT NULL DEFAULT '[]',
                is_published INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                author_admin_id INTEGER,
                FOREIGN KEY(author_admin_id) REFERENCES users(id) ON DELETE SET NULL
            )
            """
        )
        # миграции туризма
        ensure_column(db, "tourism_posts", "is_published", "is_published INTEGER NOT NULL DEFAULT 0")
        ensure_column(db, "tourism_posts", "images_json", "images_json TEXT NOT NULL DEFAULT '[]'")
        ensure_column(db, "tourism_posts", "updated_at", "updated_at TEXT NOT NULL DEFAULT ''")

        # seed: ShahDag (если ещё нет публикаций)
        try:
            cnt = db.execute("SELECT COUNT(1) AS c FROM tourism_posts").fetchone()["c"]
        except Exception:
            cnt = 0
        if int(cnt or 0) == 0:
            seed_id = "tp_shahdag"
            images = ["./image/shahdag_1.jpg", "./image/shahdag_2.jpg"]
            now = utc_now_iso()
            db.execute(
                "INSERT OR IGNORE INTO tourism_posts(id, section, title, body, images_json, is_published, created_at, updated_at, author_admin_id) VALUES (?, ?, ?, ?, ?, 1, ?, ?, NULL)",
                (
                    seed_id,
                    "mountains",
                    "ШахДаг",
                    "ШахДаг (Şahdağ) — один из самых известных горных районов рядом с Кусарами. Здесь красивые панорамы Большого Кавказа, свежий горный воздух и впечатляющие дороги‑серпантины. Зимой в этих местах держится снег и работает горнолыжная инфраструктура, а летом популярны прогулки, пикники и фототочки.",
                    json.dumps(images, ensure_ascii=False),
                    now,
                    now,
                ),
            )
        ensure_admin_from_env(db)


def ensure_admin_from_env(db: sqlite3.Connection) -> None:
    """Создаёт/обновляет первого админа через переменные окружения.

    KUSARY_ADMIN_IDENTIFIER=admin
    KUSARY_ADMIN_PASSWORD=strongpass
    """
    ident = norm_identifier(os.environ.get("KUSARY_ADMIN_IDENTIFIER", ""))
    pwd = str(os.environ.get("KUSARY_ADMIN_PASSWORD", "")).strip()
    if not ident or not pwd:
        return

    row = db.execute("SELECT id FROM users WHERE identifier = ?", (ident,)).fetchone()
    if row:
        db.execute("UPDATE users SET is_admin = 1 WHERE id = ?", (int(row["id"]),))
        return

    db.execute(
        "INSERT INTO users(identifier, password_hash, created_at, is_admin, is_blocked) VALUES (?, ?, ?, 1, 0)",
        (ident, generate_password_hash(pwd), utc_now_iso()),
    )


def new_ad_id() -> str:
    return "ad_" + uuid.uuid4().hex


def get_user_row(uid: int) -> Optional[sqlite3.Row]:
    with get_db() as db:
        return db.execute(
            "SELECT id, identifier, is_admin, is_blocked, created_at FROM users WHERE id = ?",
            (int(uid),),
        ).fetchone()


def require_user() -> sqlite3.Row:
    uid = session.get("uid")
    if not uid:
        raise PermissionError("not_logged_in")

    row = get_user_row(int(uid))
    if not row:
        session.pop("uid", None)
        raise PermissionError("not_logged_in")

    if int(row["is_blocked"] or 0) == 1:
        raise PermissionError("blocked")
    return row


def require_login() -> int:
    return int(require_user()["id"])


def require_admin() -> sqlite3.Row:
    row = require_user()
    if int(row["is_admin"] or 0) != 1:
        raise PermissionError("not_admin")
    return row


def log_admin_action(
    db: sqlite3.Connection,
    admin_id: int,
    action: str,
    target_type: str,
    target_id: str,
    meta: Optional[Dict[str, Any]] = None,
) -> None:
    try:
        meta_json = json.dumps(meta or {}, ensure_ascii=False)
    except Exception:
        meta_json = "{}"
    db.execute(
        "INSERT INTO admin_logs(admin_id, action, target_type, target_id, meta_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (int(admin_id), str(action), str(target_type), str(target_id), meta_json, utc_now_iso()),
    )


def get_ad_owner(ad_id: str) -> Optional[int]:
    with get_db() as db:
        row = db.execute("SELECT owner_id FROM ads WHERE id = ?", (ad_id,)).fetchone()
    return int(row["owner_id"]) if row else None


def row_to_ad(r: sqlite3.Row) -> Dict[str, Any]:
    # status -> active (для совместимости с фронтом)
    status = (r["status"] or "").strip() if "status" in r.keys() else ""
    if not status:
        status = "active" if int(r["active"] or 0) == 1 else "hidden"
    active = 1 if status == "active" else 0

    try:
        extra = json.loads(r["extra_json"] or "{}")
        if not isinstance(extra, dict):
            extra = {}
    except Exception:
        extra = {}

    return {
        "id": r["id"],
        "ownerId": int(r["owner_id"]),
        "active": active,
        "title": r["title"],
        "categoryId": r["category_id"],
        "subcategoryId": r["subcategory_id"],
        "phone": r["phone"],
        "price": int(r["price"] or 0),
        "desc": r["description"] or "",
        "address": r["address"] or "",
        "coords": r["coords"] or "",
        "date": r["created_at"],
        "photoDataUrl": r["photo_data_url"],
        "extra": extra,
    }



def row_to_tourism_post(r: sqlite3.Row) -> Dict[str, Any]:
    try:
        imgs = json.loads(r["images_json"] or "[]")
        if not isinstance(imgs, list):
            imgs = []
        imgs = [safe_str(x, 2_000_000) for x in imgs if str(x or "").strip()]
    except Exception:
        imgs = []

    return {
        "id": r["id"],
        "section": r["section"],
        "title": r["title"],
        "body": r["body"] or "",
        "images": imgs,
        "is_published": int(r["is_published"] or 0) == 1,
        "created_at": r["created_at"],
        "updated_at": r["updated_at"],
        "author_admin_id": int(r["author_admin_id"]) if r["author_admin_id"] is not None else None,
    }


def row_to_admin_ad(r: sqlite3.Row) -> Dict[str, Any]:
    a = row_to_ad(r)
    a["status"] = (r["status"] or "").strip() if "status" in r.keys() else ("active" if a["active"] == 1 else "hidden")
    a["created_at"] = r["created_at"]
    if "owner_identifier" in r.keys():
        a["ownerIdentifier"] = r["owner_identifier"]
    return a


# Инициализируем базу при импорте, чтобы в WSGI тоже всё работало.
init_db()


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/admin")
@app.route("/admin/")
def admin_page():
    return send_from_directory(app.static_folder, "admin.html")


# --- AUTH API ---
@app.route("/api/register", methods=["POST"])
def api_register():
    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    identifier = norm_identifier(str(payload.get("identifier", "")))
    password = str(payload.get("password", "")).strip()

    if not identifier or not password:
        return json_error("Заполни поля.", 400)
    if len(identifier) < 3:
        return json_error("Слишком короткий логин/e-mail.", 400)
    if len(password) < 4:
        return json_error("Слишком короткий пароль.", 400)

    pwd_hash = generate_password_hash(password)

    try:
        with get_db() as db:
            cur = db.execute(
                "INSERT INTO users(identifier, password_hash, created_at, is_admin, is_blocked) VALUES (?, ?, ?, 0, 0)",
                (identifier, pwd_hash, utc_now_iso()),
            )
            uid = cur.lastrowid
    except sqlite3.IntegrityError:
        return json_error("Этот логин/e-mail уже занят.", 400)

    remember = parse_bool(payload.get("remember"), True)
    session.permanent = bool(remember)
    session["uid"] = int(uid)
    return jsonify({"ok": True, "id": int(uid), "identifier": identifier, "is_admin": False})


@app.route("/api/login", methods=["POST"])
def api_login():
    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    identifier = norm_identifier(str(payload.get("identifier", "")))
    password = str(payload.get("password", "")).strip()

    if not identifier or not password:
        return json_error("Заполни поля.", 400)

    with get_db() as db:
        row = db.execute(
            "SELECT id, identifier, password_hash, is_blocked, is_admin FROM users WHERE identifier = ?",
            (identifier,),
        ).fetchone()

    if not row or not check_password_hash(row["password_hash"], password):
        return json_error("Неверный логин/e-mail или пароль.", 401)

    if int(row["is_blocked"] or 0) == 1:
        return json_error("Аккаунт заблокирован.", 403)

    remember = parse_bool(payload.get("remember"), True)
    session.permanent = bool(remember)
    session["uid"] = int(row["id"])
    return jsonify({"ok": True, "id": int(row["id"]), "identifier": row["identifier"], "is_admin": bool(int(row["is_admin"] or 0))})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("uid", None)
    return jsonify({"ok": True})


@app.route("/api/me", methods=["GET"])
def api_me():
    uid = session.get("uid")
    if not uid:
        return json_error("not_logged_in", 401)

    row = get_user_row(int(uid))
    if not row:
        session.pop("uid", None)
        return json_error("not_logged_in", 401)
    if int(row["is_blocked"] or 0) == 1:
        return json_error("blocked", 403)

    return jsonify(
        {
            "id": int(row["id"]),
            "identifier": row["identifier"],
            "is_admin": bool(int(row["is_admin"] or 0)),
        }
    )


@app.route("/api/health", methods=["GET"])
def api_health():
    """Простой эндпоинт для проверки, что сервер жив и база доступна."""
    try:
        with get_db() as db:
            db.execute("SELECT 1").fetchone()
        db_ok = True
        db_err = ""
    except Exception as e:
        db_ok = False
        db_err = str(e)

    return jsonify(
        {
            "ok": True,
            "time": utc_now_iso(),
            "db_ok": db_ok,
            "db_path": DB_PATH,
            "db_error": db_err,
        }
    )


# --- ADS API (публичный список: только active) ---
@app.route("/api/ads", methods=["GET"])
def api_ads_list():
    cat = safe_str(request.args.get("categoryId"))
    sub = safe_str(request.args.get("subcategoryId"))
    q = safe_str(request.args.get("q"), max_len=200).lower()

    sql = "SELECT * FROM ads"
    where = ["status = 'active'"]
    params: list[Any] = []
    if cat:
        where.append("category_id = ?")
        params.append(cat)
    if sub:
        where.append("subcategory_id = ?")
        params.append(sub)
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY created_at DESC"

    with get_db() as db:
        rows = db.execute(sql, tuple(params)).fetchall()

    ads = [row_to_ad(r) for r in rows]

    if q:
        # лёгкий поиск на стороне сервера
        def hay(a: Dict[str, Any]) -> str:
            extra = a.get("extra")
            extra_s = ""
            try:
                extra_s = json.dumps(extra, ensure_ascii=False)
            except Exception:
                extra_s = ""
            return " ".join(
                [
                    str(a.get("title") or ""),
                    str(a.get("desc") or ""),
                    str(a.get("address") or ""),
                    str(a.get("categoryId") or ""),
                    str(a.get("subcategoryId") or ""),
                    extra_s,
                ]
            ).lower()

        ads = [a for a in ads if q in hay(a)]

    return jsonify(ads)


@app.route("/api/my/ads", methods=["GET"])
def api_my_ads():
    try:
        u = require_user()
    except PermissionError as e:
        return json_error("Нужно войти в аккаунт.", 401 if str(e) == "not_logged_in" else 403)

    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM ads WHERE owner_id = ? ORDER BY created_at DESC",
            (int(u["id"]),),
        ).fetchall()
    out = []
    for r in rows:
        a = row_to_ad(r)
        # добавим status для профиля
        a["status"] = (r["status"] or "").strip() if "status" in r.keys() else ("active" if a["active"] == 1 else "hidden")
        out.append(a)
    return jsonify(out)


@app.route("/api/ads", methods=["POST"])
def api_ads_create():
    try:
        u = require_user()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("Нужно войти в аккаунт.", 401)
        return json_error("Доступ запрещён.", 403)

    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}

    title = safe_str(payload.get("title"), 120)
    category_id = safe_str(payload.get("categoryId"), 60)
    subcategory_id = safe_str(payload.get("subcategoryId"), 60)
    phone = safe_str(payload.get("phone"), 40)
    description = safe_str(payload.get("desc"), 2000)
    address = safe_str(payload.get("address"), 200)
    coords = safe_str(payload.get("coords"), 80)
    photo_data_url = safe_str(payload.get("photoDataUrl"), 4_000_000) or None

    try:
        price = int(payload.get("price", 0) or 0)
    except Exception:
        price = 0
    if price < 0:
        price = 0

    if not title:
        return json_error("Заполни название.", 400)
    if not category_id or not subcategory_id:
        return json_error("Выбери категорию.", 400)
    if not phone:
        return json_error("Заполни телефон.", 400)

    extra = payload.get("extra")
    if not isinstance(extra, dict):
        extra = {}
    extra_json = json.dumps(extra, ensure_ascii=False)

    premod = str(os.environ.get("KUSARY_PREMODERATION", "0")).strip().lower() in ("1", "true", "yes")
    status = "pending" if premod else "active"
    active = 1 if status == "active" else 0

    ad_id = new_ad_id()
    now = utc_now_iso()

    with get_db() as db:
        db.execute(
            """
            INSERT INTO ads(
                id, owner_id, active, status, title, category_id, subcategory_id, phone, price,
                description, address, coords, photo_data_url, extra_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                ad_id,
                int(u["id"]),
                int(active),
                status,
                title,
                category_id,
                subcategory_id,
                phone,
                price,
                description,
                address,
                coords,
                photo_data_url,
                extra_json,
                now,
            ),
        )
        row = db.execute("SELECT * FROM ads WHERE id = ?", (ad_id,)).fetchone()

    return jsonify({"ok": True, "ad": row_to_ad(row)})


@app.route("/api/ads/<ad_id>", methods=["GET"])
def api_ads_get(ad_id: str):
    ad_id = safe_str(ad_id, 120)
    if not ad_id:
        return json_error("not_found", 404)

    with get_db() as db:
        row = db.execute("SELECT * FROM ads WHERE id = ?", (ad_id,)).fetchone()
    if not row:
        return json_error("not_found", 404)

    status = (row["status"] or "").strip() if "status" in row.keys() else ("active" if int(row["active"] or 0) == 1 else "hidden")
    if status != "active":
        # скрытые/на модерации видит только владелец или админ
        try:
            u = require_user()
        except PermissionError:
            return json_error("not_found", 404)
        if int(u["is_admin"] or 0) != 1 and int(row["owner_id"]) != int(u["id"]):
            return json_error("not_found", 404)

    return jsonify(row_to_ad(row))


@app.route("/api/ads/<ad_id>", methods=["DELETE"])
def api_ads_delete(ad_id: str):
    try:
        u = require_user()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("Нужно войти в аккаунт.", 401)
        return json_error("Доступ запрещён.", 403)

    ad_id = safe_str(ad_id, 120)
    owner = get_ad_owner(ad_id)
    if owner is None:
        return json_error("not_found", 404)

    is_admin = int(u["is_admin"] or 0) == 1
    if (not is_admin) and int(owner) != int(u["id"]):
        return json_error("Нельзя удалить чужое объявление.", 403)

    with get_db() as db:
        db.execute("DELETE FROM ads WHERE id = ?", (ad_id,))
        db.execute("DELETE FROM reviews WHERE ad_id = ?", (ad_id,))
        if is_admin:
            log_admin_action(db, int(u["id"]), "delete", "ad", ad_id)
    return jsonify({"ok": True})


# --- REVIEWS API ---
@app.route("/api/ads/<ad_id>/reviews", methods=["GET"])
def api_reviews(ad_id: str):
    ad_id = str(ad_id or "").strip()
    if not ad_id:
        return jsonify([])

    with get_db() as db:
        rows = db.execute(
            "SELECT user_id, rating, comment, updated_at FROM reviews WHERE ad_id = ? ORDER BY updated_at DESC",
            (ad_id,),
        ).fetchall()

    out = []
    for r in rows:
        out.append(
            {
                "user_id": int(r["user_id"]),
                "rating": int(r["rating"]),
                "comment": r["comment"] or "",
                "updated_at": r["updated_at"],
            }
        )
    return jsonify(out)


@app.route("/api/ads/<ad_id>/review", methods=["POST"])
def api_review_upsert(ad_id: str):
    try:
        uid = require_login()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("Нужно войти в аккаунт.", 401)
        return json_error("Доступ запрещён.", 403)

    ad_id = str(ad_id or "").strip()
    owner = get_ad_owner(ad_id)
    if owner is None:
        return json_error("Объявление не найдено.", 404)
    if int(owner) == int(uid):
        return json_error("Нельзя оставлять комментарии и оценки на своё объявление.", 403)

    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    rating = payload.get("rating", 0)
    comment = str(payload.get("comment", "")).strip()

    try:
        rating_int = int(rating)
    except Exception:
        rating_int = 0

    if rating_int < 0 or rating_int > 5:
        return json_error("Оценка должна быть от 0 до 5.", 400)
    if len(comment) > 1200:
        return json_error("Комментарий слишком длинный.", 400)
    if rating_int == 0 and not comment:
        return json_error("Напиши комментарий или поставь оценку.", 400)

    now = utc_now_iso()

    with get_db() as db:
        exists = db.execute(
            "SELECT 1 FROM reviews WHERE ad_id = ? AND user_id = ?",
            (ad_id, uid),
        ).fetchone()
        if exists:
            return json_error("Ты уже оставил комментарий и оценку.", 409)

        db.execute(
            "INSERT INTO reviews(ad_id, user_id, rating, comment, updated_at) VALUES (?, ?, ?, ?, ?)",
            (ad_id, uid, rating_int, comment, now),
        )

    return jsonify({"ok": True})


# --- ADMIN API ---
@app.route("/api/admin/me", methods=["GET"])
def api_admin_me():
    try:
        a = require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    return jsonify(
        {
            "id": int(a["id"]),
            "identifier": a["identifier"],
        }
    )


@app.route("/api/admin/ads", methods=["GET"])
def api_admin_ads_list():
    try:
        require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    status = safe_str(request.args.get("status"), 20).lower() or "all"
    q = safe_str(request.args.get("q"), 200).lower()

    where = []
    params: list[Any] = []
    if status in ("active", "pending", "hidden"):
        where.append("a.status = ?")
        params.append(status)

    sql = """
        SELECT a.*, u.identifier AS owner_identifier
        FROM ads a
        JOIN users u ON u.id = a.owner_id
    """
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY a.created_at DESC"

    with get_db() as db:
        rows = db.execute(sql, tuple(params)).fetchall()

    out = [row_to_admin_ad(r) for r in rows]
    if q:
        def hay(a: Dict[str, Any]) -> str:
            return " ".join(
                [
                    str(a.get("id") or ""),
                    str(a.get("title") or ""),
                    str(a.get("desc") or ""),
                    str(a.get("address") or ""),
                    str(a.get("phone") or ""),
                    str(a.get("categoryId") or ""),
                    str(a.get("subcategoryId") or ""),
                    str(a.get("ownerIdentifier") or ""),
                    json.dumps(a.get("extra") or {}, ensure_ascii=False),
                ]
            ).lower()
        out = [a for a in out if q in hay(a)]

    return jsonify(out)


@app.route("/api/admin/ads/<ad_id>/status", methods=["POST"])
def api_admin_ads_status(ad_id: str):
    try:
        admin = require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    ad_id = safe_str(ad_id, 120)
    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    status = safe_str(payload.get("status"), 20).lower()
    if status not in ("active", "pending", "hidden"):
        return json_error("Неверный статус.", 400)

    active = 1 if status == "active" else 0

    with get_db() as db:
        row = db.execute("SELECT id, status FROM ads WHERE id = ?", (ad_id,)).fetchone()
        if not row:
            return json_error("not_found", 404)
        prev = row["status"]
        db.execute("UPDATE ads SET status = ?, active = ? WHERE id = ?", (status, int(active), ad_id))
        log_admin_action(
            db,
            int(admin["id"]),
            "set_status",
            "ad",
            ad_id,
            {"from": prev, "to": status},
        )
    return jsonify({"ok": True})


@app.route("/api/admin/ads/<ad_id>", methods=["DELETE"])
def api_admin_ads_delete(ad_id: str):
    try:
        admin = require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    ad_id = safe_str(ad_id, 120)
    with get_db() as db:
        row = db.execute("SELECT id FROM ads WHERE id = ?", (ad_id,)).fetchone()
        if not row:
            return json_error("not_found", 404)
        db.execute("DELETE FROM ads WHERE id = ?", (ad_id,))
        db.execute("DELETE FROM reviews WHERE ad_id = ?", (ad_id,))
        log_admin_action(db, int(admin["id"]), "delete", "ad", ad_id)
    return jsonify({"ok": True})


@app.route("/api/admin/users", methods=["GET"])
def api_admin_users_list():
    try:
        require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    q = safe_str(request.args.get("q"), 200).lower()

    sql = """
        SELECT
            u.id,
            u.identifier,
            u.created_at,
            u.is_admin,
            u.is_blocked,
            COUNT(a.id) AS ads_count
        FROM users u
        LEFT JOIN ads a ON a.owner_id = u.id
    """
    where = []
    params: list[Any] = []
    if q:
        where.append("LOWER(u.identifier) LIKE ? OR CAST(u.id AS TEXT) = ?")
        params.append(f"%{q}%")
        params.append(q)
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " GROUP BY u.id ORDER BY u.id DESC"

    with get_db() as db:
        rows = db.execute(sql, tuple(params)).fetchall()

    out = []
    for r in rows:
        out.append(
            {
                "id": int(r["id"]),
                "identifier": r["identifier"],
                "created_at": r["created_at"],
                "is_admin": bool(int(r["is_admin"] or 0)),
                "is_blocked": bool(int(r["is_blocked"] or 0)),
                "ads_count": int(r["ads_count"] or 0),
            }
        )
    return jsonify(out)


@app.route("/api/admin/users/<int:user_id>/block", methods=["POST"])
def api_admin_user_block(user_id: int):
    try:
        admin = require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    if int(user_id) == int(admin["id"]):
        return json_error("Нельзя блокировать самого себя.", 400)

    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    blocked = 1 if bool(payload.get("blocked", False)) else 0

    with get_db() as db:
        row = db.execute("SELECT id, is_blocked FROM users WHERE id = ?", (int(user_id),)).fetchone()
        if not row:
            return json_error("not_found", 404)
        prev = int(row["is_blocked"] or 0)
        db.execute("UPDATE users SET is_blocked = ? WHERE id = ?", (blocked, int(user_id)))
        log_admin_action(db, int(admin["id"]), "set_block", "user", str(user_id), {"from": prev, "to": blocked})

    return jsonify({"ok": True})


@app.route("/api/admin/users/<int:user_id>/admin", methods=["POST"])
def api_admin_user_admin(user_id: int):
    try:
        admin = require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    if int(user_id) == int(admin["id"]):
        return json_error("Нельзя менять роль админа самому себе через панель.", 400)

    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    is_admin_new = 1 if bool(payload.get("is_admin", False)) else 0

    with get_db() as db:
        row = db.execute("SELECT id, is_admin FROM users WHERE id = ?", (int(user_id),)).fetchone()
        if not row:
            return json_error("not_found", 404)
        prev = int(row["is_admin"] or 0)

        if prev == 1 and is_admin_new == 0:
            cnt = db.execute("SELECT COUNT(*) AS c FROM users WHERE is_admin = 1").fetchone()
            if int(cnt["c"] or 0) <= 1:
                return json_error("Нельзя убрать роль у последнего админа.", 400)

        db.execute("UPDATE users SET is_admin = ? WHERE id = ?", (is_admin_new, int(user_id)))
        log_admin_action(db, int(admin["id"]), "set_admin", "user", str(user_id), {"from": prev, "to": is_admin_new})

    return jsonify({"ok": True})


@app.route("/api/admin/logs", methods=["GET"])
def api_admin_logs():
    try:
        require_admin()
    except PermissionError as e:
        if str(e) == "not_logged_in":
            return json_error("not_logged_in", 401)
        return json_error("not_admin", 403)

    try:
        limit = int(request.args.get("limit", 200) or 200)
    except Exception:
        limit = 200
    if limit < 1:
        limit = 1
    if limit > 500:
        limit = 500

    with get_db() as db:
        rows = db.execute(
            """
            SELECT l.id, l.admin_id, u.identifier AS admin_identifier, l.action, l.target_type, l.target_id, l.meta_json, l.created_at
            FROM admin_logs l
            JOIN users u ON u.id = l.admin_id
            ORDER BY l.id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    out = []
    for r in rows:
        try:
            meta = json.loads(r["meta_json"] or "{}")
        except Exception:
            meta = {}
        out.append(
            {
                "id": int(r["id"]),
                "admin_id": int(r["admin_id"]),
                "admin_identifier": r["admin_identifier"],
                "action": r["action"],
                "target_type": r["target_type"],
                "target_id": r["target_id"],
                "meta": meta,
                "created_at": r["created_at"],
            }
        )
    return jsonify(out)


@app.route("/favicon.ico")
def favicon():
    # если файла нет — не ломаем страницу
    try:
        return send_from_directory(app.static_folder, "favicon.ico")
    except Exception:
        return ("", 204)




# ===== TOURISM PUBLIC API =====
@app.get("/api/tourism/posts")
def api_tourism_posts_list():
    section = safe_str(request.args.get("section", ""), 40)
    limit = int(request.args.get("limit", "50") or 50)
    if limit < 1:
        limit = 1
    if limit > 200:
        limit = 200

    with get_db() as db:
        if section:
            rows = db.execute(
                "SELECT * FROM tourism_posts WHERE is_published = 1 AND section = ? ORDER BY created_at DESC LIMIT ?",
                (section, limit),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT * FROM tourism_posts WHERE is_published = 1 ORDER BY created_at DESC LIMIT ?",
                (limit,),
            ).fetchall()

    return jsonify([row_to_tourism_post(r) for r in rows])


@app.get("/api/tourism/posts/<post_id>")
def api_tourism_post_one(post_id: str):
    pid = safe_str(post_id, 80)
    with get_db() as db:
        r = db.execute("SELECT * FROM tourism_posts WHERE id = ? AND is_published = 1", (pid,)).fetchone()
    if not r:
        return json_error("not_found", 404)
    return jsonify(row_to_tourism_post(r))


# ===== TOURISM ADMIN API =====
@app.get("/api/admin/tourism/posts")
def api_admin_tourism_posts_list():
    require_admin()
    section = safe_str(request.args.get("section", ""), 40)
    q = safe_str(request.args.get("q", ""), 200)
    limit = int(request.args.get("limit", "200") or 200)
    if limit < 1:
        limit = 1
    if limit > 500:
        limit = 500

    where = []
    params = []
    if section:
        where.append("section = ?")
        params.append(section)
    if q:
        where.append("(title LIKE ? OR body LIKE ? OR id LIKE ?)")
        like = f"%{q}%"
        params.extend([like, like, like])

    sql = "SELECT * FROM tourism_posts"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    with get_db() as db:
        rows = db.execute(sql, tuple(params)).fetchall()

    return jsonify([row_to_tourism_post(r) for r in rows])


@app.post("/api/admin/tourism/posts")
def api_admin_tourism_post_create():
    admin = require_admin()
    data = request.get_json(silent=True) or {}

    section = safe_str(data.get("section", ""), 40)
    title = safe_str(data.get("title", ""), 200)
    body = safe_str(data.get("body", ""), 20000)
    images = data.get("images", [])
    is_published = parse_bool(data.get("is_published"), False)

    if section not in ("mountains", "parks", "sights", "restaurants", "hotels", "relax"):
        return json_error("bad_section")
    if not title:
        return json_error("title_required")

    if not isinstance(images, list):
        images = []
    images = [safe_str(x, 2_000_000) for x in images if str(x or "").strip()]
    if len(images) > 10:
        images = images[:10]

    pid = "tp_" + uuid.uuid4().hex
    now = utc_now_iso()

    with get_db() as db:
        db.execute(
            "INSERT INTO tourism_posts(id, section, title, body, images_json, is_published, created_at, updated_at, author_admin_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                pid,
                section,
                title,
                body,
                json.dumps(images, ensure_ascii=False),
                1 if is_published else 0,
                now,
                now,
                int(admin["id"]),
            ),
        )
        log_admin_action(db, int(admin["id"]), "create", "tourism_post", pid, {"section": section, "published": is_published})

    return jsonify({"ok": True, "id": pid})


@app.put("/api/admin/tourism/posts/<post_id>")
def api_admin_tourism_post_update(post_id: str):
    admin = require_admin()
    pid = safe_str(post_id, 80)
    data = request.get_json(silent=True) or {}

    section = safe_str(data.get("section", ""), 40)
    title = safe_str(data.get("title", ""), 200)
    body = safe_str(data.get("body", ""), 20000)
    images = data.get("images", None)
    is_published = data.get("is_published", None)

    updates = []
    params = []

    if section:
        if section not in ("mountains", "parks", "sights", "restaurants", "hotels", "relax"):
            return json_error("bad_section")
        updates.append("section = ?")
        params.append(section)

    if title:
        updates.append("title = ?")
        params.append(title)

    if body is not None:
        updates.append("body = ?")
        params.append(body)

    if images is not None:
        if not isinstance(images, list):
            images = []
        images = [safe_str(x, 2_000_000) for x in images if str(x or "").strip()]
        if len(images) > 10:
            images = images[:10]
        updates.append("images_json = ?")
        params.append(json.dumps(images, ensure_ascii=False))

    if is_published is not None:
        pub = parse_bool(is_published, False)
        updates.append("is_published = ?")
        params.append(1 if pub else 0)

    if not updates:
        return json_error("no_changes")

    updates.append("updated_at = ?")
    params.append(utc_now_iso())

    params.append(pid)

    with get_db() as db:
        r = db.execute("SELECT id FROM tourism_posts WHERE id = ?", (pid,)).fetchone()
        if not r:
            return json_error("not_found", 404)
        db.execute(f"UPDATE tourism_posts SET {', '.join(updates)} WHERE id = ?", tuple(params))
        log_admin_action(db, int(admin["id"]), "update", "tourism_post", pid, {"fields": [u.split('=')[0].strip() for u in updates]})

    return jsonify({"ok": True})


@app.post("/api/admin/tourism/posts/<post_id>/publish")
def api_admin_tourism_post_publish(post_id: str):
    admin = require_admin()
    pid = safe_str(post_id, 80)
    data = request.get_json(silent=True) or {}
    pub = parse_bool(data.get("is_published"), True)

    with get_db() as db:
        r = db.execute("SELECT id FROM tourism_posts WHERE id = ?", (pid,)).fetchone()
        if not r:
            return json_error("not_found", 404)
        db.execute(
            "UPDATE tourism_posts SET is_published = ?, updated_at = ? WHERE id = ?",
            (1 if pub else 0, utc_now_iso(), pid),
        )
        log_admin_action(db, int(admin["id"]), "publish" if pub else "unpublish", "tourism_post", pid, {})

    return jsonify({"ok": True})


@app.delete("/api/admin/tourism/posts/<post_id>")
def api_admin_tourism_post_delete(post_id: str):
    admin = require_admin()
    pid = safe_str(post_id, 80)

    with get_db() as db:
        r = db.execute("SELECT id, section FROM tourism_posts WHERE id = ?", (pid,)).fetchone()
        if not r:
            return json_error("not_found", 404)
        db.execute("DELETE FROM tourism_posts WHERE id = ?", (pid,))
        log_admin_action(db, int(admin["id"]), "delete", "tourism_post", pid, {"section": r["section"]})

    return jsonify({"ok": True})


if __name__ == "__main__":
    # init_db() уже вызывается при импорте, но оставим ещё раз — не страшно
    init_db()

    host = os.environ.get("KUSARY_HOST", "127.0.0.1").strip() or "127.0.0.1"
    try:
        port = int(os.environ.get("KUSARY_PORT", "5000").strip() or "5000")
    except Exception:
        port = 5000

    debug = str(os.environ.get("KUSARY_DEBUG", "1")).strip().lower() in ("1", "true", "yes")

    print("=" * 60)
    print("Kusary Services server starting…")
    print(f"DB:   {DB_PATH}")
    print(f"URL:  http://{host}:{port}")
    print(f"API:  http://{host}:{port}/api/health")
    print("=" * 60)

    app.run(host=host, port=port, debug=debug)
