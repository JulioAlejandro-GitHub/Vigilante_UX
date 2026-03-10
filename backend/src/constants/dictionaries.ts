/**
 * Vigilante Data Dictionary
 * Generated from backend/Vigilante_v2_configurable.sql
 * Defines ENUM values and UI Labels for shared usage in frontend and backend.
 */

// ==========================================
// EMPRESA
// ==========================================
export const EmpresaEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const EmpresaEstadoLabels: Record<(typeof EmpresaEstado)[keyof typeof EmpresaEstado], string> = {
  [EmpresaEstado.ACTIVO]: 'Activa',
  [EmpresaEstado.INACTIVO]: 'Inactiva',
};

// ==========================================
// SUCURSAL
// ==========================================
export const SucursalEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const SucursalEstadoLabels: Record<(typeof SucursalEstado)[keyof typeof SucursalEstado], string> = {
  [SucursalEstado.ACTIVO]: 'Activa',
  [SucursalEstado.INACTIVO]: 'Inactiva',
};

// ==========================================
// CAMARA
// ==========================================
export const CamaraUbicacion = {
  INGRESO: 'Ingreso',
  ESTADIA: 'Estadia',
  SALIDA: 'Salida',
  OTRO: 'Otro',
} as const;

export const CamaraUbicacionLabels: Record<(typeof CamaraUbicacion)[keyof typeof CamaraUbicacion], string> = {
  [CamaraUbicacion.INGRESO]: 'Ingreso',
  [CamaraUbicacion.ESTADIA]: 'Estadía',
  [CamaraUbicacion.SALIDA]: 'Salida',
  [CamaraUbicacion.OTRO]: 'Otro',
};

export const CamaraEstado = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
} as const;

export const CamaraEstadoLabels: Record<(typeof CamaraEstado)[keyof typeof CamaraEstado], string> = {
  [CamaraEstado.ACTIVO]: 'Activa',
  [CamaraEstado.INACTIVO]: 'Inactiva',
};

export const CamaraProtocolo = {
  ONVIF: 'onvif',
  WEBCAM: 'webcam',
  RTSP: 'rtsp',
  ARCHIVO: 'archivo',
  DVR: 'dvr',
} as const;

export const CamaraProtocoloLabels: Record<(typeof CamaraProtocolo)[keyof typeof CamaraProtocolo], string> = {
  [CamaraProtocolo.ONVIF]: 'ONVIF',
  [CamaraProtocolo.WEBCAM]: 'Webcam',
  [CamaraProtocolo.RTSP]: 'RTSP',
  [CamaraProtocolo.ARCHIVO]: 'Archivo',
  [CamaraProtocolo.DVR]: 'DVR',
};

// ==========================================
// OPERADOR
// ==========================================
export const OperadorRol = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  OPERADOR: 'operador',
  VIEWER: 'viewer',
} as const;

export const OperadorRolLabels: Record<(typeof OperadorRol)[keyof typeof OperadorRol], string> = {
  [OperadorRol.ADMIN]: 'Administrador',
  [OperadorRol.SUPERVISOR]: 'Supervisor',
  [OperadorRol.OPERADOR]: 'Operador',
  [OperadorRol.VIEWER]: 'Visualizador',
};

export const OperadorEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const OperadorEstadoLabels: Record<(typeof OperadorEstado)[keyof typeof OperadorEstado], string> = {
  [OperadorEstado.ACTIVO]: 'Activo',
  [OperadorEstado.INACTIVO]: 'Inactivo',
};

export const OperadorGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export const OperadorGenderLabels: Record<(typeof OperadorGender)[keyof typeof OperadorGender], string> = {
  [OperadorGender.MALE]: 'Masculino',
  [OperadorGender.FEMALE]: 'Femenino',
  [OperadorGender.OTHER]: 'Otro',
};

// ==========================================
// PERSONA
// ==========================================
export const PersonaTipo = {
  SOCIO: 'socio',
  EMPLEADO: 'empleado',
  FAMILIA: 'familia',
  LADRON: 'ladron',
  OTRO: 'otro',
} as const;

