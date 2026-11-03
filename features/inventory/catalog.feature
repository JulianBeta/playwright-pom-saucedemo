@inventory
Feature: Product catalog

  Background:
    Given I am signed in as "standard_user"

  @smoke
  Scenario: The inventory lists the full catalog
    Then I should see 6 products
    And every product should match the catalog

  Scenario: Every product shows its own image
    Then every product should show its own image
