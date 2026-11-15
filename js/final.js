// DriveNow Final: browser-only login, validation, bookings and a map API.
(function(){
"use strict";
const USERS="drivenow-users",SESSION="drivenow-session",BOOKINGS="drivenow-bookings";
const $=id=>document.getElementById(id);
const get=(key,fallback)=>{try{const x=localStorage.getItem(key);return x?JSON.parse(x):fallback}catch(e){return fallback}};
const put=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}};
const session=()=>{try{return localStorage.getItem(SESSION)||""}catch(e){return ""}};
const user=()=>get(USERS,[]).find(u=>u.email===session());
const emailOK=s=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
const passwordOK=s=>s.length>=8&&/[A-Z]/.test(s)&&/[a-z]/.test(s)&&/[0-9]/.test(s)&&/[^A-Za-z0-9]/.test(s);
const nameOK=s=>(s.match(/\p{L}/gu)||[]).length>=2&&/^[\p{L}\s.'-]+$/u.test(s);
function error(id,message){const field=$(id),slot=$(id+"Error");if(slot)slot.textContent=message;field?.classList.toggle("is-invalid",!!message);if(field){if(message)field.setAttribute("aria-invalid","true");else field.removeAttribute("aria-invalid")}return !message}
function check(id,yes,message){return error(id,yes?"":message)}
function status(id,message,tone){const x=$(id);if(x){x.textContent=message;x.className=message?"alert alert-"+tone+" mt-3":"mt-3"}}
document.addEventListener("DOMContentLoaded",function(){
document.querySelectorAll("[data-guest-link]").forEach(a=>{a.style.display=user()?"none":""});
if($("loginForm"))initAuth();
if($("profileUser"))initProfile();
if($("finalBookingForm"))initBooking();
if($("findMap"))initMap();
if(!window.jQuery){let dark=false;try{dark=localStorage.getItem("drivenow-theme")==="dark"}catch(e){}
function apply(){document.body.classList.toggle("dark-mode",dark);document.querySelectorAll(".theme-toggle").forEach(x=>x.setAttribute("aria-pressed",String(dark)))}
apply();document.querySelectorAll(".theme-toggle").forEach(x=>x.addEventListener("click",()=>{dark=!dark;apply();try{localStorage.setItem("drivenow-theme",dark?"dark":"light")}catch(e){}}))}
});
function initAuth(){
const login=$("loginForm"),signup=$("signupForm"),a=$("showLogin"),b=$("showSignup");
function tab(sign){login.hidden=sign;signup.hidden=!sign;a.className=sign?"btn btn-outline-primary":"btn btn-primary";b.className=sign?"btn btn-primary":"btn btn-outline-primary";}
a.addEventListener("click",()=>tab(false));b.addEventListener("click",()=>tab(true));
if(new URLSearchParams(location.search).get("mode")==="signup")tab(true);
[login,signup].forEach(f=>f.addEventListener("input",e=>{if(e.target.id)error(e.target.id,"")}));
signup.addEventListener("submit",e=>{
e.preventDefault();const name=$("signupName").value.trim(),email=$("signupEmail").value.trim().toLowerCase(),password=$("signupPassword").value;
let ok=check("signupName",nameOK(name),"Enter your name using at least two letters.");
ok=check("signupEmail",emailOK(email),"Enter a valid email.")&&ok;
ok=check("signupPassword",passwordOK(password),"Use 8+ characters with uppercase, lowercase, number and symbol.")&&ok;
if(!ok){status("signupStatus","Correct the highlighted fields.","danger");return}
const users=get(USERS,[]);if(users.some(x=>x.email===email)){error("signupEmail","Email already registered.");status("signupStatus","Log in instead.","danger");return}
users.push({name,email,password});if(!put(USERS,users)){status("signupStatus","Browser storage is unavailable.","danger");return}
$("loginEmail").value=email;$("loginPassword").value="";signup.reset();tab(false);status("loginStatus","Account created. Enter your password to log in.","success");
});
login.addEventListener("submit",e=>{
e.preventDefault();const email=$("loginEmail").value.trim().toLowerCase(),password=$("loginPassword").value;
let ok=check("loginEmail",emailOK(email),"Enter a valid email.");
ok=check("loginPassword",passwordOK(password),"Enter the password you registered with (8+ characters, letters, number, symbol).")&&ok;
if(!ok){status("loginStatus","Correct the highlighted fields.","danger");return}
if(!get(USERS,[]).some(u=>u.email===email&&u.password===password)){status("loginStatus","Incorrect email or password.","danger");return}
try{localStorage.setItem(SESSION,email)}catch(e){status("loginStatus","Browser storage is unavailable.","danger");return}
const next=new URLSearchParams(location.search).get("next");
location.assign(next&&/^booking\.html(?:\?[^#]*)?$/.test(next)?next:"profile.html");
});
}
function initProfile(){
const u=user();$("profileGuest").hidden=!!u;$("profileUser").hidden=!u;
if(!u)return;$("profileName").textContent=u.name;$("profileEmail").textContent=u.email;
$("logoutButton").addEventListener("click",()=>{try{localStorage.removeItem(SESSION)}catch(e){}location.assign("index.html")});
const container=$("myBookings");container.replaceChildren();
const bookings=get(BOOKINGS,[]).filter(x=>x.email===u.email).reverse();
if(!bookings.length){container.textContent="No booking requests yet.";return}
bookings.forEach(b=>{const p=document.createElement("p");p.className="border-bottom py-2";p.textContent=b.car+" · "+b.start+" to "+b.end+" · "+b.status;container.append(p)});
}
function initBooking(){
const u=user();if(!u){location.replace("login.html?next="+encodeURIComponent("booking.html"+location.search));return}
$("bookingName").value=u.name;$("bookingEmail").value=u.email;
const car=new URLSearchParams(location.search).get("car");if(car&&[...$("car").options].some(x=>x.value===car))$("car").value=car;
const form=$("finalBookingForm");form.addEventListener("input",e=>{if(e.target.id)error(e.target.id,"")});
form.addEventListener("submit",e=>{
e.preventDefault();const name=$("bookingName").value.trim(),email=$("bookingEmail").value.trim().toLowerCase(),phone=$("bookingPhone").value.replace(/\D/g,""),start=$("bookingStart").value,end=$("bookingEnd").value;
const d=new Date(),today=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
let ok=check("bookingName",nameOK(name),"Enter your full name.");
ok=check("bookingEmail",emailOK(email)&&email===u.email,"Use your account email.")&&ok;
ok=check("bookingPhone",phone.length===10||(phone.length===11&&phone.startsWith("7")),"Enter 10 digits after +7.")&&ok;
ok=check("car",$("car").value!=="","Select a car.")&&ok;
ok=check("bookingStart",!!start&&start>=today,"Pick-up date must be today or later.")&&ok;
ok=check("bookingEnd",!!end&&end>start,"Return date must be after pick-up.")&&ok;
if(!ok){status("finalBookingStatus","Correct the highlighted fields.","danger");return}
const all=get(BOOKINGS,[]);all.push({email,name,phone,car:$("car").selectedOptions[0].textContent.trim(),start,end,status:"Demo request",id:Date.now()});
if(!put(BOOKINGS,all)){status("finalBookingStatus","Could not save. Browser storage is unavailable.","danger");return}
status("finalBookingStatus","Request saved locally. View it in Profile. This is not a real reservation.","success");
});
}
function initMap(){
let last=0;$("findMap").addEventListener("click",async()=>{
const query=$("pickupPlace").value.trim(),msg=$("mapStatus"),box=$("mapResult");
if(query.length<3){msg.textContent="Enter at least three characters.";return}
if(Date.now()-last<1200){msg.textContent="Wait a moment before searching again.";return}last=Date.now();
msg.textContent="Loading map...";box.replaceChildren();$("findMap").disabled=true;
try{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8500);let res;try{res=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(query),{signal:controller.signal})}finally{clearTimeout(timer)}
if(!res.ok)throw Error("API "+res.status);const data=await res.json();if(!data.length){msg.textContent="Location not found.";return}
const lat=Number(data[0].lat),lon=Number(data[0].lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))throw Error("Invalid location");
const bbox=[lon-.02,lat-.02,lon+.02,lat+.02].join(",");const iframe=document.createElement("iframe");iframe.title="Pick-up location map";iframe.loading="lazy";iframe.src="https://www.openstreetmap.org/export/embed.html?bbox="+encodeURIComponent(bbox)+"&layer=mapnik&marker="+encodeURIComponent(lat+","+lon);box.append(iframe);msg.textContent=data[0].display_name;
}catch(e){msg.textContent="Map search unavailable. Check your connection and try again."}finally{$("findMap").disabled=false}
});
}
})();