export const PersonaTipoLabels: Record<(typeof PersonaTipo)[keyof typeof PersonaTipo], string> = {
  [PersonaTipo.SOCIO]: 'Socio',
  [PersonaTipo.EMPLEADO]: 'Empleado',
  [PersonaTipo.FAMILIA]: 'Familia',
  [PersonaTipo.LADRON]: 'Ladrón',
  [PersonaTipo.OTRO]: 'Otro',
};

export const PersonaEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const PersonaEstadoLabels: Record<(typeof PersonaEstado)[keyof typeof PersonaEstado], string> = {
  [PersonaEstado.ACTIVO]: 'Activa',
  [PersonaEstado.INACTIVO]: 'Inactiva',
};

export const PersonaGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  UNKNOWN: 'unknown',
} as const;

export const PersonaGenderLabels: Record<(typeof PersonaGender)[keyof typeof PersonaGender], string> = {
  [PersonaGender.MALE]: 'Masculino',
  [PersonaGender.FEMALE]: 'Femenino',
  [PersonaGender.OTHER]: 'Otro',
  [PersonaGender.UNKNOWN]: 'Desconocido',
};

// ==========================================
// PERSONA_EMBEDDING
// ==========================================
export const PersonaEmbeddingEngine = {
  HUMAN: 'human',
  INSIGHTFACE: 'insightface',
  DEEPFACE: 'deepface',
  FACENET: 'facenet',
  ARCFACE: 'arcface',
  OTRO: 'otro',
} as const;

export const PersonaEmbeddingEngineLabels: Record<(typeof PersonaEmbeddingEngine)[keyof typeof PersonaEmbeddingEngine], string> = {
  [PersonaEmbeddingEngine.HUMAN]: 'Humano',
  [PersonaEmbeddingEngine.INSIGHTFACE]: 'InsightFace',
  [PersonaEmbeddingEngine.DEEPFACE]: 'DeepFace',
  [PersonaEmbeddingEngine.FACENET]: 'FaceNet',
  [PersonaEmbeddingEngine.ARCFACE]: 'ArcFace',
  [PersonaEmbeddingEngine.OTRO]: 'Otro',
};

export const PersonaEmbeddingPerfil = {
  FRONT: 'front',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  UNDETECTED: 'undetected',
} as const;

export const PersonaEmbeddingPerfilLabels: Record<(typeof PersonaEmbeddingPerfil)[keyof typeof PersonaEmbeddingPerfil], string> = {
  [PersonaEmbeddingPerfil.FRONT]: 'Frente',
  [PersonaEmbeddingPerfil.LEFT]: 'Izquierda',
  [PersonaEmbeddingPerfil.RIGHT]: 'Derecha',
  [PersonaEmbeddingPerfil.TOP]: 'Arriba',
  [PersonaEmbeddingPerfil.UNDETECTED]: 'No detectado',
};

export const PersonaEmbeddingEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const PersonaEmbeddingEstadoLabels: Record<(typeof PersonaEmbeddingEstado)[keyof typeof PersonaEmbeddingEstado], string> = {
  [PersonaEmbeddingEstado.ACTIVO]: 'Activo',
  [PersonaEmbeddingEstado.INACTIVO]: 'Inactivo',
};

// ==========================================
// SOLICITUD_RECOGNITION
// ==========================================
export const SolicitudRecognitionSourceType = {
  CAMERA: 'camera',
  VIDEO_FILE: 'video_file',
  DVR: 'dvr',
  UPLOAD: 'upload',
  API: 'api',
} as const;

export const SolicitudRecognitionSourceTypeLabels: Record<(typeof SolicitudRecognitionSourceType)[keyof typeof SolicitudRecognitionSourceType], string> = {
  [SolicitudRecognitionSourceType.CAMERA]: 'Cámara',
  [SolicitudRecognitionSourceType.VIDEO_FILE]: 'Archivo de Video',
  [SolicitudRecognitionSourceType.DVR]: 'DVR',
  [SolicitudRecognitionSourceType.UPLOAD]: 'Subida',
  [SolicitudRecognitionSourceType.API]: 'API',
};

