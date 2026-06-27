"use strict";(()=>{var e={};e.id=3002,e.ids=[3002],e.modules={98432:e=>{e.exports=require("bcryptjs")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61212:e=>{e.exports=require("async_hooks")},78893:e=>{e.exports=require("buffer")},3199:e=>{e.exports=require("console")},84770:e=>{e.exports=require("crypto")},27920:e=>{e.exports=require("diagnostics_channel")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},96119:e=>{e.exports=require("perf_hooks")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},66083:e=>{e.exports=require("stream/web")},74026:e=>{e.exports=require("string_decoder")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},61814:e=>{e.exports=require("util/types")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},84492:e=>{e.exports=require("node:stream")},47261:e=>{e.exports=require("node:util")},90796:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>c,patchFetch:()=>R,requestAsyncStorage:()=>l,routeModule:()=>A,serverHooks:()=>L,staticGenerationAsyncStorage:()=>I});var s={};t.r(s),t.d(s,{POST:()=>p});var i=t(49303),E=t(88716),T=t(60670),a=t(87070),o=t(75748),u=t(95456),n=t(28863),d=t(98432),N=t.n(d);async function p(e){try{let r=await e.formData(),t=r.get("email"),s=r.get("password"),i=r.get("firstName"),E=r.get("lastName"),T=r.get("graduationYear"),d=r.get("specialization"),p=r.get("proof");if(!t||!s||!i||!E)return a.NextResponse.json({success:!1,message:"Tous les champs requis"},{status:400});if(!p)return a.NextResponse.json({success:!1,message:"Le justificatif est requis"},{status:400});if((await (0,o.sql)`SELECT id FROM users WHERE email = ${t}`).rows.length>0)return a.NextResponse.json({success:!1,message:"Email d\xe9j\xe0 utilis\xe9"},{status:400});let A=await (0,n.gz)(`proofs/${Date.now()}-${p.name}`,p,{access:"public"}),l=await N().hash(s,10),I=(await (0,o.sql)`
      INSERT INTO users (email, password, "firstName", "lastName", "graduationYear", specialization, role, "isVerified", proof_filename, proof_status, proof_uploaded_at)
      VALUES (${t}, ${l}, ${i}, ${E}, ${T||null}, ${d||null}, 'user', false, ${A.url}, 'pending', NOW())
      RETURNING id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    `).rows[0],L=await (0,u.fT)({id:I.id,role:I.role,isVerified:!1});return a.NextResponse.json({success:!0,message:"Inscription r\xe9ussie. En attente de v\xe9rification.",token:L,user:{...I,photoUrl:I.photoUrl||null}},{status:201})}catch(e){return console.error("Register error:",e),a.NextResponse.json({success:!1,message:"Erreur lors de l'inscription"},{status:500})}}let A=new i.AppRouteRouteModule({definition:{kind:E.x.APP_ROUTE,page:"/api/auth/register/route",pathname:"/api/auth/register",filename:"route",bundlePath:"app/api/auth/register/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\auth\\register\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:I,serverHooks:L}=A,c="/api/auth/register/route";function R(){return(0,T.patchFetch)({serverHooks:L,staticGenerationAsyncStorage:I})}},95456:(e,r,t)=>{t.d(r,{fT:()=>T,kF:()=>u,nX:()=>o});var s=t(6091),i=t(6176);let E=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function T(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(E)}async function a(e){try{let{payload:r}=await (0,i._)(e,E);return r}catch{return null}}async function o(e){let r=e.headers.get("authorization");if(!r?.startsWith("Bearer "))return null;let s=r.slice(7),i=await a(s);if(!i)return null;let{sql:E}=await Promise.resolve().then(t.bind(t,75748)),T=await E`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${i.id} AND "isActive" = true
  `;if(0===T.rows.length)return null;let o=T.rows[0];return{id:o.id,email:o.email,firstName:o.firstName,lastName:o.lastName,role:o.role,isVerified:!!o.isVerified,photoUrl:o.photoUrl}}function u(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,r,t)=>{t.d(r,{l:()=>i,sql:()=>s.i6});var s=t(28462);let i=`
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
`}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[9276,5972,509,8863],()=>t(90796));module.exports=s})();