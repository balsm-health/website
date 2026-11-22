/* Balsm — link-preview card painter (1200×630).
   From the Claude Design project's og-card.js (Link Previews.dc.html), so the
   rendered cards match the design pixel for pixel. One change: the brand disc
   draws the full-colour mark (imgs.icon) instead of cropping it out of the
   horizontal lockup, so it can't drift if the lockup's proportions change.
   Loaded by scripts/generate-preview-cards.mjs inside headless Chrome.
   BalsmOgCard.paint(ctx, card, imgs, opts)
     card = { eyebrow, title, desc, accent, accentText, path }
     imgs = { logo, mark, icon }   (horizontal lockup, white mark, colour mark)
     opts = { lang: 'ar'|'en', origin, tagline } */
(function(){
  var W = 1200, H = 630, PETALS = ['#02BBB5', '#1283FF', '#01C4A2', '#724DD0', '#55D77F'];
  function shade(hex, f){ var n = parseInt(String(hex).replace('#', ''), 16); if(isNaN(n)) return hex; var r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var m = function(v){ return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); };
    return 'rgb(' + m(r) + ',' + m(g) + ',' + m(b) + ')'; }
  function wrap(c, text, maxW){ var words = String(text || '').split(/\s+/).filter(Boolean), lines = [], cur = '';
    for(var i = 0; i < words.length; i++){ var t = cur ? cur + ' ' + words[i] : words[i]; if(c.measureText(t).width > maxW && cur){ lines.push(cur); cur = words[i]; } else cur = t; }
    if(cur) lines.push(cur); return lines; }
  function clamp(c, lines, n, maxW){ if(lines.length <= n) return lines; var out = lines.slice(0, n), last = out[n - 1] + '…';
    while(c.measureText(last).width > maxW && last.length > 2) last = last.slice(0, -2) + '…'; out[n - 1] = last; return out; }

  function paint(c, card, imgs, opts){
    opts = opts || {}; imgs = imgs || {};
    var en = opts.lang === 'en', rtl = !en;
    var AF = en ? 'Montserrat' : 'Cairo', BF = en ? '"IBM Plex Sans"' : '"IBM Plex Sans Arabic"';
    var acc = card.accent || '#01C4A2', accT = card.accentText || shade(acc, -0.25);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    // canvas
    c.fillStyle = '#FAFAF7'; c.fillRect(0, 0, W, H);
    // panel (left in Arabic, right in English)
    var PW = 420, px = rtl ? 0 : W - PW;
    var g = c.createLinearGradient(px, 0, px + PW, H); g.addColorStop(0, shade(acc, -0.28)); g.addColorStop(0.6, acc); g.addColorStop(1, shade(acc, 0.18));
    c.fillStyle = g; c.fillRect(px, 0, PW, H);
    if(imgs.mark){ c.globalAlpha = 0.13; var ms = 560; c.drawImage(imgs.mark, px + PW / 2 - ms / 2 + (rtl ? -90 : 90), H - ms * 0.72, ms, ms); c.globalAlpha = 1; }
    // brand mark disc
    var cx = px + PW / 2, cy = H / 2 - 6, R = 128;
    c.save(); c.shadowColor = 'rgba(0,0,0,.22)'; c.shadowBlur = 40; c.shadowOffsetY = 14;
    c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill(); c.restore();
    if(imgs.icon){ var I = imgs.icon, iw = I.naturalWidth || I.width, ih = I.naturalHeight || I.height, s = (R * 1.32) / Math.max(iw, ih);
      c.drawImage(I, cx - iw * s / 2, cy - ih * s / 2, iw * s, ih * s); }
    // text column
    var pad = 64, x0 = rtl ? PW + pad : pad, x1 = rtl ? W - pad : W - PW - pad, colW = x1 - x0, xs = rtl ? x1 : x0;
    c.direction = rtl ? 'rtl' : 'ltr'; c.textAlign = rtl ? 'right' : 'left'; c.textBaseline = 'alphabetic';
    // logo lockup
    if(imgs.logo){ var LL = imgs.logo, llh = 62, llw = (LL.naturalWidth || LL.width) * llh / (LL.naturalHeight || LL.height);
      c.drawImage(LL, rtl ? xs - llw : xs, 52, llw, llh); }
    var y = 196;
    // eyebrow
    if(card.eyebrow){ c.font = '700 ' + (en ? 22 : 26) + 'px ' + AF; c.fillStyle = accT;
      if(en && c.letterSpacing !== undefined) c.letterSpacing = '1.5px';
      c.fillText(en ? String(card.eyebrow).toUpperCase() : card.eyebrow, xs, y);
      if(c.letterSpacing !== undefined) c.letterSpacing = '0px'; y += en ? 26 : 22; }
    // title: largest size that fits in 2 lines
    var ts = en ? 58 : 64, tl;
    for(; ts >= 38; ts -= 2){ c.font = '800 ' + ts + 'px ' + AF; tl = wrap(c, card.title, colW); if(tl.length <= 2) break; }
    c.font = '800 ' + ts + 'px ' + AF; tl = clamp(c, wrap(c, card.title, colW), 2, colW); c.fillStyle = '#14202B';
    var tlh = ts * (en ? 1.16 : 1.32);
    for(var i = 0; i < tl.length; i++){ y += tlh; c.fillText(tl[i], xs, y); }
    // description: up to 3 lines
    y += en ? 26 : 32; var ds = en ? 25 : 26; c.font = '400 ' + ds + 'px ' + BF; c.fillStyle = '#384756';
    var dl = clamp(c, wrap(c, card.desc, colW), 3, colW);
    for(var j = 0; j < dl.length; j++){ y += ds * (en ? 1.5 : 1.62); c.fillText(dl[j], xs, y); }
    // footer: tagline + url
    var fy = H - 54;
    var url = String(opts.origin || 'https://balsm.health').replace(/^https?:\/\//, '') + (card.path && card.path !== '/' ? card.path : '');
    var TF = '600 ' + (en ? 19 : 21) + 'px ' + BF, UF = '500 20px "IBM Plex Mono", monospace';
    c.font = UF; var uw = c.measureText(url).width; c.font = TF; var tw = c.measureText(opts.tagline || '').width;
    var stack = tw + uw + 48 > colW;
    c.fillStyle = '#1F2D3D'; c.fillText(opts.tagline || '', xs, stack ? fy - 34 : fy);
    c.direction = 'ltr'; c.font = UF; c.fillStyle = '#5F6B77';
    if(stack){ c.textAlign = rtl ? 'right' : 'left'; c.fillText(url, xs, fy); }
    else { c.textAlign = rtl ? 'left' : 'right'; c.fillText(url, rtl ? x0 : x1, fy); }
    // petal strip
    var sw = (W - PW) / 5, sx = rtl ? PW : 0; for(var k = 0; k < 5; k++){ c.fillStyle = PETALS[k]; c.fillRect(sx + k * sw, H - 10, sw + 1, 10); }
    c.restore();
  }
  function fonts(){ if(!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all(['800 64px Cairo', '700 26px Cairo', '400 26px "IBM Plex Sans Arabic"', '600 21px "IBM Plex Sans Arabic"', '800 58px Montserrat', '700 22px Montserrat', '400 25px "IBM Plex Sans"', '600 19px "IBM Plex Sans"', '500 20px "IBM Plex Mono"']
      .map(function(f){ return document.fonts.load(f).catch(function(){}); })).catch(function(){}); }
  window.BalsmOgCard = { W: W, H: H, paint: paint, fonts: fonts };
})();
