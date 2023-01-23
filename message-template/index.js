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

module.exports = { getPostReminderTemplate };
