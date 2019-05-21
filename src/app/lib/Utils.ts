const admins = ['jimmypalelil@gmail.com', 'tester@test.com'];
const housekeeping = admins.map(val => val);
const hkEmail = 'housekeeping@northerngrand.ca';
housekeeping.push(hkEmail);

const frontDesk = 'reservations@northerngrand.ca';

const users = housekeeping.map(val => val);
users.push(frontDesk);


export function deleteElementFromJsonArray(id, data) {
  let indexToDel;
  for (let i = 0; i < data.length && isNaN(indexToDel); i++) {
    if (data[i]['_id'] === id) {
      indexToDel = i;
    }
  }
  if (!isNaN(indexToDel)) {
    data.splice(indexToDel, 1);
    return true;
  }
  return false;
}

export function isUser() {
  return users.includes(localStorage.getItem('token'));
}

export function isHK() {
  return housekeeping.includes(localStorage.getItem('token'));
}

export function getFrontDeskEmail() {
  return frontDesk;
}

export function getHKEmail() {
  return hkEmail;
}

export function isloggedIn() {
  return localStorage.getItem('token') !== null;
}
