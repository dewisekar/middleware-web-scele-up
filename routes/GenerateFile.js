const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

const generateFile = async (payload) => {
  const { ID, TAHUN, BULAN, DP_Percentage } = payload;

  const fileName = `${ID}_PKS.WMC_${BULAN}_${TAHUN}.docx`;

  const template = DP_Percentage === '100%' ? "../template_full.docx" : "../template.docx"
  const content = fs.readFileSync(
    path.resolve(__dirname, template),
    "binary"
  );
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(payload);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  const pathFile = path.join(__dirname, "../docfiles/"+fileName)

  fs.writeFileSync(pathFile, buf);
};

module.exports = { generateFile };
