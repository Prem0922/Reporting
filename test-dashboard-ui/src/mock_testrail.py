from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/mock_testrail/*": {"origins": "*"}})

def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/mock_testrail/testcases', methods=['GET', 'OPTIONS'])
def get_test_cases():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "id": 101,
            "title": "Login with valid credentials",
            "type": "Feature",
            "component": "Authentication",
            "requirement_id": 1,
            "status": "Active",
            "created_by": "qa_user"
        },
        {
            "id": 102,
            "title": "Login fails with wrong password",
            "type": "Regression",
            "component": "Authentication",
            "requirement_id": 1,
            "status": "Active",
            "created_by": "qa_user"
        }
    ]))
    return add_cors_headers(response)

@app.route('/mock_testrail/testruns', methods=['GET', 'OPTIONS'])
def get_testruns():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 3975,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-104",
            "test_case_id": "TC-F-FVM-215-86"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 525,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-107",
            "test_case_id": "TC-F-FVM-215-86"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 8371,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-108",
            "test_case_id": "TC-F-ALL-908-92"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 1182,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-109",
            "test_case_id": "TC-F-FVM-278-73"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 6212,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-110",
            "test_case_id": "TC-F-ALL-022-56"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 9353,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-120",
            "test_case_id": "TC-F-FVM-658-00"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 8464,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-126",
            "test_case_id": "TC-F-GATE-READER-797-68"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 7307,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-138",
            "test_case_id": "TC-F-FVM-361-74"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 8088,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-143",
            "test_case_id": "TC-NF-GATE-278-16"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 5463,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-146",
            "test_case_id": "TC-F-BUS-READER-291-00"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 6438,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-151",
            "test_case_id": "TC-F-ALL-022-56"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 255,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-157",
            "test_case_id": "TC-F-FVM-502-23"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 182,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-172",
            "test_case_id": "TC-F-GATE-READER-638-28"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 951,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-179",
            "test_case_id": "TC-F-GATE-READER-498-53"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 7332,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-191",
            "test_case_id": "TC-NF-GATE-633-97"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 6087,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-198",
            "test_case_id": "TC-F-ALL-908-92"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 1440,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-203",
            "test_case_id": "TC-F-FVM-815-57"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 1801,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-210",
            "test_case_id": "TC-F-FVM-658-00"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 9322,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-217",
            "test_case_id": "TC-NF-GATE-306-41"
        },
        {
            "Executed_By": "Robot_Unit_02",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 3557,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-219",
            "test_case_id": "TC-F-BUS-READER-162-77"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 1120,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-228",
            "test_case_id": "TC-F-FVM-984-31"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 5667,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-231",
            "test_case_id": "TC-F-FVM-403-54"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 8583,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-245",
            "test_case_id": "TC-F-BUS-READER-984-06"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 4047,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-250",
            "test_case_id": "TC-F-GATE-READER-983-34"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 7059,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-252",
            "test_case_id": "TC-F-FVM-984-31"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 1371,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-255",
            "test_case_id": "TC-F-ALL-484-26"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 3863,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-260",
            "test_case_id": "TC-F-ALL-908-92"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 2673,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-285",
            "test_case_id": "TC-F-ALL-359-32"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 5640,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-298",
            "test_case_id": "TC-F-FVM-041-26"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 3226,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-305",
            "test_case_id": "TC-F-GATE-READER-503-05"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 7558,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-310",
            "test_case_id": "TC-F-FVM-143-72"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 2524,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-311",
            "test_case_id": "TC-F-GATE-READER-945-70"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 6964,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-312",
            "test_case_id": "TC-F-GATE-READER-945-70"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 9677,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-320",
            "test_case_id": "TC-F-BUS-READER-429-13"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 1423,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-323",
            "test_case_id": "TC-F-GATE-READER-943-41"
        },
        {
            "Executed_By": "Robot_Unit_02",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 8198,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-324",
            "test_case_id": "TC-F-GATE-READER-042-19"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 6141,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-327",
            "test_case_id": "TC-F-BUS-READER-474-04"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 9928,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-331",
            "test_case_id": "TC-NF-GATE-415-95"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 8000,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-344",
            "test_case_id": "TC-F-FVM-276-27"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 3780,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-354",
            "test_case_id": "TC-F-BUS-READER-828-21"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 2802,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-361",
            "test_case_id": "TC-F-BUS-READER-405-48"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 8622,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-370",
            "test_case_id": "TC-F-GATE-READER-949-33"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 9779,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-371",
            "test_case_id": "TC-F-BUS-READER-546-93"
        },
        {
            "Executed_By": "Robot_Unit_02",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 3897,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-373",
            "test_case_id": "TC-F-ALL-045-41"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 799,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-384",
            "test_case_id": "TC-F-BUS-READER-510-77"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 2980,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-407",
            "test_case_id": "TC-F-ALL-249-22"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 1571,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-438",
            "test_case_id": "TC-F-FVM-521-52"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 9792,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-468",
            "test_case_id": "TC-F-FVM-740-91"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 2040,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-476",
            "test_case_id": "TC-F-FVM-192-31"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 8789,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-494",
            "test_case_id": "TC-F-FVM-658-00"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 1470,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-497",
            "test_case_id": "TC-F-FVM-278-73"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 5656,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-525",
            "test_case_id": "TC-F-GATE-READER-949-33"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 8413,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-527",
            "test_case_id": "TC-F-GATE-READER-042-19"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 7326,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-529",
            "test_case_id": "TC-NF-GATE-490-62"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 722,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-542",
            "test_case_id": "TC-F-GATE-READER-814-42"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 8997,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-544",
            "test_case_id": "TC-F-BUS-READER-510-77"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 5621,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-547",
            "test_case_id": "TC-NF-GATE-278-16"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 9725,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-561",
            "test_case_id": "TC-F-ALL-018-34"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 948,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-570",
            "test_case_id": "TC-F-FVM-154-39"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 3709,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-575",
            "test_case_id": "TC-F-GATE-READER-094-26"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 935,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-580",
            "test_case_id": "TC-F-FVM-361-74"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 9469,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-584",
            "test_case_id": "TC-NF-GATE-490-62"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 8004,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-586",
            "test_case_id": "TC-F-GATE-READER-498-53"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 914,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-590",
            "test_case_id": "TC-F-FVM-192-31"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 4959,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-591",
            "test_case_id": "TC-F-GATE-READER-144-94"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 4122,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-595",
            "test_case_id": "TC-F-GATE-READER-411-72"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 4244,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-605",
            "test_case_id": "TC-F-GATE-READER-576-55"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 4638,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-606",
            "test_case_id": "TC-F-GATE-READER-949-33"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 5042,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-609",
            "test_case_id": "TC-F-GATE-READER-949-33"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 3852,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-614",
            "test_case_id": "TC-F-FVM-502-23"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 9335,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-617",
            "test_case_id": "TC-F-FVM-699-62"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 4625,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-619",
            "test_case_id": "TC-F-GATE-READER-972-23"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 4876,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-620",
            "test_case_id": "TC-F-GATE-READER-430-77"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 6760,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-621",
            "test_case_id": "TC-F-BUS-READER-530-28"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 6114,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-622",
            "test_case_id": "TC-F-GATE-READER-942-22"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 3442,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-631",
            "test_case_id": "TC-NF-GATE-465-11"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 1224,
            "Remarks": "Minor Delay Observed",
            "Result": "Fail",
            "run_id": "rid-634",
            "test_case_id": "TC-F-BUS-READER-474-04"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 1305,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-639",
            "test_case_id": "TC-F-ALL-359-32"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 9506,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-663",
            "test_case_id": "TC-F-FVM-215-86"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 6481,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-670",
            "test_case_id": "TC-F-GATE-READER-930-50"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 9763,
            "Remarks": "Screen not responsive",
            "Result": "Pass",
            "run_id": "rid-673",
            "test_case_id": "TC-F-GATE-READER-797-68"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 2592,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-677",
            "test_case_id": "TC-F-ALL-018-34"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 8428,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-680",
            "test_case_id": "TC-F-BUS-READER-546-93"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 5082,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-689",
            "test_case_id": "TC-F-GATE-READER-133-22"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 226,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-690",
            "test_case_id": "TC-F-ALL-018-34"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 1794,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-691",
            "test_case_id": "TC-F-BUS-READER-915-08"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 4612,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-695",
            "test_case_id": "TC-F-FVM-863-55"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 7305,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-706",
            "test_case_id": "TC-F-FVM-453-97"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 9153,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-709",
            "test_case_id": "TC-F-ALL-045-41"
        },
        {
            "Executed_By": "Robot_Unit_00",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 5265,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-720",
            "test_case_id": "TC-F-GATE-READER-972-23"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 2680,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-725",
            "test_case_id": "TC-F-GATE-READER-930-50"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 2218,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-755",
            "test_case_id": "TC-NF-GATE-863-86"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 4792,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-764",
            "test_case_id": "TC-F-BUS-READER-510-77"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 8706,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-778",
            "test_case_id": "TC-F-BUS-READER-257-07"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 3936,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-786",
            "test_case_id": "TC-F-BUS-READER-530-28"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 2557,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-793",
            "test_case_id": "TC-F-BUS-READER-915-08"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 6235,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-798",
            "test_case_id": "TC-F-GATE-READER-305-46"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 8787,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-813",
            "test_case_id": "TC-F-GATE-READER-133-22"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 4881,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-820",
            "test_case_id": "TC-NF-GATE-175-15"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 5944,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-821",
            "test_case_id": "TC-F-FVM-176-78"
        },
        {
            "Executed_By": "Robot_Unit_04",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 5005,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-828",
            "test_case_id": "TC-F-GATE-READER-059-92"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 9055,
            "Remarks": "Incorrect result shown",
            "Result": "Fail",
            "run_id": "rid-832",
            "test_case_id": "TC-F-FVM-815-57"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 3360,
            "Remarks": "Minor Delay Observed",
            "Result": "Pass",
            "run_id": "rid-834",
            "test_case_id": "TC-F-GATE-READER-254-27"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 9961,
            "Remarks": "Incorrect result shown",
            "Result": "Pass",
            "run_id": "rid-838",
            "test_case_id": "TC-F-FVM-453-97"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 2174,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-839",
            "test_case_id": "TC-F-GATE-READER-754-53"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 3674,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-844",
            "test_case_id": "TC-F-FVM-372-76"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 8299,
            "Remarks": "All Steps Passed",
            "Result": "Pass",
            "run_id": "rid-849",
            "test_case_id": "TC-F-FVM-041-26"
        },
        {
            "Executed_By": "Robot_Unit_05",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 1179,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-872",
            "test_case_id": "TC-F-BUS-READER-530-28"
        },
        {
            "Executed_By": "Robot_Unit_01",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 1534,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Fail",
            "run_id": "rid-888",
            "test_case_id": "TC-F-BUS-READER-207-51"
        },
        {
            "Executed_By": "Robot_Unit_09",
            "Execution_Date": "22-05-2025 15:12",
            "Observed_Time": 7227,
            "Remarks": "Test Passed Smoothly",
            "Result": "Fail",
            "run_id": "rid-894",
            "test_case_id": "TC-F-BUS-READER-053-68"
        },
        {
            "Executed_By": "Robot_Unit_06",
            "Execution_Date": "16-05-2025 15:52",
            "Observed_Time": 7443,
            "Remarks": "Test Passed Smoothly",
            "Result": "Pass",
            "run_id": "rid-899",
            "test_case_id": "TC-F-GATE-READER-334-81"
        },
        {
            "Executed_By": "Robot_Unit_03",
            "Execution_Date": "16-05-2025 15:58",
            "Observed_Time": 2185,
            "Remarks": "Card Not Detected",
            "Result": "Fail",
            "run_id": "rid-925",
            "test_case_id": "TC-F-FVM-815-57"
        },
        {
            "Executed_By": "Robot_Unit_02",
            "Execution_Date": "22-05-2025 13:55",
            "Observed_Time": 3683,
            "Remarks": "Screen not responsive",
            "Result": "Fail",
            "run_id": "rid-931",
            "test_case_id": "TC-F-FVM-521-52"
        },
        {
            "Executed_By": "Robot_Unit_07",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 9842,
            "Remarks": "Mechanical Arm Misaligned",
            "Result": "Pass",
            "run_id": "rid-938",
            "test_case_id": "TC-F-BUS-READER-915-08"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "21-05-2025 13:59",
            "Observed_Time": 9762,
            "Remarks": "Card Not Detected",
            "Result": "Pass",
            "run_id": "rid-959",
            "test_case_id": "TC-F-GATE-READER-949-33"
        },
        {
            "Executed_By": "Robot_Unit_08",
            "Execution_Date": "18-05-2025 20:55",
            "Observed_Time": 661,
            "Remarks": "All Steps Passed",
            "Result": "Fail",
            "run_id": "rid-970",
            "test_case_id": "TC-F-BUS-READER-915-08"
        }
    ]))
    return add_cors_headers(response)

@app.route('/mock_testrail/defects', methods=['GET', 'OPTIONS'])
def get_defects():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "DefectID": "RT-10001",
            "Severity": "Medium",
            "Status": "In-Progress",
            "Test_Case_ID": "TC-NF-GATE-728-87",
            "Title": "Screen Freeze During Payment",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-20 07:56:13",
            "reported_by": "qa_user_02"
        },
        {
            "DefectID": "RT-10002",
            "Severity": "Medium",
            "Status": "In-Progress",
            "Test_Case_ID": "TC-F-FVM-154-39",
            "Title": "NFC Module Not Initializing",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-03 10:47:13",
            "reported_by": "qa_user_02"
        },
        {
            "DefectID": "RT-10003",
            "Severity": "Low",
            "Status": "Resolved",
            "Test_Case_ID": "TC-F-FVM-699-62",
            "Title": "Wrong Fare Deducted",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-05-31 16:36:13",
            "reported_by": "Robot_Unit_04"
        },
        {
            "DefectID": "RT-10004",
            "Severity": "High",
            "Status": "Closed",
            "Test_Case_ID": "TC-F-ALL-908-92",
            "Title": "Gate shows GO on insufficient balance",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-17 18:36:13",
            "reported_by": "qa_user_08"
        },
        {
            "DefectID": "RT-10005",
            "Severity": "High",
            "Status": "In-Progress",
            "Test_Case_ID": "TC-F-BUS-READER-053-68",
            "Title": "Crash on selecting monthly pass",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-13 09:05:13",
            "reported_by": "qa_user_02"
        },
        {
            "DefectID": "RT-10006",
            "Severity": "Medium",
            "Status": "Open",
            "Test_Case_ID": "TC-F-FVM-176-78",
            "Title": "Screen Freeze During Payment",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-21 09:30:13",
            "reported_by": "qa_user_02"
        },
        {
            "DefectID": "RT-10007",
            "Severity": "High",
            "Status": "Closed",
            "Test_Case_ID": "TC-F-GATE-READER-430-77",
            "Title": "Gate shows GO on insufficient balance",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-18 11:04:13",
            "reported_by": "qa_user_09"
        },
        {
            "DefectID": "RT-10008",
            "Severity": "High",
            "Status": "Resolved",
            "Test_Case_ID": "TC-F-GATE-READER-430-77",
            "Title": "Wrong Fare Deducted",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-07 13:36:13",
            "reported_by": "Robot_Unit_05"
        },
        {
            "DefectID": "RT-10009",
            "Severity": "High",
            "Status": "In-Progress",
            "Test_Case_ID": "TC-F-FVM-176-78",
            "Title": "NFC Module Not Initializing",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-06 04:43:13",
            "reported_by": "Robot_Unit_08"
        },
        {
            "DefectID": "RT-10010",
            "Severity": "Low",
            "Status": "In-Progress",
            "Test_Case_ID": "TC-F-GATE-READER-942-22",
            "Title": "Incorrect Balance shown after reload",
            "created_at": "2025-05-22 15:12:13",
            "fixed_at": "2025-06-14 11:53:13",
            "reported_by": "Robot_Unit_01"
        }
    ]))
    return add_cors_headers(response)

@app.route('/mock_testrail/testtypesummary', methods=['GET', 'OPTIONS'])
def get_test_type_summary():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "Actual": "306ms",
            "Expected": "<=249ms",
            "Metrics": "Average Response Time",
            "Status": "Pass",
            "Test_Date": "2025-05-05",
            "Test_Type": "Battery Drain Test - Robot"
        },
        {
            "Actual": "66.74%",
            "Expected": "<=86%",
            "Metrics": "CPU Utilization",
            "Status": "Pass",
            "Test_Date": "2025-05-19",
            "Test_Type": "Battery Drain Test - Robot"
        },
        {
            "Actual": "0.31GB",
            "Expected": "<=4.4GB",
            "Metrics": "Memory Usage",
            "Status": "Pass",
            "Test_Date": "2025-05-04",
            "Test_Type": "Battery Drain Test - Robot"
        },
        {
            "Actual": "7.5s",
            "Expected": "<234ms",
            "Metrics": "Recovery Time From Crash",
            "Status": "Pass",
            "Test_Date": "2025-04-29",
            "Test_Type": "Battery Drain Test - Robot"
        },
        {
            "Actual": "99.98%",
            "Expected": ">=62.62%",
            "Metrics": "System Up time",
            "Status": "Fail",
            "Test_Date": "2025-05-01",
            "Test_Type": "Battery Drain Test - Robot"
        },
        {
            "Actual": "153ms",
            "Expected": "<223ms",
            "Metrics": "Average Response Time",
            "Status": "Pass",
            "Test_Date": "2025-05-03",
            "Test_Type": "Latency Test - NFC Tap"
        },
        {
            "Actual": "35.67%",
            "Expected": "<=56%",
            "Metrics": "Battery Usage per hour",
            "Status": "Fail",
            "Test_Date": "2025-05-01",
            "Test_Type": "Latency Test - NFC Tap"
        },
        {
            "Actual": "1486",
            "Expected": ">=4114",
            "Metrics": "Concurrent Sessions Handled",
            "Status": "Pass",
            "Test_Date": "2025-05-02",
            "Test_Type": "Latency Test - NFC Tap"
        },
        {
            "Actual": "1.89GB",
            "Expected": "<=2.2GB",
            "Metrics": "Memory Usage",
            "Status": "Fail",
            "Test_Date": "2025-04-28",
            "Test_Type": "Latency Test - NFC Tap"
        },
        {
            "Actual": "78ms",
            "Expected": "<=452ms",
            "Metrics": "Average Response Time",
            "Status": "Pass",
            "Test_Date": "2025-04-28",
            "Test_Type": "Load Test - Gate Readers"
        },
        {
            "Actual": "66.91%",
            "Expected": "<=34%",
            "Metrics": "CPU Utilization",
            "Status": "Pass",
            "Test_Date": "2025-05-09",
            "Test_Type": "Load Test - Gate Readers"
        },
        {
            "Actual": "2803",
            "Expected": ">=4771",
            "Metrics": "Concurrent Sessions Handled",
            "Status": "Fail",
            "Test_Date": "2025-04-27",
            "Test_Type": "Load Test - Gate Readers"
        },
        {
            "Actual": "5.5s",
            "Expected": "<493ms",
            "Metrics": "Recovery Time From Crash",
            "Status": "Fail",
            "Test_Date": "2025-05-13",
            "Test_Type": "Load Test - Gate Readers"
        },
        {
            "Actual": "99.03%",
            "Expected": ">=22.22%",
            "Metrics": "System Up time",
            "Status": "Pass",
            "Test_Date": "2025-05-05",
            "Test_Type": "Load Test - Gate Readers"
        },
        {
            "Actual": "73.04%",
            "Expected": "<=63%",
            "Metrics": "CPU Utilization",
            "Status": "Pass",
            "Test_Date": "2025-05-19",
            "Test_Type": "Memory Usage Test - Controller"
        },
        {
            "Actual": "213",
            "Expected": ">=3532",
            "Metrics": "Concurrent Sessions Handled",
            "Status": "Pass",
            "Test_Date": "2025-04-27",
            "Test_Type": "Memory Usage Test - Controller"
        },
        {
            "Actual": "2375",
            "Expected": ">=1314",
            "Metrics": "Max Transactions per hour",
            "Status": "Fail",
            "Test_Date": "2025-04-20",
            "Test_Type": "Memory Usage Test - Controller"
        },
        {
            "Actual": "21.46%",
            "Expected": "<=49%",
            "Metrics": "CPU Utilization",
            "Status": "Fail",
            "Test_Date": "2025-05-17",
            "Test_Type": "Performance Test - FVM"
        },
        {
            "Actual": "586",
            "Expected": ">=4654",
            "Metrics": "Max Transactions per hour",
            "Status": "Fail",
            "Test_Date": "2025-05-21",
            "Test_Type": "Performance Test - FVM"
        },
        {
            "Actual": "1.04GB",
            "Expected": "<=3.3GB",
            "Metrics": "Memory Usage",
            "Status": "Pass",
            "Test_Date": "2025-05-16",
            "Test_Type": "Performance Test - FVM"
        },
        {
            "Actual": "1.0s",
            "Expected": "<154ms",
            "Metrics": "Recovery Time From Crash",
            "Status": "Pass",
            "Test_Date": "2025-05-14",
            "Test_Type": "Performance Test - FVM"
        },
        {
            "Actual": "114ms",
            "Expected": "<=257ms",
            "Metrics": "Average Response Time",
            "Status": "Fail",
            "Test_Date": "2025-04-21",
            "Test_Type": "Response Time Validation - All Devices"
        },
        {
            "Actual": "225",
            "Expected": ">=4192",
            "Metrics": "Concurrent Sessions Handled",
            "Status": "Fail",
            "Test_Date": "2025-05-19",
            "Test_Type": "Response Time Validation - All Devices"
        },
        {
            "Actual": "4390",
            "Expected": ">=2492",
            "Metrics": "Max Transactions per hour",
            "Status": "Fail",
            "Test_Date": "2025-05-15",
            "Test_Type": "Response Time Validation - All Devices"
        },
        {
            "Actual": "99.62%",
            "Expected": ">=46.46%",
            "Metrics": "System Up time",
            "Status": "Fail",
            "Test_Date": "2025-05-07",
            "Test_Type": "Response Time Validation - All Devices"
        },
        {
            "Actual": "566ms",
            "Expected": "<312ms",
            "Metrics": "Transaction Completion Time",
            "Status": "Fail",
            "Test_Date": "2025-05-12",
            "Test_Type": "Response Time Validation - All Devices"
        },
        {
            "Actual": "266ms",
            "Expected": "<293ms",
            "Metrics": "Average Response Time",
            "Status": "Fail",
            "Test_Date": "2025-04-24",
            "Test_Type": "Scalability Test-Backend"
        },
        {
            "Actual": "55.05%",
            "Expected": "<=36%",
            "Metrics": "CPU Utilization",
            "Status": "Fail",
            "Test_Date": "2025-05-04",
            "Test_Type": "Scalability Test-Backend"
        },
        {
            "Actual": "4109",
            "Expected": ">=2083",
            "Metrics": "Max Transactions per hour",
            "Status": "Pass",
            "Test_Date": "2025-05-06",
            "Test_Type": "Scalability Test-Backend"
        },
        {
            "Actual": "6.9s",
            "Expected": "<288ms",
            "Metrics": "Recovery Time From Crash",
            "Status": "Pass",
            "Test_Date": "2025-05-11",
            "Test_Type": "Scalability Test-Backend"
        },
        {
            "Actual": "99.05%",
            "Expected": ">=1.1%",
            "Metrics": "System Up time",
            "Status": "Pass",
            "Test_Date": "2025-05-22",
            "Test_Type": "Scalability Test-Backend"
        },
        {
            "Actual": "3125",
            "Expected": ">=2282",
            "Metrics": "Concurrent Sessions Handled",
            "Status": "Fail",
            "Test_Date": "2025-05-01",
            "Test_Type": "Stress Test-Bus Readers"
        },
        {
            "Actual": "1.46GB",
            "Expected": "<=2.2GB",
            "Metrics": "Memory Usage",
            "Status": "Pass",
            "Test_Date": "2025-05-18",
            "Test_Type": "Stress Test-Bus Readers"
        },
        {
            "Actual": "3.3s",
            "Expected": "<252ms",
            "Metrics": "Recovery Time From Crash",
            "Status": "Fail",
            "Test_Date": "2025-04-29",
            "Test_Type": "Stress Test-Bus Readers"
        },
        {
            "Actual": "386ms",
            "Expected": "<=420ms",
            "Metrics": "Transaction Completion Time",
            "Status": "Fail",
            "Test_Date": "2025-04-26",
            "Test_Type": "Stress Test-Bus Readers"
        }
    ]))
    return add_cors_headers(response)

@app.route('/mock_testrail/transitmetricsdaily', methods=['GET', 'OPTIONS'])
def get_transit_metrics_daily():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "Avg Response Time": 288,
            "Bus Taps": 9145,
            "Date": "2025-05-10",
            "Defect Count": 7,
            "FVM Transactions": 102,
            "Gate Taps": 20741,
            "Notes": "Data Incomplete Due to network Issue",
            "Success Rate Bus": "91.61",
            "Success Rate Gate": "92.64"
        },
        {
            "Avg Response Time": 439,
            "Bus Taps": 3387,
            "Date": "2025-05-11",
            "Defect Count": 6,
            "FVM Transactions": 3183,
            "Gate Taps": 10202,
            "Notes": "Bus Taps Errors Observed",
            "Success Rate Bus": "92.14",
            "Success Rate Gate": "94.17"
        },
        {
            "Avg Response Time": 221,
            "Bus Taps": 3388,
            "Date": "2025-05-12",
            "Defect Count": 9,
            "FVM Transactions": 195,
            "Gate Taps": 2612,
            "Notes": "Minor Delay in gate Readers",
            "Success Rate Bus": "95.50",
            "Success Rate Gate": "93.39"
        },
        {
            "Avg Response Time": 164,
            "Bus Taps": 1621,
            "Date": "2025-05-13",
            "Defect Count": 0,
            "FVM Transactions": 9229,
            "Gate Taps": 18961,
            "Notes": "Minor Delay in gate Readers",
            "Success Rate Bus": "93.63",
            "Success Rate Gate": "94.69"
        },
        {
            "Avg Response Time": 290,
            "Bus Taps": 7296,
            "Date": "2025-05-14",
            "Defect Count": 2,
            "FVM Transactions": 492,
            "Gate Taps": 5395,
            "Notes": "Data Incomplete Due to network Issue",
            "Success Rate Bus": "99.84",
            "Success Rate Gate": "99.76"
        },
        {
            "Avg Response Time": 412,
            "Bus Taps": 7579,
            "Date": "2025-05-15",
            "Defect Count": 1,
            "FVM Transactions": 9323,
            "Gate Taps": 22476,
            "Notes": "Minor Delay in gate Readers",
            "Success Rate Bus": "95.88",
            "Success Rate Gate": "97.01"
        },
        {
            "Avg Response Time": 87,
            "Bus Taps": 5634,
            "Date": "2025-05-16",
            "Defect Count": 1,
            "FVM Transactions": 9759,
            "Gate Taps": 42895,
            "Notes": "Minor Delay in gate Readers",
            "Success Rate Bus": "95.70",
            "Success Rate Gate": "95.81"
        },
        {
            "Avg Response Time": 126,
            "Bus Taps": 4791,
            "Date": "2025-05-17",
            "Defect Count": 3,
            "FVM Transactions": 669,
            "Gate Taps": 17784,
            "Notes": "Bus Taps Errors Observed",
            "Success Rate Bus": "90.94",
            "Success Rate Gate": "95.49"
        },
        {
            "Avg Response Time": 446,
            "Bus Taps": 9971,
            "Date": "2025-05-18",
            "Defect Count": 8,
            "FVM Transactions": 332,
            "Gate Taps": 28939,
            "Notes": "Data Incomplete Due to network Issue",
            "Success Rate Bus": "90.98",
            "Success Rate Gate": "92.19"
        },
        {
            "Avg Response Time": 379,
            "Bus Taps": 4851,
            "Date": "2025-05-19",
            "Defect Count": 7,
            "FVM Transactions": 9376,
            "Gate Taps": 16670,
            "Notes": "Normal Operation",
            "Success Rate Bus": "97.30",
            "Success Rate Gate": "95.73"
        },
        {
            "Avg Response Time": 154,
            "Bus Taps": 5787,
            "Date": "2025-05-20",
            "Defect Count": 4,
            "FVM Transactions": 807,
            "Gate Taps": 1938,
            "Notes": "Normal Operation",
            "Success Rate Bus": "99.28",
            "Success Rate Gate": "99.80"
        },
        {
            "Avg Response Time": 333,
            "Bus Taps": 5081,
            "Date": "2025-05-21",
            "Defect Count": 4,
            "FVM Transactions": 420,
            "Gate Taps": 30669,
            "Notes": "Observed High Tap Volume at metro line 3",
            "Success Rate Bus": "95.53",
            "Success Rate Gate": "93.72"
        },
        {
            "Avg Response Time": 215,
            "Bus Taps": 2663,
            "Date": "2025-05-22",
            "Defect Count": 9,
            "FVM Transactions": 9985,
            "Gate Taps": 5400,
            "Notes": "Few gate rejections due to hotlisted cards",
            "Success Rate Bus": "91.39",
            "Success Rate Gate": "92.06"
        }
    ]))
    return add_cors_headers(response)

@app.route('/mock_testrail/requirements', methods=['GET', 'OPTIONS'])
def get_requirements():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())
    response = make_response(jsonify([
        {
            "component": "FVM",
            "created_at": "Fri, 16 May 2025 10:28:19 GMT",
            "description": "FVM should accept cash as payment method",
            "jira_id": "JIRA-5802",
            "priority": "Low",
            "requirement_id": "BU-913",
            "status": "Accepted",
            "title": "FVM should accept Credit and Debit"
        },
        {
            "component": "Gate Reader",
            "created_at": "Wed, 21 May 2025 08:28:40 GMT",
            "description": "FVM should allow refund option if transaction fails",
            "jira_id": "JIRA-8519",
            "priority": "Low",
            "requirement_id": "BU-961",
            "status": "Rejected",
            "title": "Receipt should contain transaction ID, amount"
        },
        {
            "component": "Bus Reader",
            "created_at": "Fri, 16 May 2025 10:28:21 GMT",
            "description": "FVM should show error messages for card read failures",
            "jira_id": "JIRA-4953",
            "priority": "High",
            "requirement_id": "F-ALL-104",
            "status": "In Review",
            "title": "Gate Reader should be able to tap"
        },
        {
            "component": "FVM",
            "created_at": "Sun, 18 May 2025 15:25:07 GMT",
            "description": "FVM should accept credit and debit cards as payment methods",
            "jira_id": "JIRA-7775",
            "priority": "Medium",
            "requirement_id": "F-ALL-413",
            "status": "Design Completed",
            "title": "Gate reader should log every successful otp"
        },
        {
            "component": "Bus Reader",
            "created_at": "Fri, 16 May 2025 10:22:06 GMT",
            "description": "Gate reader should retry backend sync every 30 seconds if offline",
            "jira_id": "JIRA-9589",
            "priority": "Low",
            "requirement_id": "F-ALL-465",
            "status": "Implementation Completed",
            "title": "Bus reader should detect direction"
        },
        {
            "component": "Bus Reader",
            "created_at": "Fri, 16 May 2025 10:21:58 GMT",
            "description": "Bus reader should detect direction of tap using GPS Zone",
            "jira_id": "JIRA-9511",
            "priority": "High",
            "requirement_id": "F-ALL-744",
            "title": "Gate reader should log every rejection"
        },
        {
            "component": "ALL",
            "created_at": "Fri, 16 May 2025 10:28:07 GMT",
            "description": "Receipt should contain transaction ID, amount paid, card id, payment method, date and time",
            "jira_id": "JIRA-6169",
            "priority": "Low",
            "requirement_id": "F-ALL-815",
            "status": "Done",
            "title": "Reject Invalid Card on Gate"
        },
        {
            "component": "Gate Reader",
            "created_at": "Sun, 18 May 2025 15:25:08 GMT",
            "description": "FVM should lock screen when service mode is active",
            "jira_id": "JIRA-9441",
            "priority": "High",
            "requirement_id": "F-ALL-837",
            "status": "Testing Completed",
            "title": "FVM should accept Credit and Debit"
        },
        {
            "component": "ALL",
            "created_at": "Fri, 16 May 2025 10:28:04 GMT",
            "description": "Gate reader should be able to read DesFire,MiFare, credit card and barcode",
            "jira_id": "JIRA-3109",
            "priority": "Medium",
            "requirement_id": "F-ALL-906",
            "title": "FVM should retry card processing up"
        },
        {
            "component": "Bus Reader",
            "created_at": "Sun, 18 May 2025 15:25:07 GMT",
            "description": "Receipt should contain transaction ID, amount paid, card id, payment method, date and time",
            "jira_id": "JIRA-7860",
            "priority": "High",
            "requirement_id": "F-ALL-945",
            "status": "Done",
            "title": "Purchase TransitCard using FVM"
        },
        {
            "component": "Gate Reader",
            "created_at": "Fri, 16 May 2025 10:27:59 GMT",
            "description": "Users should be able to check balance before purchase",
            "jira_id": "JIRA-5829",
            "priority": "Low",
            "requirement_id": "F-BUS-102",
            "status": "In Review",
            "title": "FVM should accept Credit and Debit"
        },
        {
            "component": "Bus Reader",
            "created_at": "Fri, 16 May 2025 10:28:14 GMT",
            "description": "User should be able to purchase a smartcard using FVM",
            "jira_id": "JIRA-2604",
            "priority": "Medium",
            "requirement_id": "F-BUS-512",
            "status": "In Review",
            "title": "Fast transaction completion"
        },
        {
            "component": "FVM",
            "created_at": "Fri, 16 May 2025 10:22:08 GMT",
            "description": "Bus reader should be able to determine entry vs exit taps",
            "jira_id": "JIRA-4376",
            "priority": "Medium",
            "requirement_id": "F-BUS-645",
            "status": "In Review",
            "title": "FVM should retry card processing up"
        },
        {
            "component": "Gate Reader",
            "created_at": "Wed, 21 May 2025 08:28:52 GMT",
            "description": "Bus reader should be able to determine entry vs exit taps",
            "jira_id": "JIRA-6566",
            "priority": "Medium",
            "requirement_id": "F-BUS-784",
            "status": "In Review",
            "title": "Fast transaction completion"
        }
    ]))
    return add_cors_headers(response)

if __name__ == '__main__':
    app.run(port=5001, debug=True) 
