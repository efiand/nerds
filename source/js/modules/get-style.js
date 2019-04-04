// Получение заданного стиля

const getStyle = (node, property, pseudo = null) => {
  return parseInt(getComputedStyle(node, pseudo)[property], 10);
};
