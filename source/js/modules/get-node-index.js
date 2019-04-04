// Индекс DOM-узла в указанной коллекции

const getNodeIndex = (collection, node) => {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i] === node) {
      return i;
    }
  }
  return -1;
};
