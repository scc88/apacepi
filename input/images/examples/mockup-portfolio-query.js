(function(){
  "use strict";

  // Attribute keys: lactose, renal, sjw (contraindicated w/ St John's Wort),
  // warfarin (interaction), cyp3a (contains a CYP3A inhibitor).
  // severity: 'crit' for contraindication (SJW), 'warn' for caution interactions/renal, else neutral.
  var PRODUCTS = [
    {
      name:"PAXLOVID", real:true,
      generic:"nirmatrelvir 150 mg + ritonavir 100 mg", ma:"SIN-PAXH-0126",
      attrs:{lactose:true, renal:true, sjw:true, warfarin:true, cyp3a:true}
    },
    {
      name:"Rivavox", generic:"riboxetine 40 mg (fictional)", ma:"SIN-DEMO-2011",
      attrs:{lactose:true, renal:false, sjw:false, warfarin:true, cyp3a:false}
    },
    {
      name:"Nephrocor XR", generic:"telmasoran 25 mg (fictional)", ma:"SIN-DEMO-2042",
      attrs:{lactose:false, renal:true, sjw:false, warfarin:false, cyp3a:false}
    },
    {
      name:"Cardiluma", generic:"amlofelodine 10 mg (fictional)", ma:"SIN-DEMO-2073",
      attrs:{lactose:false, renal:false, sjw:true, warfarin:false, cyp3a:true}
    },
    {
      name:"Gastroprin", generic:"omezoline 20 mg (fictional)", ma:"SIN-DEMO-2098",
      attrs:{lactose:true, renal:false, sjw:false, warfarin:false, cyp3a:false}
    },
    {
      name:"Immunograft", generic:"cyclosarin 50 mg (fictional)", ma:"SIN-DEMO-2115",
      attrs:{lactose:false, renal:true, sjw:true, warfarin:true, cyp3a:true}
    }
  ];

  // Attribute display metadata (order matters for chips)
  var ATTR_META = [
    {key:"lactose",  label:"Contains lactose",  sev:null},
    {key:"renal",    label:"Renal dose adj.",   sev:"warn"},
    {key:"sjw",      label:"Contraindicated w/ St John's Wort", sev:"crit"},
    {key:"warfarin", label:"Interacts w/ warfarin", sev:"warn"},
    {key:"cyp3a",    label:"Contains CYP3A inhibitor", sev:null}
  ];

  var QUERIES = {
    all:      {title:"All products", note:"Every product in the illustrative portfolio, with its structured safety attributes.", key:null},
    sjw:      {title:"Contraindicated with St John's Wort", note:"Products whose ePI carries a ClinicalUseDefinition contraindication against St John's Wort (herbal / depression). Critical tier.", key:"sjw"},
    renal:    {title:"Needs renal dose adjustment", note:"Products whose ePI specifies dose changes by kidney function (eGFR bands).", key:"renal"},
    lactose:  {title:"Contains lactose", note:"Products whose Ingredient / SubstanceDefinition resources include lactose — relevant to sugar-intolerant patients.", key:"lactose"},
    warfarin: {title:"Interacts with warfarin", note:"Products with a ClinicalUseDefinition interaction against warfarin (e.g. monitor INR). Warning tier.", key:"warfarin"},
    cyp3a:    {title:"Contains a CYP3A inhibitor", note:"Products whose formulation includes a CYP3A enzyme inhibitor — a driver of many interaction alerts.", key:"cyp3a"}
  };

  var rowsEl   = document.getElementById("rows");
  var titleEl  = document.getElementById("query-title");
  var countEl  = document.getElementById("query-count");
  var noteEl   = document.getElementById("query-note");
  var emptyEl  = document.getElementById("empty");
  var btns     = Array.prototype.slice.call(document.querySelectorAll(".qbtn"));

  function chipFor(meta, product, activeKey){
    var on = product.attrs[meta.key];
    var cls = "chip";
    if(meta.sev) cls += " " + meta.sev;
    if(on){
      cls += " on";
      if(activeKey === meta.key) cls += " hit";
    }
    var mark = on ? "" : "";
    // Build node
    var span = document.createElement("span");
    span.className = cls;
    span.textContent = (on ? "✓ " : "– ") + meta.label;
    if(activeKey === meta.key && on){
      span.setAttribute("aria-current","true");
    }
    return span;
  }

  function buildRow(p){
    var tr = document.createElement("tr");
    tr.dataset.name = p.name;

    // product cell
    var tdP = document.createElement("td");
    var strong = document.createElement("span");
    strong.className = "prod";
    strong.textContent = p.name;
    var badge = document.createElement("span");
    badge.className = p.real ? "real-badge" : "fic-badge";
    badge.textContent = p.real ? "Real" : "Fictional";
    strong.appendChild(badge);
    var sub = document.createElement("span");
    sub.className = "sub2";
    sub.textContent = p.generic;
    tdP.appendChild(strong);
    tdP.appendChild(sub);

    // marketing auth
    var tdMa = document.createElement("td");
    var ma = document.createElement("span");
    ma.className = "ma";
    ma.textContent = p.ma;
    tdMa.appendChild(ma);

    // attributes
    var tdA = document.createElement("td");
    var wrap = document.createElement("div");
    wrap.className = "attrs";
    tdA.appendChild(wrap);

    tr.appendChild(tdP);
    tr.appendChild(tdMa);
    tr.appendChild(tdA);
    return tr;
  }

  // pre-build all rows once
  var rowMap = {};
  PRODUCTS.forEach(function(p){
    var tr = buildRow(p);
    rowMap[p.name] = tr;
    rowsEl.appendChild(tr);
  });

  function render(q){
    var def = QUERIES[q] || QUERIES.all;
    var activeKey = def.key;
    var shown = 0;

    PRODUCTS.forEach(function(p){
      var tr = rowMap[p.name];
      var isMatch = activeKey === null ? true : !!p.attrs[activeKey];

      // rebuild chips (to update hit state)
      var wrap = tr.querySelector(".attrs");
      wrap.innerHTML = "";
      ATTR_META.forEach(function(meta){
        wrap.appendChild(chipFor(meta, p, activeKey));
      });

      if(isMatch){
        tr.classList.remove("hidden");
        if(activeKey !== null) tr.classList.add("match"); else tr.classList.remove("match");
        shown++;
      }else{
        tr.classList.add("hidden");
        tr.classList.remove("match");
      }
    });

    titleEl.textContent = def.title;
    if(activeKey === null){
      countEl.textContent = shown + " of " + PRODUCTS.length + " products shown";
    }else{
      countEl.textContent = shown + " of " + PRODUCTS.length + " products match";
    }
    noteEl.textContent = def.note;
    emptyEl.hidden = shown !== 0;

    btns.forEach(function(b){
      b.setAttribute("aria-pressed", b.dataset.q === q ? "true" : "false");
    });
  }

  btns.forEach(function(b){
    b.addEventListener("click", function(){
      render(b.dataset.q);
    });
  });

  render("all");
})();
