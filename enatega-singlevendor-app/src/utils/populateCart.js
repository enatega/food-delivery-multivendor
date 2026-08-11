export function populateCart(restaurant, cart = []) {
  if (!restaurant) return []

  const foods = restaurant.categories?.flatMap((category) => category.foods) ?? []
  const addons = restaurant.addons ?? []
  const options = restaurant.options ?? []
  const foodById = new Map(foods.map((food) => [food._id, food]))
  const addonById = new Map(addons.map((addon) => [addon._id, addon]))
  const optionById = new Map(options.map((option) => [option._id, option]))

  return cart.map((cartItem) => {
    const food = foodById.get(cartItem._id)
    const variation = food?.variations.find((variation) => variation._id === cartItem.variation._id)
    if (!food || !variation) return null

    let price = variation.price
    const optionsTitle = []
    for (const addon of cartItem.addons ?? []) {
      if (!addonById.has(addon._id)) continue
      for (const option of addon.options) {
        const cartOption = optionById.get(option._id)
        if (!cartOption) continue
        price += cartOption.price
        optionsTitle.push(cartOption.title)
      }
    }

    const updatedCartItem = {
      ...cartItem,
      optionsTitle,
      title: `${food.title}${variation.title ? `(${variation.title})` : ''}`,
      price: price.toFixed(2)
    }

    return {
      ...updatedCartItem,
      cartItem: updatedCartItem,
      food,
      image: food.image,
      addons: addons.filter((addon) => food.variations[0]?.addons?.includes(addon._id))
    }
  }).filter(Boolean)
}
