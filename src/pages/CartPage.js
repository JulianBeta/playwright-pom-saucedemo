class CartPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.sel = {
      cartItem: '.cart_item',
      qtyLabel: '.cart_quantity',
      desc: '.inventory_item_name',
      removeBtn: '.cart_button',
      checkoutBtn: '#checkout',
      continueBtn: '#continue-shopping',
      cartBadge: '.shopping_cart_badge',
      cartLink: '.shopping_cart_link'
    };
  }

  async verifyElementsEnabled() {
    const removeEnabled = await this.page.isEnabled(this.sel.removeBtn);
    const checkoutEnabled = await this.page.isEnabled(this.sel.checkoutBtn);
    const continueEnabled = await this.page.isEnabled(this.sel.continueBtn);
    this.logger.info('Cart buttons enabled', { removeEnabled, checkoutEnabled, continueEnabled });
    return removeEnabled && checkoutEnabled && continueEnabled;
  }

  async getQuantity() {
    const labels = await this.page.$$(this.sel.qtyLabel);
    if (labels.length === 0) return 0;
    const qty = await labels[0].textContent();
    const number = parseInt((qty || '0').trim(), 10);
    this.logger.info('Cart page quantity', { number });
    return number;
  }

  async hasDescription() {
    const visible = await this.page.isVisible(this.sel.desc);
    this.logger.info('Cart item description visible', { visible });
    return visible;
  }

  async removeFirstItem() {
    const removeButtons = await this.page.$$(this.sel.removeBtn);
    if (removeButtons.length === 0) throw new Error('No remove button found');
    await removeButtons[0].click();
    this.logger.info('Removed first item from cart');
  }

  async getHeaderCartCount() {
    const badgeVisible = await this.page.isVisible(this.sel.cartBadge);
    if (!badgeVisible) return 0;
    const txt = await this.page.textContent(this.sel.cartBadge);
    const qty = parseInt(txt || '0', 10);
    return qty;
  }

  async openCart() {
    await this.page.click(this.sel.cartLink);
  }
}

module.exports = { CartPage };
