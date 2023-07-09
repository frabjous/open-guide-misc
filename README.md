# open-guide-misc

A random collection of php and javascript helper scripts used in my [open guide project](https://github.com/frabjous/open-guide-typesetting-framework) and might be useful for other projects.

Probably not much value except as a helper library to the other open-guide projects.

A description of each important file:

## dialog.mjs

A JavaScript module for creating very simple user-interfaces.

Usage: simply load the script and its style files. The functions also assume that Google’s [Material Symbols](https://fonts.google.com/icons) are available, so they will need to be loaded as well.

```html
<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Material+Symbols+Outlined">
<link rel="stylesheet" type="text/css" href="open-guide-misc/dialog.css">
<script type="module” src="open-guide-misc/dialog.mjs”></script>
```
It will create an object called `ogDialog` in the global namespace in the browser which contains useful functions.

The important functions provided are these:

```javascript
// returns an element of the given tagtype, appends it to the
// specified parentnode, adds all the (css) classes in the
// styleclasses array, and assigns it the specified id
ogDialog.newelem(tagtype, parentnode, styleclasses, elementid) → elem

// this creates an alert/info dialogue with the text in str;
// the Material Symbol icon with the specified name (use
// all lowercase and underscores for spaces), a CSS class
// name, and the text of the button to click;
// the icconname defaults to “info”, the class to “alert”
// and the button text to “OK”
ogDialog.alertdiag(str, iconname, icondivcls, buttontext)

// this is like alertdiag but uses ‘error’ for
// both the icon and the class
ogDialog.errdiag(str, buttontext)

// this brings up a dialogue to choose a filename, either
// of an existing file on the server, or of a new file, then
// calls the callback with the directory and basename of
// the file chosen as arguments; you also specify the
// starting directory in which to look, the prompt, which
// defaults to “Choose a file:”, a boolean to specify
// whether a newfile or old file, and the relative location
// of the get-file-list.php script with which it interacts
ogDialog.filechoose(callback, startingdir, prompt, newfile, location)

// a generic dialogue for selecting items from a given
// list of strings and running a callback on the selected item
ogDialog.listselect(optionslist, prompt, callback)

// a function that creates a spinny wheel preventing the
// user from interacting with the screen while it is visible
ogDialog.waitscreen()

// clears the result of the previous function
ogDialog.removewait()

// a function for creating an arbitrary pop-up form;
// the first argument will be used as the innerHTML of
// the form; you can either allow a close button or
// not, and specify what that close button looks
// like; the latter two arguments are optional and you
// will get sane defaults without them
ogDialogue.popupform(htmltext, allowclose, closebuttontext)
```

## fetch.mjs

This file defines a single asynchronous function useful for sending json-encodable objects to the server and returning an promise for an object obtained by decoding the json response.
```javascript
[async] postData(url, data) → promise of object
```

## formreader.mjs

This defiles a function that takes a DOM element as argument, and returns a json-serializable object containing the &lt;input&gt;,  &lt;textarea&gt;, and &lt;select&gt; fields (by id or name) and their values inside the element; checkboxes are assigned booleans, and radio boxes just one value for the name.

```js
getformfields(elem) → object containing key→value pairings
```

## get-file-list.php

A php script that returns a list of files as requested by the `ogDialog.filechoose` function in `dialog.mjs` as stdout.

The result is structured like the following example:

```json
{
    error: false,
    dir: '/path/indexed',
    listData: [
        {
            dirName: '/dirname/of/file',
            name: 'basename.ext',
            isFolder: false
        },
        {
            dirName: '/parent/path',
            name: 'directoryname',
            isFolder: true
        },
        ⁞
    ]
}
```

## hostinfo.php

Defines three functions useful for determining the URL currently being served, its host, and its path.

```php
full_host() // returns host name of current request
full_url() // returns complete url of request
full_path() // returns complete url but without ?= url parameters

```

## json-request.php

When required by another PHP script, this script will read JSON data send as stdin to the script, parse it as the object `$data`, and destructure the top level keys it contains as global variables to the script. E.g., `$data->something` will also be available as `$something`. This script loads `send-as-json.php` as well, and if it cannot parse the input as JSON, it quits with a `rage_quit`-style error.

## libservelet.php

Defines a single function that can be used either for sending files from the PHP server, or sending the stdout of a command as if it were a file. The argument is a single associative array defining the parameters.

```php

servelet_send(array(
    "attachmentname" => "nameoffilefordownload.txt", [optional],
    "command" => "command to output result of", [optional],
    "download" => <boolean>, [whether to send as download; optional],
    "filename" => "nameoffile.ext", [to send or use; mandatory],
    "mimetype" => "something/mimetype", [optional if sending file]
));
```

## pipe.php

This file defines a single function that can be used to run a shell command with arbitrary text as stdin and capture its stdout and stderr and exit value.

```php
pipe_to_command(shellcommand, stdin) // yields object with stdin, stderr and returnvalue attributes
```

The object that is the return value, `$rv`, has three attributes `$rv->stdout`, `$rv->stderr` and `$rv->returnvalue`.

## reversethis.php

A silly PHP page/script that takes a single string as a url parameter `?s=something`, and returns the reversed string, in this example `gnihtemos` as plain text.

## send-as-json.php

Defines four PHP functions. (1) `send_as_json` sends json encoding of a jsonable object to stdout, while setting the http status (200 by default) and content-type headers appropriate for such a response; (2) `jsend` which is just like `send_as_json` but uses the global `$rv` (return value) variable, (3) `rage_quit` also outputs json and sets the http status (400 by default), but with an attribute `error` set to true and an `errMsg` passed to the browser, and exits the execution of the script, and (4) `jquit` which is just like `rage_quit` except uses the global `$rv` object.

```php
send_as_json($obj_to_serialize, $httpstatus)
jsend($httpstatus)
rage_quit($obj_to_serialize, $errormessage, $httpstatus)
jquit($errormessage, $httpstatus)
```

## stream.php

Defines a single PHP function that outputs a media file (audio, video) in chunks to allow streaming, and sets the header to the appropriate Content-Type.

```php
stream($mediafilename, $content_type)
```

## License

Copyright © 2023 Kevin C. Klement. This is free software, which can be redistributed and/or modified under the terms of the [GNU General Public License (GPL), version 3](https://www.gnu.org/licenses/gpl.html).
