"use strict";(()=>{var e={};e.id=8562,e.ids=[8562],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61212:e=>{e.exports=require("async_hooks")},78893:e=>{e.exports=require("buffer")},3199:e=>{e.exports=require("console")},84770:e=>{e.exports=require("crypto")},27920:e=>{e.exports=require("diagnostics_channel")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},96119:e=>{e.exports=require("perf_hooks")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},66083:e=>{e.exports=require("stream/web")},74026:e=>{e.exports=require("string_decoder")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},61814:e=>{e.exports=require("util/types")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},84492:e=>{e.exports=require("node:stream")},47261:e=>{e.exports=require("node:util")},54003:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>L,requestAsyncStorage:()=>A,routeModule:()=>p,serverHooks:()=>I,staticGenerationAsyncStorage:()=>l});var s={};t.r(s),t.d(s,{GET:()=>d,POST:()=>N});var E=t(49303),o=t(88716),T=t(60670),a=t(87070),i=t(75748),u=t(95456),n=t(28863);async function d(e){try{let{searchParams:r}=new URL(e.url),t=r.get("category"),s=r.get("search"),E=parseInt(r.get("page")||"1"),o=parseInt(r.get("limit")||"12"),T=[],u=[],n=1;t&&"all"!==t&&(T.push(`category = $${n++}`),u.push(t)),s&&(T.push(`(title ILIKE $${n} OR author ILIKE $${n})`),u.push(`%${s}%`),n++);let d=T.length>0?"WHERE "+T.join(" AND "):"",{rows:N}=await i.sql.query(`SELECT * FROM books ${d} ORDER BY created_at DESC LIMIT $${n} OFFSET $${n+1}`,[...u,o,(E-1)*o]),{rows:[{total:p}]}=await i.sql.query(`SELECT COUNT(*) as total FROM books ${d}`,u);return a.NextResponse.json({success:!0,data:N,total:parseInt(p),page:E,pages:Math.ceil(parseInt(p)/o)})}catch(e){return console.error("Get books error:",e),a.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function N(e){let r=await (0,u.nX)(e),t=(0,u.kF)(r);if(t)return a.NextResponse.json(t.body,{status:t.status});try{let r=await e.formData(),t=r.get("title"),s=r.get("author"),E=r.get("description"),o=r.get("category"),T=r.get("year"),u=r.get("pages"),d=r.get("readTime"),N=r.get("pdf"),p=r.get("thumbnail");if(!t||!s||!o||!N)return a.NextResponse.json({success:!1,message:"Champs requis manquants"},{status:400});let A=await (0,n.gz)(`books/${Date.now()}-${N.name}`,N,{access:"public"}),l=null;p&&(l=(await (0,n.gz)(`thumbnails/${Date.now()}-${p.name}`,p,{access:"public"})).url);let I=await (0,i.sql)`
      INSERT INTO books (title, author, description, category, year, pages, "readTime", "fileName", thumbnail)
      VALUES (${t}, ${s}, ${E||null}, ${o}, ${T?parseInt(T):null}, ${u?parseInt(u):null}, ${d||null}, ${A.url}, ${l})
      RETURNING *
    `;return a.NextResponse.json({success:!0,data:I.rows[0]},{status:201})}catch(e){return console.error("Create book error:",e),a.NextResponse.json({success:!1,message:"Erreur lors de la cr\xe9ation"},{status:500})}}let p=new E.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/books/route",pathname:"/api/books",filename:"route",bundlePath:"app/api/books/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\books\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:A,staticGenerationAsyncStorage:l,serverHooks:I}=p,c="/api/books/route";function L(){return(0,T.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:l})}},95456:(e,r,t)=>{t.d(r,{fT:()=>T,kF:()=>u,nX:()=>i});var s=t(6091),E=t(6176);let o=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function T(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(o)}async function a(e){try{let{payload:r}=await (0,E._)(e,o);return r}catch{return null}}async function i(e){let r=e.headers.get("authorization");if(!r?.startsWith("Bearer "))return null;let s=r.slice(7),E=await a(s);if(!E)return null;let{sql:o}=await Promise.resolve().then(t.bind(t,75748)),T=await o`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===T.rows.length)return null;let i=T.rows[0];return{id:i.id,email:i.email,firstName:i.firstName,lastName:i.lastName,role:i.role,isVerified:!!i.isVerified,photoUrl:i.photoUrl}}function u(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,r,t)=>{t.d(r,{l:()=>E,sql:()=>s.i6});var s=t(28462);let E=`
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
`}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[9276,5972,509,8863],()=>t(54003));module.exports=s})();