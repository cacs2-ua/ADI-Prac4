// terminal-check.js

const readline = require('readline');
const authService = require('./services/authService');
const userService = require('./services/userService');
const resourceService = require('./services/resourceService');
const appointmentService = require('./services/appointmentService');
const reviewService = require('./services/reviewService');
const incidenciaService = require('./services/incidenciaService');
const firebase = require('./firebase/firebase');
const admin = firebase.admin;

// Variables para almacenar el estado
let currentUser = null;
let idToken = null;

// Configuración de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para mostrar el menú principal
function showMainMenu() {
  console.log('\n=== Menú Principal ===');
  console.log('1. Registro de Cliente');
  console.log('2. Registro de Administrador');
  console.log('3. Registro de Músico');
  console.log('4. Inicio de Sesión');
  console.log('5. Cerrar Sesión');
  console.log('6. Inicio de Sesión por OAuth');
  console.log('7. Cerrar Sesión (OAuth)');
  console.log('8. Olvidé mi Contraseña');
  console.log('9. Editar Perfil');
  console.log('10. Eliminar Cuenta');
  console.log('11. Listar Músicos');
  console.log('12. Listar Músicos por Paginación');
  console.log('13. Detalles del músico');
  console.log('14. Editar Información de un Músico');
  console.log('15. Eliminar un Músico');
  console.log('16. Crear Cita');
  console.log('17. Listar Citas');
  console.log('18. Modificar Cita');
  console.log('19. Borrar Cita');
  console.log('20. Crear Reseña');
  console.log('21. Listar Reseñas de un Músico');
  console.log('22. Crear Incidencia');
  console.log('23. Listar Incidencias');
  console.log('24. Detalles de una Incidencia'); 
  console.log('25. Editar una Incidencia');
  console.log('26. Eliminar una Incidencia');
  console.log('27. Salir');
  rl.question('Seleccione una opción: ', handleMainMenu);
}

// Función para manejar la selección del menú principal
function handleMainMenu(option) {
  switch (option) {
    case '1':
      registerClient();
      break;
    case '2':
      registerAdmin();
      break;
    case '3':
      registerMusician();
      break;
    case '4':
      loginUser();
      break;
    case '5':
      signOut();
      break;
    case '6':
      OAuthLogin();
      break;
    case '7':
      OAuthSignOut();
      break;
    case '8':
      forgotPassword();
      break;
    case '9':
      editProfile();
      break;
    case '10':
      deleteAccount();
      break;
    case '11':
      listResources();
      break;
    case '12':
      listResourcesPaginated();
      break;
    case '13':
      getResourceDetails();
      break;
    case '14':
      editResource();
      break;
    case '15':
      deleteResource();
      break;
    case '16':
      createAppointment();
      break;
    case '17':
      listAppointments();
      break;
    case '18':
      modifyAppointment();
      break;
    case '19':
      deleteAppointment();
      break;
    case '20':
      createReview();
      break;
    case '21':
      listReviews();
      break;
    case '22':
      createIncidencia();       
      break;
    case '23':
      listIncidencias();         
      break;
    case '24':
      getIncidenciaDetails();    
      break;
    case '25':
      editIncidencia();          
      break;
    case '26':
      deleteIncidencia();       
      break;
    case '27':
      console.log('¡Hasta luego!');
      rl.close();
      break;
    default:
      console.log('Opción no válida. Intente nuevamente.');
      showMainMenu();
      break;
  }
}

function registerClient() {
  rl.question('Ingrese su email: ', (email) => {
    rl.question('Ingrese su contraseña: ', (password) => {
      rl.question('Ingrese su nombre: ', (displayName) => {
        authService
          .signupClient(email, password, { displayName })
          .then((data) => {
            console.log('Paciente registrado exitosamente:', data);
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al registrar paciente:', error);
            showMainMenu();
          });
      });
    });
  });
}

function registerAdmin() {
  rl.question('Ingrese su email: ', (email) => {
    rl.question('Ingrese su contraseña: ', (password) => {
      rl.question('Ingrese su nombre: ', (displayName) => {
        authService
          .signupAdmin(email, password, { displayName })
          .then((data) => {
            console.log('Administrador registrado exitosamente:', data);
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al registrar administrador:', error);
            showMainMenu();
          });
      });
    });
  });
}



