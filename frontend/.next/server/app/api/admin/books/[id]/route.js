"use strict";(()=>{var e={};e.id=9518,e.ids=[9518],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61212:e=>{e.exports=require("async_hooks")},78893:e=>{e.exports=require("buffer")},3199:e=>{e.exports=require("console")},84770:e=>{e.exports=require("crypto")},27920:e=>{e.exports=require("diagnostics_channel")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},96119:e=>{e.exports=require("perf_hooks")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},66083:e=>{e.exports=require("stream/web")},74026:e=>{e.exports=require("string_decoder")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},61814:e=>{e.exports=require("util/types")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},84492:e=>{e.exports=require("node:stream")},47261:e=>{e.exports=require("node:util")},638:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>U,patchFetch:()=>m,requestAsyncStorage:()=>R,routeModule:()=>L,serverHooks:()=>O,staticGenerationAsyncStorage:()=>S});var s={};r.r(s),r.d(s,{DELETE:()=>I,GET:()=>c,PUT:()=>A});var i=r(49303),E=r(88716),o=r(60670),a=r(87070),T=r(75748),n=r(95456),u=r(28863),d=r(55315),N=r.n(d),p=r(92048),l=r.n(p);async function c(e,{params:t}){let r=await (0,n.nX)(e),s=(0,n.kF)(r);if(s)return a.NextResponse.json(s.body,{status:s.status});let{rows:i}=await (0,T.sql)`SELECT * FROM books WHERE id = ${parseInt(t.id)}`;return 0===i.length?a.NextResponse.json({success:!1,message:"Livre non trouv\xe9"},{status:404}):a.NextResponse.json({success:!0,data:i[0]})}async function A(e,{params:t}){let r=await (0,n.nX)(e),s=(0,n.kF)(r);if(s)return a.NextResponse.json(s.body,{status:s.status});try{let r,s,i,E,o,n,d,p,c;if((e.headers.get("content-type")||"").includes("multipart/form-data")){let a=await e.formData();r=a.get("title"),s=a.get("author"),i=a.get("description"),E=a.get("category"),o=a.get("year"),n=a.get("pages"),d=a.get("readTime");let A=a.get("pdf"),I=a.get("thumbnail"),{rows:[L]}=await (0,T.sql)`SELECT "fileName", thumbnail FROM books WHERE id = ${parseInt(t.id)}`;if(p=L?.fileName,c=L?.thumbnail,A&&A.size>0){if(process.env.BLOB_READ_WRITE_TOKEN)p=(await (0,u.gz)(`books/${Date.now()}-${A.name}`,A,{access:"public"})).url;else{let e=Buffer.from(await A.arrayBuffer()),t=r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),s=N().join(process.cwd(),"public","books",t);l().existsSync(s)||l().mkdirSync(s,{recursive:!0}),l().writeFileSync(N().join(s,"book.pdf"),e),p=`/books/${t}/book.pdf`}}if(I&&I.size>0){if(process.env.BLOB_READ_WRITE_TOKEN)c=(await (0,u.gz)(`covers/${Date.now()}-${I.name}`,I,{access:"public"})).url;else{let e=Buffer.from(await I.arrayBuffer()),t=r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),s=N().join(process.cwd(),"public","books",t);l().existsSync(s)||l().mkdirSync(s,{recursive:!0});let i=I.name.split(".").pop()||"png";l().writeFileSync(N().join(s,`cover.${i}`),e),c=`/books/${t}/cover.${i}`}}}else{let t=await e.json();({title:r,author:s,description:i,category:E,year:o,pages:n,readTime:d,fileName:p,thumbnail:c}=t)}let{rows:A}=await (0,T.sql)`
      UPDATE books SET
        title = ${r}, author = ${s},
        description = ${i||null},
        category = ${E},
        year = ${o?parseInt(o):null},
        pages = ${n?parseInt(n):null},
        "readTime" = ${d||null},
        "fileName" = ${p||null},
        thumbnail = ${c||null},
        updated_at = NOW()
      WHERE id = ${parseInt(t.id)} RETURNING *
    `;if(0===A.length)return a.NextResponse.json({success:!1,message:"Livre non trouv\xe9"},{status:404});return a.NextResponse.json({success:!0,data:A[0]})}catch(e){return console.error("Update book error:",e),a.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function I(e,{params:t}){let r=await (0,n.nX)(e),s=(0,n.kF)(r);return s?a.NextResponse.json(s.body,{status:s.status}):(await (0,T.sql)`DELETE FROM books WHERE id = ${parseInt(t.id)}`,a.NextResponse.json({success:!0,message:"Livre supprim\xe9"}))}let L=new i.AppRouteRouteModule({definition:{kind:E.x.APP_ROUTE,page:"/api/admin/books/[id]/route",pathname:"/api/admin/books/[id]",filename:"route",bundlePath:"app/api/admin/books/[id]/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\admin\\books\\[id]\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:R,staticGenerationAsyncStorage:S,serverHooks:O}=L,U="/api/admin/books/[id]/route";function m(){return(0,o.patchFetch)({serverHooks:O,staticGenerationAsyncStorage:S})}},95456:(e,t,r)=>{r.d(t,{fT:()=>o,kF:()=>n,nX:()=>T});var s=r(6091),i=r(6176);let E=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function o(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(E)}async function a(e){try{let{payload:t}=await (0,i._)(e,E);return t}catch{return null}}async function T(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let s=t.slice(7),i=await a(s);if(!i)return null;let{sql:E}=await Promise.resolve().then(r.bind(r,75748)),o=await E`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${i.id} AND "isActive" = true
  `;if(0===o.rows.length)return null;let T=o.rows[0];return{id:T.id,email:T.email,firstName:T.firstName,lastName:T.lastName,role:T.role,isVerified:!!T.isVerified,photoUrl:T.photoUrl}}function n(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,t,r)=>{r.d(t,{l:()=>i,sql:()=>s.i6});var s=r(28462);let i=`
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
`}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9276,5972,509,8863],()=>r(638));module.exports=s})();