@known-bug
Feature: Known defects for error_user

  Background:
    Given I am signed in as "error_user"

  @fail @BUG-007
  Scenario: Sorting works without an error alert
    When I sort products by "Name (Z to A)"
    Then no error alert should have been shown
    And products should be sorted by name in descending order

  @fail @BUG-003
  Scenario: Every product can be added to the cart
    When I add every product to the cart
    Then the cart badge should show 6

  @fail @BUG-006
  Scenario: Checkout requires a last name
    Given my cart contains "Sauce Labs Backpack"
    And I am on the checkout information page
    When I submit first name "Julian", last name "" and postal code "110111"
    Then I should see the checkout error "Error: Last Name is required"
    And I should still be on the checkout information page

  @fail @BUG-008
  Scenario: Finishing the order completes the purchase
    Given my cart contains "Sauce Labs Backpack"
    When I go to the checkout overview
    And I finish the order
    Then I should see the order confirmation "Thank you for your order!"
