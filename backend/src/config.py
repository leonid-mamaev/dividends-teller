from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=Path(__file__).parent / '.env')
    polygon_api_key: str = Field(alias="POLYGON_API_KEY")
    polygon_api_host: str = "https://api.polygon.io"
    bucket_name: str = Field(validation_alias="S3_BUCKET_NAME")
    dynamodb_table_user_tickers: str = Field(alias="DYNAMODB_TABLE_USER_TICKERS")
    dynamodb_table_name_tickers_data: str = Field(alias="DYNAMODB_TABLE_TICKERS_INFO")


config = Config()
