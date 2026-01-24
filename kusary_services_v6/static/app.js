const LS_KEY = "kusary_ads_v2";
const LS_LANG = "kusary_lang_v1";
const LS_FAV = "kusary_favorites_v1";
const LS_CAT_STATS = "kusary_cat_stats_v1";
const LS_FILTERS = "kusary_filters_v1";

// Safe LocalStorage (не ломаемся, если сайт открыт как file:// или storage запрещён)
let __LS_OK = true;
function lsGet(key){
  try{ return window.localStorage.getItem(key); }catch(e){ __LS_OK = false; return null; }
}
function lsSet(key, val){
  try{ window.localStorage.setItem(key, val); }catch(e){ __LS_OK = false; }
}
function lsRemove(key){
  try{ window.localStorage.removeItem(key); }catch(e){ __LS_OK = false; }
}
function isFileOrigin(){
  try{ return window.location && window.location.protocol === "file:"; }catch{ return false; }
}

function showSystemBanner(msg){
  try{
    let el = document.getElementById("sysBanner");
    if (!el){
      el = document.createElement("div");
      el.id = "sysBanner";
      el.className = "sysBanner";
      document.body.prepend(el);
    }
    el.textContent = String(msg || "");
    el.hidden = !msg;
  }catch{}
}


const DEFAULT_FILTERS = {
  categoryId: "",
  subcategoryId: "",

  // цена/зарплата
  priceMin: "",
  priceMax: "",

  // авто
  carMake: "",
  carModel: "",
  carEngine: "",
  carTransmission: "",
  carFuelSystem: "",
  carCondition: "",

  // недвижимость
  realtyRooms: "",
  realtyHectareMin: "",

  // электроника
  elecBrand: ""
};

const LANG_ORDER = ["ru", "az", "en", "ar"];

const I18N = {
  ru: {
    brandTitle: "Кусары Услуги",
    brandChip: "Кусары",

    menuHome: "Главная",
    menuCreate: "Разместить",
    menuFavorites: "Избранные",
    menuClear: "Очистить объявления",
    menuLangPrefix: "Язык",

    navSearch: "Поиск",

    sectionCats: "Категории",
    btnShowAll: "Показать все",
    btnHide: "Скрыть",
    allCatsTitle: "Все категории",

    adsNew: "Новые объявления",
    adsRecs: "Рекомендации",
    adsFav: "Избранные",
    adsAd: "Объявление",

    searchBtn: "Найти",
    filterBtn: "Фильтр",
    filterTitle: "Фильтр",

    tourismPopularTitle: "Популярные места",
    tourismMountains: "Горы",
    tourismParks: "Парки",
    tourismSights: "Достопримечательности",
    tourismRestaurants: "Рестораны",
    tourismHotels: "Отели",
    tourismRelax: "Места для отдыха",
    tourismOpenMap: "Показать на карте",
    tourismCoords: "Координаты: скоро добавим",

    filterCategory: "Категория",
    filterSubcategory: "Подкатегория",
    filterAny: "Любая",
    filterPriceMin: "Цена от",
    filterPriceMax: "Цена до",
    filterApply: "Применить",
    filterReset: "Сбросить",
    filterErrPrice: "Минимальная цена не может быть больше максимальной.",
    filterCategoryHint: "Выбери категорию — появятся специальные фильтры.",
    filterSubHint: "Подкатегория необязательна.",

    carMake: "Марка",
    carModel: "Модель",
    carModelHint: "Сначала выбери марку.",
    carEngine: "Двигатель (л)",
    carTransmission: "Коробка",
    carFuelSystem: "Питание",
    carCondition: "Состояние",

    trManual: "МКПП",
    trAuto: "АКПП",
    trCvt: "Вариатор",
    trRobot: "Робот",

    fuelInjector: "Инжектор",
    fuelCarb: "Карбюратор",

    condNew: "Новый",
    condUsed: "Б/У",

// Недвижимость
realtyRooms: "Комнаты",
realtyHectareMin: "Гектар (мин)",

// Работа
filterSalaryMin: "Зарплата от",
filterSalaryMax: "Зарплата до",
lblSalary: "Зарплата (только цифры)",
phSalary: "Например: 800",

// Электроника
elecBrand: "Бренд",

    searchPh: "Поиск: квартира, работа, телефон…",
    createBtn: "Разместить",

    modalTitle: "Разместить объявление",
    lblTitle: "Заголовок",
    phTitle: "Например: Продам дом",
    lblCategory: "Категория",
    lblSubcategory: "Подкатегория",
    lblPhone: "Номер телефона",
    phPhone: "501234567",
    lblPrice: "Цена (только цифры)",
    phPrice: "Например: 1500000",
    lblDesc: "Описание",
    phDesc: "Опишите товар/услугу",
    lblAddress: "Адрес (для кнопки «На карте»)",
    phAddress: "Например: Кусары, ул. ... дом ...",
    lblLocation: "Местоположение",
    phLocation: "Нажми «Показать на карте»",
    locHint: "Нажми на карту, чтобы выбрать точку. Координаты подставятся автоматически.",
    pickMapBtn: "Показать на карте",

    mapModalTitle: "Выбрать место",
    mapHint: "Нажми на карту, чтобы выбрать точку",
    myLocationBtn: "Моё место",
    mapUseBtn: "Использовать",
    mapCancelBtn: "Отмена",

    lblPhoto: "Фото",
    cancel: "Отмена",
    publish: "Опубликовать",

    emptyTitle: "Пока нет объявлений. Нажмите “Разместить” и добавьте первое!",
    emptySub: "Можно добавить фото — оно сохранится в браузере.",
    emptyRecTitleStart: "Пока нет рекомендаций в категории “",
    emptyRecTitleEnd: "”.",
    emptyRecSub: "Размести объявление — и оно появится здесь в своей подкатегории.",
    emptyFavTitle: "Пока пусто. Добавь объявления в избранные — и они появятся здесь.",

    mapBtn: "Показать на карте",
    callBtn: "Позвонить",
    waBtn: "WhatsApp",
    favAdd: "В избранные",
    favRemove: "В избранном",
    photoFallback: "Фото",
    badgeRecs: "Рекомендации",

    alertPriceDigits: "Цена должна быть только цифрами.",
    alertPhone: "Укажи номер телефона (минимум 7 цифр).",
    alertNoMap: "Не удалось открыть карту: укажи адрес или выбери точку на карте.",
    alertNoSubcat: "Пока нет объявлений в этой подкатегории.",
    alertPickPoint: "Сначала выбери точку на карте.",

    footnote: "Объявления и фото — в браузере (LocalStorage). Аккаунты/комментарии/оценки — в базе данных (SQLite) рядом с сервером.",

    langTitle: "Язык"
    ,
    authBtn: "Войти",
    authTitle: "Войти / Регистрация",
    authIdLabel: "E-mail или логин",
    authPwLabel: "Пароль",
    authRemember: "Запомнить меня",
    authRegisterBtn: "Регистрация",
    authLoginBtn: "Войти",
    authNote: "Смотреть объявления можно без регистрации.",
    menuProfile: "Профиль",
    menuLogin: "Войти / Регистрация",
    menuLogout: "Выйти",
    reviewsTitle: "Отзывы",
    yourReview: "Ваш комментарий и оценка",
    reviewPlaceholder: "Напишите комментарий…",
    reviewSend: "Отправить",
    reviewUpdate: "Сохранить",
    reviewLockedTitle: "Ваш отзыв",
    reviewLockedNote: "Отзыв уже отправлен. Изменять нельзя.",
    reviewNeedLogin: "Чтобы поставить оценку или написать комментарий — войдите.",
    ratingZero: "Без оценки",
    ratingWord: "Рейтинг"

  },

  az: {
    brandTitle: "Qusar Xidmətləri",
    brandChip: "Qusar",

    menuHome: "Ana səhifə",
    menuCreate: "Elan yerləşdir",
    menuFavorites: "Seçilmişlər",
    menuClear: "Elanları təmizlə",
    menuLangPrefix: "Dil",

    navSearch: "Axtarış",

    sectionCats: "Kateqoriyalar",
    btnShowAll: "Hamısını göstər",
    btnHide: "Gizlət",
    allCatsTitle: "Bütün kateqoriyalar",

    adsNew: "Yeni elanlar",
    adsRecs: "Tövsiyələr",
    adsFav: "Seçilmişlər",
    adsAd: "Elan",

    searchBtn: "Axtar",
    filterBtn: "Filtr",
    filterTitle: "Filtr",

    tourismPopularTitle: "Populyar Məkanlar",
    tourismMountains: "Dağlar",
    tourismParks: "Parklar",
    tourismSights: "Görməli yerlər",
    tourismRestaurants: "Restoranlar",
    tourismHotels: "Otellər",
    tourismRelax: "İstirahət yerləri",
    tourismOpenMap: "Xəritədə göstər",
    tourismCoords: "Koordinatlar: sonra əlavə olunacaq",

    filterCategory: "Kateqoriya",
    filterSubcategory: "Alt kateqoriya",
    filterAny: "İstənilən",
    filterPriceMin: "Qiymət min",
    filterPriceMax: "Qiymət max",
    filterApply: "Tətbiq et",
    filterReset: "Sıfırla",
    filterErrPrice: "Minimum qiymət maksimumdan böyük ola bilməz.",
    filterCategoryHint: "Kateqoriya seç — xüsusi filtrlər görünəcək.",
    filterSubHint: "Alt kateqoriya məcburi deyil.",

    carMake: "Marka",
    carModel: "Model",
    carModelHint: "Əvvəlcə marka seç.",
    carEngine: "Mühərrik (l)",
    carTransmission: "Sürətlər qutusu",
    carFuelSystem: "Yanacaq sistemi",
    carCondition: "Vəziyyət",

    trManual: "Mexaniki",
    trAuto: "Avtomat",
    trCvt: "Variator",
    trRobot: "Robot",

    fuelInjector: "İnjektor",
    fuelCarb: "Karbürator",

    condNew: "Yeni",
    condUsed: "İşlənmiş",

// Daşınmaz əmlak
realtyRooms: "Otaqlar",
realtyHectareMin: "Hektar (min)",

// İş
filterSalaryMin: "Maaş min",
filterSalaryMax: "Maaş max",
lblSalary: "Maaş (yalnız rəqəmlər)",
phSalary: "Məsələn: 800",

// Elektronika
elecBrand: "Brend",

    searchPh: "Axtarış: mənzil, iş, telefon…",
    createBtn: "Elan yerləşdir",

    modalTitle: "Elan yerləşdir",
    lblTitle: "Başlıq",
    phTitle: "Məsələn: Ev satıram",
    lblCategory: "Kateqoriya",
    lblSubcategory: "Alt kateqoriya",
    lblPhone: "Telefon nömrəsi",
    phPhone: "501234567",
    lblPrice: "Qiymət (yalnız rəqəmlər)",
    phPrice: "Məsələn: 1500000",
    lblDesc: "Təsvir",
    phDesc: "Məhsulu/xidməti təsvir edin",
    lblAddress: "Ünvan (xəritə üçün)",
    phAddress: "Məsələn: Qusar, küçə ... ev ...",
    lblLocation: "Məkan",
    phLocation: "“Xəritədə göstər” düyməsinə bas",
    locHint: "Xəritədə nöqtə seçin — koordinatlar avtomatik yazılacaq.",
    pickMapBtn: "Xəritədə göstər",

    mapModalTitle: "Məkanı seç",
    mapHint: "Nöqtə seçmək üçün xəritəyə toxun",
    myLocationBtn: "Mənim yerim",
    mapUseBtn: "İstifadə et",
    mapCancelBtn: "Ləğv et",

    lblPhoto: "Şəkil",
    cancel: "Ləğv et",
    publish: "Dərc et",

    emptyTitle: "Hələ elan yoxdur. “Elan yerləşdir” düyməsinə basın və ilk elanı əlavə edin!",
    emptySub: "Şəkil əlavə etmək olar — brauzerdə saxlanacaq.",
    emptyRecTitleStart: "Bu kateqoriyada hələ tövsiyə yoxdur: “",
    emptyRecTitleEnd: "”.",
    emptyRecSub: "Elan yerləşdirin — o, burada öz alt kateqoriyasında görünəcək.",
    emptyFavTitle: "Hələ boşdur. Elanları seçilmişlərə əlavə edin — burada görünəcək.",

    mapBtn: "Xəritədə göstər",
    callBtn: "Zəng et",
    waBtn: "WhatsApp",
    favAdd: "Seçilmişlərə",
    favRemove: "Seçilmişlərdə",
    photoFallback: "Şəkil",
    badgeRecs: "Tövsiyələr",

    alertPriceDigits: "Qiymət yalnız rəqəmlər olmalıdır.",
    alertPhone: "Telefon nömrəsini yazın (ən azı 7 rəqəm).",
    alertNoMap: "Xəritəni açmaq olmadı: ünvan yazın və ya xəritədə nöqtə seçin.",
    alertNoSubcat: "Bu alt kateqoriyada hələ elan yoxdur.",
    alertPickPoint: "Əvvəlcə xəritədə nöqtə seçin.",

    footnote: "Elanlar və şəkillər brauzerdə (LocalStorage) saxlanılır. Hesablar/şərhlər/qiymətlər — serverin yanında SQLite bazasında saxlanılır.",

    langTitle: "Dil"
    ,
    authBtn: "Daxil ol",
    authTitle: "Daxil ol / Qeydiyyat",
    authIdLabel: "E-mail və ya istifadəçi adı",
    authPwLabel: "Şifrə",
    authRemember: "Məni yadda saxla",
    authRegisterBtn: "Qeydiyyat",
    authLoginBtn: "Daxil ol",
    authNote: "Elanlara qeydiyyatsız baxmaq olar.",
    menuProfile: "Profil",
    menuLogin: "Daxil ol / Qeydiyyat",
    menuLogout: "Çıxış",
    reviewsTitle: "Rəylər",
    yourReview: "Sizin şərhiniz və qiymət",
    reviewPlaceholder: "Şərh yazın…",
    reviewSend: "Göndər",
    reviewUpdate: "Yadda saxla",
    reviewLockedTitle: "Sizin rəyiniz",
    reviewLockedNote: "Rəy artıq göndərilib. Dəyişmək olmaz.",
    reviewNeedLogin: "Qiymət vermək və şərh yazmaq üçün daxil olun.",
    ratingZero: "Qiymətsiz",
    ratingWord: "Reytinq"

  },

  en: {
    brandTitle: "Qusar Services",
    brandChip: "Qusar",

    menuHome: "Home",
    menuCreate: "Post",
    menuFavorites: "Favorites",
    menuClear: "Clear ads",
    menuLangPrefix: "Language",

    navSearch: "Search",

    sectionCats: "Categories",
    btnShowAll: "Show all",
    btnHide: "Hide",
    allCatsTitle: "All categories",

    adsNew: "New listings",
    adsRecs: "Recommendations",
    adsFav: "Favorites",
    adsAd: "Listing",

    searchBtn: "Search",
    filterBtn: "Filter",
    filterTitle: "Filter",

    tourismPopularTitle: "Popular places",
    tourismMountains: "Mountains",
    tourismParks: "Parks",
    tourismSights: "Attractions",
    tourismRestaurants: "Restaurants",
    tourismHotels: "Hotels",
    tourismRelax: "Places to relax",
    tourismOpenMap: "Show on map",
    tourismCoords: "Coordinates: coming soon",

    filterCategory: "Category",
    filterSubcategory: "Subcategory",
    filterAny: "Any",
    filterPriceMin: "Price min",
    filterPriceMax: "Price max",
    filterApply: "Apply",
    filterReset: "Reset",
    filterErrPrice: "Min price can't be greater than max price.",
    filterCategoryHint: "Pick a category to unlock special filters.",
    filterSubHint: "Subcategory is optional.",

    carMake: "Make",
    carModel: "Model",
    carModelHint: "Pick a make first.",
    carEngine: "Engine (L)",
    carTransmission: "Transmission",
    carFuelSystem: "Fuel system",
    carCondition: "Condition",

    trManual: "Manual",
    trAuto: "Automatic",
    trCvt: "CVT",
    trRobot: "Robot",

    fuelInjector: "Injector",
    fuelCarb: "Carburetor",

    condNew: "New",
    condUsed: "Used",

// Real estate
realtyRooms: "Rooms",
realtyHectareMin: "Hectare (min)",

// Jobs
filterSalaryMin: "Salary min",
filterSalaryMax: "Salary max",
lblSalary: "Salary (digits only)",
phSalary: "e.g. 800",

// Electronics
elecBrand: "Brand",

    searchPh: "Search: apartment, job, phone…",
    createBtn: "Post",

    modalTitle: "Post a listing",
    lblTitle: "Title",
    phTitle: "e.g., House for sale",
    lblCategory: "Category",
    lblSubcategory: "Subcategory",
    lblPhone: "Phone number",
    phPhone: "501234567",
    lblPrice: "Price (digits only)",
    phPrice: "e.g., 1500000",
    lblDesc: "Description",
    phDesc: "Describe the item/service",
    lblAddress: "Address (for map)",
    phAddress: "e.g., Qusar, street..., house ...",
    lblLocation: "Location",
    phLocation: "Click “Show on map”",
    locHint: "Tap the map to pick a point — coordinates will fill automatically.",
    pickMapBtn: "Show on map",

    mapModalTitle: "Pick a place",
    mapHint: "Tap the map to pick a point",
    myLocationBtn: "My location",
    mapUseBtn: "Use",
    mapCancelBtn: "Cancel",

    lblPhoto: "Photo",
    cancel: "Cancel",
    publish: "Publish",

    emptyTitle: "No listings yet. Click “Post” to add the first one!",
    emptySub: "You can add a photo — it will be saved in your browser.",
    emptyRecTitleStart: "No recommendations in “",
    emptyRecTitleEnd: "” yet.",
    emptyRecSub: "Post a listing — it will appear here in its subcategory.",
    emptyFavTitle: "Empty for now. Add listings to favorites — they will appear here.",

    mapBtn: "View on map",
    callBtn: "Call",
    waBtn: "WhatsApp",
    favAdd: "Add to favorites",
    favRemove: "In favorites",
    photoFallback: "Photo",
    badgeRecs: "Recommendations",

    alertPriceDigits: "Price must be digits only.",
    alertPhone: "Enter a phone number (at least 7 digits).",
    alertNoMap: "Can’t open map: enter an address or pick a point on the map.",
    alertNoSubcat: "No listings in this subcategory yet.",
    alertPickPoint: "Pick a point on the map first.",

    footnote: "Listings & photos are stored in the browser (LocalStorage). Accounts/reviews/ratings are stored in SQLite next to the server.",

    langTitle: "Language"
    ,
    authBtn: "Sign in",
    authTitle: "Sign in / Sign up",
    authIdLabel: "Email or username",
    authPwLabel: "Password",
    authRemember: "Remember me",
    authRegisterBtn: "Sign up",
    authLoginBtn: "Sign in",
    authNote: "You can browse listings without signing in.",
    menuProfile: "Profile",
    menuLogin: "Sign in / Sign up",
    menuLogout: "Sign out",
    reviewsTitle: "Reviews",
    yourReview: "Your comment & rating",
    reviewPlaceholder: "Write a comment…",
    reviewSend: "Send",
    reviewUpdate: "Save",
    reviewLockedTitle: "Your review",
    reviewLockedNote: "Review already submitted. You can’t edit it.",
    reviewNeedLogin: "Sign in to rate or comment.",
    ratingZero: "No rating",
    ratingWord: "Rating"

  },

  ar: {
    brandTitle: "خدمات قوصار",
    brandChip: "قوصار",

    menuHome: "الرئيسية",
    menuCreate: "نشر إعلان",
    menuFavorites: "المفضلة",
    menuClear: "مسح الإعلانات",
    menuLangPrefix: "اللغة",

    navSearch: "بحث",

    sectionCats: "الفئات",
    btnShowAll: "عرض الكل",
    btnHide: "إخفاء",
    allCatsTitle: "كل الفئات",

    adsNew: "إعلانات جديدة",
    adsRecs: "توصيات",
    adsFav: "المفضلة",
    adsAd: "إعلان",

    searchBtn: "بحث",
    filterBtn: "تصفية",
    filterTitle: "تصفية",

    tourismPopularTitle: "أماكن شهيرة",
    tourismMountains: "جبال",
    tourismParks: "حدائق",
    tourismSights: "معالم",
    tourismRestaurants: "مطاعم",
    tourismHotels: "فنادق",
    tourismRelax: "أماكن للاستراحة",
    tourismOpenMap: "عرض على الخريطة",
    tourismCoords: "الإحداثيات: لاحقًا",
    searchPh: "بحث: شقة، عمل، هاتف…",
    createBtn: "نشر إعلان",

    modalTitle: "نشر إعلان",
    lblTitle: "العنوان",
    phTitle: "مثال: منزل للبيع",
    lblCategory: "الفئة",
    lblSubcategory: "الفئة الفرعية",
    lblPhone: "رقم الهاتف",
    phPhone: "501234567",
    lblPrice: "السعر (أرقام فقط)",
    phPrice: "مثال: 1500000",

// العقارات
realtyRooms: "الغرف",
realtyHectareMin: "هكتار (حد أدنى)",

// الأعمال
filterSalaryMin: "الراتب (حد أدنى)",
filterSalaryMax: "الراتب (حد أقصى)",
lblSalary: "الراتب (أرقام فقط)",
phSalary: "مثال: 800",

// الإلكترونيات
elecBrand: "العلامة التجارية",
    lblDesc: "الوصف",
    phDesc: "صف المنتج/الخدمة",
    lblAddress: "العنوان (للخريطة)",
    phAddress: "مثال: قوصار، شارع ...",
    lblLocation: "الموقع",
    phLocation: "اضغط «عرض على الخريطة»",
    locHint: "اضغط على الخريطة لاختيار نقطة — سيتم إدخال الإحداثيات تلقائياً.",
    pickMapBtn: "عرض على الخريطة",

    mapModalTitle: "اختر مكاناً",
    mapHint: "اضغط على الخريطة لاختيار نقطة",
    myLocationBtn: "موقعي",
    mapUseBtn: "استخدام",
    mapCancelBtn: "إلغاء",

    lblPhoto: "صورة",
    cancel: "إلغاء",
    publish: "نشر",

    emptyTitle: "لا توجد إعلانات بعد. اضغط «نشر إعلان» لإضافة أول إعلان!",
    emptySub: "يمكنك إضافة صورة — ستُحفظ في المتصفح.",
    emptyRecTitleStart: "لا توجد توصيات في «",
    emptyRecTitleEnd: "» حتى الآن.",
    emptyRecSub: "انشر إعلاناً — سيظهر هنا ضمن فئته الفرعية.",
    emptyFavTitle: "فارغ حالياً. أضف إعلانات إلى المفضلة وستظهر هنا.",

    mapBtn: "عرض على الخريطة",
    callBtn: "اتصال",
    waBtn: "واتساب",
    favAdd: "إضافة للمفضلة",
    favRemove: "في المفضلة",
    photoFallback: "صورة",
    badgeRecs: "توصيات",

    alertPriceDigits: "يجب أن يكون السعر أرقاماً فقط.",
    alertPhone: "أدخل رقم هاتف (على الأقل 7 أرقام).",
    alertNoMap: "تعذّر فتح الخريطة: أدخل عنواناً أو اختر نقطة على الخريطة.",
    alertNoSubcat: "لا توجد إعلانات في هذه الفئة الفرعية بعد.",
    alertPickPoint: "اختر نقطة على الخريطة أولاً.",

    footnote: "الإعلانات والصور تُحفظ في المتصفح (LocalStorage). الحسابات/التعليقات/التقييمات تُحفظ في قاعدة SQLite بجانب الخادم.",

    langTitle: "اللغة"
    ,
    authBtn: "تسجيل الدخول",
    authTitle: "دخول / تسجيل",
    authIdLabel: "البريد أو اسم المستخدم",
    authPwLabel: "كلمة المرور",
    authRemember: "تذكرني",
    authRegisterBtn: "تسجيل",
    authLoginBtn: "دخول",
    authNote: "يمكنك مشاهدة الإعلانات بدون تسجيل.",
    menuProfile: "الملف الشخصي",
    menuLogin: "دخول / تسجيل",
    menuLogout: "تسجيل الخروج",
    reviewsTitle: "التعليقات",
    yourReview: "تعليقك وتقييمك",
    reviewPlaceholder: "اكتب تعليقاً…",
    reviewSend: "إرسال",
    reviewUpdate: "حفظ",
    reviewLockedTitle: "مراجعتك",
    reviewLockedNote: "تم إرسال المراجعة. لا يمكن التعديل.",
    reviewNeedLogin: "سجّل الدخول للتقييم أو التعليق.",
    ratingZero: "بدون تقييم",
    ratingWord: "التقييم"

  }
};

