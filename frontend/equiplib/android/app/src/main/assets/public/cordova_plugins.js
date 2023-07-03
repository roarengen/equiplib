
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-flashlight.Flashlight",
          "file": "plugins/cordova-plugin-flashlight/www/Flashlight.js",
          "pluginId": "cordova-plugin-flashlight",
        "clobbers": [
          "window.plugins.flashlight"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-flashlight": "3.2.0"
    };
    // BOTTOM OF METADATA
    });
    