// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

//const swaggerUi = require('swagger-ui-express');
import swaggerUi from 'swagger-ui-express';
//const swaggerJsdoc = require('swagger-jsdoc');
import swaggerJsdoc from 'swagger-jsdoc';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // Importa la función join desde el módulo path

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'API Veterinarios',
        description: 'API destinada para uso de veterinarios, permite el regsitro de veterinariosm regitro de pacientes y ademas de los tratamientos a los que se sommete cada paciente.',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'https://petclinic-ckki.onrender.com',
        },
        {
            //url: '',
        },
    ],
    components: {
        schemas: {
            Veterinarios: {
                type: 'object',
                required: ['nombre', 'apellido', 'email', 'password'],
                properties: {
                    nombre: { type: 'String', description: 'nombre del veterinario' },
                    apellido: { type: 'String', description: 'apellido del veterinario' },
                    direccion: { type: 'String', description: 'direcion/sector donde vive el veterinario' },
                    telefono: { type: 'Number', description: 'telefono del veterinario' },
                    email: { type: 'String', description: 'correo electronico del veterinario' },
                    password: { type: 'String', description: 'conntraseña de acceso del veterinario' },
                    status: { type: 'Boolean', description: '' },
                    token: { type: 'String', description: 'verificacion generado despues del acceso del veterinario' },
                    confirmarEmail: { type: 'Boolean', description: 'confirmacion de estado de registro despues del comprobar el token' },
                }

            },
            Pacientes: {
                type: 'object',
                required: ['nombre', 'propietario', 'email', 'password', 'celular', 'convecional', 'ingreso', 'sintomas', 'salida'],
                properties: {
                    nombre: { type: 'String', description: 'nombre la mascota' },
                    propietario: { type: 'String', description: 'nombre del dueño de la mascota' },
                    email: { type: 'String', description: 'email del dueño de la mascota' },
                    password: { type: 'String', description: 'contraseña de acceso para el dueño de la mascota' },
                    celular: { type: 'String', description: 'telefono de contaco del dueño de la mascota' },
                    convecional: { type: 'String', description: 'telefono de la casa del dueño de la mascota' },
                    ingreso: { type: 'Date', description: 'fecha de ingreso de la mascota a la veterinaria' },
                    sintomas: { type: 'String', description: 'Razon por la cuel ingresa la mascota' },
                    salida: { type: 'Date', description: 'fecha de salida de la mascota' },
                    estado: { type: 'Boolean', description: 'Si la mascota ya recibe el tratamiento y sale de la veterinaria su estado debe cambiar, porque ya no se encuentra en la instirucion' },
                    veterinario: { type: 'Number', description: 'Se asigna el id del veterinario que esta registrando a la mascota' }
                }

            },
            Tratamientos: {
                type: 'object',
                required: ['nombre', 'descripcion', 'estado', 'prioridad'],
                properties: {
                    nombre: { type: 'String', description: 'Nombre del tratamiento' },
                    descripcion: { type: 'String', description: 'Dellae del tratamiento que recibe' },
                    estado: { type: 'Boolean', description: 'Si ya recibio el tramiento o no su estado debe cambiar' },
                    prioridad: { type: 'String', description: 'El tratemiento que recibe es de priotidad alta, media o baja' },
                    paciente: { type: 'Number', description: 'Id del paciente/mascota que recibe el tratamiento' },
                }

            }
        }
    },
    paths: {
        //-----------------------Veterinarios--------------------------
        '/api/login': {
            post: {
                summary: 'Login de veterinarios',
                tags: ['Veterinarios'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', description: 'Correo electrónico del usuario' },
                                    password: { type: 'string', description: 'Contraseña del usuario' }
                                },
                                required: ['email', 'password']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Inicio de sesión exitoso'
                    },
                    '401': {
                        description: 'Credenciales inválidas'
                    }
                }
            }
        },
        '/api/registro': {
            post: {
                summary: 'Registro de veterinarios',
                tags: ['Veterinarios'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string' },
                                    apellido: { type: 'string' },
                                    direccion: { type: 'string' },
                                    telefono: { type: 'number' },
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                },
                                required: ['nombre', 'apellido', 'direccion', 'telefono', 'email', 'password']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Registro exitoso'
                    },
                    '400': {
                        description: 'El correo ya existe en el sistema'
                    }
                }
            }
        },
        '/api/confirmar/{token}': {
            get: {
                summary: 'confimacion del email del veterinarios',
                tags: ['Veterinarios'],
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        description: 'Token de confirmación de cuenta',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Tooken confirmado'
                    },
                    '400': {
                        description: 'No se puede validar la cuenta. El token no fue proporcionado.'
                    },
                    '404': {
                        description: 'La cuenta ya ha sido confirmada anteriormente.'
                    }
                }

            }
        },
        '/api/veterinarios': {
            get: {
                summary: 'Obtener lista de veterinarios',
                tags: ['Veterinarios'],

                responses: {
                    '200': {
                        description: 'Lista de veterinarios registrados',
                    }
                }
            }
        },
        '/api/recuperar-password': {
            post: {
                summary: 'Recuperar contraseña de veterinarios',
                tags: ['Veterinarios'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'Correo electrónico del veterinario'
                                    }
                                },
                                required: ['email']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Correo electrónico enviado para cambiar la contraseña.'
                    },
                    '404': {
                        description: 'El usuario no se encuentra registrado.'
                    }
                }
            }
        },
        '/api/recuperar-password/{token}': {
            get: {
                summary: 'Verificar token de recuperación de contraseña',
                tags: ['Veterinarios'],
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        description: 'Token de recuperación de contraseña',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Token confirmado.'
                    },
                    '404': {
                        description: 'No se puede validar el token.'
                    }
                }
            }
        },
        '/api//nuevo-password/{token}': {
            post: {
                summary: 'Establecer nueva contraseña',
                tags: ['Veterinarios'],
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        description: 'Token de recuperación de contraseña',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    password: {
                                        type: 'string',
                                    },
                                    confirmpassword: {
                                        type: 'string',
                                    }
                                },
                                required: ['password', 'confirmpassword']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Nueva contraseña establecida correctamente.'
                    },
                    '404': {
                        description: 'Las contrase{as no coinciden.'
                    }
                }

            }
        },
        '/api/perfil': {
            get: {
                summary: 'Obtener perfil del veterinario',
                tags: ['Veterinarios'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'Muestra la Informacion sobre el veterinario.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Veterinarios'
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'No se puede obtener el perfil del veterinario'
                    }
                }
            }
        },
        '/api/veterinario/actualizarpassword': {
            put: {
                summary: 'Actualizar contraseña del veterinario',
                tags: ['Veterinarios'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    passwordactual: { type: 'string', description: 'Contraseña actual del veterinario' },
                                    passwordnuevo: { type: 'string', description: 'Nueva contraseña del veterinario' }
                                },
                                required: ['passwordactual', 'passwordnuevo']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Contraseña actualizada correctamente.'
                    },
                    '404': {
                        description: 'No se pudo actualizar la contraseña del veterinario.'
                    }
                }
            }
        },
        '/api/veterinarios/{id}': {
            get: {
                summary: 'Detalles de un veterinario',
                tags: ['Veterinarios'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID del veterinario',
                    },
                ],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Detalles del veterinario obtenidos con éxito',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Veterinario',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'No se encontró ningún veterinario con el ID especificado',
                    },
                },
            },
            put: {
                summary: 'Actualizar perfil de un veterinario',
                tags: ['Veterinarios'],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'ID del veterinario',
                    },
                ],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Veterinario', // Puedes definir el esquema del cuerpo de la solicitud aquí
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Perfil del veterinario actualizado correctamente',
                    },
                    '400': {
                        description: 'Error al procesar la solicitud debido a campos faltantes o incorrectos',
                    },
                    '404': {
                        description: 'No se encontró ningún veterinario con el ID especificado',
                    },
                },
            },
        },
        //--------------------------TRATAMIENTOS
        '/api/tratamiento/registro': {
            post: {
                summary: 'Registrar un nuevo tratamiento',
                tags: ['Tratamientos'],
                security: [
                  {
                    bearerAuth: [],
                  },
                ],
                requestBody: {
                  required: true,
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          nombre: { type: 'string',  },
                          detalle: { type: 'string', },
                          prioridad: { type: 'string',},
                        },
                        required: ['nombre', 'detalle', 'prioridad', 'paciente'],
                      },
                    },
                  },
                },
                responses: {
                  '200': {
                    description: 'Registro exitoso del tratamiento',
                  },
                  '404': {
                    description: 'Error al registrar el tratamiento',
                  },
                },
              },
        },
        '/api//tratamiento/{id}':{
            get: {
                summary: 'ver detalles de un tratamiento',
                tags: ['Tratamientos'],
                security: [
                  {
                    bearerAuth: [],
                  },
                ],
                parameters: [
                  {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID del tratamiento a obtener detalles',
                    schema: {
                      type: 'string',
                    },
                  },
                ],
                responses: {
                  '200': {
                    description: 'Detalle del tratamiento',
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            nombre: { type: 'string', description: 'Nombre del tratamiento' },
                            detalle: { type: 'string', description: 'Detalle del tratamiento' },
                            prioridad: { type: 'string', description: 'Prioridad del tratamiento' },
                            paciente: { type: 'string', description: 'ID del paciente asociado' },
                          },
                        },
                      },
                    },
                  },
                  '404': {
                    description: 'No se encontró el tratamiento',
                  },
                },
              }

        },
        '/api/tratamiento/{id}':{
            put: {
                summary: 'Actualizar un tratamiento existente',
                tags: ['Tratamientos'],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID del tratamiento a actualizar',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nombre: { type: 'string', description: 'Nuevo nombre del tratamiento' },
                                    detalle: { type: 'string', description: 'Nuevo detalle del tratamiento' },
                                    prioridad: { type: 'string', description: 'Nueva prioridad del tratamiento' },
                                    // Agrega aquí cualquier otro campo que pueda ser actualizado
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Actualización exitosa del tratamiento',
                    },
                    '404': {
                        description: 'Error al actualizar el tratamiento',
                    },
                }
            }

        },
        '/api/tratamiento/{id}':{
            delete: {
                summary: 'Eliminar un tratamiento',
                tags: ['Tratamientos'],
                security: [
                  {
                    bearerAuth: [],
                  },
                ],
                parameters: [
                  {
                    name: 'id',
                    in: 'path',
                    description: 'ID del tratamiento a eliminar',
                    required: true,
                    schema: {
                      type: 'string',
                    },
                  },
                ],
                responses: {
                  '200': {
                    description: 'Tratamiento eliminado exitosamente',
                  },
                  '404': {
                    description: 'Error al eliminar el tratamiento',
                  },
                },
              }
        },
        '/api/tratamiento/estado/{id}':{
            post:{
                summary: 'Cambiar estado del tratamiento',
                tags: ['Tratamientos'],
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        description: 'ID del tratamiento',
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Estado del tratamiento modificado exitosamente'
                    },
                    '401': {
                        description: 'No se puede cambiar el estado del tratamiento'
                    },

                }
            }
        },
        '':{}
    }
};


// Importar la variable routerVeterinarios
import routerVeterinarios from './routers/veterinario_routes.js'

// Importar la variable routerPacientes
import routerPacientes from './routers/paciente_routes.js'


// Importar la variable routerPacientes
import routerTratamientos from './routers/tratameinto_routes.js'




// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port', process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())

// Variables globales



// Rutas 
app.use('/api', routerVeterinarios)
app.use('/api', routerPacientes)
app.use('/api', routerTratamientos)

//app.use('api_docs', swaggerUi.serve,swaggerUi.setup(swaggerJsdoc(swaggerSpec)))
app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))



// Exportar la instancia de express por medio de app
export default app
