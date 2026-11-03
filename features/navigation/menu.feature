@navigation
Feature: Side menu

  Background:
    Given I am signed in as "standard_user"

  Scenario: All Items returns to the products from anywhere
    Given I open the cart
    When I choose "All Items" from the menu
    Then I should see the products page

  Scenario: About links to the Sauce Labs website
    When I open the menu
    Then the "About" menu link should point to "https://saucelabs.com/"

  Scenario: Reset App State empties the cart
    Given I add "Sauce Labs Backpack" to the cart
    When I choose "Reset App State" from the menu
    Then the cart badge should not be shown

  Scenario: The menu can be closed
    When I open the menu
    And I close the menu
    Then the menu should be hidden
