"use strict";(()=>{var e={};e.id=2506,e.ids=[2506],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},9093:(e,s,t)=>{t.r(s),t.d(s,{originalPathname:()=>c,patchFetch:()=>l,requestAsyncStorage:()=>I,routeModule:()=>A,serverHooks:()=>L,staticGenerationAsyncStorage:()=>p});var r={};t.r(r),t.d(r,{DELETE:()=>N,GET:()=>u,PUT:()=>d});var E=t(49303),T=t(88716),i=t(60670),o=t(87070),a=t(75748),n=t(95456);async function u(e,{params:s}){try{let e=await (0,a.sql)`SELECT * FROM books WHERE id = ${parseInt(s.id)}`;if(0===e.rows.length)return o.NextResponse.json({success:!1,message:"Livre non trouv\xe9"},{status:404});return await (0,a.sql)`UPDATE books SET views = views + 1 WHERE id = ${parseInt(s.id)}`,o.NextResponse.json({success:!0,data:e.rows[0]})}catch{return o.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function d(e,{params:s}){let t=await (0,n.nX)(e),r=(0,n.kF)(t);if(r)return o.NextResponse.json(r.body,{status:r.status});try{let{title:t,author:r,description:E,category:T,year:i,pages:n,readTime:u}=await e.json(),d=await (0,a.sql)`
      UPDATE books SET title = ${t}, author = ${r}, description = ${E||null},
      category = ${T}, year = ${i||null}, pages = ${n||null},
      "readTime" = ${u||null}, updated_at = NOW()
      WHERE id = ${parseInt(s.id)} RETURNING *
    `;if(0===d.rows.length)return o.NextResponse.json({success:!1,message:"Livre non trouv\xe9"},{status:404});return o.NextResponse.json({success:!0,data:d.rows[0]})}catch{return o.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function N(e,{params:s}){let t=await (0,n.nX)(e),r=(0,n.kF)(t);if(r)return o.NextResponse.json(r.body,{status:r.status});try{return await (0,a.sql)`DELETE FROM books WHERE id = ${parseInt(s.id)}`,o.NextResponse.json({success:!0,message:"Livre supprim\xe9"})}catch{return o.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}let A=new E.AppRouteRouteModule({definition:{kind:T.x.APP_ROUTE,page:"/api/books/[id]/route",pathname:"/api/books/[id]",filename:"route",bundlePath:"app/api/books/[id]/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\books\\[id]\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:I,staticGenerationAsyncStorage:p,serverHooks:L}=A,c="/api/books/[id]/route";function l(){return(0,i.patchFetch)({serverHooks:L,staticGenerationAsyncStorage:p})}},95456:(e,s,t)=>{t.d(s,{fT:()=>i,kF:()=>n,nX:()=>a});var r=t(6091),E=t(6176);let T=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function i(e){return await new r.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(T)}async function o(e){try{let{payload:s}=await (0,E._)(e,T);return s}catch{return null}}async function a(e){let s=e.headers.get("authorization");if(!s?.startsWith("Bearer "))return null;let r=s.slice(7),E=await o(r);if(!E)return null;let{sql:T}=await Promise.resolve().then(t.bind(t,75748)),i=await T`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===i.rows.length)return null;let a=i.rows[0];return{id:a.id,email:a.email,firstName:a.firstName,lastName:a.lastName,role:a.role,isVerified:!!a.isVerified,photoUrl:a.photoUrl}}function n(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,s,t)=>{t.d(s,{l:()=>E,sql:()=>r.i6});var r=t(28462);let E=`
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
`}};var s=require("../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),r=s.X(0,[9276,5972,509],()=>t(9093));module.exports=r})();