/*
  Иконки:
  - services:     ./image/services.png
  - restaurants:  ./image/restaurants.png
  - free:         ./image/free.png
  Если файла нет — картинка скрывается, карточка остаётся норм.
*/
const data = [
  {
    id: "realty",
    featured: true,
    icon: "./image/realty.png",
    name: { ru: "Недвижимость", az: "Daşınmaz əmlak", en: "Real estate", ar: "العقارات" },
    desc: { ru: "Квартиры, дома, аренда", az: "Mənzil, ev, kirayə", en: "Apartments, houses, rent", ar: "شقق، منازل، إيجار" },
    subcats: [
      { id: "apartments", name: { ru: "Квартиры", az: "Mənzillər", en: "Apartments", ar: "شقق" } },
      { id: "houses", name: { ru: "Дома", az: "Evlər", en: "Houses", ar: "منازل" } },
      { id: "rent", name: { ru: "Аренда", az: "Kirayə", en: "Rent", ar: "إيجار" } },
      { id: "rooms", name: { ru: "Комнаты", az: "Otaqlar", en: "Rooms", ar: "غرف" } },
      { id: "commercial", name: { ru: "Коммерция", az: "Kommersiya", en: "Commercial", ar: "تجاري" } }
    ]
  },
  {
    id: "transport",
    featured: true,
    icon: "./image/transport.png",
    name: { ru: "Транспорты", az: "Nəqliyyat", en: "Transport", ar: "النقل" },
    desc: { ru: "Авто, мото, грузовые", az: "Avto, moto, yük", en: "Cars, bikes, trucks", ar: "سيارات، دراجات، شاحنات" },
    subcats: [
      { id: "cars", name: { ru: "Авто", az: "Avtomobil", en: "Cars", ar: "سيارات" } },
      { id: "moto", name: { ru: "Мото", az: "Motosiklet", en: "Motorbikes", ar: "دراجات نارية" } },
      { id: "trucks", name: { ru: "Грузовые", az: "Yük maşınları", en: "Trucks", ar: "شاحنات" } },
      { id: "parts", name: { ru: "Запчасти", az: "Ehtiyat hissələri", en: "Parts", ar: "قطع غيار" } }
    ]
  },
  {
    id: "jobs",
    featured: true,
    icon: "./image/jobs.png",
    name: { ru: "Работы", az: "İşlər", en: "Jobs", ar: "الأعمال" },
    desc: { ru: "Услуги, ремонт, мастера", az: "Xidmət, təmir, ustalar", en: "Services & repairs", ar: "خدمات وصيانة" },
    subcats: [
      { id: "repair", name: { ru: "Ремонт", az: "Təmir", en: "Repair", ar: "صيانة" } },
      { id: "construction", name: { ru: "Строительство", az: "Tikinti", en: "Construction", ar: "بناء" } },
      { id: "plumber", name: { ru: "Сантехник", az: "Santexnik", en: "Plumber", ar: "سباك" } },
      { id: "electrician", name: { ru: "Электрик", az: "Elektrik", en: "Electrician", ar: "كهربائي" } },
      { id: "other", name: { ru: "Разное", az: "Digər", en: "Other", ar: "أخرى" } }
    ]
  },
  {
    id: "animals",
    featured: true,
    icon: "./image/animals.png",
    name: { ru: "Животные", az: "Heyvanlar", en: "Animals", ar: "الحيوانات" },
    desc: { ru: "Питомцы и уход", az: "Ev heyvanları və qulluq", en: "Pets & care", ar: "حيوانات ورعاية" },
    subcats: [
      { id: "cats", name: { ru: "Кошки", az: "Pişiklər", en: "Cats", ar: "قطط" } },
      { id: "dogs", name: { ru: "Собаки", az: "İtlər", en: "Dogs", ar: "كلاب" } },
      { id: "birds", name: { ru: "Птицы", az: "Quşlar", en: "Birds", ar: "طيور" } },
      { id: "aquarium", name: { ru: "Аквариум", az: "Akvarium", en: "Aquarium", ar: "حوض أسماك" } },
      { id: "care", name: { ru: "Уход", az: "Qulluq", en: "Care", ar: "رعاية" } }
    ]
  },
  {
    id: "kids",
    featured: true,
    icon: "./image/kids.png",
    name: { ru: "Товары для детей", az: "Uşaq məhsulları", en: "Kids", ar: "منتجات الأطفال" },
    desc: { ru: "Одежда, игрушки", az: "Geyim, oyuncaq", en: "Clothes & toys", ar: "ملابس وألعاب" },
    subcats: [
      { id: "clothes", name: { ru: "Одежда", az: "Geyim", en: "Clothes", ar: "ملابس" } },
      { id: "toys", name: { ru: "Игрушки", az: "Oyuncaqlar", en: "Toys", ar: "ألعاب" } },
      { id: "strollers", name: { ru: "Коляски", az: "Uşaq arabaları", en: "Strollers", ar: "عربات أطفال" } },
      { id: "beds", name: { ru: "Кроватки", az: "Uşaq çarpayıları", en: "Baby beds", ar: "أسرة أطفال" } },
      { id: "other", name: { ru: "Разное", az: "Digər", en: "Other", ar: "أخرى" } }
    ]
  },
  {
    id: "electronics",
    featured: true,
    icon: "./image/electronics.png",
    name: { ru: "Электроника", az: "Elektronika", en: "Electronics", ar: "الإلكترونيات" },
    desc: { ru: "Телефоны, ноутбуки", az: "Telefon, noutbuk", en: "Phones & laptops", ar: "هواتف وحواسيب" },
    subcats: [
      { id: "phones", name: { ru: "Телефоны", az: "Telefonlar", en: "Phones", ar: "هواتف" } },
      { id: "laptops", name: { ru: "Ноутбуки", az: "Noutbuklar", en: "Laptops", ar: "حواسيب محمولة" } },
      { id: "tablets", name: { ru: "Планшеты", az: "Planşetlər", en: "Tablets", ar: "أجهزة لوحية" } },
      { id: "accessories", name: { ru: "Аксессуары", az: "Aksesuarlar", en: "Accessories", ar: "ملحقات" } }
    ]
  },

  /* УСЛУГИ — ТОЛЬКО В «ПОКАЗАТЬ ВСЕ» (по умолчанию) */
  {
    id: "services",
    // Важно: на главной у нас фикс 4x2 (8 категорий), поэтому «Услуги» по умолчанию не показываем.
    // При необходимости категория всё равно может «всплывать» в топе через логику pinHomeCat.
    featured: false,
    icon: "./image/services.png",
    name: { ru: "Услуги", az: "Xidmətlər", en: "Services", ar: "الخدمات" },
    desc: { ru: "Дом, уход, обучение, IT", az: "Ev, qayğı, təhsil, IT", en: "Home, care, education, IT", ar: "منزل، رعاية، تعليم، تقنية" },
    subcats: [
      { id: "clean_home", name: { ru: "Уборка домов и квартир", az: "Ev və mənzil təmizliyi", en: "House & apartment cleaning", ar: "تنظيف المنازل والشقق" } },
      { id: "carpet_clean", name: { ru: "Химчистка ковров", az: "Xalça kimyəvi təmizləmə", en: "Carpet dry cleaning", ar: "تنظيف السجاد" } },
      { id: "yard_clean", name: { ru: "Уборка дворов", az: "Həyət təmizliyi", en: "Yard cleaning", ar: "تنظيف الساحات" } },
      { id: "garden_care", name: { ru: "Уход за садом, деревья", az: "Bağ və ağaclara qulluq", en: "Garden & tree care", ar: "رعاية الحديقة والأشجار" } },
      { id: "elder_help", name: { ru: "Помощь по хозяйству пожилым", az: "Yaşlılara ev işlərində kömək", en: "Household help for elderly", ar: "مساعدة منزلية لكبار السن" } },
      { id: "caregiver", name: { ru: "Сиделка", az: "Baxıcı", en: "Caregiver", ar: "مُرافِقة/مُرافِق" } },
      { id: "nurse_home", name: { ru: "Медсестра на дом", az: "Evə tibb bacısı", en: "Nurse at home", ar: "ممرضة إلى المنزل" } },
      { id: "tutors", name: { ru: "Репетиторы (школа, экзамены)", az: "Repetitor (məktəb, imtahan)", en: "Tutors (school, exams)", ar: "مدرسون خصوصيون (مدرسة/امتحانات)" } },
      { id: "design", name: { ru: "Дизайн (визитки, баннеры)", az: "Dizayn (vizit, banner)", en: "Design (cards, banners)", ar: "تصميم (بطاقات/بانرات)" } },
      { id: "smm", name: { ru: "SMM (Instagram-магазины)", az: "SMM (Instagram mağazaları)", en: "SMM (Instagram shops)", ar: "إدارة سوشيال (متاجر إنستغرام)" } },
      { id: "websites", name: { ru: "Создание сайтов", az: "Sayt hazırlanması", en: "Website creation", ar: "إنشاء مواقع" } },
      { id: "setup_devices", name: { ru: "Настройка компьютеров / телефонов", az: "Kompüter/telefon sazlanması", en: "PC/phone setup", ar: "تهيئة الكمبيوتر/الهاتف" } }
    ]
  },


  {
    id: "tourism",
    featured: true,
    icon: "./image/tourism.png",
    name: { ru: "Туризм", az: "Turizm", en: "Tourism", ar: "السياحة" },
    desc: { ru: "Туры, отели, билеты", az: "Turlar, otellər, biletlər", en: "Tours, hotels, tickets", ar: "جولات، فنادق، تذاكر" },
    // ВИТРИНА "ПОПУЛЯРНЫЕ МЕСТА" (без подкатегорий)
    subcats: []
  },

  /* РЕСТОРАНЫ — ТЕПЕРЬ НА ГЛАВНОЙ */
  {
    id: "restaurants",
    featured: true,
    icon: "./image/restaurants.png",
    name: { ru: "Рестораны", az: "Restoranlar", en: "Restaurants", ar: "مطاعم" },
    desc: { ru: "Кофейни, фастфуд, доставка", az: "Kofe, fast food, çatdırılma", en: "Cafe, fast food, delivery", ar: "مقاهي، وجبات سريعة، توصيل" },
    subcats: [
      { id: "coffee", name: { ru: "Кофейня", az: "Kofe", en: "Coffee shop", ar: "مقهى" } },
      { id: "fastfood", name: { ru: "Фастфуд", az: "Fast food", en: "Fast food", ar: "وجبات سريعة" } },
      { id: "restaurant", name: { ru: "Ресторан", az: "Restoran", en: "Restaurant", ar: "مطعم" } },
      { id: "pizzeria", name: { ru: "Пиццерия", az: "Pitsa", en: "Pizzeria", ar: "بيتزا" } },
      { id: "sushi", name: { ru: "Суши", az: "Suşi", en: "Sushi", ar: "سوشي" } },
      { id: "delivery", name: { ru: "Доставка еды", az: "Yemək çatdırılması", en: "Food delivery", ar: "توصيل طعام" } },
      { id: "dessert", name: { ru: "Кондитерская", az: "Şirniyyat", en: "Desserts", ar: "حلويات" } }
    ]
  },



  /* КУХОННАЯ УТВАРЬ — ТОЛЬКО В "ПОКАЗАТЬ ВСЕ" */
  {
    id: "kitchenware",
    featured: false,
    icon: "./image/kitchenware.png",
    name: { ru: "Куханная утварь", az: "Mətbəx ləvazimatları", en: "Kitchenware", ar: "أدوات المطبخ" },
    desc: { ru: "Посуда, ножи, кастрюли", az: "Qab-qacaq, bıçaqlar, qazanlar", en: "Dishes, knives, cookware", ar: "أطباق، سكاكين، أواني" },
    subcats: [
      { id: "dishes", name: { ru: "Посуда", az: "Qab-qacaq", en: "Dishes", ar: "أطباق" } },
      { id: "cookware", name: { ru: "Кастрюли и сковороды", az: "Qazan və tava", en: "Cookware", ar: "أواني" } },
      { id: "knives", name: { ru: "Ножи", az: "Bıçaqlar", en: "Knives", ar: "سكاكين" } },
      { id: "cutlery", name: { ru: "Приборы", az: "Çəngəl-bıçaq", en: "Cutlery", ar: "أدوات مائدة" } },
      { id: "storage", name: { ru: "Хранение", az: "Saxlama", en: "Storage", ar: "تخزين" } },
      { id: "other", name: { ru: "Другое", az: "Digər", en: "Other", ar: "أخرى" } }
    ]
  },
  /* ОТДАМ ДАРОМ — ТОЛЬКО В "ПОКАЗАТЬ ВСЕ" */
  {
    id: "free",
    featured: false,
    icon: "./image/free.png",
    name: { ru: "Отдам даром", az: "Pulsuz verilir", en: "Free giveaway", ar: "مجانا" },
    desc: { ru: "Вещи бесплатно", az: "Pulsuz əşyalar", en: "Items for free", ar: "أشياء مجانية" },
    subcats: [
      { id: "clothes", name: { ru: "Одежда", az: "Geyim", en: "Clothes", ar: "ملابس" } },
      { id: "electronics", name: { ru: "Техника", az: "Texnika", en: "Electronics", ar: "إلكترونيات" } },
      { id: "furniture", name: { ru: "Мебель", az: "Mebel", en: "Furniture", ar: "أثاث" } },
      { id: "kids", name: { ru: "Детское", az: "Uşaq üçün", en: "Kids", ar: "أطفال" } },
      { id: "other", name: { ru: "Разное", az: "Digər", en: "Other", ar: "أخرى" } }
    ]
  }
];

