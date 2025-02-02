from typing import Dict, List, Optional
from firebase_admin import firestore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self, db: firestore.Client):
        self.db = db

    async def get_recommendations(
        self, 
        holland_code: str, 
        mbti_type: str
    ) -> Dict[str, Dict]:
        """
        Get career recommendations based on Holland Code and MBTI type.
        
        Args:
            holland_code (str): Three-letter Holland Code (e.g., 'RIA')
            mbti_type (str): Four-letter MBTI type (e.g., 'ISTJ')
            
        Returns:
            Dict containing combined recommendations from both systems
        """
        try:
            # Get Holland Code recommendations
            holland_doc = await self.db.collection('recommendations').document('holland_codes').get()
            holland_recs = holland_doc.get('codes', {}).get(holland_code, {})

            # Get MBTI recommendations
            mbti_doc = await self.db.collection('recommendations').document('mbti_types').get()
            mbti_recs = mbti_doc.get('types', {}).get(mbti_type, {})

            # Combine and deduplicate job recommendations
            all_jobs = list(set(holland_recs.get('jobs', []) + mbti_recs.get('jobs', [])))

            return {
                'jobs': all_jobs,
                'holland_code_description': holland_recs.get('description', ''),
                'mbti_description': mbti_recs.get('description', ''),
                'holland_code': holland_code,
                'mbti_type': mbti_type
            }

        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return {
                'jobs': [],
                'holland_code_description': '',
                'mbti_description': '',
                'holland_code': holland_code,
                'mbti_type': mbti_type,
                'error': str(e)
            }

    async def store_survey_response(
        self,
        survey_data: Dict,
        recommendations: Dict
    ) -> str:
        """
        Store survey response with recommendations in Firestore.
        
        Args:
            survey_data (Dict): Survey response data
            recommendations (Dict): Generated recommendations
            
        Returns:
            str: Document ID of stored response
        """
        try:
            # Combine survey data with recommendations
            response_data = {
                **survey_data,
                'recommendations': recommendations,
                'timestamp': firestore.SERVER_TIMESTAMP
            }

            # Store in Firestore
            doc_ref = await self.db.collection('survey_responses').add(response_data)
            logger.info(f"Survey response stored with ID: {doc_ref.id}")
            return doc_ref.id

        except Exception as e:
            logger.error(f"Error storing survey response: {str(e)}")
            raise

    async def get_survey_response(self, response_id: str) -> Optional[Dict]:
        """
        Retrieve a stored survey response by ID.
        
        Args:
            response_id (str): Document ID of the survey response
            
        Returns:
            Optional[Dict]: Survey response data if found, None otherwise
        """
        try:
            doc = await self.db.collection('survey_responses').document(response_id).get()
            return doc.to_dict() if doc.exists else None

        except Exception as e:
            logger.error(f"Error retrieving survey response: {str(e)}")
            return None
