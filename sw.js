const V='studentflow-v8',FV='https://www.gstatic.com/firebasejs/10.12.2/';
const CORE=['./','index.html','manifest.webmanifest','icons/icon.svg','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','assets/fa/fa-solid-900.woff2','assets/fonts/poppins-latin-400-normal.woff2','assets/fonts/poppins-latin-500-normal.woff2','assets/fonts/poppins-latin-600-normal.woff2','assets/fonts/poppins-latin-700-normal.woff2','assets/fonts/poppins-latin-800-normal.woff2'];
const FB=['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(f=>FV+f);

self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(V);
  await c.addAll(CORE);
  await Promise.all(FB.map(u=>c.add(u).catch(()=>{})));
  await self.skipWaiting();
})()));

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const k=await caches.keys();
  await Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)));
  await self.clients.claim();
})()));

// Simpan respons yang valid ke cache (clone dilakukan sinkron sebelum body terpakai)
function put(r,res){
  if(res&&res.status===200&&(res.type==='basic'||res.type==='cors')){
    const cp=res.clone();
    caches.open(V).then(c=>c.put(r,cp)).catch(()=>{});
  }
  return res;
}

// Halaman: coba jaringan dulu (maks 4 detik), lalu pakai cache agar tetap terbuka saat offline
async function nav(r){
  const net=fetch(r).then(res=>put(r,res));
  net.catch(()=>{});
  try{return await Promise.race([net,new Promise((_,j)=>setTimeout(j,4000))])}
  catch(_){
    const m=await caches.match(r,{ignoreSearch:true})||await caches.match('index.html')||await caches.match('./');
    return m||net;
  }
}

// Aset: pakai cache langsung, perbarui di latar belakang
function swr(e){
  const r=e.request;
  return caches.match(r).then(m=>{
    const net=fetch(r).then(res=>put(r,res)).catch(()=>null);
    e.waitUntil(net);
    return m||net.then(res=>res||Response.error());
  });
}

self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  // Hanya file sendiri dan SDK Firebase (gstatic). API Firestore/Auth tidak di-cache.
  if(u.origin!==location.origin&&u.hostname!=='www.gstatic.com')return;
  if(r.mode==='navigate')e.respondWith(nav(r));
  else e.respondWith(swr(e));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(l=>l[0]?l[0].focus():clients.openWindow('./')));
});
