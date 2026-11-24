/* Kantin UNTAG - logika simulasi (data disimpan di localStorage, tanpa backend) */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const Q=new URLSearchParams(location.search),IMG='assets/images/';
const rp=n=>'Rp'+Number(n).toLocaleString('id-ID');
const KIOS=[
{id:'k1',name:'Kantin Nusantara',open:true,desc:'Menu rumahan, porsi pas untuk jeda kuliah.',long:'Masakan rumahan untuk menemani hari produktifmu di kampus.',jam:'08.00–16.00',from:5000,cats:['nasi','minuman','rumahan'],img:'kios-nusantara.jpg',thumb:'kios-nusantara-thumb.jpg',tags:'Nasi & mi · Minuman · Ambil sendiri'},
{id:'k2',name:'Kopi Kampus',open:true,desc:'Kopi susu dan teman ngobrol di sela aktivitas.',long:'Kopi susu dan minuman dingin untuk teman ngobrol.',jam:'08.00–17.00',from:12000,cats:['minuman'],img:'kios-kopi.jpg',thumb:'kios-kopi.jpg',tags:'Minuman · Ambil sendiri'},
{id:'k3',name:'Dapur Bu Rina',open:false,desc:'Cita rasa rumahan yang selalu bikin rindu.',long:'Cita rasa rumahan yang selalu bikin rindu.',jam:'09.00–15.00',from:15000,cats:['rumahan'],img:'kios-dapur.jpg',thumb:'kios-dapur.jpg',tags:'Masakan rumahan · Ambil sendiri'}];
const MENU=[
{id:'m1',kios:'k1',name:'Nasi Ayam Geprek',price:18000,cat:'nasi',stock:true,img:'nasi-ayam-geprek.jpg',desc:'Ayam krispi, sambal, nasi hangat.',long:'Ayam renyah dengan sambal pilihanmu. Atur tingkat pedas dan catatan sesuai selera.',pedas:true,extras:true,unit:'porsi'},
{id:'m2',kios:'k1',name:'Nasi Goreng',price:17000,cat:'nasi',stock:true,img:'nasi-goreng.jpg',desc:'Nasi goreng gurih dengan sayuran.',long:'Nasi goreng gurih dengan telur dan sayuran segar.',extras:true,unit:'porsi'},
{id:'m3',kios:'k1',name:'Es Teh Manis',price:5000,cat:'minuman',stock:true,img:'es-teh-manis.jpg',desc:'Teh segar, manisnya pas.',long:'Teh segar dengan manis yang pas, disajikan dingin.',unit:'gelas'},
{id:'m4',kios:'k1',name:'Mie Goreng',price:15000,cat:'mi',stock:false,img:'mie-goreng.jpg',desc:'Mi berbumbu dengan sayuran. Menu belum bisa dipesan.',long:'Mi berbumbu dengan sayuran.',unit:'porsi'},
{id:'m5',kios:'k2',name:'Kopi Susu',price:12000,cat:'minuman',stock:true,img:'es-teh-manis.jpg',desc:'Kopi susu dingin untuk menemani kuliahmu.',long:'Kopi susu dingin dengan takaran manis yang pas.',unit:'gelas'},
{id:'m6',kios:'k3',name:'Nasi Rames',price:15000,cat:'nasi',stock:true,img:'nasi-goreng.jpg',desc:'Nasi dengan lauk rumahan.',long:'Nasi dengan lauk rumahan pilihan hari ini.',unit:'porsi'}];
const EXTRA={Telur:3000,Keju:3000};
/* ---------- penyimpanan ---------- */
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SEED=()=>({kios:'k1',items:[{id:'m1',qty:2,pedas:'Normal',extras:[],note:'Sambal dipisah, ya.'},{id:'m3',qty:1,extras:[],note:''}]});
const getCart=()=>LS.get('kt_cart',null)||SEED();
const setCart=c=>{LS.set('kt_cart',c);updBadge()};
const menuOf=id=>MENU.find(m=>m.id===id),kiosOf=id=>KIOS.find(k=>k.id===id);
const lineTotal=l=>(menuOf(l.id).price+(l.extras||[]).reduce((s,e)=>s+EXTRA[e],0))*l.qty;
const cartTotal=c=>c.items.reduce((s,l)=>s+lineTotal(l),0),cartCount=c=>c.items.reduce((s,l)=>s+l.qty,0);
const getOrder=()=>LS.get('kt_order',null)||{no:'KT-001',kios:'k1',items:SEED().items,metode:'QRIS'};
const orderLines=(items,big)=>items.map(l=>{const m=menuOf(l.id);return`<div class="d-flex justify-content-between mb-3"><div><b>${m.name}</b><div class="small2">${l.qty} × ${rp(m.price)}</div></div><b>${rp(lineTotal(l))}</b></div>`}).join('');
/* ---------- komponen bersama ---------- */
function layout(){
 const p=document.body.dataset.page,act={index:'index',jelajah:'jelajah',kios:'jelajah',menu:'jelajah',keranjang:'keranjang',checkout:'keranjang',pembayaran:'pesanan',status:'pesanan',riwayat:'pesanan'}[p];
 const brand='<a class="brand" href="index.html"><img src="assets/icons/logo.svg" alt=""><span><b>Kantin UNTAG</b><small>Surabaya · Edisi Kampus</small></span></a>';
 let mid='<span></span>',right='<span class="tag justify-self-end" style="justify-self:end">DESAIN SIMULASI · CONTOH</span>';
 if(p!=='login'){
  mid='<nav class="navk">'+[['index','Beranda','index.html'],['jelajah','Jelajah','jelajah.html'],['keranjang','Keranjang','keranjang.html'],['pesanan','Pesanan','status.html']].map(([k,t,h])=>`<a href="${h}" class="${k===act?'active':''}">${t}${k==='keranjang'?'<span class="badge-c cart-badge">0</span>':''}</a>`).join('')+'</nav>';
  right='<div class="dropdown nav-user" style="justify-self:end"><a href="#" class="user text-reset" data-bs-toggle="dropdown"><span class="avatar"></span><span><b>Pengguna kampus</b><small>Akun simulasi</small></span><i class="fa-solid fa-chevron-down" style="font-size:10px;color:#77716e"></i></a><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="riwayat.html">Riwayat pesanan</a></li><li><a class="dropdown-item" href="login.html">Keluar</a></li></ul></div>';
 }
 $('#app-header').innerHTML=`<header class="topbar"><div class="container">${brand}${mid}${right}</div></header>`;
 $('#app-footer').innerHTML='<footer class="foot"><div class="container"><span>Kantin UNTAG Surabaya · Ruang makan, lebih dekat.</span><span>CONTOH · Semua data dan transaksi hanya simulasi.</span></div></footer>';
 updBadge();
}
function updBadge(){$$('.cart-badge').forEach(e=>e.textContent=cartCount(getCart()))}
function popup(o){return Swal.fire({buttonsStyling:false,showCancelButton:true,reverseButtons:true,focusConfirm:false,
 customClass:{popup:'kt-pop',confirmButton:'kt-ok',cancelButton:'kt-cancel'+(o.red?' red':'')},confirmButtonText:o.ok,cancelButtonText:o.no,
 html:`<div class="kt-top"><div class="kt-ic"><i class="fa-solid ${o.icon}"></i></div><span class="tag gray">CONTOH · SIMULASI</span></div><h2>${o.title}</h2><p>${o.text}</p><div class="kt-note">${o.note}</div>`})}
