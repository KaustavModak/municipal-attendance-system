import os
from datetime import datetime
from app.config import settings

backup_folder = "database_backups"

os.makedirs(
    backup_folder,
    exist_ok=True
)

timestamp = datetime.now().strftime(
    "%d-%m-%Y_%H-%M-%S"
)

backup_file = (
    f"{backup_folder}/backup_{timestamp}.sql"
)

command = (
    f"mysqldump -u {settings.DB_USER} "
    f"-p {settings.DB_NAME} "
    f"> {backup_file}"
)

os.system(command)

print(
    f"Backup created: {backup_file}"
)