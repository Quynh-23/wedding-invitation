/* ===================================================
   CẤU HÌNH THÔNG TIN THIỆP CƯỚI
   =================================================== */
const WEDDING = {
  groom: "Toàn Trung",
  bride: "Thị Ngọc",
  groomFull: "Nguyễn Toàn Trung",
  brideFull: "Trần Thị Ngọc",

  date: "2026-11-28",
  time: "08:00",

  venue: "TƯ GIA NỮ",
  address: "Thôn Kiều Huyên, Xã Phù Cát, Tỉnh Gia Lai",

  musicUrl: "audio/bai-hat-cuoi.mp3",

  groomAccount: "0123 456 789",
  brideAccount: "9876 543 210"
};

const PHOTO_LIST = [
  "images/gallery-1.jpg",
  "images/gallery-2.jpg",
  "images/gallery-3.jpg",
  "images/gallery-3-1.jpg",
  "images/gallery-3-2.jpg",
  "images/gallery-3-3.jpg",
  "images/gallery-4.jpg",
  "images/gallery-5.jpg"
];

const $ = (id) => document.getElementById(id);

function showToast(message) {
  const t = $('toast');
  if (!t) return;
  t.textContent = message;
  t.style.display = 'block';
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => (t.style.display = 'none'), 2600);
}

// Modal Hộp Quà
function openGift() {
  $('giftModal')?.classList.add('open');
}
function closeGift() {
  $('giftModal')?.classList.remove('open');
}

if ($('giftOpen')) $('giftOpen').addEventListener('click', openGift);
if ($('giftOpenTop')) $('giftOpenTop').addEventListener('click', openGift);
if ($('giftClose')) $('giftClose').addEventListener('click', closeGift);

if ($('giftModal')) {
  $('giftModal').addEventListener('click', (e) => {
    if (e.target === $('giftModal')) closeGift();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGift();
});

// Nút mở bản đồ Google Maps
if ($('mapBtn')) {
  $('mapBtn').addEventListener('click', () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(WEDDING.address),
      '_blank',
      'noopener'
    );
  });
}

// Sao chép số tài khoản
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Đã sao chép số tài khoản: ' + value);
    } catch (e) {
      showToast('Số tài khoản: ' + value);
    }
  });
});

// Render Lịch tháng cưới
function renderCalendar() {
  const grid = $('calendarGrid');
  if (!grid || !$('monthTitle')) return;

  const d = new Date(WEDDING.date + 'T12:00:00');
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  $('monthTitle').textContent = 'Tháng ' + (month + 1) + ', ' + year;
  grid.innerHTML = '';

  ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].forEach((x) => {
    const s = document.createElement('span');
    s.textContent = x;
    s.className = 'weekday';
    grid.appendChild(s);
  });

  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < first; i++) {
    const s = document.createElement('span');
    s.textContent = '';
    grid.appendChild(s);
  }

  for (let n = 1; n <= last; n++) {
    const s = document.createElement('span');
    s.textContent = n;
    s.className = 'day' + (n === day ? ' chosen' : '');
    if (n === day) {
      s.setAttribute('aria-label', 'Ngày cưới ' + n + '/' + (month + 1) + '/' + year);
      s.setAttribute('aria-current', 'date');
      s.title = 'Ngày cưới';
    }
    grid.appendChild(s);
  }
}

// Bộ đếm ngược Countdown
const TARGET_TIME = new Date(WEDDING.date + 'T' + WEDDING.time + ':00').getTime();

function updateCountdown() {
  if (!$('days') || !$('hours') || !$('minutes') || !$('seconds')) return;

  let delta = TARGET_TIME - Date.now();

  if (delta <= 0) {
    $('days').textContent = '0';
    $('hours').textContent = '0';
    $('minutes').textContent = '0';
    $('seconds').textContent = '0';
    return;
  }

  const days = Math.floor(delta / 86400000);
  delta %= 86400000;
  const hours = Math.floor(delta / 3600000);
  delta %= 3600000;
  const minutes = Math.floor(delta / 60000);
  const seconds = Math.floor((delta % 60000) / 1000);

  $('days').textContent = days;
  $('hours').textContent = hours;
  $('minutes').textContent = minutes;
  $('seconds').textContent = seconds;
}

