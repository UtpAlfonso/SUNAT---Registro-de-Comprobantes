/**
 * ==========================================================================
 * Lotería SUNAT – Módulo del Participante
 * JavaScript Puro para Prototipo Interactivo de Alta Fidelidad
 * ==========================================================================
 */

// Estado global de la aplicación
const AppState = {
  activeScreen: 'pantalla-login',
  usuarioActual: {
    nombre: 'Alfonso Valentino',
    apellidos: 'Hernández Gutiérrez',
    dni: '72158118',
    correo: 'valentinohernandez27@gmail.com',
    telefono: '+51 951 561 926',
    clave: 'Demo2026',
    pregunta: '¿Nombre de su Mejor amigo?',
    respuesta: 'Alejandro',
    provincia: '14'
  },
  tipoComprobanteSeleccionado: 'Boleta de Venta',
  comprobanteActivoDetalle: null,
  comprobanteAEliminarId: null,
  filtroTipo: 'todos',
  filtroEstado: 'todos',
  opciones: {
    correo: true,
    sms: true,
    sonidos: true,
    autoguardar: true
  },
  flashActivo: false,
  comprobantes: [
    {
      id: 1,
      fecha: '10/05/2026',
      tipo: 'Boleta',
      tipoCompleto: 'Boleta de Ventas',
      ruc: '20458395010',
      serieNumero: 'B001 - 045940',
      serie: 'B001',
      numero: '045940',
      monto: 'S/.124.80',
      montoNum: '124.80',
      estado: 'Registrado',
      empresa: 'Innovatech.S.A'
    },
    {
      id: 2,
      fecha: '03/05/2026',
      tipo: 'Recibo por Honorario',
      tipoCompleto: 'Recibo por Honorarios Electrónico',
      ruc: '20458345312',
      serieNumero: 'BFG1 - 455140',
      serie: 'BFG1',
      numero: '455140',
      monto: 'S/.44.80',
      montoNum: '44.80',
      estado: 'Por Verificar',
      empresa: 'Servicios Profesionales SAC'
    },
    {
      id: 3,
      fecha: '13/04/2026',
      tipo: 'Boleta',
      tipoCompleto: 'Boleta de Venta Electrónica',
      ruc: '56453315010',
      serieNumero: 'B041 - 039640',
      serie: 'B041',
      numero: '039640',
      monto: 'S/.205.70',
      montoNum: '205.70',
      estado: 'Registrado',
      empresa: 'Comercializadora del Centro'
    },
    {
      id: 4,
      fecha: '21/03/2026',
      tipo: 'Boleta',
      tipoCompleto: 'Boleta de Venta Electrónica',
      ruc: '69284240242',
      serieNumero: 'BR04 - 203420',
      serie: 'BR04',
      numero: '203420',
      monto: 'S/.45.80',
      montoNum: '45.80',
      estado: 'No Cumple',
      empresa: 'Importaciones y Exportaciones del Sur'
    },
    {
      id: 5,
      fecha: '13/02/2026',
      tipo: 'Recibo por Honorario',
      tipoCompleto: 'Recibo por Honorarios',
      ruc: '20029132902',
      serieNumero: 'BZF5 - 459140',
      serie: 'BZF5',
      numero: '459140',
      monto: 'S/.14.20',
      montoNum: '14.20',
      estado: 'Registrado',
      empresa: 'Asesoría Tributaria Integral'
    }
  ]
};

/* ==========================================================================
   SISTEMA DE AUDIO MEJORADO (Web Audio API)
   Sonidos diferenciados, melódicos y agradables para cada botón y acción.
   ========================================================================== */
let audioCtx = null;
let currentGainNode = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function stopCurrentSound() {
  if (currentGainNode && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      currentGainNode.gain.cancelScheduledValues(now);
      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.012);
    } catch {
      // Ignorar errores al desvanecer
    }
    currentGainNode = null;
  }
}

/**
 * Biblioteca de sonidos según acción del usuario
 * tipo:
 * - 'success' / 'ok': arpegio ascendente brillante C5 -> E5 -> G5
 * - 'step': campanilla de paso ascendente F5 -> A5 -> C6
 * - 'delete': tono cálido suave descendente E4 -> B3
 * - 'modalOpen': acorde etéreo suave C5 + G5
 * - 'modalClose': descenso suave y delicado
 * - 'toggle': clic armónico D5
 * - 'error': doble tono menor amortiguado y suave (D4 -> C#4, sin asperezas)
 * - 'clic': toque ligero neutro
 */
function playSound(tipo = 'clic') {
  const ctx = getAudioContext();
  if (!ctx) return;

  stopCurrentSound();
  const now = ctx.currentTime;

  if (tipo === 'success' || tipo === 'ok') {
    // Éxito / Confirmación: Arpegio cálido de 3 notas (Do5 - Mi5 - Sol5)
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.045, now + 0.02);
    masterGain.gain.setValueAtTime(0.045, now + 0.18);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    masterGain.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      oscGain.gain.setValueAtTime(0.0001, now + idx * 0.07);
      oscGain.gain.linearRampToValueAtTime(0.7, now + idx * 0.07 + 0.015);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.16);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.17);
    });

  } else if (tipo === 'step') {
    // Paso adelante / Validación de formulario: campanilla alegre F5 -> C6
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.048, now + 0.015);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    masterGain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now); // F5
    osc1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.11);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.09); // C6
    osc2.connect(masterGain);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.24);

  } else if (tipo === 'delete') {
    // Eliminación confirmada: acorde suave y cálido (E4 -> B3)
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.042, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.exponentialRampToValueAtTime(246.94, now + 0.25); // B3
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.28);

  } else if (tipo === 'modalOpen') {
    // Apertura de modal / vista previa de comprobante: acorde etéreo
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.04, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    masterGain.connect(ctx.destination);

    [523.25, 783.99, 1046.5].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    });

  } else if (tipo === 'modalClose') {
    // Cierre de modal: descenso suave
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.035, now + 0.015);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.16);

  } else if (tipo === 'toggle') {
    // Conmutador (Boleta / Recibo / Radios): clic melódico ligero
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.038, now + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.095);

  } else if (tipo === 'error') {
    // Negación / Error: doble pulso amortiguado muy suave y redondo
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.038, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, now); // D4
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.2); // C4
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.22);

  } else {
    // "clic" neutro suave (toque)
    const masterGain = ctx.createGain();
    currentGainNode = masterGain;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.022, now + 0.008);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.045);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.048);
  }
}

// Activar audio context al primer clic o teclado
window.addEventListener('click', () => getAudioContext(), { once: true });
window.addEventListener('keydown', () => getAudioContext(), { once: true });

/* ==========================================================================
   CUADROS DE NOTIFICACIÓN FLOTANTES (ESTILO IMÁGENES 1 Y 2)
   ========================================================================== */
let notifTimer = null;

