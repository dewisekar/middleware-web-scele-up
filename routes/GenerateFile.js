const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

const generateFile = async (payload) => {
  const {
    ID, TAHUN, BULAN, DP_Percentage: dpPercentage
  } = payload;

  const fileNameDocx = `${ID}_PKS.WMC_${BULAN}_${TAHUN}.docx`;

  const template = dpPercentage === '100%' ? '../template_full.docx' : '../template.docx';
  const content = fs.readFileSync(path.resolve(__dirname, template), 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  });

  doc.render(payload);

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });

  const pathFileDocx = path.join(__dirname, `../docfiles/${fileNameDocx}`);

  await fs.writeFileSync(pathFileDocx, buf);

  return pathFileDocx;
};

module.exports = { generateFile };
