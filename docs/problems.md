* I am not really sure how this problem works with window.onload. Assumably vite uses window.onload
but currently I am not using window.onload manually myself in the code. This might be a problem if
I decide to stop using vite.

* I use offsetWidth and offsetHeight to center texts, these will NOT work if the font has not
already loaded. The centering will thus screw up. Currently I load the font with js before anything
else and it seems to work.