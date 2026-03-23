Feature: Saucedemo login and cart flow
  As a user of Swag Labs
  I want to login and manage cart
  So that I can verify products and cart functionality

  Scenario: Successful login and cart operations
    Given I open the website
    When I login as "standard_user"
    Then I should see the products page
    And I collect all products with name and price
    And I add any product to the cart
    Then the cart quantity should be 1
    When I go to the cart page
    Then I verify cart quantity and description
    And remove, checkout, and continue buttons are enabled
    And I remove the product from the cart
    Then the header cart quantity should be 0

  Scenario: Intentional failure to demonstrate screenshots
    Given I open the website
    When I login as "standard_user"
    Then I should see the products page
    And I add any product to the cart
    Then the cart quantity should be 2
