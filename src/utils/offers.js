export const getOffersByType = (offersСatalog, type) => offersСatalog.find((offer) => offer.type.toLowerCase() === type.toLowerCase());

export const getOferrsCost = (offersСatalog, selectedOffers, type) => {
  const availableOffers = getOffersByType(offersСatalog, type)?.offers || [];
  const eventOferrsCost = availableOffers.reduce((acc, cur) => {
    if (selectedOffers.includes(cur.id)) {
      acc += cur.price;}
    return acc;
  }, 0);

  return eventOferrsCost;
};
