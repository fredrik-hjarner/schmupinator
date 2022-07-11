* Move out as much as possible from ActionExecutor by generalizing both "move" and "move_bezier".
Both functions that the original state first and saves it, then measures progess then sends the
original state and the progress to Enemy (that iself executes the stuff).

* Add reset.css and normalize.css.

* Add so that I can hover with mouse to see x, y positions in absolute x,y on gameDiv.

* Maybe I could have ADVANCED and SIMPLE actions, where ADVANCED actions are transformed into
SIMPLE actions. SIMPLE actions are executed by the game engine and the ADVANCED actions are "utils".
If I had simple actions such as NOOP which would just wait a frame, then I think it would be
easier to do some kind of RUN AHEAD functionality.

* Create Skip 30 frames and Skip 60 frames buttons, to advance time.

* Maybe have a ActionPreprocessor that simplifies actions, for example expands repeat actions, or
turns all rotate around point actions into individual set_position actions, or turns all absolute
moves into relative moves (dunno, can maybe simplify things, maybe.)

* Optimize Events service so you can only subscribe to certain events.

* Add { type: "enemy_died", enemyName: string } event.

* Try SWC Typescript compiler.

* Have consts file with all z indices.

* I could do it as css and have position: relative/absolute with relative as default,
that would make relative/absolute positioning actions more coherent.

* EnemyJsons should be a map keyed by the enemy name, also rename to EnemyYamls maybe.

* Have private constructors, and use a Construct method instead that can be async.

* Eventually remove all long forms that have short forms to reduce complexity!

* Add max number of lines in eslint.

* It would be super cool if Player WAS-AN Enemy,
  that would allow me to execute actions!!!

* Also it would be really cool if the EnemyActionExecutor could execute GraphicsAction:s.

* Flags and every other field on an Enemy could be an attribute, then you could check any attribute
just like you check a flag.
{ attr: 'hp', is: 2 }
{ attr: 'hp', lessThan: 2 }
{ setAttr: 'some flag or variable', val: 2 }

* Shots could be Enemy. Player could be Enemy. Powerups could be Enemy. The power!

* Make x,y on spawn action optional.

* Now when Shots are Enemy, I could do the maxShots limitation with a thing like maxChildren,
maxChildren would be the max number of spawns. I would need to implement parent-spawn relations.

* Remove Shots entirely since I will no longer need it.

* Improve my "end-to-end" test so that it is more reliable.

* Make simple Type Guards for integers. booleans, strings and place them in some util folder.

* Add events (subs and dispatches) declaration to IService to require services to specificy what
they subscribe to and what they dispatch. Throw runtime error when it tried to do something it has
not declared!!

* Force with eslint to always specify "private", "public".

* I should probably not send in `app`, but rather `deps: IService[]` into services.

* Yaml: Maybe do so all files starting with _ are prepended to every file.

* Opps you get points by shooting the spawners... or, maybe not?

* When shots hit an enemy, they should disappear.

* PointsTester is unsafe. It should take more control and FORCE Points to resond to events before
PointsTester.

* When an emepy has spawned it should probably execute it's EnemyExecutor (generators) once,
otherwise, if the enemy has setup actions, then it might exist for one frame in an uninitialized
state.

* Make a "mocked" EventsTester service so I can verify that all events are the same.

* Have action that waits until an attribute has a certain value.
It could also be done like this, if `return` would exit/finished/complete the current generator.
 { parallelRace: [[
   { forever: [
      { attr: x, is: 1, yes: [{ type: return }] },
      wait: 1
   ] },
]] }
in order for that to work though I'd have to reprogram GeneratorUtils.Repeat to only create ONE
generator (now it creates several thus only one would be killed)!

* Use my utils createShade and createText throughout the UI Scenes code.

* Last finishing touches:
1. Hide the debug stuff somehow.
2. Make it fullscreen somehow.