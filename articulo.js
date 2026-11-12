// Página individual de cada ensayo.
// Se usa desde /<slug>/ (con window.ESSAY_ID) y desde articulo.html?a=<slug>.
// Lee el contenido de /index.html: si se edita el artículo allá, se actualiza acá solo.
(function(){
  var SLUGS = {'adam-smith':'ft01','malvinas':'ft02','peron-milei':'ft03','discurso-del-papa':'ft04'};
  var app = document.getElementById('app');
  var param = window.ESSAY_ID || new URLSearchParams(location.search).get('a') || '';
  var ftId = SLUGS[param] || param;

  function fail(){
    app.innerHTML = '<p class="loading">No encontré ese ensayo. <a href="/">Ver todos los ensayos</a></p>';
  }

  fetch('/index.html').then(function(r){ return r.text(); }).then(function(html){
    var src = new DOMParser().parseFromString(html, 'text/html');
    var ft = ftId ? src.getElementById(ftId) : null;
    if(!ft || !ft.classList.contains('full-text')){ fail(); return; }

    src.querySelectorAll('style').forEach(function(s){
      document.head.appendChild(document.importNode(s, true));
    });

    var box = ft.parentElement;
    var card = ft.closest('.file');
    function pick(sel){ var n = box.querySelector(':scope > ' + sel); return n ? n.textContent : ''; }
    var title = pick('.title');
    var deck = pick('.deck');
    var source = pick('.source-line');
    var stampEl = card.querySelector('.stamp');
    var stamp = stampEl ? stampEl.textContent : '';
    var m = (card.getAttribute('style') || '').split('--file-accent:')[1];
    var accent = m ? m.split(';')[0].trim() : '#1F3350';

    document.title = title + ' — Agustín Dasso';
    app.innerHTML = '';

    var top = document.createElement('div');
    top.className = 'masthead';
    top.innerHTML =
      '<div class="eyebrow"><span>Archivo personal</span><span>Buenos Aires, Argentina</span></div>' +
      '<h1 class="name"><a href="/" style="color:inherit;text-decoration:none;">Agustín Dasso</a></h1>' +
      '<nav class="index" style="margin-top:22px;"><a href="/">← Todos los ensayos</a><a href="#" id="copyLink">Copiar link</a></nav>';
    app.appendChild(top);

    var wrap = document.createElement('div');
    wrap.className = 'dossier';
    var art = document.createElement('article');
    art.className = 'file';
    art.setAttribute('style', '--file-accent:' + accent + ';');
    art.innerHTML =
      '<div class="file-head"><div class="file-meta">Ensayo · Agustín Dasso</div><span class="stamp"></span></div>' +
      '<h2 class="title"></h2><p class="deck"></p><div class="source-line"></div>';
    art.querySelector('.stamp').textContent = stamp;
    art.querySelector('.title').textContent = title;
    art.querySelector('.deck').textContent = deck;
    art.querySelector('.source-line').textContent = source;

    var body = document.importNode(ft, true);
    body.removeAttribute('id');
    body.classList.add('open');
    art.appendChild(body);
    wrap.appendChild(art);
    app.appendChild(wrap);

    var c = document.getElementById('copyLink');
    c.addEventListener('click', function(e){
      e.preventDefault();
      function ok(){ c.textContent = '¡Link copiado!'; setTimeout(function(){ c.textContent = 'Copiar link'; }, 1800); }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(location.href).then(ok, function(){ window.prompt('Copiá el link:', location.href); });
      } else {
        window.prompt('Copiá el link:', location.href);
      }
    });
  }).catch(fail);
})();