let lang = loadLang();

let state = {
  view: "home",          // home | subcats | favorites | ad | tourism_place
  currentCatId: null,
  currentSubId: "",
  currentAdId: null,
  returnView: "home",
  returnCatId: null,
  returnQuery: "",
  showAllCats: false,
  tourismPlaceKey: null,
  filters: null
};

state.filters = loadFilters();

/* ===== Главный экран: порядок категорий (4x2 = 8 шт.) =====
   Логика:
   - На главной всегда максимум 8 категорий (сетка 4x2).
   - Если пользователь открыл категорию (в том числе из «Показать все»),
     она становится первой, а список обрезается до 8.
*/
const HOME_CATS_KEY = "kusary_home_cats_v1";
const MAX_HOME_CATS = 8;

// Базовый порядок, который мы хотим видеть на главной (как в макете)
const HOME_DEFAULT_ORDER = [
  "tourism",
  "restaurants",
  "transport",
  "realty",
  "jobs",
  "animals",
  "kids",
  "electronics"
];

function uniqIds(arr){
  const out = [];
  (arr || []).forEach(x => {
    const id = String(x);
    if (id && !out.includes(id)) out.push(id);
  });
  return out;
}

function getBaseHomeIds(){
  const featured = new Set(data.filter(c => !!c.featured).map(c => c.id));
  const ids = HOME_DEFAULT_ORDER.filter(id => featured.has(id));
  // если вдруг появятся новые featured-категории — добавим в конец
  data.filter(c => !!c.featured).forEach(c => { if (!ids.includes(c.id)) ids.push(c.id); });
  return ids;
}

function normalizeHomeCats(ids){
  const byId = new Map(data.map(c => [c.id, c]));
  let out = uniqIds(ids).filter(id => byId.has(id));

  // Если списка нет — стартуем с базовых 8
  const base = getBaseHomeIds();
  if (out.length === 0) out = base.slice();

  // Добиваем базовыми, если меньше 8
  for (const id of base){
    if (out.length >= MAX_HOME_CATS) break;
    if (!out.includes(id)) out.push(id);
  }

  // Жёстко режем до 8 (4x2)
  return out.slice(0, MAX_HOME_CATS);
}

function loadHomeCats(){
  try{
    const raw = lsGet(HOME_CATS_KEY);
    if (!raw) throw 0;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return normalizeHomeCats(arr);
  }catch(e){}
  return normalizeHomeCats([]);
}

function saveHomeCats(ids){
  try{ lsSet(HOME_CATS_KEY, JSON.stringify(ids)); }catch(e){}
}

let homeCatIds = loadHomeCats();

function pinHomeCat(catId){
  if (!catId) return;

  homeCatIds = uniqIds([catId, ...(homeCatIds || [])]);
  homeCatIds = normalizeHomeCats(homeCatIds);
  saveHomeCats(homeCatIds);
}

function getHomeCats(){
  if (!Array.isArray(homeCatIds) || homeCatIds.length === 0) homeCatIds = loadHomeCats();

  const byId = new Map(data.map(c => [c.id, c]));
  homeCatIds = normalizeHomeCats(homeCatIds);
  saveHomeCats(homeCatIds);
  return homeCatIds.map(id => byId.get(id)).filter(Boolean);
}


const auth = { user: null, pendingAction: null };

/* elements */
const elGrid = document.getElementById("grid");
const elAds = document.getElementById("ads");
const elSectionTitle = document.getElementById("sectionTitle");
const elAdsTitle = document.getElementById("adsTitle");
const adsSection = document.getElementById("adsSection");

const catsSection = document.getElementById("catsSection");
const btnShowAllCats = document.getElementById("btnShowAllCats");

const catsModal = document.getElementById("catsModal");
const catsModalTitle = document.getElementById("catsModalTitle");
const catsModalGrid = document.getElementById("catsModalGrid");
const btnCloseCatsModal = document.getElementById("btnCloseCatsModal");

const btnBack = document.getElementById("btnBack");
const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menu");

const btnCreate = document.getElementById("btnCreate");
const modal = document.getElementById("modal");
const btnCloseModal = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancel");
const form = document.getElementById("createForm");

const selectCategory = document.getElementById("selectCategory");
const selectSubcategory = document.getElementById("selectSubcategory");
const subcatField = document.getElementById("subcatField");
const extraFieldsWrap = document.getElementById("extraFieldsWrap");

const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnFilter = document.getElementById("btnFilter");

const filterModal = document.getElementById("filterModal");
const filterModalTitle = document.getElementById("filterModalTitle");
const filterModalBody = document.getElementById("filterModalBody");
const btnCloseFilterModal = document.getElementById("btnCloseFilterModal");

/* subcategory modal (inside category tab) */
const subcatModal = document.getElementById("subcatModal");
const subcatModalTitle = document.getElementById("subcatModalTitle");
const subcatList = document.getElementById("subcatList");
const btnCloseSubcat = document.getElementById("btnCloseSubcat");

/* language popup */
const btnLang = document.getElementById("btnLang");
const langPop = document.getElementById("langPop");
const langPopTitle = document.getElementById("langPopTitle");

/* auth */
const btnAuth = document.getElementById("btnAuth");
const authModal = document.getElementById("authModal");
const btnCloseAuth = document.getElementById("btnCloseAuth");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authLblId = document.getElementById("authLblId");
const authLblPw = document.getElementById("authLblPw");
const authIdentifier = document.getElementById("authIdentifier");
const authPassword = document.getElementById("authPassword");
const authRemember = document.getElementById("authRemember");
const authRememberText = document.getElementById("authRememberText");
const btnDoRegister = document.getElementById("btnDoRegister");
const btnDoLogin = document.getElementById("btnDoLogin");
const authError = document.getElementById("authError");
const authNote = document.getElementById("authNote");
const authLang = document.getElementById("authLang");

/* menu items */
const menuHome = document.getElementById("menuHome");
const menuCreate = document.getElementById("menuCreate");
const menuFavorites = document.getElementById("menuFavorites");
const menuLang = document.getElementById("menuLang");
const menuClear = document.getElementById("menuClear");
const menuProfile = document.getElementById("menuProfile");
const menuLogin = document.getElementById("menuLogin");
const menuLogout = document.getElementById("menuLogout");

const brandTitle = document.getElementById("brandTitle");
const brandChipText = document.getElementById("brandChipText");
const footnote = document.getElementById("footnote");

/* mobile bottom nav */
const mnavHome = document.getElementById("mnavHome");
const mnavSearch = document.getElementById("mnavSearch");
const mnavAdd = document.getElementById("mnavAdd");
const mnavFav = document.getElementById("mnavFav");
const mnavProfile = document.getElementById("mnavProfile");
const mnavHomeLabel = document.getElementById("mnavHomeLabel");
const mnavSearchLabel = document.getElementById("mnavSearchLabel");
const mnavFavLabel = document.getElementById("mnavFavLabel");
const mnavProfileLabel = document.getElementById("mnavProfileLabel");

/* form labels/inputs */
const modalTitle = document.getElementById("modalTitle");
const lblTitle = document.getElementById("lblTitle");
const inpTitle = document.getElementById("inpTitle");
const lblCategory = document.getElementById("lblCategory");
const lblSubcategory = document.getElementById("lblSubcategory");
const lblPhone = document.getElementById("lblPhone");
const inpPhone = document.getElementById("inpPhone");
const phoneCountry = document.getElementById("phoneCountry");
const lblPrice = document.getElementById("lblPrice");
const inpPrice = document.getElementById("inpPrice");
const lblDesc = document.getElementById("lblDesc");
const inpDesc = document.getElementById("inpDesc");
const lblAddress = document.getElementById("lblAddress");
const inpAddress = document.getElementById("inpAddress");
const lblLocation = document.getElementById("lblLocation");
const inpCoords = document.getElementById("inpCoords");
const btnPickMap = document.getElementById("btnPickMap");
const locHint = document.getElementById("locHint");
const realtyLocationRow = document.getElementById("realtyLocationRow");
const lblPhoto = document.getElementById("lblPhoto");
const btnPublish = document.getElementById("btnPublish");

/* map modal */
const mapModal = document.getElementById("mapModal");
const mapModalTitle = document.getElementById("mapModalTitle");
const btnCloseMap = document.getElementById("btnCloseMap");
const btnMapCancel = document.getElementById("btnMapCancel");
const btnMapUse = document.getElementById("btnMapUse");
const btnMyLocation = document.getElementById("btnMyLocation");
const mapHint = document.getElementById("mapHint");
const leafletMapEl = document.getElementById("leafletMap");

let mapInstance = null;
let mapMarker = null;
let selectedLatLng = null;

// ads are stored in SQLite on server; keep a small client cache
let ADS_CACHE = [];
let SERVER_OK = true;

init();

function t(key) {
  return (I18N[lang] && I18N[lang][key]) ? I18N[lang][key] : (I18N.ru[key] || key);
}

async function init() {
  migrateLegacyAds();
  applyLanguageToStaticUI();
  initAuth();
  // Если сайт открыт как файл (file://) — многое будет ломаться (storage + API). Открой через server.
  if (isFileOrigin()) {
    showSystemBanner("Открой сайт через сервер: запусти start_windows.bat и зайди на http://127.0.0.1:5000 (не открывай index.html двойным кликом)");
  }
  // load session + ads from server before first render
  await refreshMe();
  await refreshAdsFromServer();

  if (!__LS_OK) {
    showSystemBanner("Браузер запретил LocalStorage. Открой сайт через http://127.0.0.1:5000 (через start_windows.bat)");
  } else if (!SERVER_OK) {
    showSystemBanner("Сервер не запущен/недоступен. Запусти start_windows.bat и открой http://127.0.0.1:5000");
  }

  renderGrid();
  renderCurrentView();
  updateFilterButtonBadge();

  bindMobileNav();
  updateMobileNavActiveFromState();

  btnShowAllCats.addEventListener("click", () => {
    openCatsModal();
  });

  if (btnCloseCatsModal) {
    btnCloseCatsModal.addEventListener("click", closeCatsModal);
  }
  if (catsModal) {
    catsModal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute("data-close") === "1") closeCatsModal();
    });
  }

  if (btnCloseFilterModal) {
    btnCloseFilterModal.addEventListener("click", closeFilterModal);
  }
  if (filterModal) {
    filterModal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute("data-close") === "1") closeFilterModal();
    });
  }
btnBack.addEventListener("click", () => {
    if (state.view === "ad") {
      state.view = state.returnView || "home";
      state.currentCatId = state.returnCatId || null;
      state.currentAdId = null;
      renderGrid();
      renderCurrentView(state.returnQuery || searchInput.value);
      return;
    }

    if (state.view === "tourism_place") {
    if (adsSection) adsSection.style.display = "none";
    elAds.innerHTML = "";
    elAdsTitle.textContent = "";
      state.view = "subcats";
      state.tourismPlaceKey = null;
      renderGrid();
      renderCurrentView(searchInput.value);
      return;
    }

    if (state.view === "subcats" || state.view === "favorites") {
      goHome();
      return;
    }
    hideMenu();
    hideLangPop();
  });

  btnMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    hideLangPop();
    menu.hidden ? showMenu() : hideMenu();
  });

  /* Клик по надписи "Кусары Услуги" всегда ведёт на главный экран */
  if (brandTitle) {
    brandTitle.addEventListener("click", (e) => {
      if (e) e.preventDefault?.();
      hideMenu();
      hideLangPop();
      goHome();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    brandTitle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hideMenu();
        hideLangPop();
        goHome();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  document.addEventListener("click", () => {
    hideMenu();
    hideLangPop();
  });

  menu.addEventListener("click", (e) => e.stopPropagation());
  langPop.addEventListener("click", (e) => e.stopPropagation());

  menu.querySelectorAll("[data-menu]").forEach((b) => {
    b.addEventListener("click", () => {
      const act = b.getAttribute("data-menu");
      if (act === "home") goHome();
      if (act === "create") openModal();
      if (act === "favorites") openFavorites();
      if (act === "lang") toggleLangPop();
      if (act === "profile") openProfile();
      if (act === "login") openAuthModal();
      if (act === "logout") doLogout();
      if (act === "clear") {
        lsRemove(LS_KEY);
        lsRemove(LS_FAV);
        goHome();
      }
      hideMenu();
    });
  });

  btnCreate.addEventListener("click", openModal);
  btnCloseModal.addEventListener("click", closeModal);
  btnCancel.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-close") === "1") closeModal();
  });

  // subcategory modal
  if (btnCloseSubcat) btnCloseSubcat.addEventListener("click", closeSubcatModal);
  if (subcatModal) {
    subcatModal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute("data-close") === "1") closeSubcatModal();
    });
  }

  btnLang.addEventListener("click", (e) => {
    e.stopPropagation();
    hideMenu();
    toggleLangPop();
  });

  langPop.querySelectorAll("[data-lang]").forEach((b) => {
    b.addEventListener("click", () => {
      const newLang = b.getAttribute("data-lang");
      if (!newLang) return;
      setLanguage(newLang);
      hideLangPop();
    });
  });

  btnPickMap.addEventListener("click", openMapModal);
  btnCloseMap.addEventListener("click", closeMapModal);
  btnMapCancel.addEventListener("click", closeMapModal);
  btnMapUse.addEventListener("click", usePickedPoint);
  btnMyLocation.addEventListener("click", flyToMyLocation);

  mapModal.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-close") === "1") closeMapModal();
  });

  fillCategorySelects();
  fillSubcategorySelect(selectCategory.value);
  renderCreateExtraFields();
  selectCategory.addEventListener("change", () => {
    fillSubcategorySelect(selectCategory.value);
    renderCreateExtraFields();
  });
  selectSubcategory.addEventListener("change", renderCreateExtraFields);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      closeModal();
      requireAuth(() => openModal());
      return;
    }
    const fd = new FormData(form);

    const titleVal = String(fd.get("title") || "").trim();
    const categoryId = String(fd.get("categoryId") || "").trim();
    const subcategoryId = String(fd.get("subcategoryId") || "").trim();
    const phoneVal = buildFullPhoneFromForm(fd.get("phoneCountry"), fd.get("phoneLocal"));
    const priceVal = String(fd.get("price") || "").trim();
    const descVal = String(fd.get("desc") || "").trim();
    const addressVal = String(fd.get("address") || "").trim();
    const coordsVal = String(fd.get("coords") || "").trim();
    const photoFile = fd.get("photo");

    if (!titleVal) return;

    if (!isValidPhone(phoneVal)) {
      alert(t("alertPhone"));
      return;
    }

    if (!/^\d+$/.test(priceVal)) {
      alert(t("alertPriceDigits"));
      return;
    }

    const ad = {
      id: "ad_" + Date.now(),
      ownerId: auth.user.id,
      active: 1,
      title: titleVal,
      categoryId,
      subcategoryId,
      phone: normalizePhone(phoneVal),
      price: Number(priceVal),
      desc: descVal,
      address: addressVal,
      coords: coordsVal,
      date: new Date().toISOString(),
      photoDataUrl: null
    };

    const extra = buildExtraForAd(fd, categoryId, subcategoryId);
    if (extra && Object.keys(extra).length) ad.extra = extra;

    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      ad.photoDataUrl = await fileToDataUrl(photoFile);
    }

    try{
      await apiJson("/api/ads", { method:"POST", body: ad });
      await refreshAdsFromServer();
    }catch(e){
      alert(e.message);
      return;
    }

    closeModal();
    form.reset();
    inpCoords.value = "";
    selectedLatLng = null;

    fillCategorySelects();
    renderCurrentView(searchInput.value);
  });

  btnSearch.addEventListener("click", () => renderCurrentView(searchInput.value));

  if (btnFilter) btnFilter.addEventListener("click", openFilterModal);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") renderCurrentView(searchInput.value);
  });
}

