import * as Autograder from '../../autograder/index.js';
import * as Core from '../core/index.js';
import * as Render from '../render/index.js';

const LOG_LEVELS = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'FATAL',
    'OFF',
];

function init() {
    Core.Routing.addRoute(Core.Routing.PATH_SERVER_LOGS, handlerLogs, 'View Logs', Core.Routing.NAV_SERVER);
}

function handlerLogs(path, params, context, container) {
    Render.setTabTitle('View Logs');

    let levelChoices = LOG_LEVELS.map(function(level) {
        return new Render.SelectOption(level);
    });

    let inputFields = [
        new Render.FieldType(context, 'level', 'Level', {
            type: Render.INPUT_TYPE_SELECT,
            choices: levelChoices,
            defaultValue: 'INFO',
        }),
        new Render.FieldType(context, 'target-email', 'Target Email', {
            type: Render.INPUT_TYPE_EMAIL,
        }),
        new Render.FieldType(context, 'target-course', 'Target Course'),
        new Render.FieldType(context, 'target-assignment', 'Target Assignment'),
        new Render.FieldType(context, 'after', 'After Timestamp'),
        new Render.FieldType(context, 'past', 'Past Window', {
            placeholder: 'Example: 24h',
        }),
    ];

    Render.makePage(
        params, context, container, queryLogs,
        {
            header: 'View Logs',
            description: 'Query server logs by level and optional filters.',
            inputs: inputFields,
            buttonName: 'Query Logs',
            iconName: Render.ICON_NAME_LIST,
        },
    );
}

function queryLogs(params, context, container, inputParams) {
    return Autograder.Misc.callEndpoint({
            targetEndpoint: 'logs/query',
            params: inputParams,
            clearContextUser: false,
        })
        .then(function(result) {
            if (!result.success) {
                return Render.autograderError(result?.error?.message ?? 'Failed to query logs.');
            }

            if (result.results.length === 0) {
                return '<p>No logs matched your query.</p>';
            }

            Render.apiOutputSwitcher(result.results, container, {
                renderOptions: new Render.APIValueRenderOptions({
                    keyOrdering: ['timestamp', 'level', 'message', 'attributes'],
                    initialIndentLevel: -1,
                }),
                modes: [
                    Render.API_OUTPUT_SWITCHER_TEXT,
                    Render.API_OUTPUT_SWITCHER_TABLE,
                    Render.API_OUTPUT_SWITCHER_JSON,
                ],
            });

            return undefined;
        })
        .catch(function(message) {
            console.error(message);
            return Render.autograderError(message);
        })
    ;
}

init();
