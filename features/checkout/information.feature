@checkout
Feature: Checkout information

  Background:
    Given I am signed in as "standard_user"
    And my cart contains "Sauce Labs Backpack"
    And I am on the checkout information page

  Scenario Outline: <field> is required
    When I submit first name "<first>", last name "<last>" and postal code "<zip>"
    Then I should see the checkout error "<error>"
    And I should still be on the checkout information page

    Examples:
      | field       | first  | last       | zip    | error                          |
      | First name  |        | Betancourt | 110111 | Error: First Name is required  |
      | Last name   | Julian |            | 110111 | Error: Last Name is required   |
      | Postal code | Julian | Betancourt |        | Error: Postal Code is required |

  Scenario: Cancel returns to the cart
    When I cancel the checkout
    Then I should be on the cart page

  Scenario: Cancel on the overview returns to the products
    When I submit valid customer information
    And I cancel the checkout
    Then I should see the products page
