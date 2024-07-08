import os
from dotenv import load_dotenv

load_dotenv()


def get_env_or_die(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Env param not provided: {name}")
    return value


class ConfigPolygonApi:
    @staticmethod
    def get_api_key() -> str:
        return get_env_or_die("POLYGON_API_KEY")

    @staticmethod
    def get_host() -> str:
        return "https://api.polygon.io"
