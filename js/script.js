import {
  handleInitialYe, handleInitialYeVowel, handleInitialVo,
  handleYev, handleMedialYeVowel, handleInitialYi,
  handleIu, handleUVowel, handleYieVowel, handleOy,
  handleAyFinal
} from './specialcases.js';

Promise.all([
  fetch('js/hmb.json').then(r => r.json()),
  fetch('js/colloquial_ea.json').then(r => r.json()),
  fetch('js/colloquial_wa.json').then(r => r.json()),
  fetch('js/haya.json').then(r => r.json())
])
.then(([hmbData, colloquialEAData, colloquialWAData, hayaData]) => {

  const initialRules = {
    hmb:    [ ],
    colloquial_ea:[ handleInitialYe, handleInitialYeVowel, 
                    handleInitialVo, handleYev, handleInitialYi ],
    colloquial_wa:[ handleInitialYe, handleInitialYeVowel, 
                    handleInitialVo, handleYev, handleInitialYi ],
    haya:         [ handleInitialYe, handleInitialYeVowel, 
                    handleInitialVo, handleYev, handleInitialYi ]
  };

  const midRules = {
    hmb:    [ ],
    colloquial_ea:[
      handleMedialYeVowel, handleIu, handleUVowel, 
      handleYieVowel, handleOy, handleAyFinal
    ],
    colloquial_wa:[
      handleMedialYeVowel, handleIu, handleUVowel, 
      handleYieVowel, handleOy, handleAyFinal
    ],
    haya:         [
      handleIu, handleUVowel, handleYieVowel, handleOy, handleAyFinal
    ]
  };

  const dataMap = {
    hmb: hmbData,
    colloquial_ea: colloquialEAData,
    colloquial_wa: colloquialWAData,
    haya: hayaData
  };

  function applyCasing(original, translit) {
    if (original === original.toUpperCase()) return translit.toUpperCase();
    if (original[0] === original[0].toUpperCase()) {
      return translit.charAt(0).toUpperCase() + translit.slice(1);
    }
    return translit;
  }

  function transliterate(text, system) {
    const data = dataMap[system];

    // 1) JSON multi‐letter specials
    for (let [k,v] of Object.entries(data.specialCases)) {
      text = text.replace(new RegExp(k, 'g'), v);
    }

    // 2) split tokens (words + punctuation)
    const tokens = text.split(/(\s+|[.,!?;:"'«»()\[\]{}])/g);

    // 3) transliterate each Armenian token
    return tokens.map(tok => {
      if (!/[Ա-ֆա-և]/.test(tok)) return tok;

      let w = tok.toLowerCase(), res = '', i = 0;

      // initial
      for (let fn of initialRules[system]) {
        const o = fn(w, i);
        if (o.prefix) { res += o.prefix; i = o.nextIndex; }
      }

      // mid + final
      while (i < w.length) {
        let matched = false;

        for (let fn of midRules[system]) {
          const o = fn(w, i);
          if (o.prefix) {
            res += o.prefix;
            i = o.nextIndex;
            matched = true;
            break;
          }
        }

        if (!matched) {
          const pair = w[i] + (w[i+1] || '');
          if (data.map[pair]) {
            res += data.map[pair];
            i += 2;
          } else if (data.map[w[i]]) {
            res += data.map[w[i]];
            i += 1;
          } else {
            res += w[i++];
          }
        }
      }

      return applyCasing(tok, res);
    }).join('');
  }

  document.getElementById('convert-btn')
    .addEventListener('click', () => {
      const txt = document.getElementById('input').value;
      const sys = document.getElementById('system').value;
      document.getElementById('output').textContent =
        transliterate(txt, sys);
    });
})
.catch(console.error);