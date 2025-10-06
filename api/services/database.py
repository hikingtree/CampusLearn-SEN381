import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class DatabaseManager:
    def __init__(self):
        self.connection_pool = psycopg2.pool.SimpleConnectionPool(
            1,
            20,
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT'),
            database=os.getenv('POSTGRES_DB'),
            user=os.getenv('POSTGRES_USER'),
            password=os.getenv('POSTGRES_PASSWORD')
        )

    def get_connection(self):
        return self.connection_pool.getconn()

    def return_connection(self, connection):
        self.connection_pool.putconn(connection)

    def execute_query(self, query, params=None):
        connection = self.get_connection()
        try:
            cursor = connection.cursor()
            cursor.execute(query, params)
            connection.commit()
            return cursor
        except Exception as e:
            connection.rollback()
            raise e
        finally:
            cursor.close()
            self.return_connection(connection)

    def fetch_all(self, query, params=None):
        connection = self.get_connection()
        try:
            cursor = connection.cursor()
            cursor.execute(query, params)
            results = cursor.fetchall()
            return results
        except Exception as e:
            raise e
        finally:
            cursor.close()
            self.return_connection(connection)

    def fetch_one(self, query, params=None):
        connection = self.get_connection()
        try:
            cursor = connection.cursor()
            cursor.execute(query, params)
            result = cursor.fetchone()
            return result
        except Exception as e:
            raise e
        finally:
            cursor.close()
            self.return_connection(connection)

    def close_all_connections(self):
        self.connection_pool.closeall()

db_manager = DatabaseManager()
