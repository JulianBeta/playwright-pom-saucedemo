# Bug reports

Defects found while exploring and automating https://www.saucedemo.com (2026-11-02).
Open defects are covered by **expected-failure tests** (`@known-bug @fail`): they describe the correct
behavior, fail while the bug exists, and are reported as _"expected to fail, but passed"_ once it is fixed.

| ID                    | Title                                                      | Users                    | Severity | Status                     |
| --------------------- | ---------------------------------------------------------- | ------------------------ | -------- | -------------------------- |
| [BUG-001](BUG-001.md) | Product images are replaced by a broken placeholder        | problem_user             | High     | Open                       |
| [BUG-002](BUG-002.md) | Sorting has no effect                                      | problem_user             | Medium   | Open                       |
| [BUG-003](BUG-003.md) | Add to cart / Remove silently fail for half the products   | problem_user, error_user | High     | Open                       |
| [BUG-004](BUG-004.md) | Product links open the wrong product                       | problem_user             | High     | Open                       |
| [BUG-005](BUG-005.md) | Last Name field does not accept typing                     | problem_user             | Critical | Open                       |
| [BUG-006](BUG-006.md) | Checkout continues without a last name                     | error_user               | High     | Open                       |
| [BUG-007](BUG-007.md) | Sorting throws an error alert                              | error_user               | Medium   | Open                       |
| [BUG-008](BUG-008.md) | Finish does not complete the order                         | error_user               | Critical | Open                       |
| [BUG-009](BUG-009.md) | Prices, images and layout differ from the real catalog     | visual_user              | High     | Open                       |
| [BUG-010](BUG-010.md) | Login takes about 5 seconds                                | performance_glitch_user  | Medium   | Open                       |
| [BUG-011](BUG-011.md) | An order can be placed with an empty cart                  | all users                | High     | Open                       |
| [BUG-012](BUG-012.md) | Reset App State leaves product buttons in the Remove state | all users                | Low      | Open                       |
| [BUG-013](BUG-013.md) | Products page can flash after logout + Back (intermittent) | all users                | Medium   | Intermittent               |
| [BUG-014](BUG-014.md) | Lazy Load catalog lists a variant twice                    | all users                | Low      | Open                       |
| [BUG-015](BUG-015.md) | Slider auto-rotation cannot be paused (WCAG 2.2.2)         | all users                | Medium   | Open                       |
| [BUG-016](BUG-016.md) | Deep links answer HTTP 404                                 | all users                | Low      | Worked around in framework |
