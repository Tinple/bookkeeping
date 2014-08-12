## bookkeeping ![npm](https://badge.fury.io/js/bookkeeping.png)

## Bookkeeping

A command line tool to bookkeeping everytime.

![](http://ttpphot.qiniudn.com/639994AA-ABFF-433A-B21B-09C738713004.png)

### Installation
````
$ [sudo] npm install bookkeeping -g
````

### Usage

```
  Usage: bookkeeping [options]

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -a, --add <desc>...<check>  Add a item
    -r, --remove <id>           Remove a item
    -c, --clear                 Clear all items
    -l, --list <format>         List all items
```

When you add your bookkeeping item, you should follow the convention that your
bookkeeping description and your check are splited by `...`.

```
$ bookkeeping -a 'buy a domain...￥65'
```

Pay attention that `$` should escape.

```
$ bookkeeping -a 'buy a domain...\$8.99'
```

You can list your check with `-l` flag, it requires a human format like `-3days` or 
`-4days~-2days` to list your check items.

```
$ bookkeeping -l '-3days~-1days'
```

![](http://ttpphot.qiniudn.com/F4D2D8AF-27E3-4F18-9E46-4E4DC23C10C2.png)

At last, you can also remove your check item with `-r` flag or `-c` flag, you should 
appoint an item id to remove when use `-r` flag. And `-c` flag will remove all of your
bookkeeping items.

![](http://ttpphot.qiniudn.com/3070A10C-D89F-4B1F-88F0-7C009D0AED3B.png)

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2014 tinple

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/doctor.png)
built upon love by [docor](https://github.com/turingou/docor.git) v0.1.3