function registerMusician() {
  rl.question('Ingrese el email del músico: ', (email) => {
    rl.question('Ingrese la contraseña: ', (password) => {
      rl.question('Ingrese el nombre del músico: ', (name) => {
        rl.question('Ingrese la ubicación: ', (location) => {
          authService
            .signupMusician(email, password, { name, location })
            .then((data) => {
              console.log('músico registrado exitosamente:', data);
              showMainMenu();
            })
            .catch((error) => {
              console.error('Error al registrar el músico:', error);
              showMainMenu();
            });
        });
      });
    });
  });
}

function loginUser() {
  rl.question('Ingrese su email: ', (email) => {
    rl.question('Ingrese su contraseña: ', (password) => {
      authService
        .login(email, password)
        .then((data) => {
          idToken = data.idToken;
          // Verificar el token y obtener información del usuario
          admin
            .auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
              currentUser = decodedToken;
              console.log('Inicio de sesión exitoso. Bienvenido:', currentUser.email);
              showMainMenu();
            })
            .catch((error) => {
              console.error('Error al verificar el token:', error);
              showMainMenu();
            });
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
          showMainMenu();
        });
    });
  });
}

function signOut() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para cerrar la sesión.');
    showMainMenu();
    return;
  }

  authService
    .signout(idToken)
    .then((data) => {
      console.log(data.message);
      currentUser = null;
      idToken = null;
      showMainMenu();
    })
    .catch((error) => {
      console.error('Error al cerrar la sesión:', error);
      showMainMenu();
    });
}

function OAuthLogin() {
  const oauthUrl = 'http://localhost:5000/auth/google';
  console.log(`Visita la siguiente URL para autenticarte por OAuth: ${oauthUrl}`);
  setTimeout(() => {
    showMainMenu();
  }, 4000);
}

function OAuthSignOut() {
  const oauthUrl = 'http://localhost:5000/logout';
  console.log(`Visita la siguiente URL para cerrar tu sesión (OAuth): ${oauthUrl}`);
  setTimeout(() => {
    showMainMenu();
  }, 4000);
}




function forgotPassword() {
  rl.question('Ingrese su email: ', (email) => {
    authService
      .forgotPassword(email)
      .then((data) => {
        console.log(data.message);
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al enviar correo de restablecimiento:', error);
        showMainMenu();
      });
  });
}

function editProfile() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para editar su perfil.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese su nuevo nombre (deje en blanco para no cambiar): ', (displayName) => {
    const data = {};
    if (displayName) data.displayName = displayName;
    userService
      .updateUser(currentUser.uid, data)
      .then((userRecord) => {
        console.log('Perfil actualizado:', userRecord);
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al actualizar el perfil:', error);
        showMainMenu();
      });
  });
}

function deleteAccount() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para eliminar su cuenta.');
    showMainMenu();
    return;
  }
  rl.question('¿Está seguro de que desea eliminar su cuenta? (s/n): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      userService
        .deleteUser(currentUser.uid)
        .then(() => {
          console.log('Cuenta eliminada exitosamente.');
          currentUser = null;
          idToken = null;
          showMainMenu();
        })
        .catch((error) => {
          console.error('Error al eliminar la cuenta:', error);
          showMainMenu();
        });
    } else {
      console.log('Operación cancelada.');
      showMainMenu();
    }
  });
}

function listResources() {
  resourceService
    .listResources()
    .then((resources) => {
      console.log('\n=== Lista de Músicos ===');
      resources.forEach((resource) => {
        console.log(`ID: ${resource.id}, Nombre: ${resource.name}`);
      });
      showMainMenu();
    })
    .catch((error) => {
      console.error('Error al listar recursos:', error);
      showMainMenu();
    });
}

