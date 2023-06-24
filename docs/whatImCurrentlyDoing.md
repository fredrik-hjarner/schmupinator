* I need to make a simple 2nd level.
  * So I should decide upon a level to mimic, first.
* After that I should probably take small steps towards making stuff that makes
it easier to make levels, debug texts, debug buttons and tools etc.

* remove yaml and remove zip depencencies. The way I imagine it to work is that users upload a
js-file to a backend, then the backend runs that js file to generate a json, then the frontend loads
that json (that is a level). So at no point does the frontend need zip or yaml.