@dynamic-catalog
Feature: Dynamic Catalog - Slider
  The slider auto-rotates, so these scenarios control time with Playwright's clock
  instead of racing the animation.

  Background:
    Given the browser clock is under test control
    And I am signed in as "standard_user"
    When I open the "Slider" dynamic catalog from the menu
    And time is paused

  Scenario Outline: The dot for <product> shows it
    When I select the slider dot for "<product>"
    Then the slider should show "<product>" at its catalog price
    And only the dot for "<product>" should be marked as current

    Examples:
      | product                           |
      | Sauce Labs Bike Light             |
      | Sauce Labs Bolt T-Shirt           |
      | Sauce Labs Onesie                 |
      | Test.allTheThings() T-Shirt (Red) |
      | Sauce Labs Backpack               |
      | Sauce Labs Fleece Jacket          |

  Scenario: The slider advances on its own
    Given the slider shows "Sauce Labs Bike Light"
    When 3 seconds pass
    Then the slider should no longer show "Sauce Labs Bike Light"

  @known-bug @a11y @fail @BUG-015
  Scenario: Auto-rotation pauses while the pointer is over the slider (WCAG 2.2.2)
    Given the slider shows "Sauce Labs Bike Light"
    When I hover over the slider
    And 6 seconds pass
    Then the slider should still show "Sauce Labs Bike Light"
