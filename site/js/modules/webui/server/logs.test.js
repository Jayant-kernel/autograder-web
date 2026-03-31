import * as Core from '../core/index.js';
import * as Render from '../render/index.js';
import * as Test from '../test/index.js';

test('Server Logs Query', async function() {
    await Test.loginUser('server-admin');
    await Test.navigate(Core.Routing.PATH_SERVER_LOGS);

    Test.checkPageBasics('View Logs', 'view logs');

    await Test.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('API Server Created.');
});

describe('Server Logs Query, Output Switching', function() {
    // [[mode, prefix], ...]
    const testCases = [
        [Render.API_OUTPUT_SWITCHER_JSON, '"message": "'],
        [Render.API_OUTPUT_SWITCHER_TABLE, '<td>'],
        [Render.API_OUTPUT_SWITCHER_TEXT, 'Message: '],
    ];

    test.each(testCases)("%s", async function(mode, prefix) {
        await Test.loginUser('server-admin');
        await Test.navigate(Core.Routing.PATH_SERVER_LOGS);

        Test.checkPageBasics('View Logs', 'view logs');

        await Test.submitTemplate();

        let button = document.querySelector(`.output-switcher .controls button.${mode.toLowerCase()}`);
        button.click();

        let results = document.querySelector('.results-area').innerHTML;
        expect(results).toContain(prefix);
    });
});
