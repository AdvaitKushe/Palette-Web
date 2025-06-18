from flask import Flask, request, Response, jsonify
from docx import Document
from flask_cors import CORS
from openai import OpenAI
from google import genai
from google.genai import types
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
from pypdf import PdfReader
import anthropic
import json
import socket
import base64
import os
from dotenv import load_dotenv
from pathlib import Path
from io import BytesIO


env_path =  './.env'

# Load environment variables from the parent directory
load_dotenv(dotenv_path=env_path)


# Create credentials dictionary from environment variables
cred_dict = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n") if os.getenv("FIREBASE_PRIVATE_KEY") else None,
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL")
}

cred = credentials.Certificate(cred_dict)

try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already initialized
    pass

db = firestore.client()


app = Flask(__name__)
CORS(app, origins=["https://www.palette-chat.com"])
@app.route('/')
def index():
    return "Hello World " + socket.gethostname()



@app.route('/api/stream', methods= ['GET','POST'])
def stream():
    message = request.json['prompt']
    id = request.json['id']
    context = request.json['context']

    file_data = request.json['files']
    search = request.json['search']
   
    model = request.json['model']
    company = request.json['company']

    db = firestore.client()
    doc_ref = db.collection("users").document(id)

    doc = doc_ref.get()
    # Access the settings field from the document
    if doc.exists:
        doc_data = doc.to_dict()
        settings = doc_data.get('settings')  # or doc_data['settings'] if you're sure it exists
    else:
        print("Document does not exist")
        return Response("Error: User settings not found", mimetype='text/plain')

    # Check for API keys
    if company == 'OpenAI' and (not settings.get('OpenAI') or settings['OpenAI'].strip() == ''):
        return Response("Please provide a valid OpenAI API key in settings to begin chatting", mimetype='text/plain')
    elif company == 'Anthropic' and (not settings.get('Anthropic') or settings['Anthropic'].strip() == ''):
        return Response("Please provide a valid Anthropic API key in settings to begin chatting", mimetype='text/plain')
    elif company == 'Google' and (not settings.get('Gemini') or settings['Gemini'].strip() == ''):
        return Response("Please provide a valid Gemini API key in settings to begin chatting", mimetype='text/plain')

    if file_data:
    
        file_data = handle_file_load(file_data, message, model, company, context, settings)
        type_file = file_data['all_paths'][0].split('.')[-1]
        print("type_file:", type_file)
        context.append({"files": file_data['all_text']})
        
        if type_file == 'jpeg' or type_file == 'png' or type_file == 'gif':
            return Response(file_data['all_text'], mimetype='text/plain')

    if company == 'OpenAI':
       # return "Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys."
        return stream_openai(message, context, file_data, model, settings)
    elif company == 'Anthropic':
        return stream_anthropic(message, context, file_data, model, settings) if not search else stream_anthropic_search(message, context, file_data, model, settings)
    elif company == 'Google':
        return stream_gemini(message, context, file_data, model, settings) if not search else stream_gemini_search(message, context, file_data, model, settings)


def stream_anthropic(message,  context, file_data, model, settings):
    try:
        client = anthropic.Anthropic(
                # defaults to os.environ.get("ANTHROPIC_API_KEY")
                api_key=settings['Anthropic'],
        )
    except Exception as e:
        print("Error initializing Anthropic client:", str(e))
        return str(e.response.json()['error']['message'])

    def generate():
        try:    
            with client.messages.stream(
                
                messages=[{"role": "user", "content": "user prompt:" + message + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context) }],
                model=model,
                max_tokens=1000,
                
            ) as stream:
                for text in stream.text_stream:
                    
                    yield text
        except Exception as e:
            print("Error in generate:", str(e))
            yield f"Error: {str(e.response.json()['error']['message'])}"

    return Response(generate(), mimetype='text/plain')

def stream_anthropic_search(message,  context, file_data, model, settings):
    try:
        client = anthropic.Anthropic(
                # defaults to os.environ.get("ANTHROPIC_API_KEY")
                api_key=settings['Anthropic'],
        )
    except Exception as e:
        print("Error initializing Anthropic client:", str(e))
        return str(e.response.json()['error']['message'])

    def generate():
        try:    
            with client.messages.stream(
                
                messages=[{"role": "user", "content": "user prompt:" + message + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context) }],
                model=model,
                max_tokens=1000,
                tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        
    }]
                
            ) as stream:
                for text in stream.text_stream:
                    
                    yield text
        except Exception as e:
            print("Error in generate:", str(e))
            yield f"Error: {str(e.response.json()['error']['message'])}"

    return Response(generate(), mimetype='text/plain')