function mostrarNotificacion({ tipo = 'verde', titulo, subtitulo = '', duracion = 3200 }) {
  const notif = document.getElementById('notif-toast');
  const iconoBox = document.getElementById('notif-icono-box');
  const txtTitulo = document.getElementById('notif-titulo');
  const txtSubtitulo = document.getElementById('notif-subtitulo');

  if (!notif) return;

  // Clases de color
  notif.classList.remove('notif-verde', 'notif-rojo', 'notif-azul');
  if (tipo === 'rojo') {
    notif.classList.add('notif-rojo');
    // Icono papelera blanca (Imagen 2)
    iconoBox.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
  } else if (tipo === 'azul') {
    notif.classList.add('notif-azul');
    iconoBox.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  } else {
    notif.classList.add('notif-verde');
    // Icono check blanco en círculo (Imagen 1)
    iconoBox.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="16 9 10 15 7 12"></polyline>
      </svg>
    `;
  }

  txtTitulo.textContent = titulo;
  if (subtitulo) {
    txtSubtitulo.style.display = 'block';
    txtSubtitulo.textContent = subtitulo;
  } else {
    txtSubtitulo.style.display = 'none';
  }

  // Animación de entrada
  notif.classList.add('visible');

  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => {
    notif.classList.remove('visible');
  }, duracion);
}

/* ==========================================================================
   NAVEGACIÓN SPA ENTRE PANTALLAS
   ========================================================================== */
function navigate(targetId) {
  const currentStage = document.querySelector('.stage.active');
  const targetStage = document.getElementById(targetId);

  if (!targetStage) return;
  if (currentStage && currentStage.id === targetId) return;

  if (currentStage) {
    currentStage.style.opacity = '0';
    setTimeout(() => {
      currentStage.classList.remove('active');
      currentStage.style.display = 'none';

      targetStage.style.display = 'block';
      void targetStage.offsetWidth;
      targetStage.classList.add('active');
      targetStage.style.opacity = '1';

      AppState.activeScreen = targetId;
      autoScale();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 120);
  } else {
    targetStage.style.display = 'block';
    targetStage.classList.add('active');
    targetStage.style.opacity = '1';
    AppState.activeScreen = targetId;
    autoScale();
  }
}

/* ==========================================================================
   ESCALADO ADAPTATIVO DEL LIENZO (RESPONSIVE EN MONITORES, LAPTOPS, TABLETS Y MÓVILES)
   ========================================================================== */
function autoScale() {
  const activeStage = document.querySelector('.stage.active');
  const stageViewport = document.getElementById('stage-viewport');
  const stageContainer = document.getElementById('stage-container');
  if (!activeStage || !stageViewport || !stageContainer) return;

  const stageWidth = 1280;
  const isLogin = activeStage.id === 'pantalla-login';
  const stageHeight = isLogin ? 969 : 832;

  stageViewport.style.width = stageWidth + 'px';
  stageViewport.style.height = stageHeight + 'px';

  const windowW = window.innerWidth;
  const windowH = window.innerHeight;

  // Escalado armónico: en escritorios grandes adapta a ventana, en pantallas medianas y móviles
  // escala al ancho disponible con márgenes seguros para permitir desplazamiento vertical cómodo.
  let scale;
  if (windowW >= 1280) {
    const scaleX = (windowW - 24) / stageWidth;
    const scaleY = (windowH - 24) / stageHeight;
    scale = Math.min(scaleX, scaleY);
    if (scale > 1) scale = 1;
  } else {
    const padding = windowW < 480 ? 10 : (windowW < 768 ? 16 : 24);
    scale = (windowW - padding) / stageWidth;
  }

  // Límite de seguridad
  if (scale < 0.28) scale = 0.28;

  stageViewport.style.transform = `scale(${scale})`;
  stageViewport.style.transformOrigin = 'top center';

  // Altura calculada dinámicamente para que no se corte ningún botón o footer
  const renderedHeight = Math.ceil(stageHeight * scale);
  stageContainer.style.height = `${renderedHeight + 40}px`;
}

function actualizarEstadisticasKPI() {
  const total = AppState.comprobantes.length;
  let montoTotal = 0;
  AppState.comprobantes.forEach(c => {
    const raw = (c.montoNum || c.monto || '').toString().replace(/[^\d.]/g, '');
    const num = parseFloat(raw) || 0;
    montoTotal += num;
  });
  const tickets = Math.max(1, Math.floor(montoTotal / 50) + total);

  const elTotal = document.getElementById('kpi-total-comprobantes');
  const elMonto = document.getElementById('kpi-monto-acumulado');
  const elTickets = document.getElementById('kpi-tickets-sorteo');

  if (elTotal) elTotal.textContent = total;
  if (elMonto) elMonto.textContent = `S/. ${montoTotal.toFixed(2)}`;
  if (elTickets) elTickets.textContent = `${tickets} Tickets`;

  // Actualizar también la barra resumen de la tabla de comprobantes
  const elResumenMonto = document.getElementById('txt-resumen-total-monto');
  if (elResumenMonto) {
    elResumenMonto.textContent = `Total acumulado: S/. ${montoTotal.toFixed(2)}`;
  }
}

function iniciarEscaneoQR() {
  playSound('toggle');
  navigate('pantalla-qr');
}

window.addEventListener('resize', autoScale);
window.addEventListener('DOMContentLoaded', () => {
  renderTablaComprobantes(AppState.comprobantes);
  actualizarEstadisticasKPI();
  
  // Cargar tamaño de letra guardado o default normal
  try {
    const savedFont = localStorage.getItem('sunat_tamano_letra') || 'normal';
    cambiarTamanoLetra(savedFont, null, false);
  } catch (e) {}

  autoScale();
});

/* ==========================================================================
   AVISO DISCRETO "PRÓXIMAMENTE"
   ========================================================================== */
function mostrarProximamente(nombreModulo) {
  playSound('error');
  mostrarNotificacion({
    tipo: 'azul',
    titulo: nombreModulo,
    subtitulo: 'Esta funcionalidad estará disponible próximamente.',
    duracion: 2600
  });
}

/* ==========================================================================
   PANTALLA 1: LOGIN Y CREDENCIALES
   ========================================================================== */
function togglePasswordVisibility(inputId, buttonEl) {
  playSound('toggle');
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  const eyeClosed = buttonEl.querySelector('.eye-closed');
  const eyeOpen = buttonEl.querySelector('.eye-open');
  if (eyeClosed && eyeOpen) {
    eyeClosed.style.display = isPassword ? 'none' : 'block';
    eyeOpen.style.display = isPassword ? 'block' : 'none';
  }
}

function toggleRememberCheckbox() {
  playSound('toggle');
  const chk = document.getElementById('chk-recordarme');
  if (!chk) return;
  const isChecked = chk.classList.toggle('checked');
  chk.setAttribute('aria-checked', isChecked ? 'true' : 'false');
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const inputUsuario = document.getElementById('login-usuario');
  const inputClave = document.getElementById('login-clave');
  const errUsuario = document.getElementById('err-login-usuario');
  const errClave = document.getElementById('err-login-clave');

  const usuario = inputUsuario.value.trim();
  const clave = inputClave.value;

  inputUsuario.classList.remove('input-invalido', 'input-valido');
  inputClave.classList.remove('input-invalido', 'input-valido');
  errUsuario.textContent = '';
  errClave.textContent = '';

  if (usuario === '72158118' && clave === AppState.usuarioActual.clave) {
    inputUsuario.classList.add('input-valido');
    inputClave.classList.add('input-valido');
    playSound('success');
    mostrarNotificacion({
      tipo: 'verde',
      titulo: 'Acceso Correcto',
      subtitulo: 'Bienvenido Alfonso Hernández',
      duracion: 2800
    });
    navigate('pantalla-principal');
  } else {
    playSound('error');
    if (usuario !== '72158118') {
      inputUsuario.classList.add('input-invalido');
      errUsuario.textContent = 'Usuario no registrado (Use DNI: 72158118)';
    }
    if (clave !== AppState.usuarioActual.clave) {
      inputClave.classList.add('input-invalido');
      errClave.textContent = 'Clave incorrecta (Demo2026)';
    }
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'Credenciales Incorrectas',
      subtitulo: 'Revise su DNI/RUC y contraseña ingresados.',
      duracion: 3000
    });
  }
}

function handleGoogleLogin() {
  const inputUsuario = document.getElementById('login-usuario');
  const inputClave = document.getElementById('login-clave');
  inputUsuario.value = '72158118';
  inputClave.value = AppState.usuarioActual.clave;
  inputUsuario.classList.add('input-valido');
  inputClave.classList.add('input-valido');
  playSound('success');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Sesión con Google',
    subtitulo: 'Identificación confirmada para el sorteo',
    duracion: 2800
  });
  setTimeout(() => {
    navigate('pantalla-principal');
  }, 250);
}

function handleForgotPassword() {
  playSound('clic');
  navigate('pantalla-cambiar-clave');
}

/* ==========================================================================
   PANTALLA 2: REGISTRO PASO 1 (NOTIFICACIÓN SEGÚN IMAGEN 1)
   ========================================================================== */
let sexoSeleccionado = 'Masculino';

function seleccionarSexo(sexo) {
  playSound('toggle');
  sexoSeleccionado = sexo;
  document.getElementById('radio-sexo-masc')?.classList.toggle('checked', sexo === 'Masculino');
  document.getElementById('radio-sexo-fem')?.classList.toggle('checked', sexo === 'Femenino');
  document.getElementById('radio-sexo-otro')?.classList.toggle('checked', sexo === 'Otro');
}

function limpiarFormularioRegistro1() {
  playSound('clic');
  const form = document.getElementById('form-registro-1');
  if (form) {
    form.reset();
    document.getElementById('reg-num-doc').classList.remove('input-invalido', 'input-valido');
    document.getElementById('err-reg-num-doc').textContent = '';
    seleccionarSexo('Masculino');
  }
  mostrarNotificacion({
    tipo: 'azul',
    titulo: 'Formulario Limpiado',
    subtitulo: 'Puede ingresar nuevamente sus datos',
    duracion: 2200
  });
}

function handleRegistroPaso1(event) {
  event.preventDefault();
  const tipoDoc = document.getElementById('reg-tipo-doc').value;
  const numDocInput = document.getElementById('reg-num-doc');
  const errNumDoc = document.getElementById('err-reg-num-doc');
  const numDoc = numDocInput.value.trim();

  numDocInput.classList.remove('input-invalido', 'input-valido');
  errNumDoc.textContent = '';

  if (tipoDoc === 'DNI' && !/^\d{8}$/.test(numDoc)) {
    numDocInput.classList.add('input-invalido');
    errNumDoc.textContent = 'El DNI debe tener exactamente 8 dígitos.';
    playSound('error');
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'Documento Inválido',
      subtitulo: 'El DNI debe contener 8 números.',
      duracion: 3000
    });
    return;
  } else if (tipoDoc === 'RUC' && !/^\d{11}$/.test(numDoc)) {
    numDocInput.classList.add('input-invalido');
    errNumDoc.textContent = 'El RUC debe tener 11 dígitos.';
    playSound('error');
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'RUC Inválido',
      subtitulo: 'El RUC debe contener 11 números.',
      duracion: 3000
    });
    return;
  }

  numDocInput.classList.add('input-valido');

  // Sonido de paso positivo y notificación exacta de Imagen 1:
  // "Datos Registrados / Se le Renviará al siguiente paso"
  playSound('step');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Datos Registrados',
    subtitulo: 'Se le Renviará al siguiente paso',
    duracion: 3000
  });

  navigate('pantalla-registro-2');
}

/* ==========================================================================
   PANTALLA 3: REGISTRO PASO 2
   ========================================================================== */
function handleRegistroPaso2(event) {
  event.preventDefault();
  const correo = document.getElementById('reg-correo');
  const correoRep = document.getElementById('reg-correo-rep');
  const pass = document.getElementById('reg-pass');
  const passRep = document.getElementById('reg-pass-rep');
  const pregSec = document.getElementById('reg-preg-sec');
  const respSec = document.getElementById('reg-resp-sec');

  const errCorreo = document.getElementById('err-reg-correo');
  const errPass = document.getElementById('err-reg-pass');

  errCorreo.textContent = '';
  errPass.textContent = '';
  correo.classList.remove('input-invalido', 'input-valido');
  correoRep.classList.remove('input-invalido', 'input-valido');
  pass.classList.remove('input-invalido', 'input-valido');
  passRep.classList.remove('input-invalido', 'input-valido');

  let hasError = false;

  if (correo.value.trim().toLowerCase() !== correoRep.value.trim().toLowerCase()) {
    correoRep.classList.add('input-invalido');
    errCorreo.textContent = 'Los correos electrónicos no coinciden.';
    hasError = true;
  }

  if (pass.value !== passRep.value) {
    passRep.classList.add('input-invalido');
    errPass.textContent = 'Las contraseñas no coinciden.';
    hasError = true;
  }

  const regexSinTildesNiEne = /^[a-zA-Z0-9\s?¿.,_-]+$/;
  if (!regexSinTildesNiEne.test(pregSec.value)) {
    pregSec.classList.add('input-invalido');
    hasError = true;
  }
  if (!regexSinTildesNiEne.test(respSec.value)) {
    respSec.classList.add('input-invalido');
    hasError = true;
  }

  if (hasError) {
    playSound('error');
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'Verifique los Datos',
      subtitulo: 'Corrija los campos señalados para continuar.',
      duracion: 3000
    });
    return;
  }

  correo.classList.add('input-valido');
  correoRep.classList.add('input-valido');
  pass.classList.add('input-valido');
  passRep.classList.add('input-valido');

  playSound('step');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Datos de Contacto Guardados',
    subtitulo: 'Generando confirmación de participación',
    duracion: 3000
  });

  navigate('pantalla-registro-3');
}

/* ==========================================================================
   PANTALLA 5: PÁGINA PRINCIPAL
   ========================================================================== */
function cerrarSesion() {
  playSound('clic');
  mostrarNotificacion({
    tipo: 'azul',
    titulo: 'Sesión Cerrada',
    subtitulo: 'Ha salido del sistema de lotería con éxito.',
    duracion: 2500
  });
  navigate('pantalla-login');
}

/* ==========================================================================
   PANTALLA 6: REGISTRAR COMPROBANTES
   ========================================================================== */
function setTipoComprobante(tipo) {
  playSound('toggle');
  AppState.tipoComprobanteSeleccionado = tipo;
  const btnBoleta = document.getElementById('btn-toggle-boleta');
  const btnRecibo = document.getElementById('btn-toggle-recibo');

  if (tipo === 'Boleta') {
    btnBoleta.classList.add('activo');
    btnBoleta.classList.remove('inactivo');
    btnRecibo.classList.add('inactivo');
    btnRecibo.classList.remove('activo');
  } else {
    btnRecibo.classList.add('activo');
    btnRecibo.classList.remove('inactivo');
    btnBoleta.classList.add('inactivo');
    btnBoleta.classList.remove('activo');
  }
}

function handleRegistrarComprobante(event) {
  event.preventDefault();
  const serieInput = document.getElementById('comp-serie');
  const numInput = document.getElementById('comp-numero');
  const rucInput = document.getElementById('comp-ruc');
  const fechaInput = document.getElementById('comp-fecha');

  const serie = serieInput.value.trim().toUpperCase();
  const numero = numInput.value.trim();
  const ruc = rucInput.value.trim();
  const fechaVal = fechaInput.value;

  let error = false;

  if (!/^[A-Z0-9]{3,4}$/.test(serie)) {
    serieInput.classList.add('input-invalido');
    error = true;
  } else {
    serieInput.classList.remove('input-invalido');
    serieInput.classList.add('input-valido');
  }

  if (!/^\d{4,8}$/.test(numero)) {
    numInput.classList.add('input-invalido');
    error = true;
  } else {
    numInput.classList.remove('input-invalido');
    numInput.classList.add('input-valido');
  }

  if (!/^\d{11}$/.test(ruc)) {
    rucInput.classList.add('input-invalido');
    error = true;
  } else {
    rucInput.classList.remove('input-invalido');
    rucInput.classList.add('input-valido');
  }

  if (error) {
    playSound('error');
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'Comprobante Incorrecto',
      subtitulo: 'Verifique serie, número y RUC de 11 dígitos.',
      duracion: 3000
    });
    return;
  }

  const parts = fechaVal.split('-');
  const fechaFormateada = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '10/05/2026';

  const nuevoComprobante = {
    id: Date.now(),
    fecha: fechaFormateada,
    tipo: AppState.tipoComprobanteSeleccionado === 'Boleta' ? 'Boleta' : 'Recibo por Honorario',
    tipoCompleto: AppState.tipoComprobanteSeleccionado === 'Boleta' ? 'Boleta de Ventas' : 'Recibo por Honorarios Electrónico',
    ruc: ruc,
    serieNumero: `${serie} - ${numero}`,
    serie: serie,
    numero: numero,
    monto: 'S/. 124.80',
    montoNum: '124.80',
    estado: 'Registrado',
    empresa: 'Innovatech.S.A'
  };

  AppState.comprobantes.unshift(nuevoComprobante);
  renderTablaComprobantes(AppState.comprobantes);
  actualizarEstadisticasKPI();

  // Actualizar pantalla 8 (Comprobante Registrado con Éxito - Imagen 3)
  document.getElementById('reg-conf-serie').textContent = serie;
  document.getElementById('reg-conf-numero').textContent = numero;
  document.getElementById('reg-conf-ruc').textContent = ruc;
  document.getElementById('reg-conf-tipo').textContent = nuevoComprobante.tipoCompleto;
  document.getElementById('reg-conf-fecha').textContent = fechaFormateada;
  document.getElementById('reg-conf-empresa').textContent = nuevoComprobante.empresa;
  document.getElementById('reg-conf-monto').textContent = nuevoComprobante.monto;
  document.getElementById('mini-ruc-num').textContent = `${serie} - ${numero}`;
  document.getElementById('modal-doc-numero').textContent = `${serie} - ${numero}`;

  playSound('success');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Comprobante Registrado',
    subtitulo: 'Participación registrada con éxito en el sorteo',
    duracion: 3200
  });

  navigate('pantalla-registrado');
}

function registrarOtroComprobante() {
  playSound('toggle');
  const form = document.getElementById('form-registrar-comprobante');
  if (form) {
    form.reset();
    document.getElementById('comp-serie').value = '';
    document.getElementById('comp-numero').value = '';
    document.getElementById('comp-ruc').value = '';
    document.getElementById('comp-serie').classList.remove('input-valido', 'input-invalido');
    document.getElementById('comp-numero').classList.remove('input-valido', 'input-invalido');
    document.getElementById('comp-ruc').classList.remove('input-valido', 'input-invalido');
  }
  navigate('pantalla-registrar');
}

/* ==========================================================================
   PANTALLA 7: REGISTRAR CÓDIGO QR
   ========================================================================== */
function toggleFlashCamera() {
  playSound('toggle');
  AppState.flashActivo = !AppState.flashActivo;
  const marco = document.getElementById('marco-qr');
  const txtFlash = document.getElementById('txt-flash');

  if (marco) {
    marco.classList.toggle('qr-flash-activo', AppState.flashActivo);
  }
  if (txtFlash) {
    txtFlash.textContent = AppState.flashActivo ? 'DESACTIVAR FLASH' : 'ACTIVAR FLASH';
  }
}

function simularLecturaQR() {
  playSound('success');
  const rucSimulado = '20601234567';
  const nuevoComprobante = {
    id: Date.now(),
    fecha: '24/10/2026',
    tipo: 'Boleta',
    tipoCompleto: 'Boleta de Venta Electrónica',
    ruc: rucSimulado,
    serieNumero: 'B001 - 00004829',
    serie: 'B001',
    numero: '00004829',
    monto: 'S/. 540.00',
    montoNum: '540.00',
    estado: 'Registrado',
    empresa: 'SOLUCIONES DIGITALES S.A.C.'
  };

  AppState.comprobantes.unshift(nuevoComprobante);
  renderTablaComprobantes(AppState.comprobantes);
  actualizarEstadisticasKPI();

  document.getElementById('reg-conf-serie').textContent = nuevoComprobante.serie;
  document.getElementById('reg-conf-numero').textContent = nuevoComprobante.numero;
  document.getElementById('reg-conf-ruc').textContent = nuevoComprobante.ruc;
  document.getElementById('reg-conf-tipo').textContent = nuevoComprobante.tipoCompleto;
  document.getElementById('reg-conf-fecha').textContent = nuevoComprobante.fecha;
  document.getElementById('reg-conf-empresa').textContent = nuevoComprobante.empresa;
  document.getElementById('reg-conf-monto').textContent = nuevoComprobante.monto;
  document.getElementById('mini-ruc-num').textContent = nuevoComprobante.serieNumero;
  document.getElementById('modal-doc-numero').textContent = nuevoComprobante.serieNumero;

  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Código QR Escaneado',
    subtitulo: 'Comprobante verificado con SUNAT',
    duracion: 3200
  });

  navigate('pantalla-registrado');
}

/* ==========================================================================
   PANTALLA 8: MODAL DE VISUALIZACIÓN TOTAL DEL COMPROBANTE (IMAGEN 4)
   ========================================================================== */
function abrirModalFacturaFull() {
  playSound('modalOpen');
  const modalWrapper = document.getElementById('modal-factura-full-wrapper');
  if (modalWrapper) {
    modalWrapper.style.display = 'flex';
  }
}

function cerrarModalFacturaFull() {
  playSound('modalClose');
  const modalWrapper = document.getElementById('modal-factura-full-wrapper');
  if (modalWrapper) {
    modalWrapper.style.display = 'none';
  }
}

/* ==========================================================================
   PANTALLA 9: CONSULTAR COMPROBANTES Y TABLA (NOTIFICACIÓN SEGÚN IMAGEN 2)
   ========================================================================== */
function renderTablaComprobantes(lista) {
  const tbody = document.getElementById('tbody-comprobantes');
  if (!tbody) return;

  tbody.innerHTML = '';

  const elResumen = document.getElementById('txt-resumen-total-comprobantes');
  if (elResumen) {
    elResumen.textContent = `Mostrando ${lista.length} comprobante${lista.length === 1 ? '' : 's'} registrado${lista.length === 1 ? '' : 's'}`;
  }

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="height: 72px; color: var(--gris-sunat);">No se encontraron comprobantes registrados.</td></tr>`;
    return;
  }

  lista.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.title = "Haz clic en la fila para ver detalles completos del comprobante";
    if (index % 2 === 1) {
      tr.classList.add('fila-par');
    }

    let clasePildora = 'pildora-verde';
    if (item.estado === 'Por Verificar') clasePildora = 'pildora-naranja';
    if (item.estado === 'No Cumple') clasePildora = 'pildora-roja';

    tr.innerHTML = `
      <td>${item.fecha}</td>
      <td>${item.tipo}</td>
      <td>${item.ruc}</td>
      <td>${item.serieNumero}</td>
      <td>${item.monto}</td>
      <td>
        <span class="pildora-estado ${clasePildora}">${item.estado}</span>
      </td>
      <td>
        <button type="button" class="btn-eliminar-fila" title="Eliminar comprobante" onclick="eliminarComprobante(event, ${item.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    `;

    tr.addEventListener('click', (ev) => {
      if (ev.target.closest('.btn-eliminar-fila')) return;
      abrirDetalleComprobante(item);
    });

    tbody.appendChild(tr);
  });
}

