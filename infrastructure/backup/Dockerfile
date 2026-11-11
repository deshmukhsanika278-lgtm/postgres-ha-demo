FROM postgres:17

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip \
    && pip3 install --no-cache-dir --break-system-packages minio \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/backup_to_minio.sh /app/backup_to_minio.sh
COPY scripts/upload_backup.py /app/upload_backup.py

RUN chmod +x /app/backup_to_minio.sh
