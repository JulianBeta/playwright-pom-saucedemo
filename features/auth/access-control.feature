@auth @security
Feature: Access control
  Pages behind the login must not be reachable without a session.

  Scenario Outline: <page> requires a session
    When I open "<page>" without signing in
    Then I should see the login page
    And I should see the login error "Epic sadface: You can only access '<page>' when you are logged in."

    Examples:
      | page                    |
      | /inventory.html         |
      | /inventory-item.html    |
      | /cart.html              |
      | /checkout-step-one.html |
      | /checkout-step-two.html |
      | /checkout-complete.html |

  @smoke
  Scenario: Logging out ends the session
    Given I am signed in as "standard_user"
    When I log out
    Then I should see the login page
    When I open "/inventory.html" without signing in
    Then I should see the login error "Epic sadface: You can only access '/inventory.html' when you are logged in."

  # See docs/bugs/BUG-013: the products page can flash briefly before this redirect happens.
  Scenario: The Back button after logout does not reveal protected pages
    Given I am on the login page
    When I log in as "standard_user"
    Then I should see the products page
    When I log out
    And I go back in the browser
    Then I should see the login page
    And no products should be visible
