@visual
Feature: Visual regression
  Screenshots are compared with approved baselines (Chromium only).
  Update baselines with: npm run test:visual:update

  Scenario Outline: The <screen> screen matches its baseline
    Given I am signed in as "standard_user"
    When I visit the "<screen>" screen
    Then the screen should match the "<screen>" baseline

    Examples:
      | screen              |
      | inventory           |
      | product details     |
      | cart                |
      | checkout info       |
      | checkout overview   |
      | checkout complete   |

  Scenario: The login screen matches its baseline
    Given I am on the login page
    Then the screen should match the "login" baseline

  @known-bug @fail @BUG-009
  Scenario: visual_user sees the same inventory as standard_user
    Given I am signed in as "visual_user"
    When I visit the "inventory" screen
    Then the screen should match the "inventory" baseline
