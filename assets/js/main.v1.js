/* Белпартнёргрупп: меню, аккордеон, до/после, паспорт элемента, бампер, форма */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;
  function openD() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a, button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false'); drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openD);
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeD); });
  }
  document.addEventListener('keydown', function (e) {
    if (!drawer || drawer.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') { closeD(); return; }
    if (e.key === 'Tab') {
      var f = drawer.querySelectorAll('a, button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 940 && drawer && drawer.getAttribute('data-open') === 'true') closeD();
  });

  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement, open = item.getAttribute('data-open') === 'true';
      item.parentElement.querySelectorAll('.faq__i').forEach(function (i) {
        i.setAttribute('data-open', 'false');
        var b = i.querySelector('.faq__q'); if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.setAttribute('data-open', 'true'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* до / после */
  var ba = $('ba');
  if (ba) {
    var range = $('baRange'), after = $('baAfter'), line = $('baLine'), knob = $('baKnob'), img = $('baImg');
    function setBA(v) {
      v = Math.max(0, Math.min(100, v));
      after.style.width = v + '%';
      line.style.left = v + '%';
      knob.style.left = v + '%';
      if (img) img.style.width = ba.getBoundingClientRect().width + 'px';
      range.value = String(v);
    }
    range.addEventListener('input', function () { setBA(+range.value); });
    ba.addEventListener('pointermove', function (e) {
      if (e.buttons !== 1 && e.pointerType !== 'mouse') return;
      var r = ba.getBoundingClientRect();
      setBA(((e.clientX - r.left) / r.width) * 100);
    });
    window.addEventListener('resize', function () { setBA(+range.value); });
    setBA(50);
  }

  /* паспорт элемента */
  var passOut = $('passOut') || $('passOut2');
  if (passOut) {
    var P = {
      bumper: ['Бампер', 'Пластик. Ремонт трещин и креплений, спецгрунт, эластичный лак.', '≈0,9 м²', '1–2 дня', '2–3 слоя базы',
        ['Дефектовка и разбор (парктроники, решётки)', 'Пайка и армирование трещин', 'Адгезионный грунт для пластика', 'Окрас базой и лаком с эластичной добавкой']],
      wing: ['Крыло', 'Металл или пластик. Часто после парковки: правка, шпатлёвка, окрас.', '≈0,6 м²', '1 день', '2 слоя базы',
        ['Оценка скрытых повреждений и коррозии', 'Правка и шпатлёвка локальных зон', 'Грунт и шлифовка', 'Окрас в цвет кузова']],
      hood: ['Капот', 'Большая плоская площадь: важна равномерность, чтобы не было полос.', '≈1,2 м²', '1–2 дня', '3 слоя базы',
        ['Снятие решётки и форсунок омывателя', 'Подготовка больших плоскостей без ступеней', 'Контроль равномерности базы', 'Лак и полировка']],
      door: ['Дверь', 'Окрас с разбором ручки и молдингов, при повреждении — правка.', '≈0,8 м²', '1–2 дня', '2–3 слоя базы',
        ['Демонтаж ручки, молдингов, зеркала', 'Ремонт кромок и вмятин', 'Окрас без следов маскировки', 'Сборка с новыми клипсами']],
      trunk: ['Крышка багажника', 'Часто с ремонтом кромки и аккуратной работой с проводкой.', '≈0,7 м²', '1 день', '2 слоя базы',
        ['Снятие эмблемы и накладок', 'Ремонт кромки и внутренней части', 'Окрас внешней и внутренней поверхности', 'Установка эмблемы после полимеризации']],
      mirror: ['Корпус зеркала', 'Мелкий пластик: окрас возможен только с разбором.', '≈0,1 м²', '1 день', '2 слоя базы',
        ['Разбор корпуса, снятие стекла', 'Грунт для пластика', 'Окрас двумя половинами', 'Сборка и проверка зазоров']],
      grille: ['Решётка', 'Много мелких рёбер: сложная подготовка, окрас только с демонтажом.', '≈0,2 м²', '1 день', '2 слоя базы',
        ['Демонтаж решётки и хрома', 'Аккуратная подготовка между рёбрами', 'Окрас без «паутины» и подтёков', 'Установка на место']],
      sill: ['Накладка порога', 'Гибкий пластик: нужна эластичная добавка, иначе трескается.', '≈0,3 м²', '1 день', '2 слоя базы',
        ['Снятие накладки и крепежа', 'Проверка гибкости и адгезии', 'Окрас с эластичной добавкой', 'Установка с новыми клипсами']]
    };
    function drawPass(k) {
      var d = P[k];
      passOut.innerHTML = '<span class="mono">паспорт детали</span><h3 style="margin-top:6px">' + d[0] + '</h3><p>' + d[1] + '</p>' +
        '<div class="pass__m"><div><b>' + d[2] + '</b><span>площадь окраса</span></div>' +
        '<div><b>' + d[3] + '</b><span>обычный срок</span></div>' +
        '<div><b>' + d[4] + '</b><span>слои покрытия</span></div></div>' +
        '<ul class="pass__list">' + d[5].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<p style="margin-top:14px;font-size:13.5px;color:var(--muted)">Площадь и срок — ориентировочные: зависят от модели и состояния детали.</p>';
      document.querySelectorAll('#passPick button, #passPick2 button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-p') === k ? 'true' : 'false');
      });
    }
    var pick = $('passPick');
    if (pick) pick.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { drawPass(b.getAttribute('data-p')); });
    });
    drawPass('bumper');
  }

  /* бампер */
  var bpOut = $('bpOut'), bpSeg = $('bpSeg');
  if (bpOut && bpSeg) {
    var B = {
      crack: ['Трещина', 'Спаиваем изнутри с армированием, затем готовим и красим.',
        ['Останавливаем трещину пайкой', 'Армируем изнутри, чтобы не пошла дальше', 'Шпатлюем, грунтуем, окрашиваем'], '1–2 дня', 'ремонт'],
      mount: ['Разбито крепление', 'Восстанавливаем посадочные места и клипсы: иначе бампер встанет с зазорами.',
        ['Восстанавливаем посадочные места', 'Проверяем геометрию по кузову', 'Ставим новые клипсы'], '1–2 дня', 'ремонт'],
      scuff: ['Потёртость и сколы', 'Поверхностные повреждения: подготовка и окрас элемента.',
        ['Обезжириваем и матуем поверхность', 'Грунтуем и шлифуем', 'Красим в цвет кузова'], '1 день', 'окрас'],
      deform: ['Деформация', 'Пластик потерял форму из-за удара.',
        ['Прогреваем и выправляем форму', 'Проверяем посадку по кузову', 'При сильной деформации рекомендуем замену'], '1–2 дня', 'по осмотру'],
      split: ['Разрыв в нескольких местах', 'Критичный случай: ремонт держится недолго.',
        ['Оцениваем рёбра жёсткости', 'Чаще всего предлагаем замену бампера', 'Окрас нового элемента в цвет кузова'], 'по детали', 'замена']
    };
    function drawBp(k) {
      var d = B[k];
      bpOut.innerHTML = '<h3>' + d[0] + '</h3><p>' + d[1] + '</p>' +
        '<ul class="pass__list">' + d[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<div class="chips" style="margin-top:12px"><span class="chip chip--on" style="display:inline-block;padding:6px 10px;border:1px solid var(--accent);border-radius:3px;font-family:var(--f-m);font-size:11px;text-transform:uppercase;color:var(--accent-d)">'
        + d[4] + ' · ' + d[3] + '</span></div>';
      bpSeg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-b') === k ? 'true' : 'false');
      });
    }
    bpSeg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { drawBp(b.getAttribute('data-b')); });
    });
    drawBp('crack');
  }

  var form = $('reqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var out = $('formout');
      if (!g('name') || !g('tel')) { out.textContent = 'Заполните имя и телефон'; return; }
      var msg = 'Заявка с сайта: ' + g('name') + ' · ' + g('tel') + ' · ' + g('car') + ' · ' + g('task') + (g('note') ? ' · ' + g('note') : '');
      out.textContent = 'Открываем WhatsApp с готовым сообщением';
      window.open('https://wa.me/375296580818?text=' + encodeURIComponent(msg), '_blank');
    });
  }
})();
