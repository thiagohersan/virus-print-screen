const fs = require('fs');
const YAML = require('yaml');

const removeAccent = {
  'A': 'A',
  'À': 'A',
  'Á': 'A',
  'Â': 'A',
  'Ã': 'A',
  'Ä': 'A',
  'G': 'G',
  'C': 'C',
  'U': 'U',
  'Ù': 'U',
  'Ú': 'U',
  'Û': 'U',
  'Ü': 'U',
  'a': 'a',
  'à': 'a',
  'á': 'a',
  'â': 'a',
  'ã': 'a',
  'ä': 'a',
  'g': 'g',
  'c': 'c',
  'u': 'u',
  'ù': 'u',
  'ú': 'u',
  'û': 'u',
  'ü': 'u'
};

function encaseLetter(L) {
  return `<span class="agcu-${removeAccent[L]}">${L}</span>`;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
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

    for(let i = 0; i < words.length; i++) {
      const mword = words[i];

      if(!(mword.includes('<a') ||
           mword.includes('class') ||
           mword.includes('<br>') ||
           mword.includes('target=') ||
           mword.includes('</a>') ||
           mword.includes('<i') ||
           mword.includes('</i>') ||
           mword.includes('href=')
          )) {

        if (/[AÀÁÂÃÄGCUÙÚÛÜaàáâãägcuùúûü]/.test(mword) && !(mword in uniqueWords)) {
          uniqueWords[mword] = mword.replace(/([AÀÁÂÃÄGCUÙÚÛÜaàáâãägcuùúûü])/g, encaseLetter);
          const re = new RegExp(` ${escapeRegExp(mword)} `, 'g');
          jsonObj = jsonObj.replace(re, ` ${uniqueWords[mword]} `);
        }
      }
    }
    jsonObj = jsonObj.trim();
    return jsonObj;
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
