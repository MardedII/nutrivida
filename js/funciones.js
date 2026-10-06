function inicializarMapa() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const lat = -38.7397;
    const lng = -72.5901;
    const map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | Clínica NutriVida'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Clínica NutriVida<br>Av. Alemania #0855, Temuco.')
        .openPopup();
}

function ejecutarLogin(e) {
    e.preventDefault();
    const correo = document.getElementById('loginCorreo').value;
    const clave = document.getElementById('loginClave').value;
    const rol = document.getElementById('loginRol').value;
    if (!validarLogin(correo, clave)) return;
    if (rol === 'paciente') window.location.href = 'panel_paciente.html';
    else if (rol === 'medico') window.location.href = 'panel_medico.html';
    else if (rol === 'admin') window.location.href = 'panel_admin.html';
}

function ejecutarRegistro(e) {
    e.preventDefault();
    const nombre = document.getElementById('regNombre').value;
    const rut = document.getElementById('regRut').value;
    const correo = document.getElementById('regCorreo').value;
    const telefono = document.getElementById('regTelefono').value;
    const fechaNac = document.getElementById('regFechaNac').value;
    const genero = document.getElementById('regGenero').value;
    const clave = document.getElementById('regClave').value;
    const rol = document.getElementById('regRol').value;
    const acepto = document.getElementById('regTerminos').checked;
    
    if (!validarRegistro(nombre, rut, correo, telefono, fechaNac, genero, clave, rol, acepto)) return;
    alert(`¡Registro exitoso para ${nombre}! Ya puede iniciar sesión.`);
    window.location.href = 'login.html';
}

