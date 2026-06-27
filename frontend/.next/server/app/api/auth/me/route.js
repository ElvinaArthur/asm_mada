"use strict";(()=>{var e={};e.id=8788,e.ids=[8788],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},20891:(e,t,E)=>{E.r(t),E.d(t,{originalPathname:()=>L,patchFetch:()=>p,requestAsyncStorage:()=>n,routeModule:()=>N,serverHooks:()=>I,staticGenerationAsyncStorage:()=>A});var r={};E.r(r),E.d(r,{GET:()=>d});var T=E(49303),s=E(88716),i=E(60670),a=E(87070),o=E(95456),u=E(75748);async function d(e){let t=await (0,o.nX)(e);if(!t)return a.NextResponse.json({success:!1,message:"Non autoris\xe9"},{status:401});let E=await (0,u.sql)`
    SELECT id, "firstName", "lastName", email, role, "isVerified", "isActive",
           "graduationYear", specialization, "photoUrl", "createdAt", title, institution, location, expertise, bio, "currentPosition", company, phone
    FROM users WHERE id = ${t.id}
  `;return 0===E.rows.length?a.NextResponse.json({success:!1,message:"Utilisateur non trouv\xe9"},{status:404}):a.NextResponse.json({success:!0,user:E.rows[0]})}let N=new T.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/auth/me/route",pathname:"/api/auth/me",filename:"route",bundlePath:"app/api/auth/me/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\auth\\me\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:n,staticGenerationAsyncStorage:A,serverHooks:I}=N,L="/api/auth/me/route";function p(){return(0,i.patchFetch)({serverHooks:I,staticGenerationAsyncStorage:A})}},95456:(e,t,E)=>{E.d(t,{fT:()=>i,kF:()=>u,nX:()=>o});var r=E(6091),T=E(6176);let s=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function i(e){return await new r.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(s)}async function a(e){try{let{payload:t}=await (0,T._)(e,s);return t}catch{return null}}async function o(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let r=t.slice(7),T=await a(r);if(!T)return null;let{sql:s}=await Promise.resolve().then(E.bind(E,75748)),i=await s`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${T.id} AND "isActive" = true
  `;if(0===i.rows.length)return null;let o=i.rows[0];return{id:o.id,email:o.email,firstName:o.firstName,lastName:o.lastName,role:o.role,isVerified:!!o.isVerified,photoUrl:o.photoUrl}}function u(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,t,E)=>{E.d(t,{l:()=>T,sql:()=>r.i6});var r=E(28462);let T=`
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
`}};var t=require("../../../../webpack-runtime.js");t.C(e);var E=e=>t(t.s=e),r=t.X(0,[9276,5972,509],()=>E(20891));module.exports=r})();