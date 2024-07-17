Feature: Add Ticker

  Scenario: Add ticker
    When I visit the home page
    And I set the ticker
    And I set the quantity
    And I submit the form
#    Then I should see the ticker added
