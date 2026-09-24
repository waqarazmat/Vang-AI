(function () {
  var TR = {
    L: 54,
    mechX: [[0,-88],[3.4,-88],[5.4,-380],[8.9,-380],[10.9,-88],[11.9,-125],[14.45,-125],[15.1,-88],[26.0,-88],[26.6,-72],[34.8,-72],[36.5,-232],[37.3,-232],[39.3,-88],[54,-88]],
    crouch: [[0,1],[3.3,1],[3.8,0],[10.9,0],[11.9,1.7],[13.9,1.7],[14.1,1.3],[14.4,1.3],[14.9,0],[19.4,0],[20.3,1],[22.6,1],[23.3,0.4],[24.4,0.4],[25.0,1],[25.8,1],[26.4,0],[39.2,0],[40.0,1],[54,1]],
    jump: [[0,0],[13.92,0],[14.06,-14],[14.2,-9],[14.4,0],[54,0]],
    sx: [[0,1],[8.7,1],[9.0,-1],[10.8,-1],[11.1,1],[26.3,1],[26.7,-1],[32.2,-1],[32.6,1],[37.0,1],[37.3,-1],[39.2,-1],[39.5,1],[54,1]],
    hood: [[0,-62],[54,-62]],
    head: [[0,7],[3.2,7],[3.6,0],[10.9,0],[11.9,8],[13.9,8],[14.1,-10],[14.8,-4],[16.4,-2],[16.9,0],[19.4,0],[20.3,7],[22.4,7],[22.8,-10],[24.2,-10],[24.8,7],[25.8,7],[26.4,0],[28.6,0],[28.9,-9],[30.8,-9],[31.2,0],[36.3,0],[36.6,12],[37.1,12],[37.5,0],[39.4,0],[40.0,7],[54,7]],
    armA: [[0,-6],[5.2,-6],[5.7,150],[8.5,150],[8.9,-6],[14.2,-6],[14.6,132],[16.0,132],[16.35,-14],[16.6,-14],[17.0,150],[19.0,150],[19.4,-6],[54,-6]],
    armB: [[0,2],[54,2]],
    osc: [[0,12],[3.1,12],[3.4,0],[11.9,0],[12.3,13],[13.8,13],[13.9,0],[14.6,0],[14.8,15],[15.8,15],[16.0,0],[19.8,0],[20.4,12],[22.4,12],[22.6,0],[24.8,0],[25.2,12],[25.6,12],[25.8,0],[39.9,0],[40.4,12],[54,12]],
    custX: [[0,44],[25.0,44],[27.0,-90],[31.9,-90],[34.0,80],[44.8,80],[44.9,44],[46.6,-90],[51.9,-90],[53.9,80],[54,80]],
    custSx: [[0,1],[31.5,1],[31.9,-1],[44.7,-1],[44.8,1],[51.5,1],[51.9,-1],[54,-1]],
    rows: {
      A: [[0,330],[2.6,330],[3.4,0],[39.6,0],[40.3,330],[40.6,330],[41.3,0],[53.2,0],[53.9,330],[54,330]],
      B: [[0,330],[13.2,330],[14.0,0],[39.6,0],[40.3,330],[42.4,330],[43.1,0],[53.2,0],[53.9,330],[54,330]],
      C: [[0,330],[20.6,330],[21.4,0],[39.6,0],[40.3,330],[44.0,330],[44.7,0],[53.2,0],[53.9,330],[54,330]],
      D: [[0,330],[27.6,330],[28.4,0],[39.6,0],[40.3,330],[45.6,330],[46.3,0],[53.2,0],[53.9,330],[54,330]],
      E: [[0,330],[33.8,330],[34.6,0],[39.6,0],[40.3,330],[47.2,330],[47.9,0],[53.2,0],[53.9,330],[54,330]]
    },
    ok: { A: [[8.3,39.9],[41.6,53.9]], B: [[18.6,39.9],[43.4,53.9]], C: [[45.0,53.9]], D: [[46.6,53.9]], E: [[48.2,53.9]] },
    no: { C: [[24.0,39.9]], D: [[31.0,39.9]], E: [[36.4,39.9]] },
    rings: [[3.0,5.7],[21.0,24.0],[28.0,31.0],[34.2,36.4]],
    buzz: [[13.5,16.35]],
    airing: [[41.0,42.3],[42.6,43.9],[44.2,45.5],[45.8,47.1],[47.4,48.7]],
    call: [[5.7,8.6]],
    mob: [[16.7,19.1]],
    pock: [[16.35,19.25]],
    stars: [[14.08,15.9]],
    talkM: [[6.0,6.9],[7.3,8.2],[17.2,17.9],[18.2,18.9],[28.1,28.8],[29.6,30.3]],
    talkC: [[27.2,28.0],[29.0,29.5],[30.5,31.3],[46.9,47.8],[48.7,49.6],[50.5,51.3]],
    ai: [[40.0,53.8]],
    pops: [[40.8,53.6]],
    end: [[49.6,53.7]],
    caps: [
      [0,5.6,'A normal day at the garage.'],
      [5.7,11.4,'Joe answers. One customer booked.'],
      [13.9,20.0,'His mobile rings. Ouch. Still booked.'],
      [23.8,26.6,'Hands full. Missed.'],
      [30.9,34.2,'Talking to a customer. Missed.'],
      [36.4,39.8,'Too late. Missed.'],
      [40.0,45.2,'VangAI picks up. Joe keeps working.'],
      [45.2,53.9,'Booked. Booked. Booked.']
    ],
    miss: [24.0, 31.0, 36.4],
    fix: 40.0, unfix: 53.9
  };

  function at(tr, t) {
    if (t <= tr[0][0]) return tr[0][1];
    for (var i = 1; i < tr.length; i++) {
      if (t <= tr[i][0]) {
        var a = tr[i - 1], b = tr[i];
        var u = (t - a[0]) / ((b[0] - a[0]) || 1);
        u = u * u * (3 - 2 * u);
        return a[1] + (b[1] - a[1]) * u;
      }
    }
    return tr[tr.length - 1][1];
  }
  function win(ws, t, f) {
    var o = 0;
    for (var i = 0; i < ws.length; i++) {
      var v = Math.min((t - ws[i][0]) / f, (ws[i][1] - t) / f, 1);
      if (v > o) o = v;
    }
    return o < 0 ? 0 : (o > 1 ? 1 : o);
  }
  function tr(s) { return (window.VangT ? window.VangT(s) : s); }

  function start(root, opts) {
    var q = {};
    root.querySelectorAll('[data-vl]').forEach(function (n) { q[n.getAttribute('data-vl')] = n; });
    var S = { t: 0, ph: 0, st: 0, cph: 0, cst: 0, vis: true, raf: 0, capI: -2 };
    var set = function (k, tf, op) {
      var n = q[k]; if (!n) return;
      if (tf !== null && tf !== undefined) n.style.transform = tf;
      if (op !== null && op !== undefined) n.style.opacity = op;
    };
    var frame = function (dt) {
      var t = S.t;
      var mx = at(TR.mechX, t);
      var mspeed = Math.abs(mx - at(TR.mechX, t - 0.04)) / 0.04;
      S.st += ((mspeed > 22 ? 1 : 0) - S.st) * Math.min(1, dt * 10);
      S.ph += mspeed * dt * 0.037;
      var c = at(TR.crouch, t), sx = at(TR.sx, t);
      var sw = Math.sin(S.ph) * S.st;
      var bob = -2.2 * Math.abs(Math.cos(S.ph)) * S.st + at(TR.jump, t);
      set('mech', 'translate(' + mx.toFixed(2) + 'px,' + (bob + 6 * c).toFixed(2) + 'px) scale(' + sx.toFixed(3) + ',1)');
      set('mTorso', 'rotate(' + (-17 * c).toFixed(2) + 'deg)');
      set('mHead', 'rotate(' + at(TR.head, t).toFixed(2) + 'deg)');
      var o = at(TR.osc, t) * Math.sin(t * 7.4);
      set('mArmA', 'rotate(' + (at(TR.armA, t) + o - 22 * sw).toFixed(2) + 'deg)');
      set('mArmB', 'rotate(' + (at(TR.armB, t) - o + 22 * sw).toFixed(2) + 'deg)');
      set('mLegA', 'rotate(' + (24 * sw + 9 * Math.min(c, 1)).toFixed(2) + 'deg)');
      set('mLegB', 'rotate(' + (-24 * sw - 7 * Math.min(c, 1)).toFixed(2) + 'deg)');
      var wob = (t > 14.05 && t < 15.2) ? 6 * Math.sin((t - 14.05) * 28) * (1 - (t - 14.05) / 1.15) : 0;
      set('hood', 'rotate(' + (at(TR.hood, t) + wob).toFixed(2) + 'deg)');
      var st = win(TR.stars, t, 0.15);
      set('stars', 'rotate(' + ((t * 160) % 360).toFixed(1) + 'deg)', st);
      set('mMob', null, win(TR.mob, t, 0.12));
      set('mPock', null, 1 - win(TR.pock, t, 0.1));
      var bz = win(TR.buzz, t, 0.1);
      set('mBuzz', 'translate(' + (1.4 * Math.sin(t * 60) * bz).toFixed(2) + 'px,0)', bz);

      var cx = at(TR.custX, t), csx = at(TR.custSx, t);
      var cspeed = Math.abs(cx - at(TR.custX, t - 0.04)) / 0.04;
      S.cst += ((cspeed > 18 ? 1 : 0) - S.cst) * Math.min(1, dt * 10);
      S.cph += cspeed * dt * 0.037;
      var csw = Math.sin(S.cph) * S.cst;
      set('cust', 'translate(' + cx.toFixed(2) + 'px,' + (-2 * Math.abs(Math.cos(S.cph)) * S.cst).toFixed(2) + 'px) scale(' + csx.toFixed(3) + ',1)');
      set('cLegA', 'rotate(' + (24 * csw).toFixed(2) + 'deg)');
      set('cLegB', 'rotate(' + (-24 * csw).toFixed(2) + 'deg)');
      set('cArmA', 'rotate(' + (-4 - 18 * csw).toFixed(2) + 'deg)');
      set('cArmB', 'rotate(' + (4 + 18 * csw).toFixed(2) + 'deg)');

      var ring = win(TR.rings, t, 0.18);
      set('ring', null, ring);
      set('airing', null, win(TR.airing, t, 0.3));
      var onCall = win(TR.call, t, 0.12);
      set('hset', ring > 0.04
        ? 'translate(' + (1.1 * Math.sin(t * 5.5) * ring).toFixed(2) + 'px,' + (-1.4 * Math.abs(Math.sin(t * 5.5)) * ring).toFixed(2) + 'px) rotate(' + (3.2 * Math.sin(t * 5.5) * ring).toFixed(2) + 'deg)'
        : 'none', 1 - onCall);
      set('mRec', null, onCall);
      set('cord', null, onCall);
      set('talkM', null, win(TR.talkM, t, 0.15));
      set('talkC', null, win(TR.talkC, t, 0.15));
      var aiv = win(TR.ai, t, 0.4);
      set('aiph', 'scale(' + (1 + 0.08 * Math.sin(t * 3)).toFixed(3) + ')', aiv);
      set('aimk', null, aiv);
      set('pops', null, win(TR.pops, t, 0.4));
      var e = win(TR.end, t, 0.45);
      set('end', 'translateY(' + ((1 - e) * 10).toFixed(2) + 'px)', e);

      ['A', 'B', 'C', 'D', 'E'].forEach(function (k) {
        var x = at(TR.rows[k], t);
        var op = (330 - x) / 120;
        set('c' + k, q['c' + k] && q['c' + k].tagName.toLowerCase() === 'g' ? 'translateX(' + x.toFixed(2) + 'px)' : 'translateX(' + (x * 0.12).toFixed(2) + 'px)', op < 0 ? 0 : (op > 1 ? 1 : op));
        if (TR.no[k]) set('no' + k, null, win(TR.no[k], t, 0.2));
        if (TR.ok[k]) set('ok' + k, null, win(TR.ok[k], t, 0.2));
      });

      if (q.cap) {
        var ci = -1;
        for (var i = 0; i < TR.caps.length; i++) if (t >= TR.caps[i][0] && t < TR.caps[i][1]) ci = i;
        if (ci !== S.capI) {
          S.capI = ci;
          q.cap.textContent = ci >= 0 ? tr(TR.caps[ci][2]) : '\u00a0';
          q.cap.style.transition = 'none';
          q.cap.style.opacity = '0';
          q.cap.style.transform = 'translateY(6px)';
          void q.cap.offsetWidth;
          q.cap.style.transition = 'opacity 380ms ease, transform 380ms ease';
          q.cap.style.opacity = ci >= 0 ? '1' : '0';
          q.cap.style.transform = 'none';
        }
      }

      var missed = 0;
      for (var j = 0; j < TR.miss.length; j++) if (t >= TR.miss[j]) missed++;
      var fixed = t >= TR.fix && t < TR.unfix;
      if (opts.onState) opts.onState(missed, fixed);
    };

    var check = function () {
      if (document.hidden) { S.vis = false; }
      else {
        var r = root.getBoundingClientRect();
        var h = window.innerHeight || 800;
        S.vis = r.bottom > 0 && r.top < h;
      }
      root.setAttribute('data-paused', S.vis ? '0' : '1');
    };
    check();
    var visT = setInterval(check, 300);
    window.addEventListener('scroll', check, { passive: true });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { S.t = 47.6; frame(0); }
    else {
      var last = 0;
      var loop = function (now) {
        S.raf = requestAnimationFrame(loop);
        var dt = last ? (now - last) / 1000 : 0;
        last = now;
        if (dt > 0.4) dt = 0;
        if (!S.vis || S.hold) return;
        var pace = Number(opts.pace && opts.pace()) || TR.L;
        var k = TR.L / pace;
        S.t = (S.t + dt * k) % TR.L;
        frame(dt * k);
      };
      S.raf = requestAnimationFrame(loop);
    }
    var onLang = function () { S.capI = -2; if (reduce) frame(0); };
    window.addEventListener('vang-lang', onLang);
    var ctl = {
      seek: function (t) { S.t = t; S.capI = -2; frame(0.016); S.hold = true; },
      stop: function () {
        cancelAnimationFrame(S.raf); clearInterval(visT);
        window.removeEventListener('scroll', check);
        window.removeEventListener('vang-lang', onLang);
      }
    };
    (window.__vl = window.__vl || []).push(ctl);
    return ctl;
  }
  window.VangLostEngine = { start: start, TR: TR };
})();
