* Move out as much as possible from ActionExecutor by generalizing both "move" and "move_bezier".
Both functions that the original state first and saves it, then measures progess then sends the
original state and the progress to Enemy (that iself executes the stuff).

* Maybe I could have ADVANCED and SIMPLE actions, where ADVANCED actions are transformed into
SIMPLE actions. SIMPLE actions are executed by the game engine and the ADVANCED actions are "utils".
If I had simple actions such as NOOP which would just wait a frame, then I think it would be
easier to do some kind of RUN AHEAD functionality.

* Maybe have a ActionPreprocessor that simplifies actions, for example expands repeat actions, or
turns all rotate around point actions into individual set_position actions, or turns all absolute
moves into relative moves (dunno, can maybe simplify things, maybe.)

* Optimize Events service so you can only subscribe to certain events.

* Add { type: "enemy_died", enemyName: string } event.

* I could do it as css and have position: relative/absolute with relative as default,
that would make relative/absolute positioning actions more coherent.

* Have private constructors, and use a Construct method instead that can be async.

* Add max number of lines in eslint.

* Rename Enemy to GameObject, and Enemies to GameObjectManager.

* Make simple Type Guards for integers. booleans, strings and place them in some util folder.

* Add events (subs and dispatches) declaration to IService to require services to specificy what
they subscribe to and what they dispatch. Throw runtime error when it tried to do something it has
not declared!!
Nah, it might be better to have every event in it's own service (i.e. event channel).

* I should probably not send in `app`, but rather `deps: IService[]` into services.

* When an emepy has spawned it should probably execute it's EnemyExecutor (generators) once,
otherwise, if the enemy has setup actions, then it might exist for one frame in an uninitialized
state.

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

* Maybe I should have a frameTickEvents service, that only has frame_tick on it. This would allow a
little bit of increased performance I think.

* Enemies.enemies should be Object keyed by id => performance optimization.

* This is an abuse ` this.app.gameLoop.FrameCount` could most likely use the `frameNr` in the
`frame_tick` event instead, that way depenencies on `gameLoop` can be removed in some places.

* Confirm that reset.css is imported on PROD build cuz suspicious import path.

* Dont dispatch zero point events.

* TODO: Set correct button for laser on GamePad !!!

* Try/verify if Player can have more than 1 hp, which should be able to have.

* I want to play a demo of the game in the background of the menu, but that's gonna take work
to make it happen since I do not at all support any of that as of now.

* KeyDowns should trigger KeyDown events that UI can listen to, because that would be an easier and
more sensible way for several UI components to listen to Input.

* The Init funcs of services should prolly be all awaited with Promise.All for spd improvement.

* I could make it work with touch devices but having the ship move in max speed towards the cursor.
It would help if I could get the game to play in full fullscreen which PWA might help with??

* Overflowing GameHiders cause problem on mobile/touch devices, you can still scroll!!

* When something in UI is selected there should be a soft color animation that loops
on the selected thing.

* Implement a frame-speed-schedule, so I can rerun specific parts of the game very fast,
for example I might be interested in what happens in the frames 1000 to 1500.

* ~~Sometimes the onDeathAction explosion did not trigger, examine why and fix.~~
Solved with Date.Now().

* A "disableAutomaticOutsideOfScreenBehaviour" setting on enemies in case you dont want it.

* Explain or show better how to enter highscore name.

* Rename GameSpeed service to GameLoopControlUI or something like that.

* Instead of having a GameSpeedSlider I should have 0x, x1, x2 etc Buttons.

* Some/many of the setting in Settings scene should be moved to a non-game-UI debug menu
(currently called GameSpeed service), this debug menu should be toggled with a DebugMenu setting
from the Settings scene.

* I should probably move GameSpeed stuff into a GameLoop variant (some stuff should not be moved
into a GameLoop though), since I would like to do a lot of stuff so maybe the extra coupling can
help, for example I would like to fast-forward to specific frames as soon as the game starts to
speed up development/debugging/testing of levels etc.

* all the names should actually not need to be input via contructor to a Service but can be a 
public/private field on respective service.

* Move Fps stats into GameSpeed service, then remove Fps stats service.

* I should have warning come up if trying to sub when already subbed.
I should have warning come up if trying to unsub when not subbed.

* Last finishing touches:
1. Hide the bullets on the left side of the game window.

---

**Make Enemy multi-threaded**

