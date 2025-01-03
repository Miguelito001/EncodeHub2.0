document.addEventListener('DOMContentLoaded', function () {
    const measureConversionRates = {
      meters: 1,
      kilometers: 0.001,
      centimeters: 100,
      miles: 0.000621371,
      feet: 3.28084,
    };
  
    const convertMeasure = (section) => {
      const value = parseFloat(section.querySelector('.large-area--input').value);
      const fromUnit = section.querySelector('#input-format').value;
      const toUnit = section.querySelector('#output-format').value;
  
      if (isNaN(value)) {
        section.querySelector('.large-area--output').value = 'Por favor, insira um valor válido.';
        return;
      }
  
      const result =
        (value * measureConversionRates[toUnit]) / measureConversionRates[fromUnit];
      section.querySelector('.large-area--output').value = `Resultado: ${result.toFixed(2)} ${toUnit}`;
    };
  
    const convertCurrency = async (section) => {
      const value = parseFloat(section.querySelector('.large-area--input').value);
      const fromCurrency = section.querySelector('#input-format').value;
      const toCurrency = section.querySelector('#output-format').value;
  
      if (isNaN(value)) {
        section.querySelector('.large-area--output').value = 'Por favor, insira um valor válido.';
        return;
      }
  
      try {
        const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        const response = await fetch(url);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const result = value * rate;
        section.querySelector('.large-area--output').value = `Resultado: ${result.toFixed(2)} ${toCurrency}`;
      } catch (error) {
        section.querySelector('.large-area--output').value = 'Erro ao buscar taxas de câmbio.';
      }
    };
  
    document.querySelectorAll('.converter-section').forEach((section) => {
      const type = section.getAttribute('data-type');
      const button = section.querySelector('.controls__button--generate');
  
      button.addEventListener('click', () => {
        if (type === 'measure') {
          convertMeasure(section);
        } else if (type === 'currency') {
          convertCurrency(section);
        }
      });
    });
  });
  