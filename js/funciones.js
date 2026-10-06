function inicializarMapa() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const lat = -38.7397;
    const lng = -72.5901;

    const map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Clínica NutriVida'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>Clínica NutriVida</b><br>Av. Alemania #0855, Temuco.')
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
        <td>${fecha}<br>${hora}</td>
        <td>${nutricionista}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary mb-1 w-100" onclick="alert('Funcionalidad para reprogramar fecha/hora abierta.')"><i class="bi bi-pencil"></i> Modificar</button>
            <button class="btn btn-sm btn-outline-danger w-100" onclick="cancelarCita(this)"><i class="bi bi-x-circle"></i> Cancelar</button>
        </td>
    `;
    tbody.appendChild(newRow);
    document.getElementById('formCitaPaciente').reset();
    alert('¡Cita agendada exitosamente! Se ha activado el recordatorio automático.');
}

function cancelarCita(btn) {
    if (confirm('¿Está seguro que desea cancelar esta cita?')) {
        const row = btn.closest('tr');
        row.innerHTML = `
            <td colspan="3" class="text-danger fw-bold"><i class="bi bi-x-circle"></i> Cita cancelada. Horario liberado.</td>
        `;
    }
}

function agregarEvaluacionMedico(e) {
    e.preventDefault();
    const paciente = document.getElementById('selectPacienteMedico').value;
    const peso = parseFloat(document.getElementById('inputPeso').value);
    const talla = parseFloat(document.getElementById('inputTalla').value);
    const imc = (peso / ((talla / 100) ** 2)).toFixed(1);

    const tbody = document.getElementById('tablaPacientesMedico');
    const fecha = new Date().toLocaleDateString('es-CL');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td class="fw-bold">${paciente}</td>
        <td>${fecha}</td>
        <td>${imc}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="alert('Abriendo ficha para editar mediciones')"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-success" onclick="alert('Visualizando historial y progreso completo')"><i class="bi bi-eye"></i> Historial</button>
        </td>
    `;
    tbody.appendChild(newRow);
    document.getElementById('formEvaluacionMedico').reset();
    alert(`Mediciones guardadas exitosamente en la ficha digital de ${paciente}.`);
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

document.addEventListener('DOMContentLoaded', () => {
    inicializarMapa();
});