def stream_gemini_search(message, context, file_data, model, settings):
   
    try:
        client = genai.Client(api_key=settings['Gemini'])
        google_search_tool = Tool(
         google_search = GoogleSearch()
        )
    except Exception as e:
        print("Error initializing Gemini client:", str(e))
        return str(e.response.json()['error']['message'])

    def generate():
       
        try:
            # Remove caching and directly stream the response
            stream = client.models.generate_content_stream(
                model=model,
                contents=[message + ". Provide all sources and links to the sources in the response. Context (only use the context for this chat history and do not say anything like based on the context):" + str(context)],
                config=GenerateContentConfig(
        tools=[google_search_tool],
        response_modalities=["TEXT"],
    )
            )
            for chunk in stream:
               
                yield chunk.text
                
        except Exception as e:
            print("Error in generate:", str(e))
            yield f"Error: {str(e.response.json()['error']['message'])}"
    return Response(generate(), mimetype='text/plain')

def stream_gemini(message, context, file_data, model, settings):
   
    try:
        client = genai.Client(api_key=settings['Gemini'])
    except Exception as e:
        print("Error initializing Gemini client:", str(e))
        return str(e.response.json()['error']['message'])

    def generate():
       

        try:
            # Remove caching and directly stream the response
            stream = client.models.generate_content_stream(
                model=model,
                contents=[message + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context)]
            )
            for chunk in stream:
               
                yield chunk.text
                
        except Exception as e:
            print("Error in generate:", str(e))
            yield f"Error: {str(e.response.json()['error']['message'])}"
    return Response(generate(), mimetype='text/plain')



    

def stream_openai(message,  context, file_data, model, settings):
    # Capture the message from the request before entering generator
    #return Response("Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys.", mimetype='text/plain')
    try:
        openai_client = OpenAI(api_key=settings['OpenAI'])
    except Exception as e:
        print("Error initializing OpenAI client:", str(e))
        return str(e.response.json()['error']['message'])
    
    def generate():
        try:
            stream = openai_client.chat.completions.create(
                model=model,
                      
                messages=[{"role": "user", "content": "user prompt:" + message + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context)}],  # Use captured message
                stream=True,
            )
        except Exception as e:
            print("Error in OpenAI stream:", str(e))
            yield f"Error: {str(e.response.json()['error']['message'])}"
            
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
             
                
                #print(content, end='', flush=True)  # Print each chunk as it arrives
                yield content
    
    print("Starting stream response:")
  
    return generate(), {"Content-Type": "text/plain"}


class FileProcessor:
    ALLOWED_EXTENSIONS = {
        'application/pdf': '.pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt'
    }

    @staticmethod
    def get_mime_type(base64_data):
        # Extract MIME type from data URI
        try:
            mime_type = base64_data.split(';')[0].split(':')[1]
            return mime_type
        except IndexError:
            return None

    @staticmethod
    def get_file_extension(mime_type):
        return FileProcessor.ALLOWED_EXTENSIONS.get(mime_type)

    @staticmethod
    def process_file(base64_data, file_extension):
        try:
            # Remove data URI prefix and decode
            if ',' in base64_data:
                file_data = base64.b64decode(base64_data.split(',')[1])
            else:
                file_data = base64.b64decode(base64_data)

            # Process file data in memory
            file_stream = BytesIO(file_data)
            
            # If you need to process the file (e.g., image processing)
            # You can do it here with file_stream
            
            # If you need to return the processed data as base64
            processed_data = base64.b64encode(file_stream.getvalue()).decode('utf-8')
            return processed_data
            
            # Or if you need to return the raw bytes
            # return file_stream.getvalue()
        except Exception as e:
            raise Exception(f"Error processing file: {str(e)}")


def handle_file_load(raw_file_data, prompt, model, company, context, settings):
    allowed_file_data = raw_file_data
   
    

    all_text = []
    all_paths = []
    for file in allowed_file_data:
        file = file['imageData']
        if file:
          
            file_specs = upload_file(file)
         
            if file_specs['file_type'] == 'application/pdf':
                text = extract_pdf_text(file)
                all_text.append(text['text'])
            elif file_specs['file_type'] == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                text = extract_docx_text(file)
                print("text:", text)
                all_text.append(text['text'])
            else:
                text = handle_image(raw_file_data, model, company, prompt, context, settings)
                all_text.append(text)
            all_paths.append(file_specs['file_path'])
            print("file_specs['file_path']:", file_specs['file_path'])
            
            
    
    return {"message": "Files uploaded successfully", "all_text": all_text, "all_paths": all_paths}

def handle_image(img, model, company, prompt, context, settings):
    print("entered handle_image")
    

    if company == 'OpenAI':
        return handle_image_openai(img, model, prompt, context, settings)
    elif company == 'Anthropic':
        return handle_image_anthropic(img, model, prompt, context, settings)
    elif company == 'Google':
        return handle_image_gemini(img, model, prompt, context, settings)


