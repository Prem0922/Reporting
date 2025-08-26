# dbapi.py - Updated version with enhanced test results API
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import datetime
import traceback
import os
import json
from dotenv import load_dotenv
import uuid
import requests
import bcrypt
import jwt
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from twilio.rest import Client
import datetime
from werkzeug.utils import secure_filename
import base64

# Import PostgreSQL database manager
from database_postgresql import db

load_dotenv()

app = Flask(__name__)
CORS(app)

# File upload configuration
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'log'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_artifact_file(file, test_run_id, test_case_id):
    """Save uploaded artifact file and return the file path"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create unique filename with test run and case info
        unique_filename = f"{test_run_id}_{test_case_id}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        return filepath
    return None

# Swagger configuration
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Transit Management System Test Dashboard API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Swagger JSON endpoint
@app.route('/static/swagger.json')
def swagger_json():
    """Swagger JSON specification"""
    swagger_spec = {
        "openapi": "3.0.0",
        "info": {
            "title": "Transit Management System Test Dashboard API",
            "description": "API for managing test results, requirements, test cases, defects, and transit metrics",
            "version": "1.0.0",
            "contact": {
                "name": "API Support",
                "url": "http://localhost:5000/api/docs"
            }
        },
        "servers": [
            {
                "url": "http://localhost:5000",
                "description": "Development server"
            }
        ],
        "paths": {
            "/api/v1/results/test-runs": {
                "post": {
                    "summary": "Comprehensive Test Results API",
                    "description": "Process various types of test data including test runs, requirements, test cases, defects, test type summary, and transit metrics",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": ["customerId", "testRunId", "events"],
                                    "properties": {
                                        "customerId": {
                                            "type": "integer",
                                            "description": "Customer identifier (mandatory)"
                                        },
                                        "testRunId": {
                                            "type": "string",
                                            "description": "Test run identifier to group test cases (mandatory)"
                                        },
                                        "sourceSystem": {
                                            "type": "string",
                                            "description": "Source system (UI Navigator, ROBOT, etc.)",
                                            "default": "UI Navigator"
                                        },
                                        "events": {
                                            "type": "array",
                                            "description": "Array of test events",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "kind": {
                                                        "type": "string",
                                                        "enum": ["TEST_RUN", "REQUIREMENT", "TEST_CASE", "DEFECT", "TEST_TYPE_SUMMARY", "TRANSIT_METRICS"],
                                                        "description": "Type of event"
                                                    },
                                                    "testCase": {
                                                        "type": "object",
                                                        "properties": {
                                                            "id": {
                                                                "type": "string",
                                                                "description": "Test case identifier (mandatory for TEST_RUN)"
                                                            },
                                                            "title": {
                                                                "type": "string",
                                                                "description": "Test case title"
                                                            },
                                                            "component": {
                                                                "type": "string",
                                                                "description": "UI Navigator or POS"
                                                            }
                                                        }
                                                    },
                                                    "result": {
                                                        "type": "string",
                                                        "description": "Test result (Pass, Fail, etc.) - mandatory for TEST_RUN"
                                                    },
                                                    "executedBy": {
                                                        "type": "string",
                                                        "description": "Name of person/tool who executed the test - mandatory for TEST_RUN"
                                                    },
                                                    "observedTimeMs": {
                                                        "type": "integer",
                                                        "description": "Time taken for test execution in milliseconds"
                                                    },
                                                    "remarks": {
                                                        "type": "string",
                                                        "description": "Additional remarks (optional)"
                                                    },
                                                    "artifacts": {
                                                        "type": "array",
                                                        "description": "Array of artifacts (screenshots, logs, etc.)",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "type": {
                                                                    "type": "string",
                                                                    "description": "Type of artifact (excel, file path, screenshot, etc.)"
                                                                },
                                                                "uri": {
                                                                    "type": "string",
                                                                    "description": "URI or path to the artifact"
                                                                },
                                                                "description": {
                                                                    "type": "string",
                                                                    "description": "Description of the artifact"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                "example": {
                                    "customerId": 123,
                                    "testRunId": "RUN_001",
                                    "sourceSystem": "UI Navigator",
                                    "events": [
                                        {
                                            "kind": "TEST_RUN",
                                            "testCase": {
                                                "id": "TC_001",
                                                "title": "Login Test",
                                                "component": "UI Navigator"
                                            },
                                            "result": "Pass",
                                            "executedBy": "John Doe",
                                            "observedTimeMs": 1500,
                                            "remarks": "Test completed successfully",
                                            "artifacts": [
                                                {
                                                    "type": "screenshot",
                                                    "uri": "/screenshots/login_success.png",
                                                    "description": "Login success screenshot"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            },
                            "multipart/form-data": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "string",
                                            "description": "JSON data as string"
                                        },
                                        "file": {
                                            "type": "string",
                                            "format": "binary",
                                            "description": "Artifact file upload"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Test results processed successfully",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "accepted": {
                                                "type": "integer",
                                                "description": "Number of accepted events"
                                            },
                                            "duplicates": {
                                                "type": "integer",
                                                "description": "Number of duplicate events"
                                            },
                                            "failed": {
                                                "type": "integer",
                                                "description": "Number of failed events"
                                            },
                                            "testRunId": {
                                                "type": "string",
                                                "description": "Test run ID"
                                            },
                                            "customerId": {
                                                "type": "integer",
                                                "description": "Customer ID"
                                            },
                                            "items": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "status": {
                                                            "type": "string",
                                                            "enum": ["accepted", "duplicate", "failed"]
                                                        },
                                                        "runId": {
                                                            "type": "string"
                                                        },
                                                        "testCaseId": {
                                                            "type": "string"
                                                        },
                                                        "testRunId": {
                                                            "type": "string"
                                                        },
                                                        "result": {
                                                            "type": "string"
                                                        },
                                                        "executedBy": {
                                                            "type": "string"
                                                        },
                                                        "artifacts": {
                                                            "type": "integer"
                                                        },
                                                        "error": {
                                                            "type": "string"
                                                        },
                                                        "message": {
                                                            "type": "string"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "example": {
                                        "accepted": 1,
                                        "duplicates": 0,
                                        "failed": 0,
                                        "testRunId": "RUN_001",
                                        "customerId": 123,
                                        "items": [
                                            {
                                                "status": "accepted",
                                                "runId": "uuid-here",
                                                "testCaseId": "TC_001",
                                                "testRunId": "RUN_001",
                                                "result": "Pass",
                                                "executedBy": "John Doe",
                                                "artifacts": 1
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Bad request - validation error"
                        },
                        "500": {
                            "description": "Internal server error"
                        }
                    }
                },
                "get": {
                    "summary": "Get test results with filtering",
                    "description": "Retrieve test results with optional filtering by customer, test run, test case, result, etc.",
                    "parameters": [
                        {
                            "name": "customerId",
                            "in": "query",
                            "description": "Filter by customer ID",
                            "required": False,
                            "schema": {
                                "type": "integer"
                            }
                        },
                        {
                            "name": "testRunId",
                            "in": "query",
                            "description": "Filter by test run ID",
                            "required": False,
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "testCaseId",
                            "in": "query",
                            "description": "Filter by test case ID",
                            "required": False,
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "result",
                            "in": "query",
                            "description": "Filter by test result (Pass, Fail, etc.)",
                            "required": False,
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "sourceSystem",
                            "in": "query",
                            "description": "Filter by source system",
                            "required": False,
                            "schema": {
                                "type": "string"
                            }
                        },
                        {
                            "name": "limit",
                            "in": "query",
                            "description": "Number of results to return",
                            "required": False,
                            "schema": {
                                "type": "integer",
                                "default": 100
                            }
                        },
                        {
                            "name": "offset",
                            "in": "query",
                            "description": "Number of results to skip",
                            "required": False,
                            "schema": {
                                "type": "integer",
                                "default": 0
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Test results retrieved successfully"
                        }
                    }
                }
            },
            "/api/v1/results/test-runs/{testRunId}": {
                "get": {
                    "summary": "Get test run details",
                    "description": "Get all test cases for a specific test run with summary statistics",
                    "parameters": [
                        {
                            "name": "testRunId",
                            "in": "path",
                            "required": True,
                            "description": "Test run ID",
                            "schema": {
                                "type": "string"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Test run details retrieved successfully"
                        },
                        "404": {
                            "description": "Test run not found"
                        }
                    }
                }
            },
            "/api/v1/results/customers/{customerId}/test-runs": {
                "get": {
                    "summary": "Get customer test runs",
                    "description": "Get all test runs for a specific customer",
                    "parameters": [
                        {
                            "name": "customerId",
                            "in": "path",
                            "required": True,
                            "description": "Customer ID",
                            "schema": {
                                "type": "integer"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Customer test runs retrieved successfully"
                        }
                    }
                }
            }
        }
    }
    
    return jsonify(swagger_spec)

# --- Comprehensive Test Results API ---
@app.route('/api/v1/results/test-runs', methods=['POST'])
def process_test_results():
    """Comprehensive Test Results API - handles test runs with artifacts and proper validation"""
    try:
        # Check if request has files (multipart/form-data) or JSON
        if request.files:
            # Handle file upload with JSON data
            data = request.form.get('data')
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                return jsonify({"error": "Invalid JSON data"}), 400
        else:
            # Handle JSON-only request
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        customer_id = data.get('customerId')
        test_run_id = data.get('testRunId')
        source_system = data.get('sourceSystem', 'UI Navigator')
        events = data.get('events', [])
        
        if not customer_id:
            return jsonify({"error": "customerId is required"}), 400
        if not test_run_id:
            return jsonify({"error": "testRunId is required"}), 400
        if not events:
            return jsonify({"error": "No events provided"}), 400
        
        accepted = 0
        duplicates = 0
        failed = 0
        items = []
        
        for event in events:
            try:
                event_kind = event.get('kind', '').upper()
                
                if event_kind == 'TEST_RUN':
                    result = process_test_run_event_v2(event, customer_id, test_run_id, source_system, request.files)
                elif event_kind == 'REQUIREMENT':
                    result = process_requirement_event(event, customer_id, source_system)
                elif event_kind == 'TEST_CASE':
                    result = process_test_case_event(event, customer_id, source_system)
                elif event_kind == 'DEFECT':
                    result = process_defect_event(event, customer_id, source_system)
                elif event_kind == 'TEST_TYPE_SUMMARY':
                    result = process_test_type_summary_event(event, customer_id, source_system)
                elif event_kind == 'TRANSIT_METRICS':
                    result = process_transit_metrics_event(event, customer_id, source_system)
                else:
                    result = {
                        'status': 'failed',
                        'error': f'Unknown event kind: {event_kind}'
                    }
                
                if result['status'] == 'accepted':
                    accepted += 1
                elif result['status'] == 'duplicate':
                    duplicates += 1
                else:
                    failed += 1
                
                items.append(result)
                
            except Exception as e:
                failed += 1
                print(f"Error processing event: {e}")
                items.append({
                    'status': 'failed',
                    'error': str(e),
                    'eventKind': event.get('kind', 'Unknown')
                })
        
        response = {
            'accepted': accepted,
            'duplicates': duplicates,
            'failed': failed,
            'items': items,
            'testRunId': test_run_id,
            'customerId': customer_id
        }
        
        return jsonify(response), 201
        
    except Exception as e:
        print(f"Error processing test results: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def process_test_run_event_v2(event, customer_id, test_run_id, source_system, files=None):
    """Process a test run event with enhanced validation and file support"""
    try:
        test_case = event.get('testCase', {})
        test_case_id = str(test_case.get('id', ''))
        
        # Validate required fields
        if not test_case_id:
            return {
                'status': 'failed',
                'error': 'testCase.id is required'
            }
        
        if not event.get('result'):
            return {
                'status': 'failed',
                'error': 'result is required'
            }
        
        if not event.get('executedBy'):
            return {
                'status': 'failed',
                'error': 'executedBy is required'
            }
        
        # Process artifacts
        artifacts = []
        if event.get('artifacts'):
            for artifact in event['artifacts']:
                artifacts.append({
                    'type': artifact.get('type', 'unknown'),
                    'uri': artifact.get('uri', ''),
                    'description': artifact.get('description', '')
                })
        
        # Handle file uploads if present
        if files:
            for file_key, file_obj in files.items():
                if file_obj and file_obj.filename:
                    filepath = save_artifact_file(file_obj, test_run_id, test_case_id)
                    if filepath:
                        artifacts.append({
                            'type': 'uploaded_file',
                            'uri': filepath,
                            'filename': file_obj.filename,
                            'description': f'Uploaded file: {file_obj.filename}'
                        })
        
        # Create test run data
        test_run_data = {
            'run_id': str(uuid.uuid4()),
            'test_run_id': test_run_id,
            'customer_id': customer_id,
            'source_system': source_system,
            'test_case_id': test_case_id,
            'execution_date': event.get('executionDate', datetime.datetime.now().isoformat()),
            'result': event.get('result'),
            'observed_time': event.get('observedTimeMs', 0),
            'executed_by': event.get('executedBy'),
            'remarks': event.get('remarks', ''),
            'artifacts': json.dumps(artifacts) if artifacts else None
        }
        
        # Check for duplicates (same test run, same test case)
        existing_runs = db.get_test_runs_by_run_id(test_run_id)
        duplicate_found = any(
            run.get('test_case_id') == test_case_id
            for run in existing_runs
        )
        
        if duplicate_found:
            return {
                'status': 'duplicate',
                'runId': test_run_data['run_id'],
                'testCaseId': test_case_id,
                'message': f'Test case {test_case_id} already exists in test run {test_run_id}'
            }
        
        if db.create_test_run(test_run_data):
            return {
                'status': 'accepted',
                'runId': test_run_data['run_id'],
                'testCaseId': test_case_id,
                'testRunId': test_run_id,
                'result': test_run_data['result'],
                'executedBy': test_run_data['executed_by'],
                'artifacts': len(artifacts)
            }
        else:
            return {
                'status': 'failed',
                'runId': test_run_data['run_id'],
                'testCaseId': test_case_id,
                'error': 'Failed to create test run'
            }
            
    except Exception as e:
        return {
            'status': 'failed',
            'error': str(e)
        }

# --- Test Results Reading APIs ---
@app.route('/api/v1/results/test-runs', methods=['GET'])
def get_test_results():
    """Get test results with filtering options"""
    try:
        # Query parameters
        customer_id = request.args.get('customerId', type=int)
        test_run_id = request.args.get('testRunId')
        test_case_id = request.args.get('testCaseId')
        result = request.args.get('result')  # Pass, Fail, etc.
        source_system = request.args.get('sourceSystem')
        limit = request.args.get('limit', 100, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Get all test runs
        test_runs = db.get_all_test_runs()
        
        # Apply filters
        filtered_runs = []
        for run in test_runs:
            if customer_id and run.get('customer_id') != customer_id:
                continue
            if test_run_id and run.get('test_run_id') != test_run_id:
                continue
            if test_case_id and run.get('test_case_id') != test_case_id:
                continue
            if result and run.get('result') != result:
                continue
            if source_system and run.get('source_system') != source_system:
                continue
            filtered_runs.append(run)
        
        # Apply pagination
        total_count = len(filtered_runs)
        paginated_runs = filtered_runs[offset:offset + limit]
        
        response = {
            'testRuns': paginated_runs,
            'pagination': {
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'hasMore': offset + limit < total_count
            },
            'filters': {
                'customerId': customer_id,
                'testRunId': test_run_id,
                'testCaseId': test_case_id,
                'result': result,
                'sourceSystem': source_system
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error getting test results: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/results/test-runs/<test_run_id>', methods=['GET'])
def get_test_run_by_id(test_run_id):
    """Get all test cases for a specific test run"""
    try:
        test_runs = db.get_test_runs_by_run_id(test_run_id)
        
        if not test_runs:
            return jsonify({"error": f"Test run {test_run_id} not found"}), 404
        
        # Group by test case and calculate summary
        test_cases = {}
        summary = {
            'total': len(test_runs),
            'passed': 0,
            'failed': 0,
            'skipped': 0,
            'totalTime': 0
        }
        
        for run in test_runs:
            test_case_id = run.get('test_case_id')
            if test_case_id not in test_cases:
                test_cases[test_case_id] = {
                    'testCaseId': test_case_id,
                    'result': run.get('result'),
                    'executedBy': run.get('executed_by'),
                    'executionDate': run.get('execution_date'),
                    'observedTime': run.get('observed_time'),
                    'remarks': run.get('remarks'),
                    'artifacts': run.get('artifacts')
                }
            
            # Update summary
            result = run.get('result', '').lower()
            if 'pass' in result:
                summary['passed'] += 1
            elif 'fail' in result:
                summary['failed'] += 1
            else:
                summary['skipped'] += 1
            
            summary['totalTime'] += run.get('observed_time', 0)
        
        response = {
            'testRunId': test_run_id,
            'customerId': test_runs[0].get('customer_id') if test_runs else None,
            'sourceSystem': test_runs[0].get('source_system') if test_runs else None,
            'summary': summary,
            'testCases': list(test_cases.values())
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error getting test run: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/results/customers/<int:customer_id>/test-runs', methods=['GET'])
def get_customer_test_runs(customer_id):
    """Get all test runs for a customer"""
    try:
        test_runs = db.get_test_runs_by_customer(customer_id)
        
        # Group by test run ID
        test_run_groups = {}
        for run in test_runs:
            run_id = run.get('test_run_id')
            if run_id not in test_run_groups:
                test_run_groups[run_id] = {
                    'testRunId': run_id,
                    'sourceSystem': run.get('source_system'),
                    'totalCases': 0,
                    'passed': 0,
                    'failed': 0,
                    'skipped': 0,
                    'totalTime': 0,
                    'lastExecution': run.get('execution_date')
                }
            
            group = test_run_groups[run_id]
            group['totalCases'] += 1
            group['totalTime'] += run.get('observed_time', 0)
            
            result = run.get('result', '').lower()
            if 'pass' in result:
                group['passed'] += 1
            elif 'fail' in result:
                group['failed'] += 1
            else:
                group['skipped'] += 1
        
        response = {
            'customerId': customer_id,
            'testRuns': list(test_run_groups.values()),
            'totalTestRuns': len(test_run_groups)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error getting customer test runs: {e}")
        return jsonify({"error": str(e)}), 500

# Placeholder functions for other event types (to be implemented)
def process_requirement_event(event, customer_id, source_system):
    """Process a requirement event"""
    return {'status': 'accepted', 'message': 'Requirement processed'}

def process_test_case_event(event, customer_id, source_system):
    """Process a test case event"""
    return {'status': 'accepted', 'message': 'Test case processed'}

def process_defect_event(event, customer_id, source_system):
    """Process a defect event"""
    return {'status': 'accepted', 'message': 'Defect processed'}

def process_test_type_summary_event(event, customer_id, source_system):
    """Process a test type summary event"""
    return {'status': 'accepted', 'message': 'Test type summary processed'}

def process_transit_metrics_event(event, customer_id, source_system):
    """Process a transit metrics event"""
    return {'status': 'accepted', 'message': 'Transit metrics processed'}

# Health check endpoints
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "version": "1.0.0",
        "database": "PostgreSQL"
    }), 200

@app.route('/api/v1/health', methods=['GET'])
def health_check_v1():
    """Health check endpoint - REST API v1"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "version": "1.0.0",
        "database": "PostgreSQL",
        "endpoints": {
            "test_results": "/api/v1/results/test-runs",
            "swagger_docs": "/api/docs"
        }
    }), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
