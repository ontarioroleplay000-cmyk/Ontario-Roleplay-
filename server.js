require('dotenv').config();
const express=require('express'),session=require('express-session'),helmet=require('helmet'),rate=require('express-rate-limit'),multer=require('multer'),bcrypt=require('bcryptjs'),crypto=require('crypto'),path=require('path'),fs=require('fs');
const {db,dir,Database,getContent,setContent}=require('./database/db');
const Store=require('better-sqlite3-session-store')(session);
if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<24){console.error('Set SESSION_SECRET (24+ chars) in .env');process.exit(1)}
const app=express(),prod=process.env.NODE_ENV==='production',DEF=require('./database/defaults');
app.set('trust proxy',1);app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],imgSrc:["'self'",'data:','blob:'],styleSrc:["'self'","'unsafe-inline'"],scriptSrc:["'self'"],objectSrc:["'none'"],frameAncestors:["'none'"],upgradeInsecureRequests:prod?[]:null}}}));
app.use(session({name:'orp.sid',secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,
store:new Store({client:new Database(path.join(dir,'sessions.db')),expired:{clear:true,intervalMs:900000}}),
cookie:{httpOnly:true,sameSite:'strict',secure:prod,maxAge:2*3600*1000}}));
app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(dir,'uploads'),{index:false,dotfiles:'deny',setHeaders:r=>r.setHeader('X-Content-Type-Options','nosniff')}));

const auth=(q,s,n)=>q.session.admin?n():q.originalUrl.startsWith('/admin/api')?s.status(401).json({error:'Not logged in'}):s.redirect('/admin/login');
const csrf=(q,s,n)=>(q.session.csrf&&q.get('x-csrf-token')===q.session.csrf)?n():s.status(403).json({error:'Bad CSRF token. Refresh the page.'});
const A=(f)=>path.join(__dirname,'admin',f);

app.get('/api/content',(q,s)=>{s.set('Cache-Control','no-store');s.json(getContent())});
app.get('/admin',(q,s)=>s.redirect('/admin/login'));
app.get('/admin/login',(q,s)=>s.sendFile(A('login.html')));
app.get('/admin/dashboard',auth,(q,s)=>s.sendFile(A('dashboard.html')));
app.get('/admin/api/csrf',(q,s)=>{q.session.csrf=q.session.csrf||crypto.randomBytes(24).toString('hex');s.json({token:q.session.csrf,admin:!!q.session.admin})});

const limiter=rate({windowMs:15*60*1000,max:6,standardHeaders:true,legacyHeaders:false,message:{error:'Too many attempts. Try again in 15 minutes.'}});
const DUMMY=bcrypt.hashSync('x',12);
app.post('/admin/api/login',limiter,csrf,(q,s)=>{
 const {username,password}=q.body||{},a=db.prepare('SELECT * FROM admin WHERE id=1').get();
 const okPw=bcrypt.compareSync(String(password||''),a?a.hash:DUMMY);
 if(!(a&&okPw&&username===a.username))return s.status(401).json({error:'Invalid username or password'});
 q.session.regenerate(e=>{if(e)return s.status(500).json({error:'Session error'});q.session.admin=true;q.session.csrf=crypto.randomBytes(24).toString('hex');s.json({ok:true})});
});
app.post('/admin/api/logout',auth,csrf,(q,s)=>q.session.destroy(()=>{s.clearCookie('orp.sid');s.json({ok:true})}));
app.post('/admin/api/password',auth,csrf,(q,s)=>{
 const {current,next}=q.body||{},a=db.prepare('SELECT * FROM admin WHERE id=1').get();
 if(!bcrypt.compareSync(String(current||''),a.hash))return s.status(400).json({error:'Current password is wrong'});
 if(typeof next!=='string'||next.length<10)return s.status(400).json({error:'New password must be 10+ characters'});
 db.prepare('UPDATE admin SET hash=? WHERE id=1').run(bcrypt.hashSync(next,12));s.json({ok:true});
});

const FONTS=['system','Georgia, serif','"Trebuchet MS", sans-serif','Verdana, sans-serif','"Courier New", monospace','Impact, sans-serif'];
const COLORS=['bg','panel','sectionBg','accent','text','muted'];
function clean(v,k='',d=0){
 if(d>7)throw Error('Content too deeply nested');
 if(typeof v==='boolean')return v;
 if(typeof v==='string'){v=v.trim().slice(0,3000);
  if(/Img$/.test(k)&&v&&!/^\/(uploads|images)\/[\w.\-]+$/.test(v))throw Error(`${k}: choose an uploaded image`);
  if((/Url$/.test(k)||k==='href')&&v&&!/^(https?:\/\/[^\s]+|#[\w\/\-]*)$/i.test(v))throw Error(`${k}: must start with https://`);
  if(COLORS.includes(k)&&!/^#[0-9a-f]{6}$/i.test(v))throw Error(`${k}: invalid colour`);
  if(k==='font'&&!FONTS.includes(v))throw Error('Invalid font');
  if(k==='radius'&&!/^\d{1,2}$/.test(v))throw Error('Radius must be 0-99');
  return v}
 if(Array.isArray(v)){if(v.length>100)throw Error('Too many items');return v.map(x=>clean(x,k,d+1))}
 if(v&&typeof v==='object'){const o={};for(const[kk,x]of Object.entries(v)){if(!/^\w+$/.test(kk))throw Error('Bad key');o[kk]=clean(x,kk,d+1)}return o}
 throw Error('Unsupported value');
}
app.put('/admin/api/content',auth,csrf,(q,s)=>{
 try{const c=clean(q.body);for(const k of Object.keys(DEF))if(typeof c[k]!==typeof DEF[k]||Array.isArray(c[k])!==Array.isArray(DEF[k]))throw Error('Missing section: '+k);
  setContent(c);s.json({ok:true})}catch(e){s.status(400).json({error:e.message})}
});

const up=multer({storage:multer.memoryStorage(),limits:{fileSize:3*1024*1024,files:1}});
const sig=b=>b.slice(0,4).equals(Buffer.from([0x89,0x50,0x4e,0x47]))?'png':b.slice(0,3).equals(Buffer.from([0xff,0xd8,0xff]))?'jpg':b.slice(0,4).toString()==='GIF8'?'gif':(b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP')?'webp':null;
app.post('/admin/api/upload',auth,csrf,up.single('file'),(q,s)=>{
 if(!q.file)return s.status(400).json({error:'No file'});const e=sig(q.file.buffer);
 if(!e)return s.status(400).json({error:'Only PNG, JPG, GIF or WEBP images allowed'});
 const n=crypto.randomBytes(8).toString('hex')+'.'+e;fs.writeFileSync(path.join(dir,'uploads',n),q.file.buffer);s.json({url:'/uploads/'+n});
});
app.use((e,q,s,n)=>e&&e.code==='LIMIT_FILE_SIZE'?s.status(400).json({error:'Image must be under 3 MB'}):n(e));
app.get('/admin/api/images',auth,(q,s)=>s.json(fs.readdirSync(path.join(dir,'uploads')).map(f=>'/uploads/'+f)));
app.delete('/admin/api/images/:n',auth,csrf,(q,s)=>{
 if(!/^[a-f0-9]{16}\.(png|jpg|gif|webp)$/.test(q.params.n))return s.status(400).json({error:'Bad name'});
 fs.rmSync(path.join(dir,'uploads',q.params.n),{force:true});s.json({ok:true});
});
app.listen(process.env.PORT||3000,()=>console.log('Ontario Roleplay running on port '+(process.env.PORT||3000)));
