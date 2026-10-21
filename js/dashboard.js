/* Dashboard behaviour: menu, view switching, filters, charts and demo interactions. */
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  /* ---------- Profile menu and mobile sidebar ---------- */
  const pb = $('#pbtn'), pm = $('#pmenu'), side = $('#side'), dm = $('#dm');
  const closeProfile = () => { pm.hidden = true; pb.setAttribute('aria-expanded', 'false'); };
  pb.addEventListener('click', () => { const open = pm.hidden; pm.hidden = !open; pb.setAttribute('aria-expanded', open); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.prof')) closeProfile(); });
  const setSide = (open) => { side.classList.toggle('open', open); dm.setAttribute('aria-expanded', open); dm.textContent = open ? 'Close' : 'Menu'; };
  dm.addEventListener('click', () => setSide(!side.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeProfile();
    if (side.classList.contains('open')) { setSide(false); dm.focus(); }
  });

  /* ---------- Left menu: show one view at a time (URL hash keeps the place) ---------- */
  const views = $$('.view'), links = $$('#side a[data-view]');
  const growBars = (root) => root.querySelectorAll('.bar i').forEach((i) => {
    i.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => { i.style.width = i.dataset.p + '%'; }));
  });
  const show = (id, focus) => {
    if (!$('#v-' + id)) id = links[0].dataset.view;
    views.forEach((v) => { v.hidden = v.id !== 'v-' + id; });
    links.forEach((l) => {
      const on = l.dataset.view === id;
      l.classList.toggle('on', on);
      on ? l.setAttribute('aria-current', 'page') : l.removeAttribute('aria-current');
    });
    growBars($('#v-' + id));
    if (focus) { scrollTo(0, 0); $('#v-' + id + ' h2').focus({ preventScroll: true }); }
  };
  addEventListener('hashchange', () => { show(location.hash.slice(1), true); setSide(false); });
  show(location.hash.slice(1), false);

  /* ---------- Table search and filter (works on any table with data-search / data-sel) ---------- */
  const applyRows = (id) => {
    const q = ($(`[data-search=${id}]`)?.value || '').toLowerCase();
    const s = $(`[data-sel=${id}]`)?.value || '';
    $$(`#${id} tbody tr`).forEach((r) => { r.hidden = !(r.textContent.toLowerCase().includes(q) && (!s || r.dataset.s === s)); });
  };
  $$('[data-search],[data-sel]').forEach((el) => {
    const id = el.dataset.search || el.dataset.sel;
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => applyRows(id));
  });
  const STATUS = { ok: ['Confirmed', 'b-ok', 'wait'], wait: ['Pending', 'b-wait', 'x'], x: ['Cancelled', 'b-x', 'ok'] };
  $$('.tog').forEach((b) => b.addEventListener('click', () => {
    const row = b.closest('tr'), next = STATUS[row.dataset.s][2], badge = row.querySelector('.badge');
    row.dataset.s = next; badge.textContent = STATUS[next][0]; badge.className = 'badge ' + STATUS[next][1]; applyRows('appt');
  }));

  /* ---------- Filter chips for card groups ---------- */
  $$('.fchips').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    $$(g.dataset.target).forEach((c) => { c.hidden = !(b.dataset.f === 'all' || c.dataset.s === b.dataset.f); });
  }));

  /* ---------- On/off toggles and adding a service ---------- */
  const bindToggle = (b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on);
    b.textContent = /Active|Paused/.test(b.textContent) ? (on ? 'Active' : 'Paused') : (on ? 'On' : 'Off');
  });
  $$('.sw').forEach(bindToggle);
  $('#addsvc')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#sn'), name = input.value.trim(), err = $('#sn-err');
    if (!name) { err.textContent = 'Enter a service name.'; input.focus(); return; }
    err.textContent = '';
    const card = document.createElement('div');
    card.className = 'panel';
    card.innerHTML = '<h3></h3><p>New service (demo)</p><button class="btn btn-ghost sm sw" aria-pressed="true">Active</button>';
    card.querySelector('h3').textContent = name;
    $('#svcs').append(card); bindToggle(card.querySelector('.sw')); input.value = '';
  });

  /* ---------- Messages: read and reply ---------- */
  $$('.inbox button').forEach((b) => b.addEventListener('click', () => {
    $$('.inbox button').forEach((x) => x.classList.toggle('sel', x === b));
    b.classList.remove('unread');
    $('#mfrom').textContent = b.dataset.from; $('#mbody').textContent = b.dataset.body;
    $('#mhint').hidden = true; $('#mopen').hidden = false; $('#rok').hidden = true;
  }));
  $('#reply')?.addEventListener('submit', (e) => { e.preventDefault(); $('#rok').hidden = false; $('#rt').value = ''; });

  /* ---------- Charts drawn with SVG ---------- */
  const bars = $('svg.bars');
  if (bars) {
    const d = bars.dataset.v.split(',').map(Number), L = bars.dataset.l.split(','), m = Math.max(...d);
    bars.innerHTML = d.map((v, i) => {
      const h = v / m * 120, x = 20 + i * 58;
      return `<rect x="${x}" y="${150 - h}" width="36" height="${h}" rx="10" fill="#2a7a80"><title>${L[i]}: ${v}</title></rect>` +
        `<text x="${x + 18}" y="${142 - h}" text-anchor="middle" font-size="13" font-weight="700" fill="#3f6249">${v}</text>` +
        `<text x="${x + 18}" y="172" text-anchor="middle" font-size="13" fill="#2a3631">${L[i]}</text>`;
    }).join('');
  }
  const line = $('svg.line');
  if (line) {
    const d = line.dataset.v.split(',').map(Number), step = 380 / (d.length - 1);
    const pts = d.map((v, i) => [20 + i * step, 140 - v / 10 * 120]);
    line.innerHTML = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#e8806a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
      pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#e8806a"><title>Week ${i + 1}: ${d[i]}</title></circle><text x="${p[0]}" y="162" text-anchor="middle" font-size="13">W${i + 1}</text>`).join('');
  }
  $('#exp')?.addEventListener('click', () => {
    const rows = $$('#appt tbody tr').map((r) => [...r.cells].slice(0, 5).map((c) => `"${c.textContent}"`).join(','));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['Client,Service,Caregiver,Time,Status\n' + rows.join('\n')], { type: 'text/csv' }));
    a.download = 'appointments.csv'; a.click(); URL.revokeObjectURL(a.href);
  });

  /* ---------- Client dashboard: goals, request form, rating, note, notifications ---------- */
  $$('.pcheck').forEach((c) => {
    const boxes = [...c.querySelectorAll('input')], bar = c.querySelector('.bar i'), out = c.querySelector('.cnt');
    const update = () => {
      const n = boxes.filter((b) => b.checked).length, pct = Math.round(n / boxes.length * 100);
      bar.dataset.p = pct; bar.style.width = pct + '%';
      out.textContent = `${n} of ${boxes.length} goals done`;
      c.querySelector('[role=progressbar]').setAttribute('aria-valuenow', pct);
    };
    boxes.forEach((b) => b.addEventListener('change', update)); update();
  });
  const dt = $('#dt');
  if (dt) {
    dt.min = new Date().toISOString().slice(0, 10);
    dt.addEventListener('input', () => { $('#dt-err').textContent = ''; dt.removeAttribute('aria-invalid'); });
    $('#req').addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('#dt-err'), ok = $('#req-ok');
      if (!dt.value) { err.textContent = 'Choose a date for your visit.'; dt.setAttribute('aria-invalid', 'true'); dt.setAttribute('aria-describedby', 'dt-err'); ok.hidden = true; dt.focus(); return; }
      const li = document.createElement('li');
      li.textContent = `${dt.value}: ${$('#svc').value} (requested)`;
      $('#upcoming').append(li); ok.textContent = 'Request sent (demo). We will confirm by phone.'; ok.hidden = false; dt.value = '';
    });
  }
  $$('.stars').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const n = [...g.children].indexOf(b) + 1;
    [...g.children].forEach((x, i) => x.setAttribute('aria-pressed', i < n));
    $('#rate-out').textContent = `Thanks! You rated Anita ${n} out of 5.`;
  }));
  $('#note')?.addEventListener('submit', (e) => { e.preventDefault(); $('#nok').hidden = false; $('#nt').value = ''; });
  $$('.dismiss').forEach((b) => b.addEventListener('click', () => {
    const ul = b.closest('ul'); b.closest('li').remove();
    if (!ul.children.length) ul.innerHTML = '<li>You are all caught up.</li>';
  }));
  $('#readall')?.addEventListener('click', () => $$('#notes li').forEach((li) => li.classList.remove('unread')));
})();
