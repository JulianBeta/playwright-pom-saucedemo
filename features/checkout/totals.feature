@checkout
Feature: Checkout totals
  Item total, 8% tax and order total are calculated correctly.

  Scenario Outline: Totals for <count> product(s)
    Given I am signed in as "standard_user"
    And my cart contains <products>
    When I go to the checkout overview
    Then the overview should list exactly the products in my cart
    And the item total should equal the sum of the product prices
    And the tax should be 8% of the item total
    And the total should equal the item total plus tax

    Examples:
      | count | products                                                                                                                                              |
      | 1     | "Sauce Labs Onesie"                                                                                                                                   |
      | 3     | "Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt"                                                                             |
      | 6     | "Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Bolt T-Shirt", "Sauce Labs Fleece Jacket", "Sauce Labs Onesie", "Test.allTheThings() T-Shirt (Red)" |
