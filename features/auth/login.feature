@auth
Feature: Login
  As a Swag Labs customer
  I want to sign in with my credentials
  So that I can browse and buy products

  Background:
    Given I am on the login page

  @smoke
  Scenario: Standard user signs in
    When I log in as "standard_user"
    Then I should see the products page

  Scenario Outline: Every active demo user can sign in
    When I log in as "<user>"
    Then I should see the products page

    Examples:
      | user                    |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |

  Scenario Outline: Sign-in is rejected with a clear message (<case>)
    When I log in with username "<username>" and password "<password>"
    Then I should see the login error "<error>"

    Examples:
      | case              | username        | password       | error                                                                     |
      | locked out        | locked_out_user | secret_sauce   | Epic sadface: Sorry, this user has been locked out.                       |
      | missing username  |                 | secret_sauce   | Epic sadface: Username is required                                        |
      | missing password  | standard_user   |                | Epic sadface: Password is required                                        |
      | wrong password    | standard_user   | wrong_password | Epic sadface: Username and password do not match any user in this service |
      | unknown user      | not_a_user      | secret_sauce   | Epic sadface: Username and password do not match any user in this service |

  Scenario: The login error can be dismissed
    When I log in with username "" and password ""
    And I dismiss the login error
    Then no login error should be shown
