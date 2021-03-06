![Schmupinator](https://raw.githubusercontent.com/fredrik-hjarner/schmupinator/vite-master-safe-always-working-not-broken/githubAssets/schmupinator.png)

**Work in progress! Code can break backward compatability at any time. Code will most likely not stabilize before 2023, if I even get it to a stable state at all.**

> The ambition is to make a shoot 'em up engine with the ability for users create their own shoot 'em up stages.

## Teasers

`[Insert awesome animation here]`

## Current state

* You can play a stage that lasts 30 seconds.
* Highscore that saves in localStorage.
* You can theoretically build your own stages and enemies with YAML files, but really, you will need a tutorial or be pretty smart (200+ IQ) to figure out how to do it.

## Preliminary goals for the game/engine

1. Make it able to do everything that the game *Truxton* can do. *Truxton* is a good, imho, shoot 'em up but primitive so is easy to *mimic*.
2. Make it *not too hard* to create enemies and stages. A good tutorial and documentation is needed.
3. A dream goal is to create a stage and enemy editor, but in order for that to be feasible the code must first have stabilized.
4. Server that stores highscores and custom stages.

## Preliminary goals for the code

* As few dependencies as possible. Fewer dependencies can increase the life span of a project since it will not rely on 1 000 dependences that ~~can~~ *will* break.
* No canvas, every enemy, bullet, etc. is a div! It works better than one would think with a few tricks.

## How to clone, build and run *Schmupinator* locally?

`[TODO: Write instructions.]`

## License

100% open source.

## Credits

* **Fredrik Hjärner**: Game engine, stage, enemies, "graphics" ~~and also all bugs~~.

## Acknowledgments

* [**SpicyGame**](https://spicygame.itch.io/): For creating the `Micro Pixel` font that is used extensively in *Schmupinator*.