// Nueva función para listar recursos con paginación
function listResourcesPaginated(startAfter = null) {
  rl.question('Ingrese el número de recursos por página (default 10): ', (limitInput) => {
    const limit = parseInt(limitInput) || 10;
    resourceService
      .listResourcesPaginated(limit, startAfter)
      .then((resources) => {
        if (resources.length === 0) {
          console.log('No hay más recursos para mostrar.');
          showMainMenu();
          return;
        }

        console.log('\n=== Lista de Músicos (Paginada) ===');
        resources.forEach((resource, index) => {
          console.log(`ID: ${resource.id}, Nombre: ${resource.name}`);
        });

        // Obtener el último documento para la siguiente página
        const lastResource = resources[resources.length - 1];
        const nextStartAfter = lastResource.id;

        // Preguntar al usuario si desea ver la siguiente página
        rl.question('¿Desea ver la siguiente página? (s/n): ', (answer) => {
          if (answer.toLowerCase() === 's') {
            listResourcesPaginated(nextStartAfter);
          } else {
            showMainMenu();
          }
        });
      })
      .catch((error) => {
        console.error('Error al listar recursos por paginación:', error);
        showMainMenu();
      });
  });
}

function getResourceDetails() {
  rl.question('Ingrese el ID del músico: ', (id) => {
    resourceService
      .getResourceDetails(id)
      .then((resource) => {
        console.log('\n=== Detalles del músico ===');
        console.log(resource);
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al obtener detalles del recurso:', error);
        showMainMenu();
      });
  });
}

function editResource() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para editar un recurso.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese el ID del músico a editar: ', (id) => {
    rl.question('Ingrese el nuevo nombre (deje en blanco para no cambiar): ', (name) => {
      rl.question('Ingrese la nueva ubicación (deje en blanco para no cambiar): ', (location) => {
        const data = {};
        if (name) data.name = name;
        if (location) data.location = location;
        resourceService
          .updateResource(id, data)
          .then(() => {
            console.log('Recurso actualizado exitosamente.');
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al actualizar el recurso:', error);
            showMainMenu();
          });
      });
    });
  });
}

function deleteResource() {
  if (!currentUser) {
    console.log('Debe iniciar sesión como administrador para eliminar un recurso.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese el ID del músico a eliminar: ', (id) => {
    resourceService
      .deleteResource(id)
      .then(() => {
        console.log('Recurso eliminado exitosamente.');
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al eliminar el recurso:', error);
        showMainMenu();
      });
  });
}

function createAppointment() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para crear una cita.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese la fecha de la cita (YYYY-MM-DD): ', (date) => {
    rl.question('Ingrese la hora de la cita (HH:MM): ', (time) => {
      rl.question('Ingrese el nombre del músico: ', (musician) => {
        rl.question('Ingrese el motivo de la cita: ', (reason) => {
          const data = {
            date,
            time,
            musician,
            reason,
            userId: currentUser.uid,
          };
          appointmentService
            .createAppointment(data)
            .then((appointment) => {
              console.log('Cita creada exitosamente:', appointment);
              showMainMenu();
            })
            .catch((error) => {
              console.error('Error al crear la cita:', error);
              showMainMenu();
            });
        });
      });
    });
  });
}

function listAppointments() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para listar sus citas.');
    showMainMenu();
    return;
  }
  appointmentService
    .listUserAppointments(currentUser.uid)
    .then((appointments) => {
      console.log('\n=== Lista de Citas ===');
      appointments.forEach((appointment) => {
        console.log(`ID: ${appointment.id}, Fecha: ${appointment.date}, Músico: ${appointment.musician}`);
      });
      showMainMenu();
    })
    .catch((error) => {
      console.error('Error al listar las citas:', error);
      showMainMenu();
    });
}

function modifyAppointment() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para modificar una cita.');
    showMainMenu();
    return;
  }

  rl.question('Ingrese el ID de la cita a modificar: ', (appointmentId) => {
    rl.question('Ingrese la nueva fecha de la cita (YYYY-MM-DD): ', (newDate) => {
      rl.question('Ingrese la nueva hora de la cita (HH:mm): ', (newTime) => {
        const updatedData = {
          date: newDate,
          time: newTime,
        };

        // Llamar al servicio para actualizar la cita
        appointmentService.updateAppointment(appointmentId, updatedData)
          .then(() => {
            console.log('Cita modificada correctamente.');
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al modificar la cita:', error);
            showMainMenu();
          });
      });
    });
  });
}

function deleteAppointment() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para borrar una cita.');
    showMainMenu();
    return;
  }

  rl.question('Ingrese el ID de la cita a eliminar: ', (appointmentId) => {
    // Llamar al servicio para eliminar la cita
    appointmentService.deleteAppointment(appointmentId)
      .then(() => {
        console.log('Cita eliminada correctamente.');
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al eliminar la cita:', error);
        showMainMenu();
      });
  });
}

