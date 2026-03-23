class ProductsPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.sel = {
      inventoryContainer: '#inventory_container',
      items: '.inventory_item',
      itemName: '.inventory_item_name',
      itemPrice: '.inventory_item_price',
      addButton: '.btn_inventory',
      cartLink: '.shopping_cart_link',
      cartBadge: '.shopping_cart_badge'
    };
  }

  async isVisible() {
    const visible = await this.page.isVisible(this.sel.inventoryContainer);
    this.logger.info('Products page visibility', { visible });
    return visible;
  }

  async getAllProducts() {
    const items = await this.page.$$(this.sel.items);
    const list = [];
    for (const it of items) {
      const name = await it.$eval(this.sel.itemName, el => el.textContent.trim());
      const price = await it.$eval(this.sel.itemPrice, el => el.textContent.trim());
      list.push({ name, price });
    }
    this.logger.info('Collected products', { count: list.length });
    return list;
  }

  async addFirstProductToCart() {
    const first = await this.page.$(this.sel.items);
    if (!first) throw new Error('No product items found');
    const btn = await first.$(this.sel.addButton);
    if (!btn) throw new Error('Add to cart button not found on first item');
    await btn.click();
    this.logger.info('Added first product to cart');
  }

  async getCartQuantity() {
    const badgeVisible = await this.page.isVisible(this.sel.cartBadge);
    if (!badgeVisible) return 0;
    const txt = await this.page.textContent(this.sel.cartBadge);
    const qty = parseInt(txt || '0', 10);
    this.logger.info('Cart quantity', { qty });
    return qty;
  }

  async openCart() {
    await this.page.click(this.sel.cartLink);
    this.logger.info('Opened cart page');
  }
}

module.exports = { ProductsPage };
