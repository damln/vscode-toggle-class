// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

const originalClassesMap = new Map();
const SEPARATOR = "_URI_SEPARATOR_";
const CLASS_REGEX = /class(Name)?\s*[:=]\s*['"]([^'"]*)['"]/g;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let generateUUID = function (length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  let hideClasses = function (editor) {
    const document = editor.document;
    const documentText = document.getText();
    const hiddenClassText = documentText.replace(
      CLASS_REGEX,
      function (match, classContent, _offset) {
        /*

				Yeah bro, 2 is enough. It is 62^2 = 3844 combinations.
				If you have more than 3844 "class" attributes in your file, you have bigger problems than this extension.
				Life is too short to worry about this.
				Stay Strong.

				https://www.youtube.com/shorts/vuZszj2c-OU

				*/
        const uuid = generateUUID(2);
        const key = `${document.uri}${SEPARATOR}${uuid}`;

        originalClassesMap.set(key, match);

        const attributeSeparator = match.includes("=") ? "=" : ": ";
        const quote = match.includes('"') ? '"' : "'";
        const klassName = match.includes("className") ? "className" : "class";

        return `${klassName}${attributeSeparator}${quote}${uuid}${quote}`;
      }
    );

    editor.edit(function (editBuilder) {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(documentText.length)
        ),
        hiddenClassText
      );
    });
  };

  let showClasses = function (editor) {
    const document = editor.document;
    const documentText = document.getText();

    const restoredClassText = documentText.replace(
      CLASS_REGEX,
      function (match, _klass, classContent) {
        const key = `${document.uri}${SEPARATOR}${classContent}`;
        const value = originalClassesMap.get(key);
        const originalClass = value.split(SEPARATOR).at(-1);

        return originalClass;
      }
    );

    editor.edit(function (editBuilder) {
      editBuilder.replace(
        new vscode.Range(
          document.positionAt(0),
          document.positionAt(documentText.length)
        ),
        restoredClassText
      );

      cleanMapForCurrentFile(editor);
    });
  };

  // GLOBAL MAP:
  let cleanMapForCurrentFile = function (editor) {
    if (editor) {
      originalClassesMap.forEach((_value, key) => {
        const uri = key.split(SEPARATOR).at(0);

        if (editor.document.uri.toString() === uri) {
          originalClassesMap.delete(key);
        }
      });
    }
  };

  let mapHasValuesForCurrentFile = function (editor) {
    let hasValues = false;

    if (editor) {
      originalClassesMap.forEach((_value, key) => {
        const uri = key.split(SEPARATOR).at(0);

        if (editor.document.uri.toString() === uri) {
          hasValues = true;
        }
      });
    }

    return hasValues;
  };

  // COMMANDS:
  let hideClassesCommand = vscode.commands.registerCommand(
    "toggle-class.hideClasses",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        hideClasses(editor);
      }
    }
  );

  let showClassesCommand = vscode.commands.registerCommand(
    "toggle-class.showClasses",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        showClasses(editor);
      }
    }
  );

  let toggleClassesCommand = vscode.commands.registerCommand(
    "toggle-class.toggleClasses",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        if (mapHasValuesForCurrentFile(editor)) {
          showClasses(editor);
        } else {
          hideClasses(editor);
        }
      }
    }
  );

  context.subscriptions.push(hideClassesCommand);
  context.subscriptions.push(showClassesCommand);
  context.subscriptions.push(toggleClassesCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
