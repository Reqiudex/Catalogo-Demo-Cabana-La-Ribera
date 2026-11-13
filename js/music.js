/* =====================================================================
   Música de fondo generada en el navegador (Web Audio API).
   Pad cálido + piano suave + bajo, en Re mayor, con reverberación de sala.
   No descarga archivos: 0 KB de ancho de banda y sin derechos de autor.
   API: LRMusic.play() · LRMusic.pause() · LRMusic.isOn()
   ===================================================================== */
(function () {
  'use strict';
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, dry = null, wet = null, timer = null, on = false, nextT = 0, step = 0;
  var VOL = 0.17;

  // Progresión (MIDI): Dmaj9 · Bm9 · Gmaj9 · Asus2  — 8 compases lentos por vuelta
  var CH = [
    { bass: 38, pad: [50, 54, 57, 61, 64] },
    { bass: 35, pad: [47, 50, 54, 57, 61] },
    { bass: 31, pad: [43, 47, 50, 54, 57] },
    { bass: 33, pad: [45, 47, 52, 57, 59] }
  ];
  var SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81]; // pentatónica de Re para el piano
  var BAR = 7.2, BEAT = BAR / 8;
  var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function impulse(sec) {
    var len = ctx.sampleRate * sec, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return buf;
  }

  function build() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
    var tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 5200;
    master.connect(tone); tone.connect(comp); comp.connect(ctx.destination);
    dry = ctx.createGain(); dry.gain.value = 0.62; dry.connect(master);
    var rev = ctx.createConvolver(); rev.buffer = impulse(4.2);
    wet = ctx.createGain(); wet.gain.value = 0.55; rev.connect(wet); wet.connect(master);
    dry.rev = rev;
  }
  function out(node, send) { node.connect(dry); var s = ctx.createGain(); s.gain.value = send; node.connect(s); s.connect(dry.rev); }

  function pad(notes, t, dur) {
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(700, t); lp.frequency.linearRampToValueAtTime(1100, t + dur / 2); lp.frequency.linearRampToValueAtTime(700, t + dur);
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 2.6); g.gain.setValueAtTime(0.05, t + dur - 0.4); g.gain.linearRampToValueAtTime(0, t + dur + 2.8);
    lp.connect(g); out(g, 0.9);
    notes.forEach(function (m) {
      [-6, 6].forEach(function (det) {
        var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = det;
        o.connect(lp); o.start(t); o.stop(t + dur + 3);
      });
    });
  }
  function bass(m, t, dur) {
    var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m);
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 1.2); g.gain.linearRampToValueAtTime(0.0, t + dur + 1);
    o.connect(g); out(g, 0.25); o.start(t); o.stop(t + dur + 1.2);
  }
  function piano(m, t, vel) {
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.055 * vel, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0004, t + 3.4);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(900, t + 1.5);
    lp.connect(g); out(g, 0.7);
    [[1, 1], [2, 0.32], [3, 0.12], [4.01, 0.05]].forEach(function (h) {
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m) * h[0];
      var hg = ctx.createGain(); hg.gain.value = h[1]; o.connect(hg); hg.connect(lp); o.start(t); o.stop(t + 3.5);
    });
  }

  var last = 4;
  function schedule() {
    while (nextT < ctx.currentTime + 1.5) {
      var bar = Math.floor(step / 8), beat = step % 8, ch = CH[bar % CH.length];
      if (beat === 0) { pad(ch.pad, nextT, BAR); bass(ch.bass, nextT, BAR); }
      // Piano: frase sobria, más notas al inicio del compás y silencios al final
      var p = [0.85, 0.15, 0.55, 0.2, 0.6, 0.15, 0.35, 0.05][beat];
      if (Math.random() < p) {
        last = Math.max(0, Math.min(SCALE.length - 1, last + [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)]));
        var m = SCALE[last];
        if (ch.pad.indexOf(m - 12) < 0 && ch.pad.indexOf(m - 24) < 0 && beat === 0) m = ch.pad[ch.pad.length - 1] + 12;
        piano(m, nextT + Math.random() * 0.03, beat === 0 ? 1 : 0.7);
        if (beat === 0 && Math.random() < 0.4) piano(m - 12, nextT + 0.02, 0.45);
      }
      nextT += BEAT; step++;
    }
  }

  function play() {
    if (!AC) return false;
    if (!ctx) build();
    if (ctx.state === 'suspended') ctx.resume();
    if (!on) {
      on = true;
      if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.1;
      schedule(); timer = setInterval(schedule, 250);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(VOL, ctx.currentTime + 3.5);
    }
    return true;
  }
  function pause() {
    if (!ctx || !on) return;
    on = false; clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    setTimeout(function () { if (!on && ctx) ctx.suspend(); }, 1400);
  }
  // Pestaña oculta: se detiene; al volver, sigue si estaba sonando
  var wasOn = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { wasOn = on; pause(); } else if (wasOn) { play(); }
  });

  window.LRMusic = { play: play, pause: pause, isOn: function () { return on; } };
})();
