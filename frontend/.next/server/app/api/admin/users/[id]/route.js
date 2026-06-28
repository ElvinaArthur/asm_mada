"use strict";(()=>{var e={};e.id=1317,e.ids=[1317],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},94120:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>l,patchFetch:()=>L,requestAsyncStorage:()=>p,routeModule:()=>A,serverHooks:()=>I,staticGenerationAsyncStorage:()=>c});var r={};s.r(r),s.d(r,{DELETE:()=>N,GET:()=>u,PUT:()=>d});var E=s(49303),i=s(88716),T=s(60670),a=s(87070),o=s(75748),n=s(95456);async function u(e,{params:t}){let s=await (0,n.nX)(e),r=(0,n.kF)(s);if(r)return a.NextResponse.json(r.body,{status:r.status});let{rows:E}=await (0,o.sql)`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "isActive",
           "graduationYear", specialization, "photoUrl", "createdAt", proof_status,
           proof_filename, title, institution, location, bio
    FROM users WHERE id = ${parseInt(t.id)}
  `;return 0===E.length?a.NextResponse.json({success:!1,message:"Utilisateur non trouv\xe9"},{status:404}):a.NextResponse.json({success:!0,data:E[0]})}async function d(e,{params:t}){let s=await (0,n.nX)(e),r=(0,n.kF)(s);if(r)return a.NextResponse.json(r.body,{status:r.status});let{action:E,reason:i}=await e.json(),T=parseInt(t.id);try{switch(E){case"verify":return await (0,o.sql)`
          UPDATE users SET "isVerified" = true, proof_status = 'approved',
          "verifiedAt" = NOW(), "verifiedBy" = ${s.id}
          WHERE id = ${T}
        `,a.NextResponse.json({success:!0,message:"Compte v\xe9rifi\xe9"});case"reject":return await (0,o.sql)`
          UPDATE users SET "isVerified" = false, proof_status = 'rejected',
          "rejectedAt" = NOW(), "rejectedBy" = ${s.id},
          proof_rejection_reason = ${i||null}
          WHERE id = ${T}
        `,a.NextResponse.json({success:!0,message:"Compte rejet\xe9"});case"toggle-block":return await (0,o.sql)`UPDATE users SET "isActive" = NOT "isActive" WHERE id = ${T}`,a.NextResponse.json({success:!0,message:"Statut modifi\xe9"});default:return a.NextResponse.json({success:!1,message:"Action inconnue"},{status:400})}}catch(e){return console.error("Admin user action error:",e),a.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}async function N(e,{params:t}){let s=await (0,n.nX)(e),r=(0,n.kF)(s);return r?a.NextResponse.json(r.body,{status:r.status}):(await (0,o.sql)`DELETE FROM users WHERE id = ${parseInt(t.id)}`,a.NextResponse.json({success:!0,message:"Utilisateur supprim\xe9"}))}let A=new E.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/admin/users/[id]/route",pathname:"/api/admin/users/[id]",filename:"route",bundlePath:"app/api/admin/users/[id]/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\admin\\users\\[id]\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:I}=A,l="/api/admin/users/[id]/route";function L(){return(0,T.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:c})}},95456:(e,t,s)=>{s.d(t,{fT:()=>T,kF:()=>n,nX:()=>o});var r=s(6091),E=s(6176);let i=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function T(e){return await new r.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(i)}async function a(e){try{let{payload:t}=await (0,E._)(e,i);return t}catch{return null}}async function o(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let r=t.slice(7),E=await a(r);if(!E)return null;let{sql:i}=await Promise.resolve().then(s.bind(s,75748)),T=await i`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===T.rows.length)return null;let o=T.rows[0];return{id:o.id,email:o.email,firstName:o.firstName,lastName:o.lastName,role:o.role,isVerified:!!o.isVerified,photoUrl:o.photoUrl}}function n(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,t,s)=>{s.d(t,{l:()=>E,sql:()=>r.i6});var r=s(28462);let E=`
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
`}};var t=require("../../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[9276,5972,509],()=>s(94120));module.exports=r})();