export const SolicitudRecognitionStatus = {
  PENDIENTE: 'pendiente',
  PROCESANDO: 'procesando',
  PROCESADA: 'procesada',
  ERROR: 'error',
} as const;

export const SolicitudRecognitionStatusLabels: Record<(typeof SolicitudRecognitionStatus)[keyof typeof SolicitudRecognitionStatus], string> = {
  [SolicitudRecognitionStatus.PENDIENTE]: 'Pendiente',
  [SolicitudRecognitionStatus.PROCESANDO]: 'Procesando',
  [SolicitudRecognitionStatus.PROCESADA]: 'Procesada',
  [SolicitudRecognitionStatus.ERROR]: 'Error',
};

// ==========================================
// RECOGNITION_EVENT
// ==========================================
export const RecognitionEventSourceType = {
  CAMERA: 'camera',
  VIDEO_FILE: 'video_file',
  DVR: 'dvr',
  UPLOAD: 'upload',
  API: 'api',
} as const;

export const RecognitionEventSourceTypeLabels: Record<(typeof RecognitionEventSourceType)[keyof typeof RecognitionEventSourceType], string> = {
  [RecognitionEventSourceType.CAMERA]: 'Cámara',
  [RecognitionEventSourceType.VIDEO_FILE]: 'Archivo de Video',
  [RecognitionEventSourceType.DVR]: 'DVR',
  [RecognitionEventSourceType.UPLOAD]: 'Subida',
  [RecognitionEventSourceType.API]: 'API',
};

export const RecognitionEventProcessingStatus = {
  OK: 'ok',
  SIN_ROSTRO: 'sin_rostro',
  ERROR: 'error',
} as const;

export const RecognitionEventProcessingStatusLabels: Record<(typeof RecognitionEventProcessingStatus)[keyof typeof RecognitionEventProcessingStatus], string> = {
  [RecognitionEventProcessingStatus.OK]: 'OK',
  [RecognitionEventProcessingStatus.SIN_ROSTRO]: 'Sin rostro',
  [RecognitionEventProcessingStatus.ERROR]: 'Error',
};

// ==========================================
// RECOGNITION_FACE
// ==========================================
export const RecognitionFacePerfil = {
  FRONT: 'front',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  UNDETECTED: 'undetected',
} as const;

export const RecognitionFacePerfilLabels: Record<(typeof RecognitionFacePerfil)[keyof typeof RecognitionFacePerfil], string> = {
  [RecognitionFacePerfil.FRONT]: 'Frente',
  [RecognitionFacePerfil.LEFT]: 'Izquierda',
  [RecognitionFacePerfil.RIGHT]: 'Derecha',
  [RecognitionFacePerfil.TOP]: 'Arriba',
  [RecognitionFacePerfil.UNDETECTED]: 'No detectado',
};

export const RecognitionFaceFinalLabel = {
  DESCONOCIDO: 'desconocido',
  IDENTIFICADO: 'identificado',
  LADRON: 'ladron',
  RECHAZADO: 'rechazado',
  REVISAR: 'revisar',
} as const;

export const RecognitionFaceFinalLabelLabels: Record<(typeof RecognitionFaceFinalLabel)[keyof typeof RecognitionFaceFinalLabel], string> = {
  [RecognitionFaceFinalLabel.DESCONOCIDO]: 'Desconocido',
  [RecognitionFaceFinalLabel.IDENTIFICADO]: 'Identificado',
  [RecognitionFaceFinalLabel.LADRON]: 'Ladrón',
  [RecognitionFaceFinalLabel.RECHAZADO]: 'Rechazado',
  [RecognitionFaceFinalLabel.REVISAR]: 'Revisar',
};

export const RecognitionFaceEstadoValidacion = {
  VALIDO: 'valido',
  POR_VALIDAR: 'por_validar',
  INVALIDO: 'invalido',
} as const;