function setFiltroTipo(tipo, btnEl) {
  playSound('toggle');
  AppState.filtroTipo = tipo;

  const btnTodos = document.getElementById('btn-filtro-tipo-todos');
  const btnBoleta = document.getElementById('btn-filtro-tipo-boleta');
  const btnRecibo = document.getElementById('btn-filtro-tipo-recibo');

  [btnTodos, btnBoleta, btnRecibo].forEach(btn => btn?.classList.remove('activo'));
  btnEl?.classList.add('activo');

  aplicarFiltrosYBusqueda();
}

function setFiltroEstado(estado, btnEl) {
  playSound('toggle');
  AppState.filtroEstado = estado;

  const btnTodos = document.getElementById('btn-filtro-estado-todos');
  const btnReg = document.getElementById('btn-filtro-estado-registrado');
  const btnVerif = document.getElementById('btn-filtro-estado-verificar');
  const btnNoCumple = document.getElementById('btn-filtro-estado-nocumple');

  [btnTodos, btnReg, btnVerif, btnNoCumple].forEach(btn => btn?.classList.remove('activo'));
  btnEl?.classList.add('activo');

  aplicarFiltrosYBusqueda();
}

function filtrarTablaComprobantes(termino) {
  aplicarFiltrosYBusqueda();
}

