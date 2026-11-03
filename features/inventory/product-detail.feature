@inventory
Feature: Product details

  Background:
    Given I am signed in as "standard_user"

  Scenario Outline: Details of <product> match the catalog
    When I open the details of "<product>"
    Then the product details should match the catalog entry for "<product>"

    Examples:
      | product                           |
      | Sauce Labs Backpack               |
      | Sauce Labs Bike Light             |
      | Sauce Labs Bolt T-Shirt           |
      | Sauce Labs Fleece Jacket          |
      | Sauce Labs Onesie                 |
      | Test.allTheThings() T-Shirt (Red) |

  Scenario: Add to cart from the details page and go back
    When I open the details of "Sauce Labs Backpack"
    And I add the product to the cart from its details page
    Then the cart badge should show 1
    When I go back to the products
    Then "Sauce Labs Backpack" should show a "Remove" button

  Scenario: Unknown product id
    When I open the product with id 99
    Then the product name should be "ITEM NOT FOUND"
