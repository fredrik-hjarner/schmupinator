* Move out as much as possible from ActionExecutor by generalizing both "move" and "move_bezier".
Both functions that the original state first and saves it, then measures progess then sends the
original state and the progress to Enemy (that iself executes the stuff).
* Add reset.css and normalize.css.
* Refactor rending engine and sprite pools, maybe have a Graphics service.
Actually max shots and stuff should NOT be connected to the number of sprites!!! because that is a
problem, I want those two to be fully separated.
* Add so that I can hover with mouse to see x, y positions in absolute x,y on gameDiv.
* Maybe I could have ADVANCED and SIMPLE actions, where ADVANCED actions are transformed into
SIMPLE actions. SIMPLE actions are executed by the game engine and the ADVANCED actions are "utils".
If I had simple actions such as NOOP which would just wait a frame, then I think it would be
easier to do some kind of RUN AHEAD functionality.
* Create Skip 30 frames and Skip 60 frames buttons, to advance time.