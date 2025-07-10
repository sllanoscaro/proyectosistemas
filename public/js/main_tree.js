document.addEventListener('DOMContentLoaded', () => {
    // Selectores para los elementos
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const creditAmountSlider = document.getElementById('creditAmountSlider');
    const creditAmountValue = document.getElementById('creditAmountValue');
    const jobDurationSlider = document.getElementById('jobDurationSlider');
    const jobDurationValue = document.getElementById('jobDurationValue');
    const incomeSlider = document.getElementById('incomeSlider');
    const incomeValue = document.getElementById('incomeValue');
    const submitBtn = document.getElementById('submitBtn');

    // Estado inicial de los botones Sí/No
    let hasDebtHistory = true; // Por defecto 'Sí' está activo

    // Función para formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Actualizar el valor inicial de los sliders
    creditAmountValue.textContent = formatCurrency(parseInt(creditAmountSlider.value));
    updateJobDurationValue(parseInt(jobDurationSlider.value));
    incomeValue.textContent = formatCurrency(parseInt(incomeSlider.value));


    // Lógica para los botones Sí/No
    btnYes.addEventListener('click', () => {
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
        hasDebtHistory = true;
    });

    btnNo.addEventListener('click', () => {
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
        hasDebtHistory = false;
    });

    // Lógica para el slider de Monto del crédito solicitado
    creditAmountSlider.addEventListener('input', () => {
        creditAmountValue.textContent = formatCurrency(parseInt(creditAmountSlider.value));
    });

    // Lógica para el slider de Duración en el trabajo actual
    // Función para actualizar el texto de duración (años y meses)
    function updateJobDurationValue(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let text = '';
        if (years > 0) {
            text += `${years} año${years > 1 ? 's' : ''}`;
        }
        if (remainingMonths > 0) {
            if (years > 0) text += ' ';
            text += `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
        }
        if (years === 0 && remainingMonths === 0) {
            text = '0 meses'; // O el valor mínimo que quieras representar
        }
        jobDurationValue.textContent = text;
    }

    jobDurationSlider.addEventListener('input', () => {
        updateJobDurationValue(parseInt(jobDurationSlider.value));
    });

    // Lógica para el slider de Ingresos del último mes
    incomeSlider.addEventListener('input', () => {
        incomeValue.textContent = formatCurrency(parseInt(incomeSlider.value));
    });

    // Lógica para el botón de enviar
    submitBtn.addEventListener('click', () => {
        const data = {
            historialMorosidad: hasDebtHistory ? 'Sí' : 'No',
            montoCredito: parseInt(creditAmountSlider.value),
            duracionTrabajoMeses: parseInt(jobDurationSlider.value),
            ingresosUltimoMes: parseInt(incomeSlider.value)
        };
        console.log('Datos de entrada:', data);
        alert('Datos enviados (ver consola para más detalles).');
        // Aquí podrías agregar la lógica para enviar estos datos a tu modelo de árbol de decisión
        // o a otra función de JavaScript para procesamiento.
    });
});