/* Y2 · Search Is the Interface: the sample index. ONE source for the build-time default results (node) and the
   in-page search. Sample data only: no network calls, no real footage, no people identified (DL-P07).
   Hit types map to documented features: transcripts with speaker labels (EV-440, EV-442), on-screen text / OCR
   (EV-442 document scanning, EV-136 metadata extraction), objects (EV-136 object detection). */
(function (root) {
  'use strict';
  var THUMBS = {
    talk: '<svg viewBox="0 0 160 90" focusable="false"><rect width="160" height="90" fill="#000D20"/><g stroke="#43DAFE" stroke-opacity=".16"><path d="M80 22L0 90M80 22l80 68M0 60h160"/></g><g fill="none" stroke="#B2B8C0" stroke-width="1.6" stroke-linecap="round"><circle cx="58" cy="36" r="6"/><path d="M58 42v21M48 52l10-5 10 5M58 63l-6 16M58 63l6 16"/><circle cx="102" cy="38" r="6"/><path d="M102 44v19M92 54l10-5 10 5M102 63l-6 16M102 63l6 16"/></g><rect x="22" y="71" width="116" height="9" rx="2" fill="#43DAFE" fill-opacity=".9"/></svg>',
    sign: '<svg viewBox="0 0 160 90" focusable="false"><rect width="160" height="90" fill="#000D20"/><g stroke="#43DAFE" stroke-opacity=".16"><path d="M80 20L0 90M80 20l80 70"/></g><rect x="44" y="18" width="72" height="38" rx="2" fill="none" stroke="#B2B8C0" stroke-width="1.4"/><path d="M80 56v26" stroke="#B2B8C0" stroke-width="1.4"/><g fill="#B2B8C0"><rect x="52" y="26" width="56" height="4"/><rect x="52" y="35" width="40" height="4"/><rect x="52" y="44" width="48" height="4"/></g><path d="M47 22h8M47 22v6M113 22h-8M113 22v6M47 52h8M47 52v-6M113 52h-8M113 52v-6" stroke="#43DAFE" stroke-width="1.6" fill="none"/></svg>',
    object: '<svg viewBox="0 0 160 90" focusable="false"><rect width="160" height="90" fill="#000D20"/><g stroke="#43DAFE" stroke-opacity=".16"><path d="M80 18L0 90M80 18l80 72M0 64h160"/></g><g fill="none" stroke="#B2B8C0" stroke-width="1.6" stroke-linejoin="round"><rect x="58" y="44" width="44" height="18" rx="2"/><path d="M74 44V34h16l8 10M98 50l14-14 10 4-8 12"/><circle cx="66" cy="66" r="5"/><circle cx="94" cy="66" r="5"/></g><path d="M50 30h8M50 30v6M126 30h-8M126 30v6M50 74h8M50 74v-6M126 74h-8M126 74v-6" stroke="#43DAFE" stroke-width="1.6" fill="none"/></svg>'
  };
  var TYPES = [['TRANSCRIPT', 'Transcript'], ['ON-SCREEN TEXT', 'On-screen text'], ['OBJECT', 'Objects']];
  var LABEL = { 'TRANSCRIPT': 'Transcript', 'ON-SCREEN TEXT': 'On-screen text', 'OBJECT': 'Object' };

  // h = hour of day (for the 24-hour index); text holds the matched words in <mark>
  var INDEX = {
    'permit approved': [
      { t: '02:14:07', h: 2.24, cam: 'CAM-11', place: 'Site office', type: 'TRANSCRIPT', lang: 'en', thumb: 'talk',
        text: '“…the <mark>permit</mark> is <mark>approved</mark> for zone B, crews start at seven…”', meta: 'Speaker 2 · 6 s clip' },
      { t: '09:31:52', h: 9.53, cam: 'CAM-04', place: 'Gate 2', type: 'ON-SCREEN TEXT', lang: 'en', thumb: 'sign',
        text: 'Notice board: “WORK <mark>PERMIT APPROVED</mark> · ZONE B”', meta: 'Text region 1 of 3' },
      { t: '17:48:20', h: 17.81, cam: 'ARCHIVE', place: 'Briefing-1004.mp4', type: 'TRANSCRIPT', lang: 'en', thumb: 'talk',
        text: '“Hot-work <mark>permit approved</mark> for the east yard until Thursday.”', meta: 'Speaker 1 · 9 s clip' }],
    'اعتماد التصريح': [
      { t: '07:40:02', h: 7.67, cam: 'CAM-11', place: 'Site office', type: 'TRANSCRIPT', lang: 'ar', thumb: 'talk',
        text: '«تم <mark>اعتماد التصريح</mark> للمنطقة ب»', meta: 'Speaker 3 · 5 s clip' },
      { t: '16:05:33', h: 16.09, cam: 'ARCHIVE', place: 'Briefing-0412.mp4', type: 'TRANSCRIPT', lang: 'ar', thumb: 'talk',
        text: '«بانتظار <mark>اعتماد التصريح</mark> قبل بدء الأعمال»', meta: 'Speaker 1 · 7 s clip' }],
    'gate 2 shift b': [
      { t: '06:58:10', h: 6.97, cam: 'CAM-04', place: 'Gate 2', type: 'ON-SCREEN TEXT', lang: 'en', thumb: 'sign',
        text: 'Gate board: “<mark>GATE 2 · SHIFT B</mark> · REPORT 07:00”', meta: 'Text region 2 of 3' },
      { t: '18:57:41', h: 18.96, cam: 'CAM-04', place: 'Gate 2', type: 'ON-SCREEN TEXT', lang: 'en', thumb: 'sign',
        text: 'Gate board: “<mark>GATE 2 · SHIFT B</mark> · HANDOVER”', meta: 'Text region 1 of 2' }],
    'excavator': [
      { t: '08:12:30', h: 8.21, cam: 'CAM-07', place: 'Yard 1', type: 'OBJECT', lang: '', thumb: 'object',
        text: '<mark>Excavator</mark> 0.92 · enters Yard 1', meta: 'Detection · 41 s in view' },
      { t: '11:47:05', h: 11.78, cam: 'CAM-07', place: 'Yard 1', type: 'OBJECT', lang: '', thumb: 'object',
        text: '<mark>Excavator</mark> 0.89 · near the trench edge', meta: 'Detection · 2 min in view' },
      { t: '15:20:44', h: 15.35, cam: 'CAM-02', place: 'North road', type: 'OBJECT', lang: '', thumb: 'object',
        text: '<mark>Excavator</mark> 0.94 · leaves site', meta: 'Detection · 18 s in view' }]
  };
  var QUERIES = Object.keys(INDEX), DEFAULT_Q = QUERIES[0];

  function norm(q) { return String(q || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function search(q) { q = norm(q); return Object.prototype.hasOwnProperty.call(INDEX, q) ? INDEX[q] : null; }
  function counts(hits) { var c = { ALL: hits.length }; TYPES.forEach(function (t) { c[t[0]] = hits.filter(function (h) { return h.type === t[0]; }).length; }); return c; }
  function resultsHTML(hits) {
    return hits.map(function (h, i) {
      var ar = h.lang === 'ar';
      return '<li class="result" data-i="' + i + '" data-type="' + h.type + '">' +
        '<div class="thumb" aria-hidden="true">' + THUMBS[h.thumb] + '</div>' +
        '<div class="min-w-0">' +
          '<p class="result-meta"><span class="tc">' + h.t + '</span> · ' + h.cam + ' · ' + h.place + ' · <span class="badge">' + LABEL[h.type] + '</span>' + (h.lang ? ' · ' + h.lang.toUpperCase() : '') + '</p>' +
          '<p class="snippet"' + (ar ? ' lang="ar" dir="rtl"' : '') + '>' + h.text + '</p>' +
          '<p class="result-sub">' + h.meta + '</p>' +
        '</div></li>';
    }).join('');
  }
  function ticksHTML(hits) {
    return hits.map(function (h, i) { return '<span class="tick" data-i="' + i + '" style="--x:' + (h.h / 24 * 100).toFixed(2) + '%;--i:' + i + '"></span>'; }).join('');
  }
  function statusText(q, hits) {
    if (!hits) return 'No matches for “' + q + '” in this sample index.';
    return hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + q + '” across 24 hours of sample footage';
  }

  var Y2 = { TYPES: TYPES, QUERIES: QUERIES, DEFAULT_Q: DEFAULT_Q, search: search, counts: counts, resultsHTML: resultsHTML, ticksHTML: ticksHTML, statusText: statusText };
  root.Y2 = Y2;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Y2;
    if (typeof require !== 'undefined' && require.main === module) {
      var hits = search(DEFAULT_Q);
      process.stdout.write(JSON.stringify({ q: DEFAULT_Q, results: resultsHTML(hits), ticks: ticksHTML(hits), status: statusText(DEFAULT_Q, hits), counts: counts(hits) }));
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