function aplicarFiltrosYBusqueda() {
  const inputBusq = document.getElementById('buscador-tabla');
  const q = (inputBusq?.value || '').trim().toLowerCase();

  const filtrados = AppState.comprobantes.filter(item => {
    // Filtro por tipo
    if (AppState.filtroTipo !== 'todos') {
      if (AppState.filtroTipo === 'Boleta' && !item.tipo.toLowerCase().includes('boleta')) {
        return false;
      }
      if (AppState.filtroTipo === 'Recibo por Honorario' && !item.tipo.toLowerCase().includes('recibo')) {
        return false;
      }
    }

    // Filtro por estado
    if (AppState.filtroEstado !== 'todos') {
      if (item.estado !== AppState.filtroEstado) {
        return false;
      }
    }

    // Filtro por texto de búsqueda
    if (q) {
      const coincide = item.ruc.toLowerCase().includes(q) ||
                       item.serieNumero.toLowerCase().includes(q) ||
                       item.fecha.toLowerCase().includes(q) ||
                       item.tipo.toLowerCase().includes(q) ||
                       item.estado.toLowerCase().includes(q) ||
                       (item.empresa && item.empresa.toLowerCase().includes(q));
      if (!coincide) return false;
    }

    return true;
  });

  renderTablaComprobantes(filtrados);
}

