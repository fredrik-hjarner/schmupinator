* Move out as much as possible from ActionExecutor by generalizing both "move" and "move_bezier".
Both functions that the original state first and saves it, then measures progess then sends the
original state and the progress to Enemy (that iself executes the stuff).
* Add reset.css and normalize.css.
* Refactor rending engine and sprite pools, maybe have a Graphics service.
Actually max shots and stuff should NOT be connected to the number of sprites!!! because that is a
problem, I want those two to be fully separated.

