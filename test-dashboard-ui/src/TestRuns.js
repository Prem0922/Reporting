// TestRuns.js
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    LinearProgress,
    Box,
    Pagination,
    Tooltip,
    IconButton,
    List,
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@mui/material';
import { 
    MoreVert as MoreVertIcon,
    CloudUpload 
} from '@mui/icons-material';
import { format, parse, isValid } from 'date-fns';
import UploadOptions from './components/UploadOptions';

const DEFAULT_ITEMS_PER_PAGE = 10;

const generateRunId = () => {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    return `rid-${randomNumber}`;
};

const generateExecutionDate = () => {
    const year = 2025;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const date = new Date(year, month, day, hour, minute);
    return format(date, 'dd-MM-yyyy HH:mm');
};

const generateResult = () => {
    return Math.random() < 0.8 ? 'Pass' : 'Fail';
};

const generateObservedTime = () => {
    return Math.floor(Math.random() * 900) + 100;
};

const generateExecutedBy = () => {
    const randomNumber = Math.floor(Math.random() * 10);
    return `Robot_Unit_0${randomNumber}`;
};

const generateRemarks = () => {
    const remarks = [
        'Screen not responsive',
        'Test Passed Smoothly',
        'Incorrect result shown',
        'All Steps Passed',
        'Minor Delay Observed',
        'Card Not Detected',
        'Mechanical Arm Misaligned',
    ];
    return remarks[Math.floor(Math.random() * remarks.length)];
};

const generateTestRunsData = (structuredTestCases) => {
    const testRuns = [];
    const numToGenerate = (structuredTestCases && structuredTestCases.length > 0) ? 20 : 30;
    const sourceTestCases = (structuredTestCases && structuredTestCases.length > 0) ? structuredTestCases : Array(5).fill(null).map((_,i) => ({Test_Case_ID: `TC-DUMMY-${i+100}`}));

    for (let i = 0; i < numToGenerate; i++) {
        const randomTestCase = sourceTestCases[Math.floor(Math.random() * sourceTestCases.length)];
        testRuns.push({
            run_id: generateRunId(),
            test_case_id: randomTestCase.Test_Case_ID,
            Execution_Date: generateExecutionDate(),
            Result: generateResult(),
            Observed_Time: generateObservedTime(),
            Executed_By: generateExecutedBy(),
            Remarks: generateRemarks(),
        });
    }
    return testRuns;
};