/* ==========================================================================
   ELIMINAR COMPROBANTE (MODAL EN PANTALLA, SIN WINDOW.CONFIRM)
   ========================================================================== */
function eliminarComprobante(event, id) {
  event.stopPropagation();
  AppState.comprobanteAEliminarId = id;

  const item = AppState.comprobantes.find(c => c.id === id);
  const textoModal = document.getElementById('modal-confirm-texto');
  if (textoModal && item) {
    textoModal.textContent = `¿Desea eliminar el comprobante ${item.serieNumero} (${item.tipo}) del registro del sorteo?`;
  }

  const modalConfirm = document.getElementById('modal-confirm-eliminar-wrapper');
  if (modalConfirm) {
    modalConfirm.style.display = 'flex';
  }
  playSound('modalOpen');
}

function cerrarConfirmEliminar() {
  AppState.comprobanteAEliminarId = null;
  const modalConfirm = document.getElementById('modal-confirm-eliminar-wrapper');
  if (modalConfirm) {
    modalConfirm.style.display = 'none';
  }
  playSound('modalClose');
}

function confirmarEliminarComprobante() {
  const id = AppState.comprobanteAEliminarId;
  if (!id) return;

  AppState.comprobantes = AppState.comprobantes.filter(c => c.id !== id);
  AppState.comprobanteAEliminarId = null;

  const modalConfirm = document.getElementById('modal-confirm-eliminar-wrapper');
  if (modalConfirm) {
    modalConfirm.style.display = 'none';
  }

  aplicarFiltrosYBusqueda();
  actualizarEstadisticasKPI();

  // Sonido suave de eliminación y Notificación roja exacta según Imagen 2
  playSound('delete');
  mostrarNotificacion({
    tipo: 'rojo',
    titulo: 'Comprobante eliminado',
    subtitulo: 'Se eliminó el comprobante del sorteo',
    duracion: 3200
  });
}

/* ==========================================================================
   PANTALLA 10: MODAL DETALLE DEL COMPROBANTE (OVERLAY IN SITU SEGÚN IMAGEN 1)
   Muestra el modal sobre la pantalla actual sin pantalla en blanco
   ========================================================================== */
function abrirDetalleComprobante(item) {
  AppState.comprobanteActivoDetalle = item;

  document.getElementById('det-serie').textContent = item.serie || item.serieNumero.split(' - ')[0];
  document.getElementById('det-numero').textContent = item.numero || item.serieNumero.split(' - ')[1];
  document.getElementById('det-ruc').textContent = item.ruc;
  document.getElementById('det-tipo').textContent = item.tipoCompleto || item.tipo;
  document.getElementById('det-fecha').textContent = item.fecha;
  document.getElementById('det-empresa').textContent = item.empresa || 'Innovatech.S.A';
  document.getElementById('det-monto').textContent = item.monto.replace('S/.', 'S/. ');

  const badge = document.getElementById('det-estado-badge');
  if (badge) {
    badge.textContent = item.estado;
    badge.className = 'pildora-estado';
    if (item.estado === 'Registrado') badge.classList.add('pildora-verde');
    else if (item.estado === 'Por Verificar') badge.classList.add('pildora-naranja');
    else badge.classList.add('pildora-roja');
  }

  playSound('modalOpen');
  const modalWrapper = document.getElementById('modal-detalle-wrapper');
  if (modalWrapper) {
    modalWrapper.style.display = 'flex';
  }
}

function cerrarModalDetalle() {
  playSound('modalClose');
  const modalWrapper = document.getElementById('modal-detalle-wrapper');
  if (modalWrapper) {
    modalWrapper.style.display = 'none';
  }
}

function imprimirComprobante() {
  descargarComprobantePDF();
}

