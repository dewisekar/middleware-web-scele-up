const DateMode = {
  DDMMYYYY: 'DDMMYYYY',
  YYYYMMDD: 'YYYYMMDD',
  DDMMYYYY_INDONESIAN: 'DDMMYYYY_INDONESIAN',
  DDDDMMYYY_INDONESIAN: 'DDDDMMYYY_INDONESIAN'
};

const Months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];
const Days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const convertDate = (date, mode = DateMode.DDMMYYYY) => {
  const convertedDate = new Date(date);
  console.log(convertedDate);

  const month = convertedDate.getMonth();
  const day = convertedDate.getDay();
  const deadlineDay = (`0${convertedDate.getDate()}`).slice(-2);
  const deadlineMonth = (`0${month + 1}`).slice(-2);
  const deadlineYear = convertedDate.getFullYear();

  const DateModes = {
    DDMMYYYY: `${deadlineDay}-${deadlineMonth}-${deadlineYear}`,
    YYYYMMDD: `${deadlineYear}-${deadlineMonth}-${deadlineDay}`,
    DDMMYYYY_INDONESIAN: `${deadlineDay} ${Months[month]}  ${deadlineYear}`,
    DDDDMMYYY_INDONESIAN: `${Days[day]},  ${deadlineDay} ${Months[month]} ${deadlineYear}`
  };

  return DateModes[mode];
};

const convertToIdr = (balance) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
}).format(balance);

module.exports = { convertDate, DateMode, convertToIdr };
