(function(){
  "use strict";

  var I18N = {
    en:{
      htmlLang:"en",
      audience:"Patient view",
      language:"Language",
      accessibility:"Accessibility",
      largeText:"Large text",
      highContrast:"High contrast",
      packageLeaflet:"Package leaflet: Information for the patient",
      readNote:"Read all of this leaflet carefully before you start taking this medicine.",
      conceptTag:"One structured source → many presentations",
      conceptLine:"One dataset · four languages · accessible — the same FHIR ePI, re-rendered on demand. Impossible on one printed paper insert.",
      banner:"In production, fully localised body text is supplied per language from the same structured ePI. Below, section headings translate live while sample body text is shown in English.",
      sections:{
        1:"What PAXLOVID is and what it is used for",
        2:"What you need to know before you take PAXLOVID",
        3:"How to take PAXLOVID",
        4:"Possible side effects",
        5:"How to store PAXLOVID",
        6:"Contents of the pack and other information"
      }
    },
    zh:{
      htmlLang:"zh",
      audience:"患者视图",
      language:"语言",
      accessibility:"无障碍",
      largeText:"大字体",
      highContrast:"高对比度",
      packageLeaflet:"包装说明书：患者须知",
      readNote:"在开始服用此药物之前，请仔细阅读本说明书的全部内容。",
      conceptTag:"一个结构化数据源 → 多种呈现方式",
      conceptLine:"一份数据 · 四种语言 · 无障碍 —— 同一份 FHIR ePI，按需重新呈现。这在一张印刷纸质说明书上是不可能实现的。",
      banner:"在实际应用中，完整的本地化正文将从同一结构化 ePI 中按语言提供。下方的章节标题会即时翻译，而示例正文以英文显示。",
      sections:{
        1:"PAXLOVID 是什么以及它的用途",
        2:"服用 PAXLOVID 之前您需要了解的信息",
        3:"如何服用 PAXLOVID",
        4:"可能的副作用",
        5:"如何储存 PAXLOVID",
        6:"包装内容物及其他信息"
      }
    },
    ms:{
      htmlLang:"ms",
      audience:"Paparan pesakit",
      language:"Bahasa",
      accessibility:"Kebolehcapaian",
      largeText:"Teks besar",
      highContrast:"Kontras tinggi",
      packageLeaflet:"Risalah pakej: Maklumat untuk pesakit",
      readNote:"Baca semua risalah ini dengan teliti sebelum anda mula mengambil ubat ini.",
      conceptTag:"Satu sumber berstruktur → banyak persembahan",
      conceptLine:"Satu set data · empat bahasa · boleh diakses — ePI FHIR yang sama, dipaparkan semula atas permintaan. Mustahil pada satu risalah kertas bercetak.",
      banner:"Dalam pengeluaran, teks badan yang dilokalkan sepenuhnya dibekalkan mengikut bahasa daripada ePI berstruktur yang sama. Di bawah, tajuk bahagian diterjemahkan secara langsung manakala teks badan contoh dipaparkan dalam bahasa Inggeris.",
      sections:{
        1:"Apakah PAXLOVID dan untuk apa ia digunakan",
        2:"Apa yang anda perlu tahu sebelum anda mengambil PAXLOVID",
        3:"Bagaimana untuk mengambil PAXLOVID",
        4:"Kesan sampingan yang mungkin berlaku",
        5:"Bagaimana untuk menyimpan PAXLOVID",
        6:"Kandungan pek dan maklumat lain"
      }
    },
    ta:{
      htmlLang:"ta",
      audience:"நோயாளி பார்வை",
      language:"மொழி",
      accessibility:"அணுகல்தன்மை",
      largeText:"பெரிய எழுத்து",
      highContrast:"அதிக மாறுபாடு",
      packageLeaflet:"பொதி சிற்றேடு: நோயாளிக்கான தகவல்",
      readNote:"இந்த மருந்தை எடுத்துக்கொள்ளத் தொடங்கும் முன், இந்த சிறு அறிக்கை முழுவதையும் கவனமாகப் படியுங்கள்.",
      conceptTag:"ஒரே கட்டமைக்கப்பட்ட மூலம் → பல வழங்கல்கள்",
      conceptLine:"ஒரே தரவுத்தொகுப்பு · நான்கு மொழிகள் · அணுகக்கூடியது — அதே FHIR ePI, தேவைக்கேற்ப மீண்டும் வழங்கப்படுகிறது. அச்சிடப்பட்ட ஒரு தாள் சிற்றேட்டில் இது சாத்தியமில்லை.",
      banner:"உற்பத்தியில், முழுமையாக உள்ளூர்மயமாக்கப்பட்ட உரை ஒவ்வொரு மொழிக்கும் அதே கட்டமைக்கப்பட்ட ePI-யிலிருந்து வழங்கப்படுகிறது. கீழே, பிரிவுத் தலைப்புகள் நேரலையில் மொழிபெயர்க்கப்படுகின்றன, மாதிரி உரை ஆங்கிலத்தில் காட்டப்படுகிறது.",
      sections:{
        1:"PAXLOVID என்றால் என்ன, அது எதற்காகப் பயன்படுத்தப்படுகிறது",
        2:"PAXLOVID எடுத்துக்கொள்வதற்கு முன் நீங்கள் அறிந்திருக்க வேண்டியவை",
        3:"PAXLOVID எவ்வாறு எடுத்துக்கொள்வது",
        4:"ஏற்படக்கூடிய பக்கவிளைவுகள்",
        5:"PAXLOVID எவ்வாறு சேமித்து வைப்பது",
        6:"பொதியின் உள்ளடக்கம் மற்றும் பிற தகவல்கள்"
      }
    }
  };

  var state = { lang:"en", large:false, hc:false };

  var htmlEl = document.documentElement;
  var langButtons = Array.prototype.slice.call(document.querySelectorAll(".langbtn"));

  function $(id){ return document.getElementById(id); }

  function applyLanguage(lang){
    var t = I18N[lang]; if(!t) return;
    state.lang = lang;
    htmlEl.setAttribute("lang", t.htmlLang);

    $("tag-audience").textContent = t.audience;
    $("lbl-language").textContent = t.language;
    $("lbl-access").textContent = t.accessibility;
    $("txt-large").textContent = t.largeText;
    $("txt-contrast").textContent = t.highContrast;
    $("txt-packageleaflet").textContent = t.packageLeaflet;
    $("txt-readnote").textContent = t.readNote;
    $("concept-tag").textContent = t.conceptTag;
    $("concept-line").textContent = t.conceptLine;
    $("txt-banner").textContent = t.banner;

    // translated section headings inherit the chosen language (no lang attr)
    var titles = document.querySelectorAll(".sec-title[data-sec]");
    for(var i=0;i<titles.length;i++){
      var n = titles[i].getAttribute("data-sec");
      titles[i].textContent = t.sections[n];
    }

    langButtons.forEach(function(b){
      b.setAttribute("aria-pressed", b.getAttribute("data-lang")===lang ? "true":"false");
    });
  }

  langButtons.forEach(function(b){
    b.addEventListener("click", function(){ applyLanguage(b.getAttribute("data-lang")); });
  });

  // accessibility toggles
  var btnLarge = $("btn-large");
  var btnContrast = $("btn-contrast");

  btnLarge.addEventListener("click", function(){
    state.large = !state.large;
    htmlEl.classList.toggle("large", state.large);
    btnLarge.setAttribute("aria-pressed", state.large ? "true":"false");
  });
  btnContrast.addEventListener("click", function(){
    state.hc = !state.hc;
    htmlEl.classList.toggle("hc", state.hc);
    btnContrast.setAttribute("aria-pressed", state.hc ? "true":"false");
  });

  applyLanguage("en");
})();