function agregarAgendamientoPaciente(e) {
    e.preventDefault();
    const nutricionista = document.getElementById('nutricionistaSelect').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora = document.getElementById('horaCita').value;
    const tbody = document.getElementById('tablaCitasPaciente');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${fecha}<br><small>${hora}</small></td>
        <td>${nutricionista}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="abrirModalModificar(this)">Modificar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="cancelarCita(this)">Cancelar</button>
        </td>
    `;
    tbody.appendChild(newRow);
    document.getElementById('formCitaPaciente').reset();
    alert('¡Cita agendada exitosamente! Se ha activado el recordatorio automático.');
}

function cancelarCita(btn) {
    if (confirm('¿Está seguro que desea cancelar esta cita?')) {
        const row = btn.closest('tr');
        row.innerHTML = `<td colspan="3" class="text-danger text-center">Cita cancelada. Horario liberado.</td>`;
    }
}

function alternarEstadoUsuario(btn) {
    const row = btn.closest('tr');
    const badge = row.querySelector('.badge-status');
    if (badge.classList.contains('bg-success')) {
        badge.className = 'badge bg-secondary badge-status';
        badge.textContent = 'Inactivo';
        btn.textContent = 'Activar';
        btn.className = 'btn btn-sm btn-outline-success';
    } else {
        badge.className = 'badge bg-success badge-status';
        badge.textContent = 'Activo';
        btn.textContent = 'Desactivar';
        btn.className = 'btn btn-sm btn-outline-danger';
    }
}

function filtrarPacientes() {
    const filtro = document.getElementById('buscarPaciente').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaPacientesMedico tbody tr');
    filas.forEach(fila => {
        const nombrePaciente = fila.cells[0].textContent.toLowerCase();
        fila.style.display = nombrePaciente.includes(filtro) ? '' : 'none';
    });
}

function confirmarAsistencia() {
    alert('¡Asistencia confirmada exitosamente! Te esperamos en la clínica.');
    const btn = document.getElementById('btnConfirmar');
    if(btn) btn.style.display = 'none';
    
    const accionesCita = document.getElementById('accionesCitaPaciente');
    if (accionesCita) {
        accionesCita.innerHTML = '<span class="badge bg-success">Asistencia Confirmada</span>';
    }
}

function registrarAusencia() {
    const nutri = document.getElementById('ausenciaNutri').value;
    const fecha = document.getElementById('ausenciaFecha').value;
    
    if (!fecha) {
        alert('Por favor, seleccione una fecha.');
        return;
    }
    
    alert(`Ausencia registrada para ${nutri} el día ${fecha}. Las citas de los pacientes han pasado a "Reprogramación Pendiente".`);
    
    const modalElement = document.getElementById('modalAusencias');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if(modalInstance) modalInstance.hide();
}

function calcularIMCTiempoReal() {
    const peso = parseFloat(document.getElementById('inputPeso').value) || 0;
    const talla = parseFloat(document.getElementById('inputTalla').value) || 0;
    const preview = document.getElementById('imcPreview');
    if (!preview) return;
    
    if (peso > 0 && talla > 0) {
        const imc = (peso / ((talla / 100) ** 2)).toFixed(1);
        preview.textContent = imc;
        if(imc > 25) preview.className = 'text-danger fw-bold';
        else preview.className = 'text-success fw-bold';
    } else {
        preview.textContent = "0.0";
        preview.className = 'text-primary';
    }
}

// --- NUEVAS FUNCIONALIDADES SOLICITADAS ---

// 1. Cambia el estado a "Atendiendo" en Mi Agenda de Hoy
function iniciarAtencion(btn) {
    const fila = btn.closest('tr');
    const celdaEstado = fila.cells[3]; // Columna de Estado
    celdaEstado.innerHTML = '<span class="badge bg-primary">Atendiendo</span>';
    btn.className = 'btn btn-sm btn-secondary disabled';
    btn.textContent = 'En Proceso';
}

// 2. Muestra la ventana emergente (Modal) con los datos del paciente
function verHistorialPaciente(nombre, peso, imc, cintura, dieta, rut, telefono, correo) {
    document.getElementById('modalNombrePaciente').textContent = nombre || 'Paciente';
    document.getElementById('modalRutPaciente').textContent = rut || '18.765.432-1';
    document.getElementById('modalTelPaciente').textContent = telefono || '+56 9 9123 4567';
    document.getElementById('modalCorreoPaciente').textContent = correo || 'paciente@gmail.com';
    document.getElementById('modalPesoPaciente').textContent = peso || '--';
    document.getElementById('modalImcPaciente').textContent = imc || '--';
    document.getElementById('modalCinturaPaciente').textContent = cintura || '--';
    document.getElementById('modalDietaPaciente').textContent = dieta || 'Sin dieta registrada.';
    
    const modalElement = document.getElementById('modalHistorialPaciente');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// 3. Función Guardar Ficha (Actualizada para enlazar el modal con los datos guardados)
function agregarEvaluacionMedico(e) {
    e.preventDefault();
    const paciente = document.getElementById('selectPacienteMedico').value;
    const peso = parseFloat(document.getElementById('inputPeso').value);
    const talla = parseFloat(document.getElementById('inputTalla').value);
    const cintura = document.getElementById('inputCintura').value || "82";
    const indicaciones = document.getElementById('inputIndicaciones').value || "3 comidas principales, priorizar proteínas.";
    const imc = (peso / ((talla / 100) ** 2)).toFixed(1);
    const nombreMedicoActual = "Dra. María González"; 
    
    const tbody = document.querySelector('#tablaPacientesMedico tbody');
    const fecha = new Date().toLocaleDateString('es-CL');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${paciente}</td>
        <td>${fecha}</td>
        <td>${imc}</td>
        <td><span class="badge bg-secondary">${nombreMedicoActual}</span></td>
        <td>
            <button class="btn btn-sm btn-outline-info" onclick="verHistorialPaciente('${paciente}', '${peso} kg', '${imc}', '${cintura} cm', '${indicaciones.replace(/'/g, "\\'")}', '18.765.432-1', '+56 9 9123 4567', 'camila.silva@gmail.com')">Historial</button>
        </td>
    `;
    
    tbody.appendChild(newRow);
    document.getElementById('formEvaluacionMedico').reset();
    const preview = document.getElementById('imcPreview');
    if(preview) preview.textContent = "0.0"; 
    
    alert(`Mediciones guardadas exitosamente en la ficha digital de ${paciente}.`);
}

// 4. Lógica de Reagendamiento de Cita para Paciente
let filaCitaEnModificacion = null;

function abrirModalModificar(btn) {
    filaCitaEnModificacion = btn.closest('tr');
    const modalElement = document.getElementById('modalModificarCita');
    if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    }
}

function confirmarReagendamiento() {
    const nuevaFecha = document.getElementById('modFechaCita').value;
    const nuevaHora = document.getElementById('modHoraCita').value;

    if (!nuevaFecha || !nuevaHora) {
        alert('Por favor selecciona una fecha y hora válidas.');
        return;
    }

    if (filaCitaEnModificacion) {
        const celdaFecha = filaCitaEnModificacion.cells[0];
        celdaFecha.innerHTML = `${nuevaFecha}<br><small>${nuevaHora}</small><br><span class="badge bg-warning text-dark mt-1">En espera de reagendamiento</span>`;
    }

    const modalElement = document.getElementById('modalModificarCita');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();

    alert(`Solicitud enviada. Tu cita ha sido modificada para el ${nuevaFecha} a las ${nuevaHora} hrs y se encuentra "En espera de reagendamiento".`);
}

// Escuchadores de eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
    
    const inputPeso = document.getElementById('inputPeso');
    const inputTalla = document.getElementById('inputTalla');
    if (inputPeso && inputTalla) {
        inputPeso.addEventListener('input', calcularIMCTiempoReal);
        inputTalla.addEventListener('input', calcularIMCTiempoReal);
    }
});