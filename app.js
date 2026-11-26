/*
  Deer Processing Order Form
  - Edit FLAVORS below when the owner provides the actual flavor list for each product.
  - This is a front-end demo. GitHub Pages does not store or email submissions.
*/
const FLAVORS = {
  breakfast: ["Original (sample)", "Hot (sample)", "Sage (sample)"],
  italian: ["Mild Italian (sample)", "Hot Italian (sample)", "Sweet Italian (sample)"],
  summer: ["Original (sample)", "Jalapeño Cheddar (sample)", "Pepperoni (sample)"],
  sticks: ["Original (sample)", "Hot (sample)", "Teriyaki (sample)"],
  jerky: ["Original (sample)", "Peppered (sample)", "Teriyaki (sample)"],
  jerkyMeat: ["No flavoring — meat only"]
};

const STANDARD = ["Steaks", "Ground Burger", "Roast", "Chunks", "Backstrap", "Tenderloin", "Shank", "Quarter Roast", "Shoulder Roast", "Stew Meat"];
const SPECIALTIES = [
  { key:"breakfast", name:"Breakfast sausage (ground)", price:6, min:0, unit:"lb" },
  { key:"italian", name:"Italian sausage (ground)", price:6, min:0, unit:"lb" },
  { key:"summer", name:"Summer sausage", price:9, min:15, unit:"lb" },
  { key:"sticks", name:"Snack sticks", price:7, min:5, unit:"lb" },
  { key:"jerky", name:"Sliced jerky", price:6, min:5, unit:"lb" },
  { key:"jerkyMeat", name:"Sliced jerky meat (not marinated or dehydrated)", price:4, min:5, unit:"lb" }
];

const state = {
  step: 0,
  customer: { name:"", phone:"", count:1, cash:false, clean:false, pickup:false, comments:"" },
  deer: []
};
const $ = (id) => document.getElementById(id);
const app = $("app"), intro = $("intro-panel"), content = $("step-content");
const steps = () => ["Customer information", ...state.deer.map((_, i) => `Deer ${i+1} of ${state.deer.length}`), "Agreements & review"];

function newDeer() {
  return { tag:"", standard:[], specialties:{}, gutting:false, caping:false, mount:false, board:false };
}
function money(n) { return "$" + Number(n).toFixed(2); }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function checkedAttr(v) { return v ? "checked" : ""; }

$("start-button").addEventListener("click", () => {
  intro.classList.add("hidden"); app.classList.remove("hidden"); render();
});
$("back-button").addEventListener("click", () => { if (state.step > 0) { state.step--; render(); } });
$("next-button").addEventListener("click", () => {
  if (!validateStep()) return;
  if (state.step < steps().length - 1) { state.step++; render(); }
  else showConfirmation();
});

