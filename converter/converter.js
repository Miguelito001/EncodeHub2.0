document.addEventListener('DOMContentLoaded', function () {
    const ConverterModule = (function () {
        const x2js = new X2JS();
        
        const selectors = {
            inputArea: document.querySelector('.large-area--input'),
            outputArea: document.querySelector('.large-area--output'),
            inputTypeSelect: document.querySelector('.controls__button--select'),
            outputTypeSelect: document.querySelector('.controls__button--convert')
        };

        const conversionFunctions = {
            'json': {
                'json': (input) => JSON.stringify(JSON.parse(input), null, 2),
                'xml': (input) => jsonToXml(JSON.parse(input)),
                'yaml': (input) => jsyaml.dump(JSON.parse(input)),
            },
            'xml': {
                'json': (input) => JSON.stringify(xmlToJson(input), null, 2),
                'xml': (input) => formatXml(input),
                'yaml': (input) => jsyaml.dump(xmlToJson(input)),
            },
            'yaml': {
                'json': (input) => yamlToJson(input),
                'xml': (input) => formatXml(jsonToXml(JSON.parse(yamlToJson(input)))),
                'yaml': (input) => formatYaml(input),
            }
        };

        function convert() {
            const inputType = selectors.inputTypeSelect.value;
            const outputType = selectors.outputTypeSelect.value;
            const inputText = selectors.inputArea.value.trim();

            try {
                if (!inputText) {
                    selectors.outputArea.value = '';
                    return;
                }

                if (conversionFunctions[inputType] && conversionFunctions[inputType][outputType]) {
                    selectors.outputArea.value = conversionFunctions[inputType][outputType](inputText);
                } else {
                    selectors.outputArea.value = inputText;
                }
            } catch (error) {
                selectors.outputArea.value = 'Error: ' + error.message;
            }

            localStorage.setItem('inputText', inputText);
            localStorage.setItem('inputType', inputType);
            localStorage.setItem('outputType', outputType);
        }

        function loadFromLocalStorage() {
            const savedInputText = localStorage.getItem('inputText');
            const savedInputType = localStorage.getItem('inputType');
            const savedOutputType = localStorage.getItem('outputType');

            if (savedInputText !== null) {
                selectors.inputArea.value = savedInputText;
            }
            if (savedInputType !== null) {
                selectors.inputTypeSelect.value = savedInputType;
            }
            if (savedOutputType !== null) {
                selectors.outputTypeSelect.value = savedOutputType;
            }

            convert(); 
        }

        function xmlToJson(xml) {
            try {
                return x2js.xml_str2json(xml);
            } catch (error) {
                return "XML com erro: " + error.message;
            }
        }

        function yamlToJson(yaml) {
            try {
                return JSON.stringify(jsyaml.load(yaml), null, 2);
            } catch (error) {
                return "Error: " + error.message;
            }
        }

        function jsonToXml(json) {
            try {
                return formatXml(x2js.json2xml_str(json));
            } catch (error) {
                return "JSON com erro: " + error.message;
            }
        }

        function formatYaml(yaml) {
            try {
                const formattedYAML = jsyaml.load(yaml);
                return jsyaml.dump(formattedYAML);
            } catch (error) {
                return "Error: " + error.message;
            }
        }

        function formatXml(xml) {
            const PADDING = '  '; 
            const reg = /(>)(<)(\/*)/g;
            let pad = 0;
            let formatted = '';
            xml = xml.replace(reg, '$1\r\n$2$3');
            xml.split('\r\n').forEach((node) => {
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) pad -= 1;
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                formatted += new Array(pad + 1).join(PADDING) + node + '\r\n';
                pad += indent;
            });

            return formatted;
        }

        function initEventListeners() {
            selectors.inputTypeSelect.addEventListener('change', convert);
            selectors.outputTypeSelect.addEventListener('change', convert);
            selectors.inputArea.addEventListener('input', convert);
        }

        return {
            init: function () {
                loadFromLocalStorage();
                initEventListeners();
            }
        };

    })();

    ConverterModule.init();
});
