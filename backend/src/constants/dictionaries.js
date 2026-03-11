"use strict";
/**
 * Vigilante Data Dictionary
 * Generated from backend/Vigilante_v2_configurable.sql
 * Defines ENUM values and UI Labels for shared usage in frontend and backend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigGroupEstadoLabels = exports.ConfigGroupEstado = exports.RecognitionEngineResultEngineLabels = exports.RecognitionEngineResultEngine = exports.RecognitionFaceBestEngineLabels = exports.RecognitionFaceBestEngine = exports.RecognitionFaceAssignedStatusLabels = exports.RecognitionFaceAssignedStatus = exports.RecognitionFaceEstadoValidacionLabels = exports.RecognitionFaceEstadoValidacion = exports.RecognitionFaceFinalLabelLabels = exports.RecognitionFaceFinalLabel = exports.RecognitionFacePerfilLabels = exports.RecognitionFacePerfil = exports.RecognitionEventProcessingStatusLabels = exports.RecognitionEventProcessingStatus = exports.RecognitionEventSourceTypeLabels = exports.RecognitionEventSourceType = exports.SolicitudRecognitionStatusLabels = exports.SolicitudRecognitionStatus = exports.SolicitudRecognitionSourceTypeLabels = exports.SolicitudRecognitionSourceType = exports.PersonaEmbeddingEstadoLabels = exports.PersonaEmbeddingEstado = exports.PersonaEmbeddingPerfilLabels = exports.PersonaEmbeddingPerfil = exports.PersonaEmbeddingEngineLabels = exports.PersonaEmbeddingEngine = exports.PersonaGenderLabels = exports.PersonaGender = exports.PersonaEstadoLabels = exports.PersonaEstado = exports.PersonaTipoLabels = exports.PersonaTipo = exports.OperadorGenderLabels = exports.OperadorGender = exports.OperadorEstadoLabels = exports.OperadorEstado = exports.OperadorRolLabels = exports.OperadorRol = exports.CamaraProtocoloLabels = exports.CamaraProtocolo = exports.CamaraEstadoLabels = exports.CamaraEstado = exports.CamaraUbicacionLabels = exports.CamaraUbicacion = exports.SucursalEstadoLabels = exports.SucursalEstado = exports.EmpresaEstadoLabels = exports.EmpresaEstado = void 0;
exports.AlertaEnviadaEstadoEnvioLabels = exports.AlertaEnviadaEstadoEnvio = exports.AlertaEnviadaCanalLabels = exports.AlertaEnviadaCanal = exports.AlertRuleEventoTipoLabels = exports.AlertRuleEventoTipo = exports.AlertChannelEstadoLabels = exports.AlertChannelEstado = exports.ConfigDefinitionEstadoLabels = exports.ConfigDefinitionEstado = exports.ConfigDefinitionDataTypeLabels = exports.ConfigDefinitionDataType = void 0;
// ==========================================
// EMPRESA
// ==========================================
exports.EmpresaEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.EmpresaEstadoLabels = {
    [exports.EmpresaEstado.ACTIVO]: 'Activa',
    [exports.EmpresaEstado.INACTIVO]: 'Inactiva',
};
// ==========================================
// SUCURSAL
// ==========================================
exports.SucursalEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.SucursalEstadoLabels = {
    [exports.SucursalEstado.ACTIVO]: 'Activa',
    [exports.SucursalEstado.INACTIVO]: 'Inactiva',
};
// ==========================================
// CAMARA
// ==========================================
exports.CamaraUbicacion = {
    INGRESO: 'Ingreso',
    ESTADIA: 'Estadia',
    SALIDA: 'Salida',
    OTRO: 'Otro',
};
exports.CamaraUbicacionLabels = {
    [exports.CamaraUbicacion.INGRESO]: 'Ingreso',
    [exports.CamaraUbicacion.ESTADIA]: 'Estadía',
    [exports.CamaraUbicacion.SALIDA]: 'Salida',
    [exports.CamaraUbicacion.OTRO]: 'Otro',
};
exports.CamaraEstado = {
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',
};
exports.CamaraEstadoLabels = {
    [exports.CamaraEstado.ACTIVO]: 'Activa',
    [exports.CamaraEstado.INACTIVO]: 'Inactiva',
};
exports.CamaraProtocolo = {
    ONVIF: 'onvif',
    WEBCAM: 'webcam',
    RTSP: 'rtsp',
    ARCHIVO: 'archivo',
    DVR: 'dvr',
};
exports.CamaraProtocoloLabels = {
    [exports.CamaraProtocolo.ONVIF]: 'ONVIF',
    [exports.CamaraProtocolo.WEBCAM]: 'Webcam',
    [exports.CamaraProtocolo.RTSP]: 'RTSP',
    [exports.CamaraProtocolo.ARCHIVO]: 'Archivo',
    [exports.CamaraProtocolo.DVR]: 'DVR',
};
// ==========================================
// OPERADOR
// ==========================================
exports.OperadorRol = {
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    OPERADOR: 'operador',
    VIEWER: 'viewer',
};
exports.OperadorRolLabels = {
    [exports.OperadorRol.ADMIN]: 'Administrador',
    [exports.OperadorRol.SUPERVISOR]: 'Supervisor',
    [exports.OperadorRol.OPERADOR]: 'Operador',
    [exports.OperadorRol.VIEWER]: 'Visualizador',
};
exports.OperadorEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.OperadorEstadoLabels = {
    [exports.OperadorEstado.ACTIVO]: 'Activo',
    [exports.OperadorEstado.INACTIVO]: 'Inactivo',
};
exports.OperadorGender = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
};
exports.OperadorGenderLabels = {
    [exports.OperadorGender.MALE]: 'Masculino',
    [exports.OperadorGender.FEMALE]: 'Femenino',
    [exports.OperadorGender.OTHER]: 'Otro',
};
// ==========================================
// PERSONA
// ==========================================
exports.PersonaTipo = {
    SOCIO: 'socio',
    EMPLEADO: 'empleado',
    FAMILIA: 'familia',
    LADRON: 'ladron',
    OTRO: 'otro',
};
exports.PersonaTipoLabels = {
    [exports.PersonaTipo.SOCIO]: 'Socio',
    [exports.PersonaTipo.EMPLEADO]: 'Empleado',
    [exports.PersonaTipo.FAMILIA]: 'Familia',
    [exports.PersonaTipo.LADRON]: 'Ladrón',
    [exports.PersonaTipo.OTRO]: 'Otro',
};
exports.PersonaEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.PersonaEstadoLabels = {
    [exports.PersonaEstado.ACTIVO]: 'Activa',
    [exports.PersonaEstado.INACTIVO]: 'Inactiva',
};
exports.PersonaGender = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    UNKNOWN: 'unknown',
};
exports.PersonaGenderLabels = {
    [exports.PersonaGender.MALE]: 'Masculino',
    [exports.PersonaGender.FEMALE]: 'Femenino',
    [exports.PersonaGender.OTHER]: 'Otro',
    [exports.PersonaGender.UNKNOWN]: 'Desconocido',
};
// ==========================================
// PERSONA_EMBEDDING
// ==========================================
exports.PersonaEmbeddingEngine = {
    HUMAN: 'human',
    INSIGHTFACE: 'insightface',
    DEEPFACE: 'deepface',
    FACENET: 'facenet',
    ARCFACE: 'arcface',
    OTRO: 'otro',
};
exports.PersonaEmbeddingEngineLabels = {
    [exports.PersonaEmbeddingEngine.HUMAN]: 'Humano',
    [exports.PersonaEmbeddingEngine.INSIGHTFACE]: 'InsightFace',
    [exports.PersonaEmbeddingEngine.DEEPFACE]: 'DeepFace',
    [exports.PersonaEmbeddingEngine.FACENET]: 'FaceNet',
    [exports.PersonaEmbeddingEngine.ARCFACE]: 'ArcFace',
    [exports.PersonaEmbeddingEngine.OTRO]: 'Otro',
};
exports.PersonaEmbeddingPerfil = {
    FRONT: 'front',
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    UNDETECTED: 'undetected',
};
exports.PersonaEmbeddingPerfilLabels = {
    [exports.PersonaEmbeddingPerfil.FRONT]: 'Frente',
    [exports.PersonaEmbeddingPerfil.LEFT]: 'Izquierda',
    [exports.PersonaEmbeddingPerfil.RIGHT]: 'Derecha',
    [exports.PersonaEmbeddingPerfil.TOP]: 'Arriba',
    [exports.PersonaEmbeddingPerfil.UNDETECTED]: 'No detectado',
};
exports.PersonaEmbeddingEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.PersonaEmbeddingEstadoLabels = {
    [exports.PersonaEmbeddingEstado.ACTIVO]: 'Activo',
    [exports.PersonaEmbeddingEstado.INACTIVO]: 'Inactivo',
};
// ==========================================
// SOLICITUD_RECOGNITION
// ==========================================
exports.SolicitudRecognitionSourceType = {
    CAMERA: 'camera',
    VIDEO_FILE: 'video_file',
    DVR: 'dvr',
    UPLOAD: 'upload',
    API: 'api',
};
exports.SolicitudRecognitionSourceTypeLabels = {
    [exports.SolicitudRecognitionSourceType.CAMERA]: 'Cámara',
    [exports.SolicitudRecognitionSourceType.VIDEO_FILE]: 'Archivo de Video',
    [exports.SolicitudRecognitionSourceType.DVR]: 'DVR',
    [exports.SolicitudRecognitionSourceType.UPLOAD]: 'Subida',
    [exports.SolicitudRecognitionSourceType.API]: 'API',
};
exports.SolicitudRecognitionStatus = {
    PENDIENTE: 'pendiente',
    PROCESANDO: 'procesando',
    PROCESADA: 'procesada',
    ERROR: 'error',
};
exports.SolicitudRecognitionStatusLabels = {
    [exports.SolicitudRecognitionStatus.PENDIENTE]: 'Pendiente',
    [exports.SolicitudRecognitionStatus.PROCESANDO]: 'Procesando',
    [exports.SolicitudRecognitionStatus.PROCESADA]: 'Procesada',
    [exports.SolicitudRecognitionStatus.ERROR]: 'Error',
};
// ==========================================
// RECOGNITION_EVENT
// ==========================================
exports.RecognitionEventSourceType = {
    CAMERA: 'camera',
    VIDEO_FILE: 'video_file',
    DVR: 'dvr',
    UPLOAD: 'upload',
    API: 'api',
};
exports.RecognitionEventSourceTypeLabels = {
    [exports.RecognitionEventSourceType.CAMERA]: 'Cámara',
    [exports.RecognitionEventSourceType.VIDEO_FILE]: 'Archivo de Video',
    [exports.RecognitionEventSourceType.DVR]: 'DVR',
    [exports.RecognitionEventSourceType.UPLOAD]: 'Subida',
    [exports.RecognitionEventSourceType.API]: 'API',
};
exports.RecognitionEventProcessingStatus = {
    OK: 'ok',
    SIN_ROSTRO: 'sin_rostro',
    ERROR: 'error',
};
exports.RecognitionEventProcessingStatusLabels = {
    [exports.RecognitionEventProcessingStatus.OK]: 'OK',
    [exports.RecognitionEventProcessingStatus.SIN_ROSTRO]: 'Sin rostro',
    [exports.RecognitionEventProcessingStatus.ERROR]: 'Error',
};
// ==========================================
// RECOGNITION_FACE
// ==========================================
exports.RecognitionFacePerfil = {
    FRONT: 'front',
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    UNDETECTED: 'undetected',
};
exports.RecognitionFacePerfilLabels = {
    [exports.RecognitionFacePerfil.FRONT]: 'Frente',
    [exports.RecognitionFacePerfil.LEFT]: 'Izquierda',
    [exports.RecognitionFacePerfil.RIGHT]: 'Derecha',
    [exports.RecognitionFacePerfil.TOP]: 'Arriba',
    [exports.RecognitionFacePerfil.UNDETECTED]: 'No detectado',
};
exports.RecognitionFaceFinalLabel = {
    DESCONOCIDO: 'desconocido',
    IDENTIFICADO: 'identificado',
    LADRON: 'ladron',
    RECHAZADO: 'rechazado',
    REVISAR: 'revisar',
};
exports.RecognitionFaceFinalLabelLabels = {
    [exports.RecognitionFaceFinalLabel.DESCONOCIDO]: 'Desconocido',
    [exports.RecognitionFaceFinalLabel.IDENTIFICADO]: 'Identificado',
    [exports.RecognitionFaceFinalLabel.LADRON]: 'Ladrón',
    [exports.RecognitionFaceFinalLabel.RECHAZADO]: 'Rechazado',
    [exports.RecognitionFaceFinalLabel.REVISAR]: 'Revisar',
};
exports.RecognitionFaceEstadoValidacion = {
    VALIDO: 'valido',
    POR_VALIDAR: 'por_validar',
    INVALIDO: 'invalido',
};
exports.RecognitionFaceEstadoValidacionLabels = {
    [exports.RecognitionFaceEstadoValidacion.VALIDO]: 'Válido',
    [exports.RecognitionFaceEstadoValidacion.POR_VALIDAR]: 'Por Validar',
    [exports.RecognitionFaceEstadoValidacion.INVALIDO]: 'Inválido',
};
exports.RecognitionFaceAssignedStatus = {
    SIN_ASIGNAR: 'sin_asignar',
    AUTO_ASIGNADO: 'auto_asignado',
    MANUAL_ASIGNADO: 'manual_asignado',
    ENROLADO_DESDE_EVENTO: 'enrolado_desde_evento',
};
exports.RecognitionFaceAssignedStatusLabels = {
    [exports.RecognitionFaceAssignedStatus.SIN_ASIGNAR]: 'Sin Asignar',
    [exports.RecognitionFaceAssignedStatus.AUTO_ASIGNADO]: 'Auto Asignado',
    [exports.RecognitionFaceAssignedStatus.MANUAL_ASIGNADO]: 'Manual Asignado',
    [exports.RecognitionFaceAssignedStatus.ENROLADO_DESDE_EVENTO]: 'Enrolado desde Evento',
};
exports.RecognitionFaceBestEngine = {
    HUMAN: 'human',
    INSIGHTFACE: 'insightface',
    DEEPFACE: 'deepface',
    FACENET: 'facenet',
    ARCFACE: 'arcface',
    OTRO: 'otro',
};
exports.RecognitionFaceBestEngineLabels = {
    [exports.RecognitionFaceBestEngine.HUMAN]: 'Humano',
    [exports.RecognitionFaceBestEngine.INSIGHTFACE]: 'InsightFace',
    [exports.RecognitionFaceBestEngine.DEEPFACE]: 'DeepFace',
    [exports.RecognitionFaceBestEngine.FACENET]: 'FaceNet',
    [exports.RecognitionFaceBestEngine.ARCFACE]: 'ArcFace',
    [exports.RecognitionFaceBestEngine.OTRO]: 'Otro',
};
// ==========================================
// RECOGNITION_ENGINE_RESULT
// ==========================================
exports.RecognitionEngineResultEngine = {
    HUMAN: 'human',
    INSIGHTFACE: 'insightface',
    DEEPFACE: 'deepface',
    FACENET: 'facenet',
    ARCFACE: 'arcface',
    OTRO: 'otro',
};
exports.RecognitionEngineResultEngineLabels = {
    [exports.RecognitionEngineResultEngine.HUMAN]: 'Humano',
    [exports.RecognitionEngineResultEngine.INSIGHTFACE]: 'InsightFace',
    [exports.RecognitionEngineResultEngine.DEEPFACE]: 'DeepFace',
    [exports.RecognitionEngineResultEngine.FACENET]: 'FaceNet',
    [exports.RecognitionEngineResultEngine.ARCFACE]: 'ArcFace',
    [exports.RecognitionEngineResultEngine.OTRO]: 'Otro',
};
// ==========================================
// CONFIG_GROUP
// ==========================================
exports.ConfigGroupEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.ConfigGroupEstadoLabels = {
    [exports.ConfigGroupEstado.ACTIVO]: 'Activo',
    [exports.ConfigGroupEstado.INACTIVO]: 'Inactivo',
};
// ==========================================
// CONFIG_DEFINITION
// ==========================================
exports.ConfigDefinitionDataType = {
    STRING: 'string',
    TEXT: 'text',
    INT: 'int',
    DECIMAL: 'decimal',
    BOOLEAN: 'boolean',
    JSON: 'json',
    ENUM: 'enum',
    TIME: 'time',
    DATETIME: 'datetime',
};
exports.ConfigDefinitionDataTypeLabels = {
    [exports.ConfigDefinitionDataType.STRING]: 'Texto corto (String)',
    [exports.ConfigDefinitionDataType.TEXT]: 'Texto largo (Text)',
    [exports.ConfigDefinitionDataType.INT]: 'Entero (Int)',
    [exports.ConfigDefinitionDataType.DECIMAL]: 'Decimal',
    [exports.ConfigDefinitionDataType.BOOLEAN]: 'Booleano',
    [exports.ConfigDefinitionDataType.JSON]: 'JSON',
    [exports.ConfigDefinitionDataType.ENUM]: 'Lista (Enum)',
    [exports.ConfigDefinitionDataType.TIME]: 'Hora (Time)',
    [exports.ConfigDefinitionDataType.DATETIME]: 'Fecha y Hora (DateTime)',
};
exports.ConfigDefinitionEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.ConfigDefinitionEstadoLabels = {
    [exports.ConfigDefinitionEstado.ACTIVO]: 'Activo',
    [exports.ConfigDefinitionEstado.INACTIVO]: 'Inactivo',
};
// ==========================================
// ALERT_CHANNEL
// ==========================================
exports.AlertChannelEstado = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
};
exports.AlertChannelEstadoLabels = {
    [exports.AlertChannelEstado.ACTIVO]: 'Activo',
    [exports.AlertChannelEstado.INACTIVO]: 'Inactivo',
};
// ==========================================
// ALERT_RULE
// ==========================================
exports.AlertRuleEventoTipo = {
    LADRON: 'ladron',
    DESCONOCIDO: 'desconocido',
    IDENTIFICADO: 'identificado',
    RECHAZADO: 'rechazado',
    REVISAR: 'revisar',
    CUALQUIER_RECONOCIMIENTO: 'cualquier_reconocimiento',
};
exports.AlertRuleEventoTipoLabels = {
    [exports.AlertRuleEventoTipo.LADRON]: 'Ladrón',
    [exports.AlertRuleEventoTipo.DESCONOCIDO]: 'Desconocido',
    [exports.AlertRuleEventoTipo.IDENTIFICADO]: 'Identificado',
    [exports.AlertRuleEventoTipo.RECHAZADO]: 'Rechazado',
    [exports.AlertRuleEventoTipo.REVISAR]: 'Revisar',
    [exports.AlertRuleEventoTipo.CUALQUIER_RECONOCIMIENTO]: 'Cualquier Reconocimiento',
};
// ==========================================
// ALERTA_ENVIADA
// ==========================================
exports.AlertaEnviadaCanal = {
    WHATSAPP: 'whatsapp',
    TELEGRAM: 'telegram',
    EMAIL: 'email',
    WEBHOOK: 'webhook',
    SMS: 'sms',
    OTRO: 'otro',
};
exports.AlertaEnviadaCanalLabels = {
    [exports.AlertaEnviadaCanal.WHATSAPP]: 'WhatsApp',
    [exports.AlertaEnviadaCanal.TELEGRAM]: 'Telegram',
    [exports.AlertaEnviadaCanal.EMAIL]: 'Email',
    [exports.AlertaEnviadaCanal.WEBHOOK]: 'Webhook',
    [exports.AlertaEnviadaCanal.SMS]: 'SMS',
    [exports.AlertaEnviadaCanal.OTRO]: 'Otro',
};
exports.AlertaEnviadaEstadoEnvio = {
    PENDIENTE: 'pendiente',
    ENVIADO: 'enviado',
    ERROR: 'error',
};
exports.AlertaEnviadaEstadoEnvioLabels = {
    [exports.AlertaEnviadaEstadoEnvio.PENDIENTE]: 'Pendiente',
    [exports.AlertaEnviadaEstadoEnvio.ENVIADO]: 'Enviado',
    [exports.AlertaEnviadaEstadoEnvio.ERROR]: 'Error',
};
//# sourceMappingURL=dictionaries.js.map