function createReview() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para crear una reseña.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese el ID del músico: ', (musicianId) => {
    rl.question('Ingrese su calificación (1-5): ', (rating) => {
      rl.question('Ingrese su comentario: ', (comment) => {
        const data = {
          rating: parseInt(rating),
          comment,
          userId: currentUser.uid,
          createdAt: new Date(),
        };
        reviewService
          .createReview(musicianId, data)
          .then((review) => {
            console.log('Reseña creada exitosamente:', review);
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al crear la reseña:', error);
            showMainMenu();
          });
      });
    });
  });
}

function listReviews() {
  rl.question('Ingrese el ID del músico: ', (musicianId) => {
    reviewService
      .getReviews(musicianId)
      .then((reviews) => {
        console.log('\n=== Reseñas del músico ===');
        reviews.forEach((review) => {
          console.log(`Usuario: ${review.userId}, Calificación: ${review.rating}, Comentario: ${review.comment}`);
        });
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al obtener las reseñas:', error);
        showMainMenu();
      });
  });
}

function createIncidencia() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para crear una incidencia.');
    showMainMenu();
    return;
  }
  rl.question('Ingrese el título de la incidencia: ', (title) => {
    rl.question('Ingrese la descripción de la incidencia: ', (description) => {
      incidenciaService.createIncidencia({ title, description })
        .then((incidencia) => {
          console.log('Incidencia creada exitosamente:', incidencia);
          showMainMenu();
        })
        .catch((error) => {
          console.error('Error al crear la incidencia:', error);
          showMainMenu();
        });
    });
  });
}

function listIncidencias() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para ver las Incidencias.');
    showMainMenu();
    return;
  }

  incidenciaService.getAllIncidencias()
    .then((incidencias) => {
      console.log('\n=== Lista de Incidencias ===');
      incidencias.forEach((incidencia) => {
        console.log(`ID: ${incidencia.id}, Título: ${incidencia.title}`);
      });
      showMainMenu();
    })
    .catch((error) => {
      console.error('Error al listar incidencias:', error);
      showMainMenu();
    });
}

function getIncidenciaDetails() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para ver los detalles de una Incidencia.');
    showMainMenu();
    return;
  }

  rl.question('Ingrese el ID de la incidencia: ', (id) => {
    incidenciaService.getIncidenciaById(id)
      .then((incidencia) => {
        console.log('\n=== Detalles de la Incidencia ===');
        console.log(`ID: ${incidencia.id}`);
        console.log(`Título: ${incidencia.title}`);
        console.log(`Descripción: ${incidencia.description}`);
        console.log(`Fecha de Creación: ${incidencia.createdAt}`);
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al obtener detalles de la incidencia:', error);
        showMainMenu();
      });
  });
}

function editIncidencia() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para editar la información de una Incidencia.');
    showMainMenu();
    return;
  }

  rl.question('Ingrese el ID de la incidencia a editar: ', (id) => {
    rl.question('Ingrese el nuevo título (deje en blanco para no cambiar): ', (title) => {
      rl.question('Ingrese la nueva descripción (deje en blanco para no cambiar): ', (description) => {
        const data = {};
        if (title) data.title = title;
        if (description) data.description = description;

        incidenciaService.updateIncidencia(id, data)
          .then((updatedIncidencia) => {
            console.log('Incidencia actualizada exitosamente:', updatedIncidencia);
            showMainMenu();
          })
          .catch((error) => {
            console.error('Error al actualizar la incidencia:', error);
            showMainMenu();
          });
      });
    });
  });
}

function deleteIncidencia() {
  if (!currentUser) {
    console.log('Debe iniciar sesión para borrar una incidencia.');
    showMainMenu();
    return;
  }

  rl.question('Ingrese el ID de la incidencia a eliminar: ', (id) => {
    incidenciaService.deleteIncidencia(id)
      .then(() => {
        console.log('Incidencia eliminada exitosamente.');
        showMainMenu();
      })
      .catch((error) => {
        console.error('Error al eliminar la incidencia:', error);
        showMainMenu();
      });
  });
}






// Iniciar el programa
console.log('Bienvenido al sistema de prueba de GreenHealth.');
showMainMenu();
