"use strict";(()=>{var e={};e.id=2797,e.ids=[2797],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},47261:e=>{e.exports=require("node:util")},21416:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>R,patchFetch:()=>O,requestAsyncStorage:()=>I,routeModule:()=>c,serverHooks:()=>S,staticGenerationAsyncStorage:()=>L});var s={};r.r(s),r.d(s,{GET:()=>l});var E=r(49303),i=r(88716),o=r(60670),T=r(87070),a=r(75748),n=r(95456);let d=require("pdf-lib");var u=r(55315),N=r.n(u),A=r(92048),p=r.n(A);async function l(e,{params:t}){let r=await (0,n.nX)(e);if(!r)return T.NextResponse.json({success:!1,message:"Non autoris\xe9"},{status:401});if(!r.isVerified&&"admin"!==r.role)return T.NextResponse.json({success:!1,message:"Compte non v\xe9rifi\xe9"},{status:403});try{let e;let r=await (0,a.sql)`SELECT "fileName", title FROM books WHERE id = ${parseInt(t.id)}`;if(0===r.rows.length)return T.NextResponse.json({success:!1,message:"Livre non trouv\xe9"},{status:404});let s=r.rows[0],E=s.fileName;if(E.startsWith("http")){let t=await fetch(E);if(!t.ok)return T.NextResponse.json({success:!1,message:"Fichier introuvable"},{status:404});e=new Uint8Array(await t.arrayBuffer())}else{let t=N().join(process.cwd(),"public",E);if(!p().existsSync(t))return T.NextResponse.json({success:!1,message:"Fichier introuvable"},{status:404});e=new Uint8Array(p().readFileSync(t))}try{let t=await d.PDFDocument.load(e,{ignoreEncryption:!0}),r=await t.embedFont(d.StandardFonts.Helvetica),s=t.getPages(),E=`\xa9 ASM 2026 — Lecture autoris\xe9e uniquement sur asm-mada.vercel.app`;for(let e of s){let{width:t,height:s}=e.getSize();e.drawText(E,{x:t/2-280,y:s/2,size:14,font:r,color:(0,d.rgb)(.75,.75,.75),opacity:.35,rotate:(0,d.degrees)(45)}),e.drawText(`ASM — asm-mada.vercel.app`,{x:20,y:12,size:8,font:r,color:(0,d.rgb)(.6,.6,.6),opacity:.5})}e=await t.save()}catch(e){console.warn("Watermark skipped (PDF encrypted or error):",e.message)}return await (0,a.sql)`UPDATE books SET views = views + 1 WHERE id = ${parseInt(t.id)}`,new T.NextResponse(Buffer.from(e),{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`inline; filename="${encodeURIComponent(s.title)}.pdf"`,"Cache-Control":"no-store, no-cache, must-revalidate","X-Content-Type-Options":"nosniff","X-Frame-Options":"SAMEORIGIN"}})}catch(e){return console.error("Erreur serve PDF:",e),T.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}let c=new E.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/books/[id]/file/route",pathname:"/api/books/[id]/file",filename:"route",bundlePath:"app/api/books/[id]/file/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\books\\[id]\\file\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:I,staticGenerationAsyncStorage:L,serverHooks:S}=c,R="/api/books/[id]/file/route";function O(){return(0,o.patchFetch)({serverHooks:S,staticGenerationAsyncStorage:L})}},95456:(e,t,r)=>{r.d(t,{fT:()=>o,kF:()=>n,nX:()=>a});var s=r(6091),E=r(6176);let i=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function o(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(i)}async function T(e){try{let{payload:t}=await (0,E._)(e,i);return t}catch{return null}}async function a(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let s=t.slice(7),E=await T(s);if(!E)return null;let{sql:i}=await Promise.resolve().then(r.bind(r,75748)),o=await i`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===o.rows.length)return null;let a=o.rows[0];return{id:a.id,email:a.email,firstName:a.firstName,lastName:a.lastName,role:a.role,isVerified:!!a.isVerified,photoUrl:a.photoUrl}}function n(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,t,r)=>{r.d(t,{l:()=>E,sql:()=>s.i6});var s=r(28462);let E=`
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
`}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9276,5972,509],()=>r(21416));module.exports=s})();