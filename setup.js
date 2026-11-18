require('dotenv').config();
const rl=require('readline'),bcrypt=require('bcryptjs'),{db}=require('./database/db');
const i=rl.createInterface({input:process.stdin,output:process.stdout});let mute=false;
i._writeToOutput=s=>{if(!mute||s.includes('\n'))i.output.write(s)};
const ask=(q,m)=>new Promise(r=>{mute=false;i.output.write(q);mute=!!m;i.question('',a=>{mute=false;r(a)})});
(async()=>{
const u=(await ask('Admin username [OntarioRoleplay000]: '))||'OntarioRoleplay000';
const p=await ask('Admin password (min 10 chars): ',1);const p2=await ask('\nRepeat password: ',1);
if(p!==p2||p.length<10){console.log('\nPasswords must match and be 10+ characters.');process.exit(1)}
if(p.toLowerCase()===u.toLowerCase())console.log('\nWARNING: password equals username. Change it in Account Settings right after login!');
db.prepare('INSERT INTO admin(id,username,hash) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET username=excluded.username,hash=excluded.hash').run(u,bcrypt.hashSync(p,12));
console.log('\nAdmin account saved (salted bcrypt hash). Start the site with: npm start');i.close()})();