function render() {
  const labels = steps();
  $("step-label").textContent = labels[state.step];
  $("step-count").textContent = `Step ${state.step+1} of ${labels.length}`;
  $("progress-fill").style.width = `${((state.step+1)/labels.length)*100}%`;
  $("back-button").style.visibility = state.step === 0 ? "hidden" : "visible";
  $("next-button").textContent = state.step === labels.length - 1 ? "Review my order" : "Continue";
  if (state.step === 0) renderCustomer();
  else if (state.step <= state.deer.length) renderDeer(state.step - 1);
  else renderAgreements();
  bindCurrentInputs();
}
function renderCustomer() {
  const c = state.customer;
  content.innerHTML = `<div class="step-card">
    <h2>Customer information</h2>
    <p class="muted">Please provide your contact information and tell us how many deer are included in this order.</p>
    <div class="field"><label for="customer-name">Full name *</label><input id="customer-name" type="text" autocomplete="name" value="${esc(c.name)}" required></div>
    <div class="field"><label for="customer-phone">Phone number *</label><input id="customer-phone" type="tel" autocomplete="tel" placeholder="(555) 555-5555" value="${esc(c.phone)}" required></div>
    <div class="field"><label for="deer-count">Number of deer *</label><select id="deer-count">${Array.from({length:10},(_,i)=>`<option value="${i+1}" ${Number(c.count)===i+1?"selected":""}>${i+1}</option>`).join("")}</select></div>
    <div class="note">Each deer will have its own tag number, processing selections, and base processing price.</div>
  </div>`;
}
function renderDeer(index) {
  const d = state.deer[index];
  const selectedSpecialties = Object.keys(d.specialties).filter(k => d.specialties[k].selected);
  content.innerHTML = `<div class="step-card">
    <h2>Deer ${index+1}</h2>
    <div class="field"><label for="tag-${index}">Deer tag number *</label><input id="tag-${index}" type="text" value="${esc(d.tag)}" placeholder="Enter tag number" required></div>
    <h3>Standard processing</h3>
    <p class="muted small">Choose only the cuts you'd like. You can select as many or as few as you need.</p>
    <div class="choice-grid">${STANDARD.map((name,i)=>`<label class="choice"><input type="checkbox" data-standard="${i}" ${d.standard.includes(name)?"checked":""}> <span>${name}</span></label>`).join("")}</div>
    <h3>Specialty processing</h3>
    <p class="muted small">Select any specialty products you would like. Selecting at least one specialty changes this deer’s base processing price from $95 to $75.</p>
    ${SPECIALTIES.map(s => specialtyMarkup(s,d.specialties[s.key])).join("")}
    <h3>Additional services for this deer</h3>
    <div class="choice-grid">
      <label class="choice"><input type="checkbox" id="gutting-${index}" ${checkedAttr(d.gutting)}> <span>Gutting <strong>$25</strong></span></label>
      <label class="choice"><input type="checkbox" id="caping-${index}" ${checkedAttr(d.caping)}> <span>Caping <strong>$60</strong></span></label>
      <label class="choice"><input type="checkbox" id="mount-${index}" ${checkedAttr(d.mount)}> <span>European mount <strong>$120</strong></span></label>
    </div>
    <div id="board-wrap-${index}" class="${d.mount?"":"hidden"} field">
      <label class="choice"><input type="checkbox" id="board-${index}" ${checkedAttr(d.board)}> <span>Include a board with the European mount <strong>+$120</strong></span></label>
    </div>
    <div class="note">Specialty weights are not entered here. The processor will weigh the meat and call to confirm available quantities and flavor preferences.</div>
  </div>`;
}
function specialtyMarkup(s, data) {
  const selected = !!(data && data.selected);
  const prefs = data?.prefs || [""];
  const flavors = FLAVORS[s.key] || ["Flavor list to be confirmed"];
  return `<div class="specialty-card">
    <div class="specialty-head">
      <input type="checkbox" id="special-${s.key}" data-special="${s.key}" ${checkedAttr(selected)}>
      <label for="special-${s.key}">${s.name}<span class="price-line">$${s.price}/lb${s.min ? ` · ${s.min} lb minimum per flavor` : ""}</span></label>
    </div>
    <div class="specialty-details ${selected?"":"hidden"}" id="details-${s.key}">
      <p class="small muted">Choose your flavor preferences in order. The owner will confirm final weights and quantities after weighing.</p>
      ${prefs.map((v,i)=>`<div class="field"><label for="flavor-${s.key}-${i}">Preference ${i+1}${i===0?" (first choice)":""}</label><select id="flavor-${s.key}-${i}" data-flavor="${s.key}" data-pref="${i}"><option value="">Choose a flavor</option>${flavors.map(f=>`<option ${v===f?"selected":""} value="${esc(f)}">${esc(f)}</option>`).join("")}</select></div>`).join("")}
      <button type="button" class="button secondary add-flavor" data-add-flavor="${s.key}" ${prefs.length>=3?"disabled":""}>Add another flavor preference</button>
      <p class="small muted">${s.min ? `Each selected flavor requires at least ${s.min} lbs. For example, two flavors require at least ${s.min*2} lbs total.` : "The owner will confirm available quantity and flavor split after weighing."}</p>
    </div>
  </div>`;
}
function renderAgreements() {
  const c = state.customer;
  content.innerHTML = `<div class="step-card">
    <h2>Agreements & final details</h2>
    <p>Please review and acknowledge the following before submitting your order.</p>
    <div class="field"><label class="choice"><input type="checkbox" id="cash" ${checkedAttr(c.cash)}> <span>I understand payment is due in cash.</span></label></div>
    <div class="field"><label class="choice"><input type="checkbox" id="clean" ${checkedAttr(c.clean)}> <span>I understand that deer requiring extra cleaning will incur a $15 charge. This includes guts on the meat, excessive dirt, or leaves, grass, and other debris attached to the meat.</span></label></div>
    <div class="field"><label class="choice"><input type="checkbox" id="pickup" ${checkedAttr(c.pickup)}> <span>I agree to pick up my order within 3 days of being notified that it is ready. A $5 per-day late pickup charge applies after the 3-day period.</span></label></div>
    <div class="field"><label for="comments">Additional questions or comments (optional)</label><textarea id="comments" placeholder="Type any questions or special instructions here...">${esc(c.comments)}</textarea></div>
    <div class="note">The $15 extra-cleaning charge and any late pickup charges are not included in the estimate below because they depend on the condition of the deer and pickup timing.</div>
    ${summaryMarkup()}
  </div>`;
}
function summaryMarkup() {
  const totals = calculate();
  return `<div class="summary-card" style="margin-top:20px"><h3>Current order estimate</h3>
    ${totals.lines.map(l=>`<div class="summary-row"><span>${esc(l.label)}</span><strong>${money(l.amount)}</strong></div>`).join("")}
    <div class="summary-row"><span>Specialty products</span><strong>Calculated after weighing</strong></div>
    <div class="summary-row summary-total"><span>Known charges subtotal</span><strong>${money(totals.total)}</strong></div>
    <p class="small muted">This is an estimate of known charges, not a final invoice. Specialty meat is charged by the actual pound confirmed by the processor.</p>
  </div>`;
}
function calculate() {
  const lines=[]; let total=0;
  state.deer.forEach((d,i)=>{
    const base = Object.values(d.specialties).some(x=>x.selected) ? 75 : 95;
    lines.push({label:`Deer ${i+1} base processing`,amount:base}); total+=base;
    if(d.gutting){lines.push({label:`Deer ${i+1} gutting`,amount:25});total+=25;}
    if(d.caping){lines.push({label:`Deer ${i+1} caping`,amount:60});total+=60;}
    if(d.mount){lines.push({label:`Deer ${i+1} European mount`,amount:120});total+=120;}
    if(d.mount && d.board){lines.push({label:`Deer ${i+1} mount board`,amount:120});total+=120;}
  });
  return {lines,total};
}
function bindCurrentInputs() {
  const name=$("customer-name"), phone=$("customer-phone"), count=$("deer-count");
  if(name) name.addEventListener("input",()=>state.customer.name=name.value);
  if(phone) phone.addEventListener("input",()=>state.customer.phone=phone.value);
  if(count) count.addEventListener("change",()=>{
    const n=Number(count.value), old=state.deer.length;
    state.customer.count=n;
    while(state.deer.length<n) state.deer.push(newDeer());
    if(state.deer.length>n) state.deer=state.deer.slice(0,n);
  });
  if(state.step>0 && state.step<=state.deer.length) {
    const i=state.step-1,d=state.deer[i];
    const tag=$(`tag-${i}`); if(tag) tag.addEventListener("input",()=>d.tag=tag.value);
    content.querySelectorAll("[data-standard]").forEach(el=>el.addEventListener("change",()=>{
      const val=STANDARD[Number(el.dataset.standard)];
      d.standard=el.checked?[...d.standard.filter(x=>x!==val),val]:d.standard.filter(x=>x!==val);
    }));
    content.querySelectorAll("[data-special]").forEach(el=>el.addEventListener("change",()=>{
      const key=el.dataset.special;
      d.specialties[key]=d.specialties[key]||{selected:false,prefs:[""]};
      d.specialties[key].selected=el.checked;
      renderDeer(i); bindCurrentInputs();
    }));
    content.querySelectorAll("[data-flavor]").forEach(el=>el.addEventListener("change",()=>{
      const key=el.dataset.flavor, p=Number(el.dataset.pref);
      d.specialties[key].prefs[p]=el.value;
    }));
    content.querySelectorAll("[data-add-flavor]").forEach(el=>el.addEventListener("click",()=>{
      const key=el.dataset.addFlavor, prefs=d.specialties[key].prefs;
      if(prefs.length<3) prefs.push("");
      renderDeer(i); bindCurrentInputs();
    }));
    ["gutting","caping","mount","board"].forEach(k=>{
      const el=$(`${k}-${i}`);
      if(el) el.addEventListener("change",()=>{
        d[k]=el.checked;
        if(k==="mount") $(`board-wrap-${i}`).classList.toggle("hidden",!el.checked);
      });
    });
  }
  ["cash","clean","pickup"].forEach(k=>{
    const el=$(k); if(el) el.addEventListener("change",()=>state.customer[k]=el.checked);
  });
  const comments=$("comments"); if(comments) comments.addEventListener("input",()=>state.customer.comments=comments.value);
}
function validateStep() {
  const error = (msg) => {
    let e=$("step-error");
    if(!e){e=document.createElement("p");e.id="step-error";e.className="error";content.querySelector(".step-card").appendChild(e);}
    e.textContent=msg; return false;
  };
  const old=$("step-error"); if(old) old.remove();
  if(state.step===0) {
    if(!state.customer.name.trim()) return error("Please enter your name.");
    if(!state.customer.phone.trim()) return error("Please enter a phone number.");
    if(!state.customer.count || state.customer.count<1) return error("Please select the number of deer.");
    while(state.deer.length<state.customer.count) state.deer.push(newDeer());
    if(state.deer.length>state.customer.count) state.deer=state.deer.slice(0,state.customer.count);
  } else if(state.step<=state.deer.length) {
    const d=state.deer[state.step-1];
    const tag=$(`tag-${state.step-1}`);
    d.tag=tag?.value.trim()||"";
    if(!d.tag) return error("Please enter this deer's tag number.");
    for(const s of SPECIALTIES) {
      const data=d.specialties[s.key];
      if(data?.selected) {
        const chosen=data.prefs.filter(Boolean);
        if(chosen.length===0) return error(`Please choose at least one flavor preference for ${s.name}.`);
        const chosen=data.prefs.filter(Boolean);
        if(new Set(chosen).size!==chosen.length) return error(`Please choose different flavor preferences for ${s.name}.`);
      }
    }
  } else {
    if(!state.customer.cash) return error("Please acknowledge the cash payment requirement.");
    if(!state.customer.clean) return error("Please acknowledge the extra-cleaning policy.");
    if(!state.customer.pickup) return error("Please acknowledge the 3-day pickup policy.");
  }
  return true;
}
function showConfirmation() {
  const totals=calculate();
  const deerHtml=state.deer.map((d,i)=>{
    const specs=Object.entries(d.specialties).filter(([k,v])=>v.selected).map(([k,v])=>{
      const s=SPECIALTIES.find(x=>x.key===k);
      return `<li>${esc(s.name)} — ${v.prefs.filter(Boolean).map(esc).join(", ")||"Flavor to be confirmed"} ($${s.price}/lb)</li>`;
    }).join("");
    return `<div class="review-deer"><h3>Deer ${i+1} <span class="tag">Tag: ${esc(d.tag)}</span></h3>
      <p><strong>Base processing:</strong> ${Object.values(d.specialties).some(x=>x.selected)?"$75":"$95"}</p>
      <p><strong>Standard selections:</strong> ${d.standard.length?d.standard.map(esc).join(", "):"None selected"}</p>
      <p><strong>Specialty selections:</strong></p><ul class="compact">${specs||"<li>None selected</li>"}</ul>
      <p><strong>Additional services:</strong> ${[d.gutting?"Gutting ($25)":null,d.caping?"Caping ($60)":null,d.mount?"European mount ($120)":null,d.mount&&d.board?"Mount board (+$120)":null].filter(Boolean).join(", ")||"None"}</p>
    </div>`;
  }).join("");
  $("confirmation").innerHTML=`<div class="confirmation-card">
    <h2>Order review</h2><p class="muted">Please review this order with the customer or print a copy for the processor.</p>
    <p><strong>Customer:</strong> ${esc(state.customer.name)}<br><strong>Phone:</strong> ${esc(state.customer.phone)}<br><strong>Number of deer:</strong> ${state.deer.length}</p>
    ${deerHtml}
    <h3>Known charges subtotal: ${money(totals.total)}</h3>
    <p><strong>Specialty products:</strong> Charged by actual weight after weighing. Flavor quantities to be confirmed by phone.</p>
    <p><strong>Agreements:</strong> Cash payment acknowledged; extra-cleaning policy acknowledged; 3-day pickup policy acknowledged.</p>
    <p><strong>Comments:</strong> ${esc(state.customer.comments||"None")}</p>
    <div class="note">This is a demonstration order review. It has not been sent to the business. Connect a form submission service before accepting live orders.</div>
    <div class="form-nav"><button class="button secondary" id="edit-order" type="button">Edit order</button><button class="button primary" id="print-order" type="button">Print / Save as PDF</button></div>
  </div>`;
  app.classList.add("hidden"); $("confirmation").classList.remove("hidden");
  $("edit-order").addEventListener("click",()=>{$("confirmation").classList.add("hidden");app.classList.remove("hidden");state.step=steps().length-1;render();});
  $("print-order").addEventListener("click",()=>window.print());
}
