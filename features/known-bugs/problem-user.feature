@known-bug
Feature: Known defects for problem_user
  Each scenario describes the CORRECT behavior and is tagged @fail:
  it is expected to fail while the defect exists, and the suite flags it
  as "unexpectedly passed" the day the defect is fixed.
  Bug reports: docs/bugs/

  Background:
    Given I am signed in as "problem_user"

  @fail @BUG-001
  Scenario: Every product shows its own image
    Then every product should show its own image

  @fail @BUG-002
  Scenario: Sorting by name (Z to A) reorders the products
    When I sort products by "Name (Z to A)"
    Then products should be sorted by name in descending order

  @fail @BUG-003
  Scenario: Every product can be added to the cart
    When I add every product to the cart
    Then the cart badge should show 6

  @fail @BUG-004
  Scenario: Product links open the matching product
    Then every product link should open its own details page

  @fail @BUG-005
  Scenario: The last name field accepts input
    Given my cart contains "Sauce Labs Backpack"
    And I am on the checkout information page
    When I type "Betancourt" into the last name field
    Then the last name field should contain "Betancourt"
