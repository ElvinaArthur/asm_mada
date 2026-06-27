"use strict";(()=>{var e={};e.id=3744,e.ids=[3744],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},61212:e=>{e.exports=require("async_hooks")},78893:e=>{e.exports=require("buffer")},3199:e=>{e.exports=require("console")},84770:e=>{e.exports=require("crypto")},27920:e=>{e.exports=require("diagnostics_channel")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},32694:e=>{e.exports=require("http2")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},96119:e=>{e.exports=require("perf_hooks")},86624:e=>{e.exports=require("querystring")},76162:e=>{e.exports=require("stream")},66083:e=>{e.exports=require("stream/web")},74026:e=>{e.exports=require("string_decoder")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},61814:e=>{e.exports=require("util/types")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},15673:e=>{e.exports=require("node:events")},84492:e=>{e.exports=require("node:stream")},47261:e=>{e.exports=require("node:util")},13148:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>I,patchFetch:()=>L,requestAsyncStorage:()=>A,routeModule:()=>p,serverHooks:()=>c,staticGenerationAsyncStorage:()=>l});var s={};t.r(s),t.d(s,{GET:()=>d,PUT:()=>N});var E=t(49303),i=t(88716),o=t(60670),T=t(87070),a=t(75748),u=t(95456),n=t(28863);async function d(e){let r=await (0,u.nX)(e);if(!r)return T.NextResponse.json({success:!1,message:"Non autoris\xe9"},{status:401});let t=await (0,a.sql)`SELECT * FROM users WHERE id = ${r.id}`;if(0===t.rows.length)return T.NextResponse.json({success:!1,message:"Non trouv\xe9"},{status:404});let{password:s,...E}=t.rows[0];return T.NextResponse.json({success:!0,data:E})}async function N(e){let r=await (0,u.nX)(e);if(!r)return T.NextResponse.json({success:!1,message:"Non autoris\xe9"},{status:401});try{let t=e.headers.get("content-type")||"",s={},E=null;if(t.includes("multipart/form-data")){let t=await e.formData(),i=t.get("photo");i&&(E=(await (0,n.gz)(`avatars/${r.id}-${Date.now()}.${i.name.split(".").pop()}`,i,{access:"public"})).url),t.forEach((e,r)=>{"photo"!==r&&(s[r]=e)})}else s=await e.json();let i=[],o=[],u=1;if(["firstName","lastName","title","institution","location","expertise","bio","currentPosition","company","phone","phone2","birthDate","birthYear","graduationYear","specialization"].forEach(e=>{void 0!==s[e]&&(i.push(`"${e}" = $${u++}`),o.push(s[e]))}),E&&(i.push(`"photoUrl" = $${u++}`),o.push(E)),0===i.length)return T.NextResponse.json({success:!1,message:"Rien \xe0 mettre \xe0 jour"},{status:400});i.push('"updatedAt" = NOW()'),o.push(r.id);let d=await a.sql.query(`UPDATE users SET ${i.join(", ")} WHERE id = $${u} RETURNING id, "firstName", "lastName", email, role, "isVerified", "photoUrl"`,o);return T.NextResponse.json({success:!0,data:d.rows[0]})}catch(e){return console.error("Update profile error:",e),T.NextResponse.json({success:!1,message:"Erreur serveur"},{status:500})}}let p=new E.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/user/profile/route",pathname:"/api/user/profile",filename:"route",bundlePath:"app/api/user/profile/route"},resolvedPagePath:"C:\\Users\\Rasoa\\Desktop\\ASM\\frontend\\app\\api\\user\\profile\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:A,staticGenerationAsyncStorage:l,serverHooks:c}=p,I="/api/user/profile/route";function L(){return(0,o.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:l})}},95456:(e,r,t)=>{t.d(r,{fT:()=>o,kF:()=>u,nX:()=>a});var s=t(6091),E=t(6176);let i=new TextEncoder().encode(process.env.JWT_SECRET||"asm-alumni-secret-key-change-in-production");async function o(e){return await new s.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30d").sign(i)}async function T(e){try{let{payload:r}=await (0,E._)(e,i);return r}catch{return null}}async function a(e){let r=e.headers.get("authorization");if(!r?.startsWith("Bearer "))return null;let s=r.slice(7),E=await T(s);if(!E)return null;let{sql:i}=await Promise.resolve().then(t.bind(t,75748)),o=await i`
    SELECT id, email, "firstName", "lastName", role, "isVerified", "photoUrl"
    FROM users WHERE id = ${E.id} AND "isActive" = true
  `;if(0===o.rows.length)return null;let a=o.rows[0];return{id:a.id,email:a.email,firstName:a.firstName,lastName:a.lastName,role:a.role,isVerified:!!a.isVerified,photoUrl:a.photoUrl}}function u(e){return e?"admin"!==e.role?{status:403,body:{success:!1,message:"Acc\xe8s refus\xe9"}}:null:{status:401,body:{success:!1,message:"Non autoris\xe9"}}}},75748:(e,r,t)=>{t.d(r,{l:()=>E,sql:()=>s.i6});var s=t(28462);let E=`
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
`}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[9276,5972,509,8863],()=>t(13148));module.exports=s})();