It might be good to make Enemy class multi-threaded, since it seems like that class is what takes
most time to run.

A thread would run a number of enemies, say if I had 3 threads one way would be to have
enemy1 on thread1, enemy2 on thread2, enemy3 on thread3, enemy4 on thread1, enemy2 on thread2 etc.
Or perhaps I need some count, the thread that has least enemies gets a newly spawned enemy.

It might be tricky to make it multi-threaded, but I can make it easier by preparing the code and
putting it into a state that will make it easier to make it multi-threaded.

Enemy communicates with `Graphics` service and also with `Enemies` service and `GameData`
(to get EnemyJson:s) (but communication with `GameData` could maybe be made indirect somehow),
prolly some more.

In order to make it multi-threaded I would have to run the `Enemy.OnFrameTick` function in a
WebWorker. Everything that `Enemy.OnFrameTick` want to do/affect, outside of itself,
it has to accumulate and send a message with all that stuff in the end to the main thread that will
execute all those things.

It is also important that the order is intact/consistent. So I would have to run every
Enemy WebWorker first and the when they are ALL done then execute what they wanted to do in the
same order as the enemies come in the enemies array.

When a new enemy needs to spawn, the WebWorker has to sendMessage with spawn type, the from outside
of the WebWorke there will be send in an EnemyJson into the WebWorker.

Input from `Input` and `GamePad` has to be sent in to the WebWorker before/on next frame when the
WebWorker starts it's stuff.

If collisions could be calculated before `Enemies` then they could also be sent in as input to the
WebWorker. Maybe I need to add a priority when subscribing to frame_tick so I have control over
order of execution.

The input to the WebWorker could be stored on a private class object IputToWebWorker or something.

One problem is how to handle the "player" as the player is somewhat magical and it has to be reached
by all WebWorkers.

---

* I temporary removed the DisplayControls scene, I should probably bring it back somehow.

* I must also make it so that the highscore is per "game"/zip.

* StartGame scene should change name to StartMenu.

* It would be nice to have a better logger so you could do `log = new Log().WithPrefix("GameData")`
to prefix all logs in for example the GameData service.

* I should probably remove `collisionType` and change it's name to only `type` I think that's a more
fitting name since otherwise I might end up using `collisionType` for things that are not even
collision related. At some point I might want to filter by type for example too.

* It would be better if the Scene:s where created anew with `new` on Scene swapping, maybe, because
then some vars would reset automatically. I had a problem with one var not having been reset in
destroy.

* Stage2 could be a pacifist run. You have a weapon, but every enemy you shoot explodes. There can
be different colors that explode in different directions. For example blue 4 in cardinal directions,
blue in diagonal and red in all 8.
I can record Neo XYX pacifist pattern and then just do something similar, by making sure that
enemies will not "cross" that path.

* Make E2eTester able to record per game as well, and ReplayerInput able to do so too.

* Update Controls scene to explain that keys vary by game but in general:
Weapons - W, A, S, D keys
Movement - Arrow keys

* rename the magical enemy `shot` to `defaultShot` because that is more explicit.

* I prolly should have an action to configure which shot is used when using the shooting actions,
for example one GameObject migh want to use the default `shot` but another one might want to use
another one.

* Experiment with GraphicsElement.commit and Graphics.commit to see if that make any difference
performance-wise. with cssText probably. I am probably gonna need a commit if I am going to do
something with canvas.

* Maybe I should have a GfxElementRenderer class that takes the data from the GfxElement and throws,
it also would need the context. That way I could maybe create several renderers or something.
I could have the "normal" renderer, but also a cached-OffscreenCanvas-renderer that keeps a cache
with keyed by stringified this.vars for all GameObjects.

* Invincibility should be set via attribute, that way an Enemy can manage it's own invincibility
frames if I also make a onHit callback action that can toggle invincibility on/off.

* In the future I would probably want more specific actions to end the game for example end it
in a success way but now I only have one type of "end of game" and that is Game Over.

* The shooting actions should prolly have to specify which shot to use instead of using the default
shot, since the default shot is a bit "magical".

* Remove TDo action, it's not needed. It is used but I think all those can be removed/replaced.

* The way I imagine it to work is that users upload a
js-file to a backend, then the backend runs that js file to generate a json, then the frontend loads
that json (that is a level). So at no point does the frontend need zip or yaml.

* have internal state that keeps track of background scroll so that code does not have to grab from
DOM all the time (might be slow?).
