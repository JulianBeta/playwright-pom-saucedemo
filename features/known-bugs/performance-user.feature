@known-bug @performance
Feature: Known defects for performance_glitch_user

  @fail @BUG-010
  Scenario: Login reaches the products page within the 3 second budget
    Given I am on the login page
    When I log in as "performance_glitch_user" and time it
    Then the products page should have loaded within 3000 ms