function descargarComprobantePDF() {
  playSound('clic');

  // Obtener datos del comprobante activo
  const serie = document.getElementById('det-serie')?.textContent.trim() || 'B001';
  const numero = document.getElementById('det-numero')?.textContent.trim() || '045940';
  const ruc = document.getElementById('det-ruc')?.textContent.trim() || '20458395010';
  const tipo = document.getElementById('det-tipo')?.textContent.trim() || 'Boleta de Venta Electrónica';
  const fecha = document.getElementById('det-fecha')?.textContent.trim() || '10/05/2026';
  const empresa = document.getElementById('det-empresa')?.textContent.trim() || 'Innovatech.S.A';
  const monto = document.getElementById('det-monto')?.textContent.trim() || 'S/. 124.80';
  const estado = document.getElementById('det-estado-badge')?.textContent.trim() || 'Registrado';

  const titular = `${AppState.usuarioActual.nombre} ${AppState.usuarioActual.apellidos}`;
  const dni = AppState.usuarioActual.dni;

  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Encabezado Azul Oficial SUNAT
      doc.setFillColor(8, 58, 98); // #083A62
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA', 105, 10, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('LOTERÍA SUNAT - COMPROBANTE DE PAGO ELECTRÓNICO REGISTRADO', 105, 18, { align: 'center' });

      // Recuadro RUC del Comprobante (Costado Superior Derecho)
      doc.setDrawColor(8, 58, 98);
      doc.setLineWidth(0.8);
      doc.roundedRect(125, 32, 75, 32, 2, 2, 'S');

      doc.setTextColor(8, 58, 98);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`R.U.C. N° ${ruc}`, 162.5, 40, { align: 'center' });

      doc.setFillColor(8, 58, 98);
      doc.rect(125, 44, 75, 7.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(tipo.toUpperCase(), 162.5, 49.5, { align: 'center' });

      doc.setTextColor(177, 48, 48); // #B13030
      doc.setFontSize(13);
      doc.text(`${serie} - ${numero}`, 162.5, 59, { align: 'center' });

      // Datos de la Empresa Emisora
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(empresa.toUpperCase(), 15, 40);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Dirección: Av. República de Panamá 3055, San Isidro, Lima', 15, 46);
      doc.text(`RUC Emisor: ${ruc}`, 15, 51);
      doc.text('Estado del Emisor: Activo / Habido en SUNAT', 15, 56);
      doc.text('Emisión electrónica autorizada por SUNAT', 15, 61);

      // Línea divisoria
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(15, 68, 195, 68);

      // Tarjeta de Datos del Participante
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 72, 180, 28, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(8, 58, 98);
      doc.text('DATOS DEL PARTICIPANTE Y PARTICIPACIÓN EN SORTEO:', 20, 78);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Participante: ${titular}`, 20, 84);
      doc.text(`Documento de Identidad: DNI ${dni}`, 20, 90);
      doc.text(`Fecha de Emisión: ${fecha}`, 20, 95);

      doc.text(`Estado en el Sorteo: ${estado}`, 115, 84);
      doc.text(`Código Hash: 4aF89qL1k99ZMfbvQphfzRhlkYTgti`, 115, 90);
      doc.text(`Opciones Otorgadas: 1 Ticket Activo`, 115, 95);

      // Tabla de ítems
      doc.setFillColor(8, 58, 98);
      doc.rect(15, 106, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ITEM', 18, 111.5);
      doc.text('CANT.', 32, 111.5);
      doc.text('DESCRIPCIÓN', 55, 111.5);
      doc.text('PRECIO UNITARIO', 140, 111.5);
      doc.text('IMPORTE TOTAL', 172, 111.5);

      // Fila
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('01', 19, 120);
      doc.text('1.00', 33, 120);
      doc.text(`Consumo / Adquisición comercial declarada en ${tipo}`, 55, 120);
      doc.text(monto, 142, 120);
      doc.text(monto, 174, 120);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 125, 195, 125);

      // Desglose financiero
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(125, 132, 70, 30, 2, 2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Operación Gravada:', 130, 138);
      doc.text('I.G.V. (18%):', 130, 144);
      doc.text('Total a Pagar:', 130, 155);

      const cleanNum = parseFloat(monto.replace(/[^\d.]/g, '')) || 124.80;
      const subtotal = (cleanNum / 1.18).toFixed(2);
      const igv = (cleanNum - subtotal).toFixed(2);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`S/ ${subtotal}`, 188, 138, { align: 'right' });
      doc.text(`S/ ${igv}`, 188, 144, { align: 'right' });

      doc.setFontSize(11);
      doc.setTextColor(8, 58, 98);
      doc.text(monto, 188, 155, { align: 'right' });

      // Cuadro de Validación SUNAT
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(15, 168, 180, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(21, 128, 61);
      doc.text('COMPROBANTE VERIFICADO Y HABILITADO PARA EL SORTEO NACIONAL SUNAT', 20, 175);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text('La validez tributaria de este comprobante ha sido verificada en los servidores oficiales de la SUNAT.', 20, 180);
      doc.text(`Descarga generada: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}`, 20, 185);

      // Pie
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Esta es una representación impresa digital autorizada por SUNAT para el participante de la Lotería.', 105, 280, { align: 'center' });
      doc.text('Portal Web: www.sunat.gob.pe | Central Telefónica: 0-801-12-100', 105, 285, { align: 'center' });

      const nombreArchivo = `Comprobante_SUNAT_${serie}_${numero}.pdf`;
      doc.save(nombreArchivo);

      playSound('success');
      mostrarNotificacion({
        tipo: 'verde',
        titulo: 'PDF Descargado',
        subtitulo: `Comprobante ${serie}-${numero} guardado con éxito`,
        duracion: 3200
      });
      return;
    }
  } catch (err) {
    console.error('Error al generar PDF con jsPDF:', err);
  }

  // Fallback
  window.print();
}

/* ==========================================================================
   PANTALLAS 14 & 15: MIS DATOS Y MIS OPCIONES
   ========================================================================== */
function guardarMisDatos(event) {
  event.preventDefault();
  const nombres = document.getElementById('md-nombres')?.value.trim();
  const apellidos = document.getElementById('md-apellidos')?.value.trim();
  const correo = document.getElementById('md-correo')?.value.trim();
  const tel = document.getElementById('md-telefono')?.value.trim();

  if (nombres) AppState.usuarioActual.nombre = nombres;
  if (apellidos) AppState.usuarioActual.apellidos = apellidos;
  if (correo) AppState.usuarioActual.correo = correo;
  if (tel) AppState.usuarioActual.telefono = tel;

  // Actualizar nombre en la barra de bienvenida y tarjeta de confirmación
  const barraTxt = document.querySelector('.barra-txt-bienvenido');
  if (barraTxt) {
    barraTxt.textContent = `Bienvenido ${AppState.usuarioActual.nombre.split(' ')[0]} ${AppState.usuarioActual.apellidos.split(' ')[0]}`;
  }

  const perfilNombre = document.querySelector('.perfil-titular-nombre');
  if (perfilNombre) {
    perfilNombre.textContent = `${AppState.usuarioActual.nombre} ${AppState.usuarioActual.apellidos}`;
  }

  playSound('success');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Datos Guardados',
    subtitulo: 'Su información personal ha sido actualizada con éxito',
    duracion: 3000
  });

  setTimeout(() => {
    navigate('pantalla-principal');
  }, 450);
}

function handleToggleOption(inputId, badgeId) {
  playSound('toggle');
  const chk = document.getElementById(inputId);
  const badge = document.getElementById(badgeId);
  const isChecked = chk ? chk.checked : false;

  if (badge) {
    badge.textContent = isChecked ? 'ACTIVO' : 'DESACTIVADO';
    badge.className = `badge-opcion-estado ${isChecked ? 'activo' : 'inactivo'}`;
  }

  if (inputId === 'opt-notif-correo') AppState.opciones.correo = isChecked;
  if (inputId === 'opt-notif-sms') AppState.opciones.sms = isChecked;
  if (inputId === 'opt-sonidos') AppState.opciones.sonidos = isChecked;
  if (inputId === 'opt-autoguardar') AppState.opciones.autoguardar = isChecked;
}

function probarSonidoOpciones() {
  playSound('success');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Sonido Activo',
    subtitulo: 'Reproducción melódica de confirmación funcionando',
    duracion: 2200
  });
}

function toggleOptionSound(chk) {
  playSound('toggle');
}

function guardarOpciones(event) {
  event.preventDefault();
  AppState.opciones.correo = !!document.getElementById('opt-notif-correo')?.checked;
  AppState.opciones.sms = !!document.getElementById('opt-notif-sms')?.checked;
  AppState.opciones.sonidos = !!document.getElementById('opt-sonidos')?.checked;
  AppState.opciones.autoguardar = !!document.getElementById('opt-autoguardar')?.checked;

  playSound('success');
  mostrarNotificacion({
    tipo: 'verde',
    titulo: 'Preferencias Guardadas',
    subtitulo: 'Las opciones de la plataforma se actualizaron correctamente',
    duracion: 3000
  });

  setTimeout(() => {
    navigate('pantalla-principal');
  }, 450);
}

function cambiarTamanoLetra(tamano, btnEl, notify = true) {
  if (notify) playSound('toggle');
  AppState.tamanoLetra = tamano;

  // Actualizar botones en pantalla de Mis Opciones
  document.querySelectorAll('.btn-tamano-letra').forEach(btn => btn.classList.remove('activo'));
  if (btnEl && btnEl.classList.contains('btn-tamano-letra')) {
    btnEl.classList.add('activo');
  } else {
    const btnOpciones = document.getElementById(`btn-font-${tamano}`);
    if (btnOpciones) btnOpciones.classList.add('activo');
  }

  // Actualizar botones en barra rápida de accesibilidad superior
  document.querySelectorAll('.btn-acc-font').forEach(btn => btn.classList.remove('activo'));
  const btnAcc = document.getElementById(`btn-acc-${tamano}`);
  if (btnAcc) btnAcc.classList.add('activo');

  // Multiplicador real de escala CSS
  let scaleValue = 1.0;
  let label = 'Normal (100%)';
  if (tamano === 'pequeno') { scaleValue = 0.88; label = 'Pequeño (88%)'; }
  if (tamano === 'normal') { scaleValue = 1.0; label = 'Normal (100%)'; }
  if (tamano === 'grande') { scaleValue = 1.18; label = 'Grande (118%)'; }
  if (tamano === 'muygrande') { scaleValue = 1.35; label = 'Muy Grande (135%)'; }

  // Aplicar atributos y variables CSS
  document.documentElement.style.setProperty('--scale-font', scaleValue);
  document.documentElement.style.setProperty('--font-scale', scaleValue);
  document.body.style.setProperty('--scale-font', scaleValue);
  document.body.style.setProperty('--font-scale', scaleValue);

  document.body.setAttribute('data-font-size', tamano);
  const stageViewport = document.getElementById('stage-viewport');
  if (stageViewport) {
    stageViewport.setAttribute('data-font-size', tamano);
  }

  // Persistir en localStorage
  try {
    localStorage.setItem('sunat_tamano_letra', tamano);
  } catch (e) {}

  // Actualizar muestra en vivo de la tarjeta de opciones
  const prevTexto = document.getElementById('preview-tamano-texto');
  if (prevTexto) {
    prevTexto.textContent = `Escala aplicada: ${label}. "Lotería SUNAT: Comprobante B001 - 045940 registrado con éxito por un monto de S/. 124.80."`;
  }

  if (notify) {
    mostrarNotificacion({
      tipo: 'azul',
      titulo: 'Tamaño de Letra Aplicado',
      subtitulo: `Escala tipográfica en todo el sistema: ${label}`,
      duracion: 2600
    });
  }
}

/* ==========================================================================
   SIMULACIÓN DE INICIO DE SESIÓN POR VOZ (ACCESIBILIDAD / PERSONAS DISCAPACITADAS)
   ========================================================================== */
let vozReconocimientoActivo = false;
let vozTimeoutSim = null;

function hablarTexto(texto, callback) {
  if (!('speechSynthesis' in window)) {
    if (callback) callback();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'es-PE';
    utter.rate = 1.0;
    utter.pitch = 1.0;

    let callbackLlamado = false;
    const ejecutarCallback = () => {
      if (!callbackLlamado) {
        callbackLlamado = true;
        if (callback) callback();
      }
    };

    utter.onend = ejecutarCallback;
    utter.onerror = ejecutarCallback;

    const voces = window.speechSynthesis.getVoices();
    const vozEs = voces.find(v => v.lang.startsWith('es') || v.lang.includes('Spanish'));
    if (vozEs) utter.voice = vozEs;

    window.speechSynthesis.speak(utter);
  } catch (e) {
    if (callback) callback();
  }
}

function abrirModalAccesoVoz() {
  playSound('modalOpen');
  const modal = document.getElementById('modal-acceso-voz-wrapper');
  if (!modal) return;

  modal.style.display = 'flex';
  vozReconocimientoActivo = true;

  const btnMic = document.getElementById('btn-mic-voz');
  if (btnMic) btnMic.classList.add('escuchando');

  const estadoBadge = document.getElementById('voz-estado-texto');
  if (estadoBadge) estadoBadge.textContent = 'Escuchando... Diga su DNI o "Ingresar"';

  const eq = document.getElementById('voz-ecualizador');
  if (eq) {
    eq.style.display = 'flex';
    eq.style.opacity = '1';
  }

  const cajaUsuario = document.getElementById('voz-caja-usuario');
  if (cajaUsuario) cajaUsuario.style.display = 'none';

  const txtAsistente = document.getElementById('voz-txt-asistente');
  if (txtAsistente) {
    txtAsistente.textContent = '"Bienvenido al acceso asistido por voz. Por favor, diga su DNI en voz alta o presione el botón de simulación abajo."';
  }

  // Locución auditiva
  hablarTexto('Bienvenido al acceso asistido por voz de la Lotería SUNAT. Por favor, diga su DNI o presione el botón de simulación.');
}

function cerrarModalAccesoVoz(cancelarAudio = true) {
  playSound('modalClose');
  if (cancelarAudio && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  if (vozTimeoutSim) {
    clearTimeout(vozTimeoutSim);
    vozTimeoutSim = null;
  }
  const modal = document.getElementById('modal-acceso-voz-wrapper');
  if (modal) modal.style.display = 'none';
  vozReconocimientoActivo = false;
}

function toggleVozEscucha() {
  playSound('toggle');
  const btnMic = document.getElementById('btn-mic-voz');
  const estadoBadge = document.getElementById('voz-estado-texto');
  const eq = document.getElementById('voz-ecualizador');

  vozReconocimientoActivo = !vozReconocimientoActivo;

  if (vozReconocimientoActivo) {
    btnMic?.classList.add('escuchando');
    if (estadoBadge) estadoBadge.textContent = 'Escuchando... Diga su DNI o "Ingresar"';
    if (eq) eq.style.opacity = '1';
    hablarTexto('Micrófono activo. Diga su DNI para ingresar.');
  } else {
    btnMic?.classList.remove('escuchando');
    if (estadoBadge) estadoBadge.textContent = 'Micrófono en pausa. Toque para reanudar.';
    if (eq) eq.style.opacity = '0.3';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

function repetirInstruccionVoz() {
  playSound('clic');
  const estadoBadge = document.getElementById('voz-estado-texto');
  if (estadoBadge) estadoBadge.textContent = 'Reproduciendo instrucciones auditivas...';
  hablarTexto('Para ingresar a su cuenta de participante, diga su número de documento DNI o presione el botón de simulación rápida.');
}

function ejecutarComandoVozSimulado(dni = '72158118') {
  playSound('step');
  const estadoBadge = document.getElementById('voz-estado-texto');
  const cajaUsuario = document.getElementById('voz-caja-usuario');
  const txtUsuario = document.getElementById('voz-txt-usuario');
  const txtAsistente = document.getElementById('voz-txt-asistente');

  if (cajaUsuario) cajaUsuario.style.display = 'flex';
  if (txtUsuario) txtUsuario.textContent = `"DNI ${dni}, ingresar a mi cuenta"`;
  if (estadoBadge) estadoBadge.textContent = `Validando DNI ${dni}...`;

  // Mensaje exacto solicitado por el usuario
  const mensajeSimulacion = `DNI ${dni}. Validación completa, bienvenido Alfonso.`;

  if (txtAsistente) {
    txtAsistente.textContent = `"${mensajeSimulacion}"`;
  }

  let finalizado = false;
  const culminarAcceso = () => {
    if (finalizado) return;
    finalizado = true;
    if (vozTimeoutSim) {
      clearTimeout(vozTimeoutSim);
      vozTimeoutSim = null;
    }

    playSound('success');

    // Cerrar modal sin cancelar la locución auditiva
    cerrarModalAccesoVoz(false);

    mostrarNotificacion({
      tipo: 'verde',
      titulo: 'Validación Completa',
      subtitulo: `DNI ${dni}. Validación completa, bienvenido Alfonso.`,
      duracion: 3500
    });

    navigate('pantalla-principal');
  };

  // Reproducir locución completa y esperar a que termine naturalmente de hablar
  hablarTexto(mensajeSimulacion, () => {
    // Esperar 400ms después de que termine la voz antes de culminar
    setTimeout(culminarAcceso, 400);
  });

  // Timeout de seguridad amplio (6 segundos) para dar tiempo a decir todo el mensaje
  vozTimeoutSim = setTimeout(culminarAcceso, 6000);
}

/* ==========================================================================
   PANTALLAS 11, 12, 13: CAMBIAR CLAVE Y EVALUACIÓN EN TIEMPO REAL
   ========================================================================== */
function evaluarClaveEnVivo() {
  const nuevaInput = document.getElementById('clave-nueva');
  const repetirInput = document.getElementById('clave-repetir');
  const valNueva = nuevaInput?.value || '';
  const valRepetir = repetirInput?.value || '';

  // 1. Longitud 5-15
  const reqLongitud = valNueva.length >= 5 && valNueva.length <= 15;
  document.getElementById('req-longitud')?.classList.toggle('cumplido', reqLongitud);

  // 2. Mayúscula
  const reqMayus = /[A-Z]/.test(valNueva);
  document.getElementById('req-mayus')?.classList.toggle('cumplido', reqMayus);

  // 3. Minúscula
  const reqMinus = /[a-z]/.test(valNueva);
  document.getElementById('req-minus')?.classList.toggle('cumplido', reqMinus);

  // 4. Número
  const reqNumero = /[0-9]/.test(valNueva);
  document.getElementById('req-numero')?.classList.toggle('cumplido', reqNumero);

  // 5. Coincidencia
  const reqCoincide = valNueva.length > 0 && valNueva === valRepetir;
  document.getElementById('req-coincide')?.classList.toggle('cumplido', reqCoincide);

  // Medidor de fortaleza
  let puntuacion = 0;
  if (reqLongitud) puntuacion++;
  if (reqMayus) puntuacion++;
  if (reqMinus) puntuacion++;
  if (reqNumero) puntuacion++;

  const badgeTexto = document.getElementById('badge-fortaleza-texto');
  const bar1 = document.getElementById('bar-seg-1');
  const bar2 = document.getElementById('bar-seg-2');
  const bar3 = document.getElementById('bar-seg-3');
  const bar4 = document.getElementById('bar-seg-4');

  [bar1, bar2, bar3, bar4].forEach(b => {
    if (b) b.className = 'barra-segmento';
  });

  if (badgeTexto) {
    badgeTexto.className = 'badge-fortaleza';
    if (!valNueva) {
      badgeTexto.textContent = 'Sin ingresar';
      badgeTexto.classList.add('nivel-vacio');
    } else if (puntuacion <= 1) {
      badgeTexto.textContent = 'Débil';
      badgeTexto.classList.add('nivel-debil');
      bar1?.classList.add('activo-rojo');
    } else if (puntuacion === 2) {
      badgeTexto.textContent = 'Regular';
      badgeTexto.classList.add('nivel-medio');
      bar1?.classList.add('activo-naranja');
      bar2?.classList.add('activo-naranja');
    } else if (puntuacion === 3) {
      badgeTexto.textContent = 'Buena';
      badgeTexto.classList.add('nivel-medio');
      bar1?.classList.add('activo-naranja');
      bar2?.classList.add('activo-naranja');
      bar3?.classList.add('activo-naranja');
    } else {
      badgeTexto.textContent = 'Excelente';
      badgeTexto.classList.add('nivel-fuerte');
      bar1?.classList.add('activo-verde');
      bar2?.classList.add('activo-verde');
      bar3?.classList.add('activo-verde');
      bar4?.classList.add('activo-verde');
    }
  }
}

function handleCambiarClaveSubmit(event) {
  event.preventDefault();
  const claveActualInput = document.getElementById('clave-actual');
  const claveNuevaInput = document.getElementById('clave-nueva');
  const claveRepetirInput = document.getElementById('clave-repetir');

  const errActual = document.getElementById('err-clave-actual');
  const errNueva = document.getElementById('err-clave-nueva');
  const errRepetir = document.getElementById('err-clave-repetir');

  if (errActual) errActual.textContent = '';
  if (errNueva) errNueva.textContent = '';
  if (errRepetir) errRepetir.textContent = '';

  claveActualInput?.classList.remove('input-invalido', 'input-valido');
  claveNuevaInput?.classList.remove('input-invalido', 'input-valido');
  claveRepetirInput?.classList.remove('input-invalido', 'input-valido');

  const actual = claveActualInput?.value || '';
  const nueva = claveNuevaInput?.value || '';
  const repetir = claveRepetirInput?.value || '';

  let error = false;

  if (actual !== AppState.usuarioActual.clave) {
    claveActualInput?.classList.add('input-invalido');
    if (errActual) errActual.textContent = 'La clave actual no coincide.';
    error = true;
  }

  const reglaLongitud = nueva.length >= 5 && nueva.length <= 15;
  const reglaMayus = /[A-Z]/.test(nueva);
  const reglaMinus = /[a-z]/.test(nueva);
  const reglaNumero = /[0-9]/.test(nueva);

  if (!reglaLongitud || !reglaMayus || !reglaMinus || !reglaNumero) {
    claveNuevaInput?.classList.add('input-invalido');
    if (errNueva) errNueva.textContent = 'Debe cumplir los requisitos de seguridad indicados.';
    error = true;
  }

  if (nueva !== repetir) {
    claveRepetirInput?.classList.add('input-invalido');
    if (errRepetir) errRepetir.textContent = 'Las contraseñas no coinciden.';
    error = true;
  }

  if (error) {
    playSound('error');
    mostrarNotificacion({
      tipo: 'rojo',
      titulo: 'Contraseña no válida',
      subtitulo: 'Revisa los campos destacados y cumple los requisitos.',
      duracion: 3200
    });
    return;
  }

  claveActualInput?.classList.add('input-valido');
  claveNuevaInput?.classList.add('input-valido');
  claveRepetirInput?.classList.add('input-valido');

  AppState.usuarioActual.clave = nueva;
  playSound('step');

  const now = new Date();
  const fechaStr = `Hoy, ${now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  const fechaResumen = document.getElementById('conf-resumen-fecha');
  if (fechaResumen) fechaResumen.textContent = fechaStr;

  const nombreResumen = document.getElementById('conf-resumen-nombre');
  if (nombreResumen) nombreResumen.textContent = `${AppState.usuarioActual.nombre} ${AppState.usuarioActual.apellidos}`;

  navigate('pantalla-cambiar-clave-cargando');
  setTimeout(() => {
    playSound('success');
    mostrarNotificacion({
      tipo: 'verde',
      titulo: 'Clave Actualizada',
      subtitulo: 'Tus credenciales se han renovado con éxito',
      duracion: 3200
    });
    navigate('pantalla-cambiar-clave-confirmada');
  }, 1600);
}

