const DateMode = {
  DDMMYYYY: "DDMMYYYY",
  YYYYMMDD: "YYYYMMDD",
};

const convertDate = (date, mode = DateMode.DDMMYYYY) => {
  const convertedDate = new Date(date);

  const deadlineDay = ("0" + convertedDate.getDate()).slice(-2);
  const deadlineMonth = ("0" + (convertedDate.getMonth() + 1)).slice(-2);
  const deadlineYear = convertedDate.getFullYear();

  const DateModes = {
    DDMMYYYY: `${deadlineDay}-${deadlineMonth}-${deadlineYear}`,
    YYYYMMDD: `${deadlineYear}-${deadlineMonth}-${deadlineDay}`,
  };

  return DateModes[mode];
};

const getPostReminderTemplate = (kolName, deadlineDate) => {
  const convertedDate = convertDate(new Date(deadlineDate));

  return `Hai, ${kolName}!\n\nJangan lupa, untuk upload post pada tanggal ${convertedDate}, ya!\n\nBest regards,\n*-Team Jiera-*`;
};

const getContractReminderTemplate = (payload) => {
  const { kolName, contractEndDate, missedPost, totalSlot, dateDifference } =
    payload;
  const convertedDate = convertDate(new Date(contractEndDate));

  return `Hai, ${kolName}!\n\nJangan lupa, untuk upload post yang berlum terpenuhi, ya! Kamu memiliki ${dateDifference} hari sebelum tanggal kontrakmu habis, yaitu tanggal ${convertedDate}.\n\nKamu masih memiliki *${missedPost}* slot post yang belum terupload dari total ${totalSlot} slot.\n\nBest regards,\n*-Team Jiera-*`;
};

const getBroadcastBriefTemplate = (payload) => {
  const { kolName, briefCode, theme, concept, reference, script} = payload;

  return `Hai, ${kolName}!\nBerikut ini merupakan Brief untuk post kamu selanjutnya, ya!\n\n*Brief Code:* ${briefCode}\n*Tema:* ${theme}\n\n*Concept:*\n${concept}\n\n*Referensi:*\n${reference}\n\n*Script:*\n${script}\n\nBest regards,\n*-Team Jiera-*`;
};

module.exports = { getPostReminderTemplate, getContractReminderTemplate, getBroadcastBriefTemplate };
