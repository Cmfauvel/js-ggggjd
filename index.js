#!/usr/bin/env node
// Write Javascript code!
var moment = require('moment'); // require

const workingDay = (date) => {
  let days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const day = days[date.day()];
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
      etp += user.etp;
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
  const list = new Object();

  categories.map((c) => {
    list[c.id] = new Object({
      etpt: 0,
      indispo: 0,
      reelEtp: 0,
      ...c,
    });
  });

  let now = moment(dateStart, "DD/MM/YYYY");
  const end = moment(dateStop, "DD/MM/YYYY");

  let nbDay = 0;

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

      if (situation && etp !== null) {
        list['1'].etpt += etp;
      }
    }
    now = moment(now).add(1, 'days');
  } while (now <= end - 1);

  if (nbDay === 0) {
    nbDay = -1;
  }

  // format render

  for (const property in list) {
    const filteredUsers = listUsers.filter(u => !u.contentieux.includes(contentieuxId))
    list[property].reelEtp = list[property].etpt / nbDay;
    list[property].indispo = list[property].etpt !== 0 ? nbDay * filteredUsers.length / list[property].etpt : nbDay * listUsers.length;
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

const categories = [
  { id: 1, label: 'magistrat' },
  { id: 2, label: 'greffier' },
];


let list = getETPMagistrat(listUsers, 'c1', categories, '01/01/2022', '31/01/2022');
console.log('1 ----------------------------------');
console.log(list);


list = getETPMagistrat(listUsers, 'c1', categories, '01/01/2022', '31/12/2021');
console.log('2 ----------------------------------');
console.log(list);


result1 = {
  '1': { etpt: 45, indispo: 0, reelEtp: 2.25, id: 1, label: 'magistrat' },
  '2': { etpt: 0, indispo: 0, reelEtp: 0, id: 2, label: 'greffier' }
}
result2 = {
  '1': { etpt: 0, indispo: 0, reelEtp: -0, id: 1, label: 'magistrat' },
  '2': { etpt: 0, indispo: 0, reelEtp: -0, id: 2, label: 'greffier' }
}
