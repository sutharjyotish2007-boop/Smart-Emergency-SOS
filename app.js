const $=s=>document.querySelector(s);
const guides={
medical:{title:"Medical emergency",steps:[["1. Get professional help","For a serious or life-threatening emergency in India, call 112. Give the location and describe what happened."],["2. Follow instructions","Listen to the emergency call handler and follow their directions."],["3. Keep the area safe","Avoid putting yourself at risk. Do not give food or drink to an unconscious person."],["4. Share key facts","Tell responders the person's condition, hazards present, and important changes if known."]]},
accident:{title:"Road accident",steps:[["1. Call for help","Call 112 and give the road name, nearest landmark, direction and visible hazards."],["2. Protect yourself","Stay out of traffic and away from fire, leaking fuel or other hazards."],["3. Avoid unnecessary movement","Do not move a seriously injured person unless there is immediate danger."],["4. Guide responders","If safe, ask a bystander to signal responders from a safe place."]]},
fire:{title:"Fire or smoke",steps:[["1. Leave if safe","Move away from fire and smoke using the nearest safe exit."],["2. Use stairs","Do not use lifts during a building fire. Stay low if smoke is present along your exit route."],["3. Call from safety","Once away from danger, call 112 and share the building and floor."],["4. Do not re-enter","Stay outside until authorities say it is safe."]]},
disaster:{title:"Natural disaster",steps:[["1. Follow official alerts","Follow local authority instructions and evacuate if told to do so."],["2. Avoid hazards","Stay away from floodwater, damaged structures and downed power lines."],["3. Contact help","Call 112 for immediate danger and share your location."],["4. Check updates safely","Use official government or disaster-management channels for verified information."]]},
safety:{title:"Personal or campus safety",steps:[["1. Move to safety","If possible, go to a populated, well-lit place or staffed security desk."],["2. Contact trusted help","Call 112 for immediate danger; otherwise contact a trusted person or verified campus security."],["3. Share location","If safe, share your location with a trusted contact."],["4. Protect privacy","Avoid posting names or sensitive incident details publicly."]]},
other:{title:"Other emergency",steps:[["1. Move away from hazards","Get to a safer place if you can do so safely."],["2. Call official help","In India, call 112 for an emergency requiring immediate assistance."],["3. Describe the situation","Tell the call handler what happened, where you are and any hazards."],["4. Follow directions","Follow emergency professionals and local authorities."]]}
};
let activeGuide=null,coords=null,report="";
function toast(t){let el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
document.querySelectorAll(".emergency").forEach(btn=>btn.addEventListener("click",()=>{activeGuide=guides[btn.dataset.type]||guides.other;$("#guideTitle").textContent=activeGuide.title;$("#guideBody").innerHTML=activeGuide.steps.map(s=>`<div class="step"><b>${escapeHTML(s[0])}</b>${escapeHTML(s[1])}</div>`).join("");$("#guidance").classList.remove("hidden");$("#guidance").scrollIntoView({behavior:"smooth",block:"nearest"})}));
$("#closeGuide").addEventListener("click",()=>$("#guidance").classList.add("hidden"));
async function copyText(text,msg){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{let t=document.createElement("textarea");t.value=text;t.style.position="fixed";t.style.opacity="0";document.body.appendChild(t);t.select();if(!document.execCommand("copy"))throw Error();t.remove()}toast(msg)}catch{toast("Copy blocked. Please select and copy the text manually.")}}
$("#copyGuide").addEventListener("click",()=>{if(activeGuide)copyText(activeGuide.title+"\n\n"+activeGuide.steps.map(s=>s.join("\n")).join("\n\n"),"Guidance copied.")});
$("#getLoc").addEventListener("click",()=>{if(!navigator.geolocation){$("#locStatus").textContent="Location unsupported; enter a landmark instead.";return}$("#locStatus").textContent="Waiting for permission…";navigator.geolocation.getCurrentPosition(p=>{coords={lat:p.coords.latitude,lon:p.coords.longitude};let a=coords.lat.toFixed(6),b=coords.lon.toFixed(6);$("#coords").textContent=`Latitude: ${a}\nLongitude: ${b}`;$("#locStatus").textContent="Location ready on this device";$("#mapLabel").textContent=`${a}, ${b}`;$("#shareLoc").disabled=false;$("#where").value=`Coordinates: ${a}, ${b}`;toast("Location obtained; not sent to a server.")},e=>{let m=e.code===1?"Permission denied. Enter a landmark manually.":e.code===2?"Location unavailable. Try a landmark.":"Request timed out. Try again or enter a landmark.";$("#locStatus").textContent=m;toast(m)},{timeout:10000,maximumAge:60000})});
$("#shareLoc").addEventListener("click",async()=>{if(!coords)return;let url=`https://maps.google.com/?q=${coords.lat},${coords.lon}`,text=`My shared location: ${url}`;if(navigator.share){try{await navigator.share({title:"My location",text,url})}catch(e){if(e.name!=="AbortError")copyText(text,"Location link copied.")}}else copyText(text,"Location link copied.")});
$("#reportForm").addEventListener("submit",e=>{e.preventDefault();let type=$("#type").value,where=$("#where").value.trim(),details=$("#details").value.trim(),name=$("#name").value.trim();if(!where||!details){toast("Please complete required fields.");return}report=["EMERGENCYCONNECT — INCIDENT REPORT (LOCAL DRAFT)",`Type: ${type}`,`Location: ${where}`,`Details: ${details}`,name?`Callback name: ${name}`:"",`Created: ${new Date().toLocaleString()}`,"","This report has NOT been sent to emergency services."].filter(Boolean).join("\n");$("#output").textContent=report;$("#copyReport").disabled=false;$("#shareReport").disabled=false;toast("Report prepared locally; not sent.")});
$("#copyReport").addEventListener("click",()=>{if(report)copyText(report,"Report copied.")});
$("#shareReport").addEventListener("click",async()=>{if(!report)return;if(navigator.share){try{await navigator.share({title:"Incident report",text:report})}catch(e){if(e.name!=="AbortError")copyText(report,"Report copied.")}}else copyText(report,"Report copied.")});
$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("open"));$("#nav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));


// Rule-based "smart guide": transparent keyword matching, not an AI/diagnostic system.
const smartRules = [
  {keys:["fire","smoke","burning","flame"],type:"fire",title:"Possible fire or smoke"},
  {keys:["accident","crash","collision","road injury"],type:"accident",title:"Possible road accident"},
  {keys:["unconscious","not responding","collapsed","not waking"],type:"medical",title:"Possible medical emergency"},
  {keys:["blood","bleeding","injury","hurt"],type:"medical",title:"Possible injury"},
  {keys:["unsafe","followed","threat","harassed","campus safety"],type:"safety",title:"Personal safety concern"},
  {keys:["flood","earthquake","storm","disaster"],type:"disaster",title:"Possible natural disaster"}
];
let suggestedType = null;
document.querySelectorAll("[data-prompt]").forEach(btn => btn.addEventListener("click", () => {
  $("#smartInput").value = btn.dataset.prompt;
  $("#smartInput").focus();
}));
$("#smartSuggest").addEventListener("click", () => {
  const value = $("#smartInput").value.trim().toLowerCase();
  const match = smartRules.find(rule => rule.keys.some(key => value.includes(key)));
  const title = $("#smartTitle"), body = $("#smartText"), open = $("#openSuggested");
  if (!value) {
    title.textContent = "Add a short description";
    body.textContent = "Try a sample prompt or describe the situation in a few words.";
    suggestedType = null; open.disabled = true; return;
  }
  if (!match) {
    title.textContent = "No clear category found";
    body.textContent = "Move to safety if possible. If there is immediate danger in India, call 112. You can choose a category above to view general guidance.";
    suggestedType = "other";
  } else {
    title.textContent = match.title;
    body.textContent = `Suggested category: ${guides[match.type].title}. If there is immediate danger in India, call 112 first. This keyword-based demo can misunderstand descriptions; follow emergency professionals, not this suggestion alone.`;
    suggestedType = match.type;
  }
  open.disabled = false;
});
$("#openSuggested").addEventListener("click", () => {
  if (!suggestedType) return;
  const button = document.querySelector(`.emergency[data-type="${suggestedType}"]`);
  if (button) button.click();
  $("#help").scrollIntoView({behavior:"smooth", block:"start"});
});
function updatePrepProgress() {
  const checks = [...document.querySelectorAll(".prep-check")];
  const count = checks.filter(c => c.checked).length;
  $("#prepCount").textContent = `${count} of ${checks.length} completed`;
  $("#prepProgress").style.width = `${count / checks.length * 100}%`;
}
document.querySelectorAll(".prep-check").forEach(c => c.addEventListener("change", updatePrepProgress));
const scenarios = {
  fire: {title:"Smoke in a hostel corridor",type:"fire",steps:["Move away from smoke and use a safe exit; do not use lifts.","Once safe, call 112 and state the hostel/building, floor and nearest landmark.","Do not re-enter until authorities say it is safe."]},
  accident: {title:"Road accident near college gate",type:"accident",steps:["Stay out of traffic and away from hazards.","Call 112; describe the gate, road, direction and visible hazards.","Avoid moving a seriously injured person unless immediate danger requires it."]},
  medical: {title:"Person appears unconscious",type:"medical",steps:["Call 112 for a serious or life-threatening emergency.","Follow the call handler’s instructions; do not give food or drink to an unconscious person.","Ask a bystander to guide responders if it is safe."]},
  safety: {title:"Student feels unsafe",type:"safety",steps:["Move toward a staffed, populated safe place if possible.","Call 112 if in immediate danger; otherwise contact a trusted person or verified campus security.","Share location only with a trusted contact and avoid posting sensitive details publicly."]}
};
$("#runScenario").addEventListener("click", () => {
  const s = scenarios[$("#scenarioSelect").value];
  $("#scenarioOutput").innerHTML = `<span class="scenario-tag">SIMULATION ONLY · NO CONTACT SENT</span><b>${escapeHTML(s.title)}</b><p>${s.steps.map((step,i)=>`${i+1}. ${escapeHTML(step)}`).join("<br>")}</p><button type="button" class="btn pale" id="scenarioGuide">Open related guide</button>`;
  $("#scenarioGuide").addEventListener("click", () => {
    const button = document.querySelector(`.emergency[data-type="${s.type}"]`);
    if (button) button.click();
    $("#help").scrollIntoView({behavior:"smooth",block:"start"});
  });
});