/* ===== Язык ===== */
function setLanguage(newLang){
  if (!LANG_ORDER.includes(newLang)) return;
  lang = newLang;
  saveLang(lang);

  applyLanguageToStaticUI();
  initAuth();
  fillCategorySelects();

  renderGrid();
  renderCurrentView(searchInput.value);
}

function applyLanguageToStaticUI(){
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

  brandTitle.textContent = t("brandTitle");
  brandChipText.textContent = t("brandChip");

  btnCreate.textContent = t("createBtn");
  btnSearch.textContent = t("searchBtn");
  if (btnFilter) btnFilter.textContent = t("filterBtn");
  searchInput.placeholder = t("searchPh");

  menuHome.textContent = t("menuHome");
  menuCreate.textContent = t("menuCreate");
  menuFavorites.textContent = t("menuFavorites");
  menuClear.textContent = t("menuClear");
  if (menuProfile) menuProfile.textContent = t("menuProfile");
  if (menuLogin) menuLogin.textContent = t("menuLogin");
  if (menuLogout) menuLogout.textContent = t("menuLogout");
  menuLang.textContent = `${t("menuLangPrefix")}: ${lang.toUpperCase()}`;

  // mobile bottom nav labels
  if (mnavHomeLabel) mnavHomeLabel.textContent = t("menuHome");
  if (mnavSearchLabel) mnavSearchLabel.textContent = t("navSearch");
  if (mnavFavLabel) mnavFavLabel.textContent = t("menuFavorites");
  if (mnavProfileLabel) mnavProfileLabel.textContent = t("menuProfile");

  btnLang.textContent = lang.toUpperCase();
  langPopTitle.textContent = t("langTitle");

  if (btnAuth) btnAuth.textContent = isLoggedIn() ? `ID ${auth.user.id}` : t("authBtn");

  if (authTitle) authTitle.textContent = t("authTitle");
  if (authLblId) authLblId.textContent = t("authIdLabel");
  if (authLblPw) authLblPw.textContent = t("authPwLabel");
  if (authRememberText) authRememberText.textContent = t("authRemember");
  if (btnDoRegister) btnDoRegister.textContent = t("authRegisterBtn");
  if (btnDoLogin) btnDoLogin.textContent = t("authLoginBtn");
  if (authNote) authNote.textContent = t("authNote");

  elSectionTitle.textContent = t("sectionCats");
  applyShowAllButtonText();
  if (catsModalTitle) catsModalTitle.textContent = t("allCatsTitle");

  modalTitle.textContent = t("modalTitle");
  lblTitle.textContent = t("lblTitle");
  inpTitle.placeholder = t("phTitle");
  lblCategory.textContent = t("lblCategory");
  lblSubcategory.textContent = t("lblSubcategory");

  lblPhone.textContent = t("lblPhone");
  inpPhone.placeholder = t("phPhone");

  lblPrice.textContent = t("lblPrice");
  inpPrice.placeholder = t("phPrice");

  lblDesc.textContent = t("lblDesc");
  inpDesc.placeholder = t("phDesc");

  lblAddress.textContent = t("lblAddress");
  inpAddress.placeholder = t("phAddress");

  lblLocation.textContent = t("lblLocation");
  inpCoords.placeholder = t("phLocation");
  btnPickMap.textContent = t("pickMapBtn");
  locHint.textContent = t("locHint");

  lblPhoto.textContent = t("lblPhoto");

  btnCancel.textContent = t("cancel");
  btnPublish.textContent = t("publish");

  footnote.textContent = t("footnote");

  mapModalTitle.textContent = t("mapModalTitle");
  mapHint.textContent = t("mapHint");
  btnMyLocation.textContent = t("myLocationBtn");
  btnMapUse.textContent = t("mapUseBtn");
  btnMapCancel.textContent = t("mapCancelBtn");

  // для категории "Работы" показываем "Зарплата"
  updateCreatePriceLabelByCategory();
  setRealtyLocationVisibility(String(selectCategory?.value || "") === "realty");
}

function applyShowAllButtonText(){
  btnShowAllCats.textContent = t("btnShowAll");}

function toggleLangPop(){
  langPop.hidden ? showLangPop() : hideLangPop();
}
function showLangPop(){ langPop.hidden = false; }
function hideLangPop(){ langPop.hidden = true; }

/* ===== Навигация ===== */
function goHome() {
  state.view = "home";
  state.currentCatId = null;
  state.currentAdId = null;
  state.tourismPlaceKey = null;

  state.showAllCats = false;
  applyShowAllButtonText();

  renderGrid();
  renderCurrentView(searchInput.value);
}

function openFavorites(){
  state.view = "favorites";
  state.currentCatId = null;
  state.currentAdId = null;
  state.tourismPlaceKey = null;
  renderGrid();
  renderCurrentView(searchInput.value);
}



function setMobileNavActive(key){
  if (!mnavHome) return;
  const map = { home: mnavHome, search: mnavSearch, fav: mnavFav, profile: mnavProfile };
  Object.values(map).forEach((el) => { if (el) el.classList.remove("is-active"); });
  const target = map[key];
  if (target) target.classList.add("is-active");
}

function updateMobileNavActiveFromState(){
  if (!mnavHome) return;
  if (state.view === "favorites") { setMobileNavActive("fav"); return; }
  // Всё остальное считаем как "главная" (категории / подкатегории / просмотр / туризм)
  setMobileNavActive("home");
}

