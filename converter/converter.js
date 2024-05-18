document.addEventListener('DOMContentLoaded', function () {
    const inputArea = document.querySelector('.large-area--input');
    const outputArea = document.querySelector('.large-area--output');
    const inputTypeSelect = document.querySelector('.controls__button--select');
    const outputTypeSelect = document.querySelector('.controls__button--convert');
    var x2js = new X2JS();

    // Funções de conversão
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

    // Função para lidar com o processo de conversão
    function convert() {
        const inputType = inputTypeSelect.value;
        const outputType = outputTypeSelect.value;
        const inputText = inputArea.value.trim();

        try {
            if (!inputText) {
                outputArea.value = '';
                return;
            }

            // Verifica se a função de conversão existe
            if (conversionFunctions[inputType] && conversionFunctions[inputType][outputType]) {
                outputArea.value = conversionFunctions[inputType][outputType](inputText);
            } else {
                outputArea.value = inputText; // Alternativa caso não seja necessário conversão
            }
        } catch (error) {
            outputArea.value = 'Error: ' + error.message;
        }

        // Salvar os valores no localStorage
        localStorage.setItem('inputText', inputText);
        localStorage.setItem('inputType', inputType);
        localStorage.setItem('outputType', outputType);
    }

    // Listeners de eventos
    inputTypeSelect.addEventListener('change', convert);
    outputTypeSelect.addEventListener('change', convert);
    inputArea.addEventListener('input', convert);

    // Carregar valores do localStorage ao carregar a página
    function loadFromLocalStorage() {
        const savedInputText = localStorage.getItem('inputText');
        const savedInputType = localStorage.getItem('inputType');
        const savedOutputType = localStorage.getItem('outputType');


        if (savedInputText !== null) {
            inputArea.value = savedInputText;
        }
        if (savedInputType !== null) {
            inputTypeSelect.value = savedInputType;
        }
        if (savedOutputType !== null) {
            outputTypeSelect.value = savedOutputType;
        }

        convert(); // Realiza a conversão inicial com os valores carregados
    }

    loadFromLocalStorage();

    // Funções para transformar XML em JSON
    function xmlToJson(xml) {
        try {
            const jsonObj = x2js.xml_str2json(xml);
            return jsonObj;
        } catch (error) {
            return "XML com erro: " + error.message;
        }
    }

    // Funções para transformar YAML em JSON
    function yamlToJson(yaml) {
        try {
            const jsonData = jsyaml.load(yaml);
            return JSON.stringify(jsonData, null, 2);
        } catch (error) {
            return "Error: " + error.message;
        }
    }

    // Funções para transformar JSON em XML
    function jsonToXml(json) {
        try {
            const xmlObj = x2js.json2xml_str(json);
            return formatXml(xmlObj);
        } catch (error) {
            return "JSON com erro: " + error.message;
        }
    }

    // Função para formatar YAML
    function formatYaml(yaml) {
        try {
            const formattedYAML = jsyaml.load(yaml);
            return jsyaml.dump(formattedYAML);
        } catch (error) {
            return "Error: " + error.message;
        }
    }

    // Função para formatar XML
    function formatXml(xml) {
        const PADDING = '  '; // Define a indentação
        const reg = /(>)(<)(\/*)/g;
        let pad = 0;
        let formatted = '';
        xml = xml.replace(reg, '$1\r\n$2$3');
        xml.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
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
});
