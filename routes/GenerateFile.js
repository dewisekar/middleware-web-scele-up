const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');

const generateFile = async (payload) => {
  const {
    ID, TAHUN, BULAN, DP_Percentage: dpPercentage
  } = payload;

  const fileNameDocx = `${ID}_PKS.WMC_${BULAN}_${TAHUN}.docx`;
  const fileNamePdf = `${ID}_PKS.WMC_${BULAN}_${TAHUN}.pdf`;

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
  const pathFilePdf = path.join(__dirname, `../docfiles/${fileNamePdf}`);

  // write docx
  fs.writeFileSync(pathFileDocx, buf);

  //   const docxBuf = await fs.readFile(pathFileDocx);
  //   const pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
  //   await fs.writeFile(pathFilePdf, pdfBuf);
};

module.exports = { generateFile };