function bindMobileNav(){
  if (!mnavHome) return;
  if (document.documentElement.dataset.mnavBound === "1") return;
  document.documentElement.dataset.mnavBound = "1";

  mnavHome.addEventListener("click", () => {
    goHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  mnavSearch.addEventListener("click", () => {
    // Поиск у нас в рамках главного экрана: просто возвращаемся и фокусируем поле
    if (state.view !== "home") goHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { try{ searchInput.focus(); }catch{} }, 50);
    setMobileNavActive("search");
  });

  // подсветка "Поиск", пока поле активно
  if (searchInput){
    searchInput.addEventListener("focus", () => setMobileNavActive("search"));
    searchInput.addEventListener("blur", () => updateMobileNavActiveFromState());
  }

  mnavAdd.addEventListener("click", () => {
    openModal();
  });

  mnavFav.addEventListener("click", () => {
    openFavorites();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  mnavProfile.addEventListener("click", () => {
    openProfile();
  });
}
function renderCurrentView(query = "") {
  updateMobileNavActiveFromState();
  // Категории показываем:
  // - на главной
  // - в туризме (витрина/страницы мест)
  // - в режиме категории только если это Туризм (там своя витрина)
  let showCats = (state.view === "home" || state.view === "tourism_place");
  if (state.view === "subcats") {
    const c = getCurrentCategory();
    showCats = !!(c && c.id === "tourism");
  }
  catsSection.style.display = showCats ? "" : "none";

  // Подсказку внизу показываем почти везде, но в Туризме (витрина/страницы мест) прячем — там должен быть чистый экран.
  if (footnote) footnote.style.display = "";

  // по умолчанию показываем блок объявлений
  if (adsSection) adsSection.style.display = "";

  if (state.view === "home") {
    elAdsTitle.textContent = t("adsNew");
    renderHomeAds(query);
    return;
  }

  if (state.view === "favorites") {
    elAdsTitle.textContent = t("adsFav");
    renderFavorites(query);
    return;
  }

  // Туризм: без объявлений и без размещения

  if (state.view === "tourism_place") {
    if (adsSection) adsSection.style.display = "none";
    if (footnote) footnote.style.display = "none";
    elAds.innerHTML = "";
    elAdsTitle.textContent = "";
    const cat = data.find((x) => x.id === "tourism");
    if (cat) {
      catsSection.classList.add("is-tourism");
      btnBack.style.opacity = "1";
      const titleMap = {
        mountains: t("tourismMountains"),
        parks: t("tourismParks"),
        sights: t("tourismSights"),
        restaurants: t("tourismRestaurants"),
        hotels: t("tourismHotels"),
        relax: t("tourismRelax")
      };
      elSectionTitle.textContent = titleMap[state.tourismPlaceKey] || t("tourismPopularTitle");
      // В режиме страницы места нам НЕ нужна стандартная сетка категорий (иначе блок получается узким в колонке).
      elGrid.classList.remove("grid--places");
      elGrid.classList.add("grid--one");
      renderTourismPlacePage(state.tourismPlaceKey);
      return;
    }
  }

  if (state.view === "subcats") {
    const cat = getCurrentCategory();
    if (cat && cat.id === "tourism") {
      if (adsSection) adsSection.style.display = "none";
      if (footnote) footnote.style.display = "none";
      elAds.innerHTML = "";
      elAdsTitle.textContent = "";
      return;
    }
    elAdsTitle.textContent = cat ? getCatName(cat) : t("adsRecs");
    renderCategoryRecommendations(cat, query);
    return;
  }

  if (state.view === "tourism_place") {
    if (adsSection) adsSection.style.display = "none";
    elAds.innerHTML = "";
    elAdsTitle.textContent = "";
    return;
  }

  if (state.view === "ad") {
    elAdsTitle.textContent = t("adsAd");
    renderAdView(state.currentAdId);
  }
}

/* ===== Категории ===== */
function renderGrid() {
  elGrid.innerHTML = "";
  catsSection.classList.remove("is-tourism");
  // сбрасываем спец-сетку витрины
  elGrid.classList.remove("grid--places", "grid--one");

  btnShowAllCats.style.display = (state.view === "home") ? "" : "none";

  if (state.view === "home") {
    elSectionTitle.textContent = t("sectionCats");
    btnBack.style.opacity = "0.75";

    const catsToRender = getHomeCats();

    catsToRender.forEach((cat) => {
      const card = document.createElement("div");
      const chip = getCatChip(cat);
      card.className = "card";
      card.setAttribute("role", "button");
      card.tabIndex = 0;

      card.innerHTML = `
        <div class="card__icon"><div class="card__iconBox"></div></div>
        ${chip ? `<div class="card__chip">${escapeHtml(chip)}</div>` : ``}
        <div class="card__top">
          <p class="card__title">${escapeHtml(getCatName(cat))}</p>
          <p class="card__desc">${escapeHtml(getCatDesc(cat))}</p>
        </div>
      `;

      const iconWrap = card.querySelector(".card__iconBox") || card.querySelector(".card__icon");
      const img = document.createElement("img");
      img.src = cat.icon;
      img.alt = getCatName(cat);
      img.loading = "lazy";
      const coverIcons = [
        "tourism.png",
        "jobs.png",
        "transport.png",
        "services.png",
        "realty.png",
        "animals.png",
        "kids.png",
        "electronics.png",
        "free.png",
        "restaurants.png"
      ];
      if (coverIcons.some(n => String(cat.icon || "").endsWith(n))) {
        img.classList.add("icon--cover");
        // «Электроника» иногда выглядит чуть меньше из-за внутренних полей PNG — слегка увеличим.
        if (String(cat.icon || "").endsWith("electronics.png")) {
          img.classList.add("icon--electronicsBoost");
        }
        // у 3D-иконок уже есть свой «квадрат» — убираем лишнюю рамку контейнера
        if (iconWrap && iconWrap.classList) iconWrap.classList.add("iconBox--clear");
      }
      img.onerror = () => { img.style.display = "none"; };
      iconWrap.appendChild(img);

      card.addEventListener("click", () => openSubcats(cat.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openSubcats(cat.id);
      });

      elGrid.appendChild(card);
    });

    return;
  }

  if (state.view === "subcats") {
    const cat = getCurrentCategory();
    elSectionTitle.textContent = cat ? getCatName(cat) : t("sectionCats");
    btnBack.style.opacity = "1";
    if (!cat) return;

    // ===== Туризм: витрина без подкатегорий =====
    if (cat.id === "tourism") {
      catsSection.classList.add("is-tourism");
      elSectionTitle.textContent = t("tourismPopularTitle");
      elGrid.classList.add("grid--places");

      // Если пользователь открыл конкретное место — показываем страницу места
      if (state.view === "tourism_place" && state.tourismPlaceKey) {
        renderTourismPlacePage(state.tourismPlaceKey);
        return;
      }

      const places = [
        { key: "mountains", title: t("tourismMountains"), bg: "./image/shahdag_1.jpg" },
        { key: "parks", title: t("tourismParks"), bg: "./image/tourism_parks.png" },
        { key: "sights", title: t("tourismSights"), bg: "./image/tourism_sights.png" },
        { key: "restaurants", title: t("tourismRestaurants"), bg: "./image/tourism_restaurants.jpg" },
        { key: "hotels", title: t("tourismHotels"), bg: "./image/tourism_hotels.jpg" },
        { key: "relax", title: t("tourismRelax"), bg: "./image/tourism_hotels.jpg" }
      ];

      places.forEach((p) => {
        const card = document.createElement("div");
        card.className = "placeCard";
        card.style.backgroundImage = `url('${p.bg}')`;

        card.innerHTML = `
          <div class="placeCard__overlay">
            <div class="placeCard__title">${escapeHtml(p.title)}</div>
          </div>
        `;

        card.addEventListener("click", () => openTourismPlace(p.key));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") openTourismPlace(p.key);
        });

        card.setAttribute("role", "button");
        card.tabIndex = 0;

        elGrid.appendChild(card);
      });

      return;
    }

    // Для обычных категорий подкатегории НЕ показываем плитками сверху.
    // Подкатегории доступны через кнопку-меню внутри вкладки категории.
    elGrid.innerHTML = "";
    return;
  }
}

function openSubcats(catId) {
  bumpCatStats(catId);
  pinHomeCat(catId);
  state.view = "subcats";
  state.currentCatId = catId;
  state.currentSubId = "";
  state.currentAdId = null;
  state.tourismPlaceKey = null;

  renderGrid();
  renderCurrentView(searchInput.value);
}

function getCurrentCategory() {
  return data.find((x) => x.id === state.currentCatId) || null;
}

function getCatName(cat){
  return (cat.name && cat.name[lang]) ? cat.name[lang] : (cat.name?.ru || "");
}
function getCatDesc(cat){
  return (cat.desc && cat.desc[lang]) ? cat.desc[lang] : (cat.desc?.ru || "");
}
function getCatChip(cat){
  if (!cat || !cat.chip) return "";
  return (cat.chip && cat.chip[lang]) ? cat.chip[lang] : (cat.chip?.ru || "");
}
function getSubcatName(cat, subId){
  const s = (cat?.subcats || []).find(x => x.id === subId);
  if (!s) return "";
  return (s.name && s.name[lang]) ? s.name[lang] : (s.name?.ru || "");
}

/* ===== Объявления: список ===== */
function renderHomeAds(query = "") {
  const list = loadAds();
  const out = filterAds(list, query);

  elAds.innerHTML = "";
  if (out.length === 0) {
    renderEmptyBox();
    return;
  }

  const grid = document.createElement("div");
  grid.className = "adlist";

  out.slice(0, 12).forEach((a) => {
    grid.appendChild(renderAdCard(a));
  });

  elAds.appendChild(grid);
  wireAdClicks(elAds);
  wireAdButtons(elAds, out);
}

function renderFavorites(query = "") {
  const fav = loadFavs();
  const list = loadAds().filter(a => fav.has(a.id));
  const out = filterAds(list, query);

  elAds.innerHTML = "";
  if (out.length === 0) {
    const box = document.createElement("div");
    box.className = "empty";
    box.innerHTML = `
      <div>
        <div class="empty__text">${escapeHtml(t("emptyFavTitle"))}</div>
        <div class="empty__sub">${escapeHtml(t("emptySub"))}</div>
      </div>
      <div>
        <button class="btn primary" type="button" id="btnCreate2">${escapeHtml(t("createBtn"))}</button>
      </div>
    `;
    elAds.appendChild(box);
    document.getElementById("btnCreate2").addEventListener("click", openModal);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "adlist";

  out.slice(0, 24).forEach((a) => {
    grid.appendChild(renderAdCard(a));
  });

  elAds.appendChild(grid);
  wireAdClicks(elAds);
  wireAdButtons(elAds, out);
}


/* ===== Туризм: страницы мест + объявления ===== */
function openTourismPlace(placeKey) {
  state.view = "tourism_place";
  state.tourismPlaceKey = placeKey;
  state.currentCatId = "tourism";
  state.currentAdId = null;
  hideMenu();
  hideLangPop();
  renderGrid();
  renderCurrentView(searchInput.value);
}


function getTourismSectionIntro(placeKey) {
  const ru = {
    mountains: "ШахДаг и горы рядом с Кусарами — одно из самых популярных направлений. Зимой здесь держится снег и работает горнолыжная инфраструктура, а летом люди едут за панорамами Большого Кавказа, прогулками и фототочками.",
    parks: "Зелёные зоны и места для прогулок: парки, набережные и спокойные локации.",
    sights: "Достопримечательности и красивые виды: смотровые точки, природные маршруты, интересные места.",
    restaurants: "Где вкусно поесть: кафе, семейные рестораны, местная кухня.",
    hotels: "Где остановиться: отели, гостевые дома, варианты для отдыха.",
    relax: "Места для отдыха: пикник‑зоны, спокойные виды и прогулочные маршруты."
  };
  return ru[placeKey] || "";
}

function openTourismPostModal(post){
  // лёгкий модал без зависимостей
  const old = document.getElementById("tourismPostModal");
  if (old) old.remove();

  const imgs = Array.isArray(post?.images) ? post.images.filter(Boolean) : [];
  const photos = imgs.map((src, idx) => {
    const cls = idx === 0 ? "tourismDetail__photo tourismDetail__photo--main" : "tourismDetail__photo tourismDetail__photo--secondary";
    const label = `${post.title || ""} — фото ${idx + 1}`;
    return `<div class="${cls}" style="background-image:url('${src}')" role="button" tabindex="0" data-src="${src}" aria-label="${escapeHtml(label)}"></div>`;
  }).join("");

  const wrap = document.createElement("div");
  wrap.id = "tourismPostModal";
  wrap.className = "modal";
  wrap.innerHTML = `
    <div class="modal__backdrop" data-close="1"></div>
    <div class="modal__panel">
      <div class="modal__top">
        <div class="modal__title">${escapeHtml(post.title || "")}</div>
        <button class="iconBtn" type="button" id="tpClose" aria-label="Close">✕</button>
      </div>
      <div class="modal__body">
        <div class="modal__content">
          ${photos ? `<div class="tourismDetail__photos">${photos}</div>` : ``}
          <div class="tourismPost__body">${escapeHtml(post.body || "").replaceAll("\n", "<br>")}</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  lockBodyScroll(true);

  const close = () => { try{ wrap.remove(); }catch{}; lockBodyScroll(false); };
  wrap.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute && e.target.getAttribute("data-close") === "1") close();
  });
  const b = wrap.querySelector("#tpClose");
  if (b) b.addEventListener("click", close);

  wrap.querySelectorAll(".tourismDetail__photo").forEach((photo) => {
    const src = photo.getAttribute("data-src") || "";
    const open = () => { try{ window.open(src, "_blank"); }catch{} };
    photo.addEventListener("click", open);
    photo.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(); });
  });
}

function renderTourismPlacePage(placeKey) {
  elGrid.innerHTML = "";

  const intro = getTourismSectionIntro(placeKey);

  const wrap = document.createElement("div");
  wrap.className = "tourismSection";
  wrap.innerHTML = `
    ${intro ? `<div class="tourismDetail__intro">${escapeHtml(intro)}</div>` : ``}
    <div class="tourismPostList" id="tourismPostList">${escapeHtml(t("loading") || "Загрузка…")}</div>
  `;
  elGrid.appendChild(wrap);

  const listEl = wrap.querySelector("#tourismPostList");

  (async () => {
    try{
      const params = new URLSearchParams();
      if (placeKey) params.set("section", placeKey);
      const posts = await apiJson(`/api/tourism/posts?${params.toString()}`);
      if (!Array.isArray(posts) || posts.length === 0){
        listEl.innerHTML = `<div class="adminEmpty">Публикаций пока нет.</div>`;
        return;
      }

      const cards = posts.map((p) => {
        const cover = Array.isArray(p.images) && p.images[0] ? p.images[0] : "";
        const excerpt = String(p.body || "").trim().slice(0, 180);
        return `
          <div class="tourismPostCard" role="button" tabindex="0" data-tpid="${escapeHtml(p.id)}">
            <div class="tourismPostCard__img" style="background-image:url('${cover}')"></div>
            <div class="tourismPostCard__meta">
              <div class="tourismPostCard__title">${escapeHtml(p.title || "")}</div>
              <div class="tourismPostCard__text">${escapeHtml(excerpt)}${excerpt.length >= 180 ? "…" : ""}</div>
            </div>
          </div>
        `;
      }).join("");

      listEl.innerHTML = cards;

      // click
      listEl.querySelectorAll(".tourismPostCard").forEach((card) => {
        const id = card.getAttribute("data-tpid");
        const post = posts.find(x => String(x.id) === String(id));
        if (!post) return;
        const open = () => openTourismPostModal(post);
        card.addEventListener("click", open);
        card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(); });
      });

    }catch(e){
      listEl.innerHTML = `<div class="adminEmpty">Ошибка загрузки.</div>`;
    }
  })();
}


function renderCategoryRecommendations(cat, query = "") {
  elAds.innerHTML = "";
  if (!cat) { renderEmptyBox(); return; }

  const subId = String(state.currentSubId || "");
  const subLabel = subId ? (getSubcatName(cat, subId) || "") : (t("filterAny") || "Все");

  // Верхнее меню выбора подкатегории (по нажатию открывается модалка со списком)
  const head = document.createElement("div");
  head.className = "catTabHead";
  head.innerHTML = `
    <button class="catTabBtn" type="button" id="btnOpenSubcats">
      <span class="catTabBtn__label">
        <span>${escapeHtml(getCatName(cat))}</span>
        <span class="catTabBtn__sub">${escapeHtml(subLabel)}</span>
      </span>
      <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.4 8.6a1 1 0 0 1 1.4 0L12 11.8l3.2-3.2a1 1 0 1 1 1.4 1.4l-3.9 3.9a1.2 1.2 0 0 1-1.7 0L7.4 10a1 1 0 0 1 0-1.4z"/>
      </svg>
    </button>
  `;
  elAds.appendChild(head);
  const btnOpenSubcats = head.querySelector("#btnOpenSubcats");
  if (btnOpenSubcats) btnOpenSubcats.addEventListener("click", openSubcatModal);

  const all = loadAds();
  let inCat = all.filter(a => a.categoryId === cat.id);
  inCat = filterAds(inCat, query);

  // если выбрана подкатегория — показываем только её
  if (subId) {
    inCat = inCat.filter(a => (a.subcategoryId || "") === subId);
  }

  if (inCat.length === 0) {
    const box = document.createElement("div");
    box.className = "empty";
    box.innerHTML = `
      <div>
        <div class="empty__text">${escapeHtml(t("emptyRecTitleStart"))}${escapeHtml(getCatName(cat))}${escapeHtml(t("emptyRecTitleEnd"))}</div>
        ${subId ? `<div class="empty__sub">${escapeHtml((lang === "en") ? "Subcategory" : (lang === "az") ? "Alt kateqoriya" : (lang === "ar") ? "الفئة الفرعية" : "Подкатегория")}: <b>${escapeHtml(subLabel)}</b></div>` : ``}
        <div class="empty__sub">${escapeHtml(t("emptyRecSub"))}</div>
      </div>
      <div>
        <button class="btn primary" type="button" id="btnCreate2">${escapeHtml(t("createBtn"))}</button>
      </div>
    `;
    elAds.appendChild(box);
    document.getElementById("btnCreate2").addEventListener("click", openModal);
    return;
  }

  const MAX_TOTAL = 24;
  const out = shuffleArray(inCat).slice(0, MAX_TOTAL);
  const grid = document.createElement("div");
  grid.className = "adlist";
  out.forEach(a => grid.appendChild(renderAdCard(a)));
  elAds.appendChild(grid);
  wireAdClicks(elAds);
  wireAdButtons(elAds, out);
}

/* ===== Вкладка: объявление ===== */
function openAd(adId){
  state.returnView = state.view;
  state.returnCatId = state.currentCatId;
  state.returnQuery = searchInput.value;

  state.view = "ad";
  state.currentAdId = adId;

  renderGrid();
  renderCurrentView(state.returnQuery);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAdView(adId){
  const list = loadAds();
  const ad = list.find(x => x.id === adId) || null;

  elAds.innerHTML = "";
  if (!ad) { renderEmptyBox(); return; }

  const cat = data.find(x => x.id === ad.categoryId) || null;
  const catName = cat ? getCatName(cat) : "";
  const subName = cat ? (getSubcatName(cat, ad.subcategoryId) || "") : "";

  const dt = new Date(ad.date);
  const dstr = formatDate(dt);

  const favs = loadFavs();
  const isFav = favs.has(ad.id);

  const telHref = buildTelHref(ad.phone);
  const waHref = buildWhatsAppHref(ad.phone, ad.title);

  const mapUrl = buildMapUrl(ad);
  const hasMap = !!mapUrl;

  const wrap = document.createElement("div");
  wrap.className = "adview";

  wrap.innerHTML = `
    <div class="adview__img">
      ${ad.photoDataUrl
        ? `<img src="${ad.photoDataUrl}" alt="">`
        : `<div class="adview__imgFallback">${escapeHtml(t("photoFallback"))}</div>`
      }
    </div>

    <div class="adview__side">
      <div class="adview__meta">${escapeHtml(catName)} • ${escapeHtml(subName)}${dstr ? ` • ${escapeHtml(dstr)}` : ""}</div>
      <h3 class="adview__title">${escapeHtml(ad.title || "")}</h3>
      <div class="adview__price">${formatPrice(ad.price)} ₽</div>
      ${renderAdExtraBlock(ad)}

      <div class="adview__buttons">
        ${hasMap ? `<a class="btn" href="${escapeHtmlAttr(mapUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("mapBtn"))}</a>` : ``}
        ${telHref ? `<a class="btn primary" href="${escapeHtmlAttr(telHref)}">${escapeHtml(t("callBtn"))}</a>` : ``}
        ${waHref ? `<a class="btn" href="${escapeHtmlAttr(waHref)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("waBtn"))}</a>` : ``}
        <button class="btn ${isFav ? "favActive" : ""}" type="button" id="btnFavToggle">
          ${escapeHtml(isFav ? t("favRemove") : t("favAdd"))}
        </button>
      </div>

      <div class="adview__desc">${escapeHtml(ad.desc || "")}</div>

      <div class="reviews" id="reviews">
        <div class="reviews__head">
          <div class="reviews__title">${escapeHtml(t("reviewsTitle"))}</div>
          <div class="ratingSummary" id="ratingSummary"></div>
        </div>

        <div id="reviewArea"></div>
        <div class="reviewList" id="reviewList"></div>
      </div>
    </div>
  `;

  elAds.appendChild(wrap);
  hydrateReviews(ad.id);

  const btnFavToggle = document.getElementById("btnFavToggle");
  btnFavToggle.addEventListener("click", () => {
    toggleFavorite(ad.id);
    renderAdView(ad.id);
  });

function renderAdExtraBlock(ad){
  const ex = ad?.extra || {};
  const items = [];

  if (ex.carMake) items.push(`${t("carMake")}: ${escapeHtml(ex.carMake)}`);
  if (ex.carModel) items.push(`${t("carModel")}: ${escapeHtml(ex.carModel)}`);
  if (ex.carEngine) items.push(`${t("carEngine")}: ${escapeHtml(String(ex.carEngine))}`);

  if (ex.carTransmission) {
    const map = { manual: t("trManual"), auto: t("trAuto"), cvt: t("trCvt"), robot: t("trRobot") };
    items.push(`${t("carTransmission")}: ${escapeHtml(map[ex.carTransmission] || ex.carTransmission)}`);
  }
  if (ex.carFuelSystem) {
    const map = { injector: t("fuelInjector"), carb: t("fuelCarb") };
    items.push(`${t("carFuelSystem")}: ${escapeHtml(map[ex.carFuelSystem] || ex.carFuelSystem)}`);
  }
  if (ex.carCondition) {
    const map = { new: t("condNew"), used: t("condUsed") };
    items.push(`${t("carCondition")}: ${escapeHtml(map[ex.carCondition] || ex.carCondition)}`);
  }

// недвижимость
if (ex.realtyRooms) items.push(`${t("realtyRooms")}: ${escapeHtml(String(ex.realtyRooms))}`);
if (ex.realtyHectare) items.push(`${t("realtyHectareMin")}: ${escapeHtml(String(ex.realtyHectare))}`);

// электроника
if (ex.elecBrand) items.push(`${t("elecBrand")}: ${escapeHtml(String(ex.elecBrand))}`);


  if (items.length === 0) return "";
  return `<div class="adextra">${items.join(" • ")}</div>`;
}

}

/* ===== Карточка объявления ===== */
function renderAdCard(a) {
  const ad = document.createElement("div");
  ad.className = "ad";
  ad.setAttribute("data-open", a.id);

  const dt = new Date(a.date);
  const dstr = formatDate(dt);

  const cat = data.find(x => x.id === a.categoryId) || null;
  const catName = cat ? getCatName(cat) : "";
  const subName = cat ? (getSubcatName(cat, a.subcategoryId) || "") : "";

  ad.innerHTML = `
    <div class="ad__img">
      ${a.photoDataUrl ? `<img src="${a.photoDataUrl}" alt="">` : `${escapeHtml(t("photoFallback"))}`}
    </div>
    <div class="ad__body">
      <p class="ad__title">${escapeHtml(a.title || "")}</p>
      <p class="ad__meta">
        ${escapeHtml(catName)} • ${escapeHtml(subName)}<br>
        ${escapeHtml(dstr)}
      </p>
      <div class="ad__price">${formatPrice(a.price)} ₽</div>
      <div class="ad__actions">
        ${hasLocation(a) ? `<button class="btn small" type="button" data-map="${escapeHtmlAttr(a.id)}">${escapeHtml(t("mapBtn"))}</button>` : ``}
      </div>
    </div>
  `;

  return ad;
}

function wireAdClicks(root){
  root.querySelectorAll("[data-open]").forEach((card) => {
    card.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.closest && target.closest("[data-map]")) return;

      const id = card.getAttribute("data-open");
      if (id) openAd(id);
    });
  });
}

function wireAdButtons(root, adsList) {
  root.querySelectorAll("[data-map]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-map");
      const ad = adsList.find(x => x.id === id) || loadAds().find(x => x.id === id);
      if (!ad) return;

      const url = buildMapUrl(ad);
      if (!url) {
        alert(t("alertNoMap"));
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
}

/* ===== Поиск ===== */
function filterAdsByQuery(list, query){
  const q = String(query || "").trim().toLowerCase();
  if (!q) return list;

  return list.filter(a => {
    const info = getAdCategoryTexts(a);
    const hay = (
      (a.title || "") + " " +
      (a.desc || "") + " " +
      info.catAll + " " +
      info.subAll + " " +
      (a.address || "") + " " +
      (a.phone || "")
    ).toLowerCase();
    return hay.includes(q);
  });
}

/* ===== Карта (открыть OSM) ===== */
function buildMapUrl(a){
  const coords = parseCoords(String(a.coords || "").trim());
  if (coords) {
    const { lat, lon } = coords;
    return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=16/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;
  }
  const address = String(a.address || "").trim();
  if (address) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  }
  return "";
}

function parseCoords(s){
  if (!s) return null;
  const cleaned = s.replace(/\s+/g, "");
  const m = cleaned.match(/^(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)$/);
  if (!m) return null;

  const lat = Number(m[1]);
  const lon = Number(m[3]);
  if (!isFinite(lat) || !isFinite(lon)) return null;
  if (lat < -90 || lat > 90) return null;
  if (lon < -180 || lon > 180) return null;

  return { lat: String(lat), lon: String(lon) };
}
function isValidCoords(s){ return !!parseCoords(s); }

function hasLocation(a){
  return !!String(a.address || "").trim() || isValidCoords(String(a.coords || "").trim());
}

/* ===== Выбор точки на карте (Leaflet) ===== */
function openMapModal(){
  mapModal.hidden = false;
  lockBodyScroll(true);

  initLeafletIfNeeded();

  const existing = parseCoords(String(inpCoords.value || "").trim());
  if (existing && mapInstance) {
    const lat = Number(existing.lat);
    const lon = Number(existing.lon);
    selectedLatLng = { lat, lng: lon };
    setMarker(lat, lon, true);
  } else {
    const defLat = 41.4269;
    const defLon = 48.4351;
    if (mapInstance) mapInstance.setView([defLat, defLon], 12);
    selectedLatLng = null;
    if (mapMarker) { mapInstance.removeLayer(mapMarker); mapMarker = null; }
  }

  setTimeout(() => {
    try { mapInstance && mapInstance.invalidateSize(); } catch {}
  }, 120);
}

function closeMapModal(){
  mapModal.hidden = true;
  lockBodyScroll(false);
}


/* ===== Модалка: фильтр (пустая вкладка) ===== */
function openFilterModal(){
  if (!filterModal) return;
  hideLangPop();

  // удобный дефолт: если мы внутри категории — подставим её, но только если фильтр ещё не выбран
  if (state.view === "subcats" && !state.filters?.categoryId && state.currentCatId) {
    state.filters.categoryId = state.currentCatId;
  }

  if (filterModalTitle) filterModalTitle.textContent = t("filterTitle");
  renderFilterModal();
  filterModal.hidden = false;
  lockBodyScroll(true);
}
function closeFilterModal(){
  if (!filterModal) return;
  filterModal.hidden = true;
  lockBodyScroll(false);
}

/* ===== ФИЛЬТРЫ: UI + ЛОГИКА ===== */
function getCarData(){
  const raw = (window.CAR_DATA && window.CAR_DATA.modelsByMake) ? window.CAR_DATA.modelsByMake : {};
  return raw && typeof raw === "object" ? raw : {};
}

const ELECTRONICS_BRANDS = {
  phones: [
    "Apple", "Samsung", "Xiaomi", "Huawei", "Honor", "Realme", "OPPO", "Vivo", "Google", "OnePlus",
    "Nokia", "Sony", "Motorola", "Infinix", "Tecno", "ZTE", "Nothing", "Meizu"
  ],
  tablets: [
    "Apple", "Samsung", "Huawei", "Xiaomi", "Lenovo", "Amazon", "Microsoft", "Honor", "Realme"
  ],
  laptops: [
    "Apple", "Lenovo", "HP", "Dell", "ASUS", "Acer", "MSI", "Huawei", "Microsoft", "Samsung", "LG", "Razer"
  ]
};

function getElectronicsBrands(subId){
  const arr = ELECTRONICS_BRANDS[subId] || [];
  return arr.slice().sort((a,b) => a.localeCompare(b, "ru"));
}

function normalizeDecimal(v){
  const s = String(v || "").trim().replace(",", ".");
  const cleaned = s.replace(/[^0-9.]/g, "");
  if (!cleaned) return "";
  // оставляем только первую точку
  const parts = cleaned.split(".");
  if (parts.length <= 1) return parts[0];
  return parts[0] + "." + parts.slice(1).join("");
}
function normalizeInt(v){
  const s = String(v || "").trim().replace(/[^0-9]/g, "");
  return s;
}
function normalizeEngine(v){
  return normalizeDecimal(v);
}

function buildExtraForAd(fd, categoryId, subcategoryId){
  const extra = {};

  // авто
  if (categoryId === "transport" && subcategoryId === "cars") {
    const make = String(fd.get("carMake") || "").trim();
    const model = String(fd.get("carModel") || "").trim();
    const engine = normalizeEngine(fd.get("carEngine") || "");
    const tr = String(fd.get("carTransmission") || "").trim();
    const fuel = String(fd.get("carFuelSystem") || "").trim();
    const cond = String(fd.get("carCondition") || "").trim();

    if (make) extra.carMake = make;
    if (model) extra.carModel = model;
    if (engine) extra.carEngine = engine;
    if (tr) extra.carTransmission = tr;
    if (fuel) extra.carFuelSystem = fuel;
    if (cond) extra.carCondition = cond;
  }

  // недвижимость
  if (categoryId === "realty") {
    const rooms = normalizeInt(fd.get("realtyRooms") || "");
    const hect = normalizeDecimal(fd.get("realtyHectare") || "");
    if (rooms) extra.realtyRooms = rooms;
    if (hect) extra.realtyHectare = hect;
  }

  // электроника
  if (categoryId === "electronics" && ["phones","tablets","laptops"].includes(subcategoryId)) {
    const brand = String(fd.get("elecBrand") || "").trim();
    if (brand) extra.elecBrand = brand;
  }

  return extra;
}

function isCarContext(catId, subId){
  return catId === "transport" && subId === "cars";
}
function isElectronicsBrandContext(catId, subId){
  return catId === "electronics" && ["phones","tablets","laptops"].includes(subId);
}
function isRealtyContext(catId){
  return catId === "realty";
}

function setRealtyLocationVisibility(isRealty){
  if (!realtyLocationRow) return;
  realtyLocationRow.hidden = !isRealty;
  if (!isRealty){
    try{ inpAddress.value = ""; }catch{}
    try{ inpCoords.value = ""; }catch{}
    selectedLatLng = null;
  }
}

function getPriceRowLabels(catId){
  if (catId === "jobs") {
    return { min: t("filterSalaryMin"), max: t("filterSalaryMax") };
  }
  return { min: t("filterPriceMin"), max: t("filterPriceMax") };
}

function renderFilterModal(){
  if (!filterModalBody) return;

  const f = state.filters || { ...DEFAULT_FILTERS };

  filterModalBody.innerHTML = `
    <form id="filterForm" class="form form--filter">
      <div class="form__row">
        <label class="field">
          <span class="field__label">${escapeHtml(t("filterCategory"))}</span>
          <select id="fCategory"></select>
          <div class="filterHint">${escapeHtml(t("filterCategoryHint"))}</div>
        </label>

        <label class="field">
          <span class="field__label">${escapeHtml(t("filterSubcategory"))}</span>
          <select id="fSubcategory"></select>
          <div class="filterHint">${escapeHtml(t("filterSubHint"))}</div>
        </label>
      </div>

      <div id="filterDynamic"></div>

      <div class="form__row">
        <label class="field">
          <span class="field__label" id="fPriceMinLabel">${escapeHtml(t("filterPriceMin"))}</span>
          <input id="fPriceMin" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="0" />
        </label>
        <label class="field">
          <span class="field__label" id="fPriceMaxLabel">${escapeHtml(t("filterPriceMax"))}</span>
          <input id="fPriceMax" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="9999999" />
        </label>
      </div>

      <div class="filterActions">
        <button class="btn" type="button" id="btnFilterReset">${escapeHtml(t("filterReset"))}</button>
        <button class="btn primary" type="submit" id="btnFilterApply">${escapeHtml(t("filterApply"))}</button>
      </div>
    </form>
  `;

  const formEl = document.getElementById("filterForm");
  const catSel = document.getElementById("fCategory");
  const subSel = document.getElementById("fSubcategory");
  const dyn = document.getElementById("filterDynamic");
  const priceMin = document.getElementById("fPriceMin");
  const priceMax = document.getElementById("fPriceMax");
  const btnReset = document.getElementById("btnFilterReset");
  const priceMinLabel = document.getElementById("fPriceMinLabel");
  const priceMaxLabel = document.getElementById("fPriceMaxLabel");

  // fill category
  catSel.innerHTML = "";
  catSel.appendChild(new Option(t("filterAny"), ""));
  data.forEach(c => catSel.appendChild(new Option(getCatName(c), c.id)));
  catSel.value = f.categoryId || "";

  function fillSub(){
    subSel.innerHTML = "";
    subSel.appendChild(new Option(t("filterAny"), ""));

    const cat = data.find(x => x.id === catSel.value) || null;
    (cat?.subcats || []).forEach(s => subSel.appendChild(new Option(getSubcatName(cat, s.id), s.id)));

    // если подкатегория не подходит — сбросим
    const exists = Array.from(subSel.options).some(o => o.value === (f.subcategoryId || ""));
    subSel.value = exists ? (f.subcategoryId || "") : "";
    subSel.disabled = !cat;
  }

  function updatePriceLabels(){
    const labels = getPriceRowLabels(catSel.value);
    if (priceMinLabel) priceMinLabel.textContent = labels.min;
    if (priceMaxLabel) priceMaxLabel.textContent = labels.max;
  }

  function renderDynamic(){
    dyn.innerHTML = "";

    const catId = catSel.value;
    const subId = subSel.value;

    if (isCarContext(catId, subId)) {
      dyn.innerHTML = buildCarFilterFieldsHtml();
      wireCarFilterFields(dyn, f);
    } else if (isRealtyContext(catId)) {
      dyn.innerHTML = buildRealtyFilterFieldsHtml();
      wireRealtyFilterFields(dyn, f);
    } else if (isElectronicsBrandContext(catId, subId)) {
      dyn.innerHTML = buildElectronicsBrandFilterFieldsHtml();
      wireElectronicsBrandFilterFields(dyn, f, subId);
    } else {
      dyn.innerHTML = "";
    }

    updatePriceLabels();
  }

  fillSub();
  renderDynamic();

  // set price/salary values
  priceMin.value = (f.priceMin ?? "");
  priceMax.value = (f.priceMax ?? "");

  // только цифры для цены/зарплаты
  [priceMin, priceMax].forEach(inp => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/[^0-9]/g, "");
    });
  });

  catSel.addEventListener("change", () => {
    f.categoryId = catSel.value;
    f.subcategoryId = "";

    // сбрасываем спец.поля
    f.carMake = ""; f.carModel = ""; f.carEngine = ""; f.carTransmission = ""; f.carFuelSystem = ""; f.carCondition = "";
    f.realtyRooms = ""; f.realtyHectareMin = "";
    f.elecBrand = "";

    fillSub();
    renderDynamic();
  });

  subSel.addEventListener("change", () => {
    f.subcategoryId = subSel.value;

    // если ушли с авто — очистим авто-поля
    if (!isCarContext(catSel.value, subSel.value)) {
      f.carMake = ""; f.carModel = ""; f.carEngine = ""; f.carTransmission = ""; f.carFuelSystem = ""; f.carCondition = "";
    }
    // если ушли с электроники-брендов — очистим бренд
    if (!isElectronicsBrandContext(catSel.value, subSel.value)) {
      f.elecBrand = "";
    }

    renderDynamic();
  });

  btnReset.addEventListener("click", () => {
    state.filters = { ...DEFAULT_FILTERS };
    saveFilters(state.filters);
    updateFilterButtonBadge();
    renderCurrentView(searchInput.value);
    renderFilterModal(); // перерисуем форму
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const next = { ...DEFAULT_FILTERS, ...state.filters };

    next.categoryId = String(catSel.value || "");
    next.subcategoryId = String(subSel.value || "");
    next.priceMin = String(priceMin.value || "").replace(/[^0-9]/g, "");
    next.priceMax = String(priceMax.value || "").replace(/[^0-9]/g, "");

    // авто-поля
    if (isCarContext(next.categoryId, next.subcategoryId)) {
      next.carMake = String(document.getElementById("fCarMake")?.value || "");
      next.carModel = String(document.getElementById("fCarModel")?.value || "");
      next.carEngine = normalizeEngine(document.getElementById("fCarEngine")?.value || "");
      next.carTransmission = String(document.getElementById("fCarTransmission")?.value || "");
      next.carFuelSystem = String(document.getElementById("fCarFuelSystem")?.value || "");
      next.carCondition = String(document.getElementById("fCarCondition")?.value || "");
    }

    // недвижимость
    if (isRealtyContext(next.categoryId)) {
      next.realtyRooms = String(document.getElementById("fRealtyRooms")?.value || "");
      next.realtyHectareMin = normalizeDecimal(document.getElementById("fRealtyHectareMin")?.value || "");
    }

    // электроника
    if (isElectronicsBrandContext(next.categoryId, next.subcategoryId)) {
      next.elecBrand = String(document.getElementById("fElecBrand")?.value || "");
    }

    // валидация цены/зарплаты
    const nMin = next.priceMin ? Number(next.priceMin) : null;
    const nMax = next.priceMax ? Number(next.priceMax) : null;
    if (nMin !== null && nMax !== null && nMin > nMax) {
      alert(t("filterErrPrice"));
      return;
    }

    state.filters = next;
    saveFilters(state.filters);
    updateFilterButtonBadge();
    closeFilterModal();
    renderCurrentView(searchInput.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // badge
  updateFilterButtonBadge();
}

function buildCarFilterFieldsHtml(){
  return `
    <div class="form__row">
      <label class="field">
        <span class="field__label">${escapeHtml(t("carMake"))}</span>
        <select id="fCarMake"></select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carModel"))}</span>
        <select id="fCarModel"></select>
        <div class="filterHint">${escapeHtml(t("carModelHint"))}</div>
      </label>
    </div>

    <div class="form__row">
      <label class="field">
        <span class="field__label">${escapeHtml(t("carEngine"))}</span>
        <input id="fCarEngine" type="text" inputmode="decimal" placeholder="1.6" />
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carTransmission"))}</span>
        <select id="fCarTransmission"></select>
      </label>
    </div>

    <div class="form__row">
      <label class="field">
        <span class="field__label">${escapeHtml(t("carFuelSystem"))}</span>
        <select id="fCarFuelSystem"></select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carCondition"))}</span>
        <select id="fCarCondition"></select>
      </label>
    </div>
  `;
}

function wireCarFilterFields(root, f){
  const makeSel = root.querySelector("#fCarMake");
  const modelSel = root.querySelector("#fCarModel");
  const eng = root.querySelector("#fCarEngine");
  const tr = root.querySelector("#fCarTransmission");
  const fuel = root.querySelector("#fCarFuelSystem");
  const cond = root.querySelector("#fCarCondition");

  const dataCars = getCarData();
  const makes = Object.keys(dataCars).sort((a,b) => a.localeCompare(b, "ru"));

  // make
  makeSel.innerHTML = "";
  makeSel.appendChild(new Option(t("filterAny"), ""));
  makes.forEach(mk => makeSel.appendChild(new Option(mk, mk)));
  makeSel.value = f.carMake || "";

  function fillModels(){
    modelSel.innerHTML = "";
    modelSel.appendChild(new Option(t("filterAny"), ""));
    const mk = makeSel.value;
    const models = mk && dataCars[mk] ? dataCars[mk] : [];
    models.forEach(md => modelSel.appendChild(new Option(md, md)));
    modelSel.disabled = !mk;
    const exists = Array.from(modelSel.options).some(o => o.value === (f.carModel || ""));
    modelSel.value = exists ? (f.carModel || "") : "";
  }
  fillModels();

  makeSel.addEventListener("change", () => {
    f.carMake = makeSel.value;
    f.carModel = "";
    fillModels();
  });

  modelSel.addEventListener("change", () => {
    f.carModel = modelSel.value;
  });

  eng.value = f.carEngine || "";
  eng.addEventListener("input", () => {
    eng.value = eng.value.replace(/[^0-9\.,]/g, "");
  });

  // transmission
  tr.innerHTML = "";
  tr.appendChild(new Option(t("filterAny"), ""));
  tr.appendChild(new Option(t("trManual"), "manual"));
  tr.appendChild(new Option(t("trAuto"), "auto"));
  tr.appendChild(new Option(t("trCvt"), "cvt"));
  tr.appendChild(new Option(t("trRobot"), "robot"));
  tr.value = f.carTransmission || "";
  tr.addEventListener("change", () => f.carTransmission = tr.value);

  // fuel system
  fuel.innerHTML = "";
  fuel.appendChild(new Option(t("filterAny"), ""));
  fuel.appendChild(new Option(t("fuelInjector"), "injector"));
  fuel.appendChild(new Option(t("fuelCarb"), "carb"));
  fuel.value = f.carFuelSystem || "";
  fuel.addEventListener("change", () => f.carFuelSystem = fuel.value);

  // condition
  cond.innerHTML = "";
  cond.appendChild(new Option(t("filterAny"), ""));
  cond.appendChild(new Option(t("condNew"), "new"));
  cond.appendChild(new Option(t("condUsed"), "used"));
  cond.value = f.carCondition || "";
  cond.addEventListener("change", () => f.carCondition = cond.value);
}

/* Недвижимость: комнаты + гектар */
function buildRealtyFilterFieldsHtml(){
  return `
    <div class="form__row">
      <label class="field">
        <span class="field__label">${escapeHtml(t("realtyRooms"))}</span>
        <select id="fRealtyRooms">
          <option value="">${escapeHtml(t("filterAny"))}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5+</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("realtyHectareMin"))}</span>
        <input id="fRealtyHectareMin" type="text" inputmode="decimal" placeholder="0.5" />
      </label>
    </div>
  `;
}
function wireRealtyFilterFields(root, f){
  const rooms = root.querySelector("#fRealtyRooms");
  const hect = root.querySelector("#fRealtyHectareMin");

  rooms.value = f.realtyRooms || "";
  rooms.addEventListener("change", () => f.realtyRooms = rooms.value);

  hect.value = f.realtyHectareMin || "";
  hect.addEventListener("input", () => {
    hect.value = normalizeDecimal(hect.value);
    f.realtyHectareMin = hect.value;
  });
}

/* Электроника: бренд */
function buildElectronicsBrandFilterFieldsHtml(){
  return `
    <div class="form__row">
      <label class="field">
        <span class="field__label">${escapeHtml(t("elecBrand"))}</span>
        <select id="fElecBrand"></select>
      </label>
    </div>
  `;
}
function wireElectronicsBrandFilterFields(root, f, subId){
  const sel = root.querySelector("#fElecBrand");
  const brands = getElectronicsBrands(subId);

  sel.innerHTML = "";
  sel.appendChild(new Option(t("filterAny"), ""));
  brands.forEach(b => sel.appendChild(new Option(b, b)));

  sel.value = f.elecBrand || "";
  sel.addEventListener("change", () => f.elecBrand = sel.value);
}

function countActiveFilters(f){
  if (!f) return 0;
  let n = 0;
  const keys = Object.keys(DEFAULT_FILTERS);
  keys.forEach(k => {
    const val = String(f[k] ?? "");
    if (val) n++;
  });
  return n;
}

function updateFilterButtonBadge(){
  if (!btnFilter) return;
  const n = countActiveFilters(state.filters);
  btnFilter.classList.toggle("filterActive", n > 0);
}

/* Применение фильтров к списку объявлений */
function applyAdvancedFilters(list){
  const f = state.filters || DEFAULT_FILTERS;
  if (!f) return list;

  const nMin = f.priceMin ? Number(f.priceMin) : null;
  const nMax = f.priceMax ? Number(f.priceMax) : null;

  return list.filter(a => {
    if (f.categoryId && a.categoryId !== f.categoryId) return false;
    if (f.subcategoryId && a.subcategoryId !== f.subcategoryId) return false;

    if (nMin !== null && Number(a.price || 0) < nMin) return false;
    if (nMax !== null && Number(a.price || 0) > nMax) return false;

    const ex = a.extra || {};

    // авто
    if (f.carMake || f.carModel || f.carEngine || f.carTransmission || f.carFuelSystem || f.carCondition) {
      if (f.carMake && String(ex.carMake || "") !== f.carMake) return false;
      if (f.carModel && String(ex.carModel || "") !== f.carModel) return false;
      if (f.carEngine && normalizeEngine(ex.carEngine || "") !== normalizeEngine(f.carEngine)) return false;
      if (f.carTransmission && String(ex.carTransmission || "") !== f.carTransmission) return false;
      if (f.carFuelSystem && String(ex.carFuelSystem || "") !== f.carFuelSystem) return false;
      if (f.carCondition && String(ex.carCondition || "") !== f.carCondition) return false;
    }

    // недвижимость
    if (f.realtyRooms) {
      const r = normalizeInt(ex.realtyRooms || "");
      if (f.realtyRooms.endsWith("+")) {
        const minRooms = Number(f.realtyRooms.replace("+","")) || 0;
        if (!r || Number(r) < minRooms) return false;
      } else {
        if (String(r) !== String(f.realtyRooms)) return false;
      }
    }
    if (f.realtyHectareMin) {
      const h = Number(normalizeDecimal(ex.realtyHectare || ex.realtyHectareMin || ""));
      const minH = Number(normalizeDecimal(f.realtyHectareMin));
      if (isFinite(minH) && minH > 0) {
        if (!isFinite(h) || h < minH) return false;
      }
    }

    // электроника
    if (f.elecBrand) {
      if (String(ex.elecBrand || "") !== f.elecBrand) return false;
    }

    return true;
  });
}

function filterAds(list, query){
  const out = applyAdvancedFilters(list);
  return filterAdsByQuery(out, query);
}


/* ===== Модалка: все категории ===== */
function openCatsModal(){
  if (!catsModal) return;
  if (catsModalTitle) catsModalTitle.textContent = t("allCatsTitle");
  renderCatsModal();
  catsModal.hidden = false;
}
function closeCatsModal(){
  if (!catsModal) return;
  catsModal.hidden = true;
}
function renderCatsModal(){
  if (!catsModalGrid) return;
  catsModalGrid.innerHTML = "";

  const catsToRender = orderCats(data);

  catsToRender.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "card card--modal";
    card.setAttribute("role", "button");

    const chip = getCatChip(cat);

    card.innerHTML = `
      <div class="card__icon"><div class="card__iconBox"></div></div>
      ${chip ? `<div class="card__chip">${escapeHtml(chip)}</div>` : ``}
      <div class="card__top">
        <p class="card__title">${escapeHtml(getCatName(cat))}</p>
        <p class="card__desc">${escapeHtml(getCatDesc(cat))}</p>
      </div>
    `;

    const iconWrap = card.querySelector(".card__iconBox") || card.querySelector(".card__icon");
    const img = document.createElement("img");
    img.src = cat.icon;
    img.alt = getCatName(cat);
    img.loading = "lazy";
    // Крупные «обложки»-иконки (3D) лучше смотрятся как cover (без лишних белых полей)
    const coverIcons = [
      "tourism.png",
      "jobs.png",
      "transport.png",
      "services.png",
      "realty.png",
      "animals.png",
      "kids.png",
      "electronics.png",
      "free.png",
      "restaurants.png"
    ];
    if (coverIcons.some(n => String(cat.icon || "").endsWith(n))) {
      img.classList.add("icon--cover");
      if (String(cat.icon || "").endsWith("electronics.png")) {
        img.classList.add("icon--electronicsBoost");
      }
      if (iconWrap && iconWrap.classList) iconWrap.classList.add("iconBox--clear");
    }
    img.onerror = () => { img.style.display = "none"; };
    if (iconWrap) iconWrap.appendChild(img);

    card.addEventListener("click", () => {
      closeCatsModal();
      openSubcats(cat.id);
    });

    catsModalGrid.appendChild(card);
  });
}

function initLeafletIfNeeded(){
  if (mapInstance) return;

  mapInstance = L.map(leafletMapEl, { zoomControl: true }).setView([41.4269, 48.4351], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(mapInstance);

  mapInstance.on("click", (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    selectedLatLng = { lat, lng: lon };
    setMarker(lat, lon, false);
  });
}

function setMarker(lat, lon, fly){
  if (!mapInstance) return;
  const pos = [lat, lon];

  if (mapMarker) mapInstance.removeLayer(mapMarker);
  mapMarker = L.marker(pos).addTo(mapInstance);

  if (fly) mapInstance.setView(pos, 16);
}

function usePickedPoint(){
  if (!selectedLatLng) {
    alert(t("alertPickPoint"));
    return;
  }
  const lat = Number(selectedLatLng.lat);
  const lon = Number(selectedLatLng.lng);

  inpCoords.value = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  closeMapModal();
}

function flyToMyLocation(){
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      selectedLatLng = { lat, lng: lon };
      setMarker(lat, lon, true);
    },
    () => {},
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

/* ===== Телефон / WhatsApp ===== */
const PHONE_PREFIXES = {
  AZ: "+994",
  RU: "+7",
  SA: "+966"
};

function normalizePhone(raw){
  const s = String(raw || "").trim();
  let out = "";
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") out += ch;
    else if (ch === "+" && out.length === 0) out += "+";
  }
  return out;
}

function buildFullPhoneFromForm(countryCode, localPart){
  const prefix = PHONE_PREFIXES[String(countryCode || "AZ").toUpperCase()] || "+994";
  const raw = String(localPart || "").trim();
  if (!raw) return prefix;

  // allow pasting a full number
  if (raw.startsWith("+")) return normalizePhone(raw);

  let digits = raw.replace(/\D/g, "");
  digits = digits.replace(/^0+/, "");
  if (!digits) return prefix;

  const pDigits = prefix.replace(/\D/g, "");
  // if user already typed the country code digits, keep it
  if (digits.startsWith(pDigits) && digits.length >= 7) return "+" + digits;
  // if user typed another supported country code, keep it too
  if (digits.length >= 7 && (digits.startsWith("994") || digits.startsWith("7") || digits.startsWith("966"))) return "+" + digits;

  return prefix + digits;
}

function isValidPhone(raw){
  const n = normalizePhone(raw);
  const digits = n.replace(/\D/g, "");
  return digits.length >= 7;
}
function buildTelHref(phone){
  const n = normalizePhone(phone);
  const digits = n.replace(/\D/g, "");
  if (digits.length < 7) return "";
  return n.startsWith("+") ? `tel:${n}` : `tel:${digits}`;
}
function buildWhatsAppHref(phone, title){
  const n = normalizePhone(phone);
  const digits = n.replace(/\D/g, "");
  if (digits.length < 7) return "";
  const text = title ? `Здравствуйте! Интересует: ${title}` : "Здравствуйте!";
  return `https://wa.me/${encodeURIComponent(digits)}?text=${encodeURIComponent(text)}`;
}

