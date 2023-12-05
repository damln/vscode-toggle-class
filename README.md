# vscode-toggle-class README

<p align="center">
  <img src="https://raw.githubusercontent.com/damln/vscode-toggle-class/dead8ef2c224d47b6b26116375ed9914d1c9212b/images/vscode-demo.gif" />
</p>

[Download ToggleClass extension on the VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=damln.toggle-class)
## Features

Toggle the content of all `class` in the current file.
It supports these patterns (in any file type)

```
class="bg-white border"
class='bg-white border'

class: 'bg-white border'
class: "bg-white border"

className="bg-white border"
className='bg-white border'

className: "bg-white border"
className: 'bg-white border'
```

Allows you to have a cleaner HTML when you need to focus on the content, not the class.
Then you can display back the original classes.

Very useful when working with Tailwind CSS and you have dozens of classes in the `class` attribute on many HTML nodes.

## Commands


```
    [
      {
        "command": "toggle-class.hideClasses",
        "title": "HTML: Hide Classes"
      },
      {
        "command": "toggle-class.showClasses",
        "title": "HTML: Show Classes"
      },
      {
        "command": "toggle-class.toggleClasses",
        "title": "HTML: Toggle Classes"
      }
    ]
```
