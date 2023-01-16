import os
from dotenv import load_dotenv

load_dotenv()


class ConfigPolygon:
    @staticmethod
    def get_api_key() -> str:
        api_key = os.getenv("POLYGON_API_KEY")
        if not api_key:
            raise RuntimeError("Env param not provided: POLYGON_API_KEY")
        return api_key

    @staticmethod
    def get_host() -> str:
        return "https://api.polygon.io"
