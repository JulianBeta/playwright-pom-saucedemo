@dynamic-catalog
Feature: Dynamic Catalog - Spinner
  Products load asynchronously behind a spinner; tests wait on state, never on fixed sleeps.

  Background:
    Given I am signed in as "standard_user"
    When I open the "Spinner" dynamic catalog from the menu

  Scenario: The catalog appears when loading finishes
    Then a loading spinner should be shown
    And the spinner should disappear
    And 6 products should be shown in the spinner catalog

  Scenario: Spinner catalog prices match the catalog
    Then every spinner catalog product should match its catalog price
