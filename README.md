
# Vigilante SW - Computer Vision System

## Installation 

Use the package manager [npm](https://www.npmjs.com/) to install.

### Backend
```bash
npm install
```

## Usage Backend
```bash
npm start
```

### Frontend
```bash
cd frontend/
npm install
```

## Usage Frontend
```bash
cd frontend/
npm start
```
---
## FrontEnd
http://localhost:3000

## BackEnd
http://localhost:8085



## License
- CompreFace
- Human
- DeepFace
- InsightFace
- Roboflow
- Node
- Python
- Mysql




# Python Entorno Virtual MAC ARM64
```bash
cd insightface_service/

brew install python@3.10

./setup.sh
./run.sh
```
<!-- 
start servise Python
uvicorn app.main:app --host 0.0.0.0 --port 8010 


### iniciar servicio InsightFace

cd insightface_service/
colima start --arch x86_64 --vz-rosetta --cpu 4 --memory 8
docker compose up -d



### iniciar servicio CompreFace

cd CompreFace/

colima start --arch aarch64 --memory 4 --cpu 4
colima start --arch aarch64 --memory 8 --cpu 6
    No uses --gpu porque CompreFace no usa aceleración Metal.

docker compose up -d
-->



🧪 Crear entorno virtual del servicio InsightFace:
cd insightface_service
python3 -m venv venv_insight
source venv_insight/bin/activate
pip install -r requirements.txt

▶️ run.sh del servicio InsightFace:
#!/bin/bash
cd "$(dirname "$0")"
source venv_insight/bin/activate
python3 main.py


🧪 Crear entorno virtual: cam_streaming
cd cam_streaming
python3 -m venv venv_stream
source venv_stream/bin/activate
pip install -r requirements.txt

▶️ run.sh del servicio de streaming:
#!/bin/bash
cd "$(dirname "$0")"
source venv_stream/bin/activate
python3 camera_stream/main.py






Crear el venv Python

Ve al directorio correcto:
cd /Users/julio/Documents/GitHub/axi/src/services/insightface_service

Crear venv:
python3 -m venv venv_insight

Activarlo:
source venv_insight/bin/activate

Confirmar:
which python




Instalar dependencias del InsightFace Service
pip install --upgrade pip
pip install -r requirements.txt


Borrar caché del proyecto (importante)
find . -type d -name "__pycache__" -exec rm -r {} +



Ejecutar InsightFace Service
python -m app.main


Dale permiso:
chmod +x run.sh




Qué mejorar después:

Ajustar max_inflight_recognitions, timeouts y URLs en env/config según capacidad real.
Agregar reintentos/backoff y circuit breaker por motor si quieres más resiliencia.
Añadir métricas (Prometheus) y tests unitarios de agregación con motores mock.
Probar /recognize y /health para validar que el flujo responde 200 aunque algún motor falle. (No ejecuté tests aquí).


chmod +x run.sh

----- frontend 3000
cd /Users/julio/Documents/GitHub/axi/frontend
npm start

----- backend 8085
cd /Users/julio/Documents/GitHub/axi
npm start

----- server recognition insightface 8010
cd /Users/julio/Documents/GitHub/axi/src/services/insightface_service
./run.sh

----- server recognition deepface 8030
cd /Users/julio/Documents/GitHub/axi/src/services/deepface_service
./run.sh

----- server cam_streaming 8020 (lee camara detecta humano, envia a recognition) - al separar, hay que hacer dos conexiones a camara...
cd /Users/julio/Documents/GitHub/axi/src/services/cam_streaming
source venv_stream/bin/activate
./run.sh

----- server cam_streaming 8011 (sirve video a frontend para streaming)
cd /Users/julio/Documents/GitHub/axi/src/services/cam_streaming
source venv_stream/bin/activate
uvicorn camera_stream.hls_api:app --host 0.0.0.0 --port 8011


----- server Alert 8040
cd /Users/julio/Documents/GitHub/axi/src/services/alert_service
./run.sh