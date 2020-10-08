const fs = require('fs');
const resizeImg = require('resize-img');


const pathIn = '../../virus-19/media/images/flood/';
const pathOut = '../../virus-19/media/images-low/flood/';

async function resize(fname) {
  const imageSmall = await resizeImg(fs.readFileSync(pathIn + fname), {
    width: 85,
    height: 52
  });

  const imageLarge = await resizeImg(imageSmall, {
    width: 1280,
    height: 790
  });

  fs.writeFileSync(pathOut + fname, imageLarge);
}


fs.readdirSync(pathIn).forEach(fname => {
  if(fname.includes('00.jpg')) console.log(fname);
  resize(fname);
});
