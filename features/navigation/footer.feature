@navigation
Feature: Footer

  Background:
    Given I am signed in as "standard_user"

  Scenario Outline: The <network> link opens Sauce Labs on <network> in a new tab
    Then the "<network>" footer link should point to "<url>"
    And the "<network>" footer link should open in a new tab

    Examples:
      | network  | url                                         |
      | X        | https://x.com/saucelabs                     |
      | Facebook | https://www.facebook.com/saucelabs          |
      | LinkedIn | https://www.linkedin.com/company/sauce-labs/ |

  Scenario: The copyright shows the current year
    Then the footer should show the copyright for the current year
