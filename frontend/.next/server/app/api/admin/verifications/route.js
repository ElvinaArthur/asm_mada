"use strict";(()=>{var e={};e.id=4722,e.ids=[4722],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},39589:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>L,patchFetch:()=>c,requestAsyncStorage:()=>A,routeModule:()=>N,serverHooks:()=>I,staticGenerationAsyncStorage:()=>p});var s={};r.r(s),r.d(s,{GET:()=>n,PUT:()=>u});var E=r(49303),i=r(88716),T=r(60670),a=r(87070),o=r(75748),d=r(95456);async function n(e){let t=await (0,d.nX)(e),r=(0,d.kF)(t);if(r)return a.NextResponse.json(r.body,{status:r.status});let{rows:s}=await (0,o.sql)`
    SELECT id, "firstName", "lastName", email, "graduationYear", specialization, proof_filename, proof_status, proof_uploaded_at, "createdAt"
    FROM users WHERE proof_status = 'pending' ORDER BY "createdAt" ASC
  `;return a.NextResponse.json({success:!0,data:s})}async function u(e){let t=await (0,d.nX)(e),r=(0,d.kF)(t);if(r)return a.NextResponse.json(r.body,{status:r.status});let{userId:s,action:E,reason:i}=await e.json();return s&&E?"approve"===E?(await (0,o.sql)`
      UPDATE users SET "isVerified" = true, proof_status = 'approved', "verifiedAt" = NOW(), "verifiedBy" = ${t.id}
      WHERE id = ${s}
    `,a.NextResponse.json({success:!0,message:"Utilisateur v\xe9rifi\xe9"})):"reject"===E?(await (0,o.sql)`
      UPDATE users SET proof_status = 'rejected', "rejectedAt" = NOW(), "rejectedBy" = ${t.id}, proof_rejection_reason = ${i||"Non sp\xe9cifi\xe9"}
      WHERE id = ${s}
    `,a.NextResponse.json({success:!0,message:"Utilisateur rejet\xe9"})):a.NextResponse.json({success:!1,message:"Action invalide"},{status:400}):a.NextResponse.json({success:!1,message:"userId et action requis"},{status:400})}let N=new E.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/verifications/route",pathname:"/api/admin/verifications",filename:"route",bundlePath:"app/api/admin/verifications/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\admin\\verifications\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:A,staticGenerationAsyncStorage:p,serverHooks:I}=N,L="/api/admin/verifications/route";function c(){return(0,T.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:p})}},95456:(e,t,r)=>{r.d(t,{fT:()=>T,kF:()=>d,nX:()=>o});var s=r(6091),E=r(6176);let i=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function T(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(i)}async function a(e){try{let{payload:t}=await (0,E._)(e,i);return t}catch{return null}}async function o(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let s=t.slice(7),E=await a(s);if(!E)return null;let{sql:i}=await Promise.resolve().then(r.bind(r,75748)),T=await i`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===T.rows.length)return null;let o=T.rows[0];return{id:o.id,email:o.email,firstName:o.firstName,lastName:o.lastName,role:o.role,isVerified:!!o.isVerified,photoUrl:o.photoUrl}}function d(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,t,r)=>{r.d(t,{l:()=>E,sql:()=>s.i6});var s=r(28462);let E=`
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
`}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9276,5972,509],()=>r(39589));module.exports=s})();