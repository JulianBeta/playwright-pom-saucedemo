@a11y
Feature: Accessibility
  Each screen is scanned with axe-core against WCAG 2.1 A/AA.
  Best-practice findings are attached to the report without failing the test.

  Scenario Outline: The <screen> screen has no WCAG 2.1 AA violations
    Given I am signed in as "standard_user"
    When I visit the "<screen>" screen
    Then the screen should have no WCAG 2.1 AA violations

    Examples:
      | screen            |
      | inventory         |
      | product details   |
      | cart              |
      | checkout info     |
      | checkout overview |
      | checkout complete |

  Scenario: The login screen has no WCAG 2.1 AA violations
    Given I am on the login page
    Then the screen should have no WCAG 2.1 AA violations
