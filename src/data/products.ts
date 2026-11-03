/** Source of truth for the Swag Labs catalog, as shown to standard_user. */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  /** Leading part of the image file name (the hash suffix changes between deploys). */
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 4,
    name: 'Sauce Labs Backpack',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: '$29.99',
    image: 'sauce-backpack',
  },
  {
    id: 0,
    name: 'Sauce Labs Bike Light',
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: '$9.99',
    image: 'bike-light',
  },
  {
    id: 1,
    name: 'Sauce Labs Bolt T-Shirt',
    description:
      'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: '$15.99',
    image: 'bolt-shirt',
  },
  {
    id: 5,
    name: 'Sauce Labs Fleece Jacket',
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    price: '$49.99',
    image: 'sauce-pullover',
  },
  {
    id: 2,
    name: 'Sauce Labs Onesie',
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: '$7.99',
    image: 'red-onesie',
  },
  {
    id: 3,
    name: 'Test.allTheThings() T-Shirt (Red)',
    description:
      'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
    price: '$15.99',
    image: 'red-tatt',
  },
];

export function productByName(name: string): Product {
  const product = PRODUCTS.find((p) => p.name === name);
  if (!product) throw new Error(`"${name}" is not in the catalog`);
  return product;
}

/** Dynamic Catalog lists size variants such as "Sauce Labs Bolt T-Shirt (XS)"; map them to the base product. */
export function productForVariant(variantName: string): Product {
  return productByName(variantName.replace(/ \((XS|S|M|L|XL|XXL)\)$/, ''));
}
