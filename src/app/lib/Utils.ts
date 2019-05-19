export function deleteElementFromJsonArray(id, data) {
  let indexToDel;
  for (let i = 0; i < data.length && !indexToDel; i++) {
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