/* ===== Избранные ===== */
function loadFavs(){
  try{
    const raw = lsGet(LS_FAV);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function saveFavs(set){
  lsSet(LS_FAV, JSON.stringify([...set]));
}
function toggleFavorite(adId){
  const fav = loadFavs();
  if (fav.has(adId)) fav.delete(adId);
  else fav.add(adId);
  saveFavs(fav);
}



/* ===== Категории: частота / последняя открытая ===== */
function loadCatStats(){
  try{
    const raw = lsGet(LS_CAT_STATS);
    const obj = raw ? JSON.parse(raw) : {};
    return (obj && typeof obj === "object") ? obj : {};
  } catch {
    return {};
  }
}
function saveCatStats(obj){
  lsSet(LS_CAT_STATS, JSON.stringify(obj || {}));
}
function bumpCatStats(catId){
  if (!catId) return;
  const stats = loadCatStats();
  const prev = stats[catId] || {};
  const next = {
    count: (prev.count || 0) + 1,
    lastOpen: Date.now()
  };
  stats[catId] = next;
  saveCatStats(stats);
}
function orderCats(list){
  const stats = loadCatStats();
  const baseIndex = new Map(list.map((c, i) => [c.id, i]));
  const arr = [...list];
  arr.sort((a, b) => {
    const sa = stats[a.id] || {};
    const sb = stats[b.id] || {};
    const la = sa.lastOpen || 0;
    const lb = sb.lastOpen || 0;
    if (lb !== la) return lb - la;
    const ca = sa.count || 0;
    const cb = sb.count || 0;
    if (cb !== ca) return cb - ca;
    return (baseIndex.get(a.id) || 0) - (baseIndex.get(b.id) || 0);
  });
  return arr;
}

/* ===== Модалки / меню ===== */
function openModal() {
  if (!isLoggedIn()) {
    requireAuth(() => openModal());
    return;
  }
  hideLangPop();
  modal.hidden = false;
  lockBodyScroll(true);

  fillCategorySelects();
  fillSubcategorySelect(selectCategory.value);
  renderCreateExtraFields();
}
function closeModal() {
  modal.hidden = true;
  lockBodyScroll(false);
}

function openSubcatModal(){
  const cat = getCurrentCategory();
  if (!cat) return;
  hideLangPop();
  hideMenu();

  // title
  if (subcatModalTitle) subcatModalTitle.textContent = getCatName(cat);

  // list
  if (subcatList) {
    subcatList.innerHTML = "";
    const items = [{ id: "", label: (t("filterAny") || "Все") }];
    (cat.subcats || []).forEach(s => items.push({ id: s.id, label: getSubcatName(cat, s.id) }));

    items.forEach(it => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "subcatItem" + ((state.currentSubId || "") === it.id ? " is-active" : "");
      btn.innerHTML = `
        <span>${escapeHtml(it.label)}</span>
        <span class="subcatItem__muted">›</span>
      `;
      btn.addEventListener("click", () => {
        state.currentSubId = it.id;
        closeSubcatModal();
        renderCurrentView(searchInput.value);
      });
      subcatList.appendChild(btn);
    });
  }

  subcatModal.hidden = false;
  lockBodyScroll(true);
}

function closeSubcatModal(){
  subcatModal.hidden = true;
  lockBodyScroll(false);
}

function showMenu() { menu.hidden = false; }
function hideMenu() { menu.hidden = true; }

function lockBodyScroll(locked){
  document.body.style.overflow = locked ? "hidden" : "";
}

/* ===== Селекты ===== */
function fillCategorySelects() {
  selectCategory.innerHTML = "";
  data.forEach((c) => {
    if (c.id === 'tourism') return; // Туризм не для объявлений
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = getCatName(c);
    selectCategory.appendChild(opt);
  });

  if (state.currentCatId) {
    selectCategory.value = state.currentCatId;
  } else {
    selectCategory.value = data.find(c=>c.id!=='tourism')?.id || "realty";
  }

  // если текущая категория не доступна в селекте (например, Туризм), выбираем первую доступную
  if (selectCategory && !Array.from(selectCategory.options).some(o => o.value === selectCategory.value)) {
    selectCategory.value = (selectCategory.options[0] && selectCategory.options[0].value) ? selectCategory.options[0].value : (data.find(c=>c.id!=='tourism')?.id || 'realty');
  }

  fillSubcategorySelect(selectCategory.value);
}
function fillSubcategorySelect(catId) {
  const cat = data.find((x) => x.id === catId);
  const subcats = (cat?.subcats || []);
  selectSubcategory.innerHTML = "";

  // Если подкатегорий нет (например, Туризм), скрываем поле и снимаем required
  if (!subcats.length) {
    if (subcatField) subcatField.style.display = "none";
    selectSubcategory.required = false;
    selectSubcategory.value = "";
    return;
  }

  if (subcatField) subcatField.style.display = "";
  selectSubcategory.required = true;

  subcats.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = getSubcatName(cat, s.id);
    selectSubcategory.appendChild(opt);
  });
}


