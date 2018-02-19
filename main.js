

define(function (require, exports, module) {
    "use strict";

    var AppInit             = app.getModule("utils/AppInit"),
        Repository          = app.getModule("core/Repository"),
        Engine              = app.getModule("engine/Engine"),
        Commands            = app.getModule("command/Commands"),
        CommandManager      = app.getModule("command/CommandManager"),
        MenuManager         = app.getModule("menu/MenuManager"),
        Dialogs             = app.getModule("dialogs/Dialogs"),
        ElementPickerDialog = app.getModule("dialogs/ElementPickerDialog"),
        FileSystem          = app.getModule("filesystem/FileSystem"),
        FileSystemError     = app.getModule("filesystem/FileSystemError"),
        ExtensionUtils      = app.getModule("utils/ExtensionUtils"),
        UML                 = app.getModule("uml/UML");

    var CodeGenUtils        = require("CodeGenUtils"),
        SwiftPreferences     = require("SwiftPreferences"),
        SwiftCodeGenerator   = require("SwiftCodeGenerator"),
        SwiftReverseEngineer = require("SwiftReverseEngineer");

    /**
     * Commands IDs
     */
    var CMD_SWIFT           = 'Swift',
        CMD_SWIFT_GENERATE  = 'Swift.generate',
        CMD_SWIFT_REVERSE   = 'Swift.reverse',
        CMD_SWIFT_CONFIGURE = 'Swift.configure';

    /**
     * Command Handler for Swift Generate
     *
     * @param {Element} base
     * @param {string} path
     * @param {Object} options
     * @return {$.Promise}
     */
    function _handleGenerate(base, path, options) {
        var result = new $.Deferred();

        // If options is not passed, get from preference
        options = options || SwiftPreferences.getGenOptions();

        // If base is not assigned, popup ElementPicker
        if (!base) {
            ElementPickerDialog.showDialog("Select a base model to generate codes", null, type.UMLPackage)
                .done(function (buttonId, selected) {
                    if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                        base = selected;

                        // If path is not assigned, popup Open Dialog to select a folder
                        if (!path) {
                            FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                                if (!err) {
                                    if (files.length > 0) {
                                        path = files[0];
                                        SwiftCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                                    } else {
                                        result.reject(FileSystem.USER_CANCELED);
                                    }
                                } else {
                                    result.reject(err);
                                }
                            });
                        } else {
                            SwiftCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                        }
                    } else {
                        result.reject();
                    }
                });
        } else {
            // If path is not assigned, popup Open Dialog to select a folder
            if (!path) {
                FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                    if (!err) {
                        if (files.length > 0) {
                            path = files[0];
                            SwiftCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                        } else {
                            result.reject(FileSystem.USER_CANCELED);
                        }
                    } else {
                        result.reject(err);
                    }
                });
            } else {
                SwiftCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
            }
        }
        return result.promise();
    }

    /**
     * Command Handler for Swift Reverse
     *
     * @param {string} basePath
     * @param {Object} options
     * @return {$.Promise}
     */
    function _handleReverse(basePath, options) {
        var result = new $.Deferred();

        // If options is not passed, get from preference
        options = SwiftPreferences.getRevOptions();

        // If basePath is not assigned, popup Open Dialog to select a folder
        if (!basePath) {
            FileSystem.showOpenDialog(false, true, "Select Folder", null, null, function (err, files) {
                if (!err) {
                    if (files.length > 0) {
                        basePath = files[0];
                        SwiftReverseEngineer.analyze(basePath, options).then(result.resolve, result.reject);
                    } else {
                        result.reject(FileSystem.USER_CANCELED);
                    }
                } else {
                    result.reject(err);
                }
            });
        }
        return result.promise();
    }


    /**
     * Popup PreferenceDialog with Swift Preference Schema
     */
    function _handleConfigure() {
        CommandManager.execute(Commands.FILE_PREFERENCES, SwiftPreferences.getId());
    }

    // Register Commands
    CommandManager.register("SwiftCodeGen",            CMD_SWIFT,           CommandManager.doNothing);
    CommandManager.register("Generate Code...", CMD_SWIFT_GENERATE,  _handleGenerate);
    CommandManager.register("Reverse Code...",  CMD_SWIFT_REVERSE,   _handleReverse);
    CommandManager.register("Configure...",     CMD_SWIFT_CONFIGURE, _handleConfigure);

    var menu, menuItem;
    menu = MenuManager.getMenu(Commands.TOOLS);
    menuItem = menu.addMenuItem(CMD_SWIFT);
    menuItem.addMenuItem(CMD_SWIFT_GENERATE);
//    menuItem.addMenuItem(CMD_SWIFT_REVERSE);
    menuItem.addMenuDivider();
    menuItem.addMenuItem(CMD_SWIFT_CONFIGURE);

});
