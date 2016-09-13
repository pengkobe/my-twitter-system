import toInteger from 'lodash.tointeger';

const empty = [];

function multiSplice(array, start, deleteCount, inserts, argsLength) {
  if (!Array.isArray(array)) {
    throw new TypeError('Need an array to splice.');
  }
  if (!Array.isArray(inserts)) {
    throw new TypeError('Inserts array much be an array.');
  }
  if (argsLength === 1) {
    return [];
  }

  const length = array.length;
  start = toInteger(start);
  if (start < 0) {
    start = Math.max(length + start, 0);
  } else {
    start = Math.min(start, length);
  }

  if (argsLength === 2) {
    deleteCount = length - start;
  } else {
    deleteCount = Math.min(Math.max(toInteger(deleteCount), 0), length - start);
  }

  let i;
  const removals = Array(deleteCount);
  for (i = 0; i < deleteCount; i++) {
    removals[i] = array[i + start];
  }

  const insertCount = inserts.length;
  const edge = start + insertCount;
  const need = Math.max(edge - length, 0);

  for (i = length; i < edge; i++) {
    array[i] = inserts[i - start];
  }
  if (insertCount) {
    for (i = length - insertCount + need; i < length - deleteCount; i++) {
      array[i + insertCount] = array[i + deleteCount];
    }
    for (i = length - 1 - deleteCount; i >= edge; i--) {
      array[i] = array[i - insertCount];
    }
  }
  if (deleteCount) {
    for (i = start; i < length - insertCount; i++) {
      array[i + insertCount] = array[i + deleteCount];
    }
  }
  for (i = need; i < insertCount; i++) {
    array[i + start - need] = inserts[i - need];
  }

  if (deleteCount) {
    array.length = length - deleteCount + insertCount;
  }

  return removals;
}

export default function(array, start, deleteCount, inserts = empty) {
  return multiSplice(array, start, deleteCount, inserts, arguments.length);
}
