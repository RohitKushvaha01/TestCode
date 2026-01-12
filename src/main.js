import plugin from '../plugin.json';
import { runSanityTests } from './tests/sanity.tests.js';
import { runAceEditorTests } from './tests/editor.tests.js';


class AcodePlugin {

  async init() {
    // plugin initialisation 
    editorManager.editor.commands.addCommand({
      name: "saveFile",
      bindKey: {
        win: "Ctrl-T",
        mac: "Command-T"
      },
      exec: async function (editor) {
        const terminal = acode.require('terminal');
        const local = await terminal.createLocal({ name: 'TestCode' });
        function write(data) {
          terminal.write(local.id, data);
        }

        // Run tests at runtime
        write('\x1b[36m\x1b[1m🚀 TestCode Plugin Loaded\x1b[0m\n');
        write('\x1b[36m\x1b[1mStarting test execution...\x1b[0m\n');

        try {
          // Run unit tests
          await runSanityTests(write);
          await runAceEditorTests(write);


          write('\x1b[36m\x1b[1mTests completed!\x1b[0m\n');
        } catch (error) {
          write(`\x1b[31m⚠️ Test execution error: ${error.message}\x1b[0m\n`);
        }
      }
    });

  } async destroy() {
    // plugin clean up
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