export const RecognitionFaceEstadoValidacionLabels: Record<(typeof RecognitionFaceEstadoValidacion)[keyof typeof RecognitionFaceEstadoValidacion], string> = {
  [RecognitionFaceEstadoValidacion.VALIDO]: 'Válido',
  [RecognitionFaceEstadoValidacion.POR_VALIDAR]: 'Por Validar',
  [RecognitionFaceEstadoValidacion.INVALIDO]: 'Inválido',
};

export const RecognitionFaceAssignedStatus = {
  SIN_ASIGNAR: 'sin_asignar',
  AUTO_ASIGNADO: 'auto_asignado',
  MANUAL_ASIGNADO: 'manual_asignado',
  ENROLADO_DESDE_EVENTO: 'enrolado_desde_evento',
} as const;

export const RecognitionFaceAssignedStatusLabels: Record<(typeof RecognitionFaceAssignedStatus)[keyof typeof RecognitionFaceAssignedStatus], string> = {
  [RecognitionFaceAssignedStatus.SIN_ASIGNAR]: 'Sin Asignar',
  [RecognitionFaceAssignedStatus.AUTO_ASIGNADO]: 'Auto Asignado',
  [RecognitionFaceAssignedStatus.MANUAL_ASIGNADO]: 'Manual Asignado',
  [RecognitionFaceAssignedStatus.ENROLADO_DESDE_EVENTO]: 'Enrolado desde Evento',
};

export const RecognitionFaceBestEngine = {
  HUMAN: 'human',
  INSIGHTFACE: 'insightface',
  DEEPFACE: 'deepface',
  FACENET: 'facenet',
  ARCFACE: 'arcface',
  OTRO: 'otro',
} as const;

export const RecognitionFaceBestEngineLabels: Record<(typeof RecognitionFaceBestEngine)[keyof typeof RecognitionFaceBestEngine], string> = {
  [RecognitionFaceBestEngine.HUMAN]: 'Humano',
  [RecognitionFaceBestEngine.INSIGHTFACE]: 'InsightFace',
  [RecognitionFaceBestEngine.DEEPFACE]: 'DeepFace',
  [RecognitionFaceBestEngine.FACENET]: 'FaceNet',
  [RecognitionFaceBestEngine.ARCFACE]: 'ArcFace',
  [RecognitionFaceBestEngine.OTRO]: 'Otro',
};

// ==========================================
// RECOGNITION_ENGINE_RESULT
// ==========================================
export const RecognitionEngineResultEngine = {
  HUMAN: 'human',
  INSIGHTFACE: 'insightface',
  DEEPFACE: 'deepface',
  FACENET: 'facenet',
  ARCFACE: 'arcface',
  OTRO: 'otro',
} as const;

export const RecognitionEngineResultEngineLabels: Record<(typeof RecognitionEngineResultEngine)[keyof typeof RecognitionEngineResultEngine], string> = {
  [RecognitionEngineResultEngine.HUMAN]: 'Humano',
  [RecognitionEngineResultEngine.INSIGHTFACE]: 'InsightFace',
  [RecognitionEngineResultEngine.DEEPFACE]: 'DeepFace',
  [RecognitionEngineResultEngine.FACENET]: 'FaceNet',
  [RecognitionEngineResultEngine.ARCFACE]: 'ArcFace',
  [RecognitionEngineResultEngine.OTRO]: 'Otro',
};

// ==========================================
// CONFIG_GROUP
// ==========================================
export const ConfigGroupEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const ConfigGroupEstadoLabels: Record<(typeof ConfigGroupEstado)[keyof typeof ConfigGroupEstado], string> = {
  [ConfigGroupEstado.ACTIVO]: 'Activo',
  [ConfigGroupEstado.INACTIVO]: 'Inactivo',
};

// ==========================================
// CONFIG_DEFINITION
// ==========================================
export const ConfigDefinitionDataType = {
  STRING: 'string',
  TEXT: 'text',
  INT: 'int',
  DECIMAL: 'decimal',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ENUM: 'enum',
  TIME: 'time',
  DATETIME: 'datetime',
} as const;

