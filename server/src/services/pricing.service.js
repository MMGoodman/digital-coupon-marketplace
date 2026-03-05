function calcMinimumSellPrice(costPrice, marginPercentage) {
  const min = Number(costPrice) * (1 + Number(marginPercentage) / 100);
  return Math.round(min * 100) / 100;
}

module.exports = { calcMinimumSellPrice };