def handle_image_openai(img, model, prompt, context, settings):
    client = OpenAI(api_key=settings['OpenAI'])
   
    completion = client.chat.completions.create(
    model=model,
  
    messages=[
        {
            "role": "user",
            "content": [
                { "type": "text", "text": prompt + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context) },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": img[0]['imageData'],
                    },
                },
            ],
        }
    ],
    )


   
    return completion.choices[0].message.content

def handle_image_anthropic(img, model, prompt, context, settings):
    client = anthropic.Anthropic(api_key=settings['Anthropic'])
    
    # Extract base64 data from the data URI
    image_data = img[0]['imageData']
    if image_data.startswith('data:'):
        # Extract media type from data URI
        media_type = image_data.split(';')[0].split(':')[1]
        # Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        base64_data = image_data.split(',')[1]
    else:
        base64_data = image_data
        media_type = "image/jpeg"  # Default fallback
    
    message = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": base64_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context)
                    }
                ],
            }
        ],
    )
   
    return message.content[0].text


def handle_image_gemini(img, model, prompt, context, settings):
    image_data = img[0]['imageData']
    if image_data.startswith('data:'):
        # Extract media type from data URI
        media_type = image_data.split(';')[0].split(':')[1]
        # Remove the data URI prefix (e.g., "data:image/jpeg;base64,")
        base64_data = image_data.split(',')[1]
    else:
        base64_data = image_data
        media_type = "image/jpeg"  # Default fallback


    client = genai.Client(api_key=settings['Gemini'])
    response = client.models.generate_content(
    model=model,
    contents=[
      types.Part.from_bytes(
        data=base64_data,
        mime_type=media_type,
      ),
      prompt + ". Context (only use the context for this chat history and do not say anything like based on the context):" + str(context)
    ]
  )

  
    return response.text

def upload_file(file):
    try:
        # Get the base64 data from request
        
        data = file
        print(data)
        if not data:
            return 

        # Get MIME type and file extension
        mime_type = FileProcessor.get_mime_type(data)
        if not mime_type:
            return 

        file_extension = FileProcessor.get_file_extension(mime_type)
        if not file_extension:
            return 

        # Process and save the file
        filename = FileProcessor.process_file(data, file_extension)

        # Here you can add specific processing based on file type
        result = {
            'message': 'File successfully processed',
            'file_path': filename,
            'file_type': mime_type
        }

        # Add file-specific processing
        if file_extension == '.pdf':
            # Process PDF (example: use PyPDF2 or pdfplumber)
            result['processor'] = 'PDF processor'
        elif file_extension == '.docx':
            # Process DOCX (example: use python-docx)
            result['processor'] = 'DOCX processor'
        elif file_extension in ['.jpg', '.png', '.gif']:
            # Process images (example: use Pillow)
            result['processor'] = 'Image processor'
        elif file_extension == '.txt':
            # Process text files
            result['processor'] = 'Text processor'
        
        return result

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def extract_pdf_text(file_data):
    print("ENTERED EXTRACT PDF TEXT")
    from io import BytesIO
    # Handle base64 encoded string if needed
    if isinstance(file_data, str) and file_data.startswith('data:'):
        import base64
        file_data = base64.b64decode(file_data.split(',')[1])
    reader = PdfReader(BytesIO(file_data))
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    return {"text": text}

def extract_docx_text(file_data):
    print("ENTERED EXTRACT DOCX TEXT")
    from io import BytesIO
    # Handle base64 encoded string if needed
    if isinstance(file_data, str) and file_data.startswith('data:'):
        import base64
        file_data = base64.b64decode(file_data.split(',')[1])
    doc = Document(BytesIO(file_data))
    text = ''
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return {"text": text}



@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/test', methods=['GET','POST'])
def test():
    with open('./mock/config.json', 'r') as f:
        config = json.load(f)
    openai_client = OpenAI(api_key=config['OpenAI'])
    prompt = """
Write a bash script that takes a matrix represented as a string with 
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

    response = openai_client.chat.completions.create(
    model="o1-preview",
    messages=[
        {
            "role": "user", 
            "content": prompt
        }
    ]
    )

   
    return jsonify({"response": response.choices[0].message.content, "company": "openai"}), 200
 

def limit_context(context_array, max_chars=2000):
    total_chars = 0
    limited_context = []
    
    for item in context_array:
        prompt_len = 0
        response_len = 0
        files_len = 0
        if 'prompt' in item:
            prompt_len = len(str(item['prompt']))
        if 'response' in item:
            response_len = len(str(item['response']))
        if 'files' in item:
            files_len = len(str(item['files']))
            

        item_length = prompt_len + response_len + files_len
        if total_chars + item_length <= max_chars:
            limited_context.append(item)
            total_chars += item_length
        else:
            fill_chars = max_chars - total_chars
    
    return limited_context

if __name__ == '__main__':
    app.run()

