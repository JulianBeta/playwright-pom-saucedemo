@cart
Feature: Shopping cart

  Background:
    Given I am signed in as "standard_user"

  @smoke
  Scenario: Add a product to the cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1
    And "Sauce Labs Backpack" should show a "Remove" button
    When I open the cart
    Then the cart should contain exactly the products I added
    And the quantity of "Sauce Labs Backpack" should be 1

  Scenario: Add every product to the cart
    When I add every product to the cart
    Then the cart badge should show 6
    When I open the cart
    Then the cart should contain exactly the products I added

  Scenario: Remove a product from the inventory page
    Given I add "Sauce Labs Bike Light" to the cart
    And I add "Sauce Labs Onesie" to the cart
    When I remove "Sauce Labs Bike Light" from the inventory page
    Then the cart badge should show 1
    And "Sauce Labs Bike Light" should show a "Add to cart" button

  Scenario: Remove a product from the cart page
    Given I add "Sauce Labs Bike Light" to the cart
    And I add "Sauce Labs Onesie" to the cart
    And I open the cart
    When I remove "Sauce Labs Onesie" from the cart page
    Then the cart should contain only "Sauce Labs Bike Light"
    And the cart badge should show 1

  Scenario: Removing the last product hides the badge
    Given I add "Sauce Labs Onesie" to the cart
    When I remove "Sauce Labs Onesie" from the inventory page
    Then the cart badge should not be shown

  Scenario: The cart survives navigation and a page reload
    Given I add "Sauce Labs Fleece Jacket" to the cart
    When I open the details of "Sauce Labs Backpack"
    And I reload the page
    Then the cart badge should show 1
    When I open the cart
    Then the cart should contain exactly the products I added

  Scenario: Continue shopping returns to the products
    Given I open the cart
    When I continue shopping
    Then I should see the products page
