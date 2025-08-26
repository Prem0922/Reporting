#!/usr/bin/env python3
"""
Comprehensive Test Results API Test Script

This script demonstrates how to use the new comprehensive Test Results API
that can handle all types of test data including:
- Test Runs
- Requirements
- Test Cases
- Defects
- Test Type Summary
- Transit Metrics

Usage:
    python test_comprehensive_api.py

Make sure your Flask backend is running on http://localhost:5000
"""

import requests
import json
import datetime
from typing import Dict, List, Any

# API Configuration
BASE_URL = "http://localhost:5000"
API_ENDPOINT = f"{BASE_URL}/api/v1/results/test-runs"

def create_test_run_event(test_case_id: int, title: str, component: str, result: str = "Pass") -> Dict[str, Any]:
    """Create a test run event"""
    return {
        "kind": "TEST_RUN",
        "testCase": {
            "id": test_case_id,
            "title": title,
            "component": component
        },
        "result": result,
        "executionDate": datetime.datetime.now().isoformat(),
        "observedTimeMs": 842,
        "executedBy": "robot-alpha",
        "remarks": "OK",
        "artifacts": [
            {"type": "screenshot", "uri": f"s3://qa/runs/{test_case_id}/ok.png"},
            {"type": "log", "uri": f"s3://qa/runs/{test_case_id}/log.txt"}
        ]
    }

def create_requirement_event(requirement_id: str, title: str, component: str) -> Dict[str, Any]:
    """Create a requirement event"""
    return {
        "kind": "REQUIREMENT",
        "requirementId": requirement_id,
        "title": title,
        "description": f"Requirement for {component} functionality",
        "component": component,
        "priority": "High",
        "status": "Draft",
        "jiraId": f"JIRA-{requirement_id}"
    }

def create_test_case_event(test_case_id: str, title: str, component: str) -> Dict[str, Any]:
    """Create a test case event"""
    return {
        "kind": "TEST_CASE",
        "testCaseId": test_case_id,
        "title": title,
        "type": "Feature",
        "status": "Draft",
        "component": component,
        "requirementId": f"REQ-{component}-001",
        "createdBy": "test-engineer",
        "createdAt": datetime.datetime.now().isoformat(),
        "preCondition": f"System {component} is operational",
        "testSteps": "1. Navigate to component\n2. Execute test scenario\n3. Verify results",
        "expectedResult": "Test passes successfully"
    }

def create_defect_event(defect_id: str, title: str, component: str, test_case_id: str) -> Dict[str, Any]:
    """Create a defect event"""
    return {
        "kind": "DEFECT",
        "defectId": defect_id,
        "title": title,
        "description": f"Defect found in {component} during testing",
        "severity": "Medium",
        "priority": "High",
        "status": "Open",
        "component": component,
        "testCaseId": test_case_id,
        "reportedBy": "test-robot",
        "reportedDate": datetime.datetime.now().isoformat()
    }

def create_test_type_summary_event(test_type: str, metrics: str) -> Dict[str, Any]:
    """Create a test type summary event"""
    return {
        "kind": "TEST_TYPE_SUMMARY",
        "testType": test_type,
        "metrics": metrics,
        "expected": "95%",
        "actual": "92%",
        "status": "Pass",
        "testDate": datetime.datetime.now().isoformat()
    }

def create_transit_metrics_event(date: str) -> Dict[str, Any]:
    """Create a transit metrics event"""
    return {
        "kind": "TRANSIT_METRICS",
        "date": date,
        "fvmTransactions": 1500,
        "successRateGate": 98.5,
        "successRateBus": 97.2,
        "successRateStation": 99.1
    }

def send_test_results(events: List[Dict[str, Any]], customer_id: int = 101, source_system: str = "ROBOT") -> Dict[str, Any]:
    """Send test results to the API"""
    payload = {
        "customerId": customer_id,
        "sourceSystem": source_system,
        "events": events
    }
    
    try:
        print(f"🚀 Sending {len(events)} events to {API_ENDPOINT}")
        print(f"📋 Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(API_ENDPOINT, json=payload, headers={'Content-Type': 'application/json'})
        
        print(f"📡 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Success! Response: {json.dumps(result, indent=2)}")
            return result
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"📄 Response: {response.text}")
            return {"error": f"HTTP {response.status_code}", "details": response.text}
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return {"error": "Request failed", "details": str(e)}

def test_single_event_type():
    """Test sending a single event type"""
    print("\n" + "="*60)
    print("🧪 TESTING SINGLE EVENT TYPE: TEST_RUN")
    print("="*60)
    
    events = [
        create_test_run_event(5501, "Gate tap success", "GATE", "Pass")
    ]
    
    result = send_test_results(events)
    return result

