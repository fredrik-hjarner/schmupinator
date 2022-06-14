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

* Maybe have a ActionPreprocessor that simplifies actions, for example expands repeat actions, or
turns all rotate around point actions into individual set_position actions, or turns all absolute
moves into relative moves (dunno, can maybe simplify things, maybe.)

* Make GameOver service.

* Optimize Events service so you can only subscribe to certain events.

* Make it so that colliding with an enemy kills you.

* Add { type: "enemy_died", enemyName: string } event.

* Try SWC Typescript compiler.

* Have consts file with all z indices.

* Add collisions with enemy ships themselves.

* I could do it as css and have position: relative/absolute with relative as default,
that would make relative/absolute positioning actions more coherent.

* EnemyJsons should be a map keyed by the enemy name, also rename to EnemyYamls maybe.

* Have private constructors, and use a Construct method instead that can be async.

* Eventually remove all long forms that have short forms to reduce complexity!

* Twice, Thrice, Forever short forms.

* Add max number of lines in eslint.

* It would be super cool if Player WAS-AN Enemy,
  that would allow me to execute actions!!!

* Also it would be really cool if the EnemyActionExecutor could execute GraphicsAction:s.