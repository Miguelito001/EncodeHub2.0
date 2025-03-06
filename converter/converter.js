document.addEventListener('DOMContentLoaded', function () {
    const ConverterModule = (function () {
        const x2js = new X2JS();

        const selectors = {
            inputArea: document.querySelector('.large-area--input'),
            outputArea: document.querySelector('.large-area--output'),
            inputTypeSelect: document.querySelector('#input-format'),
            outputTypeSelect: document.querySelector('#output-format')
        };

        function normalizeJsonInput(input) {
            try {
                if (typeof input === "object") {
                    return input; // Se já for um objeto JS, retorna direto
                }
                return JSON.parse(input); // Se for string JSON válida, parseia
            } catch {
                throw new Error("O JSON fornecido não é válido.");
            }
        }

        const conversionFunctions = {
            'json': {
                'json': (input) => JSON.stringify(normalizeJsonInput(input), null, 2),
                'xml': (input) => jsonToXml(normalizeJsonInput(input)),
                'yaml': (input) => jsonToYaml(normalizeJsonInput(input)),
            },
            'json-like': { // Trata como JSON
                'json': (input) => JSON.stringify(normalizeJsonInput(input), null, 2),
                'xml': (input) => jsonToXml(normalizeJsonInput(input)),
                'yaml': (input) => jsonToYaml(normalizeJsonInput(input)),
            },
            'xml': {
                'json': (input) => xmlToJson(input),
                'json-like': (input) => xmlToJson(input), // Trata XML -> JSON-like da mesma forma
                'xml': (input) => formatXml(input),
                'yaml': (input) => jsonToYaml(xmlToJson(input)),
            },
            'yaml': {
                'json': (input) => yamlToJson(input),
                'json-like': (input) => yamlToJson(input), // Trata YAML -> JSON-like da mesma forma
                'xml': (input) => jsonToXml(yamlToJson(input)),
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
                selectors.outputArea.value = 'Erro: ' + error.message;
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
                const wrappedXml = `<root>${xml}</root>`;
                const parser = new DOMParser();
                const parsedXml = parser.parseFromString(wrappedXml, "text/xml");

                if (parsedXml.getElementsByTagName("parsererror").length) {
                    throw new Error("O XML fornecido não é bem formado.");
                }

                const jsonObj = x2js.xml_str2json(wrappedXml);
                if (!jsonObj) {
                    throw new Error("O XML fornecido é inválido ou vazio.");
                }

                return JSON.stringify(jsonObj.root, null, 2);
            } catch (error) {
                throw new Error("Erro ao converter XML para JSON: " + error.message);
            }
        }

        function yamlToJson(yaml) {
            try {
                const jsonObj = jsyaml.load(yaml);
                return JSON.stringify(jsonObj, null, 2);
            } catch (error) {
                throw new Error("Erro ao converter YAML para JSON: " + error.message);
            }
        }

        function jsonToXml(json) {
            try {
                const jsonObj = normalizeJsonInput(json);
                return formatXml(x2js.json2xml_str(jsonObj));
            } catch (error) {
                throw new Error("Erro ao converter JSON para XML: " + error.message);
            }
        }

        function jsonToYaml(json) {
            try {
                const jsonObj = normalizeJsonInput(json);
                return jsyaml.dump(jsonObj);
            } catch (error) {
                throw new Error("Erro ao converter JSON para YAML: " + error.message);
            }
        }

        function formatYaml(yaml) {
            try {
                const formattedYAML = jsyaml.load(yaml);
                return jsyaml.dump(formattedYAML);
            } catch (error) {
                throw new Error("Erro ao formatar YAML: " + error.message);
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