function TestRuns() {
    const [testRuns, setTestRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredRuns, setFilteredRuns] = useState([]);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [hoveredTestCaseId, setHoveredTestCaseId] = useState(null);
    const [testCaseDetails, setTestCaseDetails] = useState(null);

    const testRunFields = [
        { value: 'run_id', label: 'Run ID' },
        { value: 'test_case_id', label: 'Test Case ID' },
        { value: 'execution_date', label: 'Execution Date' },
        { value: 'result', label: 'Result' },
        { value: 'observed_time', label: 'Observed Time' },
        { value: 'executed_by', label: 'Executed By' },
        { value: 'remarks', label: 'Remarks' }
    ];

    useEffect(() => {
        fetchTestRuns();
    }, []);

    useEffect(() => {
        const safeData = Array.isArray(testRuns) ? testRuns : [];
        let filtered = safeData;

        if (filterField && filterValue) {
            filtered = safeData.filter(run => {
                let valueToCompare;
                
                // Handle field name mapping for different data sources
                if (filterField === 'execution_date') {
                    valueToCompare = run.execution_date || run.Execution_Date;
                } else if (filterField === 'result') {
                    valueToCompare = run.result || run.Result;
                } else if (filterField === 'observed_time') {
                    valueToCompare = run.observed_time || run.Observed_Time;
                } else if (filterField === 'executed_by') {
                    valueToCompare = run.executed_by || run.Executed_By;
                } else if (filterField === 'remarks') {
                    valueToCompare = run.remarks || run.Remarks;
                } else {
                    valueToCompare = run[filterField];
                }
                
                if (filterField === 'execution_date' && valueToCompare) {
                    try {
                        if (typeof valueToCompare === 'string' && valueToCompare.trim()) {
                            let parsedDate;
                            if (valueToCompare.includes('-') && valueToCompare.includes(':')) {
                                parsedDate = parse(valueToCompare, 'dd-MM-yyyy HH:mm', new Date());
                            } else {
                                parsedDate = new Date(valueToCompare);
                            }
                            
                            if (isValid(parsedDate)) {
                                const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
                                return formattedDate.toLowerCase().includes(filterValue.toLowerCase());
                            }
                        }
                        return false;
                    } catch (error) {
                        console.warn('Date filtering error:', error);
                        return false;
                    }
                }
                return valueToCompare && String(valueToCompare).toLowerCase().includes(filterValue.toLowerCase());
            });
        }
        setFilteredRuns(filtered);
        setCurrentPage(1);
    }, [testRuns, filterField, filterValue]);

    const fetchTestRuns = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/testruns');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Validate and clean the data
            const cleanedData = Array.isArray(data) ? data.map(run => ({
                ...run,
                // Ensure we have fallback values for missing fields
                run_id: run.run_id || run.Run_ID || `run-${Math.random().toString(36).substr(2, 9)}`,
                test_case_id: run.test_case_id || run.Test_Case_ID || 'Unknown',
                execution_date: run.execution_date || run.Execution_Date || null,
                result: run.result || run.Result || 'Unknown',
                observed_time: run.observed_time || run.Observed_Time || 0,
                executed_by: run.executed_by || run.Executed_By || 'Unknown',
                remarks: run.remarks || run.Remarks || 'No remarks'
            })) : [];
            
            setTestRuns(cleanedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching test runs:', error);
            setError('Failed to load test runs.');
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleFilterFieldChange = (event) => {
        setFilterField(event.target.value);
        setFilterValue('');
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handleUrlUpload = async (url) => {
        try {
            // First fetch the data from the mock API
            console.log('Fetching test runs data from:', url);
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            console.log('Received mock test runs data:', mockData);

            // Send the entire array to our backend
            console.log('Sending test runs data to backend...');
            const response = await fetch('http://localhost:5000/api/testruns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Upload failed');
            }

            console.log('Upload success:', responseData.message);
            
            // Refresh the test runs list
            await fetchTestRuns();
            setUploadDialogOpen(false);

            // Show success message
            alert('Test runs uploaded successfully!');
        } catch (error) {
            console.error('Error uploading test runs:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/testruns/upload/file', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            await fetchTestRuns();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const getTestCaseDetails = async (testCaseId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/test-cases/${testCaseId}`);
            if (response.status === 404) return null;
            if (!response.ok) return null;
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching test case details:', error);
            return null;
        }
    };

    const handleTestCaseIdHover = (event, testCaseId) => {
        setHoveredTestCaseId(testCaseId);
        if (testCaseId !== hoveredTestCaseId || !testCaseDetails) {
            getTestCaseDetails(testCaseId).then(details => {
                setTestCaseDetails(details);
            });
        }
    };

    const handleTestCaseIdLeave = () => {
        setHoveredTestCaseId(null);
        setTestCaseDetails(null);
    };

    if (loading) {
        return <LinearProgress sx={{ margin: 2 }} />;
    }

    if (error) {
        return <div style={{ color: 'red', fontWeight: 'bold', margin: '20px' }}>Error: {error}</div>;
    }

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredRuns.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredRuns.length / rowsPerPage);

    if (testRuns.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ color: '#2196f3' }}>Test Runs</Typography>
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={() => setUploadDialogOpen(true)}
                        sx={{
                            backgroundColor: '#303f9f',
                            '&:hover': {
                                backgroundColor: '#1a237e'
                            }
                        }}
                    >
                        Upload Test Runs
                    </Button>
                </Box>
                <Typography variant="body1">No test runs available.</Typography>

                <UploadOptions
                    title="Upload Test Runs"
                    open={uploadDialogOpen}
                    onClose={() => setUploadDialogOpen(false)}
                    onUrlUpload={handleUrlUpload}
                    onFileUpload={handleFileUpload}
                />
            </Paper>
        );
    }

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4" sx={{ color: '#2196f3' }}>Test Runs</Typography>
                <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{
                        backgroundColor: '#303f9f',
                        '&:hover': {
                            backgroundColor: '#1a237e'
                        }
                    }}
                >
                    Upload Test Runs
                </Button>
            </Box>

            <UploadOptions
                title="Upload Test Runs"
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUrlUpload={handleUrlUpload}
                onFileUpload={handleFileUpload}
            />

            {/* Filter controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="filter-field-label">Filter By</InputLabel>
                    <Select
                        labelId="filter-field-label"
                        id="filter-field"
                        value={filterField}
                        label="Filter By"
                        onChange={handleFilterFieldChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {testRunFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={`Search in ${testRunFields.find(f => f.value === filterField)?.label || 'All Fields'}`}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    sx={{ m: 1, flexGrow: 1 }}
                    disabled={!filterField}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="test runs table">
                    <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Run ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Test Case ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Execution Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Result</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Observed Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Executed By</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((run, index) => (
                            <TableRow key={run.run_id || index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell>{run.run_id}</TableCell>
                                <TableCell 
                                    onMouseEnter={(e) => handleTestCaseIdHover(e, run.test_case_id)}
                                    onMouseLeave={handleTestCaseIdLeave}
                                    style={{ position: 'relative' }}
                                >
                                    {run.test_case_id}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 0,
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <IconButton size="small" aria-label="details">
                                            <MoreVertIcon />
                                        </IconButton>
                                        {hoveredTestCaseId === run.test_case_id && 
                                         currentItems.findIndex(t => t.test_case_id === run.test_case_id) === currentItems.indexOf(run) && 
                                         testCaseDetails && (
                                            <Tooltip 
                                                open 
                                                title={
                                                    <Box sx={{ 
                                                        p: 1, 
                                                        backgroundColor: '#424242',
                                                        borderRadius: 1,
                                                        minWidth: 300,
                                                        '& .MuiTypography-root': {
                                                            fontSize: '0.875rem',
                                                            color: '#fff'
                                                        }
                                                    }}>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Title:</strong> {testCaseDetails.Title}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Type:</strong> {testCaseDetails.Type}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Component:</strong> {testCaseDetails.Component}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Status:</strong> {testCaseDetails.Status}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Requirement ID:</strong> {testCaseDetails.Requirement_ID || 'N/A'}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Created By:</strong> {testCaseDetails.Created_by || testCaseDetails.Created_By || 'N/A'}
                                                        </Typography>
                                                        <Typography sx={{ mb: 1 }}>
                                                            <strong>Created At:</strong> {testCaseDetails.Created_at ? format(new Date(testCaseDetails.Created_at), 'yyyy-MM-dd HH:mm:ss') : (testCaseDetails.Created_At ? format(new Date(testCaseDetails.Created_At), 'yyyy-MM-dd HH:mm:ss') : 'N/A')}
                                                        </Typography>
                                                        {testCaseDetails.PreCondition && (
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>PreCondition:</strong> {testCaseDetails.PreCondition}
                                                            </Typography>
                                                        )}
                                                        {testCaseDetails.Test_Steps && (
                                                            <Typography sx={{ 
                                                                mb: 1,
                                                                whiteSpace: 'pre-wrap',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                <strong>Test Steps:</strong> {testCaseDetails.Test_Steps}
                                                            </Typography>
                                                        )}
                                                        {testCaseDetails.Expected_Result && (
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Expected Result:</strong> {testCaseDetails.Expected_Result}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                } 
                                                placement="right"
                                                PopperProps={{
                                                    sx: {
                                                        '& .MuiTooltip-tooltip': {
                                                            backgroundColor: '#424242',
                                                            maxWidth: 500
                                                        }
                                                    }
                                                }}
                                            >
                                                <div></div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{
                                    (run.execution_date || run.Execution_Date) 
                                        ? (() => {
                                            try {
                                                const dateValue = run.execution_date || run.Execution_Date;
                                                if (typeof dateValue === 'string' && dateValue.trim()) {
                                                    // Handle different date formats
                                                    if (dateValue.includes('-') && dateValue.includes(':')) {
                                                        // Format: "dd-MM-yyyy HH:mm"
                                                        const parsedDate = parse(dateValue, 'dd-MM-yyyy HH:mm', new Date());
                                                        if (isValid(parsedDate)) {
                                                            return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
                                                        }
                                                    } else if (dateValue.includes('T')) {
                                                        // ISO format
                                                        const parsedDate = new Date(dateValue);
                                                        if (isValid(parsedDate)) {
                                                            return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
                                                        }
                                                    } else {
                                                        // Try to parse as regular date
                                                        const parsedDate = new Date(dateValue);
                                                        if (isValid(parsedDate)) {
                                                            return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
                                                        }
                                                    }
                                                    return 'Invalid date format';
                                                } else {
                                                    return 'No date';
                                                }
                                            } catch (error) {
                                                console.warn('Date parsing error:', error, 'for value:', run.execution_date || run.Execution_Date);
                                                return 'Invalid date';
                                            }
                                        })()
                                        : 'N/A'
                                }</TableCell>
                                <TableCell>{run.result || run.Result}</TableCell>
                                <TableCell>{run.observed_time || run.Observed_Time}</TableCell>
                                <TableCell>{run.executed_by || run.Executed_By}</TableCell>
                                <TableCell>{run.remarks || run.Remarks}</TableCell>
                            </TableRow>
                        ))}
                        {filteredRuns.length === 0 && filterValue && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No test runs found matching the filter.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination and Rows per page controls */}
            {filteredRuns.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                        Showing {filteredRuns.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredRuns.length)} of {filteredRuns.length} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                            <InputLabel id="tr-rows-per-page-label">Rows</InputLabel>
                            <Select
                                labelId="tr-rows-per-page-label"
                                id="tr-rows-per-page-select"
                                value={rowsPerPage}
                                label="Rows"
                                onChange={handleChangeRowsPerPage}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                        {filteredRuns.length > rowsPerPage && (
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                size="small"
                            />
                        )}
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

export default TestRuns;