export const ConfigDefinitionDataTypeLabels: Record<(typeof ConfigDefinitionDataType)[keyof typeof ConfigDefinitionDataType], string> = {
  [ConfigDefinitionDataType.STRING]: 'Texto corto (String)',
  [ConfigDefinitionDataType.TEXT]: 'Texto largo (Text)',
  [ConfigDefinitionDataType.INT]: 'Entero (Int)',
  [ConfigDefinitionDataType.DECIMAL]: 'Decimal',
  [ConfigDefinitionDataType.BOOLEAN]: 'Booleano',
  [ConfigDefinitionDataType.JSON]: 'JSON',
  [ConfigDefinitionDataType.ENUM]: 'Lista (Enum)',
  [ConfigDefinitionDataType.TIME]: 'Hora (Time)',
  [ConfigDefinitionDataType.DATETIME]: 'Fecha y Hora (DateTime)',
};

export const ConfigDefinitionEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const ConfigDefinitionEstadoLabels: Record<(typeof ConfigDefinitionEstado)[keyof typeof ConfigDefinitionEstado], string> = {
  [ConfigDefinitionEstado.ACTIVO]: 'Activo',
  [ConfigDefinitionEstado.INACTIVO]: 'Inactivo',
};

// ==========================================
// ALERT_CHANNEL
// ==========================================
export const AlertChannelEstado = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export const AlertChannelEstadoLabels: Record<(typeof AlertChannelEstado)[keyof typeof AlertChannelEstado], string> = {
  [AlertChannelEstado.ACTIVO]: 'Activo',
  [AlertChannelEstado.INACTIVO]: 'Inactivo',
};

// ==========================================
// ALERT_RULE
// ==========================================
export const AlertRuleEventoTipo = {
  LADRON: 'ladron',
  DESCONOCIDO: 'desconocido',
  IDENTIFICADO: 'identificado',
  RECHAZADO: 'rechazado',
  REVISAR: 'revisar',
  CUALQUIER_RECONOCIMIENTO: 'cualquier_reconocimiento',
} as const;

export const AlertRuleEventoTipoLabels: Record<(typeof AlertRuleEventoTipo)[keyof typeof AlertRuleEventoTipo], string> = {
  [AlertRuleEventoTipo.LADRON]: 'Ladrón',
  [AlertRuleEventoTipo.DESCONOCIDO]: 'Desconocido',
  [AlertRuleEventoTipo.IDENTIFICADO]: 'Identificado',
  [AlertRuleEventoTipo.RECHAZADO]: 'Rechazado',
  [AlertRuleEventoTipo.REVISAR]: 'Revisar',
  [AlertRuleEventoTipo.CUALQUIER_RECONOCIMIENTO]: 'Cualquier Reconocimiento',
};

// ==========================================
// ALERTA_ENVIADA
// ==========================================
export const AlertaEnviadaCanal = {
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  EMAIL: 'email',
  WEBHOOK: 'webhook',
  SMS: 'sms',
  OTRO: 'otro',
} as const;

export const AlertaEnviadaCanalLabels: Record<(typeof AlertaEnviadaCanal)[keyof typeof AlertaEnviadaCanal], string> = {
  [AlertaEnviadaCanal.WHATSAPP]: 'WhatsApp',
  [AlertaEnviadaCanal.TELEGRAM]: 'Telegram',
  [AlertaEnviadaCanal.EMAIL]: 'Email',
  [AlertaEnviadaCanal.WEBHOOK]: 'Webhook',
  [AlertaEnviadaCanal.SMS]: 'SMS',
  [AlertaEnviadaCanal.OTRO]: 'Otro',
};

export const AlertaEnviadaEstadoEnvio = {
  PENDIENTE: 'pendiente',
  ENVIADO: 'enviado',
  ERROR: 'error',
} as const;

export const AlertaEnviadaEstadoEnvioLabels: Record<(typeof AlertaEnviadaEstadoEnvio)[keyof typeof AlertaEnviadaEstadoEnvio], string> = {
  [AlertaEnviadaEstadoEnvio.PENDIENTE]: 'Pendiente',
  [AlertaEnviadaEstadoEnvio.ENVIADO]: 'Enviado',
  [AlertaEnviadaEstadoEnvio.ERROR]: 'Error',
};
