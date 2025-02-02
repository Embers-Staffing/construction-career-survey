import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-replace-in-production'
    FIREBASE_PROJECT_ID = 'construction-career-survey'
    FIREBASE_PRIVATE_KEY_ID = '9232cada7e3ca2e58f8fe1eaf9ec360e7cc7a8df'
    FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDsGimj1o0gJbGv\n0kCIy9IUvYHHj3Fyge95SgIcAOX668ABVR3YFBMaey6dGAKWr8W5VaAb2POy8Pbx\nk4DIZuK/SPAt5PYx+LJN9dcvVsq1aGZToJtCanaLWUjgQ1Czrzu90Byqmf3tsiMe\nOQXKLaqfBcCi1Z7/+i8zu0qXhq5yoLsVLQhQEVcsu3tbYlwtvoSKnCwviH6fuiDd\nq+o8K/Z3i3q3jwbsiWp4v3Pf1/wC6dNs6qkhz0k8A0rFk0KolCbCffunr159bHrS\nd9xafgD1p0WFsjXfa8wuCKJH3//jWJ+Yj/HIcXq9+RYc94RYSgGLPuj2ryWRO5fM\n7vN638YjAgMBAAECggEAS2oh8dTW2DViF9STS367OGe93AX8CUTqvrW+jb5Vt3v1\nJRfQhBQJdBRzs7cXIJW9lPD+RtbaJMamQkzIvnpqpAoCuc4gO58CKTfFB7hz4FUc\nFks/PIwwGFupFQU7cmGfNgaTGYU9oF6drAovyMAkd04JlZmhg4cg66e/8D2TXEZQ\n1PET/41oJk7omTTUYqmIU2C+G++tqZuyM6EKiiGjdW0AKtjDVd81Xzq4m6i0OCsi\nRGvgBc8GiDRm6FkG0gy6rw/bkbi7qD2G408OB0NPo5bbI0n+JcD/Oalxf9jD48bU\nPZ2y+VHKBoM1HR/e7AUwnuGxtWMZ8Tcrkz21JHm0AQKBgQD6uemzUQb4wmtngoGQ\nuR+Rf8lwWxgyBM02TrQthGODutg7M9DdyYik7p6gpJURL/i01OhhBOmsJfcWeBXH\n4ogKieAA5Ap+Zf9V5KqPxLa/S3ZiNYBowLcyFmBYolSzeOfeajXYPG9QhTVtIkPa\nXZ/uen8a0zmRCE0JwuJwfgWyIwKBgQDxEYDxh0f1blqVY8QammEq6Ae/WYNpisW8\nd/+RY0I5uUnqtozFVSLW1qneF609TJ48o+f7xRQUlko93nZH2Bv2aTi4W9OfepWm\n5AHOpqaGt9z/u25JpAnoL6e1//zynDE5RDGs0RzKMDBTxK3zzuUJLV+7RJJ62xYV\nCdsZ22zcAQKBgC9bzIvlYza7qoPrv8NxZEgcZhVF76ULCSQX66qpVg68zTkpiWtL\nNPdKZ0YasFmFwSmPCbHBts2ggjKJTjvqSx4KevhQGrdTVs6Hmbv8QTSS8XKNforK\n1A+u8FXtm6gmz01QrIkCqVgBQV0y2rQ1eQ8XrkiH21jMw5hzakgrVbIXAoGBAIhc\nPVLiEfsrjAO65j+iGdqaW1+Ks8HspINCYYcM3XYncD9bOW+aA9YAoR+mxvDIuS1W\nDbAlv4ERrjcm8kMbZF3TESl/j8pDHgnEKZ2KOOI1eMYTcIQpTQ1Qf458mclmPpXF\nFFBMDPv1nDCWLUufOYEicGdOl4j1Cp2l8JDExOQBAoGBAIPAeBNFmzZwv3pFofqx\nH6NoAKDuIPdmGnQx4YK5OB88riV4TDHRb7WDBNEcrLGdavWqrDyaRIk84kqfJvW7\nbubiWY5jn7xQs2uTM45hwc4bFhw5q2k2K0jdwI9gH2bNvM75UI3w+RHqUQgfNurc\nOONC3vqmQoxDdXUtVTQZPzkf\n-----END PRIVATE KEY-----\n'
    FIREBASE_CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@construction-career-survey.iam.gserviceaccount.com'
    FIREBASE_CLIENT_ID = '102637379904848400257'
    FIREBASE_AUTH_URI = 'https://accounts.google.com/o/oauth2/auth'
    FIREBASE_TOKEN_URI = 'https://oauth2.googleapis.com/token'
    FIREBASE_AUTH_PROVIDER_CERT_URL = 'https://www.googleapis.com/oauth2/v1/certs'
    FIREBASE_CLIENT_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40construction-career-survey.iam.gserviceaccount.com'

    # Flask-Login settings
    SESSION_PROTECTION = 'strong'
    
    # Role definitions
    ROLE_ADMIN = 'admin'
    ROLE_ANALYST = 'analyst'
    ROLE_SURVEYOR = 'surveyor'
    
    # Analytics settings
    ANALYTICS_PER_PAGE = 20
    
    # Survey settings
    MAX_SURVEY_ATTEMPTS = 1
