@known-bug
Feature: Known defects that affect every user

  Background:
    Given I am signed in as "standard_user"

  @fail @BUG-011
  Scenario: Checkout cannot start with an empty cart
    Given I open the cart
    When I start the checkout
    Then I should be on the cart page

  @fail @BUG-012
  Scenario: Reset App State also resets the product buttons
    Given I add "Sauce Labs Backpack" to the cart
    When I choose "Reset App State" from the menu
    Then "Sauce Labs Backpack" should show a "Add to cart" button
