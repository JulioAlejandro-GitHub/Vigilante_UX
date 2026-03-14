WITH RankedFaces AS (
  SELECT
    rf.recognition_face_id as id,
    re.occurred_at as timestamp,
    c.nombre as camera,
    rf.final_label as userType,
    rf.best_similarity as confidence,
    COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl,
    p.nombre as persona_name,
    p.tipo as persona_tipo,
    oi.current_label as oi_label,
    CASE
      WHEN rf.assigned_persona_id IS NOT NULL THEN CONCAT('persona_', rf.assigned_persona_id)
      WHEN rf.observed_identity_id IS NOT NULL THEN CONCAT('oi_', rf.observed_identity_id)
      ELSE CONCAT('face_', rf.recognition_face_id)
    END as subject_id,
    ROW_NUMBER() OVER(
      PARTITION BY CASE
        WHEN rf.assigned_persona_id IS NOT NULL THEN CONCAT('persona_', rf.assigned_persona_id)
        WHEN rf.observed_identity_id IS NOT NULL THEN CONCAT('oi_', rf.observed_identity_id)
        ELSE CONCAT('face_', rf.recognition_face_id)
      END
      ORDER BY re.occurred_at DESC
    ) as rn
  FROM recognition_face rf
  JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
  JOIN camara c ON re.camara_id = c.camara_id
  LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
  LEFT JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
)
SELECT
  counts.subject_id,
  counts.last_seen,
  counts.event_count,
  rf_latest.id as latest_face_id,
  rf_latest.camera,
  rf_latest.userType,
  rf_latest.confidence,
  rf_latest.thumbnailUrl,
  rf_latest.persona_name,
  rf_latest.persona_tipo,
  rf_latest.oi_label
FROM (
  SELECT
    subject_id,
    MAX(timestamp) as last_seen,
    COUNT(*) as event_count
  FROM RankedFaces
  GROUP BY subject_id
) as counts
JOIN RankedFaces rf_latest ON counts.subject_id = rf_latest.subject_id AND rf_latest.rn = 1
ORDER BY counts.last_seen DESC
LIMIT 10 OFFSET 0;
