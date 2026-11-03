@dynamic-catalog
Feature: Dynamic Catalog - Lazy Load
  An infinite-scroll list of product size variants.

  Background:
    Given I am signed in as "standard_user"
    When I open the "Lazy Load" dynamic catalog from the menu

  Scenario: More products load when scrolling to the end of the list
    Then some products should be listed
    When I scroll to the end of the list
    Then more products should be listed

  Scenario: Every variant is priced like its base product
    When I scroll until the catalog starts repeating
    Then every lazy-loaded variant should match its catalog price

  @known-bug @fail @BUG-014
  Scenario: No variant is listed twice within one catalog cycle
    When I scroll until the catalog starts repeating
    Then no variant should appear twice within one catalog cycle