// Cập nhật thông tin vào DOM
function applyConfig() {
  ['groomTop', 'groomMiddle'].forEach((id) => {
    if ($(id)) $(id).textContent = WEDDING.groom;
  });
  ['brideTop', 'brideMiddle'].forEach((id) => {
    if ($(id)) $(id).innerHTML = WEDDING.bride.replace(' ', '&nbsp;');
  });

  const d = new Date(WEDDING.date + 'T12:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if ($('dateLabel')) $('dateLabel').textContent = day + '.' + month + '.' + year;
  if ($('welcomeDate')) $('welcomeDate').textContent = day + '.' + month + '.' + year;
  if ($('welcomeCouple')) $('welcomeCouple').textContent = WEDDING.brideFull + ' & ' + WEDDING.groomFull;
  if ($('dateNumber')) $('dateNumber').textContent = day;
  if ($('yearSide')) $('yearSide').textContent = 'NĂM ' + year;

  const weekdays = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
  if ($('heroDate')) $('heroDate').innerHTML = day + ' THÁNG ' + month + '<br>' + year;
  if ($('heroTime')) $('heroTime').innerHTML = WEDDING.time + '<br>' + weekdays[d.getDay()];
  if ($('heroPlace')) $('heroPlace').innerHTML = WEDDING.venue + '<br>' + WEDDING.address.toUpperCase();

  if ($('invitationWeekday')) $('invitationWeekday').textContent = weekdays[d.getDay()];
  if ($('invitationDayMonth')) $('invitationDayMonth').textContent = day;
  if ($('invitationYear')) $('invitationYear').textContent = year;

  if ($('invitationTime')) $('invitationTime').textContent = WEDDING.time;
  if ($('invitationVenue')) $('invitationVenue').textContent = WEDDING.venue;
  if ($('invitationAddress')) $('invitationAddress').textContent = WEDDING.address;

  if ($('lunarDate')) {
    $('lunarDate').textContent = '(Nhằm ngày 20 tháng 10 năm Bính Ngọ)';
  }
  if ($('groomAccount')) $('groomAccount').textContent = WEDDING.groomAccount;
  if ($('brideAccount')) $('brideAccount').textContent = WEDDING.brideAccount;

  document.title = 'Thiệp cưới | ' + WEDDING.brideFull + ' & ' + WEDDING.groomFull;
}

// Slider Album ảnh
const thumbs = $('thumbs');
let activePhoto = 0;

PHOTO_LIST.forEach((src, i) => {
  const b = document.createElement('button');
  b.className = 'thumb' + (i === 0 ? ' active' : '');
  b.type = 'button';
  b.setAttribute('aria-label', 'Xem ảnh ' + (i + 1));
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Ảnh cưới ' + (i + 1);
  img.onerror = function () {
    this.onerror = null;
    this.removeAttribute('src');
    this.alt = 'Không thể tải ảnh';
  };
  b.appendChild(img);
  b.addEventListener('click', () => showPhoto(i));
  if (thumbs) thumbs.appendChild(b);
});

function showPhoto(i) {
  activePhoto = (i + PHOTO_LIST.length) % PHOTO_LIST.length;
  if ($('galleryMain')) $('galleryMain').src = PHOTO_LIST[activePhoto];
  if (thumbs) {
    [...thumbs.children].forEach((b, j) => b.classList.toggle('active', j === activePhoto));
  }
}

if ($('prevPhoto')) $('prevPhoto').addEventListener('click', () => showPhoto(activePhoto - 1));
if ($('nextPhoto')) $('nextPhoto').addEventListener('click', () => showPhoto(activePhoto + 1));

// Form RSVP
if ($('rsvpForm')) {
  $('rsvpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const entry = {
      name: String(data.get('guestName')).trim(),
      attendance: data.get('attendance'),
      count: data.get('guestCount'),
      message: String(data.get('guestMessage')).trim(),
      createdAt: new Date().toISOString()
    };
    if (!entry.name) {
      $('guestName').focus();
      return;
    }
    try {
      const entries = JSON.parse(localStorage.getItem('weddingRSVP') || '[]');
      entries.push(entry);
      localStorage.setItem('weddingRSVP', JSON.stringify(entries));
      $('formMsg').textContent = 'Cảm ơn ' + entry.name + '! Phản hồi đã được ghi nhận.';
    } catch (err) {
      $('formMsg').textContent = 'Cảm ơn ' + entry.name + '! Phản hồi đã được ghi nhận.';
    }
    e.currentTarget.reset();
    showToast('Đã ghi nhận phản hồi!');
  });
}

// Xử lý mở thiệp, hiệu ứng phong bì và nhạc nền
const overlay = $('welcome-overlay');
const openCardBtn = $('open-card-btn');
const audio = $('bgMusic');
const musicBtn = $('musicBtn');
const envelopeWrap = $('envelopeWrap');

function syncMusicButton(isPlaying) {
  if (!musicBtn) return;
  musicBtn.textContent = isPlaying ? 'Ⅱ' : '♫';
  musicBtn.setAttribute('aria-label', isPlaying ? 'Tắt nhạc' : 'Bật nhạc');
}

function playBackgroundMusic(showMessage = false) {
  if (!audio || !audio.paused) return;
  audio.play().then(() => {
    syncMusicButton(true);
    if (showMessage) showToast('♫ Đang phát nhạc thiệp cưới');
  }).catch((err) => {
    // Trình duyệt có thể chặn phát nhạc; khách vẫn mở thiệp bình thường.
    console.log('Audio playback was not started:', err);
    syncMusicButton(false);
  });
}

function openInvitation() {
  if (overlay && !overlay.classList.contains('opened')) {
    overlay.classList.add('opened');
  }

  // Mở phong bì sau khi lớp chào bắt đầu rời màn hình.
  if (envelopeWrap) {
    window.setTimeout(() => {
      envelopeWrap.classList.add('opened');
      envelopeWrap.setAttribute('aria-expanded', 'true');
    }, 420);
  }

  playBackgroundMusic(true);
}

// Chỉ nút "Chạm để mở thiệp" mới kích hoạt thao tác mở.
if (openCardBtn) openCardBtn.addEventListener('click', openInvitation);

if (musicBtn && audio) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => {
        syncMusicButton(true);
        showToast('Đã bật nhạc nền ♪');
      }).catch(() => syncMusicButton(false));
    } else {
      audio.pause();
      syncMusicButton(false);
      showToast('Đã tắt nhạc nền');
    }
  });
}

// Phong bì vẫn có thể đóng/mở lại bằng chuột hoặc bàn phím.
function toggleEnvelope() {
  if (!envelopeWrap) return;
  const isOpen = envelopeWrap.classList.toggle('opened');
  envelopeWrap.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) playBackgroundMusic(true);
}

if (envelopeWrap) {
  envelopeWrap.addEventListener('click', toggleEnvelope);
  envelopeWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleEnvelope();
    }
  });
}

// Khởi chạy khi tải trang
applyConfig();
renderCalendar();
updateCountdown();
setInterval(updateCountdown, 1000);