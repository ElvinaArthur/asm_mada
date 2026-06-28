"use strict";(()=>{var e={};e.id=662,e.ids=[662],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61212:e=>{e.exports=require("async_hooks")},78893:e=>{e.exports=require("buffer")},3199:e=>{e.exports=require("console")},84770:e=>{e.exports=require("crypto")},27920:e=>{e.exports=require("diagnostics_channel")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},96119:e=>{e.exports=require("perf_hooks")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},66083:e=>{e.exports=require("stream/web")},74026:e=>{e.exports=require("string_decoder")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},61814:e=>{e.exports=require("util/types")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},84492:e=>{e.exports=require("node:stream")},47261:e=>{e.exports=require("node:util")},50259:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>U,patchFetch:()=>F,requestAsyncStorage:()=>R,routeModule:()=>L,serverHooks:()=>O,staticGenerationAsyncStorage:()=>S});var s={};t.r(s),t.d(s,{DELETE:()=>I,GET:()=>c,POST:()=>A});var E=t(49303),o=t(88716),i=t(60670),a=t(87070),T=t(75748),n=t(95456),u=t(28863),d=t(55315),N=t.n(d),p=t(92048),l=t.n(p);async function c(e){let r=await (0,n.nX)(e),t=(0,n.kF)(r);if(t)return a.NextResponse.json(t.body,{status:t.status});let{searchParams:s}=new URL(e.url),E=parseInt(s.get("page")||"1"),o=parseInt(s.get("limit")||"20"),i=s.get("search");try{let e="",r=[o,(E-1)*o];i&&(e="WHERE title ILIKE $3 OR author ILIKE $3",r.push(`%${i}%`));let{rows:t}=await T.sql.query(`SELECT * FROM books ${e} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,r),{rows:[{total:s}]}=await T.sql.query(`SELECT COUNT(*) as total FROM books ${e}`,i?[`%${i}%`]:[]);return a.NextResponse.json({success:!0,data:t,total:parseInt(s)})}catch(e){return console.error("Admin books error:",e),a.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function A(e){let r=await (0,n.nX)(e),t=(0,n.kF)(r);if(t)return a.NextResponse.json(t.body,{status:t.status});try{let r;let t=await e.formData(),s=t.get("title"),E=t.get("author"),o=t.get("description"),i=t.get("category"),n=t.get("year"),d=t.get("pages"),p=t.get("readTime"),c=t.get("pdf"),A=t.get("thumbnail");if(!s||!E||!i||!c)return a.NextResponse.json({success:!1,message:"Titre, auteur, cat\xe9gorie et PDF sont requis"},{status:400});let I=s.toLowerCase().replace(/[éèêë]/g,"e").replace(/[àâä]/g,"a").replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[ôö]/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),L=null;if(process.env.BLOB_READ_WRITE_TOKEN)r=(await (0,u.gz)(`books/${I}-${Date.now()}.pdf`,c,{access:"public"})).url,A&&A.size>0&&(L=(await (0,u.gz)(`covers/${I}-${Date.now()}.${A.name.split(".").pop()}`,A,{access:"public"})).url);else{let e=N().join(process.cwd(),"public","books",I);if(l().existsSync(e)||l().mkdirSync(e,{recursive:!0}),l().writeFileSync(N().join(e,"book.pdf"),Buffer.from(await c.arrayBuffer())),r=`/books/${I}/book.pdf`,A&&A.size>0){let r=A.name.split(".").pop()||"png";l().writeFileSync(N().join(e,`cover.${r}`),Buffer.from(await A.arrayBuffer())),L=`/books/${I}/cover.${r}`}}let{rows:R}=await (0,T.sql)`
      INSERT INTO books (title, author, description, category, year, pages, "readTime", "fileName", thumbnail)
      VALUES (${s}, ${E}, ${o||null}, ${i},
              ${n?parseInt(n):null}, ${d?parseInt(d):null},
              ${p||null}, ${r}, ${L})
      RETURNING *
    `;return a.NextResponse.json({success:!0,data:R[0]},{status:201})}catch(e){return console.error("Create book error:",e),a.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function I(e){let r=await (0,n.nX)(e),t=(0,n.kF)(r);if(t)return a.NextResponse.json(t.body,{status:t.status});let{id:s}=await e.json();return s?(await (0,T.sql)`DELETE FROM books WHERE id = ${parseInt(s)}`,a.NextResponse.json({success:!0,message:"Livre supprim\xe9"})):a.NextResponse.json({success:!1,message:"id requis"},{status:400})}let L=new E.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/books/route",pathname:"/api/admin/books",filename:"route",bundlePath:"app/api/admin/books/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\admin\\books\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:R,staticGenerationAsyncStorage:S,serverHooks:O}=L,U="/api/admin/books/route";function F(){return(0,i.patchFetch)({serverHooks:O,staticGenerationAsyncStorage:S})}},95456:(e,r,t)=>{t.d(r,{fT:()=>i,kF:()=>n,nX:()=>T});var s=t(6091),E=t(6176);let o=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function i(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(o)}async function a(e){try{let{payload:r}=await (0,E._)(e,o);return r}catch{return null}}async function T(e){let r=e.headers.get("authorization");if(!r?.startsWith("Bearer "))return null;let s=r.slice(7),E=await a(s);if(!E)return null;let{sql:o}=await Promise.resolve().then(t.bind(t,75748)),i=await o`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===i.rows.length)return null;let T=i.rows[0];return{id:T.id,email:T.email,firstName:T.firstName,lastName:T.lastName,role:T.role,isVerified:!!T.isVerified,photoUrl:T.photoUrl}}function n(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,r,t)=>{t.d(r,{l:()=>E,sql:()=>s.i6});var s=t(28462);let E=`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    title TEXT,
    institution TEXT,
    location TEXT,
    expertise TEXT,
    "publicationsCount" INTEGER DEFAULT 0,
    "memberSince" TIMESTAMP DEFAULT NOW(),
    "isVerified" BOOLEAN DEFAULT FALSE,
    "avatarColor" TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    "graduationYear" INTEGER,
    specialization TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "lastLogin" TIMESTAMP,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" TIMESTAMP,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    phone TEXT DEFAULT '',
    phone2 TEXT DEFAULT '',
    "birthDate" TEXT DEFAULT '',
    "birthYear" INTEGER,
    "currentPosition" TEXT DEFAULT '',
    company TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    "academicBackground" JSONB DEFAULT '{}',
    "academicEducations" JSONB DEFAULT '[]',
    "previousPositions" JSONB DEFAULT '[]',
    privacy JSONB DEFAULT '{}',
    "verifiedAt" TIMESTAMP,
    "verifiedBy" INTEGER,
    "rejectedAt" TIMESTAMP,
    "rejectedBy" INTEGER,
    proof_filename TEXT,
    proof_status TEXT DEFAULT 'pending' CHECK(proof_status IN ('pending', 'approved', 'rejected')),
    proof_uploaded_at TIMESTAMP,
    proof_rejection_reason TEXT
  );

  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    year INTEGER,
    pages INTEGER,
    "readTime" TEXT,
    "fileName" TEXT NOT NULL UNIQUE,
    thumbnail TEXT,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location TEXT,
    "imageUrl" TEXT,
    "maxParticipants" INTEGER,
    "isPublished" BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "bookId")
  );

  CREATE TABLE IF NOT EXISTS user_books (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('reading', 'read', 'to-read')),
    "isFavorite" BOOLEAN DEFAULT FALSE,
    "currentPage" INTEGER DEFAULT 0,
    "dateRead" TEXT,
    "addedAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "bookId")
  );

  CREATE TABLE IF NOT EXISTS user_events (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "eventId" INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('registered', 'attended', 'cancelled')),
    "registeredAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("userId", "eventId")
  );

  CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('login', 'book_read', 'book_added', 'event_registered', 'profile_updated')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_verified ON users("isVerified");
  CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
  CREATE INDEX IF NOT EXISTS idx_activities_user ON activities("userId");
  CREATE INDEX IF NOT EXISTS idx_user_books_user ON user_books("userId");
  CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events("userId");
`}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[9276,5972,509,8863],()=>t(50259));module.exports=s})();