const stateBox=(ic,t,p,btn)=>`<div class="state-box"><div class="ic"><i class="fa-solid ${ic}"></i></div><h3>${t}</h3><p>${p}</p>${btn||''}</div>`;
const kiosCard=k=>`<article class="cardk kios-card ${k.open?'':'closed'}"><img src="${IMG+k.img}" alt="${k.name}"><div class="body"><div class="row1"><span class="tag ${k.open?'':'gray'}">${k.open?'Buka':'Tutup'}</span><span class="small2">CONTOH</span></div><h3>${k.name}</h3><p>${k.desc}</p><div class="small2">${k.jam} WIB · Jam contoh</div><div class="foot2"><span>Mulai ${rp(k.from)}</span><a class="btn btn-line" href="kios.html?id=${k.id}">Lihat Menu</a></div></div></article>`;
const skelCards=()=>`<div class="grid3">${[1,2,3].map(()=>'<div class="cardk pad"><div class="skel" style="height:130px"></div><div class="skel mt-3" style="height:14px;width:40%"></div><div class="skel mt-2" style="height:12px"></div><div class="skel mt-2" style="height:12px;width:70%"></div></div>').join('')}</div>`;
/* ---------- 01 Masuk ---------- */
function pgLogin(){
 $('#eye').onclick=()=>{const i=$('#pass'),s=i.type==='password';i.type=s?'text':'password';$('#eye i').className='fa-solid '+(s?'fa-eye-slash':'fa-eye')};
 $('#loginForm').onsubmit=e=>{e.preventDefault();location='index.html'};
}
/* ---------- 02 Beranda ---------- */
function pgIndex(){
 $('#kiosList').innerHTML=KIOS.map(kiosCard).join('');
 $('#heroForm').onsubmit=e=>{e.preventDefault();location='jelajah.html?q='+encodeURIComponent($('#heroQ').value)};
 $$('.pill').forEach(p=>p.onclick=()=>{$$('.pill').forEach(x=>x.classList.remove('on'));p.classList.add('on')});
}
/* ---------- 03 Jelajah Kios (memuat / kosong / gagal) ---------- */
function pgJelajah(){
 const F={status:'semua',kat:'semua',harga:'semua'},T={status:'Status kios',kat:'Kategori',harga:'Harga menu'};
 const L={status:{semua:'Semua kios',buka:'Buka sekarang'},kat:{semua:'Semua kategori',nasi:'Nasi & mi',minuman:'Minuman',rumahan:'Masakan rumahan'},harga:{semua:'Semua harga','<15':'Di bawah Rp15.000','15-25':'Rp15.000–Rp25.000'}};
 const qi=$('#q');qi.value=Q.get('q')||'';
 $('#filters').innerHTML=Object.keys(L).map(g=>`<div class="grp"><b>${T[g]}</b>`+Object.entries(L[g]).map(([v,t])=>`<div class="form-check"><input class="form-check-input" type="checkbox" data-g="${g}" data-v="${v}" id="${g}${v}"><label class="form-check-label" for="${g}${v}">${t}</label></div>`).join('')+'</div>').join('');
 const match=k=>{const q=qi.value.trim().toLowerCase();
  if(q&&!(k.name.toLowerCase().includes(q)||MENU.some(m=>m.kios===k.id&&m.name.toLowerCase().includes(q))))return false;
  if(F.status==='buka'&&!k.open)return false;if(F.kat!=='semua'&&!k.cats.includes(F.kat))return false;
  if(F.harga==='<15'&&!(k.from<15000))return false;if(F.harga==='15-25'&&!(k.from>=15000&&k.from<=25000))return false;return true};
 const reset=()=>{Object.keys(F).forEach(g=>F[g]='semua');qi.value='';$('#sort').value='rek';render()};
 const render=()=>{
  $$('#filters input').forEach(i=>i.checked=F[i.dataset.g]===i.dataset.v);
  $('#chips').innerHTML=Object.keys(F).map((g,i)=>`<span class="fchip ${i===0?'on':''}">${L[g][F[g]]} ×</span>`).join('');
  const list=KIOS.filter(match),s=$('#sort').value;
  if(s==='harga')list.sort((a,b)=>a.from-b.from);if(s==='abjad')list.sort((a,b)=>a.name.localeCompare(b.name));
  $('#count').textContent=list.length+' kios ditemukan';
  $('#result').innerHTML=list.length?`<div class="grid3">${list.map(kiosCard).join('')}</div><p class="small2 mt-3">CONTOH · Status, harga, dan jam operasional di halaman ini adalah data simulasi.</p>`:stateBox('fa-bag-shopping','Kios tidak ditemukan','Coba kata kunci lain atau hapus filter untuk melihat lebih banyak pilihan.','<button class="btn btn-del" id="reset">Hapus Filter</button>');
  const r=$('#reset');if(r)r.onclick=reset};
 $('#filters').onchange=e=>{const i=e.target;F[i.dataset.g]=i.checked?i.dataset.v:'semua';render()};
 qi.oninput=render;$('#sort').onchange=render;$('#resetBtn').onclick=reset;
 $('#count').textContent='Memuat hasil...';$('#result').innerHTML=skelCards()+'<p class="small2 mt-3">Memuat kios... Mohon tunggu sebentar.</p>';
 setTimeout(()=>{if(Q.get('state')==='gagal'){$('#count').textContent='Hasil belum tersedia';$('#result').innerHTML=stateBox('fa-circle-exclamation','Pencarian gagal','Daftar kios belum dapat ditampilkan. Periksa koneksi lalu coba kembali.','<a class="btn btn-brand" href="jelajah.html">Coba Lagi</a>')}else render()},Q.get('state')==='memuat'?60000:700);
}
/* ---------- 04 Halaman Kios ---------- */
function pgKios(){
 const k=kiosOf(Q.get('id'))||KIOS[0];let cat='semua',q='';
 $('#crumbK').textContent=k.name;
 $('#head').innerHTML=`<img src="${IMG+k.thumb}" alt=""><div><div class="d-flex align-items-center gap-3"><h1>${k.name}</h1><span class="tag ${k.open?'':'gray'}">${k.open?'Buka':'Tutup'}</span><span class="tag label">CONTOH</span></div><p class="sub my-2">${k.long}</p><div class="small2"><i class="fa-regular fa-clock"></i> ${k.jam} WIB · Jam contoh &nbsp;&nbsp;&nbsp; ${k.tags}</div></div>`;
 $('#sq').placeholder='Cari menu di '+k.name;
 const render=()=>{
  const items=MENU.filter(m=>m.kios===k.id&&(cat==='semua'||m.cat===cat)&&m.name.toLowerCase().includes(q)),ok=items.filter(m=>m.stock),no=items.filter(m=>!m.stock);
  $('#tabCount').textContent=items.length+' menu';
  $('#menus').innerHTML=(ok.length?`<div class="menu-grid">${ok.map(m=>`<article class="cardk menu-card"><img src="${IMG+m.img}" alt=""><div class="body"><div class="meta"><span>CONTOH</span><b>Tersedia</b></div><h3>${m.name}</h3><p>${m.desc}</p><div class="d-flex justify-content-between align-items-center"><span class="price">${rp(m.price)}</span><a class="btn btn-line btn-xs" href="menu.html?id=${m.id}">Lihat Detail</a></div></div></article>`).join('')}</div>`:'')
  +no.map(m=>`<div class="menu-row mt-3"><img src="${IMG+m.img}" alt=""><div class="flex-grow-1"><div><span style="font-size:18px">${m.name}</span><span class="tag gray ms-3">Stok Habis</span></div><div class="small2 my-1">${m.desc}</div><div>${rp(m.price)} · CONTOH</div></div><button class="btn" disabled>Tambah</button></div>`).join('')
  +(items.length?'':stateBox('fa-bag-shopping','Menu tidak ditemukan','Coba kata kunci atau kategori lain.'))};
 $('#sq').oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
 $('#tabs').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat=b.dataset.cat;$$('#tabs [data-cat]').forEach(x=>x.classList.toggle('on',x===b));render()};
 render();
 const c=getCart();
 $('#cartPanel').innerHTML=c.items.length?`<div class="d-flex align-items-center gap-2 mb-3"><i class="fa-solid fa-bag-shopping"></i><span class="t-light">Keranjangmu</span></div><div class="mb-2">${kiosOf(c.kios).name}</div><span class="tag">Satu keranjang, satu kios</span><div class="my-3">${c.items.map(l=>`<div class="mb-2">${l.qty} × ${menuOf(l.id).name}</div>`).join('')}</div><div class="d-flex justify-content-between align-items-center pt-3" style="border-top:1px solid var(--n200)"><span class="muted">${cartCount(c)} item</span><strong style="font-size:22px">${rp(cartTotal(c))}</strong></div><a class="btn btn-brand w-100 mt-3" href="keranjang.html">Lihat Keranjang</a><p class="small2 mt-3 mb-0">Menambah menu dari kios lain memerlukan persetujuan untuk mengganti isi keranjang.</p>`:`<div class="d-flex align-items-center gap-2 mb-3"><i class="fa-solid fa-bag-shopping"></i><span class="t-light">Keranjangmu</span></div><p class="muted mb-0">Belum ada menu. Pilih menu lalu tambahkan ke keranjang.</p>`;
}
/* ---------- 05 Detail Menu (ditambahkan / stok habis / ganti kios) ---------- */
function pgMenu(){
 const m=menuOf(Q.get('id'))||MENU[0],k=kiosOf(m.kios),can=m.stock&&k.open;let qty=1,pedas='Normal',ex=[];
 $('#crumbM').innerHTML=`<a href="kios.html?id=${k.id}">${k.name}</a> / ${m.name}`;
 $('#photo').innerHTML=`<img src="${IMG+m.img}" alt="${m.name}" style="width:100%;height:446px;object-fit:cover;border-radius:16px">`;
 $('#info').innerHTML=`<span class="tag ${can?'':'gray'}">${m.stock?'Tersedia':'Stok Habis'}</span><span class="small2 ms-2">${k.name} · CONTOH</span>
 <div class="d-flex justify-content-between align-items-center mt-3"><h1 style="font-size:28px;font-weight:400">${m.name}</h1><span style="font-size:26px;font-weight:700;color:var(--primary)">${rp(m.price)}</span></div>
 <p class="muted my-3">${m.long}</p>
 ${can?'':`<div class="note amber mb-3"><i class="fa-solid fa-circle-exclamation"></i><div><b>${m.stock?'Kios sedang tutup':'Menu sementara tidak tersedia'}</b>${m.stock?'Kembali lagi saat kios buka.':'Stok contoh habis. Pilih menu lain atau periksa kembali nanti.'}</div></div>`}
 ${m.pedas?`<div class="fw6 mb-2" style="font-size:14px">Tingkat pedas *</div><div class="row g-3" id="pedas">${['Normal','Pedas','Ekstra pedas'].map((o,i)=>`<div class="col-4"><label class="opt ${i?'':'on'}"><input type="radio" name="pd" value="${o}" class="d-none" ${i?'':'checked'}><i class="fa-regular ${i?'fa-circle':'fa-circle-dot'} me-2"></i>${o}</label></div>`).join('')}</div><div class="small2 mt-2 mb-3">Wajib pilih satu · Tanpa tambahan harga</div>`:''}
 ${m.extras?`<div class="fw6 mb-2" style="font-size:14px">Tambahan (opsional)</div><div class="d-flex gap-4" id="extras">${Object.entries(EXTRA).map(([n,v])=>`<label class="d-flex gap-2 align-items-center muted" style="font-size:14px"><input class="form-check-input mt-0" type="checkbox" value="${n}">${n} +${rp(v)}</label>`).join('')}</div><div class="small2 mt-2 mb-3" id="exNote">Tidak ada tambahan dipilih pada pesanan contoh.</div>`:''}
 <label class="form-label" for="note">Catatan untuk kios (opsional)</label><textarea id="note" class="form-control" rows="2" placeholder="Contoh: sambal dipisah, ya."></textarea>
 <div class="d-flex justify-content-between align-items-end my-3"><div class="d-flex align-items-center gap-3"><b style="font-size:14px">Jumlah</b><div class="qty"><button id="mn" disabled>−</button><output id="qo">1</output><button id="pl">+</button></div></div><div class="text-end"><div class="small2">Total <span id="qp">1</span> porsi</div><div class="price-big" id="tot"></div></div></div>
 <button id="add" class="btn btn-brand w-100 py-3" ${can?'':'disabled'}>${can?'Tambah ke Keranjang':'Menu Tidak Tersedia'}</button>
 <div id="added" class="mt-3"></div>
 <div class="small2 mt-3">CONTOH · Harga dan ketersediaan untuk simulasi. Pesanan diambil sendiri di ${k.name}.</div>`;
 const line=()=>({id:m.id,qty,pedas:m.pedas?pedas:undefined,extras:ex.slice(),note:$('#note').value.trim()});
 const calc=()=>{$('#qo').textContent=qty;$('#qp').textContent=qty;$('#mn').disabled=qty<=1;$('#tot').textContent=rp(lineTotal(line()));
  const n=$('#exNote');if(n)n.textContent=ex.length?'Tambahan: '+ex.join(', '):'Tidak ada tambahan dipilih pada pesanan contoh.'};
 $('#mn').onclick=()=>{qty=Math.max(1,qty-1);calc()};$('#pl').onclick=()=>{qty++;calc()};
 const pd=$('#pedas');if(pd)pd.onchange=e=>{pedas=e.target.value;$$('#pedas .opt').forEach(o=>{const on=o.querySelector('input').checked;o.classList.toggle('on',on);o.querySelector('i').className='fa-regular me-2 '+(on?'fa-circle-dot':'fa-circle')})};
 const ee=$('#extras');if(ee)ee.onchange=()=>{ex=$$('#extras input:checked').map(i=>i.value);calc()};
 calc();
 $('#add').onclick=async()=>{
  const ln=line();let c=getCart();
  if(c.items.length&&c.kios!==m.kios){const ok=kiosOf(c.kios),n=cartCount(c);
   const r=await popup({icon:'fa-store',title:'Ganti kios dan isi keranjang?',text:`Keranjangmu berisi ${n} item dari ${ok.name} (${rp(cartTotal(c))}). Menu ${m.name} berasal dari ${k.name}. Satu keranjang hanya dapat berisi menu dari satu kios.`,note:`Dengan memilih Ganti Kios, kamu menyetujui penghapusan ${n} item saat ini dan penambahan ${m.name} ${rp(lineTotal(ln))} ke keranjang baru.`,ok:'Ganti Kios',no:'Batal'});
   if(!r.isConfirmed)return;c={kios:m.kios,items:[]}}
  c.kios=m.kios;
  const same=c.items.find(l=>l.id===ln.id&&l.pedas===ln.pedas&&l.note===ln.note&&l.extras.join()===ln.extras.join());
  same?same.qty+=ln.qty:c.items.push(ln);setCart(c);
  $('#added').innerHTML=`<div class="note mint"><i class="fa-solid fa-circle-check"></i><div><b>${ln.qty} ${m.name} ditambahkan</b>Keranjang ${k.name} kini berisi ${cartCount(c)} item. Total ${rp(cartTotal(c))}.</div><a class="btn btn-line ms-auto" href="keranjang.html">Lihat Keranjang</a></div>`};
}
/* ---------- 06 Keranjang (memuat / kosong / perlu diperbarui / item dihapus) ---------- */
function pgKeranjang(){
 const upd=Q.get('state')==='update';let removed=null;
 const draw=()=>{const c=getCart();
  if(!c.items.length){$('#sub').textContent='Menu favoritmu akan terkumpul di sini.';$('#root').innerHTML=stateBox('fa-bag-shopping','Keranjang kamu masih kosong','Mulai dari kios favorit, lalu tambahkan makanan atau minuman untuk menemani harimu.','<a class="btn btn-brand" href="jelajah.html">Jelajahi Kios</a>');return}
  const k=kiosOf(c.kios),total=cartTotal(c);
  const lines=c.items.map((l,i)=>{const m=menuOf(l.id),bad=upd&&m.id==='m3';
   const opt=m.pedas?`${l.pedas||'Normal'} · ${(l.extras||[]).length?l.extras.join(', '):'Tanpa tambahan'}`:(m.cat==='minuman'?'Manis normal · Es normal':((l.extras||[]).length?l.extras.join(', '):'Tanpa tambahan'));
   return`<div class="line"><img src="${IMG+m.img}" alt=""><div class="flex-grow-1"><h4>${m.name}</h4><div class="muted mb-1">${rp(m.price)} / ${m.unit}</div><div class="small2">${opt}</div><div class="small2">${bad?'<b style="color:var(--error)">Stok Habis</b> · Perbarui keranjang untuk melanjutkan':'Catatan: '+(l.note||'—')}</div><div class="d-flex gap-3 align-items-center mt-2"><div class="qty"><button data-q="${i}" data-d="-1" ${l.qty<=1?'disabled':''}>−</button><output>${l.qty}</output><button data-q="${i}" data-d="1">+</button></div><button class="btn-link-k" data-edit="${i}">Ubah catatan</button><button class="btn-link-k" style="color:var(--n500);font-weight:500" data-del="${i}"><i class="fa-solid fa-trash-can"></i> Hapus</button></div></div><strong class="align-self-center">${rp(lineTotal(l))}</strong></div>`}).join('');
  $('#root').innerHTML=(upd?`<div class="note amber mb-3"><i class="fa-solid fa-circle-exclamation"></i><div><b>Ketersediaan menu berubah</b>Es Teh Manis tidak tersedia pada contoh ini. Perbarui keranjang dan periksa total baru sebelum checkout. Total di bawah masih total sebelumnya.</div><button class="btn btn-line ms-auto" data-fix>Perbarui Keranjang</button></div>`:'')+
  `<div class="g-split" style="--rc:408px"><div><div class="cardk pad"><div class="d-flex justify-content-between align-items-start mb-2"><div class="d-flex gap-3"><i class="fa-solid fa-store mt-1"></i><div><div class="t-light">${k.name}</div><div class="small2">CONTOH · ${cartCount(c)} item</div></div></div><span class="tag">Satu keranjang, satu kios</span></div>${lines}</div>
  ${removed?`<div class="note mint mt-3"><i class="fa-solid fa-circle-check"></i><div><b>Item dihapus</b>${removed.l.qty} ${menuOf(removed.l.id).name} dihapus dari keranjang contoh. Total sekarang ${rp(total)}.</div><button class="btn btn-del ms-auto" data-undo>Urungkan</button></div>`:`<div class="note mt-3"><i class="fa-solid fa-circle-info"></i><div><b>Pesanan diambil langsung di kios</b>Pastikan waktu pengambilan sesuai jadwalmu. Mengganti kios akan mengganti isi keranjang dengan persetujuanmu.</div></div>`}</div>
  <div><div class="cardk pad"><div class="t-light mb-4">Ringkasan pesanan</div><div class="sum-row muted"><span>Subtotal</span><b style="color:var(--n900)">${rp(total)}</b></div><div class="sum-row muted"><span>Biaya layanan</span><b style="color:var(--n900)">Rp0</b></div><div class="sum-total"><span>Total</span><strong>${rp(total)}</strong></div>${upd?'<button class="btn w-100 py-3" disabled>Lanjut ke Checkout</button>':'<a class="btn btn-brand w-100 py-3" href="checkout.html">Lanjut ke Checkout</a>'}<p class="small2 mt-3">Ambil sendiri di ${k.name}. Tidak ada biaya tambahan pada contoh ini.</p><span class="tag gray">CONTOH · Bukan transaksi nyata</span></div><p class="small2 mt-3"><i class="fa-solid fa-shield-halved me-2"></i>Belum ada pembayaran. Kamu dapat memeriksa pesanan di langkah berikutnya.</p></div></div>`};
 $('#root').onclick=async e=>{const b=e.target.closest('button');if(!b)return;let c=getCart();
  if(b.dataset.q!==undefined){const l=c.items[+b.dataset.q];l.qty=Math.max(1,l.qty+ +b.dataset.d);removed=null}
  else if(b.dataset.del!==undefined){removed={l:c.items[+b.dataset.del],i:+b.dataset.del};c.items.splice(removed.i,1)}
  else if(b.hasAttribute('data-undo')){c.items.splice(removed.i,0,removed.l);removed=null}
  else if(b.hasAttribute('data-fix')){c.items=c.items.filter(l=>l.id!=='m3');setCart(c);location='keranjang.html';return}
  else if(b.dataset.edit!==undefined){const l=c.items[+b.dataset.edit];
   const r=await Swal.fire({title:'Ubah catatan',input:'text',inputValue:l.note||'',inputPlaceholder:'Tambahkan pesan untuk kios',showCancelButton:true,reverseButtons:true,buttonsStyling:false,confirmButtonText:'Simpan',cancelButtonText:'Batal',customClass:{popup:'kt-pop',confirmButton:'kt-ok',cancelButton:'kt-cancel'}});
   if(!r.isConfirmed)return;l.note=r.value.trim()}
  else return;
  setCart(c);draw()};
 $('#root').innerHTML='<div class="g-split" style="--rc:408px"><div class="cardk pad"><div class="fw6 mb-3">Memuat keranjang...</div><div class="skel mb-3" style="height:100px"></div><div class="skel" style="height:100px"></div></div><div class="cardk pad"><div class="skel mb-3" style="height:24px"></div><div class="skel" style="height:110px"></div></div></div>';
 setTimeout(draw,Q.get('state')==='memuat'?60000:500);
}
/* ---------- 07 Checkout (validasi) ---------- */
function pgCheckout(){
 const c=getCart();if(!c.items.length){location='keranjang.html';return}
 const k=kiosOf(c.kios),total=cartTotal(c);let shown=false;
 const W=[['','Pilih waktu pengambilan'],['cepat','Secepatnya · Estimasi 12.15 WIB (CONTOH)'],['12.30','12.30 WIB (CONTOH)'],['13.00','13.00 WIB (CONTOH)']];
 $('#root').innerHTML=`<div id="errTop"></div><div class="g-split"><div class="cardk pad"><div class="d-flex justify-content-between"><div><div class="t-light">${k.name}</div><div class="small2 mt-1">CONTOH · Ambil sendiri di kios</div></div><span class="tag">Satu kios</span></div>
 <div class="note cream my-4"><i class="fa-solid fa-bag-shopping"></i><div><b>Ambil sendiri · Tanpa biaya pengantaran</b>Tunjukkan nomor pesanan contoh saat mengambil pesanan.</div></div>
 <label class="form-label" for="waktu">Waktu pengambilan *</label><select id="waktu" class="form-select">${W.map(([v,t],i)=>`<option value="${v}" ${i===1?'selected':''}>${t}</option>`).join('')}</select><div id="eW" class="err-t d-none">Waktu pengambilan wajib dipilih.</div><div class="small2 mt-2 mb-4">Perkiraan waktu hanya simulasi dan dapat berubah.</div>
 <div class="fw6 mb-2" style="font-size:14px">Metode pembayaran *</div><div class="row g-3" id="pay">${[['QRIS','fa-qrcode','Pembayaran digital simulasi'],['Tunai','fa-money-bill-1','Bayar saat mengambil']].map(([v,i,t],n)=>`<div class="col-6"><label class="pay-opt ${n?'':'on'}"><input type="radio" name="metode" value="${v}" ${n?'':'checked'}><i class="fa-solid ${i}"></i><span><b>${v}</b><small>${t}</small></span></label></div>`).join('')}</div><div id="eM" class="err-t d-none">Metode pembayaran wajib dipilih.</div>
 <label class="form-label mt-4" for="cat">Catatan pesanan (opsional)</label><input id="cat" class="form-control" placeholder="Tambahkan pesan untuk kios"></div>
 <div><div class="cardk pad mb-3"><div class="d-flex justify-content-between mb-3"><span class="t-light">Pesananmu · ${cartCount(c)} item</span><a href="keranjang.html" class="small2">Ubah</a></div>${orderLines(c.items)}</div>
 <div class="cardk pad"><div class="t-light mb-4">Ringkasan pesanan</div><div class="sum-row muted"><span>Subtotal</span><b style="color:var(--n900)">${rp(total)}</b></div><div class="sum-row muted"><span>Biaya layanan</span><b style="color:var(--n900)">Rp0</b></div><div class="sum-total"><span>Total</span><strong>${rp(total)}</strong></div><button id="go" class="btn btn-brand w-100 py-3">Lanjut ke Pembayaran</button><p class="small2 mt-3">Ambil sendiri di ${k.name}. Tidak ada biaya tambahan pada contoh ini.</p><span class="tag gray">CONTOH · Bukan transaksi nyata</span></div></div></div>`;
 const check=()=>{const okW=!!$('#waktu').value,mt=$('input[name=metode]:checked'),okM=!!mt;
  $('#waktu').classList.toggle('is-bad',shown&&!okW);$('#eW').classList.toggle('d-none',!(shown&&!okW));
  $('#eM').classList.toggle('d-none',!(shown&&!okM));$$('.pay-opt').forEach(o=>{o.classList.toggle('on',o.querySelector('input').checked);o.style.borderColor=shown&&!okM?'var(--error)':''});
  $('#errTop').innerHTML=shown&&!(okW&&okM)?'<div class="note red mb-3"><i class="fa-solid fa-circle-exclamation"></i><div><b>Lengkapi informasi yang wajib diisi</b>Waktu pengambilan dan metode pembayaran belum dipilih. Tidak ada pesanan yang dikirim.</div></div>':'';
  $('#go').disabled=shown&&!(okW&&okM);return okW&&okM};
 $('#root').onchange=check;
 $('#go').onclick=()=>{shown=true;if(!check())return;const m=$('input[name=metode]:checked').value;
  LS.set('kt_order',{no:'KT-001',kios:c.kios,items:c.items,metode:m,waktu:$('#waktu').value,catatan:$('#cat').value});
  location=m==='QRIS'?'pembayaran.html':'status.html?state=diterima'};
 if(Q.get('state')==='validasi'){$('#waktu').value='';$$('input[name=metode]').forEach(i=>i.checked=false);shown=true;check()}
}
/* ---------- 08 Pembayaran (menunggu / berhasil / gagal / kedaluwarsa / batalkan) ---------- */
function pgPembayaran(){
 const o=getOrder(),k=kiosOf(o.kios),total=o.items.reduce((s,l)=>s+lineTotal(l),0),st=Q.get('state')||'menunggu';
 const H={menunggu:['Selesaikan pembayaran','Menunggu pembayaran',''],berhasil:['Simulasi pembayaran berhasil','Berhasil · Simulasi',''],gagal:['Pembayaran simulasi gagal','Gagal','red'],kedaluwarsa:['Waktu pembayaran habis','Kedaluwarsa','gray']}[st]||[];
 $('#title').textContent=H[0];$('#sub').textContent=`CONTOH #${o.no} · ${k.name} · ${o.metode||'QRIS'}`;
 $('#badge').className='tag '+(st==='menunggu'?'amber':H[2]);$('#badge').textContent=H[1];
 const P={
  berhasil:stateBox('fa-circle-check','Pembayaran contoh berhasil','Ini hanya konfirmasi simulasi, bukan bukti pembayaran nyata. Pesanan contoh diteruskan untuk disiapkan.','<a class="btn btn-brand" href="status.html">Lihat Status Pesanan</a>'),
  gagal:stateBox('fa-circle-exclamation','Simulasi belum berhasil',`Tidak ada dana yang diproses. Coba lagi untuk melanjutkan simulasi pembayaran ${rp(total)}.`,'<a class="btn btn-brand" href="pembayaran.html">Coba Lagi</a>'),
  kedaluwarsa:stateBox('fa-bag-shopping','Pembayaran contoh kedaluwarsa','Batas waktu contoh telah habis. Kembali ke checkout, periksa pesanan, lalu buat pembayaran simulasi baru.','<a class="btn btn-brand" href="checkout.html">Kembali ke Checkout</a>'),
  menunggu:`<div class="text-center"><div class="muted" style="font-size:14px">Total pembayaran contoh</div><div class="price-big mt-1" style="font-size:32px">${rp(total)}</div><div class="qris"><i class="c1"></i><i class="c2"></i><i class="fa-solid fa-qrcode mb-3" style="font-size:24px;color:#a9a39f"></i><div style="font-size:18px">QRIS SIMULASI</div><div class="small2 mt-2">Bukan kode QR.<br>Tidak dapat dipindai.</div></div><div class="timer"><i class="fa-regular fa-clock"></i>Sisa waktu <span id="tm">07:42</span> · Hitung mundur simulasi</div><p class="small2 my-3">Menunggu status pembayaran contoh. Tidak ada transaksi nyata.</p><div class="d-flex gap-3 justify-content-center"><a class="btn btn-line" href="checkout.html">Kembali ke Checkout</a><button id="cancel" class="btn btn-soft" style="color:var(--error)">Batalkan Pesanan</button></div><p class="small2 mt-4 mb-0">Demo status: <a href="pembayaran.html?state=berhasil">Berhasil</a> · <a href="pembayaran.html?state=gagal">Gagal</a> · <a href="pembayaran.html?state=kedaluwarsa">Kedaluwarsa</a></p></div>`};
 $('#left').innerHTML=P[st]||P.menunggu;
 $('#right').innerHTML=`<div class="cardk pad"><div class="t-light mb-4">Ringkasan pesanan</div><div class="muted mb-4" style="font-size:14px">CONTOH #${o.no} · ${k.name}</div>${orderLines(o.items)}<div class="d-flex justify-content-between align-items-center pt-3" style="border-top:1px solid var(--n200)"><span style="font-size:14px">Total · Biaya layanan Rp0</span><strong style="font-size:20px">${rp(total)}</strong></div></div>
 <div class="t-light mt-4 mb-3" style="font-size:22px">Cara membaca simulasi</div><ol class="num-list"><li><span>1</span>QRIS di sebelah hanya placeholder visual.</li><li><span>2</span>Nominal contoh sesuai dengan isi keranjang.</li><li><span>3</span>Status berhasil tidak berarti uang diterima.</li></ol>`;
 if(st==='menunggu'){let s=462;const t=setInterval(()=>{s--;if(s<=0){clearInterval(t);location='pembayaran.html?state=kedaluwarsa';return}$('#tm').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000);
  $('#cancel').onclick=async()=>{const r=await popup({icon:'fa-circle-exclamation',red:true,title:'Batalkan pesanan contoh?',text:`CONTOH #${o.no} belum dibayar. Membatalkan pesanan akan mengakhiri proses pembayaran simulasi ini. Tidak ada dana yang diproses.`,note:'Ingin tetap memesan? Pilih Lanjutkan Pembayaran.',ok:'Lanjutkan Pembayaran',no:'Batalkan Pesanan'});
   if(r.dismiss===Swal.DismissReason.cancel){LS.set('kt_cancelled',{no:o.no,kios:k.name,items:o.items,total});location='riwayat.html'}}}
}
/* ---------- 09 Status Pesanan (memuat / kosong / siap / gagal / batalkan) ---------- */
function pgStatus(){
 const st=Q.get('state')||'disiapkan',o=getOrder(),k=kiosOf(o.kios),total=o.items.reduce((s,l)=>s+lineTotal(l),0),root=$('#root');
 if(st==='memuat'){root.innerHTML='<div class="skel mb-4" style="height:140px"></div><div class="g-split"><div class="cardk pad"><div class="skel mb-3" style="height:20px;width:30%"></div><div class="skel mb-3" style="height:56px"></div><div class="skel" style="height:56px"></div></div><div class="cardk pad"><div class="skel mb-3" style="height:20px"></div><div class="skel" style="height:90px"></div></div></div><p class="small2 mt-3">Memuat status pesanan... Mohon tunggu sebentar.</p>';setTimeout(()=>location='status.html',2500);return}
 if(st==='kosong'){$('#sub').textContent='Informasi pesanan aktifmu akan tampil di sini.';root.innerHTML=stateBox('fa-bag-shopping','Belum ada pesanan aktif','Jelajahi kios kampus dan temukan menu untuk menemani aktivitasmu.','<a class="btn btn-brand" href="jelajah.html">Jelajahi Kios</a>');return}
 if(st==='gagal'){$('#sub').textContent='Informasi pesanan aktifmu akan tampil di sini.';root.innerHTML=stateBox('fa-circle-exclamation','Status pesanan gagal diperbarui','Informasi terbaru belum tersedia. Periksa koneksi dan coba perbarui kembali.','<a class="btn btn-brand" href="status.html">Coba Lagi</a>');return}
 const S={diterima:{i:0,h:'Pesananmu Diterima',d:'Kios sudah menerima pesananmu dan akan segera menyiapkannya.',ic:'fa-bag-shopping',est:'Estimasi siap · CONTOH',tag:['Pesanan Diterima','']},disiapkan:{i:1,h:'Pesananmu Sedang Disiapkan',d:'Kios sedang menyiapkan makananmu. Terima kasih sudah menunggu.',ic:'fa-mug-hot',est:'Estimasi siap · CONTOH',tag:['Sedang Disiapkan','amber']},siap:{i:2,h:'Pesananmu Siap Diambil',d:'Silakan menuju kios dan tunjukkan nomor pesanan contoh.',ic:'fa-bag-shopping',est:'Siap sejak · CONTOH',tag:['Siap Diambil','']}}[st]||{};
 const times=['12.00 WIB','12.03 WIB','12.15 WIB','—'],names=['Pesanan Diterima','Sedang Disiapkan','Siap Diambil','Selesai'];
 const note={diterima:`<div class="note"><i class="fa-solid fa-circle-info"></i><div><b>Pesanan masih bisa dibatalkan</b>Pembatalan hanya tersedia sebelum kios memulai persiapan.</div><button id="cancel" class="btn btn-danger-line ms-auto">Batalkan Pesanan</button></div>`,disiapkan:`<div class="note"><i class="fa-solid fa-circle-info"></i><div><b>Pembatalan tidak tersedia</b>Persiapan sudah dimulai oleh kios. Pesanan tidak dapat dibatalkan agar proses penyiapan tetap berjalan.</div></div>`,siap:`<div class="note"><i class="fa-solid fa-circle-info"></i><div><b>Pembatalan tidak tersedia</b>Pesanan telah selesai disiapkan dan menunggu pengambilan. Pembatalan tidak dapat dilakukan.</div></div>`}[st];
 root.innerHTML=`<div class="banner ${st==='siap'?'':''}" style="${st==='siap'?'background:#e3f0e8':''}"><div class="ic"><i class="fa-solid ${S.ic}"></i></div><div class="flex-grow-1"><small>CONTOH #${o.no} · ${k.name}</small><h2>${S.h}</h2><div class="muted">${S.d}</div></div><div class="text-end"><div class="small2">${S.est}</div><div style="font-size:26px;font-weight:700;color:var(--primary)">12.15 WIB</div></div></div>
 <div class="g-split mt-4"><div><div class="cardk pad mb-3"><div class="d-flex justify-content-between"><span class="t-light">Perjalanan pesananmu</span><span class="tag gray">Waktu contoh</span></div><div class="stepper">${names.map((n,i)=>`<div class="st ${i<S.i?'done':''}"><div class="dot" ${i===S.i?'style="background:var(--primary);color:#fff;border-color:var(--primary)"':''}>${i<S.i?'<i class="fa-solid fa-check"></i>':i+1}</div>${n}<small>${i<=S.i?times[i]:'—'}</small></div>`).join('')}</div></div>
 <div class="cardk pad mb-3"><div class="d-flex gap-3 align-items-center mb-3"><i class="fa-solid fa-location-dot"></i><span class="t-light">Ambil di ${k.name}</span></div><p class="muted mb-0">Metode: ambil sendiri. Tidak perlu membayar lagi pada alur simulasi QRIS ini. Konfirmasi pembayaran ini bukan bukti pembayaran nyata.</p></div>${note}</div>
 <div class="cardk pad"><div class="t-light mb-3">Rincian pesanan</div><span class="tag ${S.tag[1]}">${S.tag[0]}</span><div class="mt-3">${orderLines(o.items)}</div><div style="border-top:1px solid var(--n200)" class="pt-3"><div class="sum-row muted"><span>Subtotal</span><span>${rp(total)}</span></div><div class="sum-row muted"><span>Biaya layanan</span><span>Rp0</span></div><div class="sum-row muted"><span>Total</span><span style="font-size:20px;color:var(--primary)">${rp(total)}</span></div></div><div class="small2">${o.metode||'QRIS'} · Berhasil (simulasi)</div></div></div>
 <p class="small2 mt-4">Demo status: <a href="status.html?state=diterima">Diterima</a> · <a href="status.html">Disiapkan</a> · <a href="status.html?state=siap">Siap diambil</a> · <a href="status.html?state=memuat">Memuat</a> · <a href="status.html?state=kosong">Kosong</a> · <a href="status.html?state=gagal">Gagal</a></p>`;
 const cb=$('#cancel');if(cb)cb.onclick=async()=>{const r=await popup({icon:'fa-circle-exclamation',red:true,title:'Batalkan pesanan contoh?',text:`CONTOH #${o.no} baru diterima dan belum mulai disiapkan. Pembatalan hanya tersedia sebelum kios memulai persiapan.`,note:'Setelah persiapan dimulai, pembatalan tidak tersedia. Ini adalah contoh keadaan sebelum persiapan.',ok:'Pertahankan Pesanan',no:'Batalkan Pesanan'});
  if(r.dismiss===Swal.DismissReason.cancel){LS.set('kt_cancelled',{no:o.no,kios:k.name,items:o.items,total});location='riwayat.html'}};
}
/* ---------- 10 Riwayat Pesanan ---------- */
function pgRiwayat(){
 let rows=[{d:'27 Okt 2026',t:'12.00 WIB',no:'KT-001',k:'Kantin Nusantara',it:['2 Nasi Ayam Geprek','1 Es Teh Manis'],total:41000,st:'aktif'},{d:'26 Okt 2026',t:'10.30 WIB',no:'KT-002',k:'Kopi Kampus',it:['2 Kopi Susu'],total:24000,st:'selesai'},{d:'25 Okt 2026',t:'11.45 WIB',no:'KT-003',k:'Kantin Nusantara',it:['1 Nasi Goreng','1 Es Teh Manis'],total:22000,st:'selesai'}];
 const cx=LS.get('kt_cancelled',null);if(cx)rows=[{d:'27 Okt 2026',t:'12.00 WIB',no:cx.no,k:cx.kios,it:cx.items.map(l=>l.qty+' '+menuOf(l.id).name),total:cx.total,st:'batal'},...rows.slice(1)];
 const TG={aktif:['Sedang Disiapkan','amber'],selesai:['Selesai',''],batal:['Dibatalkan','red']};let f='semua';
 const render=()=>{const list=rows.filter(r=>f==='semua'||r.st===f);
  $('#body').innerHTML=list.length?list.map(r=>`<tr><td><b>${r.d}</b><div class="small2 my-1">${r.t}</div><div style="font-size:12px;color:var(--primary)">CONTOH #${r.no}</div></td><td><b>${r.k}</b></td><td class="muted">${r.it.join('<br>')}</td><td>${rp(r.total)}</td><td><span class="tag ${TG[r.st][1]}">${TG[r.st][0]}</span></td><td><a class="btn btn-line" href="status.html${r.st==='selesai'?'?state=siap':''}">Lihat Detail</a><a class="btn btn-soft" href="keranjang.html?state=update">Pesan Lagi</a></td></tr>`).join(''):`<tr><td colspan="6">${stateBox('fa-bag-shopping','Belum ada pesanan','Tidak ada pesanan pada kategori ini.')}</td></tr>`;
  $('#info').textContent=`Menampilkan ${list.length} dari ${rows.length} pesanan · Semua data adalah CONTOH`};
 $('#tabs').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;f=b.dataset.f;$$('#tabs .pill').forEach(x=>x.classList.toggle('on',x===b));render()};
 render();
}
layout();
({login:pgLogin,index:pgIndex,jelajah:pgJelajah,kios:pgKios,menu:pgMenu,keranjang:pgKeranjang,checkout:pgCheckout,pembayaran:pgPembayaran,status:pgStatus,riwayat:pgRiwayat})[document.body.dataset.page]();
