const $=s=>document.querySelector(s);let filter='전체',current=null,mode='text',origin=null;
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function list(){let q=$('#search').value.trim().toLowerCase();const items=BOOK.filter(a=>(filter==='전체'||a.group===filter)&&`${a.title} ${a.author}`.toLowerCase().includes(q));$('#articles').innerHTML=items.map(a=>`<button class="article" data-id="${a.id}"><span class="kind">${a.group==='인사말'?'인사말':a.group+' · '+a.type}</span><div><h3>${esc(a.title)}</h3><p>${esc(a.author)}</p></div><span class="read">읽기</span></button>`).join('');$('#empty').hidden=items.length>0;}
$('#search').addEventListener('input',list);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));list()}));
$('#articles').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;origin=b;current=BOOK.find(a=>a.id===b.dataset.id);mode=current.slides?'image':'text';$('#text-mode').hidden=!!current.slides;$('.font-tools').style.display=current.slides?'none':'';$('.reader-inner').style.maxWidth=current.slides?'1100px':'';$('#reader-title').textContent=current.title;$('#reader-author').textContent=current.author;$('#reader-info').textContent=current.slides?'발표 자료를 원본 이미지로 제공합니다. 이미지를 누르면 크게 볼 수 있으며, 휴대전화를 가로로 돌리면 더 편하게 읽을 수 있습니다.':'원문의 문단과 줄바꿈을 살려 큰 글씨로 제공합니다. 표의 배치는 원본 페이지에서 확인하세요.';render();$('#reader').showModal();document.body.classList.add('reading');$('#reader').scrollTop=0;});
function textMarkup(page){
 const blocks=page.blocks||[{type:'paragraph',text:page.text||'이 페이지는 이미지 자료입니다. 원본 페이지 보기에서 확인해 주세요.'}];
 return blocks.map(b=>{
  const text=esc(b.text);
  if(b.type==='heading')return `<h3 class="text-heading">${text}</h3>`;
  if(b.type==='contents')return `<p class="text-contents">${text}</p>`;
  if(b.type==='note')return `<aside class="text-note">${text}</aside>`;
  if(b.type==='bullet')return `<p class="text-bullet">${text}</p>`;
  const emphasized=text.replace(/^(\d+\)\s*[^:\n]{1,90}:)/,'<strong>$1</strong>');
  return `<p>${emphasized}</p>`;
 }).join('');
}
function render(){document.querySelectorAll('.view-tabs button').forEach(b=>b.classList.toggle('active',b.id===(mode==='text'?'text-mode':'image-mode')));$('#reader-content').innerHTML=current.pages.map(p=>`<section><p class="page-label">PDF ${p.n}쪽</p>${mode==='text'?`<div class="page-text">${textMarkup(p)}</div>`:`<a class="original" href="assets/page-${String(p.n).padStart(2,'0')}.jpg" target="_blank" rel="noopener"><img loading="lazy" src="assets/page-${String(p.n).padStart(2,'0')}.jpg" alt="${esc(current.author)} 자료 PDF ${p.n}쪽"><span>이미지를 누르면 크게 볼 수 있습니다.</span></a>`}</section>`).join('');}
$('#text-mode').onclick=()=>{mode='text';render()};$('#image-mode').onclick=()=>{mode='image';render()};function close(){$('#reader').close()};$('#close-reader').onclick=close;$('#back-list').onclick=close;$('#reader').addEventListener('close',()=>{document.body.classList.remove('reading');origin?.focus()});
let font=19;try{font=Number(localStorage.getItem('forum-font'))||19}catch{}font=Math.min(27,Math.max(17,font));function size(v){font=Math.min(27,Math.max(17,v));document.documentElement.style.setProperty('--read-size',font+'px');$('#smaller').disabled=font===17;$('#larger').disabled=font===27;try{localStorage.setItem('forum-font',font)}catch{}}$('#smaller').onclick=()=>size(font-2);$('#larger').onclick=()=>size(font+2);size(font);
const dock=document.createElement('div');dock.className='reader-dock';dock.innerHTML='<a class="download" href="assets/forum.pdf" download="2026_순천_생태문명도시포럼_자료집.pdf">전체 자료집 PDF 다운로드</a>';$('#reader').append(dock);list();
