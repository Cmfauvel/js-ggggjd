// Write Javascript code!
var moment = require('moment'); // require
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

const workingDay = (date) => {
  let days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const day = days[date.day()];
  console.log(day);
  if (day !== 'SA' && day !== 'SU') {
    return true;
  } else {
    return false;
  }
};

const getEtpByDateAndPerson = (contentieuxId, now, listUsers) => {
  let etp = 0;
  listUsers.forEach((user) => {
    if (user.contentieux === contentieuxId) {
      console.log(user);
      etp++;
    }
  });

  const situation = now;
  return { etp, situation };
};

const getETPMagistrat = (
  listUsers,
  contentieuxId,
  categories,
  dateStart,
  dateStop
) => {
  console.log('DATA === ', contentieuxId, dateStart, dateStop);
  const list = new Object();

  categories = [
    { id: 1, label: 'magistrat' },
    { id: 2, label: 'greffier' },
  ];

  categories.map((c) => {
    list[c.id] = new Object({
      etpt: 0,
      indispo: 0,
      reelEtp: 0,
      ...c,
    });
  });

  let now = moment(dateStart);
  const end = moment(dateStop);

  let nbDay = 0;

  console.log('dates === ', now, dateStop, end);

  do {
    // only working day

    if (workingDay(now)) {
      // is true if is monday, tuesday, wednesday, thursday, friday

      nbDay++;

      const { etp, situation } = getEtpByDateAndPerson(
        contentieuxId,
        now,
        listUsers
      ); // retourne la sommes des situation de la liste des personnes à un contentieux id donnée et une date donnée
      console.log('result of getEtpByDateAndPerson === ', etp, situation);

      if (situation && etp !== null) {
        console.log(etp);
        list[1].etpt += etp;
      }
    }
    console.log(now <= end);
    now = moment(now).add(1, 'days');
    console.log('NOW +1 ===', now);
  } while (moment(dateStart).isBefore(dateStop));

  if (nbDay === 0) {
    nbDay = -1;
  }

  // format render

  for (const property in list) {
    console.log('property', property, list[property].etpt, nbDay);
    list[property].reelEtp = list[property].etpt / nbDay;

    list[property].indispo = list[property].indispo / nbDay;
  }

  return list;
};

const listUsers = [
  {
    nom: 'Magistrat 1',
    situation: 'Situation 1',
    dateStart: '01/01/2022',
    dateStop: '30/01/2022',
    contentieux: 'c1',
    etp: 1,
  },
  {
    nom: 'Magistrat 1',
    situation: 'Situation 2',
    dateStart: '01/02/2022',
    dateStop: '15/02/2022',
    contentieux: 'c2',
    etp: 1,
  },
  {
    nom: 'Magistrat 2',
    situation: 'Situation 3',
    dateStart: '01/01/2022',
    dateStop: '30/06/2022',
    contentieux: 'c1',
    etp: 0.75,
  },
  {
    nom: 'Magistrat 3',
    situation: 'Situation 4',
    dateStart: '01/01/2022',
    dateStop: '31/12/2022',
    contentieux: 'c1',
    etp: 0.5,
  },
  {
    nom: 'Magistrat 4',
    situation: 'Situation 5',
    dateStart: '01/01/2022',
    dateStop: '31/12/2022',
    contentieux: 'c2',
    etp: 1,
  },
];

let list = getETPMagistrat(listUsers, 'c1', [], '2022-01-01', '2022-01-31');
console.log('1 ----------------------------------');
console.log(list);

list = {
  1: {
    etpt: 1,
    indispo: 0,
    reelEtp: 0,
    id: 1,
    label: 'magistrat',
  },
  2: {
    etpt: 0,
    indispo: 0,
    reelEtp: 0,
    id: 2,
    label: 'greffier',
  },
};

list = getETPMagistrat(listUsers, [], 'c1', '2022-01-01', '2022-12-31');
console.log('2 ----------------------------------');
console.log(list);

list = getETPMagistrat(listUsers, [], 'c1', '01/01/2022', '31/12/2022');
console.log('3 ----------------------------------');
console.log(list);

/* list = {
  1: {
    etpt: 0,
    indispo: 0,
    reelEtp: 0,
    id: 1,
    label: 'magistrat',
  },
  2: {
    etpt: 0,
    indispo: 0,
    reelEtp: 0,
    id: 2,
    label: 'greffier',
  },
};  */
