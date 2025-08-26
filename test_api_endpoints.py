#!/usr/bin/env python3
"""
Test script for Reporting Application REST API v1 endpoints
This script tests all the new REST API endpoints to ensure they work correctly.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
API_VERSION = "v1"

def test_health_check():
    """Test health check endpoints"""
    print("🔍 Testing Health Check Endpoints...")
    
    # Test basic health check
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"  Basic Health Check: {response.status_code}")
    if response.status_code == 200:
        print(f"    Response: {response.json()}")
    
    # Test detailed health check
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/health")
    print(f"  Detailed Health Check: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"    Status: {data.get('status')}")
        print(f"    Database: {data.get('database')}")
        print(f"    Endpoints: {len(data.get('endpoints', {}))} available")

def test_requirements_api():
    """Test Requirements API endpoints"""
    print("\n🔍 Testing Requirements API...")
    
    # Test GET all requirements
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/requirements")
    print(f"  GET All Requirements: {response.status_code}")
    if response.status_code == 200:
        requirements = response.json()
        print(f"    Found {len(requirements)} requirements")
    
    # Test POST new requirement
    new_requirement = {
        "requirement_id": "TEST-REQ-001",
        "title": "Test Requirement for API Testing",
        "description": "This is a test requirement created via API",
        "component": "API Test",
        "priority": "Medium",
        "status": "Draft",
        "jira_id": "TEST-123"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/requirements",
        json=new_requirement,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Requirement: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Requirement created successfully")
    
    # Test GET requirement by ID
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/requirements/TEST-REQ-001")
    print(f"  GET Requirement by ID: {response.status_code}")
    if response.status_code == 200:
        print("    ✅ Requirement retrieved successfully")

def test_test_cases_api():
    """Test Test Cases API endpoints"""
    print("\n🔍 Testing Test Cases API...")
    
    # Test GET all test cases
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/test-cases")
    print(f"  GET All Test Cases: {response.status_code}")
    if response.status_code == 200:
        test_cases = response.json()
        print(f"    Found {len(test_cases)} test cases")
    
    # Test POST new test case
    new_test_case = {
        "test_case_id": "TEST-TC-001",
        "title": "Test Case for API Testing",
        "type": "Functional",
        "component": "API Test",
        "requirement_id": "TEST-REQ-001",
        "status": "Active",
        "created_by": "api_test_user",
        "pre_condition": "API is running",
        "test_steps": "1. Send POST request\n2. Verify response",
        "expected_result": "Test case created successfully"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/test-cases",
        json=new_test_case,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Test Case: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Test case created successfully")
    
    # Test GET test case by ID
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/test-cases/TEST-TC-001")
    print(f"  GET Test Case by ID: {response.status_code}")
    if response.status_code == 200:
        print("    ✅ Test case retrieved successfully")

def test_test_runs_api():
    """Test Test Runs API endpoints"""
    print("\n🔍 Testing Test Runs API...")
    
    # Test GET all test runs
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/test-runs")
    print(f"  GET All Test Runs: {response.status_code}")
    if response.status_code == 200:
        test_runs = response.json()
        print(f"    Found {len(test_runs)} test runs")
    
    # Test POST new test run
    new_test_run = {
        "run_id": "TEST-RUN-001",
        "test_case_id": "TEST-TC-001",
        "execution_date": datetime.now().isoformat(),
        "result": "Pass",
        "observed_time": 1500,
        "executed_by": "api_test_robot",
        "remarks": "API test execution successful"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/test-runs",
        json=new_test_run,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Test Run: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Test run created successfully")
    
    # Test POST bulk test runs
    bulk_test_runs = {
        "customerId": 101,
        "sourceSystem": "API_TEST",
        "events": [
            {
                "kind": "TEST_RUN",
                "testCase": {
                    "id": 5501,
                    "title": "API Test Case 1",
                    "component": "API"
                },
                "result": "Pass",
                "executionDate": datetime.now().isoformat(),
                "observedTimeMs": 842,
                "executedBy": "api_test_robot",
                "remarks": "Bulk test 1",
                "artifacts": [
                    {"type": "log", "uri": "s3://test/logs/test1.log"}
                ]
            },
            {
                "kind": "TEST_RUN",
                "testCase": {
                    "id": 5502,
                    "title": "API Test Case 2",
                    "component": "API"
                },
                "result": "Fail",
                "executionDate": datetime.now().isoformat(),
                "observedTimeMs": 1200,
                "executedBy": "api_test_robot",
                "remarks": "Bulk test 2",
                "artifacts": [
                    {"type": "screenshot", "uri": "s3://test/screenshots/test2.png"}
                ]
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/test-runs/bulk",
        json=bulk_test_runs,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST Bulk Test Runs: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        print(f"    ✅ Bulk test runs processed: {data.get('accepted')} accepted, {data.get('failed')} failed")

def test_defects_api():
    """Test Defects API endpoints"""
    print("\n🔍 Testing Defects API...")
    
    # Test GET all defects
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/defects")
    print(f"  GET All Defects: {response.status_code}")
    if response.status_code == 200:
        defects = response.json()
        print(f"    Found {len(defects)} defects")
    
    # Test POST new defect
    new_defect = {
        "defect_id": "TEST-DEF-001",
        "title": "API Test Defect",
        "severity": "Medium",
        "status": "Open",
        "test_case_id": "TEST-TC-001",
        "reported_by": "api_test_user"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/defects",
        json=new_defect,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Defect: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Defect created successfully")

def test_test_type_summary_api():
    """Test Test Type Summary API endpoints"""
    print("\n🔍 Testing Test Type Summary API...")
    
    # Test GET all test type summaries
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/test-type-summary")
    print(f"  GET All Test Type Summaries: {response.status_code}")
    if response.status_code == 200:
        summaries = response.json()
        print(f"    Found {len(summaries)} test type summaries")
    
    # Test POST new test type summary
    new_summary = {
        "test_type": "API Test",
        "metrics": "Pass Rate",
        "expected": "95%",
        "actual": "100%",
        "status": "Above Target",
        "test_date": datetime.now().strftime("%Y-%m-%d")
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/test-type-summary",
        json=new_summary,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Test Type Summary: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Test type summary created successfully")

def test_transit_metrics_api():
    """Test Transit Metrics API endpoints"""
    print("\n🔍 Testing Transit Metrics API...")
    
    # Test GET all transit metrics
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/transit-metrics")
    print(f"  GET All Transit Metrics: {response.status_code}")
    if response.status_code == 200:
        metrics = response.json()
        print(f"    Found {len(metrics)} transit metrics")
    
    # Test POST new transit metric
    new_metric = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "fvm_transactions": 100,
        "gate_taps": 200,
        "bus_taps": 150,
        "success_rate_gate": 98.5,
        "success_rate_bus": 97.2,
        "avg_response_time": 850,
        "defect_count": 2,
        "notes": "API test metrics"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/transit-metrics",
        json=new_metric,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST New Transit Metric: {response.status_code}")
    if response.status_code == 201:
        print("    ✅ Transit metric created successfully")

def test_error_handling():
    """Test error handling"""
    print("\n🔍 Testing Error Handling...")
    
    # Test invalid requirement ID
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/requirements/INVALID-ID")
    print(f"  GET Invalid Requirement ID: {response.status_code}")
    if response.status_code == 404:
        print("    ✅ 404 error handled correctly")
    
    # Test invalid test case ID
    response = requests.get(f"{BASE_URL}/api/{API_VERSION}/test-cases/INVALID-ID")
    print(f"  GET Invalid Test Case ID: {response.status_code}")
    if response.status_code == 404:
        print("    ✅ 404 error handled correctly")
    
    # Test invalid POST data
    invalid_data = {"invalid_field": "invalid_value"}
    response = requests.post(
        f"{BASE_URL}/api/{API_VERSION}/requirements",
        json=invalid_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"  POST Invalid Data: {response.status_code}")
    if response.status_code == 400:
        print("    ✅ 400 error handled correctly")

def main():
    """Main test function"""
    print("🚀 Starting Reporting Application API v1 Tests")
    print("=" * 60)
    
    try:
        # Test all endpoints
        test_health_check()
        test_requirements_api()
        test_test_cases_api()
        test_test_runs_api()
        test_defects_api()
        test_test_type_summary_api()
        test_transit_metrics_api()
        test_error_handling()
        
        print("\n" + "=" * 60)
        print("✅ All API tests completed successfully!")
        print("\n📚 Next steps:")
        print("1. Access Swagger UI: http://localhost:5000/api/docs")
        print("2. Check API documentation: API_DOCUMENTATION.md")
        print("3. Use curl commands from the documentation")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        print("   Make sure the Flask server is running on http://localhost:5000")
        print("   Run: python dbapi.py")
    except Exception as e:
        print(f"❌ Error during testing: {e}")

if __name__ == "__main__":
    main()
