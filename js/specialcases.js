// Armenian vowels (single letters)
export const VOWELS = ['ա','ե','է','ը','ի','ո','օ'];

// initial ե > ye barring some exceptions
export function handleInitialYe(word, i) {
  if (['եմ', 'ենք', 'են'].includes(word)) {
    return { prefix: '', nextIndex: i };
  }
  if (i === 0 && word[i] === 'ե') {
    const next = word[i+1] || '';
    return {
      prefix: VOWELS.includes(next) ? 'y' : 'ye',
      nextIndex: 1
    };
  }
  return { prefix: '', nextIndex: i }
}

// initial ե + vowel > y + vowel
export function handleInitialYeVowel(word, i) {
  const next = word[i+1] || '';
  if (i === 0 && word[i] === 'ե' && VOWELS.includes(next)) {
    return { prefix: 'y', nextIndex: 1 }
  }
  return { prefix: '', nextIndex: i }
}

// initial ո > vo
export function handleInitialVo(word, i) {
  const next = word[i+1] || '';
  if (i === 0 && word[i] === 'ո' && next !== 'ւ' && next !== 'յ') {
    return { prefix: 'vo', nextIndex: 1 };
  }
  return { prefix: '', nextIndex: i };
}

// և > yev
export function handleYev(word, i) {
  if (word === 'և') {
    return { prefix: 'yev', nextIndex: 1 }
  }
  return { prefix: '', nextIndex: i };
}

// medial ե + vowel > i + vowel
export function handleMedialYeVowel(word, i) {
  if (i > 0 && word[i] === 'ե') {
    const next = word[i+1] || '';
    if (VOWELS.includes(next)) {
      return { prefix: 'i', nextIndex: i + 1 };
    }
  }
  return { prefix: '', nextIndex: i };
}

// initial յ > h
export function handleInitialYi(word, i) {
  if (i === 0 && word[i] === 'յ') {
    return { prefix: 'h', nextIndex: 1 };
  }
  return { prefix: '', nextIndex: i };
}

// initial իւ + consonant > yu + consonant
// medial իւ + consonant > iu + consonant
export function handleIu(word, i) {
  if (word.slice(i, i+2) === 'իւ') {
    const next  = word[i+2] || '';
    const atEnd = i+2 === word.length;
    if (atEnd || VOWELS.includes(next)) {
      return { prefix: 'i', nextIndex: i+1 };
    } else {
      return { prefix: i===0 ? 'yu' : 'iu', nextIndex: i+2 };
    }
  }
  return { prefix: '', nextIndex: i };
}

// ու + vowel > v + vowel
export function handleUVowel(word, i) {
  if (word.slice(i, i+2) === 'ու') {
    const next = word[i+2] || '';
    return { prefix: VOWELS.includes(next) ? 'v' : 'u', nextIndex: i+2 };
  }
  return { prefix: '', nextIndex: i };
}

// յե + vowel > y + vowel
export function handleYieVowel(word, i) {
  const next = word[i+2] || '';
  if (word.slice(i, i+2) === 'յե' && VOWELS.includes(next)) {
    return { prefix: 'y', nextIndex: i+2 };
  }
  return { prefix: '', nextIndex: i };
}

// ոյ + vowel > oya
// ոյ + consonant > uy
// final ոյ > o barring exceptions
const OY_EXCEPTIONS = ['խոյ','նոյ'];
export function handleOy(word, i) {
  if (word.slice(i, i+2) === 'ոյ') {
    const lower = word.toLowerCase();
    if (OY_EXCEPTIONS.includes(lower)) {
      return { prefix: 'oy', nextIndex: i+2 };
    }
    const next = word[i+2] || '';
    if (!next)             return { prefix: 'o',  nextIndex: i+2 };
    if (next === 'ե') return { prefix: 'oy', nextIndex: i+3 };
    if (VOWELS.includes(next)) return { prefix: 'oy', nextIndex: i+2 };
    return { prefix: 'uy', nextIndex: i+2 };
  }
  return { prefix: '', nextIndex: i };
}

// final այ > a barring exceptions
const AY_EXCEPTIONS = [
  'վայ','ճայ','բայ','մակբայ','չայ','նանայ',
  'օհայ','օխայ','հարայ','սամուրայ','սարայ','արայ'
];
function isHayCompound(word) { return word.endsWith('հայ'); }

export function handleAyFinal(word, i) {
  if (word.slice(i, i+2) === 'այ') {
    const next = word[i+2];
    if (!next || !/[ա-ֆ]/.test(next)) {
      const base = word.toLowerCase();
      if (AY_EXCEPTIONS.includes(base) || isHayCompound(base)) {
        return { prefix: 'ay', nextIndex: i+2 };
      }
      return { prefix: 'a', nextIndex: i+2 };
    }
  }
  return { prefix: '', nextIndex: i };
}