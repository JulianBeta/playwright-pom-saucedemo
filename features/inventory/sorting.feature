@inventory
Feature: Sorting products

  Background:
    Given I am signed in as "standard_user"

  Scenario: Products are sorted by name (A to Z) by default
    Then the active sort should be "Name (A to Z)"
    And products should be sorted by name in ascending order

  Scenario Outline: Sort by <option>
    When I sort products by "<option>"
    Then the active sort should be "<option>"
    And products should be sorted by <field> in <direction> order

    Examples:
      | option              | field | direction  |
      | Name (A to Z)       | name  | ascending  |
      | Name (Z to A)       | name  | descending |
      | Price (low to high) | price | ascending  |
      | Price (high to low) | price | descending |
