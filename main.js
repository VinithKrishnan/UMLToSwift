/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */

define(function (require, exports, module) {
    "use strict";
    var Dialogs = app.getModule('dialogs/Dialogs');
    var Commands       = app.getModule("command/Commands"),
        CommandManager = app.getModule("command/CommandManager"),
        MenuManager    = app.getModule("menu/MenuManager"),
        ProjectManager =app.getModule('engine/ProjectManager');
    var FileSystem = app.getModule("filesystem/FileSystem"),
        FileUtils  = app.getModule("file/FileUtils");

    // Handler for HelloWorld command
    function handleHelloWorld() {
      var project=ProjectManager.getProject();
      var model=project.ownedElements[0];
      var mainDiagram=model.ownedElements[0];
        var string = mainDiagram.name;
      for(var j=1;j<model.ownedElements.length;j++){
        string+="\n\t"+model.ownedElements[j].name;
     for(var i=0;i<model.ownedElements[j].attributes.length;i++) {
      string+="\n\t\t"+model.ownedElements[j].attributes[i].name;
    }
    }
  /*    var book=model.ownedElements[1];
      var author = model.ownedElements[2];

      string+="\n\t"+book.name;
      for(var i=0;i<book.attributes.length;i++){string+="\n\t\t"+book.attributes[i].name};
         string+="\n\t"+author.name;
      for(var i=0;i<author.attributes.length;i++){string+="\n\t\t"+author.attributes[i].name};*/
      var file = FileSystem.getFileForPath("/Users/Vinith/Diagram.txt");
      FileUtils.writeText(file, string, true)
    .done(function () {
        console.log("File saved.");
    })
    .fail(function (err) {
        console.error(err);
    });
    //  FileUtils.writeStringToFile(file, string);
    /* .done(function () {
        console.log("File saved.");
      })
     .fail(function (err) {
        console.error(err);
    });*/
      // Dialogs.showInfoDialog(string);
      // window.alert(string);
    }

    // Hello World Command
    var CMD_HELLOWORLD = "tools.helloworld";
    CommandManager.register("Diagram Descriptor", CMD_HELLOWORLD, handleHelloWorld);

    // Adds HellWorld menu item (Tools > Hello World)
    var menu = MenuManager.getMenu(Commands.TOOLS);
    menu.addMenuItem(CMD_HELLOWORLD);

});