def test_multiple_test_runs():
    """Test sending multiple test run events"""
    print("\n" + "="*60)
    print("🧪 TESTING MULTIPLE TEST RUNS")
    print("="*60)
    
    events = [
        create_test_run_event(5501, "Gate tap success", "GATE", "Pass"),
        create_test_run_event(5502, "FVM payment processing", "FVM", "Pass"),
        create_test_run_event(5503, "Bus reader validation", "BUS", "Fail"),
        create_test_run_event(5504, "Card balance check", "CARD", "Pass")
    ]
    
    result = send_test_results(events)
    return result

def test_mixed_event_types():
    """Test sending mixed event types"""
    print("\n" + "="*60)
    print("🧪 TESTING MIXED EVENT TYPES")
    print("="*60)
    
    events = [
        # Test Runs
        create_test_run_event(5505, "Station entry validation", "STATION", "Pass"),
        create_test_run_event(5506, "Exit gate processing", "GATE", "Pass"),
        
        # Requirements
        create_requirement_event("REQ-GATE-001", "Gate Authentication System", "GATE"),
        create_requirement_event("REQ-FVM-001", "FVM Payment Processing", "FVM"),
        
        # Test Cases
        create_test_case_event("TC-GATE-001", "Gate Card Validation", "GATE"),
        create_test_case_event("TC-FVM-001", "FVM Cash Payment", "FVM"),
        
        # Defects
        create_defect_event("DEF-001", "Gate timeout issue", "GATE", "TC-GATE-001"),
        create_defect_event("DEF-002", "FVM display glitch", "FVM", "TC-FVM-001"),
        
        # Test Type Summary
        create_test_type_summary_event("Functional", "Success Rate"),
        create_test_type_summary_event("Performance", "Response Time"),
        
        # Transit Metrics
        create_transit_metrics_event(datetime.datetime.now().strftime('%Y-%m-%d'))
    ]
    
    result = send_test_results(events)
    return result

def test_requirement_workflow():
    """Test a complete requirement workflow"""
    print("\n" + "="*60)
    print("🧪 TESTING REQUIREMENT WORKFLOW")
    print("="*60)
    
    events = [
        # 1. Create Requirement
        create_requirement_event("REQ-BUS-001", "Bus Route Optimization", "BUS"),
        
        # 2. Create Test Cases for the Requirement
        create_test_case_event("TC-BUS-001", "Route Calculation Accuracy", "BUS"),
        create_test_case_event("TC-BUS-002", "ETA Prediction", "BUS"),
        
        # 3. Execute Test Runs
        create_test_run_event(5507, "Route Calculation Accuracy", "BUS", "Pass"),
        create_test_run_event(5508, "ETA Prediction", "BUS", "Fail"),
        
        # 4. Report Defects
        create_defect_event("DEF-003", "ETA calculation error", "BUS", "TC-BUS-002"),
        
        # 5. Test Type Summary
        create_test_type_summary_event("Functional", "Route Optimization"),
        
        # 6. Daily Metrics
        create_transit_metrics_event(datetime.datetime.now().strftime('%Y-%m-%d'))
    ]
    
    result = send_test_results(events)
    return result

def test_error_handling():
    """Test error handling with invalid data"""
    print("\n" + "="*60)
    print("🧪 TESTING ERROR HANDLING")
    print("="*60)
    
    # Test with missing required fields
    invalid_events = [
        {
            "kind": "TEST_RUN",
            # Missing testCase
            "result": "Pass"
        },
        {
            "kind": "REQUIREMENT",
            # Missing title
            "component": "TEST"
        }
    ]
    
    result = send_test_results(invalid_events)
    return result

def main():
    """Main test function"""
    print("🚀 COMPREHENSIVE TEST RESULTS API TESTING")
    print("="*60)
    print(f"🎯 Target API: {API_ENDPOINT}")
    print(f"⏰ Test Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check if API is available
    try:
        health_check = requests.get(f"{BASE_URL}/api/health")
        if health_check.status_code == 200:
            print("✅ Backend is running and healthy")
        else:
            print("⚠️  Backend health check failed")
    except:
        print("❌ Backend is not accessible. Make sure it's running on http://localhost:5000")
        return
    
    # Run tests
    tests = [
        ("Single Event Type", test_single_event_type),
        ("Multiple Test Runs", test_multiple_test_runs),
        ("Mixed Event Types", test_mixed_event_types),
        ("Requirement Workflow", test_requirement_workflow),
        ("Error Handling", test_error_handling)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            print(f"\n{'='*20} {test_name} {'='*20}")
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {e}")
            results[test_name] = {"error": str(e)}
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results.items():
        if "error" in result:
            print(f"❌ {test_name}: FAILED - {result['error']}")
        elif "accepted" in result:
            print(f"✅ {test_name}: SUCCESS - {result['accepted']} accepted, {result['failed']} failed")
        else:
            print(f"⚠️  {test_name}: UNKNOWN RESULT - {result}")
    
    print("\n🎉 Testing completed!")
    print("📖 Check the Swagger documentation at: http://localhost:5000/api/docs")

if __name__ == "__main__":
    main()
