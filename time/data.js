document.addEventListener('DOMContentLoaded', function () {
    // Função para calcular carga horária
    const calculateWorkHours = (section) => {
        const input = section.querySelector('.large-area--input').value.trim();
        const output = section.querySelector('.large-area--output');

        if (!input) {
            output.value = 'Por favor, insira os horários no formato correto.';
            return;
        }

        const horarios = input.split(',');

        if (horarios.length < 3) {
            output.value = 'Insira pelo menos 3 horários: entrada, saída para almoço e retorno do almoço.';
            return;
        }

        // Convertendo horários para minutos desde o início do dia
        const [entrada, saidaAlmoco, retornoAlmoco, saidaFinal] = horarios.map(horario => {
            if (!horario) return null;
            const [horas, minutos] = horario.split(':').map(Number);
            return horas * 60 + minutos;
        });

        if (horarios.length === 3 || !saidaFinal) {
            // Se o quarto horário não for preenchido, calcula o horário necessário para fechar 8 horas
            const trabalhoManha = saidaAlmoco - entrada;
            const trabalhoTarde = 8 * 60 - trabalhoManha; // Completa 8h no total
            const horarioSaidaNecessario = retornoAlmoco + trabalhoTarde;

            const horasSaida = Math.floor(horarioSaidaNecessario / 60);
            const minutosSaida = horarioSaidaNecessario % 60;

            output.value = `Para completar 8 horas, o horário de saída deve ser: ${horasSaida.toString().padStart(2, '0')}:${minutosSaida.toString().padStart(2, '0')}`;
        } else {
            // Caso todos os 4 horários sejam preenchidos
            const horasTrabalhadas = (saidaAlmoco - entrada) + (saidaFinal - retornoAlmoco);
            const horas = Math.floor(horasTrabalhadas / 60);
            const minutos = horasTrabalhadas % 60;

            output.value = `Total: ${horas} horas e ${minutos} minutos.`;
        }
    };

    // Função para calcular data final
    const calculateFinalDate = (section) => {
        const input = section.querySelector('.large-area--input').value.trim();
        const output = section.querySelector('.large-area--output');

        if (!input) {
            output.value = 'Por favor, insira a data inicial e a quantidade de horas.';
            return;
        }

        const [dataInicial, horas] = input.split(',');
        if (!dataInicial || isNaN(horas) || horas <= 0) {
            output.value = 'Formato inválido. Use: YYYY-MM-DD,horas (exemplo: 2025-01-21,16).';
            return;
        }

        const feriadosGenericos = ['01-01', '04-21', '05-01', '09-07', '12-25'];

        try {
            const data = new Date(dataInicial);
            let horasRestantes = parseInt(horas, 10);

            while (horasRestantes > 0) {
                data.setDate(data.getDate() + 1);

                const diaSemana = data.getDay();
                const mesDia = data.toISOString().slice(5, 10);

                if (diaSemana !== 0 && diaSemana !== 6 && !feriadosGenericos.includes(mesDia)) {
                    const horasDia = Math.min(8, horasRestantes);
                    horasRestantes -= horasDia;
                }
            }

            output.value = `Data Final: ${data.toLocaleDateString('pt-BR')}`;
        } catch {
            output.value = 'Erro ao calcular a data. Verifique os valores inseridos.';
        }
    };

    // Adicionando os eventos para cada seção
    document.querySelectorAll('.converter-section').forEach((section) => {
        const type = section.getAttribute('data-type');
        const button = section.querySelector('.controls__button--generate');

        button.addEventListener('click', () => {
            if (type === 'time-calculator') {
                calculateWorkHours(section);
            } else if (type === 'date-calculator') {
                calculateFinalDate(section);
            }
        });
    });
});
