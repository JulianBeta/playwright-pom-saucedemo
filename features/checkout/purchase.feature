@checkout @e2e @smoke
Feature: Purchase

  Scenario: A customer buys two products end to end
    Given I am on the login page
    When I log in as "standard_user"
    And I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bolt T-Shirt" to the cart
    And I open the cart
    Then the cart should contain exactly the products I added
    When I check out with valid customer information
    Then the overview should list exactly the products in my cart
    When I finish the order
    Then I should see the order confirmation "Thank you for your order!"
    And the cart badge should not be shown
    When I go back home
    Then I should see the products page
