document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos al iniciar la página
    cargarDatos();

    // Manejar el registro de usuarios
    document.getElementById('form-registro').addEventListener('submit', function (e) {
        e.preventDefault();
        registrarUsuario();
    });

    // Manejar el cálculo de la huella de carbono
    document.getElementById('form-calculo').addEventListener('submit', function (e) {
        e.preventDefault();
        calcularHuella();
    });

    // Manejar el cálculo del total de huella de carbono
    document.getElementById('calcular-total').addEventListener('click', function () {
        calcularTotalHuella();
    });

    // Manejar el cierre de sesión
    document.getElementById('cerrar-sesion').addEventListener('click', function () {
        cerrarSesion();
    });

    // Manejar la eliminación de un registro
    document.getElementById('borrar-registro').addEventListener('click', function () {
        borrarRegistro();
    });
});

// Función para registrar un usuario
function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    const nuevoUsuario = {
        nombre: nombre,
        email: email
    };

    // Guardar el usuario en LocalStorage
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
    alert('Usuario registrado correctamente');
}

// Función para calcular la huella de carbono
function calcularHuella() {
    const transporte = parseFloat(document.getElementById('transporte').value);
    const energia = parseFloat(document.getElementById('energia').value);
    const alimentacion = parseFloat(document.getElementById('alimentacion').value);

    // Factores de emisión (valores aproximados)
    const factorTransporte = 0.12; // kg CO2 por km
    const factorEnergia = 0.5;    // kg CO2 por kWh
    const factorAlimentacion = 2; // kg CO2 por kg de alimento

    // Calcular la huella de carbono
    const huellaCarbono = (transporte * factorTransporte) + (energia * factorEnergia) + (alimentacion * factorAlimentacion);

    // Obtener el usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        alert('Por favor, regístrate primero.');
        return;
    }

    // Crear un nuevo registro de huella de carbono
    const nuevaHuella = {
        usuario: usuarioActual.nombre,
        fecha: new Date().toLocaleDateString(),
        huella_carbono: huellaCarbono.toFixed(2) // Redondear a 2 decimales
    };

    // Obtener datos existentes del LocalStorage
    const datos = JSON.parse(localStorage.getItem('huellaCarbono')) || [];

    // Agregar la nueva huella
    datos.push(nuevaHuella);

    // Guardar en LocalStorage
    localStorage.setItem('huellaCarbono', JSON.stringify(datos));

    // Recargar la tabla
    cargarDatos();

    // Mostrar el resultado
    alert(`Tu huella de carbono es: ${huellaCarbono.toFixed(2)} kg CO2`);
}

// Función para cargar y mostrar los datos
function cargarDatos() {
    const tbody = document.querySelector('#tabla-huella tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    // Obtener datos del LocalStorage
    const datos = JSON.parse(localStorage.getItem('huellaCarbono')) || [];

    // Mostrar los datos en la tabla
    datos.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.usuario}</td>
                <td>${item.fecha}</td>
                <td>${item.huella_carbono}</td>
                <td><button onclick="eliminarRegistro(${index})">Eliminar</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Función para calcular el total de la huella de carbono de un usuario
function calcularTotalHuella() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        alert('Por favor, regístrate primero.');
        return;
    }

    // Obtener datos del LocalStorage
    const datos = JSON.parse(localStorage.getItem('huellaCarbono')) || [];

    // Filtrar las huellas del usuario actual
    const huellasUsuario = datos.filter(item => item.usuario === usuarioActual.nombre);

    // Calcular el total
    const totalHuella = huellasUsuario.reduce((total, item) => total + parseFloat(item.huella_carbono), 0);

    // Mostrar el total
    alert(`El total de la huella de carbono para ${usuarioActual.nombre} es: ${totalHuella.toFixed(2)} kg CO2`);
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    alert('Sesión cerrada correctamente.');
    cargarDatos(); // Recargar la tabla para reflejar el cierre de sesión
}

// Función para eliminar un registro
function eliminarRegistro(index) {
    // Obtener datos del LocalStorage
    const datos = JSON.parse(localStorage.getItem('huellaCarbono')) || [];

    // Eliminar el registro en la posición `index`
    datos.splice(index, 1);

    // Guardar los datos actualizados en LocalStorage
    localStorage.setItem('huellaCarbono', JSON.stringify(datos));

    // Recargar la tabla
    cargarDatos();

    alert('Registro eliminado correctamente.');
}