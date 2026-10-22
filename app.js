(async()=>{
const D=await (await fetch('data/content.json?'+Date.now())).json(),S=D.salon,$=id=>document.getElementById(id);
$('nom').textContent=S.nom;$('accroche').textContent=S.accroche;$('presentation').textContent=S.presentation;$('noteAvis').textContent='★ '+S.note;
['rdv1','rdv2','rdv3'].forEach(i=>$(i).href=S.reservation);$('adresse').textContent=S.adresse;
$('tel').textContent=S.telephone;$('tel').href='tel:'+S.telephone.replace(/\s/g,'');$('fb').href=S.facebook;
$('horaires').innerHTML=S.horaires.map(h=>`<tr><td>${h[0]}</td><td>${h[1]}</td></tr>`).join('');
$('heroImg').style.backgroundImage=`url(${(D.galerie[1]||D.galerie[0]).src})`;
$('tarifsBox').innerHTML=D.tarifs.map(c=>`<article><h3>${c.cat}</h3><ul>${c.items.map(i=>`<li><span>${i[0]}</span><b>${i[1]}</b></li>`).join('')}</ul></article>`).join('');
$('tarifsNote').textContent=D.tarifs_note||'';
$('team').innerHTML=(D.equipe||[]).map(m=>`<div class="member"><div class="ph" style="${m.photo?`background-image:url(${m.photo})`:''}">${m.photo?'':m.nom[0]}</div><h3>${m.nom}</h3><p>${m.role||'&nbsp;'}</p></div>`).join('');
$('equipeNote').textContent=D.equipe_note||'';
$('avisBox').innerHTML=D.avis.map(a=>`<blockquote>« ${a.texte} »<cite>${a.source}</cite></blockquote>`).join('');
// galerie + lightbox (swipe)
const G=D.galerie,lb=$('lb');let k=0;
$('grid').innerHTML=G.map((g,i)=>`<img loading="lazy" src="${g.src}" alt="${g.legende}" data-i="${i}">`).join('');
const show=i=>{k=(i+G.length)%G.length;lb.querySelector('img').src=G[k].src;lb.querySelector('p').textContent=G[k].legende;lb.classList.add('on')};
$('grid').onclick=e=>e.target.dataset.i&&show(+e.target.dataset.i);
lb.querySelector('.x').onclick=()=>lb.classList.remove('on');lb.querySelector('.pv').onclick=()=>show(k-1);lb.querySelector('.nx').onclick=()=>show(k+1);
let x0;lb.ontouchstart=e=>x0=e.touches[0].clientX;lb.ontouchend=e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)show(k+(d<0?1:-1))};
document.onkeydown=e=>{if(!lb.classList.contains('on'))return;if(e.key=='Escape')lb.classList.remove('on');if(e.key=='ArrowRight')show(k+1);if(e.key=='ArrowLeft')show(k-1)};
// visite 360
const V=D.visite,sc={};let viewer=null;
V.scenes.forEach(s=>{if(s.panorama)sc[s.id]={title:s.titre,type:'equirectangular',panorama:s.panorama,autoLoad:true,hotSpots:s.liens.filter(l=>V.scenes.find(x=>x.id==l.vers&&x.panorama)).map(l=>({pitch:l.pitch,yaw:l.yaw,type:'scene',sceneId:l.vers,text:l.texte,cssClass:'lnk',createTooltipFunc:(d)=>d.textContent='→ '+l.texte}))};});
const nav=$('tourNav');nav.innerHTML=V.scenes.map(s=>`<button data-id="${s.id}">${s.titre}${s.panorama?'':'<small>à capturer</small>'}</button>`).join('');
const go=id=>{const s=V.scenes.find(x=>x.id==id);nav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.id==id));
 if(s.panorama){$('flat').style.display='none';$('pano').style.display='block';
  if(!viewer)viewer=pannellum.viewer('pano',{default:{firstScene:id,sceneFadeDuration:900,autoRotate:-2},scenes:sc});else viewer.loadScene(id);}
 else{$('pano').style.display='none';$('flat').style.display='block';$('flatImg').src=s.photo;$('flatImg').alt=s.titre;}};
nav.onclick=e=>{const b=e.target.closest('button');b&&go(b.dataset.id)};
go(V.premiere);
setInterval(()=>{if(viewer){const c=viewer.getScene();nav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.id==c))}},800);
})();