/* ==========================================================================
   ATAJOS DE TECLADO Y ACCESIBILIDAD
   ========================================================================== */
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    const modalVoz = document.getElementById('modal-acceso-voz-wrapper');
    if (modalVoz && modalVoz.style.display === 'flex') {
      cerrarModalAccesoVoz();
      return;
    }
    const modalConfirm = document.getElementById('modal-confirm-eliminar-wrapper');
    if (modalConfirm && modalConfirm.style.display === 'flex') {
      cerrarConfirmEliminar();
      return;
    }
    const modalDetalle = document.getElementById('modal-detalle-wrapper');
    if (modalDetalle && modalDetalle.style.display === 'flex') {
      cerrarModalDetalle();
      return;
    }
    const modalFacturaFull = document.getElementById('modal-factura-full-wrapper');
    if (modalFacturaFull && (modalFacturaFull.style.display === 'flex' || modalFacturaFull.style.display === 'block')) {
      cerrarModalFacturaFull();
      return;
    }
    if (AppState.activeScreen === 'pantalla-qr') {
      navigate('pantalla-registrar');
    }
  }
});

/* ==========================================================================
   INICIALIZACIÓN Y EVENTOS RESPONSIVOS DE VENTANA
   ========================================================================== */
window.addEventListener('resize', () => {
  autoScale();
});

window.addEventListener('orientationchange', () => {
  setTimeout(autoScale, 100);
});

// Restaurar tamaño de letra persistido al cargar
document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedFont = localStorage.getItem('sunat_tamano_letra');
    if (savedFont && ['pequeno', 'normal', 'grande', 'muygrande'].includes(savedFont)) {
      cambiarTamanoLetra(savedFont, null, false);
    }
  } catch (e) {}

  autoScale();
});

// Llamada inmediata para inicializar escalas
autoScale();
