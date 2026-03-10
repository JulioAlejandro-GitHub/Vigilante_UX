-- =========================================================
-- Vigilante v2 - Rediseño orientado a eventos de reconocimiento
-- Autor: OpenAI
-- Objetivo:
--   1) Separar identidad persistente (persona enrolada) de ocurrencias temporales
--   2) Evitar crear un "usuario" nuevo por cada reconocimiento
--   3) Mantener el embedding como activo principal del sistema
--   4) Permitir asignación/enrolamiento posterior desde un reconocimiento
-- Compatibilidad:
--   Diseñado para MySQL 8+
-- =========================================================

DROP DATABASE IF EXISTS `Vigilante`;
CREATE DATABASE `Vigilante` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `Vigilante`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 1) ESTRUCTURA ORGANIZACIONAL
-- =========================================================

CREATE TABLE `empresa` (
  `empresa_id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`empresa_id`),
  UNIQUE KEY `uq_empresa_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sucursal` (
  `local_id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`local_id`),
  UNIQUE KEY `uq_sucursal_empresa_nombre` (`empresa_id`,`nombre`),
  KEY `idx_sucursal_empresa` (`empresa_id`),
  CONSTRAINT `fk_sucursal_empresa`
    FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`empresa_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `camara` (
  `camara_id` INT NOT NULL AUTO_INCREMENT,
  `local_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `ubicacion` ENUM('Ingreso','Estadia','Salida','Otro') NOT NULL DEFAULT 'Estadia',
  `estado` ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `orden` INT DEFAULT NULL,
  `protocolo` ENUM('onvif','webcam','rtsp','archivo','dvr') NOT NULL DEFAULT 'onvif',
  `camara_hostname` VARCHAR(100) DEFAULT NULL,
  `camara_port` SMALLINT DEFAULT NULL,
  `camara_user` VARCHAR(100) DEFAULT NULL,
  `camara_pass` VARCHAR(255) DEFAULT NULL,
  `camara_params` VARCHAR(255) DEFAULT NULL,
  `stream_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`camara_id`),
  UNIQUE KEY `uq_camara_local_nombre` (`local_id`,`nombre`),
  KEY `idx_camara_local_estado` (`local_id`,`estado`),
  CONSTRAINT `fk_camara_sucursal`
    FOREIGN KEY (`local_id`) REFERENCES `sucursal` (`local_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 2) USUARIOS DE LA APLICACIÓN (OPERADORES)
--    Separados de las personas reconocidas por el sistema.
-- =========================================================

