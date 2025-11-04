"""
PDF processing utilities for RealiZe
Handles PDF text extraction and preprocessing
Made by: Amir Hafizi Bin Musa, UiTM Science Computer Student
"""

import PyPDF2
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Handles PDF text extraction and processing"""
    
    def __init__(self):
        self.supported_formats = ['.pdf']
    
    def extract_text(self, file_path: str) -> Optional[str]:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Extracted text or None if extraction fails
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Check if PDF has pages
                if len(pdf_reader.pages) == 0:
                    raise ValueError("PDF file has no pages")
                
                text_content = []
                
                # Extract text from each page
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text.strip():
                            text_content.append(page_text)
                    except Exception as e:
                        logger.warning(f"Error extracting text from page {page_num + 1}: {str(e)}")
                        continue
                
                # Combine all page texts
                full_text = "\n".join(text_content)
                
                # Clean and preprocess text
                cleaned_text = self._clean_text(full_text)
                
                logger.info(f"Successfully extracted {len(cleaned_text)} characters from PDF")
                return cleaned_text
                
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            return None
    
    def _clean_text(self, text: str) -> str:
        """
        Clean and preprocess extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove excessive whitespace and newlines
        import re
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters that might interfere with analysis
        text = re.sub(r'[^\w\s.,;:()/\-\'\"]', ' ', text)
        
        # Strip and normalize
        text = text.strip()
        
        return text
    
    def get_pdf_info(self, file_path: str) -> Dict[str, Any]:
        """
        Get basic information about the PDF file
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Dictionary containing PDF metadata
        """
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                info = {
                    'num_pages': len(pdf_reader.pages),
                    'file_size': os.path.getsize(file_path),
                    'is_encrypted': pdf_reader.is_encrypted
                }
                
                # Try to extract metadata
                if pdf_reader.metadata:
                    metadata = pdf_reader.metadata
                    info.update({
                        'title': metadata.get('/Title', 'Unknown'),
                        'author': metadata.get('/Author', 'Unknown'),
                        'subject': metadata.get('/Subject', 'Unknown'),
                        'creator': metadata.get('/Creator', 'Unknown')
                    })
                
                return info
                
        except Exception as e:
            logger.error(f"Error getting PDF info: {str(e)}")
            return {'num_pages': 0, 'file_size': 0, 'is_encrypted': False}