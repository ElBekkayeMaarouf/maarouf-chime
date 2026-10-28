var $=function(s){return document.querySelector(s)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function safe(u){u=String(u||'').trim();return /^(https?:\/\/|\/|[A-Za-z0-9_.-])/.test(u)?esc(u):'#'}
function load(n){var C=window.CFG||{},fb=function(){return fetch('/data/'+n+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()})};
if(!C.url||C.url.indexOf('VOTRE')>-1)return fb();
return fetch(C.url+'/rest/v1/content?name=eq.'+n+'&select=data',{headers:{apikey:C.key}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){if(!a.length)throw 0;return a[0].data}).catch(fb)}
(function(){var sel=$('#qsel'),box=$('#qbox');if(!sel)return;load('quiz').then(function(j){var D={};(j.themes||[]).forEach(function(t){D[t.titre]=(t.questions||[]).map(function(q){return[q.question,q.options||[],(+q.bonne||1)-1,q.explication||'']})});
if(!Object.keys(D).length){box.innerHTML='<p>Aucun quiz pour le moment.</p>';return}
Object.keys(D).forEach(function(k,n){var b=document.createElement('button');b.textContent=k;b.onclick=function(){sel.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');run(k)};sel.appendChild(b);if(!n){b.classList.add('on');run(k)}});
function run(k){var q=D[k],i=0,sc=0;function show(){if(i>=q.length){box.innerHTML='<div class="qc"><h3 class="serif">Score : '+sc+' / '+q.length+'</h3><p class="qe">'+(sc==q.length?'Excellent ! 🎉':sc>=q.length/2?'Bien, continuez à réviser.':'Relisez le cours puis réessayez.')+'</p><div class="qn"><button class="btn" style="cursor:pointer" id="rs">Recommencer</button></div></div>';$('#rs').onclick=function(){i=0;sc=0;show()};return}
var c=q[i];box.innerHTML='<div class="qc"><small>Question '+(i+1)+' / '+q.length+'</small><h3>'+c[0]+'</h3>'+c[1].map(function(o,j){return '<button class="qo" data-j="'+j+'">'+o+'</button>'}).join('')+'<div id="ex"></div></div>';
box.querySelectorAll('.qo').forEach(function(b){b.onclick=function(){var j=+b.dataset.j;box.querySelectorAll('.qo').forEach(function(x){x.disabled=true});if(j==c[2]){sc++;b.classList.add('ok')}else{b.classList.add('ko');box.querySelector('[data-j="'+c[2]+'"]').classList.add('ok')}
$('#ex').innerHTML='<p class="qe">'+c[3]+'</p><div class="qn"><button class="btn" style="cursor:pointer" id="nx">'+(i+1<q.length?'Question suivante':'Voir le score')+'</button></div>';$('#nx').onclick=function(){i++;show()}}})}show()}}).catch(function(){box.innerHTML='<p>Impossible de charger les quiz.</p>'})})();
(function(){var L=$('#lst');if(!L)return;var inp=$('.search'),sf=$('#sf'),f='all',it=[];
load(L.dataset.src).then(function(d){var a=d.items||[];
L.innerHTML=a.length?a.map(function(x){return '<div class="item" data-s="'+esc(x.semestre)+'"><div><b>'+esc(x.titre)+'</b><small>'+esc(x.info)+'</small></div><a class="dl" href="'+safe(x.fichier)+'" download>Télécharger</a></div>'}).join(''):'<p style="color:var(--muted)">Aucun document pour le moment.</p>';
it=L.querySelectorAll('.item');
if(sf){var s=[];a.forEach(function(x){if(x.semestre&&s.indexOf(x.semestre)<0)s.push(x.semestre)});s.sort();sf.innerHTML='<button data-f="all" class="on">Tous</button>'+s.map(function(v){return '<button data-f="'+esc(v)+'">'+esc(v)+'</button>'}).join('');
sf.querySelectorAll('button').forEach(function(b){b.onclick=function(){sf.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');f=b.dataset.f;ap()}})}
}).catch(function(){L.innerHTML='<p>Impossible de charger la liste.</p>'});
function ap(){var q=inp?inp.value.toLowerCase().trim():'';it.forEach(function(i){var ok=(f=='all'||i.dataset.s==f)&&(!q||i.textContent.toLowerCase().indexOf(q)>-1);i.style.display=ok?'':'none'})}
if(inp)inp.oninput=ap})();
(function(){var t=$('#tm'),r=document.documentElement;function set(d){if(d){r.setAttribute('data-theme','dark');t.textContent='☀️'}else{r.removeAttribute('data-theme');t.textContent='🌙'}try{localStorage.setItem('dark',d?'1':'0')}catch(e){}}
var d=false;try{d=localStorage.getItem('dark')=='1'}catch(e){}set(d);t.onclick=function(){set(!r.getAttribute('data-theme'))}})();
(function(){var f=$('#cf'),m=$('#cmsg');if(!f)return;f.onsubmit=function(e){e.preventDefault();var b=new URLSearchParams(new FormData(f)).toString();
fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b}).then(function(r){if(!r.ok)throw 0;m.textContent='✅ Message envoyé. Merci !';f.reset()}).catch(function(){m.textContent='❌ Échec de l’envoi. Réessayez plus tard.'})}})();
(function(){var h=$('#rt');if(!h)return;h.innerHTML=h.dataset.t.split(' ').map(function(w,i){return '<span class="w" style="--i:'+i+'">'+w+'</span>'}).join(' ');
var els=[h].concat([].slice.call(document.querySelectorAll('#ressources .rv')));function go(e){e.classList.add('in')}
if(!('IntersectionObserver' in window)){els.forEach(go);return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){go(x.target);io.unobserve(x.target)}})},{threshold:.25});els.forEach(function(e){io.observe(e)})})();
(function(){var g=$('#vg');if(!g)return;var f='all',q=$('#vs'),cards=[];
var play='<span class="vplay"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>';
load('videos').then(function(d){var a=d.items||[],cats=[],cnt={};
a.forEach(function(x){if(cats.indexOf(x.categorie)<0)cats.push(x.categorie);cnt[x.categorie]=(cnt[x.categorie]||0)+1});
$('#vf').innerHTML='<button class="on" data-v="all">Toutes ('+a.length+')</button>'+cats.map(function(c){return '<button data-v="'+esc(c)+'">'+esc(c)+' ('+cnt[c]+')</button>'}).join('');
g.innerHTML=a.map(function(x,i){var u=safe(x.url),pl=/playlist/i.test(x.url||''),m=String(x.url||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
var th=pl?'<span class="vlist" aria-hidden="true">☰ Playlist</span>':(m?'<img src="https://i.ytimg.com/vi/'+m[1]+'/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">':'');
return '<article class="vcard" data-c="'+esc(x.categorie)+'" style="--i:'+i+'"><a class="vthumb" href="'+u+'" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir : '+esc(x.titre)+'">'+th+play+'<span class="vbadge">'+(pl?'PLAYLIST':'VIDÉO')+'</span></a><div class="vbody"><span class="vcat">'+esc(x.categorie)+'</span><h3 class="serif">'+esc(x.titre)+'</h3><p>'+esc(x.description)+'</p><a class="playlist-button" href="'+u+'" target="_blank" rel="noopener noreferrer">Regarder sur YouTube ↗</a></div></article>'}).join('');
cards=g.querySelectorAll('.vcard');ap();
document.querySelectorAll('#vf button').forEach(function(b){b.onclick=function(){document.querySelectorAll('#vf button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');f=b.dataset.v;ap()}})
}).catch(function(){g.innerHTML='<p>Impossible de charger les vidéos.</p>'});
function ap(){var s=q.value.toLowerCase().trim(),n=0;cards.forEach(function(c){var ok=(f=='all'||c.dataset.c==f)&&(!s||c.textContent.toLowerCase().indexOf(s)>-1);c.style.display=ok?'':'none';if(ok)n++});$('#vnone').hidden=n>0||!cards.length}
q.oninput=ap})();
(function(){var h=document.querySelector('header'),t=document.getElementById('tm');if(!h||!t)return;
var b=document.createElement('button');b.id='mn';b.type='button';b.setAttribute('aria-label','Ouvrir le menu');b.setAttribute('aria-expanded','false');
b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"/></svg>';
t.parentNode.insertBefore(b,t);
function close(){h.classList.remove('open');b.setAttribute('aria-expanded','false')}
b.onclick=function(e){e.stopPropagation();var o=h.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')};
document.addEventListener('click',function(e){if(!h.contains(e.target))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
window.addEventListener('resize',function(){if(window.innerWidth>760)close()})})();
