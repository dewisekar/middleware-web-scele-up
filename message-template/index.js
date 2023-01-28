const { convertDate } = require('../utils');

const getPostReminderTemplate = (kolName, deadlineDate) => {
  const convertedDate = convertDate(new Date(deadlineDate));

  return `Hai Kak, ${kolName}!\n\nJangan lupa, untuk upload post pada tanggal ${convertedDate}, ya!\n\nBest regards,\n*-Team Jiera Official-*`;
};

const getContractReminderTemplate = (payload) => {
  const {
    kolName, contractEndDate, missedPost, totalSlot, dateDifference
  } = payload;
  const convertedDate = convertDate(new Date(contractEndDate));

  return `Hai Kak, ${kolName}!\n\nJangan lupa, untuk upload post yang berlum terpenuhi, ya! Kamu memiliki ${dateDifference} hari sebelum tanggal kontrakmu habis, yaitu tanggal ${convertedDate}.\n\nKamu masih memiliki *${missedPost}* slot post yang belum terupload dari total ${totalSlot} slot.\n\nBest regards,\n*-Team Jiera Official-*`;
};

const getBroadcastBriefTemplate = (payload) => {
  const {
    kolName, briefCode, theme, concept, reference, script
  } = payload;

  return `Hai Kak, ${kolName}!\nBerikut ini merupakan Brief untuk post kamu selanjutnya, ya!\n\n*Brief Code:* ${briefCode}\n*Tema:* ${theme}\n\n*Concept:*\n${concept}\n\n*Referensi:*\n${reference}\n\n*Script:*\n${script}\n\nBest regards,\n*-Team Jiera Official-*`;
};

const getInvoiceReminderTemplate = (kolName) => `Hai Kak, ${kolName}!\n\nJangan lupa, untuk segera kirim invoice penagihan ke Jiera Manager kamu, ya!\n\nBest regards,\n*-Team Jiera Official-*`;

module.exports = {
  getPostReminderTemplate,
  getContractReminderTemplate,
  getBroadcastBriefTemplate,
  getInvoiceReminderTemplate
};
