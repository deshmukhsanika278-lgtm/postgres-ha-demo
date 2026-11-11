import os
from minio import Minio

client = Minio(
    "minio:9000",
    access_key=os.environ["MINIO_ROOT_USER"],
    secret_key=os.environ["MINIO_ROOT_PASSWORD"],
    secure=False,
)

bucket = os.environ.get("BACKUP_BUCKET", "postgres-backups")
backup_file = os.environ["BACKUP_FILE"]
object_name = os.path.basename(backup_file)

if not client.bucket_exists(bucket):
    raise RuntimeError(f"MinIO bucket does not exist: {bucket}")

result = client.fput_object(bucket, object_name, backup_file)
print(f"Backup uploaded: {result.bucket_name}/{result.object_name}")
