"use strict";(()=>{var e={};e.id=8035,e.ids=[8035],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},11169:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>I,patchFetch:()=>l,requestAsyncStorage:()=>N,routeModule:()=>u,serverHooks:()=>A,staticGenerationAsyncStorage:()=>p});var E={};t.r(E),t.d(E,{GET:()=>n});var s=t(49303),i=t(88716),o=t(60670),T=t(87070),a=t(75748),d=t(95456);async function n(e,{params:r}){let t=await (0,d.nX)(e),E=(0,d.kF)(t);if(E)return T.NextResponse.json(E.body,{status:E.status});try{let{rows:e}=await (0,a.sql)`
      SELECT id, "firstName", "lastName", email, proof_filename, proof_status,
             proof_uploaded_at, proof_rejection_reason,
             "graduationYear", specialization, institution
      FROM users WHERE id = ${parseInt(r.id)}
    `;if(0===e.length)return T.NextResponse.json({success:!1,message:"Utilisateur non trouv\xe9"},{status:404});let t=e[0];return T.NextResponse.json({success:!0,data:{user:{id:t.id,firstName:t.firstName,lastName:t.lastName,email:t.email,graduationYear:t.graduationYear,specialization:t.specialization,institution:t.institution},proofUrl:t.proof_filename,proofStatus:t.proof_status,uploadedAt:t.proof_uploaded_at,rejectionReason:t.proof_rejection_reason,fileType:t.proof_filename?t.proof_filename.match(/\.(pdf)$/i)?"pdf":"image":null}})}catch(e){return console.error("Get proof error:",e),T.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}let u=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/proofs/admin/proof/[id]/route",pathname:"/api/proofs/admin/proof/[id]",filename:"route",bundlePath:"app/api/proofs/admin/proof/[id]/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\proofs\\admin\\proof\\[id]\\route.ts",nextConfigOutput:"",userland:E}),{requestAsyncStorage:N,staticGenerationAsyncStorage:p,serverHooks:A}=u,I="/api/proofs/admin/proof/[id]/route";function l(){return(0,o.patchFetch)({serverHooks:A,staticGenerationAsyncStorage:p})}},95456:(e,r,t)=>{t.d(r,{fT:()=>o,kF:()=>d,nX:()=>a});var E=t(6091),s=t(6176);let i=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function o(e){return await new E.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(i)}async function T(e){try{let{payload:r}=await (0,s._)(e,i);return r}catch{return null}}async function a(e){let r=e.headers.get("authorization");if(!r?.startsWith("Bearer "))return null;let E=r.slice(7),s=await T(E);if(!s)return null;let{sql:i}=await Promise.resolve().then(t.bind(t,75748)),o=await i`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${s.id} AND "isActive" = true
  `;if(0===o.rows.length)return null;let a=o.rows[0];return{id:a.id,email:a.email,firstName:a.firstName,lastName:a.lastName,role:a.role,isVerified:!!a.isVerified,photoUrl:a.photoUrl}}function d(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,r,t)=>{t.d(r,{l:()=>s,sql:()=>E.i6});var E=t(28462);let s=`
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
`}};var r=require("../../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),E=r.X(0,[9276,5972,509],()=>t(11169));module.exports=E})();