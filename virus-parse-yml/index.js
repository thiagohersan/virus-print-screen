const fs = require('fs');
const YAML = require('yaml');

const removeAccentAndLower = {
  'A': 'a',
  'À': 'a',
  'Á': 'a',
  'Â': 'a',
  'Ã': 'a',
  'Ä': 'a',
  'G': 'g',
  'C': 'c',
  'Ç': 'c',
  'U': 'u',
  'Ù': 'u',
  'Ú': 'u',
  'Û': 'u',
  'Ü': 'u',
  'a': 'a',
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'g': 'g',
  'c': 'c',
  'ç': 'c',
  'u': 'u',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u'
};

function encaseLetter(L) {
  return `<span class="agcu-${removeAccentAndLower[L]}">${L}</span>`;
}

function traverse(jsonObj) {
  if(jsonObj !== null && typeof jsonObj == 'object') {
    const subObj = {};
    Object.entries(jsonObj).forEach(([key, value]) => {
      subObj[key]= traverse(value);
    });
    return subObj;
  } else {
    jsonObj = ' ' + jsonObj + ' ';
    const words = jsonObj.replace(/</g, ' <').replace(/>/g, '> ').split(' ');
    const newPhrase = [];

    for(let i = 0; i < words.length; i++) {
      const mword = words[i];
      let nword = mword;

      if(!(mword.includes('<a') ||
           mword.includes('class') ||
           mword.includes('<br>') ||
           mword.includes('target=') ||
           mword.includes('</a>') ||
           mword.includes('<i') ||
           mword.includes('</i>') ||
           mword.includes('href=')
          )) {

        if(mword in uniqueWords) {
          nword = uniqueWords[mword];
        } else if (/[AÀÁÂÃÄGCÇUÙÚÛÜaàáâãägcçuùúûü]/.test(mword) && !(mword in uniqueWords)) {
          uniqueWords[mword] = mword.replace(/([AÀÁÂÃÄGCÇUÙÚÛÜaàáâãägcçuùúûü])/g, encaseLetter);
          nword = uniqueWords[mword];
          console.log(mword + '   ' + uniqueWords[mword] + '\n');
        }
      }
      newPhrase.push(nword);
    }
    return newPhrase.join(' ').trim();
  }
}

//const location = '../../virus-19/_data/';
//const files = ['embody', 'flux', 'frame', 'home'];

const location = './';
const files = ['test'];

const uniqueWords = {};

files.forEach((fname) => {
  const mfile = fs.readFileSync(`${location}${fname}.yml`, 'utf8');
  const myml = YAML.parse(mfile);
  const nyml = traverse(myml);
  //console.log(nyml);
  fs.writeFileSync(`${location}${fname}.agcu.yml`, YAML.stringify(nyml), 'utf8');
});
