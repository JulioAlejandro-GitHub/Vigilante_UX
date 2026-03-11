/**
 * Vigilante Data Dictionary
 * Generated from backend/Vigilante_v2_configurable.sql
 * Defines ENUM values and UI Labels for shared usage in frontend and backend.
 */
export declare const EmpresaEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const EmpresaEstadoLabels: Record<(typeof EmpresaEstado)[keyof typeof EmpresaEstado], string>;
export declare const SucursalEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const SucursalEstadoLabels: Record<(typeof SucursalEstado)[keyof typeof SucursalEstado], string>;
export declare const CamaraUbicacion: {
    readonly INGRESO: "Ingreso";
    readonly ESTADIA: "Estadia";
    readonly SALIDA: "Salida";
    readonly OTRO: "Otro";
};
export declare const CamaraUbicacionLabels: Record<(typeof CamaraUbicacion)[keyof typeof CamaraUbicacion], string>;
export declare const CamaraEstado: {
    readonly ACTIVO: "Activo";
    readonly INACTIVO: "Inactivo";
};
export declare const CamaraEstadoLabels: Record<(typeof CamaraEstado)[keyof typeof CamaraEstado], string>;
export declare const CamaraProtocolo: {
    readonly ONVIF: "onvif";
    readonly WEBCAM: "webcam";
    readonly RTSP: "rtsp";
    readonly ARCHIVO: "archivo";
    readonly DVR: "dvr";
};
export declare const CamaraProtocoloLabels: Record<(typeof CamaraProtocolo)[keyof typeof CamaraProtocolo], string>;
export declare const OperadorRol: {
    readonly ADMIN: "admin";
    readonly SUPERVISOR: "supervisor";
    readonly OPERADOR: "operador";
    readonly VIEWER: "viewer";
};
export declare const OperadorRolLabels: Record<(typeof OperadorRol)[keyof typeof OperadorRol], string>;
export declare const OperadorEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const OperadorEstadoLabels: Record<(typeof OperadorEstado)[keyof typeof OperadorEstado], string>;
export declare const OperadorGender: {
    readonly MALE: "male";
    readonly FEMALE: "female";
    readonly OTHER: "other";
};
export declare const OperadorGenderLabels: Record<(typeof OperadorGender)[keyof typeof OperadorGender], string>;
export declare const PersonaTipo: {
    readonly SOCIO: "socio";
    readonly EMPLEADO: "empleado";
    readonly FAMILIA: "familia";
    readonly LADRON: "ladron";
    readonly OTRO: "otro";
};
export declare const PersonaTipoLabels: Record<(typeof PersonaTipo)[keyof typeof PersonaTipo], string>;
export declare const PersonaEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const PersonaEstadoLabels: Record<(typeof PersonaEstado)[keyof typeof PersonaEstado], string>;
export declare const PersonaGender: {
    readonly MALE: "male";
    readonly FEMALE: "female";
    readonly OTHER: "other";
    readonly UNKNOWN: "unknown";
};
export declare const PersonaGenderLabels: Record<(typeof PersonaGender)[keyof typeof PersonaGender], string>;
export declare const PersonaEmbeddingEngine: {
    readonly HUMAN: "human";
    readonly INSIGHTFACE: "insightface";
    readonly DEEPFACE: "deepface";
    readonly FACENET: "facenet";
    readonly ARCFACE: "arcface";
    readonly OTRO: "otro";
};
export declare const PersonaEmbeddingEngineLabels: Record<(typeof PersonaEmbeddingEngine)[keyof typeof PersonaEmbeddingEngine], string>;
export declare const PersonaEmbeddingPerfil: {
    readonly FRONT: "front";
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly TOP: "top";
    readonly UNDETECTED: "undetected";
};
export declare const PersonaEmbeddingPerfilLabels: Record<(typeof PersonaEmbeddingPerfil)[keyof typeof PersonaEmbeddingPerfil], string>;
export declare const PersonaEmbeddingEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const PersonaEmbeddingEstadoLabels: Record<(typeof PersonaEmbeddingEstado)[keyof typeof PersonaEmbeddingEstado], string>;
export declare const SolicitudRecognitionSourceType: {
    readonly CAMERA: "camera";
    readonly VIDEO_FILE: "video_file";
    readonly DVR: "dvr";
    readonly UPLOAD: "upload";
    readonly API: "api";
};
export declare const SolicitudRecognitionSourceTypeLabels: Record<(typeof SolicitudRecognitionSourceType)[keyof typeof SolicitudRecognitionSourceType], string>;
export declare const SolicitudRecognitionStatus: {
    readonly PENDIENTE: "pendiente";
    readonly PROCESANDO: "procesando";
    readonly PROCESADA: "procesada";
    readonly ERROR: "error";
};
export declare const SolicitudRecognitionStatusLabels: Record<(typeof SolicitudRecognitionStatus)[keyof typeof SolicitudRecognitionStatus], string>;
export declare const RecognitionEventSourceType: {
    readonly CAMERA: "camera";
    readonly VIDEO_FILE: "video_file";
    readonly DVR: "dvr";
    readonly UPLOAD: "upload";
    readonly API: "api";
};
export declare const RecognitionEventSourceTypeLabels: Record<(typeof RecognitionEventSourceType)[keyof typeof RecognitionEventSourceType], string>;
export declare const RecognitionEventProcessingStatus: {
    readonly OK: "ok";
    readonly SIN_ROSTRO: "sin_rostro";
    readonly ERROR: "error";
};
export declare const RecognitionEventProcessingStatusLabels: Record<(typeof RecognitionEventProcessingStatus)[keyof typeof RecognitionEventProcessingStatus], string>;
export declare const RecognitionFacePerfil: {
    readonly FRONT: "front";
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly TOP: "top";
    readonly UNDETECTED: "undetected";
};
export declare const RecognitionFacePerfilLabels: Record<(typeof RecognitionFacePerfil)[keyof typeof RecognitionFacePerfil], string>;
export declare const RecognitionFaceFinalLabel: {
    readonly DESCONOCIDO: "desconocido";
    readonly IDENTIFICADO: "identificado";
    readonly LADRON: "ladron";
    readonly RECHAZADO: "rechazado";
    readonly REVISAR: "revisar";
};
export declare const RecognitionFaceFinalLabelLabels: Record<(typeof RecognitionFaceFinalLabel)[keyof typeof RecognitionFaceFinalLabel], string>;
export declare const RecognitionFaceEstadoValidacion: {
    readonly VALIDO: "valido";
    readonly POR_VALIDAR: "por_validar";
    readonly INVALIDO: "invalido";
};
export declare const RecognitionFaceEstadoValidacionLabels: Record<(typeof RecognitionFaceEstadoValidacion)[keyof typeof RecognitionFaceEstadoValidacion], string>;
export declare const RecognitionFaceAssignedStatus: {
    readonly SIN_ASIGNAR: "sin_asignar";
    readonly AUTO_ASIGNADO: "auto_asignado";
    readonly MANUAL_ASIGNADO: "manual_asignado";
    readonly ENROLADO_DESDE_EVENTO: "enrolado_desde_evento";
};
export declare const RecognitionFaceAssignedStatusLabels: Record<(typeof RecognitionFaceAssignedStatus)[keyof typeof RecognitionFaceAssignedStatus], string>;
export declare const RecognitionFaceBestEngine: {
    readonly HUMAN: "human";
    readonly INSIGHTFACE: "insightface";
    readonly DEEPFACE: "deepface";
    readonly FACENET: "facenet";
    readonly ARCFACE: "arcface";
    readonly OTRO: "otro";
};
export declare const RecognitionFaceBestEngineLabels: Record<(typeof RecognitionFaceBestEngine)[keyof typeof RecognitionFaceBestEngine], string>;
export declare const RecognitionEngineResultEngine: {
    readonly HUMAN: "human";
    readonly INSIGHTFACE: "insightface";
    readonly DEEPFACE: "deepface";
    readonly FACENET: "facenet";
    readonly ARCFACE: "arcface";
    readonly OTRO: "otro";
};
export declare const RecognitionEngineResultEngineLabels: Record<(typeof RecognitionEngineResultEngine)[keyof typeof RecognitionEngineResultEngine], string>;
export declare const ConfigGroupEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const ConfigGroupEstadoLabels: Record<(typeof ConfigGroupEstado)[keyof typeof ConfigGroupEstado], string>;
export declare const ConfigDefinitionDataType: {
    readonly STRING: "string";
    readonly TEXT: "text";
    readonly INT: "int";
    readonly DECIMAL: "decimal";
    readonly BOOLEAN: "boolean";
    readonly JSON: "json";
    readonly ENUM: "enum";
    readonly TIME: "time";
    readonly DATETIME: "datetime";
};
export declare const ConfigDefinitionDataTypeLabels: Record<(typeof ConfigDefinitionDataType)[keyof typeof ConfigDefinitionDataType], string>;
export declare const ConfigDefinitionEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const ConfigDefinitionEstadoLabels: Record<(typeof ConfigDefinitionEstado)[keyof typeof ConfigDefinitionEstado], string>;
export declare const AlertChannelEstado: {
    readonly ACTIVO: "activo";
    readonly INACTIVO: "inactivo";
};
export declare const AlertChannelEstadoLabels: Record<(typeof AlertChannelEstado)[keyof typeof AlertChannelEstado], string>;
export declare const AlertRuleEventoTipo: {
    readonly LADRON: "ladron";
    readonly DESCONOCIDO: "desconocido";
    readonly IDENTIFICADO: "identificado";
    readonly RECHAZADO: "rechazado";
    readonly REVISAR: "revisar";
    readonly CUALQUIER_RECONOCIMIENTO: "cualquier_reconocimiento";
};
export declare const AlertRuleEventoTipoLabels: Record<(typeof AlertRuleEventoTipo)[keyof typeof AlertRuleEventoTipo], string>;
export declare const AlertaEnviadaCanal: {
    readonly WHATSAPP: "whatsapp";
    readonly TELEGRAM: "telegram";
    readonly EMAIL: "email";
    readonly WEBHOOK: "webhook";
    readonly SMS: "sms";
    readonly OTRO: "otro";
};
export declare const AlertaEnviadaCanalLabels: Record<(typeof AlertaEnviadaCanal)[keyof typeof AlertaEnviadaCanal], string>;
export declare const AlertaEnviadaEstadoEnvio: {
    readonly PENDIENTE: "pendiente";
    readonly ENVIADO: "enviado";
    readonly ERROR: "error";
};
export declare const AlertaEnviadaEstadoEnvioLabels: Record<(typeof AlertaEnviadaEstadoEnvio)[keyof typeof AlertaEnviadaEstadoEnvio], string>;
//# sourceMappingURL=dictionaries.d.ts.map