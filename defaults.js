const P=(name,abbr,jurisdiction,description,responsibilities,guidelines)=>({name,abbr,logo:"",jurisdiction,description,responsibilities,guidelines,visible:true});
module.exports={
fonts:["Segoe UI, system-ui, sans-serif","Georgia, serif","Trebuchet MS, sans-serif","Arial, Helvetica, sans-serif","Courier New, monospace"],
content:{
site:{name:"Ontario Roleplay",abbr:"ORP",footer:"© Ontario Roleplay. Not affiliated with any real-world police, fire, paramedic or government organization."},
images:{logo:"/images/logo.png",banner:"/images/banner.png"},
home:{title:"Welcome to Ontario Roleplay",welcome:"Welcome to Ontario Roleplay! Experience realistic Ontario-based roleplay in Roblox Maple County. Join our community, explore custom emergency vehicle liveries, and enjoy professional, immersive roleplay.",joinLabel:"Join Server",deptLabel:"View Departments",igLabel:"Instagram"},
server:{name:"Ontario Roleplay",game:"Roblox Maple County",owner:"bestcopever12340",maxPlayers:35,region:"Ontario, Canada",type:"Private Server",roleplayType:"Realistic Ontario Roleplay",status:"Check official announcements",description:"A realistic, professional Ontario-based roleplay community."},
departments:[
P("Ontario Provincial Police","OPP","Provincial Highways & Assigned Patrol Areas","Provincial law enforcement and highway patrol.",["Traffic Enforcement & Highway Patrol","Emergency Response","Criminal Investigations","Vehicle Pursuits & Traffic Stops","Public Safety & Law Enforcement"],["Follow department procedures","Stay professional at all times","Use only authorized vehicles"]),
P("Toronto Police Service","TPS","City Streets & Assigned Urban Patrol Areas","Urban law enforcement and city patrol.",["Traffic Enforcement & City Patrol","Emergency Response","Criminal Investigations","Vehicle Pursuits & Traffic Stops","Community Safety & Law Enforcement"],["Follow department procedures","Stay professional at all times","Use only authorized vehicles"]),
P("Toronto Paramedic Services","TPS-EMS","City Streets & Assigned Emergency Response Areas","Emergency medical response and patient care.",["Emergency Medical Response","Patient Assessment & Treatment","Medical Emergencies & Trauma Care","Vehicle Accidents & Medical Assistance","Patient Transportation & Public Safety"],["Roleplay realistic patient care","No abuse of emergency equipment"]),
P("Toronto Fire Services","TFS","City Streets & Assigned Urban Response Areas","Fire suppression, rescue and hazmat response.",["Fire Suppression & Prevention","Emergency Response","Vehicle Accidents & Rescue Operations","Hazardous Materials Incidents","Public Safety & Fire Protection"],["Follow department procedures","No abuse of emergency equipment"]),
P("Department of Transportation","DOT","Provincial Highways, City Roads & Assigned Service Areas","Road maintenance, traffic control and recovery.",["Road Maintenance & Repairs","Traffic Control & Road Closures","Vehicle Towing & Roadside Assistance","Accident Scene Cleanup & Recovery","Highway Safety & Infrastructure Maintenance"],["Use authorized vehicles","Stay professional at all times"]),
P("Civilian Operations","CIV","Anywhere in Maple County","Everyday citizens, drivers and business roleplay.",["Realistic everyday roleplay","Jobs and businesses","Interact respectfully with emergency services"],["Follow traffic laws unless roleplay requires otherwise","Value your character's life"])],
rules:[
{title:"Roleplay Rules",items:["No Fail Roleplay (FRP).","No Random Deathmatch (RDM).","No Vehicle Deathmatch (VDM).","Follow the 10-minute New Life Rule (NLR).","No Combat Logging.","No Metagaming.","Value your character's life."]},
{title:"Civilian Rules",items:["Follow traffic laws unless roleplay requires otherwise.","No cop baiting.","No unrealistic pursuits.","Roleplay crashes and injuries.","No trolling or exploiting."]},
{title:"Emergency Services Rules",items:["Use authorized department vehicles.","Follow department procedures.","No abuse of emergency equipment.","Remain professional."]},
{title:"Staff Rules",items:["Respect staff and other players.","No harassment or discrimination.","Follow staff instructions.","Report violations appropriately."]}],
links:{instagram:"https://www.instagram.com/ontarioroleplay0/",discord:"",roblox:""},
contact:{general:"For general community questions, message us on Instagram or Discord.",staff:"For staff assistance, contact a staff member in the Discord server.",departments:"For department inquiries, ask in the Discord server."},
design:{accent:"#d71920",bg:"#0d0d0f",card:"#1a1b1e",text:"#f2f2f2",font:"Segoe UI, system-ui, sans-serif",radius:"10"}
}};