/* ===== Доп.поля для размещения (по категории) ===== */
function updateCreatePriceLabelByCategory(){
  if (!lblPrice || !inpPrice) return;
  const catId = String(selectCategory?.value || "");
  if (catId === "jobs") {
    lblPrice.textContent = t("lblSalary");
    inpPrice.placeholder = t("phSalary");
  } else {
    lblPrice.textContent = t("lblPrice");
    inpPrice.placeholder = t("phPrice");
  }
}

function renderCreateExtraFields(){
  if (!extraFieldsWrap) return;

  const catId = String(selectCategory?.value || "");
  const subId = String(selectSubcategory?.value || "");

  updateCreatePriceLabelByCategory();
  setRealtyLocationVisibility(catId === "realty");

  // сохраняем введённые значения, если форма уже отрисована
  const prev = {
    // авто
    make: document.getElementById("cCarMake")?.value || "",
    model: document.getElementById("cCarModel")?.value || "",
    engine: document.getElementById("cCarEngine")?.value || "",
    tr: document.getElementById("cCarTransmission")?.value || "",
    fuel: document.getElementById("cCarFuelSystem")?.value || "",
    cond: document.getElementById("cCarCondition")?.value || "",

    // недвижимость
    rooms: document.getElementById("cRealtyRooms")?.value || "",
    hect: document.getElementById("cRealtyHectare")?.value || "",

    // электроника
    brand: document.getElementById("cElecBrand")?.value || ""
  };

  // Транспорт → Авто
  if (catId === "transport" && subId === "cars") {
    extraFieldsWrap.hidden = false;
    extraFieldsWrap.innerHTML = `
      <label class="field">
        <span class="field__label">${escapeHtml(t("carMake"))}</span>
        <select name="carMake" id="cCarMake"></select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carModel"))}</span>
        <select name="carModel" id="cCarModel"></select>
        <div class="filterHint">${escapeHtml(t("carModelHint"))}</div>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carEngine"))}</span>
        <input name="carEngine" id="cCarEngine" type="text" inputmode="decimal" placeholder="1.6" />
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carTransmission"))}</span>
        <select name="carTransmission" id="cCarTransmission"></select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carFuelSystem"))}</span>
        <select name="carFuelSystem" id="cCarFuelSystem"></select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("carCondition"))}</span>
        <select name="carCondition" id="cCarCondition"></select>
      </label>
    `;
    wireCarCreateFields(extraFieldsWrap, prev);
    return;
  }

  // Недвижимость → Комнаты + Гектар
  if (catId === "realty") {
    extraFieldsWrap.hidden = false;
    extraFieldsWrap.innerHTML = `
      <label class="field">
        <span class="field__label">${escapeHtml(t("realtyRooms"))}</span>
        <select name="realtyRooms" id="cRealtyRooms">
          <option value="">${escapeHtml(t("filterAny"))}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">${escapeHtml(t("realtyHectareMin"))}</span>
        <input name="realtyHectare" id="cRealtyHectare" type="text" inputmode="decimal" placeholder="0.5" />
      </label>
    `;
    wireRealtyCreateFields(extraFieldsWrap, prev);
    return;
  }

  // Электроника → Бренд (без моделей)
  if (catId === "electronics" && ["phones","tablets","laptops"].includes(subId)) {
    extraFieldsWrap.hidden = false;
    extraFieldsWrap.innerHTML = `
      <label class="field">
        <span class="field__label">${escapeHtml(t("elecBrand"))}</span>
        <select name="elecBrand" id="cElecBrand"></select>
      </label>
    `;
    wireElectronicsCreateFields(extraFieldsWrap, prev, subId);
    return;
  }

  extraFieldsWrap.hidden = true;
  extraFieldsWrap.innerHTML = "";
}

function wireCarCreateFields(root, prev){
  const makeSel = root.querySelector("#cCarMake");
  const modelSel = root.querySelector("#cCarModel");
  const eng = root.querySelector("#cCarEngine");
  const tr = root.querySelector("#cCarTransmission");
  const fuel = root.querySelector("#cCarFuelSystem");
  const cond = root.querySelector("#cCarCondition");

  const dataCars = getCarData();
  const makes = Object.keys(dataCars).sort((a,b) => a.localeCompare(b, "ru"));

  makeSel.innerHTML = "";
  makeSel.appendChild(new Option(t("filterAny"), ""));
  makes.forEach(mk => makeSel.appendChild(new Option(mk, mk)));
  makeSel.value = prev.make || "";

  function fillModels(){
    modelSel.innerHTML = "";
    modelSel.appendChild(new Option(t("filterAny"), ""));
    const mk = makeSel.value;
    const models = mk && dataCars[mk] ? dataCars[mk] : [];
    models.forEach(md => modelSel.appendChild(new Option(md, md)));
    modelSel.disabled = !mk;
    const exists = Array.from(modelSel.options).some(o => o.value === (prev.model || ""));
    modelSel.value = exists ? (prev.model || "") : "";
  }
  fillModels();

  makeSel.addEventListener("change", () => {
    prev.make = makeSel.value;
    prev.model = "";
    fillModels();
  });

  modelSel.addEventListener("change", () => {
    prev.model = modelSel.value;
  });

  eng.value = prev.engine || "";
  eng.addEventListener("input", () => {
    eng.value = eng.value.replace(/[^0-9\.,]/g, "");
  });

  tr.innerHTML = "";
  tr.appendChild(new Option(t("filterAny"), ""));
  tr.appendChild(new Option(t("trManual"), "manual"));
  tr.appendChild(new Option(t("trAuto"), "auto"));
  tr.appendChild(new Option(t("trCvt"), "cvt"));
  tr.appendChild(new Option(t("trRobot"), "robot"));
  tr.value = prev.tr || "";
  tr.addEventListener("change", () => prev.tr = tr.value);

  fuel.innerHTML = "";
  fuel.appendChild(new Option(t("filterAny"), ""));
  fuel.appendChild(new Option(t("fuelInjector"), "injector"));
  fuel.appendChild(new Option(t("fuelCarb"), "carb"));
  fuel.value = prev.fuel || "";
  fuel.addEventListener("change", () => prev.fuel = fuel.value);

  cond.innerHTML = "";
  cond.appendChild(new Option(t("filterAny"), ""));
  cond.appendChild(new Option(t("condNew"), "new"));
  cond.appendChild(new Option(t("condUsed"), "used"));
  cond.value = prev.cond || "";
  cond.addEventListener("change", () => prev.cond = cond.value);
}

function wireRealtyCreateFields(root, prev){
  const rooms = root.querySelector("#cRealtyRooms");
  const hect = root.querySelector("#cRealtyHectare");

  rooms.value = prev.rooms || "";
  rooms.addEventListener("change", () => prev.rooms = rooms.value);

  hect.value = prev.hect || "";
  hect.addEventListener("input", () => {
    hect.value = normalizeDecimal(hect.value);
    prev.hect = hect.value;
  });
}

function wireElectronicsCreateFields(root, prev, subId){
  const sel = root.querySelector("#cElecBrand");
  const brands = getElectronicsBrands(subId);

  sel.innerHTML = "";
  sel.appendChild(new Option(t("filterAny"), ""));
  brands.forEach(b => sel.appendChild(new Option(b, b)));

  sel.value = prev.brand || "";
  sel.addEventListener("change", () => prev.brand = sel.value);
}


/* ===== Storage ===== */
async function refreshAdsFromServer(){
  try{
    const list = await apiJson("/api/ads");
    SERVER_OK = true;
    ADS_CACHE = Array.isArray(list) ? list.map(normalizeAd).filter(Boolean) : [];
  }catch(e){
    SERVER_OK = false;
    // если сервер недоступен — покажем то, что есть (пусто)
    ADS_CACHE = ADS_CACHE || [];
  }
}

function loadAds() {
  return (ADS_CACHE || []).slice();
}

function saveAds(list) {
  // ads are stored on server (SQLite). This function exists for legacy code paths.
  ADS_CACHE = Array.isArray(list) ? list.map(normalizeAd).filter(Boolean) : [];
}