CREATE TABLE `operador` (
  `operador_id` INT NOT NULL AUTO_INCREMENT,
  `local_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `rol` ENUM('admin','supervisor','operador','viewer') NOT NULL DEFAULT 'operador',
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `gender` ENUM('male','female','other') NOT NULL DEFAULT 'other',
  `password_bcryptjs` VARCHAR(200) NOT NULL,
  `google` TINYINT(1) NOT NULL DEFAULT 0,
  `telegram_chat_id` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`operador_id`),
  UNIQUE KEY `uq_operador_email` (`email`),
  KEY `idx_operador_local_estado` (`local_id`,`estado`),
  CONSTRAINT `fk_operador_sucursal`
    FOREIGN KEY (`local_id`) REFERENCES `sucursal` (`local_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `operador_login` (
  `operador_login_id` BIGINT NOT NULL AUTO_INCREMENT,
  `operador_id` INT NOT NULL,
  `fecha_login` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_origen` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`operador_login_id`),
  KEY `idx_operador_login_fecha` (`operador_id`,`fecha_login`),
  CONSTRAINT `fk_operador_login_operador`
    FOREIGN KEY (`operador_id`) REFERENCES `operador` (`operador_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 3) PERSONAS ENROLADAS EN EL SISTEMA
--    Esta tabla ya NO representa eventos. Solo identidades persistentes.
-- =========================================================

CREATE TABLE `persona` (
  `persona_id` BIGINT NOT NULL AUTO_INCREMENT,
  `local_id` INT NOT NULL,
  `codigo_externo` VARCHAR(100) DEFAULT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `tipo` ENUM('socio','empleado','familia','ladron','otro') NOT NULL DEFAULT 'otro',
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_eliminacion` DATETIME DEFAULT NULL,
  `gender` ENUM('male','female','other','unknown') NOT NULL DEFAULT 'unknown',
  `email` VARCHAR(200) DEFAULT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `img_referencia` VARCHAR(255) DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  PRIMARY KEY (`persona_id`),
  UNIQUE KEY `uq_persona_local_codigo_externo` (`local_id`,`codigo_externo`),
  KEY `idx_persona_local_tipo_estado` (`local_id`,`tipo`,`estado`),
  KEY `idx_persona_nombre` (`nombre`),
  CONSTRAINT `fk_persona_sucursal`
    FOREIGN KEY (`local_id`) REFERENCES `sucursal` (`local_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Embeddings de enrolamiento / galería de identidad.
-- Permite múltiples embeddings por persona y por engine/modelo.
CREATE TABLE `persona_embedding` (
  `persona_embedding_id` BIGINT NOT NULL AUTO_INCREMENT,
  `persona_id` BIGINT NOT NULL,
  `engine` ENUM('human','insightface','deepface','facenet','arcface','otro') NOT NULL,
  `model_name` VARCHAR(100) DEFAULT NULL,
  `model_version` VARCHAR(50) DEFAULT NULL,
  `embedding_dim` SMALLINT DEFAULT NULL,
  `embedding` JSON NOT NULL,
  `embedding_hash` CHAR(64) DEFAULT NULL,
  `img_origen` VARCHAR(255) DEFAULT NULL,
  `face_box` JSON DEFAULT NULL,
  `perfil` ENUM('front','left','right','top','undetected') NOT NULL DEFAULT 'undetected',
  `quality_score` DECIMAL(10,6) DEFAULT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_operador_id` INT DEFAULT NULL,
  PRIMARY KEY (`persona_embedding_id`),
  UNIQUE KEY `uq_persona_embedding_hash` (`embedding_hash`),
  KEY `idx_persona_embedding_persona_estado` (`persona_id`,`estado`),
  KEY `idx_persona_embedding_engine_model` (`engine`,`model_name`,`model_version`),
  KEY `idx_persona_embedding_primary` (`persona_id`,`is_primary`),
  CONSTRAINT `fk_persona_embedding_persona`
    FOREIGN KEY (`persona_id`) REFERENCES `persona` (`persona_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_persona_embedding_operador`
    FOREIGN KEY (`created_by_operador_id`) REFERENCES `operador` (`operador_id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 4) PIPELINE DE INGESTA / SOLICITUDES DE RECONOCIMIENTO
-- =========================================================

CREATE TABLE `solicitud_recognition` (
  `id_solicitud` BIGINT NOT NULL AUTO_INCREMENT,
  `camera_id` INT DEFAULT NULL,
  `source_type` ENUM('camera','video_file','dvr','upload','api') NOT NULL DEFAULT 'camera',
  `source_ref` VARCHAR(500) DEFAULT NULL,
  `img` VARCHAR(255) DEFAULT NULL,
  `sharp_ok` TINYINT(1) DEFAULT NULL,
  `status` ENUM('pendiente','procesando','procesada','error') NOT NULL DEFAULT 'pendiente',
  `requested_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `idx_solicitud_camera_fecha` (`camera_id`,`requested_at`),
  CONSTRAINT `fk_solicitud_camara`
    FOREIGN KEY (`camera_id`) REFERENCES `camara` (`camara_id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 5) EVENTO DE RECONOCIMIENTO
--    Un evento representa un frame / imagen / instante procesado.
--    Puede contener una o varias caras detectadas.
-- =========================================================

CREATE TABLE `recognition_event` (
  `recognition_event_id` BIGINT NOT NULL AUTO_INCREMENT,
  `id_solicitud` BIGINT DEFAULT NULL,
  `camara_id` INT NOT NULL,
  `local_id` INT NOT NULL,
  `occurred_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `frame_img` VARCHAR(255) DEFAULT NULL,
  `frame_metadata` JSON DEFAULT NULL,
  `source_type` ENUM('camera','video_file','dvr','upload','api') NOT NULL DEFAULT 'camera',
  `processing_status` ENUM('ok','sin_rostro','error') NOT NULL DEFAULT 'ok',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recognition_event_id`),
  KEY `idx_recognition_event_fecha` (`occurred_at`),
  KEY `idx_recognition_event_camara_fecha` (`camara_id`,`occurred_at`),
  KEY `idx_recognition_event_local_fecha` (`local_id`,`occurred_at`),
  KEY `idx_recognition_event_solicitud` (`id_solicitud`),
  CONSTRAINT `fk_recognition_event_solicitud`
    FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_recognition` (`id_solicitud`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_recognition_event_camara`
    FOREIGN KEY (`camara_id`) REFERENCES `camara` (`camara_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_recognition_event_sucursal`
    FOREIGN KEY (`local_id`) REFERENCES `sucursal` (`local_id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cada cara detectada dentro de un evento.
-- Aquí vive la decisión final de negocio: quedó sin asignar, asignada o enrolada.
CREATE TABLE `recognition_face` (
  `recognition_face_id` BIGINT NOT NULL AUTO_INCREMENT,
  `recognition_event_id` BIGINT NOT NULL,
  `face_index` SMALLINT NOT NULL DEFAULT 1,
  `face_img` VARCHAR(255) DEFAULT NULL,
  `box` JSON DEFAULT NULL,
  `perfil` ENUM('front','left','right','top','undetected') NOT NULL DEFAULT 'undetected',
  `quality_score` DECIMAL(10,6) DEFAULT NULL,
  `human_score` DECIMAL(10,6) DEFAULT NULL,
  `final_label` ENUM('desconocido','identificado','ladron','rechazado','revisar') NOT NULL DEFAULT 'desconocido',
  `estado_validacion` ENUM('valido','por_validar','invalido') NOT NULL DEFAULT 'por_validar',
  `assigned_persona_id` BIGINT DEFAULT NULL,
  `assigned_status` ENUM('sin_asignar','auto_asignado','manual_asignado','enrolado_desde_evento') NOT NULL DEFAULT 'sin_asignar',
  `best_similarity` DECIMAL(10,8) DEFAULT NULL,
  `best_engine` ENUM('human','insightface','deepface','facenet','arcface','otro') DEFAULT NULL,
  `reviewed_by_operador_id` INT DEFAULT NULL,
  `reviewed_at` DATETIME DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recognition_face_id`),
  UNIQUE KEY `uq_recognition_face_event_index` (`recognition_event_id`,`face_index`),
  KEY `idx_recognition_face_label_fecha` (`final_label`,`created_at`),
  KEY `idx_recognition_face_persona_fecha` (`assigned_persona_id`,`created_at`),
  KEY `idx_recognition_face_estado_fecha` (`estado_validacion`,`created_at`),
  KEY `idx_recognition_face_best_engine` (`best_engine`),
  CONSTRAINT `fk_recognition_face_event`
    FOREIGN KEY (`recognition_event_id`) REFERENCES `recognition_event` (`recognition_event_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_recognition_face_persona`
    FOREIGN KEY (`assigned_persona_id`) REFERENCES `persona` (`persona_id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_recognition_face_operador`
    FOREIGN KEY (`reviewed_by_operador_id`) REFERENCES `operador` (`operador_id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resultado detallado por engine para cada cara detectada.
-- Aquí se almacena el embedding inferido del reconocimiento.
CREATE TABLE `recognition_engine_result` (
  `recognition_engine_result_id` BIGINT NOT NULL AUTO_INCREMENT,
  `recognition_face_id` BIGINT NOT NULL,
  `engine` ENUM('human','insightface','deepface','facenet','arcface','otro') NOT NULL,
  `model_name` VARCHAR(100) DEFAULT NULL,
  `model_version` VARCHAR(50) DEFAULT NULL,
  `detected_human` TINYINT(1) DEFAULT NULL,
  `similarity` DECIMAL(10,8) DEFAULT NULL,
  `candidate_persona_id` BIGINT DEFAULT NULL,
  `candidate_persona_embedding_id` BIGINT DEFAULT NULL,
  `img` VARCHAR(255) DEFAULT NULL,
  `box` JSON DEFAULT NULL,
  `embedding` JSON DEFAULT NULL,
  `embedding_dim` SMALLINT DEFAULT NULL,
  `embedding_hash` CHAR(64) DEFAULT NULL,
  `processing_ms` INT DEFAULT NULL,
  `raw_response` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recognition_engine_result_id`),
  KEY `idx_recognition_engine_face_engine` (`recognition_face_id`,`engine`),
  KEY `idx_recognition_engine_candidate` (`candidate_persona_id`,`similarity`),
  KEY `idx_recognition_engine_hash` (`embedding_hash`),
  CONSTRAINT `fk_recognition_engine_face`
    FOREIGN KEY (`recognition_face_id`) REFERENCES `recognition_face` (`recognition_face_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_recognition_engine_candidate_persona`
    FOREIGN KEY (`candidate_persona_id`) REFERENCES `persona` (`persona_id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_recognition_engine_candidate_embedding`
    FOREIGN KEY (`candidate_persona_embedding_id`) REFERENCES `persona_embedding` (`persona_embedding_id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 6) ALERTAS
--    Ahora la alerta se asocia a una cara/evento de reconocimiento,
--    no a un "acceso" ficticio.
-- =========================================================

CREATE TABLE `alerta_enviada` (
  `alerta_enviada_id` BIGINT NOT NULL AUTO_INCREMENT,
  `recognition_face_id` BIGINT NOT NULL,
  `canal` ENUM('telegram','email','webhook','sms','otro') NOT NULL DEFAULT 'telegram',
  `text_alert` JSON DEFAULT NULL,
  `fecha_alerta` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_envio` ENUM('pendiente','enviado','error') NOT NULL DEFAULT 'enviado',
  PRIMARY KEY (`alerta_enviada_id`),
  KEY `idx_alerta_fecha` (`fecha_alerta`),
  KEY `idx_alerta_face_fecha` (`recognition_face_id`,`fecha_alerta`),
  CONSTRAINT `fk_alerta_face`
    FOREIGN KEY (`recognition_face_id`) REFERENCES `recognition_face` (`recognition_face_id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- 7) VISTAS ÚTILES PARA REPORTERÍA / UX
-- =========================================================

CREATE OR REPLACE VIEW `vw_recognition_timeline` AS
SELECT
  re.recognition_event_id,
  rf.recognition_face_id,
  re.local_id,
  re.camara_id,
  re.occurred_at,
  rf.face_index,
  rf.face_img,
  rf.perfil,
  rf.final_label,
  rf.estado_validacion,
  rf.best_similarity,
  rf.best_engine,
  rf.assigned_status,
  rf.assigned_persona_id,
  p.nombre AS persona_nombre,
  p.tipo AS persona_tipo,
  c.nombre AS camara_nombre,
  c.ubicacion AS camara_ubicacion
FROM recognition_event re
JOIN recognition_face rf ON rf.recognition_event_id = re.recognition_event_id
JOIN camara c ON c.camara_id = re.camara_id
LEFT JOIN persona p ON p.persona_id = rf.assigned_persona_id;

CREATE OR REPLACE VIEW `vw_recognition_engine_best_match` AS
SELECT
  rer.recognition_face_id,
  rer.engine,
  rer.similarity,
  rer.candidate_persona_id,
  rer.candidate_persona_embedding_id,
  rer.model_name,
  rer.model_version,
  rer.created_at
FROM recognition_engine_result rer;

-- =========================================================
-- 8) DATOS BASE / SEMILLA
-- =========================================================

INSERT INTO `empresa` (`nombre`,`estado`) VALUES
  ('Test Vigilante','activo');

INSERT INTO `sucursal` (`empresa_id`,`nombre`,`estado`) VALUES
  (1,'Sucursal Principal','activo');

INSERT INTO `operador` (
  `local_id`,`nombre`,`email`,`rol`,`estado`,`gender`,`password_bcryptjs`,`google`,`telegram_chat_id`
) VALUES (
  1,
  'Julio Morales',
  'juliomoralesgutierrez@gmail.com',
  'admin',
  'activo',
  'male',
  '$2a$10$/pRqJ8LTWbnnUirDNjz0TO2q.uysnXUUW/H7j8ZGOGDj46t54FwyO',
  0,
  NULL
);

INSERT INTO `camara` (
  `local_id`,`nombre`,`ubicacion`,`estado`,`orden`,`protocolo`,`camara_hostname`,`camara_port`,`camara_user`,`camara_pass`,`camara_params`
) VALUES
  (1,'entrada 1','Ingreso','Activo',1,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'salida 1','Salida','Inactivo',6,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'Ingreso 2','Ingreso','Inactivo',2,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'Salida 7','Estadia','Inactivo',7,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'Estadia 3','Estadia','Inactivo',3,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'Estadia 4','Estadia','Inactivo',4,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0'),
  (1,'Estadia 5','Estadia','Inactivo',5,'onvif','192.168.100.143',554,'admin','admin123','/cam/realmonitor?channel=1&subtype=0');

-- Persona de ejemplo ya enrolada (opcional)
INSERT INTO `persona` (
  `local_id`,`codigo_externo`,`nombre`,`tipo`,`estado`,`gender`,`email`,`img_referencia`,`notas`
) VALUES (
  1,
  'PERS-0001',
  'Julio',
  'familia',
  'activo',
  'male',
  'juliomoralesgutierrez@gmail.com',
  NULL,
  'Persona de ejemplo enrolada en la galería'
);

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- NOTAS DE MIGRACIÓN DESDE LA BD ANTERIOR
-- =========================================================
-- 1) usuario            -> separar en operador y persona
-- 2) acceso             -> reemplazar por recognition_event + recognition_face
-- 3) acceso_engine_result -> reemplazar por recognition_engine_result
-- 4) alerts_send        -> reemplazar por alerta_enviada
-- 5) "desconocido" ya no debe existir como persona creada automáticamente.
--    Ahora es un estado / etiqueta del reconocimiento_face.final_label.
-- 6) Cuando un reconocimiento se confirma, se puede:
--      a) asignar recognition_face.assigned_persona_id a una persona existente
--      b) enrolar una nueva persona y luego vincularla al recognition_face
-- 7) Los embeddings históricos de los reconocimientos quedan en recognition_engine_result.embedding
--    y los embeddings de galería / enrolamiento quedan en persona_embedding.embedding
-- =========================================================
