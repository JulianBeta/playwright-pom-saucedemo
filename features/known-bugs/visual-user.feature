@known-bug
Feature: Known defects for visual_user

  @fail @BUG-009
  Scenario: Prices match the catalog
    Given I am signed in as "visual_user"
    Then every product should match the catalog