function normalizeAd(a){
  if (!a) return null;
  const title = String(a.title || "").trim();
  if (!title) return null;

  let categoryId = String(a.categoryId || "").trim();
  let subcategoryId = String(a.subcategoryId || "").trim();

  if (!categoryId || !subcategoryId) {
    const mapped = mapLegacyCategory(a.category, a.subcategory);
    categoryId = categoryId || mapped.categoryId;
    subcategoryId = subcategoryId || mapped.subcategoryId;
  }

  const cat = data.find(x => x.id === categoryId) || null;
  if (!cat) categoryId = data[0]?.id || "realty";

  const hasSub = (data.find(x => x.id === categoryId)?.subcats || []).some(s => s.id === subcategoryId);
  if (!hasSub) {
    subcategoryId = (data.find(x => x.id === categoryId)?.subcats || [])[0]?.id || "other";
  }

  return {
    id: String(a.id || ("ad_" + Date.now())).trim(),
    ownerId: (a.ownerId !== undefined && a.ownerId !== null) ? Number(a.ownerId) : (a.owner_id !== undefined ? Number(a.owner_id) : undefined),
    active: (a.active !== undefined && a.active !== null) ? Number(a.active) : 1,
    title,
    desc: String(a.desc || a.short || "").trim(),
    phone: normalizePhone(a.phone || ""),
    price: Number(a.price || 0),
    address: String(a.address || "").trim(),
    coords: String(a.coords || "").trim(),
    date: a.date || new Date().toISOString(),
    photoDataUrl: a.photoDataUrl || null,
    extra: sanitizeExtra(a.extra),
    categoryId,
    subcategoryId
  };
}


function sanitizeExtra(ex){
  if (!ex || typeof ex !== "object") return {};
  const out = {};

  // авто
  if (ex.carMake) out.carMake = String(ex.carMake).trim();
  if (ex.carModel) out.carModel = String(ex.carModel).trim();
  if (ex.carEngine) out.carEngine = normalizeEngine(ex.carEngine);
  if (ex.carTransmission) out.carTransmission = String(ex.carTransmission).trim();
  if (ex.carFuelSystem) out.carFuelSystem = String(ex.carFuelSystem).trim();
  if (ex.carCondition) out.carCondition = String(ex.carCondition).trim();

  // недвижимость
  if (ex.realtyRooms) out.realtyRooms = normalizeInt(ex.realtyRooms);
  if (ex.realtyHectare) out.realtyHectare = normalizeDecimal(ex.realtyHectare);

  // электроника
  if (ex.elecBrand) out.elecBrand = String(ex.elecBrand).trim();

  return out;
}

function formatPrice(n) {
  const x = Number(n || 0);
  return x.toLocaleString("ru-RU");
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/* ===== Утилиты ===== */
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeAnchorId(catId, subId) {
  return `rec_${catId}_${String(subId).toLowerCase()}`.replace(/[^a-z0-9_\-а-яё]/gi, "");
}

function renderEmptyBox() {
  const box = document.createElement("div");
  box.className = "empty";
  box.innerHTML = `
    <div>
      <div class="empty__text">${escapeHtml(t("emptyTitle"))}</div>
      <div class="empty__sub">${escapeHtml(t("emptySub"))}</div>
    </div>
    <div>
      <button class="btn primary" type="button" id="btnCreate2">${escapeHtml(t("createBtn"))}</button>
    </div>
  `;
  elAds.appendChild(box);
  document.getElementById("btnCreate2").addEventListener("click", openModal);
}

/* escaping */
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeHtmlAttr(s){
  return String(s).replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/* ===== Язык: storage ===== */
function loadLang(){
  const x = String(lsGet(LS_LANG) || "").toLowerCase();
  return LANG_ORDER.includes(x) ? x : "ru";
}
function saveLang(l){
  lsSet(LS_LANG, l);
}

/* ===== ФИЛЬТРЫ: storage ===== */
function loadFilters(){
  try{
    const raw = lsGet(LS_FILTERS);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return { ...DEFAULT_FILTERS };
    // мягкая миграция
    const out = { ...DEFAULT_FILTERS };
    for (const k of Object.keys(DEFAULT_FILTERS)){
      if (obj[k] !== undefined && obj[k] !== null) out[k] = String(obj[k]);
    }
    return out;
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}
function saveFilters(f){
  try{
    lsSet(LS_FILTERS, JSON.stringify(f || DEFAULT_FILTERS));
  } catch {}
}

function formatDate(dt){
  if (!dt || isNaN(dt.getTime())) return "";
  try{
    if (lang === "az") return dt.toLocaleDateString("az-Latn-AZ");
    if (lang === "en") return dt.toLocaleDateString("en-GB");
    if (lang === "ar") return dt.toLocaleDateString("ar");
    return dt.toLocaleDateString("ru-RU");
  } catch {
    return dt.toLocaleDateString();
  }
}

/* ===== Миграция старых объявлений ===== */
function migrateLegacyAds(){
  const already = lsGet(LS_KEY);
  if (already) return;

  const oldRaw = lsGet("kusary_ads_v1");
  if (!oldRaw) return;

  try{
    const arr = JSON.parse(oldRaw);
    if (!Array.isArray(arr)) return;

    const migrated = arr.map((a) => {
      const mapped = mapLegacyCategory(a.category, a.subcategory);

      const out = {
        id: a.id || ("ad_" + Date.now() + "_" + Math.random().toString(16).slice(2)),
        title: String(a.title || "").trim(),
        desc: String(a.desc || a.short || "").trim(),
        phone: normalizePhone(a.phone || ""),
        price: Number(a.price || 0),
        address: String(a.address || "").trim(),
        coords: String(a.coords || "").trim(),
        date: a.date || new Date().toISOString(),
        photoDataUrl: a.photoDataUrl || null,
        categoryId: mapped.categoryId,
        subcategoryId: mapped.subcategoryId
      };

      return normalizeAd(out);
    }).filter(Boolean);

    lsSet(LS_KEY, JSON.stringify(migrated));
  } catch {}
}

function mapLegacyCategory(catStr, subStr){
  const c = String(catStr || "").trim().toLowerCase();
  const s = String(subStr || "").trim().toLowerCase();

  let cat = data.find(x => (x.name?.ru || "").toLowerCase() === c) ||
            data.find(x => (x.name?.az || "").toLowerCase() === c) ||
            data.find(x => (x.name?.en || "").toLowerCase() === c) ||
            data.find(x => (x.name?.ar || "").toLowerCase() === c);

  if (!cat) {
    if (c.includes("недвиж") || c.includes("əmlak") || c.includes("real")) cat = data.find(x => x.id === "realty");
    else if (c.includes("трансп") || c.includes("nəql") || c.includes("transport")) cat = data.find(x => x.id === "transport");
    else if (c.includes("работ") || c.includes("iş") || c.includes("job")) cat = data.find(x => x.id === "jobs");
    else if (c.includes("живот") || c.includes("heyvan") || c.includes("animal")) cat = data.find(x => x.id === "animals");
    else if (c.includes("дет") || c.includes("uşaq") || c.includes("kid")) cat = data.find(x => x.id === "kids");
    else if (c.includes("элект") || c.includes("elektr") || c.includes("elect")) cat = data.find(x => x.id === "electronics");
    else if (c.includes("услуг") || c.includes("xidmət") || c.includes("service")) cat = data.find(x => x.id === "services");
    else if (c.includes("рест") || c.includes("rest") || c.includes("مطعم")) cat = data.find(x => x.id === "restaurants");
    else if (c.includes("отдам") || c.includes("даром") || c.includes("free") || c.includes("مجانا")) cat = data.find(x => x.id === "free");
  }
  if (!cat) cat = data[0];

  let sub = (cat.subcats || []).find(x => (x.name?.ru || "").toLowerCase() === s) ||
            (cat.subcats || []).find(x => (x.name?.az || "").toLowerCase() === s) ||
            (cat.subcats || []).find(x => (x.name?.en || "").toLowerCase() === s) ||
            (cat.subcats || []).find(x => (x.name?.ar || "").toLowerCase() === s);

  if (!sub) sub = (cat.subcats || [])[0];

  return {
    categoryId: cat.id,
    subcategoryId: sub?.id || (cat.subcats?.[0]?.id || "other")
  };
}

function getAdCategoryTexts(a){
  const cat = data.find(x => x.id === a.categoryId) || null;
  if (!cat) return { catAll:"", subAll:"" };
  const sub = (cat.subcats || []).find(s => s.id === a.subcategoryId) || null;
  const catAll = [cat.name?.ru, cat.name?.az, cat.name?.en, cat.name?.ar].filter(Boolean).join(" ");
  const subAll = sub ? [sub.name?.ru, sub.name?.az, sub.name?.en, sub.name?.ar].filter(Boolean).join(" ") : "";
  return { catAll, subAll };
}


/* ===== AUTH (server + SQLite) ===== */
function isLoggedIn(){
  return !!(auth && auth.user && auth.user.id);
}

function showAuthError(msg){
  if (!authError) return;
  authError.textContent = String(msg || "");
  authError.hidden = !msg;
}

function lockModalOn(){ lockBodyScroll(true); }
function lockModalOff(){ lockBodyScroll(false); }

function syncAuthLangButtons(){
  if (!authLang) return;
  authLang.querySelectorAll(".authLang__btn").forEach((b) => {
    const l = String(b.getAttribute("data-lang") || "").toLowerCase();
    if (!l) return;
    b.classList.toggle("isOn", l === lang);
  });
}

function openAuthModal(){
  hideMenu();
  hideLangPop();
  showAuthError("");
  if (authModal) authModal.hidden = false;
  lockModalOn();
  syncAuthLangButtons();
  if (authIdentifier) authIdentifier.focus();
}

function closeAuthModal(){
  if (authModal) authModal.hidden = true;
  lockModalOff();
}

function requireAuth(afterSuccess){
  auth.pendingAction = (typeof afterSuccess === "function") ? afterSuccess : null;
  openAuthModal();
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

async function refreshMe(){
  try{
    const me = await apiJson("/api/me");
    auth.user = me;
  } catch(e){
    auth.user = null;
  }
  updateAuthUI();
}

function updateAuthUI(){
  // top button
  if (btnAuth) btnAuth.textContent = isLoggedIn() ? `ID ${auth.user.id}` : t("authBtn");

  // menu items
  if (menuProfile) menuProfile.hidden = !isLoggedIn();
  if (menuLogout) menuLogout.hidden = !isLoggedIn();
  if (menuLogin) menuLogin.hidden = isLoggedIn();
  applyLanguageToStaticUI();
}

async function doRegister(){
  showAuthError("");
  const identifier = String(authIdentifier?.value || "").trim();
  const password = String(authPassword?.value || "").trim();
  if (!identifier || !password) { showAuthError("Заполни поля."); return; }

  try{
    await apiJson("/api/register", { method:"POST", body:{ identifier, password, remember: (authRemember ? !!authRemember.checked : true) } });
    await refreshMe();
    closeAuthModal();
    if (auth.pendingAction) { const f = auth.pendingAction; auth.pendingAction = null; f(); }
    else { goHome(); }
  }catch(e){
    showAuthError(e.message);
  }
}

async function doLogin(){
  showAuthError("");
  const identifier = String(authIdentifier?.value || "").trim();
  const password = String(authPassword?.value || "").trim();
  if (!identifier || !password) { showAuthError("Заполни поля."); return; }

  try{
    await apiJson("/api/login", { method:"POST", body:{ identifier, password, remember: (authRemember ? !!authRemember.checked : true) } });
    await refreshMe();
    closeAuthModal();
    if (auth.pendingAction) { const f = auth.pendingAction; auth.pendingAction = null; f(); }
    else { goHome(); }
  }catch(e){
    showAuthError(e.message);
  }
}

async function doLogout(){
  try{ await apiJson("/api/logout", { method:"POST" }); } catch {}
  auth.user = null;
  auth.pendingAction = null;
  updateAuthUI();
  goHome();
}

function openProfile(){
  if (!isLoggedIn()) { openAuthModal(); return; }
  const myId = auth.user.id;
  const ident = auth.user.identifier || "";
  const myAds = loadAds().filter(a => String(a.ownerId || "") === String(myId));
  const active = myAds.filter(a => (a.active ?? 1) === 1).length;
  const inactive = myAds.length - active;
  alert(`Профиль\nID: ${myId}\nЛогин/E-mail: ${ident}\n\nМои объявления: ${myAds.length}\nАктивные: ${active}\nНе активные: ${inactive}`);
}

function initAuth(){
  // initial UI sync (session is loaded in init())
  updateAuthUI();

  // language switcher inside auth modal
  if (authLang && !authLang.dataset.bound){
    authLang.dataset.bound = "1";
    authLang.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest(".authLang__btn") : null;
      if (!btn) return;
      const l = String(btn.getAttribute("data-lang") || "").toLowerCase();
      if (!l) return;
      setLanguage(l);
      syncAuthLangButtons();
    });
  }

  if (btnAuth) btnAuth.addEventListener("click", () => {
    if (isLoggedIn()) openProfile();
    else openAuthModal();
  });

  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute("data-close") === "1") closeAuthModal();
    });
  }
  if (btnCloseAuth) btnCloseAuth.addEventListener("click", closeAuthModal);
  if (btnDoRegister) btnDoRegister.addEventListener("click", doRegister);
  if (btnDoLogin) btnDoLogin.addEventListener("click", doLogin);
  if (authForm) authForm.addEventListener("submit", (e) => { e.preventDefault(); doLogin(); });
}

/* ===== REVIEWS (one per user per ad) ===== */
function renderStars(value, onPick, disabled = false){
  const wrap = document.createElement("div");
  wrap.className = "stars";

  const v = Number(value || 0);

  // 0 option
  const zero = document.createElement("button");
  zero.type = "button";
  zero.className = "btn small";
  zero.textContent = t("ratingZero");
  zero.disabled = disabled;
  zero.addEventListener("click", () => onPick(0));
  wrap.appendChild(zero);

  for (let i=1;i<=5;i++){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "starBtn" + (i <= v ? " isOn" : "");
    b.textContent = "★";
    b.disabled = disabled;
    b.addEventListener("click", () => onPick(i));
    wrap.appendChild(b);
  }
  return wrap;
}

async function hydrateReviews(adId){
  const summaryEl = document.getElementById("ratingSummary");
  const area = document.getElementById("reviewArea");
  const listEl = document.getElementById("reviewList");
  if (!area || !listEl) return;

  area.innerHTML = "";
  listEl.innerHTML = "";
  if (summaryEl) summaryEl.textContent = "";

  let reviews = [];
  try{
    reviews = await apiJson(`/api/ads/${encodeURIComponent(adId)}/reviews`);
  }catch{
    reviews = [];
  }

  const count = reviews.length;
  const avg = count ? (reviews.reduce((s,r)=> s + Number(r.rating||0), 0) / count) : 0;

  if (summaryEl){
    summaryEl.textContent = count ? `${t("ratingWord")}: ${avg.toFixed(1)} (${count})` : `${t("ratingWord")}: —`;
  }

  // Form area
  if (!isLoggedIn()){
    const box = document.createElement("div");
    box.className = "reviewForm";
    box.innerHTML = `<div style="color:var(--muted); font-size:14px;">${escapeHtml(t("reviewNeedLogin"))}</div>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn primary";
    btn.textContent = t("authBtn");
    btn.addEventListener("click", () => requireAuth(() => hydrateReviews(adId)));
    box.appendChild(btn);
    area.appendChild(box);
  } else {
    const myId = auth.user.id;
    const adObj = loadAds().find(a => String(a.id) === String(adId)) || null;
    const isOwner = adObj && String(adObj.ownerId || "") === String(myId);
    const my = reviews.find(r => Number(r.user_id) === Number(myId)) || null;

    let currentRating = my ? Number(my.rating || 0) : 0;

    const formWrap = document.createElement("div");
    formWrap.className = "reviewForm";

    const title = document.createElement("div");
    title.className = "reviews__title";
    title.textContent = my ? t("reviewLockedTitle") : t("yourReview");
    formWrap.appendChild(title);

    const starsHolder = document.createElement("div");

    function renderStarsUI(disabled){
      starsHolder.innerHTML = "";
      starsHolder.appendChild(renderStars(currentRating, (v) => {
        if (disabled) return;
        currentRating = v;
        renderStarsUI(false);
      }, disabled));
    }

    renderStarsUI(Boolean(my) || isOwner);
    formWrap.appendChild(starsHolder);

    const ta = document.createElement("textarea");
    ta.placeholder = t("reviewPlaceholder");
    ta.value = my ? String(my.comment || "") : "";
    if (my || isOwner) {
      ta.readOnly = true;
      ta.style.opacity = "0.9";
    }
    formWrap.appendChild(ta);

    if (my || isOwner) {
      const note = document.createElement("div");
      note.style.color = "var(--muted)";
      note.style.fontSize = "13px";
      note.textContent = my ? t("reviewLockedNote") : "Нельзя оставлять комментарии и оценки на своё объявление.";
      formWrap.appendChild(note);
    } else {
      const actRow = document.createElement("div");
      actRow.style.display = "flex";
      actRow.style.gap = "10px";

      const btnSend = document.createElement("button");
      btnSend.type = "button";
      btnSend.className = "btn primary";
      btnSend.textContent = t("reviewSend");

      btnSend.addEventListener("click", async () => {
        try{
          await apiJson(`/api/ads/${encodeURIComponent(adId)}/review`, { method:"POST", body:{ rating: currentRating, comment: String(ta.value || "").trim() } });
          await hydrateReviews(adId);
        }catch(e){
          alert(e.message);
        }
      });

      actRow.appendChild(btnSend);
      formWrap.appendChild(actRow);
    }

    area.appendChild(formWrap);
  }

  // List
  if (count === 0){
    const empty = document.createElement("div");
    empty.style.color = "var(--muted)";
    empty.style.fontSize = "14px";
    empty.textContent = "—";
    listEl.appendChild(empty);
    return;
  }

  reviews
    .slice()
    .sort((a,b) => String(b.updated_at||"").localeCompare(String(a.updated_at||"")))
    .forEach((r) => {
      const item = document.createElement("div");
      item.className = "reviewItem";
      const uid = Number(r.user_id);
      const rating = Number(r.rating || 0);
      const meta = document.createElement("div");
      meta.className = "reviewItem__meta";
      meta.innerHTML = `<span>ID ${escapeHtml(String(uid))}</span><span>${escapeHtml(String(rating))} ★</span>`;
      const text = document.createElement("div");
      text.className = "reviewItem__text";
      text.textContent = String(r.comment || "");
      item.appendChild(meta);
      item.appendChild(text);
      listEl.appendChild(item);
    });
}